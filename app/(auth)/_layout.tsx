import { Stack } from "expo-router";

// layout for autentisering login / sign-up
export default function AuthLayout() {

  // console.log("Laster AuthLayout...")  // sjekke om den mountes
  return(
  <Stack
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      fullScreenGestureEnabled: true,
      gestureDirection: "horizontal",
    }}
  />
  )
}
