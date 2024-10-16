import React from 'react';
import { Button, StyleSheet, Pressable } from 'react-native';
import { Text, View } from "@/components/Themed"; 
import { useThemeColor } from "@/components/Themed";

const FavoritesManager = ({ favorites, removeFavorite, selectLocation, setZipCode, loading }) => {
  return (
    <View style={styles.favoritesContainer}>
      <Text style={styles.sectionTitle}>Favorites:</Text>
      {favorites.length > 0 ? (
        favorites.map((fav, index) => (
          <View key={index} style={styles.favoriteItemContainer}>
            <View style={styles.favoriteItem}>
              <Pressable
                onPress={() => {
                  setZipCode(fav.zipcode);
                  selectLocation(fav.zipcode);
                }}
              >
                <View>
                  <Text style={styles.locationName}>{fav.location.name}</Text>
                  <Text style={styles.locationRegion}>{`${fav.location.region} (${fav.zipcode})`}</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => removeFavorite(fav.zipcode)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </View>
            <View style={styles.separator} />
          </View>
        ))
      ) : (
        <Text>No favorites added</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    marginTop: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  favoriteItemContainer: {
    width: '100%',
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold', 
  },
  locationRegion: {
    fontSize: 16,
    color: 'gray', 
  },
  removeButton: {
    backgroundColor: 'transparent', 
  },
  removeButtonText: {
    color: '#0A84FF', 
    fontSize: 16,
  },
  separator: {
    borderBottomColor: 'gray', 
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default FavoritesManager;
