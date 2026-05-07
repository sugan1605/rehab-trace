//*til senere implementasjon av profilside hvor brukeren kan lagre ting som ikke finnes i firebase auth, per nå
// bruker jeg den innebygde user-typen fra firebase i stedet den manuelle som jeg har laget her. 

export interface Userprofile {
  uid: string;
  email: string | null;
  displayName: string;
  imageURL: string;
  createdAt: string;
  lastLogin: string;
}
