import { createContext } from "react";

interface BackgroundContextType {
  backgrounds: Record<string, { image: string; invertTextColor: boolean }> | undefined;
  setBackground: (zipCode: string, background: { image: string; invertTextColor: boolean }) => void;
  backgroundUpdated: boolean;
  setBackgroundUpdated: (updated: boolean) => void;
}

export const BackgroundContext = createContext<BackgroundContextType>({
  backgrounds: undefined,
  setBackground: () => {},
  backgroundUpdated: false,
  setBackgroundUpdated: () => {},
});
