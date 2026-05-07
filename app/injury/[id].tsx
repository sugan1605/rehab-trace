import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useRehabEntries } from "@/src/hooks/useRehabEntries";
import {
  getPainLevelColor,
  getStatusThemeColor,
  getTemperatureColor,
} from "@/src/utils/injuryColorHelpers";

import { DeleteConfirmModal } from "@/src/components/modals/DeleteConfirmModal";
import { EditInjuryModal } from "@/src/components/modals/EditInjuryModal";

export default function InjuryDetails() {
  const { id } = useLocalSearchParams(); // henter ID fra URL-en (f.eks. /injury/123)
  const { entries, deleteEntry } = useRehabEntries();
  const router = useRouter();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  // finn den spesifikke skaden i listen basert på ID fra URL
  const entry = entries.find((e) => e.id === id);

  // Fallback hvis ID-en ikke finnes eller dataen ikke er lastet ennå
  if (!entry) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Fant ikke registreringen</Text>
      </View>
    );
  }

  // håndterer sletting og sender brukeren tilbake til oversikten
  const onConfirmDelete = async () => {
    const result = await deleteEntry(id as string);
    if (result.success) {
      setDeleteVisible(false);
      router.replace("/(tabs)");
    }
  };

  // formaterer datoen til norsk std
  const dateString = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString("nb-NO")
    : "Dato mangler";

  return (
    <SafeAreaView className="flex-1 bg-screen-light" edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: entry.bodyPart,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="ml-1 p-2"
            >
              <Ionicons name="chevron-back" size={28} color="#00ACC1" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* viser bildet som ble lastet opp til Firebase Storage */}
        <Image
          source={{ uri: entry.imageUrl }}
          className="w-full h-72 rounded-3xl my-6"
          resizeMode="cover"
        />

        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-3xl font-bold text-text-light">
                {entry.bodyPart}
              </Text>
              <Text className="text-text-light-muted">{dateString}</Text>
            </View>

            {/*status-badge med farge fra helperfunksjon */}
            <View
              style={{ backgroundColor: getStatusThemeColor(entry.status) }}
              className="px-4 py-1 rounded-full"
            >
              <Text className="text-white font-bold text-xs uppercase">
                {entry.status}
              </Text>
            </View>
          </View>

          {/*oppsummering av nøkkelinfo: Temperatur og Smerte */}

          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 p-4 rounded-2xl bg-gray-50 items-center">
              <Ionicons
                name="thermometer-outline"
                size={24}
                color={getTemperatureColor(entry.temperature || "Normal")}
              />
              <Text className="font-bold text-lg mt-1">
                {entry.temperature || "Normal"}
              </Text>
              <Text className="text-xs text-gray-400 uppercase">Temp</Text>
            </View>

            <View className="flex-1 p-4 rounded-2xl bg-gray-50 items-center">
              <Text
                style={{ color: getPainLevelColor(entry.painLevel) }}
                className="font-bold text-2xl"
              >
                {entry.painLevel}/10
              </Text>
              <Text className="text-xs text-gray-400 uppercase mt-1">
                Smerte
              </Text>
            </View>
          </View>

          <Text className="text-lg font-semibold mb-2 text-text-light">
            Beskrivelse av skadeomfanget
          </Text>
          <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
            <Text className="text-text-light leading-6 italic">
              {entry.note ? `"${entry.note}"` : "Ingen notater lagt til."}
            </Text>
          </View>
          {/* handlingsknapper for redigering og sletting */}
          <View className="flex-row gap-3 pt-4 border-t border-gray-100">
            <TouchableOpacity
              onPress={() => setEditVisible(true)}
              className="flex-1 flex-row items-center justify-center bg-primary-50 p-3 rounded-xl"
            >
              <Ionicons name="create-outline" size={20} color="#00ACC1" />
              <Text className="ml-2 font-semibold text-primary-600">Endre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeleteVisible(true)}
              className="flex-1 flex-row items-center justify-center bg-red-50 p-3 rounded-xl"
            >
              <Ionicons name="trash-outline" size={20} color="#D32F2F" />
              <Text className="ml-2 font-semibold text-red-600">Slett</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/*importete modaler fra components for å holde logikken separert fra hovedvisningen */}

      <DeleteConfirmModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onConfirm={onConfirmDelete}
      />

      <EditInjuryModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        entry={entry}
      />
    </SafeAreaView>
  );
}
