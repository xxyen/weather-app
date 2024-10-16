import React, { useState, useContext, useEffect } from "react";
import { Pressable, ActivityIndicator, StyleSheet, Platform, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; 
import { FontAwesome } from "@expo/vector-icons";
import WeatherDisplay from "../../../components/WeatherDisplay";
import ForecastTable from "../../../components/ForecastTable";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { Text, View } from "@/components/Themed";  
import { useThemeColor } from "@/components/Themed";
import * as ScreenOrientation from "expo-screen-orientation";


export default function WeatherScreen() {
  const router = useRouter();
  const { zipCode: passedZipCode } = useLocalSearchParams(); 
  const [zipCode, setZipCode] = useState(passedZipCode || ''); 
  const [weatherData, setWeatherData] = useState(null); 
  const [isCelsius, setIsCelsius] = useState(false);
  const [loading, setLoading] = useState(false);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const [isFavorite, setIsFavorite] = useState(false);

  const apiKey = 'c850ed0f8c7244de956214046240309'; 

  const [isLandscape, setIsLandscape] = useState(false);

  const updateOrientation = (orientation: ScreenOrientation.Orientation) => {
    if (
      orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    ) {
      console.log("Landscape mode");
      setIsLandscape(true);
    } else {
      console.log("Portrait mode");
      setIsLandscape(false);
    }
  };

  const setInitialOrientation = async () => {
    const initialOrientation = await ScreenOrientation.getOrientationAsync();
    updateOrientation(initialOrientation);
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      // allow rotattion to change the layout on non-web platforms
      ScreenOrientation.unlockAsync();

      // get initial orientation
      setInitialOrientation();

      // listen to the orientation change event
      const subscription = ScreenOrientation.addOrientationChangeListener(
        (event) => {
          updateOrientation(event.orientationInfo.orientation);

          console.log("Orientation changed: ", event.orientationInfo);
        }
      );

      return () => {
        // remove the listener when the component is unmounted
        ScreenOrientation.removeOrientationChangeListener(subscription);
      };
    }
  }, []);


  useEffect(() => {
    if (!weatherData && zipCode) {
      fetchWeather(zipCode);
    }
  }, [zipCode, weatherData]);

  useEffect(() => {
    if (Array.isArray(favorites)) {
      setIsFavorite(favorites.some(fav => fav.zipcode === zipCode));
    }
  }, [favorites, zipCode]);

  const fetchWeather = async (zip) => {
    setLoading(true);
    const trimmedZip = zip.includes('-') ? zip.split('-')[0] : zip;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${trimmedZip}&days=3&aqi=no&alerts=no`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Invalid zip code or API call failed.');
      const data = await res.json();
      setWeatherData(data);
      setIsFavorite(favorites.some(fav => fav.zipcode === zipCode));
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.zipcode !== zipCode);
      setFavorites(newFavorites);
    } else {
      const newFavorite = {
        zipcode: zipCode,
        location: {
          name: weatherData.location.name,
          region: weatherData.location.region,
        }
      };
      setFavorites([...favorites, newFavorite]);
    }
    setIsFavorite(!isFavorite);
  };

  const navigateToHourlyForecast = (forecastDay) => {
    router.push({
      pathname: "/weather/hourly-forecast",
      params: { 
        forecast: JSON.stringify(forecastDay.hour),
        isCelsius: isCelsius.toString(),
      },
    });
  };

  
  return (
    <ScrollView contentContainerStyle={[styles.container, isLandscape ? styles.portraitContainer : styles.landscapeContainer]}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
        <Pressable style={styles.searchButton} onPress={() => router.push('/weather/search')}>
          <Text style={styles.searchButtonText}>Enter Zip Code</Text>
        </Pressable>
      </View>

      {!weatherData && (
        <Text style={styles.initialMessage}>Touch the search bar to enter a zip code</Text>
      )}

      {loading && (
        <ActivityIndicator size="large" color="blue" />
      )}

      {weatherData && (
        <>
          <WeatherDisplay
            weatherData={weatherData}
            isCelsius={isCelsius}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            isLandscape={isLandscape}
          />
          <ForecastTable
            forecast={weatherData.forecast.forecastday}
            isCelsius={isCelsius}
            onDayPress={navigateToHourlyForecast}
          />
        </>
      )}

      {weatherData && (
        <Pressable style={styles.switchButton} onPress={() => setIsCelsius(!isCelsius)}>
          <Text style={styles.switchButtonText}>{`Switch to ${isCelsius ? 'Imperial' : 'Metric'}`}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    padding: 20,
    backgroundColor: '#fffff',
  },
  portraitContainer: {
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingVertical: 20,
  },
  landscapeContainer: {
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingVertical: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#AAA',
    fontSize: 18,
  },
  initialMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  switchButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  switchButtonText: {
    color: '#0A84FF',
  },
});