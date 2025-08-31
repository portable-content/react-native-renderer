import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { SvgXml, SvgUri } from 'react-native-svg';

interface ResponsiveSvgProps {
  /** SVG content as string (for inline SVG) */
  svgContent?: string;
  /** URI for remote SVG file */
  svgUri?: string;
  /** Local SVG file require() - for local assets */
  svgSource?: any;
  /** Optional title for the SVG */
  title?: string;
  /** Background color for the component */
  backgroundColor?: string;
  /** Whether to maintain aspect ratio */
  preserveAspectRatio?: boolean;
  /** Custom width (if not provided, will be responsive) */
  width?: number;
  /** Custom height (if not provided, will be responsive) */
  height?: number;
  /** Minimum width for the SVG */
  minWidth?: number;
  /** Maximum width for the SVG */
  maxWidth?: number;
  /** Padding around the SVG */
  padding?: number;
}

interface ScreenDimensions {
  width: number;
  height: number;
}

export const ResponsiveSvg = ({
  svgContent,
  svgUri,
  svgSource,
  title,
  backgroundColor = '#ffffff',
  preserveAspectRatio = true,
  width,
  height,
  minWidth = 100,
  maxWidth,
  padding,
}: ResponsiveSvgProps) => {
  const [screenData, setScreenData] = useState<ScreenDimensions>(
    Dimensions.get('window')
  );
  const [svgError, setSvgError] = useState<string | null>(null);

  useEffect(() => {
    const onChange = (result: { window: ScreenDimensions }) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Determine if we're on a small, medium, or large screen
  const getScreenSize = () => {
    if (screenData.width < 480) return 'small';
    if (screenData.width < 768) return 'medium';
    return 'large';
  };

  const screenSize = getScreenSize();

  // Get responsive dimensions
  const getResponsiveDimensions = () => {
    const availableWidth = screenData.width - (padding ? padding * 2 : 32);
    
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

    if (!responsiveHeight && preserveAspectRatio) {
      // If height not specified and we want to preserve aspect ratio,
      // let the SVG determine its own height based on width
      responsiveHeight = undefined;
    } else if (!responsiveHeight) {
      // Default height calculation
      responsiveHeight = responsiveWidth * 0.75; // 4:3 aspect ratio default
    }

    return {
      width: responsiveWidth,
      height: responsiveHeight,
    };
  };

  const dimensions = getResponsiveDimensions();

  // Get responsive styles
  const getResponsiveStyles = () => {
    const basePadding = padding || (screenSize === 'small' ? 12 : screenSize === 'medium' ? 16 : 20);
    const titleSize = screenSize === 'small' ? 18 : screenSize === 'medium' ? 22 : 26;

    return {
      padding: basePadding,
      titleSize,
    };
  };

  const responsiveStyles = getResponsiveStyles();

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

  const renderSvg = () => {
    try {
      if (svgContent) {
        return (
          <SvgXml
            xml={svgContent}
            width={dimensions.width}
            height={dimensions.height}
            preserveAspectRatio={preserveAspectRatio ? "xMidYMid meet" : "none"}
            onError={(error) => setSvgError(`SVG Content Error: ${error}`)}
          />
        );
      }

      if (svgUri) {
        return (
          <SvgUri
            uri={svgUri}
            width={dimensions.width}
            height={dimensions.height}
            preserveAspectRatio={preserveAspectRatio ? "xMidYMid meet" : "none"}
            onError={(error) => setSvgError(`SVG URI Error: ${error}`)}
          />
        );
      }

      if (svgSource) {
        // For local assets, we need to handle them differently
        // This would typically require additional setup for local SVG files
        return (
          <View style={[styles.placeholder, { width: dimensions.width, height: dimensions.height }]}>
            <Text style={styles.placeholderText}>
              Local SVG assets require additional setup
            </Text>
          </View>
        );
      }

      return (
        <View style={[styles.placeholder, { width: dimensions.width, height: dimensions.height }]}>
          <Text style={styles.placeholderText}>No SVG source provided</Text>
        </View>
      );
    } catch (error) {
      setSvgError(`Render Error: ${error}`);
      return null;
    }
  };

  return (
    <View style={containerStyle}>
      {title && <Text style={titleStyle}>{title}</Text>}
      
      <View style={styles.svgContainer}>
        {svgError ? (
          <View style={[styles.errorContainer, { width: dimensions.width, height: dimensions.height }]}>
            <Text style={styles.errorText}>⚠️ SVG Error</Text>
            <Text style={styles.errorDetails}>{svgError}</Text>
          </View>
        ) : (
          renderSvg()
        )}
      </View>

      <View style={styles.screenInfo}>
        <Text style={styles.infoText}>
          Screen: {screenData.width}×{screenData.height} ({screenSize})
        </Text>
        <Text style={styles.infoText}>
          SVG: {Math.round(dimensions.width)}×{dimensions.height ? Math.round(dimensions.height) : 'auto'}
        </Text>
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
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
    borderRadius: 8,
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
