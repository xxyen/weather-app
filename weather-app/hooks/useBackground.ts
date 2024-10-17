import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Background {
  image: string;
  invertTextColor: boolean;
}

const loadBackgrounds = async () => {
  try {
    const storedBackgrounds = await AsyncStorage.getItem("backgrounds");
    return storedBackgrounds ? JSON.parse(storedBackgrounds) : {};
  } catch (error) {
    console.error("Failed to load backgrounds from storage", error);
    return {};
  }
};

const saveBackgrounds = async (backgrounds: Record<string, Background>) => {
  try {
    await AsyncStorage.setItem("backgrounds", JSON.stringify(backgrounds));
  } catch (error) {
    console.error("Failed to save backgrounds to storage", error);
  }
};

export function useBackground(): [
  Record<string, Background> | undefined,
  (zipCode: string, background: Background) => void,
  boolean,
  (updated: boolean) => void
] {
  const [backgrounds, setBackgrounds] = useState<Record<string, Background> | undefined>(undefined);
  const [backgroundUpdated, setBackgroundUpdated] = useState(false); 
  useEffect(() => {
    const getBackgrounds = async () => {
      const storedBackgrounds = await loadBackgrounds();
      setBackgrounds(storedBackgrounds);
    };
    getBackgrounds();
  }, []);

  const updateBackground = (zipCode: string, background: Background) => {
    const updatedBackgrounds = {
      ...backgrounds,
      [zipCode]: background,
    };
    setBackgrounds(updatedBackgrounds);
    saveBackgrounds(updatedBackgrounds);
    setBackgroundUpdated(true); 
  };

  return [backgrounds, updateBackground, backgroundUpdated, setBackgroundUpdated];
}
