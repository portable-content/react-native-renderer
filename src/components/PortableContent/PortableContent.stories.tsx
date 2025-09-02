import React from 'react';
import { Text, View } from 'react-native';
import { PortableContent } from './PortableContent';
import { ScreenProvider } from '../../providers/ScreenProvider';
import { ImageElement, MarkupElement, SvgElement } from '../Elements';

export default {
  title: 'Components/PortableContent',
  component: PortableContent,
  decorators: [
    (Story: React.ComponentType) => (
      <ScreenProvider>
        <Story />
      </ScreenProvider>
    ),
  ],
};

export const Default = () => (
  <PortableContent>
    <Text>Default PortableContent with responsive padding and shadow</Text>
  </PortableContent>
);

export const CustomBackground = () => (
  <PortableContent backgroundColor="#f0f8ff">
    <Text>Container with custom background color</Text>
  </PortableContent>
);

export const NoShadow = () => (
  <PortableContent showShadow={false}>
    <Text>Container without shadow/elevation</Text>
  </PortableContent>
);

export const CustomPadding = () => (
  <PortableContent padding={32}>
    <Text>Container with custom padding (32px)</Text>
  </PortableContent>
);

export const CustomDimensions = () => (
  <PortableContent width={300} height={150} backgroundColor="#ffe4e1">
    <Text>Fixed size container (300x150)</Text>
  </PortableContent>
);

export const RoundedCorners = () => (
  <PortableContent borderRadius={20} backgroundColor="#f0fff0">
    <Text>Container with rounded corners (20px radius)</Text>
  </PortableContent>
);

export const WithElements = () => (
  <PortableContent backgroundColor="#f8f9fa" padding={20}>
    <MarkupElement
      content="This is a <b>MarkupElement</b> inside PortableContent"
      backgroundColor="transparent"
    />
    <View style={{ height: 16 }} />
    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
      Multiple Elements:
    </Text>
    <Text>• MarkupElement for rich text</Text>
    <Text>• ImageElement for images</Text>
    <Text>• SvgElement for vector graphics</Text>
  </PortableContent>
);

export const ElementComposition = () => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
    {/* Text Content Card */}
    <PortableContent
      backgroundColor="#fff3cd"
      width={200}
      height={150}
      borderRadius={12}
    >
      <MarkupElement
        content="<b>Rich Text Card</b><br/>This card contains formatted text with <i>markup support</i>."
        backgroundColor="transparent"
        scrollable={false}
      />
    </PortableContent>

    {/* Image Content Card */}
    <PortableContent
      backgroundColor="#e3f2fd"
      width={180}
      height={200}
      padding={16}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Image Card</Text>
      <ImageElement
        source={{ uri: 'https://picsum.photos/120/80' }}
        width={120}
        height={80}
        borderRadius={8}
      />
    </PortableContent>

    {/* SVG Content Card */}
    <PortableContent
      backgroundColor="#f3e5f5"
      width={250}
      height={180}
      padding={12}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>SVG Card</Text>
      <SvgElement
        svgContent={`
          <svg width="100" height="60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="30" r="25" fill="#4CAF50" />
            <text x="50" y="35" text-anchor="middle" font-size="12" fill="white">SVG</text>
          </svg>
        `}
        width={100}
        height={60}
        backgroundColor="transparent"
      />
    </PortableContent>

    {/* Mixed Content Card */}
    <PortableContent
      backgroundColor="#e8f5e8"
      width={220}
      height={200}
      showShadow={true}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Mixed Content</Text>
      <MarkupElement
        content="Text and graphics together:"
        backgroundColor="transparent"
        scrollable={false}
      />
      <View style={{ height: 8 }} />
      <SvgElement
        svgContent={`
          <svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="40" fill="#2196F3" rx="4" />
            <text x="40" y="25" text-anchor="middle" font-size="10" fill="white">Chart</text>
          </svg>
        `}
        width={80}
        height={40}
        backgroundColor="transparent"
      />
    </PortableContent>
  </View>
);

export const ResponsiveDemo = () => (
  <View>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
      PortableContent Responsive Demo
    </Text>
    <Text style={{ marginBottom: 16 }}>
      This container automatically adjusts its padding based on screen size:
    </Text>
    <PortableContent backgroundColor="#f8f9fa">
      <Text>
        • Small screens (&lt;480px): 12px padding{'\n'}• Medium screens
        (480-767px): 16px padding{'\n'}• Large screens (≥768px): 20px padding
        {'\n'}
        {'\n'}
        Current padding is responsive to your screen size!
      </Text>
    </PortableContent>
  </View>
);

export const WindowingSystemExample = () => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
    {/* Sticky Note Window */}
    <PortableContent
      backgroundColor="#fff3cd"
      width={200}
      height={150}
      borderRadius={4}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Sticky Note</Text>
      <Text>Remember to implement the new feature!</Text>
    </PortableContent>

    {/* Calculator Window */}
    <PortableContent
      backgroundColor="#e3f2fd"
      width={180}
      height={200}
      padding={16}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Calculator</Text>
      <Text>2 + 2 = 4</Text>
    </PortableContent>

    {/* Chat Window */}
    <PortableContent
      backgroundColor="#f3e5f5"
      width={250}
      height={180}
      padding={12}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Chat</Text>
      <Text>User: Hello!</Text>
      <Text>Bot: Hi there!</Text>
    </PortableContent>

    {/* Content Viewer Window */}
    <PortableContent
      backgroundColor="#e8f5e8"
      width={220}
      height={160}
      showShadow={false}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
        Content Viewer
      </Text>
      <View
        style={{
          backgroundColor: '#ddd',
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>📄 Content Placeholder</Text>
      </View>
    </PortableContent>
  </View>
);
