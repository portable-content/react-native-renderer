import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml, SvgUri } from 'react-native-svg';
import { useResponsiveScreen } from '../../../providers/ScreenProvider';
import {
  useResponsiveStyles,
  useResponsiveDimensions,
} from '../../../hooks/useResponsiveStyles';

export interface SvgElementProps {
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

export const SvgElement = ({
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
}: SvgElementProps) => {
  const { screenData, screenSize } = useResponsiveScreen();
  const responsiveStyles = useResponsiveStyles({ customPadding: padding });
  const [svgError, setSvgError] = useState<string | null>(null);

  // Get responsive dimensions using the new hook
  const { width: responsiveWidth, height: responsiveHeight } =
    useResponsiveDimensions({
      width,
      height,
      minWidth,
      maxWidth,
      padding: responsiveStyles.padding,
      preserveAspectRatio,
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

  const renderSvg = () => {
    try {
      if (svgContent) {
        return (
          <SvgXml
            xml={svgContent}
            width={responsiveWidth}
            height={responsiveHeight}
            preserveAspectRatio={preserveAspectRatio ? 'xMidYMid meet' : 'none'}
            onError={error => setSvgError(`SVG Content Error: ${error}`)}
          />
        );
      }

      if (svgUri) {
        return (
          <SvgUri
            uri={svgUri}
            width={responsiveWidth}
            height={responsiveHeight}
            preserveAspectRatio={preserveAspectRatio ? 'xMidYMid meet' : 'none'}
            onError={error => setSvgError(`SVG URI Error: ${error}`)}
          />
        );
      }

      if (svgSource) {
        // For local SVG files, we'd need to read the content first
        // This is a placeholder for local SVG handling
        return (
          <View
            style={[
              styles.placeholder,
              { width: responsiveWidth, height: responsiveHeight },
            ]}
          >
            <Text style={styles.placeholderText}>
              Local SVG support coming soon
            </Text>
          </View>
        );
      }

      return (
        <View
          style={[
            styles.placeholder,
            { width: responsiveWidth, height: responsiveHeight },
          ]}
        >
          <Text style={styles.placeholderText}>No SVG source provided</Text>
        </View>
      );
    } catch (error) {
      setSvgError(`SVG Render Error: ${error}`);
      return null;
    }
  };

  const renderError = () => {
    if (!svgError) return null;

    return (
      <View
        style={[
          styles.errorContainer,
          { width: responsiveWidth, height: responsiveHeight },
        ]}
      >
        <Text style={styles.errorText}>⚠️ SVG Error</Text>
        <Text style={styles.errorDetails}>{svgError}</Text>
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {title && <Text style={titleStyle}>{title}</Text>}
      <View style={styles.svgContainer}>
        {svgError ? renderError() : renderSvg()}
      </View>
      <View style={styles.screenInfo}>
        <Text style={styles.infoText}>
          Screen: {screenData.width}×{screenData.height} ({screenSize})
        </Text>
        <Text style={styles.infoText}>
          SVG: {Math.round(responsiveWidth)}×
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
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
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
