import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  PortableContent,
  ImageElement,
  SvgElement,
  MarkupElement,
  ScreenProvider,
} from '../src';

/**
 * Example demonstrating dynamic property changes in all ResponsiveComponents
 *
 * This example shows how you can:
 * 1. Change background colors dynamically
 * 2. Adjust padding and dimensions in real-time
 * 3. Toggle features like shadows
 * 4. Update content dynamically
 * 5. Create animated effects with timers
 */

const colors = [
  '#ffffff',
  '#f0f8ff',
  '#fff3cd',
  '#e3f2fd',
  '#f3e5f5',
  '#e8f5e8',
  '#ffe4e1',
];
const colorNames = [
  'White',
  'Alice Blue',
  'Light Yellow',
  'Light Blue',
  'Light Purple',
  'Light Green',
  'Misty Rose',
];

export const DynamicPropsExample = () => {
  // Shared state for all components
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [padding, setPadding] = useState(16);
  const [showShadow, setShowShadow] = useState(true);
  const [borderRadius, setBorderRadius] = useState(8);

  // Auto-animation state
  const [isAnimating, setIsAnimating] = useState(false);

  // Dynamic content state
  const [markupContent, setMarkupContent] = useState(
    '<b>Dynamic</b> content that <em>updates</em> in real-time!'
  );
  const [imageSource, setImageSource] = useState(
    'https://picsum.photos/200/150?random=1'
  );

  const currentColor = colors[currentColorIndex];
  const currentColorName = colorNames[currentColorIndex];

  // Auto-animation effect
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCurrentColorIndex(prev => (prev + 1) % colors.length);
        setPadding(prev => (prev === 16 ? 24 : 16));
        setBorderRadius(prev => (prev === 8 ? 16 : 8));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Dynamic SVG that changes based on current color
  const dynamicSvg = `
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="${currentColor === '#ffffff' ? '#4CAF50' : '#2196F3'}" opacity="0.8"/>
      <circle cx="60" cy="60" r="30" fill="${currentColor === '#ffffff' ? '#FF9800' : '#E91E63'}" opacity="0.6"/>
      <text x="60" y="65" text-anchor="middle" fill="white" font-size="14" font-weight="bold">SVG</text>
    </svg>
  `;

  return (
    <ScreenProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Dynamic Props Example</Text>
        <Text style={styles.subtitle}>
          All PortableContent components support real-time property updates!
        </Text>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <Text style={styles.sectionTitle}>Global Controls</Text>

          {/* Color Selection */}
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Background: {currentColorName}</Text>
            <View style={styles.colorRow}>
              {colors.map((color, index) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    currentColorIndex === index && styles.selectedColor,
                  ]}
                  onPress={() => setCurrentColorIndex(index)}
                />
              ))}
            </View>
          </View>

          {/* Padding Control */}
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Padding: {padding}px</Text>
            <View style={styles.buttonRow}>
              {[8, 16, 24, 32].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.button, padding === p && styles.activeButton]}
                  onPress={() => setPadding(p)}
                >
                  <Text style={styles.buttonText}>{p}px</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Border Radius Control */}
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Border Radius: {borderRadius}px</Text>
            <View style={styles.buttonRow}>
              {[0, 8, 16, 24].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.button,
                    borderRadius === r && styles.activeButton,
                  ]}
                  onPress={() => setBorderRadius(r)}
                >
                  <Text style={styles.buttonText}>{r}px</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Feature Toggles */}
          <View style={styles.controlGroup}>
            <TouchableOpacity
              style={[styles.button, showShadow && styles.activeButton]}
              onPress={() => setShowShadow(!showShadow)}
            >
              <Text style={styles.buttonText}>
                Shadow: {showShadow ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isAnimating && styles.animatingButton]}
              onPress={() => setIsAnimating(!isAnimating)}
            >
              <Text style={styles.buttonText}>
                {isAnimating ? '⏸️ Stop Animation' : '▶️ Start Animation'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Components Demo */}
        <View style={styles.componentsSection}>
          <Text style={styles.sectionTitle}>Live Components</Text>

          {/* PortableContent */}
          <View style={styles.componentDemo}>
            <Text style={styles.componentTitle}>PortableContent</Text>
            <PortableContent
              backgroundColor={currentColor}
              padding={padding}
              borderRadius={borderRadius}
              showShadow={showShadow}
            >
              <Text style={styles.demoText}>🎨 Dynamic Container</Text>
              <Text style={styles.smallText}>
                Color: {currentColorName} • Padding: {padding}px • Radius:{' '}
                {borderRadius}px
              </Text>
            </PortableContent>
          </View>

          {/* SvgElement */}
          <View style={styles.componentDemo}>
            <Text style={styles.componentTitle}>SvgElement</Text>
            <SvgElement
              svgContent={dynamicSvg}
              backgroundColor={currentColor}
              padding={padding}
              width={140}
              height={140}
            />
          </View>

          {/* ImageElement */}
          <View style={styles.componentDemo}>
            <Text style={styles.componentTitle}>ImageElement</Text>
            <ImageElement
              source={{ uri: imageSource }}
              backgroundColor={currentColor}
              padding={padding}
              borderRadius={borderRadius}
              width={200}
              height={150}
            />
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() =>
                setImageSource(
                  `https://picsum.photos/200/150?random=${Math.floor(Math.random() * 100)}`
                )
              }
            >
              <Text style={styles.buttonText}>🔄 New Image</Text>
            </TouchableOpacity>
          </View>

          {/* MarkupElement */}
          <View style={styles.componentDemo}>
            <Text style={styles.componentTitle}>MarkupElement</Text>
            <MarkupElement
              content={markupContent}
              backgroundColor={currentColor}
              textColor={currentColor === '#ffffff' ? '#333' : '#000'}
            />
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => {
                const messages = [
                  '<b>Dynamic</b> content that <em>updates</em> in real-time!',
                  '<strong>Responsive</strong> markup with <i>live</i> updates!<br/>Background: <b>' +
                    currentColorName +
                    '</b>',
                  'All properties can be <em>changed dynamically</em>!<br/><b>Try the controls above!</b>',
                  'Perfect for <strong>windowing systems</strong><br/>and <i>dynamic interfaces</i>!',
                ];
                setMarkupContent(
                  messages[Math.floor(Math.random() * messages.length)]
                );
              }}
            >
              <Text style={styles.buttonText}>📝 Change Text</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Usage Example */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Usage Example</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {`// All props can be changed dynamically:
const [bgColor, setBgColor] = useState('#ffffff');
const [padding, setPadding] = useState(16);

return (
  <PortableContent
    backgroundColor={bgColor}
    padding={padding}
    borderRadius={8}
    showShadow={true}
  >
    <Text>Dynamic content!</Text>
    <Button
      title="Change Color"
      onPress={() => setBgColor('#ff0000')}
    />
  </PortableContent>
);`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#666',
  },
  controlPanel: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  controlGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 4,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  smallButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  activeButton: {
    backgroundColor: '#34C759',
  },
  animatingButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  componentsSection: {
    margin: 16,
  },
  componentDemo: {
    marginBottom: 24,
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  demoText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  smallText: {
    fontSize: 12,
    color: '#666',
  },
  codeSection: {
    margin: 16,
    marginBottom: 32,
  },
  codeBlock: {
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    color: '#e2e8f0',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
