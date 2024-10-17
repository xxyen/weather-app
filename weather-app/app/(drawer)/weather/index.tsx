import React, { useState, useContext, useEffect, useCallback } from "react";
import { Pressable, ActivityIndicator, StyleSheet, Platform, ScrollView, Alert } from "react-native";
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen'; 
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import WeatherDisplay from "../../../components/WeatherDisplay";
import ForecastTable from "../../../components/ForecastTable";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { BackgroundContext } from "@/hooks/backgroundContext"; 
import { Text, View } from "@/components/Themed";
import * as ScreenOrientation from "expo-screen-orientation";

const GEOAPIFY_API_KEY = '3229808f86fe4c93a92f063868e65f17';
const WEATHER_API_KEY = 'c850ed0f8c7244de956214046240309';

SplashScreen.preventAutoHideAsync(); 

export default function WeatherScreen() {
  const router = useRouter();
  const { zipCode: passedZipCode } = useLocalSearchParams();
  const [zipCode, setZipCode] = useState(passedZipCode || '');
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const { backgrounds, backgroundUpdated, setBackgroundUpdated } = useContext(BackgroundContext); // Add backgroundUpdated and setBackgroundUpdated
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);  
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [invertTextColor, setInvertTextColor] = useState(false);

  const updateOrientation = (orientation) => {
    setIsLandscape(
      orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || 
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    );
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      ScreenOrientation.unlockAsync();
      const subscription = ScreenOrientation.addOrientationChangeListener(event => updateOrientation(event.orientationInfo.orientation));
      return () => ScreenOrientation.removeOrientationChangeListener(subscription);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBackgroundFromContext(zipCode); 
      setBackgroundUpdated(false); 
    }, [zipCode, backgroundUpdated])
  );

  useEffect(() => {
    if (!passedZipCode) {
      requestLocationPermission();  
    } else {
      fetchWeather(passedZipCode);
    }
  }, [passedZipCode]);

  useEffect(() => {
    if (zipCode && Array.isArray(favorites)) {
      setIsFavorite(favorites.some(fav => fav.zipcode === zipCode));
    }
    loadBackgroundFromContext(zipCode); 
  }, [zipCode, favorites]);

  useEffect(() => {
    if (appIsReady && !loading) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, loading]);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      setPermissionsGranted(false);
      setAppIsReady(true);  
      return;
    }

    setPermissionsGranted(true);
    getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    fetchZipCodeFromCoords(latitude, longitude);
  };

  const fetchZipCodeFromCoords = async (lat, lon) => {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const postalCode = data.features[0]?.properties?.postcode;
      if (postalCode) {
        setZipCode(postalCode);
        fetchWeather(postalCode);
      } else {
        Alert.alert('Could not retrieve ZIP code from location');
      }
    } catch (error) {
      console.error('Error fetching ZIP code:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (zip) => {
    setLoading(true);
    const trimmedZip = zip.includes('-') ? zip.split('-')[0] : zip;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${trimmedZip}&days=3&aqi=no&alerts=no`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Invalid zip code or API call failed.');
      const data = await res.json();
      setWeatherData(data);
      if (Array.isArray(favorites)) {
        setIsFavorite(favorites.some(fav => fav.zipcode === zipCode));
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
      setAppIsReady(true); 
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.zipcode !== zipCode));
    } else {
      const newFavorite = {
        zipcode: zipCode,
        location: {
          name: weatherData.location.name,
          region: weatherData.location.region,
        },
      };
      setFavorites([...favorites, newFavorite]);
    }
    setIsFavorite(!isFavorite);
  };

  const loadBackgroundFromContext = (zip) => {
    if (backgrounds && backgrounds[zip]) {
      setBackgroundImage(backgrounds[zip].image);
      setInvertTextColor(backgrounds[zip].invertTextColor);
    } else {
      // Clear background if none exists
      setBackgroundImage(null);
      setInvertTextColor(false);
    }
    console.log("Background image loaded:", backgroundImage); // For debugging
  };

  const navigateToBackground = () => {
    router.push({
      pathname: "/weather/background-image",
      params: {
        zipCode,
        temperature: weatherData.current.temp_c,
        feelsLike: weatherData.current.feelslike_c,
        locationName: weatherData.location.name,
        locationRegion: weatherData.location.region,
        isCelsius,
        backgroundImage,
        invertTextColor,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isLandscape ? styles.landscapeContainer : styles.portraitContainer]}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
        <Pressable style={styles.searchButton} onPress={() => router.push('/weather/search')}>
          <Text style={styles.searchButtonText}>Enter Zip Code</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator size="large" color="blue" />}

      {weatherData && (
        <>
          <WeatherDisplay
            weatherData={weatherData}
            isCelsius={isCelsius}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            toggleUnits={() => setIsCelsius(!isCelsius)}  // Pass toggleUnits to WeatherDisplay
            isLandscape={isLandscape}
            backgroundImage={backgroundImage}
            invertTextColor={invertTextColor}
            navigateToBackground={navigateToBackground}
          />

          <ForecastTable
            forecast={weatherData.forecast.forecastday}
            isCelsius={isCelsius}
            onDayPress={(forecastDay) => {
              router.push({
                pathname: "/weather/hourly-forecast",
                params: { forecast: JSON.stringify(forecastDay.hour), isCelsius: isCelsius.toString() },
              });
            }}
          />
        </>
      )}

      {weatherData && !isLandscape && (
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
    backgroundColor: '#fff',
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
