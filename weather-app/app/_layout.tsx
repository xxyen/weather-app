import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import React from "react";
import { Slot } from "expo-router";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { useFavorites } from "@/hooks/useFavorites";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [favorites, setFavorites] = useFavorites();

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Slot />
      </ThemeProvider>
    </FavoritesContext.Provider>
  );
}
