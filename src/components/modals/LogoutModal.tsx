import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({
  visible,
  onClose,
  onConfirm,
}: LogoutModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/*overlay som dimmer ut bakgrunnen for å holde fokus på logg-ut valget */}
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        {/*modalbeholderen med støtte for både lyst og mørkt tema */}
        <View className="w-full bg-white dark:bg-surface-dark rounded-3xl p-8 items-center shadow-xl">
          {/*ikon som gir umiddelbar visuell indikasjon på handlingen */}
          <View className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center mb-4">
            <Ionicons name="log-out-outline" size={32} color="#D32F2F" />
          </View>

          <Text className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
            Logg ut?
          </Text>

          <Text className="text-text-light-muted dark:text-text-dark-muted text-center mb-8 text-lg">
            Er du sikker på at du vil logge ut av RehabTrace?
          </Text>

          {/*btnrad for bekreftelse eller avbrytelse */}
          <View className="flex-row gap-x-4 w-full">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 h-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800"
            >
              <Text className="font-semibold text-gray-600 dark:text-gray-300">
                Avbryt
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 h-14 items-center justify-center rounded-2xl bg-red-600"
            >
              <Text className="font-semibold text-white">Logg ut</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
