import { View, ViewProps, Pressable } from "react-native";
import cn from "@/src/utils/cn";

interface CardProps extends ViewProps {
  onPress?: () => void;
  children: React.ReactNode;
}

export const Card = ({ children, className, onPress, ...props }: CardProps) => {
  // velger komponent basert på om kortet skal være trykkbart eller ikke. Med dette slipper vi unødvendige nestet views
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      // Bruker template literals for standard-styling, men her kunne man også brukt cn-helper for å sikre at overstyringer fungerer optimalt
      className={`bg-white dark:bg-card-dark rounded-2xl shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </Container>
  );
};
