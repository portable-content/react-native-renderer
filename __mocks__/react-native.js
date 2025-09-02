// Manual mock for react-native that only overrides Dimensions
const RN = jest.requireActual('react-native');

// Create a dynamic mock for Dimensions
let mockDimensionsData = { width: 375, height: 812 };
let mockDimensionsListeners = [];

const mockDimensions = {
  get: jest.fn(() => mockDimensionsData),
  addEventListener: jest.fn((event, handler) => {
    const subscription = { remove: jest.fn() };
    mockDimensionsListeners.push({ handler, subscription });
    return subscription;
  }),
  // Helper function to simulate dimension changes in tests
  __setDimensions: (dimensions) => {
    mockDimensionsData = dimensions;
    mockDimensionsListeners.forEach(({ handler }) => {
      handler({ window: dimensions });
    });
  },
  __clearListeners: () => {
    mockDimensionsListeners = [];
  },
};

// Export the mock with only Dimensions overridden
module.exports = {
  ...RN,
  Dimensions: mockDimensions,
};

// Make the mock available globally for tests
global.__mockDimensions = mockDimensions;
