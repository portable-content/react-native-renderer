// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo modules if needed
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {},
  },
}));

// Mock React Native core modules
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  default: {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
    getPixelSizeForLayoutSize: jest.fn((layoutSize) => layoutSize * 2),
    roundToNearestPixel: jest.fn((layoutSize) => layoutSize),
  },
}));

// Mock Image methods for ResponsiveImage tests
jest.mock('react-native/Libraries/Image/Image', () => {
  const ActualImage = jest.requireActual('react-native/Libraries/Image/Image');
  return {
    ...ActualImage,
    resolveAssetSource: jest.fn((source) => ({ width: 200, height: 150 })),
    getSize: jest.fn((uri, success, error) => {
      // Call success callback synchronously to avoid act() warnings
      success(400, 300);
    }),
  };
});

// Mock ScreenProvider to provide default values
jest.mock('./src/providers/ScreenProvider', () => ({
  ScreenProvider: ({ children }) => children,
  useResponsiveScreen: () => ({
    screenData: { width: 375, height: 812 },
    screenSize: 'small',
  }),
  getScreenSize: (width) => {
    if (width < 480) return 'small';
    if (width < 768) return 'medium';
    return 'large';
  },
  SCREEN_BREAKPOINTS: {
    small: 480,
    medium: 768,
  },
}));

// Don't mock useResponsiveStyles - let the real hooks work with mocked ScreenProvider

// Suppress act() warnings for async state updates in tests
const originalError = console.error;
beforeEach(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('An update to') &&
      args[0].includes('was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
});
