import { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthProvider";
import { OversiktSkade } from "../types/models";

// setter opp sanntids lytter mot Firestore med filtrering på userId
export function useRehabEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<OversiktSkade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //håndterer tidsstempel og sikrer fallback ved server-latens

  useEffect(() => {
    if (!user) return;
    // definerer spørring: henter kun brukerens egne skader sortert på tid
    const q = query(
      collection(db, "injuries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    // snapshotlistner for automatiske UI-oppdateringer ved db endringer,mao abonnerer den på endringer som skjer i db

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Konverterer Firestore timestamp til JS Data-objekt med fallback (new Date()) hvis serveren ikke har rukket å sette datoen
        const dateObj = data.createdAt?.toDate() || new Date();

        return {
          id: doc.id,
          ...data,
          timestamp: dateObj.getTime(),
          createdAt: dateObj.toISOString(),
        };
      }) as OversiktSkade[];

      setEntries(docs);
      setLoading(false);
    });

    return () => unsubscribe(); // Rydder opp listeneren ved unmount
  }, [user]);
  // funksjonern for å lagre en ny skade med både tekst og bilde
  const addEntry = async (
    data: Partial<OversiktSkade>,
    localImageUri?: string | null,
  ) => {
    if (!user) throw new Error("Ingen aktiv bruker funnet");
    setIsSubmitting(true);

    try {
      let finalImageUrl = "";

      // håndterer filopplasting til fb storage hvis bilde er valgt
      //konverterer lokal bildeURI til blob for opplasting til Firebase Storage fordi uploadBytes krever dette på mobil
      if (localImageUri) {
        const storage = getStorage();

  

        const blob: any = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = () => reject(new TypeError("Network request failed"));
          xhr.responseType = "blob";
          xhr.open("GET", localImageUri, true);
          xhr.send(null);
        });
        // lager en unik sti basert på bruker-ID og tidsstempel
        const fileRef = ref(storage, `injuries/${user.uid}/${Date.now()}.jpg`);
        await uploadBytes(fileRef, blob);
        blob.close(); //frigjør minne med en gang bildet er lastet opp
        finalImageUrl = await getDownloadURL(fileRef);
      }

      //lagrer hele objektet til Firestore
      await addDoc(collection(db, "injuries"), {
        ...data,
        imageUrl: finalImageUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Lagringsfeil:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };
  //oppdaterer eksisterende dokument i Firestore
  const updateEntry = async (
    entryId: string,
    updatedData: Partial<OversiktSkade>,
  ) => {
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "injuries", entryId);
      await updateDoc(docRef, updatedData);
      return { success: true };
    } catch (error) {
      console.error("Oppdateringsfeil:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  // sletter en registrering permanent
  const deleteEntry = async (entryId: string) => {
    try {
      await deleteDoc(doc(db, "injuries", entryId));
      return { success: true };
    } catch (error) {
      console.error("Feil ved sletting:", error);
      return { success: false, error };
    }
  };

  return { entries, loading, isSubmitting, addEntry, updateEntry, deleteEntry };
}
