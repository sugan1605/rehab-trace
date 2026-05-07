import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthProvider";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

export default function SignUp() {
  const router = useRouter();
  const { signUpEmail } = useAuth(); // kobling til min AuthProvider (Firebase)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // console.log("Registreringsforsøk startet..."); // Sjekker at knappen responderer

    if (!email || !password || !confirmPassword) {
      // console.log("valideringsfeil: tomme felt");
      Alert.alert("Mangler info", "Vennligst fyll ut alle feltene.");
      return;
    }

    if (password !== confirmPassword) {
      // console.log("valideringsfeil: passordene matcher ikke");
      Alert.alert("Feil", "Passordene er ikke like.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Svakt passord",
        "Passordet må ha minst 6 tegn for Firebase.",
      );
      return;
    }

    setLoading(true);
    try {
      // console.log("Sender data til AuthProvider...");
      await signUpEmail(email, password);

      // console.log("Bruker opprettet! Navigerer til oversikt...");
      router.replace("/(tabs)");
    } catch (error: any) {
      // console.error("Feil ved registrering:", error.message);
      Alert.alert(
        "Registrering feilet",
        "Kunne ikke opprette profil. E-posten kan være i bruk.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-screen-light" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-8 pt-12"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text className="text-4xl font-bold text-text-light mb-2">
            Opprett profil
          </Text>
          <Text className="text-text-light-muted mb-10 text-lg">
            Start din rehab i dag.
          </Text>

          <View className="gap-y-6">
            <Input
              label="E-post"
              placeholder="din@epost.no"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Passord"
              placeholder="Velg et sterkt passord"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Input
              label="Bekreft passord"
              placeholder="Gjenta passordet"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View className="gap-y-4 mt-8">
              <Button
                title="Opprett bruker"
                onPress={handleSignUp}
                loading={loading}
                className="h-16 rounded-2xl"
              />

              <Button
                title="Har du allerede en bruker? Logg inn"
                variant="ghost"
                onPress={() => {
                  // console.log("Går til login");
                  router.push("/(auth)/login");
                }}
                className="h-14"
              />

              <Button
                title="Tilbake til start"
                variant="ghost"
                onPress={() => router.replace("/(auth)")}
                className="h-14"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
