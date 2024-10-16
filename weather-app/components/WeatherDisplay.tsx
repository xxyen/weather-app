import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from "@/components/Themed"; 

const WeatherDisplay = ({ weatherData, isCelsius, isFavorite, toggleFavorite, isLandscape }) => {
  return (
    <View style={[styles.weatherDisplay, isLandscape ? styles.landscapeContainer : styles.portraitContainer]}>
      
      {/* Top Row: Favorite, Temperature, Location, Feels Like (Landscape Mode) */}
      <View style={isLandscape ? styles.topRowLandscape : styles.tempLocationContainer}>
        {/* Favorite Section */}
        {isLandscape && (
          <Pressable onPress={toggleFavorite} style={styles.favoriteIconLandscape}>
            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={20} color="red" />
          </Pressable>
        )}

        {/* Temperature and Location */}
        <View style={styles.tempLocationContainer}>
          <Text style={styles.tempText}>
            {weatherData ? (isCelsius ? `${weatherData.current.temp_c}°C` : `${weatherData.current.temp_f}°F`) : '-'}
          </Text>
          <Text style={styles.locationName}>
            {weatherData ? `${weatherData.location.name}` : '-'}
          </Text>
          <Text style={styles.locationRegion}>
            {weatherData ? `${weatherData.location.region}` : '-'}
          </Text>
        </View>

        {/* Feels Like and Switch Metric/Imperial */}
        {isLandscape && (
          <View style={styles.feelsLikeContainerLandscape}>
            <Text style={styles.feelsLikeText}>
              Feels Like {weatherData ? (isCelsius ? `${weatherData.current.feelslike_c}°C` : `${weatherData.current.feelslike_f}°F`) : '-'}
            </Text>
            <Pressable style={styles.switchButton} onPress={toggleFavorite}>
              <Text style={styles.switchButtonText}>{`Switch to ${isCelsius ? 'Imperial' : 'Metric'}`}</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Favorite Button (for portrait mode) */}
      {!isLandscape && (
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
      )}

      {/* Bottom Row: Sunrise/Sunset and Wind */}
      <View style={isLandscape ? styles.sunWindContainerLandscape : styles.sunWindContainerPortrait}>
        <View style={styles.box}>
          <Text style={styles.grayText}>Sunrise: </Text>
          <Text style={styles.boldText}>{weatherData ? weatherData.forecast.forecastday[0].astro.sunrise : '-'}</Text>
          <Text style={styles.grayText}>Sunset: </Text>
          <Text style={styles.boldText}>{weatherData ? weatherData.forecast.forecastday[0].astro.sunset : '-'}</Text>
        </View>
        <View style={styles.box}>
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
  portraitContainer: {
    flexDirection: 'column', 
  },
  landscapeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  topRowLandscape: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  tempLocationContainer: {
    alignItems: 'center', 
  },
  tempText: {
    fontSize: 48,
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
  },
  favoriteIconLandscape: {
    marginRight: 20,
  },
  favoriteButton: {
    marginLeft: 10,
  },
  favoriteButtonText: {
    color: '#0A84FF',
  },
  feelsLikeContainerLandscape: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20, 
  },
  feelsLikeText: {
    fontSize: 20,
  },
  switchButton: {
    padding: 10,
  },
  switchButtonText: {
    color: '#0A84FF',
  },
  sunWindContainerPortrait: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },
  sunWindContainerLandscape: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },
  box: {
    flexDirection: 'row',
    backgroundColor: '#A7D3FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: 358,
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
