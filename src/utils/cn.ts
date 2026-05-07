import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// målet med denne class name funksjonen er for å slå sammen tailwind-klasser på en trygg måte

export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
