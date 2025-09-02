import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import type { Preview } from '@storybook/react';
import { View } from 'react-native';
import { ScreenProvider } from '../src/providers/ScreenProvider';

const preview: Preview = {
  decorators: [
    Story => (
      <ScreenProvider>
        <View style={{ padding: 16, flex: 1 }}>
          <Story />
        </View>
      </ScreenProvider>
    ),
    withBackgrounds,
  ],

  parameters: {
    backgrounds: {
      default: 'plain',
      values: [
        { name: 'plain', value: 'white' },
        { name: 'warm', value: 'hotpink' },
        { name: 'cool', value: 'deepskyblue' },
      ],
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
