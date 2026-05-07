import { View } from "react-native";
import cn from "@/src/utils/cn";

export const Divider = ({ className }: { className?: string }) => {
  return (
    <View
      className={cn(
        // setter en tynn linje på 1px som tilpasser seg lys/mørk modus. "opacity-50" sørger for at den forblir subtil og ikke dominerer skjermen
        "h-[1px] w-full bg-gray-200 dark:bg-gray-800 my-4 opacity-50",
        className,
      )}
    ></View>
  );
};
