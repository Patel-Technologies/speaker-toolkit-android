const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const sharedNodeModules = path.resolve(__dirname, '../TasbihApp/node_modules');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native-metro-config').MetroConfig}
 */
const config = {
  watchFolders: [sharedNodeModules],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      sharedNodeModules,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
