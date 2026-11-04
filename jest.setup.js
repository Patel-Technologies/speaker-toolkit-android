/* eslint-disable no-undef */
require('react-native-gesture-handler/jestSetup');

const mockStorageMap = new Map();
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => Promise.resolve(mockStorageMap.get(key) || null)),
  setItem: jest.fn((key, value) => {
    mockStorageMap.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    mockStorageMap.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    mockStorageMap.clear();
    return Promise.resolve();
  }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
    Svg: (props) => React.createElement(View, props),
    Circle: (props) => React.createElement(View, props),
    Path: (props) => React.createElement(View, props),
    G: (props) => React.createElement(View, props),
    Text: (props) => React.createElement(View, props),
    Rect: (props) => React.createElement(View, props),
  };
});

jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text,
      ScrollView,
      createAnimatedComponent: (comp) => comp,
    },
    FadeIn: { duration: () => ({}) },
    FadeOut: { duration: () => ({}) },
    SlideInUp: { duration: () => ({}) },
    SlideOutUp: { duration: () => ({}) },
    useSharedValue: jest.fn((init) => ({ value: init })),
    useAnimatedStyle: jest.fn((cb) => cb()),
    withTiming: jest.fn((val) => val),
    withSpring: jest.fn((val) => val),
  };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
