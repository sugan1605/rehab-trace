import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import cn from "@/src/utils/cn";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
}

export const Button = ({
  title,
  loading,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  /*denne variablen er definert, men brukes ikke i nåværende logikk, skal evt integreres i "cn" hvis jeg vil ha faste tema-varianter */
  const variants = {
    primary: "bg-ghost-light dark:bg-ghost-dark",
  };
  return (
    <TouchableOpacity
      //Deaktiverer knappen automatisk ved loading for å hindre doble klikk
      disabled={loading || props.disabled}
      className={cn(
        "p-4 rounded-2xl items-center justify-center flex-row shadow-sm",
        //betinget styling basert på valgt variant
        variant === "primary" && "bg-primary-500",
        variant === "ghost" && "bg-transparent border border-primary-500",
        //tillater overstyring av stil via className-prop
        className,
        //legger på litt gjennomsiktighet når knappen er deaktivert / laster
        (loading || props.disabled) && "opacity-50",
      )}
      {...props}
    >
      {loading ? (
        //Viser spinner i stedet for tekst når en handling pågår
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={cn(
            "font-bold text-lg",
            //sørger for riktig kontrastfarge på teksten på bakgrunnen
            variant === "primary" ? "text-white" : "text-primary-500",
          )}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
