import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ScreenProvider } from '../../providers/ScreenProvider';

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
jest.unmock('../../providers/ScreenProvider');

import {
  useResponsiveStyles,
  useResponsiveDimensions,
  RESPONSIVE_STYLES,
} from '../useResponsiveStyles';

// Use the global mock from jest.setup.js
const mockDimensions = global.__mockDimensions;

// Helper to simulate dimension changes
const simulateDimensionChange = (dimensions: { width: number; height: number }) => {
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

// Helper to create wrapper with dimension change capability
const createWrapperWithDimensions = (
  initialDimensions = { width: 375, height: 812 }
) => {
  // Set initial dimensions
  mockDimensions.get.mockReturnValue(initialDimensions);

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ScreenProvider>{children}</ScreenProvider>
  );

  return {
    wrapper,
    changeHandler: (dimensions: { width: number; height: number }) => {
      act(() => {
        simulateDimensionChange(dimensions);
      });
    },
  };
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ScreenProvider>{children}</ScreenProvider>
);

describe('useResponsiveStyles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockReturnValue({ width: 375, height: 812 });
  });

  describe('RESPONSIVE_STYLES constants', () => {
    it('should have correct values for all screen sizes', () => {
      expect(RESPONSIVE_STYLES.small).toEqual({
        padding: 12,
        titleSize: 18,
        fontSize: 14,
        lineHeight: 20,
      });

      expect(RESPONSIVE_STYLES.medium).toEqual({
        padding: 16,
        titleSize: 22,
        fontSize: 16,
        lineHeight: 24,
      });

      expect(RESPONSIVE_STYLES.large).toEqual({
        padding: 20,
        titleSize: 26,
        fontSize: 18,
        lineHeight: 28,
      });
    });
  });

  describe('useResponsiveStyles hook', () => {
    it('should return small screen styles for width < 480', () => {
      mockDimensions.get.mockReturnValue({ width: 320, height: 568 });

      const { result } = renderHook(() => useResponsiveStyles(), { wrapper });

      expect(result.current).toEqual(RESPONSIVE_STYLES.small);
    });

    it('should return medium screen styles for width 480-767', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(() => useResponsiveStyles(), { wrapper });

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      expect(result.current).toEqual(RESPONSIVE_STYLES.medium);
    });

    it('should return large screen styles for width >= 768', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(() => useResponsiveStyles(), { wrapper });

      // Change to large screen size
      changeHandler({ width: 1024, height: 768 });

      expect(result.current).toEqual(RESPONSIVE_STYLES.large);
    });

    it('should allow custom padding override', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () => useResponsiveStyles({ customPadding: 24 }),
        { wrapper }
      );

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      expect(result.current.padding).toBe(24);
      expect(result.current.titleSize).toBe(RESPONSIVE_STYLES.medium.titleSize);
    });

    it('should allow multiple custom overrides', () => {
      mockDimensions.get.mockReturnValue({ width: 320, height: 568 });

      const { result } = renderHook(
        () =>
          useResponsiveStyles({
            customPadding: 10,
            customTitleSize: 20,
            customFontSize: 15,
            customLineHeight: 22,
          }),
        { wrapper }
      );

      expect(result.current).toEqual({
        padding: 10,
        titleSize: 20,
        fontSize: 15,
        lineHeight: 22,
      });
    });
  });

  describe('useResponsiveDimensions hook', () => {
    it('should calculate responsive width based on screen size', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(() => useResponsiveDimensions(), {
        wrapper,
      });

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      // Medium screen (600px): 0.8 * (600 - 32) = 0.8 * 568 = 454.4
      expect(result.current.width).toBeCloseTo(454.4);
      expect(result.current.height).toBeCloseTo(340.8); // 454.4 * 0.75
    });

    it('should use custom width when provided', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () => useResponsiveDimensions({ width: 300 }),
        { wrapper }
      );

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      expect(result.current.width).toBe(300);
      expect(result.current.height).toBe(225); // 300 * 0.75
    });

    it('should use custom height when provided', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () => useResponsiveDimensions({ width: 300, height: 200 }),
        { wrapper }
      );

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      expect(result.current.width).toBe(300);
      expect(result.current.height).toBe(200);
    });

    it('should respect minWidth constraint', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () => useResponsiveDimensions({ minWidth: 150 }),
        { wrapper }
      );

      // Change to very small screen
      changeHandler({ width: 200, height: 300 });

      expect(result.current.width).toBeGreaterThanOrEqual(150);
    });

    it('should respect maxWidth constraint', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () => useResponsiveDimensions({ maxWidth: 400 }),
        { wrapper }
      );

      // Change to large screen
      changeHandler({ width: 1200, height: 800 });

      expect(result.current.width).toBeLessThanOrEqual(400);
    });

    it('should calculate height based on aspect ratio when preserveAspectRatio is true', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () =>
          useResponsiveDimensions({
            width: 400,
            preserveAspectRatio: true,
            originalDimensions: { width: 800, height: 600 },
          }),
        { wrapper }
      );

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      expect(result.current.width).toBe(400);
      expect(result.current.height).toBe(300); // 400 / (800/600) = 300
    });

    it('should return undefined height when preserveAspectRatio is true but no originalDimensions', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () =>
          useResponsiveDimensions({
            width: 400,
            preserveAspectRatio: true,
          }),
        { wrapper }
      );

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      expect(result.current.width).toBe(400);
      expect(result.current.height).toBeUndefined();
    });

    it('should account for custom padding in calculations', () => {
      const { wrapper, changeHandler } = createWrapperWithDimensions();
      const { result } = renderHook(
        () => useResponsiveDimensions({ padding: 40 }),
        { wrapper }
      );

      // Change to medium screen size
      changeHandler({ width: 600, height: 800 });

      // Available width: 600 - (40 * 2) = 520
      // Medium screen: 0.8 * 520 = 416
      expect(result.current.width).toBeCloseTo(416);
    });

    it('should handle different screen sizes correctly', () => {
      // Test small screen
      const { wrapper: smallWrapper, changeHandler: smallChangeHandler } =
        createWrapperWithDimensions();
      const { result: smallResult } = renderHook(
        () => useResponsiveDimensions(),
        { wrapper: smallWrapper }
      );

      smallChangeHandler({ width: 320, height: 568 });

      // Small screen: 0.9 * (320 - 24) = 0.9 * 296 = 266.4
      expect(smallResult.current.width).toBeCloseTo(266.4);

      // Test large screen
      const { wrapper: largeWrapper, changeHandler: largeChangeHandler } =
        createWrapperWithDimensions();
      const { result: largeResult } = renderHook(
        () => useResponsiveDimensions(),
        { wrapper: largeWrapper }
      );

      largeChangeHandler({ width: 1024, height: 768 });

      // Large screen: 0.7 * (1024 - 40) = 0.7 * 984 = 688.8
      expect(largeResult.current.width).toBeCloseTo(688.8);
    });
  });
});
