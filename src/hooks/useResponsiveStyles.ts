import { useMemo } from 'react';
import { useResponsiveScreen, type ScreenSize } from '../providers/ScreenProvider';

export interface ResponsiveStyleValues {
  padding: number;
  titleSize: number;
  fontSize: number;
  lineHeight: number;
}

// Responsive style configurations for each screen size
export const RESPONSIVE_STYLES: Record<ScreenSize, ResponsiveStyleValues> = {
  small: {
    padding: 12,
    titleSize: 18,
    fontSize: 14,
    lineHeight: 20,
  },
  medium: {
    padding: 16,
    titleSize: 22,
    fontSize: 16,
    lineHeight: 24,
  },
  large: {
    padding: 20,
    titleSize: 26,
    fontSize: 18,
    lineHeight: 28,
  },
} as const;

export interface UseResponsiveStylesOptions {
  /** Override the default padding */
  customPadding?: number;
  /** Override the default title size */
  customTitleSize?: number;
  /** Override the default font size */
  customFontSize?: number;
  /** Override the default line height */
  customLineHeight?: number;
}

/**
 * Hook that provides responsive style values based on current screen size
 * @param options - Optional overrides for specific style values
 * @returns Responsive style values for the current screen size
 */
export const useResponsiveStyles = (options: UseResponsiveStylesOptions = {}): ResponsiveStyleValues => {
  const { screenSize } = useResponsiveScreen();
  const {
    customPadding,
    customTitleSize,
    customFontSize,
    customLineHeight,
  } = options;

  return useMemo(() => {
    const baseStyles = RESPONSIVE_STYLES[screenSize];
    
    return {
      padding: customPadding ?? baseStyles.padding,
      titleSize: customTitleSize ?? baseStyles.titleSize,
      fontSize: customFontSize ?? baseStyles.fontSize,
      lineHeight: customLineHeight ?? baseStyles.lineHeight,
    };
  }, [screenSize, customPadding, customTitleSize, customFontSize, customLineHeight]);
};

/**
 * Hook that provides responsive dimensions calculation
 * @param options - Configuration for dimension calculations
 * @returns Calculated responsive dimensions
 */
export interface UseResponsiveDimensionsOptions {
  /** Custom width override */
  width?: number;
  /** Custom height override */
  height?: number;
  /** Minimum width constraint */
  minWidth?: number;
  /** Maximum width constraint */
  maxWidth?: number;
  /** Custom padding to account for in calculations */
  padding?: number;
  /** Whether to preserve aspect ratio when calculating height */
  preserveAspectRatio?: boolean;
  /** Original dimensions for aspect ratio calculations */
  originalDimensions?: { width: number; height: number };
}

export interface ResponsiveDimensions {
  width: number;
  height: number | undefined;
}

export const useResponsiveDimensions = (options: UseResponsiveDimensionsOptions = {}): ResponsiveDimensions => {
  const { screenData, screenSize } = useResponsiveScreen();
  const {
    width,
    height,
    minWidth = 100,
    maxWidth,
    padding,
    preserveAspectRatio = false,
    originalDimensions,
  } = options;

  return useMemo(() => {
    const responsiveStyles = RESPONSIVE_STYLES[screenSize];
    const effectivePadding = padding ?? responsiveStyles.padding;
    const availableWidth = screenData.width - (effectivePadding * 2);
    
    let responsiveWidth = width;
    let responsiveHeight = height;

    if (!responsiveWidth) {
      // Calculate responsive width based on screen size
      const widthPercentage = screenSize === 'small' ? 0.9 : screenSize === 'medium' ? 0.8 : 0.7;
      responsiveWidth = Math.max(minWidth, availableWidth * widthPercentage);
      
      if (maxWidth) {
        responsiveWidth = Math.min(responsiveWidth, maxWidth);
      }
    }

    if (!responsiveHeight && preserveAspectRatio && originalDimensions) {
      // Calculate height based on aspect ratio
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      responsiveHeight = responsiveWidth / aspectRatio;
    } else if (!responsiveHeight && !preserveAspectRatio) {
      // Default height calculation (4:3 aspect ratio)
      responsiveHeight = responsiveWidth * 0.75;
    }

    return {
      width: responsiveWidth,
      height: responsiveHeight,
    };
  }, [
    screenData,
    screenSize,
    width,
    height,
    minWidth,
    maxWidth,
    padding,
    preserveAspectRatio,
    originalDimensions,
  ]);
};
