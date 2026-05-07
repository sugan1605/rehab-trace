import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { auth } from "@/src/lib/firebase";
import { SkadeStatus } from "@/src/types/models";

// denne funksjonen sammenligner dagens smerte med forrige lagrede måling i Firestore
export const calculatePainStatus = async (
  location: string,
  currentPain: number,
) => {
  const user = auth.currentUser;

  //sjekker at vi faktisk har en bruker å hente historikk for
  if (!user) throw new Error("auth-missing"); // Kaster spesifikk feil for gjester

  try {


    const q = query(
      collection(db, "injuries"),
      where("userId", "==", user.uid),
      where("bodyPart", "==", location),
      orderBy("createdAt", "desc"),
      limit(1),
    );

    const snapshot = await getDocs(q);
    // hvis brukeren aldri har logget denne kroppsdelen før, har vi ingen referansepunkt
    if (snapshot.empty) {
      return {
        status: "stabil" as SkadeStatus,
        note: "Første registrering for dette området. Status satt til stabil.",
      };
    }

    const lastEntry = snapshot.docs[0].data();
    const lastPain = lastEntry.painLevel;

    //sammenligningslogikk: lavere tall = bedring, høyre tall = forverring
    if (currentPain < lastPain) {
      return {
        status: "forbedres" as SkadeStatus,
        note: `Smertenivået har sunket fra ${lastPain} til ${currentPain}. Dette tyder på bedring.`,
      };
    } else if (currentPain > lastPain) {
      return {
        status: "forverres" as SkadeStatus,
        note: `Smertenivået har økt fra ${lastPain} til ${currentPain}. Tilstanden er forverret.`,
      };
    } else {
      return {
        status: "stabil" as SkadeStatus,
        note: `Smertenivået er uendret på ${currentPain}. Tilstanden er stabil.`,
      };
    }
  } catch (error) {
    console.error("Firestore error:", error);
    throw error;
  }
};
