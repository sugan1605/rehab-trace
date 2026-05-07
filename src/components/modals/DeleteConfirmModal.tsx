import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

// Her bruker jeg const og ikke default for å sikre konsekvent import i hele prosjektet
export const DeleteConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title = "Slette loggføring?",
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="w-full bg-white dark:bg-surface-dark rounded-3xl p-8 items-center shadow-xl">
          <View className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center mb-4">
            <Ionicons name="trash-outline" size={32} color="#D32F2F" />
          </View>

          <Text className="text-2xl font-bold text-text-light dark:text-text-dark mb-2 text-center">
            {title}
          </Text>

          <Text className="text-text-light-muted dark:text-text-dark-muted text-center mb-8 text-lg">
            Dette kan ikke angres. Er du sikker på at du vil fjerne denne
            registreringen?
          </Text>
          {/**handlingsknapper plassert ved siden av hverandre for enkel tommel-navigasjon  */}
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
              <Text className="font-semibold text-white">Slett</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
