import { createContext } from "react";

interface FavoritesContextType {
  favorites: string[] | undefined;
  setFavorites: (favorites: string[]) => void;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: undefined,
  setFavorites: () => {},
});
