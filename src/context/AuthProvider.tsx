import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/src/lib/firebase";

type AuthCtx = {
  user: User | null;
  isGuest: boolean;
  loading: boolean;

  continueAsGuest: () => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  linkGuestToEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // lytter på endringer i autentiseringstilstan (innlogging/utlogging) med engang komponenten mountes.
  useEffect(() => {
    //onAuthStateChanged lytter på FB og gir oss "u"/ brukeren
    const unsub = onAuthStateChanged(auth, (u) => {
      //console.log("auth state endret. Bruker:", u ? u.uid : "ingen bruker")
      setUser(u);
      setLoading(false);
    });
    return () => unsub(); // rydder opp lytteren når komponenten unmountes
  }, []);

  // bruker useMemo for å unngå unødvendige re-renders av hele app-treet, hver gang loading-tilstanden endres minimalt
  const value = useMemo<AuthCtx>(() => {
    // sjekker om brukeren er logget inn anonymt (som gjest)
    const isGuest = !!user?.isAnonymous;

    return {
      user,
      isGuest,
      loading,

      //lar brukeren starte appen uten å lage profil med en gang, aka anonym sesjon
      continueAsGuest: async () => {
        try {
          if (!auth.currentUser) {
            //console.log("starter gjestesessjon...")
            await signInAnonymously(auth);
          }
        } catch (error) {
          //console.error("feil ved gjesteinnlogging", error);
        }
      },
      // oppretter en helt ny brukerkonto med e-post og passord
      signUpEmail: async (email, password) => {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
          //console.error("Feil ved registrering:", error);
          //throw error;
        }
      },
      // logger inn en eksisterende bruker
      signInEmail: async (email, password) => {
        try {
          //console.log("logger inn bruker:", email);
          await signInWithEmailAndPassword(auth, email, password);
        } catch {
          //console.error("feil ved innlogging:", error);
          // throw error;
        }
      },

      // kobler gjest til e-post
      linkGuestToEmail: async (email, password) => {
        const u = auth.currentUser;
        if (!u) throw new Error("No current user");

        if (!u.isAnonymous) throw new Error("Current user is not a guest");
        try {
          //console.log("kobler gjestekonto til:", email);
          const cred = EmailAuthProvider.credential(email, password);
          await linkWithCredential(u, cred);
          //console.log("kontotilkobling vellykket!")
        } catch (error) {
          //console.error("feil ved kobling av konto:", error);
          //throw error;
        }
      },

      // logger brukeren helt ut av firebase-instansen

      logout: async () => {
        try {
          //console.log("logger ut bruker!:", user?.uid);
          await signOut(auth);
        } catch (error) {
          //console.error("feil ved utlogging:", error);
        }
      },
    };
  }, [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// custom hook for å enkelt hente ut brukerinfo og auth-funksjoner i komponenter
export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
