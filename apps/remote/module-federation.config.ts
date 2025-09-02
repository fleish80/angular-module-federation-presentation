import { ModuleFederationConfig } from '@nx/module-federation';
import { join } from 'path';

const config: ModuleFederationConfig = {
  name: 'remote',
  exposes: {
    './Routes': join(__dirname, 'src/app/remote-entry/entry.routes.ts'),
    './Elements': join(__dirname, 'src/app/remote-entry/elements.ts'),
  },
  shared: (libraryName, sharedConfig) => {
    if (
      libraryName ===
      '@angular-module-federation-presentation/shared-data'
    ) {
      return {
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
      };
    }
    return sharedConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
