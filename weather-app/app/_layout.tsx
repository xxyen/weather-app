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
import { BackgroundContext } from "@/hooks/backgroundContext";
import { useBackground } from "@/hooks/useBackground";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [favorites, setFavorites] = useFavorites();
  const [backgrounds, setBackground, backgroundUpdated, setBackgroundUpdated] = useBackground();

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      <BackgroundContext.Provider value={{ backgrounds, setBackground, backgroundUpdated, setBackgroundUpdated }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Slot />
        </ThemeProvider>
      </BackgroundContext.Provider>
    </FavoritesContext.Provider>
  );
}
