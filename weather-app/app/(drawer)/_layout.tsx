import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

import "react-native-reanimated";

import React from "react";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="weather"
          options={{
            drawerLabel: "Weather",
            title: "Weather",
          }}
        />
        <Drawer.Screen
          name="manage-favorites"
          options={{
            drawerLabel: "Manage Favorites",
            title: "Manage Favorites",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
