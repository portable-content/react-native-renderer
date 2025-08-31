import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { ResponsiveMarkup } from './ResponsiveMarkup';

const meta = {
  title: 'ResponsiveMarkup',
  component: ResponsiveMarkup,
  args: {
    content: 'This is <b>bold text</b> and this is <i>italic text</i>.<br/>Here is a new line with more content.',
    title: 'Sample Markup',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    scrollable: true,
  },
  decorators: [
    Story => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ResponsiveMarkup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    content: 'This is a simple markup example with <b>bold</b> and <i>italic</i> text.',
    title: 'Basic Example',
  },
};

export const LongContent: Story = {
  args: {
    content: `
      <b>Welcome to the Responsive Markup Component!</b><br/><br/>
      
      This component demonstrates how content adapts to different screen sizes. 
      The text size, padding, and layout automatically adjust based on the device width.<br/><br/>
      
      <i>Features include:</i><br/>
      • Responsive text sizing<br/>
      • Adaptive padding and spacing<br/>
      • Screen size detection<br/>
      • Basic markup parsing<br/>
      • Scrollable content support<br/><br/>
      
      <b>Supported markup tags:</b><br/>
      • &lt;b&gt; and &lt;strong&gt; for <b>bold text</b><br/>
      • &lt;i&gt; and &lt;em&gt; for <i>italic text</i><br/>
      • &lt;br/&gt; for line breaks<br/><br/>
      
      Try resizing your screen or rotating your device to see the responsive behavior in action!
      The component will automatically detect screen size changes and adjust the styling accordingly.
    `,
    title: 'Long Content Example',
    scrollable: true,
  },
};

export const NoTitle: Story = {
  args: {
    content: 'This example has no title, just the content with some <b>bold</b> and <i>italic</i> formatting.',
    scrollable: false,
  },
};

export const CustomColors: Story = {
  args: {
    content: 'This example uses custom colors for a <b>dark theme</b> appearance.<br/>The background is dark and the text is light.',
    title: 'Dark Theme',
    backgroundColor: '#2c3e50',
    textColor: '#ecf0f1',
  },
};

export const ColorfulTheme: Story = {
  args: {
    content: 'This is a <b>colorful example</b> with a bright background.<br/>Perfect for <i>highlighting important content</i>!',
    title: 'Bright Theme',
    backgroundColor: '#e8f5e8',
    textColor: '#2d5a2d',
  },
};

export const NonScrollable: Story = {
  args: {
    content: 'This content is not scrollable. It will fit within the available space without scrolling.',
    title: 'Fixed Height',
    scrollable: false,
  },
};

export const MinimalExample: Story = {
  args: {
    content: 'Just plain text without any markup.',
  },
};
