import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loadFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Failed to load favorites from storage", error);
    return [];
  }
};

const saveFavorites = async (favorites: string[]) => {
  try {
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites to storage", error);
  }
};

export function useFavorites(): [
  string[] | undefined,
  (favorites: string[]) => void
] {
  const [favorites, setFavorites] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const getFavorites = async () => {
      const storedFavorites = await loadFavorites();
      setFavorites(storedFavorites);
    };
    getFavorites();
  }, []);

  const updateFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  return [favorites, updateFavorites];
}
