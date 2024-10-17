import React from 'react';
import { Pressable, StyleSheet, View, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from "@/components/Themed";

const WeatherDisplay = ({ weatherData, isCelsius, isFavorite, toggleFavorite, toggleUnits, isLandscape, backgroundImage, invertTextColor, navigateToBackground }) => {
  const textStyle = backgroundImage
    ? invertTextColor
      ? styles.invertTextBlack
      : styles.defaultText
    : styles.defaultBlackText;

  return (
    <View style={styles.weatherDisplay}>
      {/* Background Image with Temperature, Feels Like (Portrait), and Location */}
      {!isLandscape && (
      <ImageBackground
        source={backgroundImage ? { uri: backgroundImage } : null}
        style={[styles.backgroundImage, isLandscape ? styles.landscapeBackground : styles.portraitBackground]}
        imageStyle={{ opacity: backgroundImage ? 0.6 : 0 }}
      >
        
        <View style={styles.tempLocationContainer}>
        {!isLandscape && (
          <Text style={[styles.tempText, textStyle]}>
            {weatherData ? (isCelsius ? `${weatherData.current.temp_c}°C` : `${weatherData.current.temp_f}°F`) : '-'}
          </Text>
          )}

          {!isLandscape && (
            <Text style={[styles.feelsLikeText, textStyle]}>
              Feels Like {weatherData ? (isCelsius ? `${weatherData.current.feelslike_c}°C` : `${weatherData.current.feelslike_f}°F`) : '-'}
            </Text>
          )}

          {!isLandscape && (
            <><Text style={[styles.locationName, textStyle]}>
              {weatherData ? `${weatherData.location.name}` : '-'}
            </Text><Text style={[styles.locationRegion, textStyle]}>
                {weatherData ? `${weatherData.location.region}` : '-'}
              </Text></>
            )}

          {!isLandscape && (
            <>
              <Pressable style={styles.setBackgroundButton} onPress={navigateToBackground}>
                <Text style={styles.switchButtonText}>Set Background</Text>
              </Pressable>

              <Pressable style={styles.favoriteIcon} onPress={toggleFavorite}>
                <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} color="red" />
              </Pressable>
            </>
          )}
        </View>

      </ImageBackground>
               )}

      {/* Switch and Feels Like for Landscape Mode */}
      {isLandscape && (
        <View style={styles.landscapeLayout}>
          {/* Left Section: Heart Icon and Set Background */}
          <View style={styles.landscapeLeftSection}>
            <Pressable style={styles.favoriteIconLandscape} onPress={toggleFavorite}>
              <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} color="red" />
            </Pressable>
            <Pressable style={styles.setBackgroundButtonLandscape} onPress={navigateToBackground}>
              <Text style={styles.switchButtonText}>Set Background</Text>
            </Pressable>
          </View>

          {isLandscape && (
          <ImageBackground
            source={backgroundImage ? { uri: backgroundImage } : null}
            style={[styles.backgroundImage, isLandscape ? styles.landscapeBackground : styles.portraitBackground]}
            imageStyle={{ opacity: backgroundImage ? 0.8 : 0 }}
          >
          {/* Center Section: Temperature and Location */}
          <View style={styles.landscapeCenterSection}>
            <Text style={[styles.tempTextLandscape, textStyle]}>
              {weatherData ? (isCelsius ? `${weatherData.current.temp_c}°C` : `${weatherData.current.temp_f}°F`) : '-'}
            </Text>
            {/* <Text style={[styles.locationNameLandscape, textStyle]}>
              {weatherData ? `${weatherData.location.name}` : '-'}
            </Text> */}
            <Text style={[styles.locationRegionLandscape, textStyle]}>
              {weatherData ? `${weatherData.location.name}, ${weatherData.location.region}` : '-'}
            </Text>
          </View>
          </ImageBackground>
          )}

          {/* Right Section: Feels Like and Switch to xx */}
          <View style={styles.landscapeRightSection}>
            <Text style={styles.landscapeFeelsLikeText}>
              Feels Like {weatherData ? (isCelsius ? `${weatherData.current.feelslike_c}°C` : `${weatherData.current.feelslike_f}°F`) : '-'}
            </Text>
            <Pressable style={styles.switchButtonLandscape} onPress={toggleUnits}>
              <Text style={styles.switchButtonText}>{`Switch to ${isCelsius ? 'Imperial' : 'Metric'}`}</Text>
            </Pressable>
          </View>
        </View>
      )}



      {/* Sunrise/Sunset and Wind */}
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
    justifyContent: 'center',
  },
  backgroundImage: {
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitBackground: {
    height: 200, 
    borderRadius: 20,
  },
  landscapeBackground: {
    height: 160, 
    borderRadius: 20,
  },
  tempLocationContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  tempText: {
    fontSize: 48,
  },
  feelsLikeText: {
    fontSize: 20,
    marginVertical: 5,
  },
  locationName: {
    fontSize: 32,
    marginVertical: 5,
    marginTop: 10,
  },
  locationRegion: {
    fontSize: 24,
    marginBottom: 10,
  },
  setBackgroundButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  setBackgroundButtonLandscape: {
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  switchButtonPortrait: {
    marginTop: 20,
  },
  switchButtonLandscape: {
    marginTop: 10,
  },
  switchButtonText: {
    color: '#0A84FF',
  },
  favoriteIcon: {
    marginTop: 10,
  },
  favoriteIconLandscape: {
    marginBottom: 20,
  },
  sunWindContainerPortrait: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 90,
    width: '100%',
  },
  sunWindContainerLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
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
  defaultText: {
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  defaultBlackText: {
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  invertTextBlack: {
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  landscapeLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  landscapeLeftSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeCenterSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempTextLandscape: {
    fontSize: 48,
  },
  locationNameLandscape: {
    fontSize: 32,
  },
  locationRegionLandscape: {
    fontSize: 24,
  },
  landscapeRightSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  landscapeFeelsLikeText: {
    fontSize: 20,
  },
});

export default WeatherDisplay;
