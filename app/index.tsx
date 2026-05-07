import { Redirect } from "expo-router";

//*sender brukeren direkte til auth ved oppstart. _layout.tsx vuk deretter vurdere om de skal videre til /(tabs), hvis de allerede er logget inn. */

export default function Index() {
  return <Redirect href="/(auth)" />;
}
