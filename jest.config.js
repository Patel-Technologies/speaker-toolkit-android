module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|react-native-reanimated|react-native-worklets|react-native-safe-area-context|react-native-paper|react-native-vector-icons)/)',
  ],
};
