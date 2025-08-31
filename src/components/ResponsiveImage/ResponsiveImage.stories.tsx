import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { ResponsiveImage } from './ResponsiveImage';

const meta = {
  title: 'ResponsiveImage',
  component: ResponsiveImage,
  args: {
    source: require('../../../assets/icon.png'),
    title: 'Sample Image',
    backgroundColor: '#ffffff',
    resizeMode: 'contain',
    showLoadingIndicator: true,
  },
  decorators: [
    Story => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ResponsiveImage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    source: require('../../../assets/icon.png'),
    title: 'Basic Image Example',
  },
};

export const SplashImage: Story = {
  args: {
    source: require('../../../assets/splash.png'),
    title: 'Splash Screen Image',
    backgroundColor: '#f8f9fa',
  },
};

export const AdaptiveIcon: Story = {
  args: {
    source: require('../../../assets/adaptive-icon.png'),
    title: 'Adaptive Icon',
    borderRadius: 20,
  },
};

export const CustomDimensions: Story = {
  args: {
    source: require('../../../assets/icon.png'),
    title: 'Custom Size (150x150)',
    width: 150,
    height: 150,
  },
};

export const WithMaxWidth: Story = {
  args: {
    source: require('../../../assets/splash.png'),
    title: 'With Max Width (200px)',
    maxWidth: 200,
  },
};

export const CoverMode: Story = {
  args: {
    source: require('../../../assets/splash.png'),
    title: 'Cover Resize Mode',
    resizeMode: 'cover',
    width: 300,
    height: 200,
    borderRadius: 12,
  },
};

export const StretchMode: Story = {
  args: {
    source: require('../../../assets/icon.png'),
    title: 'Stretch Resize Mode',
    resizeMode: 'stretch',
    width: 300,
    height: 150,
  },
};

export const RoundedImage: Story = {
  args: {
    source: require('../../../assets/icon.png'),
    title: 'Rounded Image',
    borderRadius: 75,
    width: 150,
    height: 150,
  },
};

export const DarkTheme: Story = {
  args: {
    source: require('../../../assets/icon.png'),
    title: 'Dark Theme',
    backgroundColor: '#121212',
    borderRadius: 8,
  },
};

export const RemoteImage: Story = {
  args: {
    source: { uri: 'https://picsum.photos/400/300' },
    title: 'Remote Image (Lorem Picsum)',
    maxWidth: 300,
    accessibilityLabel: 'Random image from Lorem Picsum',
  },
};

export const HighQualityRemote: Story = {
  args: {
    source: { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
    title: 'High Quality Remote Image',
    maxWidth: 400,
    borderRadius: 12,
    accessibilityLabel: 'Beautiful landscape photo from Unsplash',
  },
};

export const WithCustomPadding: Story = {
  args: {
    source: require('../../../assets/icon.png'),
    title: 'Custom Padding',
    padding: 30,
    backgroundColor: '#e8f5e8',
  },
};

export const NoLoadingIndicator: Story = {
  args: {
    source: { uri: 'https://picsum.photos/300/200' },
    title: 'No Loading Indicator',
    showLoadingIndicator: false,
  },
};

export const ErrorHandling: Story = {
  args: {
    source: { uri: 'https://invalid-url-that-will-fail.com/image.jpg' },
    title: 'Error Handling Example',
  },
};

export const NoImageSource: Story = {
  args: {
    title: 'No Image Source',
    // No source provided
  },
};

export const SmallIcon: Story = {
  args: {
    source: require('../../../assets/favicon.png'),
    title: 'Small Icon (Favicon)',
    width: 64,
    height: 64,
    borderRadius: 8,
  },
};

export const ResponsiveGallery: Story = {
  args: {
    source: require('../../../assets/splash.png'),
    title: 'Gallery Style',
    backgroundColor: '#000000',
    resizeMode: 'contain',
    borderRadius: 4,
  },
};
