# react-native-background-remover

This package is a React Native package that uses MLKit on Android and Vision on iOS to remove the background from an image.

<div align="center">
  <video src="https://github.com/user-attachments/assets/ce62728f-69fb-46d2-8016-7d03f751708e" width="400" />
</div>

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

> Note: You need to use a real device on iOS to use this package. Otherwise, it will throw a warning and return the original image. You can still use an emulator on Android.

> Note: This only works with iOS 15 and above. Otherwise, you will get an error.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
