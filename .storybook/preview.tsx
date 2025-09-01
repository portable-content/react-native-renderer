import type { Preview } from '@storybook/react';
import { View } from 'react-native';
import { ScreenProvider } from '../src/providers/ScreenProvider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ScreenProvider>
        <View style={{ padding: 16, flex: 1 }}>
          <Story />
        </View>
      </ScreenProvider>
    ),
  ],
  parameters: {
    // actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
