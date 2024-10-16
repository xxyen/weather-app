import React, { useContext } from 'react';
import { FlatList, StyleSheet, Pressable } from 'react-native';
import { FavoritesContext } from '@/hooks/FavoritesContext';
import { View, Text } from '@/components/Themed'; 
import { useColorScheme } from '@/components/useColorScheme';

export default function ManageFavoritesScreen() {
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const colors = useColorScheme();


  const removeFavorite = (zipcode: string) => {
    const newFavorites = favorites.filter(fav => fav.zipcode !== zipcode);
    setFavorites(newFavorites);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Favorites</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.zipcode}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <View style={styles.locationContainer}>
                <Text style={styles.locationName}>{item.location.name}</Text>
                <Text style={styles.locationRegion}>{`${item.location.region} (${item.zipcode})`}</Text>
              </View>
              <Pressable onPress={() => removeFavorite(item.zipcode)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />} 
          ListFooterComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Text>No favorites added</Text>
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  favoriteItem: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  locationContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', 
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold', 
  },
  locationRegion: {
    fontSize: 16,
    color: 'gray', 
    textAlign: 'right',
    marginLeft: 10, 
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
