import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useResponsiveScreen } from '../../providers/ScreenProvider';
import { useResponsiveStyles, useResponsiveDimensions } from '../../hooks/useResponsiveStyles';
import { useImageDimensions } from '../../hooks/useImageDimensions';

interface ResponsiveImageProps {
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

export const ResponsiveImage = ({
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
}: ResponsiveImageProps) => {
  const { screenData, screenSize } = useResponsiveScreen();
  const responsiveStyles = useResponsiveStyles({ customPadding: padding });
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the new hook to get image dimensions
  const imageDimensions = useImageDimensions(source);

  // Get responsive dimensions using the new hook
  const { width: responsiveWidth, height: responsiveHeight } = useResponsiveDimensions({
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
    setImageError(`Image failed to load: ${error.nativeEvent?.error || 'Unknown error'}`);
  };

  const renderImage = () => {
    if (!source) {
      return (
        <View style={[styles.placeholder, { width: responsiveWidth, height: responsiveHeight, borderRadius }]}>
          <Text style={styles.placeholderText}>No image source provided</Text>
        </View>
      );
    }

    if (imageError) {
      return (
        <View style={[styles.errorContainer, { width: responsiveWidth, height: responsiveHeight, borderRadius }]}>
          <Text style={styles.errorText}>⚠️ Image Error</Text>
          <Text style={styles.errorDetails}>{imageError}</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          source={source}
          style={imageStyle}
          resizeMode={resizeMode}
          onLoad={handleImageLoad}
          onError={handleImageError}
          accessibilityLabel={accessibilityLabel || title}
        />
        {isLoading && showLoadingIndicator && (
          <View style={[styles.loadingContainer, { width: responsiveWidth, height: responsiveHeight, borderRadius }]}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {title && <Text style={titleStyle}>{title}</Text>}
      
      <View style={styles.contentContainer}>
        {renderImage()}
      </View>

      <View style={styles.screenInfo}>
        <Text style={styles.infoText}>
          Screen: {screenData.width}×{screenData.height} ({screenSize})
        </Text>
        <Text style={styles.infoText}>
          Image: {Math.round(responsiveWidth)}×{Math.round(responsiveHeight || 0)}
        </Text>
        {imageDimensions && (
          <Text style={styles.infoText}>
            Original: {imageDimensions.width}×{imageDimensions.height}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#333333',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    backgroundColor: 'transparent',
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    borderWidth: 1,
    borderColor: '#ff9999',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorDetails: {
    color: '#cc0000',
    fontSize: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
  },
  screenInfo: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
