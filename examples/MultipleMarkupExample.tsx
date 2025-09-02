import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { PortableContent, MarkupElement, ScreenProvider } from '../src';

/**
 * Example showing multiple MarkupElement components with individual dynamic changes
 */

export const MultipleMarkupExample = () => {
  // Individual state for each markup component
  const [markup1State, setMarkup1State] = useState({
    backgroundColor: '#e3f2fd', // Blue
    content: '<b>Markup 1</b><br/>I have a blue background!',
    textColor: '#1976d2',
  });

  const [markup2State, setMarkup2State] = useState({
    backgroundColor: '#e8f5e8', // Green
    content: '<b>Markup 2</b><br/>I have a green background!',
    textColor: '#388e3c',
  });

  const [markup3State, setMarkup3State] = useState({
    backgroundColor: '#ffffff', // White (doesn't change)
    content: '<b>Markup 3</b><br/>My background stays the same!',
    textColor: '#333333',
  });

  // Auto-animation for markup 1 and 2 only
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        // Animate markup 1 (blue variations)
        setMarkup1State(prev => ({
          ...prev,
          backgroundColor:
            prev.backgroundColor === '#e3f2fd' ? '#bbdefb' : '#e3f2fd',
          content: `<b>Markup 1</b><br/>Animated blue: ${Date.now() % 1000}`,
        }));

        // Animate markup 2 (green variations)
        setMarkup2State(prev => ({
          ...prev,
          backgroundColor:
            prev.backgroundColor === '#e8f5e8' ? '#c8e6c9' : '#e8f5e8',
          content: `<b>Markup 2</b><br/>Animated green: ${Date.now() % 1000}`,
        }));

        // Markup 3 stays unchanged during animation
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  return (
    <ScreenProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Multiple MarkupElement Components</Text>
        <Text style={styles.subtitle}>
          Each component has independent dynamic properties
        </Text>

        {/* Controls */}
        <View style={styles.controlPanel}>
          <Text style={styles.sectionTitle}>Controls</Text>

          {/* Markup 1 Controls */}
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Markup 1 (Blue Theme)</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#1976d2' }]}
                onPress={() =>
                  setMarkup1State(prev => ({
                    ...prev,
                    backgroundColor: '#e3f2fd',
                    textColor: '#1976d2',
                  }))
                }
              >
                <Text style={styles.buttonText}>Light Blue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#0d47a1' }]}
                onPress={() =>
                  setMarkup1State(prev => ({
                    ...prev,
                    backgroundColor: '#1976d2',
                    textColor: '#ffffff',
                  }))
                }
              >
                <Text style={styles.buttonText}>Dark Blue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ff5722' }]}
                onPress={() =>
                  setMarkup1State(prev => ({
                    ...prev,
                    content: `<b>Updated!</b><br/>Content changed at ${new Date().toLocaleTimeString()}`,
                  }))
                }
              >
                <Text style={styles.buttonText}>Change Content</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Markup 2 Controls */}
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Markup 2 (Green Theme)</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#388e3c' }]}
                onPress={() =>
                  setMarkup2State(prev => ({
                    ...prev,
                    backgroundColor: '#e8f5e8',
                    textColor: '#388e3c',
                  }))
                }
              >
                <Text style={styles.buttonText}>Light Green</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#1b5e20' }]}
                onPress={() =>
                  setMarkup2State(prev => ({
                    ...prev,
                    backgroundColor: '#388e3c',
                    textColor: '#ffffff',
                  }))
                }
              >
                <Text style={styles.buttonText}>Dark Green</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ff5722' }]}
                onPress={() =>
                  setMarkup2State(prev => ({
                    ...prev,
                    content: `<b>Green Update!</b><br/>Modified at ${new Date().toLocaleTimeString()}`,
                  }))
                }
              >
                <Text style={styles.buttonText}>Change Content</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Markup 3 Controls */}
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Markup 3 (Static Background)</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#666' }]}
                onPress={() =>
                  setMarkup3State(prev => ({
                    ...prev,
                    content: `<b>Content Only!</b><br/>Background stays white. Updated: ${new Date().toLocaleTimeString()}`,
                  }))
                }
              >
                <Text style={styles.buttonText}>Change Content Only</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#9c27b0' }]}
                onPress={() =>
                  setMarkup3State(prev => ({
                    ...prev,
                    textColor:
                      prev.textColor === '#333333' ? '#9c27b0' : '#333333',
                  }))
                }
              >
                <Text style={styles.buttonText}>Toggle Text Color</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Animation Control */}
          <TouchableOpacity
            style={[styles.button, isAnimating && styles.activeButton]}
            onPress={() => setIsAnimating(!isAnimating)}
          >
            <Text style={styles.buttonText}>
              {isAnimating ? '⏸️ Stop Animation' : '▶️ Animate Markup 1 & 2'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Multiple MarkupElement Components */}
        <PortableContent backgroundColor="#f5f5f5" padding={16}>
          <Text style={styles.sectionTitle}>Live Components</Text>

          {/* Markup 1 - Blue theme with dynamic changes */}
          <View style={styles.markupContainer}>
            <Text style={styles.componentTitle}>MarkupElement #1</Text>
            <MarkupElement
              content={markup1State.content}
              backgroundColor={markup1State.backgroundColor}
              textColor={markup1State.textColor}
              fontSize={16}
            />
          </View>

          {/* Markup 2 - Green theme with dynamic changes */}
          <View style={styles.markupContainer}>
            <Text style={styles.componentTitle}>MarkupElement #2</Text>
            <MarkupElement
              content={markup2State.content}
              backgroundColor={markup2State.backgroundColor}
              textColor={markup2State.textColor}
              fontSize={16}
            />
          </View>

          {/* Markup 3 - Static background, only content/text color changes */}
          <View style={styles.markupContainer}>
            <Text style={styles.componentTitle}>MarkupElement #3</Text>
            <MarkupElement
              content={markup3State.content}
              backgroundColor={markup3State.backgroundColor}
              textColor={markup3State.textColor}
              fontSize={16}
            />
          </View>
        </PortableContent>

        {/* Code Example */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Code Example</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {`// Individual state for each markup
const [markup1, setMarkup1] = useState({
  backgroundColor: '#e3f2fd',
  content: 'Blue markup content',
  textColor: '#1976d2',
});

const [markup2, setMarkup2] = useState({
  backgroundColor: '#e8f5e8', 
  content: 'Green markup content',
  textColor: '#388e3c',
});

// Each component gets its own props
<ResponsiveMarkup
  content={markup1.content}
  backgroundColor={markup1.backgroundColor}
  textColor={markup1.textColor}
/>

<ResponsiveMarkup
  content={markup2.content}
  backgroundColor={markup2.backgroundColor}
  textColor={markup2.textColor}
/>`}
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
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  activeButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  markupContainer: {
    marginBottom: 20,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
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
    fontSize: 11,
    lineHeight: 16,
  },
});
