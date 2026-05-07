import { Stack } from "expo-router";

export default function InjuryLayout() {
  //* aktiverer header for alle undersider i injury-mappen, slik at vi automatisk får med en tilbake-knapp */
  return <Stack screenOptions={{ headerShown: true }} />;
}
