import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-background-remover' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-ignore
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

/**
 * Removes the background from an image.
 * Note: This method isn't usable on iOS simulators, you need to have a real device.
 * @returns The URI of the image with the background removed.
 * @returns the original URI if you are using an iOS simulator.
 * @throws Error if the iOS device is not at least on iOS 15.0.
 * @throws Error if the image could not be processed for an unknown reason.
 */
export async function removeBackground(imageURI: string): Promise<string> {
  try {
    const result: string = await BackgroundRemover.removeBackground(imageURI);
    return result;
  } catch (error) {
    if (error instanceof Error && error.message === 'SimulatorError') {
      console.warn(
        '[ReactNativeBackgroundRemover]: You need to have a real device. This feature is not available on simulators. Returning the original image URI.'
      );
      return imageURI;
    }

    throw error;
  }
}
