import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-background-remover' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const BackgroundRemoverModule = isTurboModuleEnabled
  ? require('./NativeBackgroundRemover').default
  : NativeModules.BackgroundRemover;

const BackgroundRemover = BackgroundRemoverModule
  ? BackgroundRemoverModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function removeBackground(imageURI: string): Promise<string> {
  return BackgroundRemover.removeBackground(imageURI);
}
