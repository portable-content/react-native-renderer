import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';

export interface PortableContentProps extends Omit<ViewProps, 'style'> {
  /** Background color for the container */
  backgroundColor?: string;
  /** Custom padding override */
  padding?: number;
  /** Border radius for the container */
  borderRadius?: number;
  /** Custom width */
  width?: number;
  /** Custom height */
  height?: number;
  /** Minimum width constraint */
  minWidth?: number;
  /** Maximum width constraint */
  maxWidth?: number;
  /** Whether to show shadow/elevation */
  showShadow?: boolean;
  /** Additional custom styles */
  style?: ViewStyle;
  /** Child components to render inside the container */
  children: React.ReactNode;
}

/**
 * Responsive container component for portable content elements.
 * Provides consistent responsive styling and serves as the main container
 * for composing Element components (ImageElement, MarkupElement, SvgElement).
 *
 * This is the primary container in the portable content architecture.
 */
export const PortableContent = ({
  backgroundColor = '#ffffff',
  padding,
  borderRadius = 8,
  width,
  height,
  minWidth,
  maxWidth,
  showShadow = true,
  style,
  children,
  ...viewProps
}: PortableContentProps) => {
  const responsiveStyles = useResponsiveStyles({ customPadding: padding });

  const containerStyle: ViewStyle = {
    backgroundColor,
    padding: responsiveStyles.padding,
    borderRadius,
    ...(width && { width }),
    ...(height && { height }),
    ...(minWidth && { minWidth }),
    ...(maxWidth && { maxWidth }),
  };

  const combinedStyle = [
    showShadow ? styles.containerWithShadow : styles.containerNoShadow,
    containerStyle,
    style,
  ];

  return (
    <View style={combinedStyle} {...viewProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerNoShadow: {
    // No shadow styles
  },
});
