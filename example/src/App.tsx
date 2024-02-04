import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Button } from 'react-native';
import { Image } from 'react-native';

export default function App() {
  const [imageURI, setImageURI] = React.useState<string | null>(null);

  async function selectImage() {
    const imagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      presentationStyle: 'formSheet',
    });

    const selectedImage = imagePickerResponse.assets?.[0];

    if (!selectedImage || !selectedImage.uri) {
      return;
    }

    setImageURI(selectedImage.uri);
  }

  function clearSelection() {
    setImageURI(null);
  }

  function removeSelectionBackground() {
    // TODO: Implement background removal
  }

  return (
    <View style={styles.container}>
      {imageURI ? (
        <View style={styles.container}>
          <Image source={{ uri: imageURI }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <Button
              title="Clear Selection"
              onPress={clearSelection}
              color="red"
            />
            <Button
              title="Remove Background"
              onPress={removeSelectionBackground}
            />
          </View>
        </View>
      ) : (
        <Button title="Open Image Library" onPress={selectImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 36,
  },
  image: {
    width: '100%',
    height: '50%',
  },
});
