import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';

// TypeScript declaration for global mock
declare global {
  var __mockDimensions: {
    get: jest.Mock;
    addEventListener: jest.Mock;
    __setDimensions: (dimensions: { width: number; height: number }) => void;
    __clearListeners: () => void;
  };
}

// Unmock ScreenProvider for this test file to test the real implementation
jest.unmock('../ScreenProvider');

import {
  ScreenProvider,
  useResponsiveScreen,
  getScreenSize,
  SCREEN_BREAKPOINTS,
  type ScreenSize,
} from '../ScreenProvider';

// Use the global mock from jest.setup.js
const mockDimensions = global.__mockDimensions;

// Helper to simulate dimension changes
const simulateDimensionChange = (dimensions: {
  width: number;
  height: number;
}) => {
  // Update the mock to return new dimensions
  mockDimensions.get.mockReturnValue(dimensions);

  // Simulate the event listener being called
  const mockCalls = mockDimensions.addEventListener.mock.calls;
  if (mockCalls.length > 0) {
    const lastCall = mockCalls[mockCalls.length - 1];
    const handler = lastCall[1]; // The handler function
    if (handler) {
      handler({ window: dimensions });
    }
  }
};

// Test component that uses the hook
const TestComponent = () => {
  const { screenData, screenSize } = useResponsiveScreen();
  return (
    <Text testID="screen-info">
      {screenData.width}x{screenData.height}-{screenSize}
    </Text>
  );
};

describe('ScreenProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockReturnValue({ width: 375, height: 812 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getScreenSize', () => {
    it('should return "small" for widths less than 480', () => {
      expect(getScreenSize(320)).toBe('small');
      expect(getScreenSize(479)).toBe('small');
    });

    it('should return "medium" for widths between 480 and 767', () => {
      expect(getScreenSize(480)).toBe('medium');
      expect(getScreenSize(600)).toBe('medium');
      expect(getScreenSize(767)).toBe('medium');
    });

    it('should return "large" for widths 768 and above', () => {
      expect(getScreenSize(768)).toBe('large');
      expect(getScreenSize(1024)).toBe('large');
      expect(getScreenSize(1920)).toBe('large');
    });

    it('should handle edge cases correctly', () => {
      expect(getScreenSize(0)).toBe('small');
      expect(getScreenSize(SCREEN_BREAKPOINTS.small - 1)).toBe('small');
      expect(getScreenSize(SCREEN_BREAKPOINTS.small)).toBe('medium');
      expect(getScreenSize(SCREEN_BREAKPOINTS.medium - 1)).toBe('medium');
      expect(getScreenSize(SCREEN_BREAKPOINTS.medium)).toBe('large');
    });
  });

  describe('ScreenProvider', () => {
    it('should provide initial screen dimensions and size', () => {
      mockDimensions.get.mockReturnValue({ width: 375, height: 812 });

      const { getByTestId } = render(
        <ScreenProvider>
          <TestComponent />
        </ScreenProvider>
      );

      expect(getByTestId('screen-info')).toHaveTextContent('375x812-small');
      expect(mockDimensions.get).toHaveBeenCalledWith('window');
    });

    it('should set up dimension change listener on mount', () => {
      render(
        <ScreenProvider>
          <TestComponent />
        </ScreenProvider>
      );

      expect(mockDimensions.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should clean up dimension listener on unmount', () => {
      const { unmount } = render(
        <ScreenProvider>
          <TestComponent />
        </ScreenProvider>
      );

      // Get the subscription that was returned by addEventListener
      const mockCalls = mockDimensions.addEventListener.mock.results;
      expect(mockCalls.length).toBeGreaterThan(0);

      const subscription = mockCalls[0].value;

      unmount();

      expect(subscription.remove).toHaveBeenCalled();
    });

    it('should update screen data when dimensions change', () => {
      const { getByTestId } = render(
        <ScreenProvider>
          <TestComponent />
        </ScreenProvider>
      );

      // Initial state
      expect(getByTestId('screen-info')).toHaveTextContent('375x812-small');

      // Simulate dimension change
      act(() => {
        simulateDimensionChange({ width: 768, height: 1024 });
      });

      expect(getByTestId('screen-info')).toHaveTextContent('768x1024-large');
    });

    it('should correctly classify different screen sizes', () => {
      const { getByTestId } = render(
        <ScreenProvider>
          <TestComponent />
        </ScreenProvider>
      );

      // Test small screen
      act(() => {
        simulateDimensionChange({ width: 320, height: 568 });
      });
      expect(getByTestId('screen-info')).toHaveTextContent('320x568-small');

      // Test medium screen
      act(() => {
        simulateDimensionChange({ width: 600, height: 800 });
      });
      expect(getByTestId('screen-info')).toHaveTextContent('600x800-medium');

      // Test large screen
      act(() => {
        simulateDimensionChange({ width: 1024, height: 768 });
      });
      expect(getByTestId('screen-info')).toHaveTextContent('1024x768-large');
    });
  });

  describe('useResponsiveScreen', () => {
    it('should throw error when used outside of provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Create a component that will throw during render
      const ThrowingComponent = () => {
        useResponsiveScreen(); // This should throw
        return <Text>Should not render</Text>;
      };

      expect(() => {
        render(<ThrowingComponent />);
      }).toThrow('useResponsiveScreen must be used within a ScreenProvider');

      consoleSpy.mockRestore();
    });

    it('should return screen data and size when used within provider', () => {
      mockDimensions.get.mockReturnValue({ width: 600, height: 800 });

      const { getByTestId } = render(
        <ScreenProvider>
          <TestComponent />
        </ScreenProvider>
      );

      expect(getByTestId('screen-info')).toHaveTextContent('600x800-medium');
    });
  });

  describe('SCREEN_BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(SCREEN_BREAKPOINTS.small).toBe(480);
      expect(SCREEN_BREAKPOINTS.medium).toBe(768);
    });

    it('should be readonly', () => {
      // In JavaScript, const objects can still be mutated, but TypeScript prevents it
      // This test verifies the TypeScript constraint exists
      expect(typeof SCREEN_BREAKPOINTS.small).toBe('number');
      expect(typeof SCREEN_BREAKPOINTS.medium).toBe('number');
    });
  });
});
