import React, { useState, useContext } from "react";
import { TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { useRouter } from "expo-router";
import FavoritesManager from "../../../components/FavoritesManager"; 
import { Text, View } from "@/components/Themed"; 

export default function SearchScreen() {
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const router = useRouter();

  const apiKey = "c850ed0f8c7244de956214046240309";

  const fetchWeather = async (zip: string) => {
    setLoading(true);
    const trimmedZip = zip.includes("-") ? zip.split("-")[0] : zip;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${trimmedZip}&days=3&aqi=no&alerts=no`;

    console.log("fetchWeather zipcode:", trimmedZip);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Invalid zip code or API call failed.");
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = async (zip) => {
    setZipCode(zip);
    if (zip) {
      router.replace({
        pathname: "/(drawer)/weather/",
        params: { zipCode: zip }, 
      });
    }
  };
  
  const searchWeather = (zip) => {
    setZipCode(zip);
    const zipRegex = /^\d{5}(?:-\d{4})?$/;

    if (zipRegex.test(zip)) {
      fetchWeather(zip); 
    } else {
      setSearchResults(null);
    }
  };

  const removeFavorite = (zipcode) => {
    const newFavorites = favorites.filter(fav => fav.zipcode !== zipcode);
    setFavorites(newFavorites);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchBoxModal}
            placeholder="Enter Zip Code"
            value={zipCode}
            onChangeText={searchWeather}
          />
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Search Results:</Text>
            {searchResults ? (
              <Pressable onPress={() => selectLocation(zipCode)} style={styles.resultContainer}>
                <Text style={styles.resultLocationName}>{searchResults.location.name}</Text>
                <Text style={styles.resultLocationRegion}>
                  {`${searchResults.location.region} (${zipCode})`}
                </Text>
                <View style={styles.resultSeparator} />
              </Pressable>
            ) : (
              <Text style={styles.resultText}>Location not found.</Text>
            )}
          </View>
        )}

        <FavoritesManager
          favorites={favorites}
          removeFavorite={removeFavorite}
          selectLocation={selectLocation}
          setZipCode={setZipCode}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalContainer: {
    padding: 20,
    width: '100%',
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  searchBoxModal: {
    flex: 1,
    height: 40,
    backgroundColor: "#EEE",
    paddingLeft: 10,
    marginBottom: 20,
  },
  cancelButton: {
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: "#0A84FF",
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'left', 
  },
  resultContainer: {
    width: '100%',
    marginBottom: 10,
  },
  resultLocationName: {
    fontSize: 18,
    fontWeight: 'bold', 
  },
  resultLocationRegion: {
    fontSize: 16,
    color: 'gray', 
    marginTop: 4, 
  },
  resultSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 10,
  },
});
