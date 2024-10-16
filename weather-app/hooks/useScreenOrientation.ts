import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

enum ScreenOrientationMode {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

export const useScreenOrientation = (): [boolean] => {
  const [orientation, setOrientation] = useState<ScreenOrientationMode>(
    ScreenOrientationMode.PORTRAIT
  );

  const updateOrientation = (orientation: ScreenOrientation.Orientation) => {
    if (
      orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    ) {
      console.log("Landscape mode");
      setOrientation(ScreenOrientationMode.LANDSCAPE);
    } else {
      console.log("Portrait mode");
      setOrientation(ScreenOrientationMode.PORTRAIT);
    }
  };

  const setInitialOrientation = async () => {
    const initialOrientation = await ScreenOrientation.getOrientationAsync();
    updateOrientation(initialOrientation);
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      // only allow rotattion to change the layout on non-web platforms
      ScreenOrientation.unlockAsync();

      // get initial orientation
      setInitialOrientation();

      // listen to the orientation change event
      const subscription = ScreenOrientation.addOrientationChangeListener(
        (event) => {
          updateOrientation(event.orientationInfo.orientation);

          console.log("Orientation changed: ", event.orientationInfo);
        }
      );

      return () => {
        // remove the listener when the component is unmounted
        ScreenOrientation.removeOrientationChangeListener(subscription);
      };
    }
  }, []);

  const isLandscape = orientation === ScreenOrientationMode.LANDSCAPE;
  return [isLandscape];
};

