import React from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';
import { Text, View } from "@/components/Themed"; 
import { useThemeColor } from "@/components/Themed";

const ForecastTable = ({ forecast, isCelsius, onDayPress }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Text style={styles.title}>3 Day Forecast</Text>
      <View style={styles.forecastContainer}>
        {forecast.map((day, index) => (
          <Pressable key={index} onPress={() => onDayPress(day)}>
            <View style={styles.forecastBox}>
              <Text style={styles.date}>{formatDate(day.date)}</Text>
              <Image source={{ uri: `https:${day.day.condition.icon}` }} style={styles.icon} />
              <Text style={styles.maxTemp}>{isCelsius ? `${day.day.maxtemp_c}°C` : `${day.day.maxtemp_f}°F`}</Text>
              <Text style={styles.minTemp}>{isCelsius ? `${day.day.mintemp_c}°C` : `${day.day.mintemp_f}°F`}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  forecastContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastBox: {
    width: 358,
    height: 52,
    backgroundColor: '#C3E1FF',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  date: {
    fontSize: 20,
  },
  maxTemp: {
    fontSize: 20,
  },
  minTemp: {
    fontSize: 16,
    color: "#777",
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default ForecastTable;
