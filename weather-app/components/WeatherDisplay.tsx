import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from "@/components/Themed"; 
import { useThemeColor } from "@/components/Themed";

const WeatherDisplay = ({ weatherData, isCelsius, isFavorite, toggleFavorite }) => {
  return (
    <View style={styles.weatherDisplay}>
      <Text style={styles.tempText}>
        {weatherData ? (isCelsius ? `${weatherData.current.temp_c}°C` : `${weatherData.current.temp_f}°F`) : '-'}
      </Text>
      <Text style={styles.feelsLikeText}>
        Feels Like {weatherData ? (isCelsius ? `${weatherData.current.feelslike_c}°C` : `${weatherData.current.feelslike_f}°F`) : '-'}
      </Text>

      <Text style={styles.locationName}>
        {weatherData ? `${weatherData.location.name}` : '-'}
      </Text>
      <Text style={styles.locationRegion}>
        {weatherData ? `${weatherData.location.region}` : '-'}
      </Text>

      <View style={styles.favoriteSection}>
        <Pressable onPress={toggleFavorite}>
          <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={20} color="red" />
        </Pressable>

        {!isFavorite && (
          <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
            <Text style={styles.favoriteButtonText}>Add Favorite</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.sunWindContainer}>
        <View style={styles.box}>
          <Text style={styles.grayText}>Sunrise: </Text>
          <Text style={styles.boldText}>{weatherData ? weatherData.forecast.forecastday[0].astro.sunrise : '-'}</Text>
          <Text style={styles.grayText}>Sunset: </Text>
          <Text style={styles.boldText}>{weatherData ? weatherData.forecast.forecastday[0].astro.sunset : '-'}</Text>
        </View>
        <View style={styles.box2}>
          <Text style={styles.windTextWithShadow}>Wind: </Text>
          <Text style={styles.boldText}>{weatherData ? `${weatherData.current.wind_mph}` : '-'}</Text>
          <Text style={styles.boldText}>MPH</Text>
          <Text style={styles.boldText}>{weatherData ? weatherData.current.wind_dir : '-'}</Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  weatherDisplay: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  tempText: {
    fontSize: 48,
  },
  feelsLikeText: {
    fontSize: 20,
    marginTop: 5,
  },
  locationName: {
    fontSize: 32,
    marginVertical: 5,
    marginTop: 20,
  },
  locationRegion: {
    fontSize: 24,
    marginBottom: 30,
  },
  favoriteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: 122,
    height: 25,
    justifyContent: 'center',
  },
  favoriteButton: {
    marginLeft: 10,
  },
  favoriteButtonText: {
    color: '#0A84FF',
  },
  sunWindContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  box: {
    flexDirection: 'row',
    backgroundColor: '#A7D3FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: 358,
    height: 51,
  },
  box2: {
    flexDirection: 'row',
    backgroundColor: '#A7D3FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 60,
    justifyContent: 'space-between',
    width: 358,
    height: 51,
  },
  grayText: {
    color: '#777', 
    fontSize: 16,
  },
  boldText: {
    fontSize: 19, 
  },
  windTextWithShadow: {
    color: '#555', 
    fontSize: 19,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4,
  },
});

export default WeatherDisplay;
