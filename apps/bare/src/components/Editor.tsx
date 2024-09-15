import { memo, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';

const COLORS = [
  'transparent',
  '#3A405A',
  '#AEC5EB',
  '#F9DEC9',
  '#E9AFA3',
  '#685044',
  '#6B2D5C',
  '#F0386B',
  '#FF5376',
  '#F8C0C8',
  '#E2C290',
] as const satisfies string[];

export function Editor({ imageURI }: { imageURI: string }) {
  const [color, setColor] = useState(
    COLORS[Math.round(Math.random() * COLORS.length - 1)]
  );

  const imageSource = useMemo(
    () => ({
      uri: imageURI,
    }),
    [imageURI]
  );

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={[
          styles.image,
          {
            backgroundColor: color,
          },
        ]}
      />
      <ColorSelector onSelect={setColor} />
    </View>
  );
}

const ColorSelector = memo(_ColorSelector, () => true);

function _ColorSelector({ onSelect }: { onSelect: (color: string) => void }) {
  return (
    <ScrollView
      horizontal
      style={{
        maxHeight: 50,
      }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.colorContainer}
    >
      {COLORS.map((color) => (
        <TouchableOpacity
          onPress={() => {
            onSelect(color);
          }}
          style={[
            styles.color,
            {
              backgroundColor: color,
            },
          ]}
          key={color}
        >
          {color !== 'transparent' ? null : (
            <Text style={{ fontSize: 40 }}>🚫</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    gap: 12,
  },
  image: {
    width: '100%',
    flex: 1,
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  color: {
    width: 50,
    height: 50,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
