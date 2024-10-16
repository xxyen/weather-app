import { createContext } from "react";

interface ScreenOrientationContextType {
  isLandscape: boolean;
}

export const ScreenOrientationContext =
  createContext<ScreenOrientationContextType>({
    isLandscape: false,
  });

