import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Weather",
        }}
      />
      
      <Stack.Screen
        name="hourly-forecast"
        options={{
          title: "Hourly Forecast",
        }}
      />

      <Stack.Screen
        name="search"
        options={{
          title: "Search By Zip Code",
          presentation: 'modal', 
        }}
      />

      <Stack.Screen
        name="background-image"
        options={{
          title: "Background Image",
        }}
      />
    </Stack>
  );
}
