# react-native-background-remover

This package is a React Native package that uses MLKit on Android and Vision on iOS to remove the background from an image.

## Installation

```sh
yarn add react-native-background-remover
```

## Usage

```js
import { removeBackground } from 'react-native-background-remover';

// You can get the imageURI from the camera or the gallery.
const backgroundRemovedImageURI = removeBackground(imageURI);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
