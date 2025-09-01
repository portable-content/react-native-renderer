import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useResponsiveScreen } from '../../providers/ScreenProvider';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';

interface ResponsiveMarkupProps {
  /** The markup content to display */
  content: string;
  /** Optional title for the markup */
  title?: string;
  /** Background color for the component */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Whether to enable scrolling for long content */
  scrollable?: boolean;
}

export const ResponsiveMarkup = ({
  content,
  title,
  backgroundColor = '#ffffff',
  textColor = '#333333',
  scrollable = true,
}: ResponsiveMarkupProps) => {
  const { screenData, screenSize } = useResponsiveScreen();
  const responsiveStyles = useResponsiveStyles();

  // Simple markup parser for basic HTML-like tags
  const parseMarkup = (markup: string) => {
    // Split content by common HTML-like tags and render accordingly
    const parts = markup.split(/(<\/?[^>]+>)/g);
    const elements: React.ReactNode[] = [];
    let currentStyle: any = {};
    let key = 0;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.startsWith('<') && part.endsWith('>')) {
        // Handle tags
        const tag = part.toLowerCase();
        if (tag === '<b>' || tag === '<strong>') {
          currentStyle = { ...currentStyle, fontWeight: 'bold' };
        } else if (tag === '</b>' || tag === '</strong>') {
          const { fontWeight, ...rest } = currentStyle;
          currentStyle = rest;
        } else if (tag === '<i>' || tag === '<em>') {
          currentStyle = { ...currentStyle, fontStyle: 'italic' };
        } else if (tag === '</i>' || tag === '</em>') {
          const { fontStyle, ...rest } = currentStyle;
          currentStyle = rest;
        } else if (tag === '<br>' || tag === '<br/>') {
          elements.push(<Text key={key++}>{'\n'}</Text>);
        }
      } else if (part.trim()) {
        // Handle text content
        elements.push(
          <Text
            key={key++}
            style={[
              styles.contentText,
              {
                fontSize: responsiveStyles.fontSize,
                lineHeight: responsiveStyles.lineHeight,
                color: textColor,
              },
              currentStyle,
            ]}
          >
            {part}
          </Text>
        );
      }
    }

    return elements;
  };

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
      color: textColor,
      marginBottom: responsiveStyles.padding / 2,
    },
  ];

  const ContentComponent = scrollable ? ScrollView : View;

  return (
    <View style={containerStyle}>
      {title && <Text style={titleStyle}>{title}</Text>}
      <ContentComponent
        style={scrollable ? styles.scrollContainer : styles.staticContainer}
        showsVerticalScrollIndicator={scrollable}
      >
        <View style={styles.contentContainer}>
          {parseMarkup(content)}
          <View style={styles.screenInfo}>
            <Text style={[styles.infoText, { color: textColor }]}>
              Screen: {screenData.width}×{screenData.height} ({screenSize})
            </Text>
          </View>
        </View>
      </ContentComponent>
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
  scrollContainer: {
    flex: 1,
  },
  staticContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentText: {
    flexWrap: 'wrap',
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
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
