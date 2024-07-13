import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  removeBackground(imageURI: string): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BackgroundRemover');
