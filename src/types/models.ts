
//definert faste strenger for skadelokasjoner for å sikre konsistent data
export type Skadelokasjon =
  | "Ankelen"
  | "Kneet"
  | "Skulderen"
  | "Lysken"
  | "Leggen"
  | "Låret";

  //status-typene som brukes av både beregningsmotoren og UI-elementene
export type SkadeStatus = "forbedres" | "stabil" | "forverres";

// hovedmodellen for en skaderegistrering. Denne brukes i lister (oversikt), detaljvisning og ved redigering
export type OversiktSkade = {
  id: string; // Dokument-ID fra Firestore
  name: string;
  bodyPart: Skadelokasjon;
  status: SkadeStatus;
  painLevel: number; //numerisk verdi 0-10
  imageUrl: string; // URL til bildet i Firebase Storage
  
  // tidshåndtering: jeg lagrer både unix-timestamp for sortering og ISO-streng for visning
  timestamp: number;
  createdAt: string;

  // valgfrie felt som ikke alltid er med i hver registrering
  bevegelighet?: boolean;
  swelling?: boolean; // sjekker om området er hovent
  temperature?: string; // "kald", "normal", "varm"
  beskrivelse?: string;
  note?: string; // her havner notatet fra beregningsmotoren
  location?: { lat: number; lng: number }; //gps-koordinater hvis aktuelt
};