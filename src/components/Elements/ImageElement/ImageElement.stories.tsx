import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { ImageElement } from './ImageElement';

const meta = {
  title: 'Elements/ImageElement',
  component: ImageElement,
  args: {
    source: require('../../../../assets/icon.png'),
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
} satisfies Meta<typeof ImageElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    source: require('../../../../assets/icon.png'),
    title: 'Basic Image Example',
  },
};

export const WithCustomDimensions: Story = {
  args: {
    source: require('../../../../assets/icon.png'),
    title: 'Custom Dimensions',
    width: 200,
    height: 150,
  },
};

export const WithBorderRadius: Story = {
  args: {
    source: require('../../../../assets/icon.png'),
    title: 'Rounded Image',
    borderRadius: 20,
  },
};

export const WithCustomBackground: Story = {
  args: {
    source: require('../../../../assets/icon.png'),
    title: 'Custom Background',
    backgroundColor: '#e3f2fd',
    padding: 20,
  },
};

export const RemoteImage: Story = {
  args: {
    source: { uri: 'https://picsum.photos/300/200' },
    title: 'Remote Image',
    resizeMode: 'cover',
  },
};

export const WithConstraints: Story = {
  args: {
    source: require('../../../../assets/icon.png'),
    title: 'With Min/Max Width',
    minWidth: 150,
    maxWidth: 250,
  },
};
