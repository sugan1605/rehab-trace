import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useRehabEntries } from "@/src/hooks/useRehabEntries";
import { Skadelokasjon, SkadeStatus } from "@/src/types/models";
import { getTemperatureColor } from "@/src/utils/injuryColorHelpers";
import { calculatePainStatus } from "@/src/utils/statusHelpers";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";

export default function NewEntry() {
  const router = useRouter();
  const { addEntry, isSubmitting } = useRehabEntries();

  // state-håndtering
  const [location, setLocation] = useState<Skadelokasjon>("Kneet");
  const [status, setStatus] = useState<SkadeStatus>("stabil");
  const [painLevel, setPainLevel] = useState("");
  const [swelling, setSwelling] = useState(false);
  const [temperature, setTemperature] = useState("Normal");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [calculationNote, setCalculationNote] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const locations: Skadelokasjon[] = [
    "Ankelen",
    "Kneet",
    "Skulderen",
    "Lysken",
    "Leggen",
    "Låret",
  ];

  const temps = ["Kald", "Normal", "Varm"];

  const statuses: { label: string; value: SkadeStatus; icon: string }[] = [
    { label: "Bedring", value: "forbedres", icon: "trending-down-outline" },
    { label: "Stabil", value: "stabil", icon: "remove-outline" },
    { label: "Verre", value: "forverres", icon: "trending-up-outline" },
  ];

  // regex validering for numerisk input (0-10)
  const handlePainChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      setPainLevel("");
      return;
    }
    const numericValue = parseInt(cleaned, 10);
    setPainLevel(numericValue > 10 ? "10" : numericValue.toString());
  };

  // trigger for regelbasert motor som sammenligner mot datahistorikk
  const handleCalculate = async () => {
    if (!painLevel || !location) {
      Alert.alert("Mangler info", "Velg lokasjon og smertenivå først.");
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculatePainStatus(location, Number(painLevel));
      setStatus(result.status);
      setCalculationNote(result.note);
    } catch (error: any) {
      Alert.alert("Feil", "Kunne ikke hente historikk.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Hjelpefunksjon for betinget styling av status-kort
  const getStatusStyle = (s: SkadeStatus) => {
    if (status !== s) return "bg-gray-100 dark:bg-gray-800";
    switch (s) {
      case "forbedres":
        return "bg-green-500";
      case "stabil":
        return "bg-primary-500";
      case "forverres":
        return "bg-red-500";
      default:
        return "bg-primary-500";
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-screen-light dark:bg-screen-dark"
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-3xl font-bold mb-6 text-text-light dark:text-text-dark">
            Ny registrering
          </Text>

          {/* ImagePicker - sjekker 'image' før rendering for å unngå tom streng-advarsel */}
          <TouchableOpacity
            onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 3],
              });
              if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
              }
            }}
            className="mb-8 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 h-48 justify-center items-center bg-surface-light dark:bg-surface-dark"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Ionicons name="camera-outline" size={40} color="#0097A7" />
                <Text className="text-text-light-muted mt-2">
                  Legg til bilde
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">
            Hvor sitter skaden?
          </Text>
          <View className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-primary-100">
            <RNPickerSelect
              onValueChange={(val) => setLocation(val)}
              items={locations.map((l) => ({ label: l, value: l, key: l }))}
              value={location}
              useNativeAndroidPickerStyle={false}
              placeholder={{}}
              /* spesifikk styling for Picker for å sikre at tekst er synlig 
                 og at feltet har riktig høyde på tvers av plattformer */
              style={{
                inputIOS: {
                  fontSize: 16,
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  color: "#1A1A1A",
                  height: 56,
                },
                inputAndroid: {
                  fontSize: 16,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  color: "#1A1A1A",
                  height: 56,
                  paddingRight: 40,
                },
                iconContainer: {
                  top: 18,
                  right: 15,
                },
              }}
              // legger til ikon for å indikere at feltet er en nedtrekksmeny
              Icon={() => {
                return (
                  <Ionicons name="chevron-down" size={20} color="#94A3B8" />
                );
              }}
            />
          </View>

          <Text className="text-lg font-semibold mb-3">Smertenivå (0-10)</Text>
          <Input
            placeholder="F.eks. 5"
            keyboardType="numeric"
            value={painLevel}
            onChangeText={handlePainChange}
            className="mb-6"
          />

          <Text className="text-lg font-semibold mb-3">Synlig hevelse?</Text>
          <View className="flex-row gap-3 mb-8">
            {[
              { label: "Ja", val: true },
              { label: "Nei", val: false },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.label}
                onPress={() => setSwelling(opt.val)}
                className={`flex-1 p-4 rounded-2xl items-center border ${
                  swelling === opt.val
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200"
                }`}
              >
                <Text
                  className={`font-bold ${swelling === opt.val ? "text-primary-500" : "text-gray-400"}`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-lg font-semibold mb-3">
            Temperatur i området
          </Text>
          <View className="flex-row gap-3 mb-8">
            {temps.map((t) => {
              const activeColor = getTemperatureColor(t);
              const isActive = temperature === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTemperature(t)}
                  className="flex-1 p-4 rounded-2xl items-center border"
                  style={{
                    borderColor: isActive ? activeColor : "#E5E7EB",
                    backgroundColor: isActive
                      ? `${activeColor}10`
                      : "transparent",
                  }}
                >
                  <Ionicons
                    name="thermometer-outline"
                    size={24}
                    color={isActive ? activeColor : "#9CA3AF"}
                  />
                  <Text
                    className="font-bold mt-1"
                    style={{ color: isActive ? activeColor : "#9CA3AF" }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* beregningsblokk, foreslår status basert på historikk  */}
          <View className="mb-8 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100">
            <Button
              title={isCalculating ? "Beregner..." : "Beregn status"}
              onPress={handleCalculate}
              variant="secondary"
              className="mb-3"
            />
            <Text
              className={
                // viser enten det beregnede resultatet eller en hjelpetekst til brukeren
                calculationNote
                  ? "text-sm italic text-primary-800"
                  : "text-xs text-gray-400"
              }
            >
              {calculationNote ||
                "Fyll ut felt for å beregne status basert på historikk."}
            </Text>
          </View>

          <Text className="text-lg font-semibold mb-3">Valgt Status</Text>
          <View className="flex-row gap-2 mb-10">
            {statuses.map((s) => (
              <TouchableOpacity
                key={s.value}
                onPress={() => setStatus(s.value)}
                className={`flex-1 p-4 rounded-xl items-center ${getStatusStyle(s.value)}`}
              >
                <Ionicons
                  name={s.icon as any}
                  size={20}
                  color={status === s.value ? "white" : "#9CA3AF"}
                />
                <Text
                  className={`text-xs mt-1 ${status === s.value ? "text-white font-bold" : "text-gray-500"}`}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            placeholder="Notater..."
            value={note}
            onChangeText={setNote}
            multiline
            className="mb-8 h-24 pt-3"
          />

          <Button
            title="Lagre oppføring"
            onPress={async () => {
              if (!painLevel || !location || !status) {
                Alert.alert(
                  "Mangler info",
                  "Fyll ut lokasjon, smertenivå og status før du lagrer.",
                );
                return;
              }
              const res = await addEntry(
                {
                  bodyPart: location,
                  status,
                  painLevel: Number(painLevel),
                  swelling,
                  temperature,
                  note: calculationNote || note,
                },
                image,
              );
              if (res.success) router.replace("/(tabs)");
            }}
            loading={isSubmitting}
            className="h-14 mb-10"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
