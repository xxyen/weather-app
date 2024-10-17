import React, { useState, useEffect, useContext } from 'react';
import { Pressable, StyleSheet, Switch, Image, Alert, ScrollView, View as RNView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from "@/components/Themed";
import { BackgroundContext } from "@/hooks/backgroundContext"; 

export default function BackgroundImageScreen() {
  const { zipCode, temperature, feelsLike, locationName, locationRegion, isCelsius } = useLocalSearchParams();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [invertTextColor, setInvertTextColor] = useState(false);
  const { backgrounds, setBackground, setBackgroundUpdated } = useContext(BackgroundContext);

  useEffect(() => {
    loadBackgroundFromContext();
  }, [zipCode]);

  const loadBackgroundFromContext = () => {
    if (backgrounds && backgrounds[zipCode]) {
      setImage(backgrounds[zipCode].image);
      setInvertTextColor(backgrounds[zipCode].invertTextColor);
    }
  };

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
  };

  const saveBackground = async () => {
    try {
      if (image) {
        setBackground(zipCode, { image, invertTextColor });
        setBackgroundUpdated(true);
        Alert.alert('Background saved');
        router.back();
      }
    } catch (error) {
      console.error("Failed to save background image", error);
    }
  };

  const removeBackground = async () => {
    try {
      setBackground(zipCode, { image: null, invertTextColor: false });
      setImage(null);
      setBackgroundUpdated(true);
      Alert.alert('Background removed');
      router.back();
    } catch (error) {
      console.error("Failed to remove background image", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        {!image ? (
          <Pressable style={styles.chooseImageButton} onPress={chooseImage}>
            <Text style={styles.buttonTextBlue}>Choose Image</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.updateImageButton} onPress={chooseImage}>
            <Text style={styles.buttonTextBlue}>Update Image</Text>
          </Pressable>
        )}
      </View>

      {image && (
        <>
          <Text style={styles.previewText}>Image Preview:</Text>
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]}>
              <Text style={[styles.tempText, invertTextColor ? styles.invertTextBlack : styles.defaultText]}>
                {`${temperature}°${isCelsius ? 'C' : 'F'}`}
              </Text>
              <Text style={[styles.feelsLikeText, invertTextColor ? styles.invertTextBlack : styles.defaultText]}>
                Feels Like {`${feelsLike}°${isCelsius ? 'C' : 'F'}`}
              </Text>
              <Text style={[styles.locationName, invertTextColor ? styles.invertTextBlack : styles.defaultText]}>
                {locationName}
              </Text>
              <Text style={[styles.locationRegion, invertTextColor ? styles.invertTextBlack : styles.defaultText]}>
                {locationRegion}
              </Text>
            </View>
          </View>

          {/* Divider Lines and Invert Text Color */}
          <RNView style={styles.dividerLine} />
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Invert Text Color</Text>
            <Switch value={invertTextColor} onValueChange={setInvertTextColor} />
          </View>
          <RNView style={styles.dividerLine} />

          <View style={styles.buttonContainer}>
            <Pressable style={styles.saveButton} onPress={saveBackground}>
              <Text style={styles.buttonTextBlue}>Save</Text>
            </Pressable>
            <Pressable style={styles.removeButton} onPress={removeBackground}>
              <Text style={styles.buttonTextRed}>Remove</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center', // Center the button horizontally
  },
  chooseImageButton: {
    padding: 10,
  },
  updateImageButton: {
    padding: 10,
  },
  buttonTextBlue: {
    color: '#0A84FF',
    fontSize: 16,
  },
  buttonTextRed: {
    color: 'red',
    fontSize: 16,
  },
  previewText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  previewContainer: {
    width: '100%',
    height: 220,
    marginBottom: 20,
    borderRadius: 20, 
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    opacity: 0.6,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
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
  },
  locationRegion: {
    fontSize: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', 
    marginBottom: 20,
  },
  switchText: {
    fontSize: 18,
  },
  dividerLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  saveButton: {
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    padding: 10,
    flex: 1,
  },
  defaultText: {
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  invertTextBlack: {
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
