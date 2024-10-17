import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Image } from 'react-native';
import { View, Text } from '@/components/Themed'; 
import { useThemeColor } from '@/components/Themed';

export default function HourlyForecastScreen() {
  const { forecast, isCelsius } = useLocalSearchParams(); 
  const hourlyForecast = JSON.parse(forecast);
  const isMetric = isCelsius === 'true'; 

  const currentHour = new Date().getHours();
  const filteredForecast = hourlyForecast.filter(item => {
    const forecastHour = new Date(item.time).getHours();
    return forecastHour >= currentHour;
  });

  const formatTime = (hour) => {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}${isPM ? ' PM' : ' AM'}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderHourlyItem = ({ item }) => {
    const time = new Date(item.time).getHours();
    const temperature = isMetric ? `${item.temp_c}°C` : `${item.temp_f}°F`; 
    return (
      <View style={styles.hourlyItem}>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
        <Image source={{ uri: `https:${item.condition.icon}` }} style={styles.icon} />
        <Text style={styles.tempText}>{temperature}</Text>
        <Text style={styles.humidityText}>{`${item.humidity}%`}</Text>
      </View>
    );
  };

  const forecastDate = formatDate(filteredForecast[0]?.time || '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{forecastDate}</Text>
      <FlatList
        data={filteredForecast}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderHourlyItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  hourlyItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#A7D3FF',
    borderRadius: 5,
  },
  timeText: {
    fontSize: 20,
  },
  tempText: {
    fontSize: 20,
  },
  humidityText: {
    fontSize: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
