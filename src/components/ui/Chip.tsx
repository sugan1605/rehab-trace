import { Text, TouchableOpacity } from "react-native";
import cn from "@/src/utils/cn";

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  className?: string;
}

export const Chip = ({ label, selected, onPress, className }: ChipProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7} // Gir en diskret visuell feedback når man trykker
      className={cn(
        "px-4 py-2 rounded-full mr-2 mb-2 border", // Bytter mellom fylt bakgrunn og gjennomsiktig basert på "selected" state
        selected
          ? "bg-primary-500 border-primary-500"
          : "bg-transparent border-primary-400/30",
        className,
      )}
    >
      <Text
        className={cn(
          "font-medium",
          // sørger for at teksten alltid har god kontrast mot bakgrunnen
          selected ? "text-white" : "text-primary-500",
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
