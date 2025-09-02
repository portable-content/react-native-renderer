import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useResponsiveScreen } from '../../../providers/ScreenProvider';
import {
  useResponsiveStyles,
  useResponsiveDimensions,
} from '../../../hooks/useResponsiveStyles';
import { useImageDimensions } from '../../../hooks/useImageDimensions';

export interface ImageElementProps {
  /** Image source - can be local require() or remote URI */
  source: any;
  /** Optional title for the image */
  title?: string;
  /** Background color for the component */
  backgroundColor?: string;
  /** Resize mode for the image */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  /** Custom width (if not provided, will be responsive) */
  width?: number;
  /** Custom height (if not provided, will be responsive) */
  height?: number;
  /** Minimum width for the image */
  minWidth?: number;
  /** Maximum width for the image */
  maxWidth?: number;
  /** Padding around the image */
  padding?: number;
  /** Border radius for the image */
  borderRadius?: number;
  /** Whether to show loading indicator */
  showLoadingIndicator?: boolean;
  /** Alt text for accessibility */
  accessibilityLabel?: string;
}

export const ImageElement = ({
  source,
  title,
  backgroundColor = '#ffffff',
  resizeMode = 'contain',
  width,
  height,
  minWidth = 100,
  maxWidth,
  padding,
  borderRadius = 0,
  showLoadingIndicator = true,
  accessibilityLabel,
}: ImageElementProps) => {
  const { screenData, screenSize } = useResponsiveScreen();
  const responsiveStyles = useResponsiveStyles({ customPadding: padding });
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the new hook to get image dimensions
  const imageDimensions = useImageDimensions(source);

  // Get responsive dimensions using the new hook
  const { width: responsiveWidth, height: responsiveHeight } =
    useResponsiveDimensions({
      width,
      height,
      minWidth,
      maxWidth,
      padding: responsiveStyles.padding,
      preserveAspectRatio: resizeMode === 'contain' || resizeMode === 'cover',
      originalDimensions: imageDimensions,
    });

  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      padding: responsiveStyles.padding,
    },
  ];

  const titleStyle = [
    styles.title,
    {
      fontSize: responsiveStyles.titleSize,
      marginBottom: responsiveStyles.padding / 2,
    },
  ];

  const imageStyle = [
    styles.image,
    {
      width: responsiveWidth,
      height: responsiveHeight,
      borderRadius,
    },
  ];

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(null);
  };

  const handleImageError = (error: any) => {
    setIsLoading(false);
    setImageError(
      `Failed to load image: ${error.nativeEvent?.error || 'Unknown error'}`
    );
  };

  const renderImage = () => {
    if (!source) {
      return (
        <View
          style={[
            styles.placeholder,
            { width: responsiveWidth, height: responsiveHeight },
          ]}
        >
          <Text style={styles.placeholderText}>No image source provided</Text>
        </View>
      );
    }

    if (imageError) {
      return (
        <View
          style={[
            styles.errorContainer,
            { width: responsiveWidth, height: responsiveHeight },
          ]}
        >
          <Text style={styles.errorText}>⚠️ Image Error</Text>
          <Text style={styles.errorDetails}>{imageError}</Text>
        </View>
      );
    }

    return (
      <>
        <Image
          source={source}
          style={imageStyle}
          resizeMode={resizeMode}
          onLoad={handleImageLoad}
          onError={handleImageError}
          accessibilityLabel={accessibilityLabel}
        />
        {isLoading && showLoadingIndicator && (
          <View
            style={[
              styles.loadingContainer,
              { width: responsiveWidth, height: responsiveHeight },
            ]}
          >
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={containerStyle}>
      {title && <Text style={titleStyle}>{title}</Text>}
      {renderImage()}
      <View style={styles.screenInfo}>
        <Text style={styles.infoText}>
          Screen: {screenData.width}×{screenData.height} ({screenSize})
        </Text>
        <Text style={styles.infoText}>
          Image: {Math.round(responsiveWidth)}×
          {responsiveHeight ? Math.round(responsiveHeight) : 'auto'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  image: {
    marginVertical: 8,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 4,
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorDetails: {
    color: '#cc0000',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  loadingContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  screenInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
