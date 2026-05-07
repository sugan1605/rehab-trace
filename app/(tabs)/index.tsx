import React, { useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import {
  getPainLevelColor,
  getStatusThemeColor,
} from "@/src/utils/injuryColorHelpers";
import { useRehabEntries } from "@/src/hooks/useRehabEntries";
import { LogoutModal } from "@/src/components/modals/LogoutModal";

export default function HomeIndex() {
  //henter data via min custom hook som er koblet med Firebase
  const router = useRouter();
  const { entries, loading } = useRehabEntries();
  const { logout } = useAuth();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  // console.log("oversikt lastet: Antall skader funnet:", entries.length);
  const handleConfirmLogout = async () => {
    try {
      setIsLogoutModalVisible(false);
      await logout();
    } catch (error) {
      //console.error("Logg ut feilet:", error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-screen-light dark:bg-screen-dark"
      edges={["top"]}
    >
      <ScrollView
        className="flex-1 bg-screen-light dark:bg-screen-dark"
        contentContainerStyle={{ padding: 24, paddingTop: 20 }}
      >
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-text-light-muted dark:text-text-dark/60 text-lg">
              Velkommen tilbake,
            </Text>
            <Text className="text-3xl font-bold text-text-light dark:text-text-dark">
              Din Oversikt
            </Text>
          </View>

          {/*Knapp for å endre mellom dark / light */}
          <ThemeToggle />

          <TouchableOpacity
            onPress={() => setIsLogoutModalVisible(true)}
            className="w-12 h-12 items-center justify-center rounded-2xl bg-surface-light dark:bg-surface-dark shadow-cardShadow"
          >
            <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00ACC1" />
        ) : entries.length === 0 ? (
          //Vises hvis db er tom, og hjelper brukeren i gang
          <Card className="items-center py-12 bg-surface-light dark:bg-surface-dark border-none shadow-cardShadow rounded-xl">
            <View className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-full mb-6">
              <Ionicons name="medical-outline" size={48} color="#00ACC1" />
            </View>
            <Text className="text-text-light dark:text-text-dark text-center mb-6 opacity-80 leading-6">
              Du har ingen registrerte skader enda. Start din rehablitering ved
              å legge til den første.
            </Text>
            <Button
              title="Registrer ny skade"
              onPress={() => router.push("/(tabs)/new-entry")}
              className="w-full"
            />
          </Card>
        ) : (
          <View className="gap-y-4">
            {/*oversikt over alle registrerte skadeoppføringer */}
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="flex-row items-center p-3 bg-surface-light dark:bg-surface-dark border-none shadow-cardShadow rounded-xl"
                onPress={
                  // console.log("Går til detaljer for id:", entry.id);
                  () => router.push(`/injury/${entry.id}`)
                }
              >
                <View className="w-20 h-20 rounded-xl bg-primary-50 dark:bg-primary-900/20 overflow-hidden mr-4 border border-gray-100 dark:border-gray-800">
                  {entry.imageUrl ? (
                    <Image
                      source={{ uri: entry.imageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 justify-center items-center">
                      <Ionicons
                        name="fitness-outline"
                        size={28}
                        color="#00ACC1"
                      />
                    </View>
                  )}
                </View>

                <View className="flex-1 justify-center">
                  <Text className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
                    {entry.bodyPart}
                  </Text>

                  <View className="flex-row items-center">
                    {/*bruker hjelpefunksjonen for å fargekode status */}
                    <View
                      className="w-2.5 h-2.5 rounded-full mr-2"
                      style={{
                        backgroundColor: getPainLevelColor(entry.painLevel),
                      }}
                    />
                    <Text className="text-text-light-muted dark:text-text-dark-muted text-sm font-medium">
                      Smerte: {entry.painLevel}/10 •
                    </Text>
                    {/*viser dynamisk status beregnet ut fra smertenivå og historikk */}
                    <Text
                      className="text-sm font-bold ml-1 uppercase text-[10px]"
                      style={{ color: getStatusThemeColor(entry.status) }}
                    >
                      {entry.status}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#00ACC1"
                  className="ml-2"
                />
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <LogoutModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleConfirmLogout}
      />
    </SafeAreaView>
  );
}
