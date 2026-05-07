import { TextInput, View, Text, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <View className=" w-full mb-4">
      {/*Viser label over feltet hvis den er sendt med som prop */}
      {label && (
        <Text className="text-text-light dark:text-text-dark font-semibold mb-2 ml-1">
          {label}
        </Text>
      )}
      <TextInput
        // bruker standard farge for placeholder hvis ingenting annet er spesifisert
        placeholderTextColor={props.placeholderTextColor || "#94A3B8"}
        // bytter farge til rød, hvis det finnes en feilmelding
        className={`w-full h-14 px-4 rounded-xl border bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark ${error ? "border-danger" : "border-primary-100 dark:border-primary-900/30"} ${className}`}
        {...props}
      />

      {/*viser feilmeldingen i rød tekst rett under feltet */}
      {error && <Text className="text-danger text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
};
