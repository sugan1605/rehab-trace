import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthProvider";

export default function AuthIndex() {
  const router = useRouter();
  const { user, isGuest, logout, continueAsGuest } = useAuth();

  //console.log("Sjekker auth status på startskjerm", user ? "Innlogget" : "Utlogget");

  const isLoggedOut = !user;

  return (
    <SafeAreaView className="flex-1 bg-screen-light dark:bg-screen-dark">
      <View className="flex-1 px-8 justify-between py-16 items-center">
        <View className="items-center mt-10">
          <View className="w-24 h-24 bg-primary-500 rounded-3xl items-center justify-center shadow-lg mb-6 shadow-primary-500/50">
            <Text className="text-white text-5xl font-bold">R</Text>
          </View>
          <Text className="text-4xl font-extrabold text-text-light-DEFAULT dark:text-text-dark-DEFAULT tracking-tight">
            RehabTrace
          </Text>

          {/* tekst som tilpasser seg etter brukerstatus */}
          <Text className="text-text-light-muted dark:text-text-dark-muted text-center mt-3 text-lg px-4 leading-6">
            {isLoggedOut
              ? "Start din reise mot en smertefri hverdag"
              : isGuest
                ? "Du er nå logget inn som gjest."
                : "Velkommen tilbake!"}
          </Text>
        </View>

        <View className="gap-y-4 w-full mb-10">
          {!isLoggedOut && (
            <Button
              title="Gå til oversikten"
              onPress={
                //console.log("navigerer til oversikt..")
                () => router.replace("/(tabs)")}
              variant="primary"
              className="h-16 rounded-2xl"
            />
          )}

          {(isLoggedOut || isGuest) && (
            <Button
              title="Opprett profil med e-post"
              onPress={
                // registrering med e-post/password
                () => router.push("/(auth)/sign-up")}
              variant="primary"
              className="h-16 rounded-2xl shadow-md"
            />
          )}

          {isLoggedOut ? (
            <Button
              title="Fortsett som gjest"
              onPress={async () => {
                try {

                  //console.log("prøver gjestetilgang for raskere testing")
                  await continueAsGuest();
                } catch (error) {
                  console.error("Gjestetilgang feilet:", error);
                }
              }}
              variant="ghost"
              className="mt-2"
            />
          ) : (
            !isGuest && (
              <Button
                title="Logg ut"
                onPress={
                  // console.log("Logger ut bruker");
                  () => logout()}
                variant="ghost"
                className="mt-2"
              />
            )
          )}

          {(isLoggedOut || isGuest) && (
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              className="h-14 items-center justify-center rounded-2xl border border-primary-500/30 bg-primary-50/10"
            >
              <Text className="text-primary-600 dark:text-primary-400 font-semibold text-base">
                Har du allerede en bruker? Logg inn
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}