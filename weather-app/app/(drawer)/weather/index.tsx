import React, { useState, useContext, useEffect } from "react";
import { Pressable, ActivityIndicator, StyleSheet, Platform, ScrollView, Alert } from "react-native";
import * as Location from 'expo-location';
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import WeatherDisplay from "../../../components/WeatherDisplay";
import ForecastTable from "../../../components/ForecastTable";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { Text, View } from "@/components/Themed";
import * as ScreenOrientation from "expo-screen-orientation";

const GEOAPIFY_API_KEY = '3229808f86fe4c93a92f063868e65f17';
const WEATHER_API_KEY = 'c850ed0f8c7244de956214046240309';

export default function WeatherScreen() {
  const router = useRouter();
  const { zipCode: passedZipCode } = useLocalSearchParams();
  const [zipCode, setZipCode] = useState(passedZipCode || '');
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const updateOrientation = (orientation: ScreenOrientation.Orientation) => {
    setIsLandscape(orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT);
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      ScreenOrientation.unlockAsync();
      const subscription = ScreenOrientation.addOrientationChangeListener(event => updateOrientation(event.orientationInfo.orientation));
      return () => ScreenOrientation.removeOrientationChangeListener(subscription);
    }
  }, []);

  useEffect(() => {
    if (!passedZipCode) {
      requestLocationPermission();  // Only request location if no zip code is passed
    } else {
      fetchWeather(passedZipCode);
    }
  }, [passedZipCode]);

  useEffect(() => {
    if (zipCode && Array.isArray(favorites)) {
      setIsFavorite(favorites.some(fav => fav.zipcode === zipCode));
    }
  }, [zipCode, favorites]);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      setPermissionsGranted(false);
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
    console.log('fetchWeather zipcode:', trimmedZip);
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${trimmedZip}&days=3&aqi=no&alerts=no`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Invalid zip code or API call failed.');
      const data = await res.json();
      console.log('Weather data:', data);
      setWeatherData(data);
      console.log('Favorites:', favorites);
      if (Array.isArray(favorites)) {
        setIsFavorite(favorites.some(fav => fav.zipcode === zipCode));
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
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

  const navigateToHourlyForecast = (forecastDay) => {
    router.push({
      pathname: "/weather/hourly-forecast",
      params: { forecast: JSON.stringify(forecastDay.hour), isCelsius: isCelsius.toString() },
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
