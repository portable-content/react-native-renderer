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

// Mock React Native Dimensions using the manual mock approach
// This creates a __mocks__ folder approach inline
const mockDimensions = {
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
};

// Mock the Dimensions module
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Only override Dimensions, keep everything else
  return Object.defineProperty(RN, 'Dimensions', {
    get() {
      return mockDimensions;
    },
  });
});

// Make the mock available globally for tests that need to change dimensions
global.__mockDimensions = mockDimensions;

// Mock ScreenProvider for Element component tests that don't explicitly test responsive behavior
jest.mock('./src/providers/ScreenProvider', () => {
  const actual = jest.requireActual('./src/providers/ScreenProvider');
  return {
    ...actual,
    ScreenProvider: ({ children }) => children,
    useResponsiveScreen: () => ({
      screenData: { width: 375, height: 812 },
      screenSize: 'small',
    }),
  };
});

jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  default: {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
    getPixelSizeForLayoutSize: jest.fn(layoutSize => layoutSize * 2),
    roundToNearestPixel: jest.fn(layoutSize => layoutSize),
  },
}));

// Mock Image methods for Element tests
jest.mock('react-native/Libraries/Image/Image', () => {
  const ActualImage = jest.requireActual('react-native/Libraries/Image/Image');
  return {
    ...ActualImage,
    resolveAssetSource: jest.fn(source => ({ width: 200, height: 150 })),
    getSize: jest.fn((uri, success, error) => {
      // Call success callback synchronously to avoid act() warnings
      success(400, 300);
    }),
  };
});

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
