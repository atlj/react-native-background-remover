import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  removeBackground(imageURI: string, redValue: Int32, greenValue: Int32, blueValue: Int32): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BackgroundRemover');
