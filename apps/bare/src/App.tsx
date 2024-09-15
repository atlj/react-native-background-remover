import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Button } from 'react-native';
import { Image } from 'react-native';
import { removeBackground } from 'react-native-background-remover';
import { ActivityIndicator } from 'react-native';
import { Editor } from './components/Editor';

export default function App() {
  const [imageURI, setImageURI] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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

  async function removeSelectionBackground() {
    if (!imageURI) {
      return;
    }

    setIsLoading(true);

    try {
      const backgroundRemovedImageURI = await removeBackground(imageURI);
      setImageURI(backgroundRemovedImageURI);
    } catch (error) {
      console.error('Failed to remove background', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {imageURI ? (
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            {isLoading ? (
              <View>
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <Editor imageURI={imageURI} />
            )}
          </View>
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
  imageWrapper: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
