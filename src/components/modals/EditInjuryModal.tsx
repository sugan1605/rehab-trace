import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

import { useRehabEntries } from "@/src/hooks/useRehabEntries";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Skadelokasjon, SkadeStatus, OversiktSkade } from "@/src/types/models";
import { calculatePainStatus } from "@/src/utils/statusHelpers";
import { getTemperatureColor } from "@/src/utils/injuryColorHelpers";

interface EditInjuryModalProps {
  visible: boolean;
  onClose: () => void;
  entry: OversiktSkade;
}

export const EditInjuryModal = ({
  visible,
  onClose,
  entry,
}: EditInjuryModalProps) => {
  // state-variabler som holder på de redigerbare verdiene
  const { updateEntry, isSubmitting } = useRehabEntries();
  const [location, setLocation] = useState<Skadelokasjon>(
    entry?.bodyPart || "Kneet",
  );
  const [status, setStatus] = useState<SkadeStatus>(entry?.status || "stabil");
  const [painLevel, setPainLevel] = useState(
    entry?.painLevel?.toString() || "",
  );
  const [swelling, setSwelling] = useState(entry?.swelling || false);
  const [temperature, setTemperature] = useState(
    entry?.temperature || "Normal",
  );
  const [calculationNote, setCalculationNote] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  // synkroniserer lokale states med entry-data hver gang modalen åpnes
  useEffect(() => {
    if (entry && visible) {
      setLocation(entry.bodyPart);
      setStatus(entry.status);
      setPainLevel(
        entry.painLevel > 10 ? "10" : entry.painLevel?.toString() || "",
      );
      setSwelling(entry.swelling || false);
      setTemperature(entry.temperature || "Normal");
      setCalculationNote("");
    }
  }, [entry, visible]);

  // validerer at kun tall mellom 0-10 kan skrives inn i smertefeltet

  const handlePainChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      setPainLevel("");
      return;
    }
    const numericValue = parseInt(cleaned, 10);
    setPainLevel(numericValue > 10 ? "10" : numericValue.toString());
  };

  // kjører beregningsfunksjonen på nytt hvis brukeren endrer tallen under redigering
  const handleUpdateCalculate = async () => {
    setIsCalculating(true);
    try {
      const result = await calculatePainStatus(location, Number(painLevel));
      setStatus(result.status);
      setCalculationNote(result.note);
    } catch (error: any) {
      Alert.alert("Feil", "Kunne ikke oppdatere status.");
    } finally {
      setIsCalculating(false);
    }
  };

  // hjelpefunksjon for å gi knappene riktig farge basert på valgt status

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white dark:bg-surface-dark">
        <View className="flex-row justify-between items-center px-6 py-6 border-b border-gray-100">
          <Text className="text-xl font-bold">Rediger info</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#00ACC1" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-6 pt-6">
            <Text className="font-semibold mb-2">Lokasjon</Text>
            <View className="mb-6 bg-gray-50 rounded-xl border border-gray-200">
              <RNPickerSelect
                onValueChange={(val) => setLocation(val)}
                items={[
                  "Ankelen",
                  "Kneet",
                  "Skulderen",
                  "Lysken",
                  "Leggen",
                  "Låret",
                ].map((l) => ({ label: l, value: l, key: l }))}
                value={location}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    height: 56,
                    paddingHorizontal: 15,
                    color: "#000",
                  },
                  inputAndroid: {
                    fontSize: 16,
                    height: 56,
                    paddingHorizontal: 15,
                    color: "#000",
                  },
                }}
              />
            </View>

            <Text className="font-semibold mb-2">Smertenivå (0-10)</Text>
            <Input
              value={painLevel}
              onChangeText={handlePainChange}
              keyboardType="numeric"
              className="mb-6"
            />

            <Text className="font-semibold mb-2">Synlig hevelse?</Text>
            <View className="flex-row gap-3 mb-6">
              {[
                { label: "Ja", val: true },
                { label: "Nei", val: false },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => setSwelling(opt.val)}
                  className={`flex-1 p-3 rounded-xl items-center border ${swelling === opt.val ? "border-primary-500 bg-primary-50" : "border-gray-200"}`}
                >
                  <Text
                    className={`font-bold ${swelling === opt.val ? "text-primary-500" : "text-gray-400"}`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/**temp-valg med dynamisk farge fra helperfunksjon */}

            <Text className="font-semibold mb-2 text-text-light dark:text-text-dark">
              Temperatur
            </Text>
            <View className="flex-row gap-3 mb-6">
              {["Kald", "Normal", "Varm"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTemperature(t)}
                  className="flex-1 p-3 rounded-xl items-center border"
                  style={{
                    borderColor:
                      temperature === t ? getTemperatureColor(t) : "#E5E7EB",
                    backgroundColor:
                      temperature === t
                        ? `${getTemperatureColor(t)}10`
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        temperature === t ? getTemperatureColor(t) : "#9CA3AF",
                      fontWeight: "bold",
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/*knapp for å rekalkulere status baser på nye verdier */}
            <View className="mb-8 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100">
              <Button
                title={isCalculating ? "Beregner..." : "Oppdater status"}
                onPress={handleUpdateCalculate}
                variant="secondary"
              />
              {calculationNote ? (
                <Text className="text-sm italic mt-2">{calculationNote}</Text>
              ) : null}
            </View>
            {/* status-velger som oppdaterer Firestore-verdien */}
            <View className="flex-row gap-2 mb-8">
              {["forbedres", "stabil", "forverres"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s as SkadeStatus)}
                  className={`flex-1 p-3 rounded-xl items-center ${getStatusStyle(s as SkadeStatus)}`}
                >
                  <Text
                    className={
                      status === s ? "text-white font-bold" : "text-gray-500"
                    }
                  >
                    {s === "forbedres"
                      ? "Bedring"
                      : s === "forverres"
                        ? "Verre"
                        : "Stabil"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Lagre endringer"
              onPress={async () => {
                if (!painLevel || !location || !status) {
                  Alert.alert(
                    "Mangler info",
                    "Fyll ut alle nødvendige felt før du lagrer.",
                  );
                  return;
                }
                // oppdaterer dokumentet i Firebase og lukker modalen ved suksess
                await updateEntry(entry.id, {
                  bodyPart: location,
                  status,
                  painLevel: Number(painLevel),
                  swelling,
                  temperature,
                  note: calculationNote || entry.note,
                });
                onClose();
              }}
              loading={isSubmitting}
              className="mb-10 h-14"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
