import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { ScreenProvider } from '../../providers/ScreenProvider';
import {
  useResponsiveStyles,
  useResponsiveDimensions,
  RESPONSIVE_STYLES
} from '../useResponsiveStyles';

// Mock Dimensions
const mockDimensions = {
  get: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ScreenProvider>{children}</ScreenProvider>
);

describe('useResponsiveStyles', () => {
  let mockSubscription: { remove: jest.Mock };

  beforeEach(() => {
    mockSubscription = { remove: jest.fn() };
    mockDimensions.addEventListener.mockReturnValue(mockSubscription);
    jest.clearAllMocks();
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
      mockDimensions.get.mockReturnValue({ width: 600, height: 800 });

      const { result } = renderHook(() => useResponsiveStyles(), { wrapper });

      expect(result.current).toEqual(RESPONSIVE_STYLES.medium);
    });

    it('should return large screen styles for width >= 768', () => {
      mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });

      const { result } = renderHook(() => useResponsiveStyles(), { wrapper });

      expect(result.current).toEqual(RESPONSIVE_STYLES.large);
    });

    it('should allow custom padding override', () => {
      mockDimensions.get.mockReturnValue({ width: 600, height: 800 });

      const { result } = renderHook(
        () => useResponsiveStyles({ customPadding: 24 }), 
        { wrapper }
      );

      expect(result.current.padding).toBe(24);
      expect(result.current.titleSize).toBe(RESPONSIVE_STYLES.medium.titleSize);
    });

    it('should allow multiple custom overrides', () => {
      mockDimensions.get.mockReturnValue({ width: 320, height: 568 });

      const { result } = renderHook(
        () => useResponsiveStyles({ 
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
    beforeEach(() => {
      mockDimensions.get.mockReturnValue({ width: 600, height: 800 });
    });

    it('should calculate responsive width based on screen size', () => {
      const { result } = renderHook(() => useResponsiveDimensions(), { wrapper });

      // Medium screen (600px): 0.8 * (600 - 32) = 0.8 * 568 = 454.4
      expect(result.current.width).toBeCloseTo(454.4);
      expect(result.current.height).toBeCloseTo(340.8); // 454.4 * 0.75
    });

    it('should use custom width when provided', () => {
      const { result } = renderHook(
        () => useResponsiveDimensions({ width: 300 }), 
        { wrapper }
      );

      expect(result.current.width).toBe(300);
      expect(result.current.height).toBe(225); // 300 * 0.75
    });

    it('should use custom height when provided', () => {
      const { result } = renderHook(
        () => useResponsiveDimensions({ width: 300, height: 200 }), 
        { wrapper }
      );

      expect(result.current.width).toBe(300);
      expect(result.current.height).toBe(200);
    });

    it('should respect minWidth constraint', () => {
      mockDimensions.get.mockReturnValue({ width: 200, height: 300 }); // Very small screen

      const { result } = renderHook(
        () => useResponsiveDimensions({ minWidth: 150 }), 
        { wrapper }
      );

      expect(result.current.width).toBeGreaterThanOrEqual(150);
    });

    it('should respect maxWidth constraint', () => {
      mockDimensions.get.mockReturnValue({ width: 1200, height: 800 }); // Large screen

      const { result } = renderHook(
        () => useResponsiveDimensions({ maxWidth: 400 }), 
        { wrapper }
      );

      expect(result.current.width).toBeLessThanOrEqual(400);
    });

    it('should calculate height based on aspect ratio when preserveAspectRatio is true', () => {
      const { result } = renderHook(
        () => useResponsiveDimensions({ 
          width: 400,
          preserveAspectRatio: true,
          originalDimensions: { width: 800, height: 600 }
        }), 
        { wrapper }
      );

      expect(result.current.width).toBe(400);
      expect(result.current.height).toBe(300); // 400 / (800/600) = 300
    });

    it('should return undefined height when preserveAspectRatio is true but no originalDimensions', () => {
      const { result } = renderHook(
        () => useResponsiveDimensions({ 
          width: 400,
          preserveAspectRatio: true
        }), 
        { wrapper }
      );

      expect(result.current.width).toBe(400);
      expect(result.current.height).toBeUndefined();
    });

    it('should account for custom padding in calculations', () => {
      const { result } = renderHook(
        () => useResponsiveDimensions({ padding: 40 }), 
        { wrapper }
      );

      // Available width: 600 - (40 * 2) = 520
      // Medium screen: 0.8 * 520 = 416
      expect(result.current.width).toBeCloseTo(416);
    });

    it('should handle different screen sizes correctly', () => {
      // Small screen
      mockDimensions.get.mockReturnValue({ width: 320, height: 568 });
      const { result: smallResult } = renderHook(() => useResponsiveDimensions(), { wrapper });
      
      // Small screen: 0.9 * (320 - 24) = 0.9 * 296 = 266.4
      expect(smallResult.current.width).toBeCloseTo(266.4);

      // Large screen
      mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });
      const { result: largeResult } = renderHook(() => useResponsiveDimensions(), { wrapper });
      
      // Large screen: 0.7 * (1024 - 40) = 0.7 * 984 = 688.8
      expect(largeResult.current.width).toBeCloseTo(688.8);
    });
  });
});
