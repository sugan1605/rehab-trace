// Bruker denne for at de som har opprettet profil kan logge inn med e-post og password

import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthProvider";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

export default function Login() {
  const router = useRouter();
  const { signInEmail } = useAuth(); // Henter innlogging fra min authprovider

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // console.log("Forsøker innlogging for:", email"); //sjekker at knappen trigger
    if (!email || !password) {
      //console.log("Valideringsfeil: mangler input");
      Alert.alert("Feil", "Vennligst fyll ut både e-post og password.");
      return;
    }

    setLoading(true);

    try {
      // console.log("utfører innlogging i FB");
      await signInEmail(email, password); //Utfører innlogging i Firebase
      // console.log("loggin vellykket, sender bruker til oversikt");
      router.replace("/(tabs)");
    } catch (error: any) {
      // console.error("firebase auth error:", error.message);
      Alert.alert("Innloggingsfeil", "Feil e-post eller password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-screen-light dark:bg-screen-dark">
      <View className="flex-1 px-8 pt-12">
        <Text className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
          Velkommen tilbake
        </Text>
        <Text className="text-text-light-muted dark:text-text-dark-muted mb-8">
          Logg inn for å se dine lagrede skader.
        </Text>

        <View className="gap-y-4">
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
            placeholder="Skriv inn passord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title="Logg inn"
            onPress={handleLogin}
            loading={loading}
            className="mt-4"
          />
          <Button
            title="Tilbake"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
