import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { MarkupElement } from './MarkupElement';

const meta = {
  title: 'Elements/MarkupElement',
  component: MarkupElement,
  args: {
    content: 'Hello <b>World</b>!',
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
} satisfies Meta<typeof MarkupElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    content:
      'This is a basic markup element with some <b>bold</b> and <i>italic</i> text.',
    title: 'Basic Markup',
  },
};

export const WithTitle: Story = {
  args: {
    content: 'Content with a title above it.',
    title: 'Sample Title',
  },
};

export const RichContent: Story = {
  args: {
    content: `
      Welcome to <b>MarkupElement</b>!<br/>
      <br/>
      This component supports:<br/>
      • <b>Bold text</b><br/>
      • <i>Italic text</i><br/>
      • <strong>Strong emphasis</strong><br/>
      • <em>Emphasized text</em><br/>
      • Line breaks<br/>
      <br/>
      Perfect for displaying formatted content!
    `,
    title: 'Rich Content Example',
  },
};

export const CustomColors: Story = {
  args: {
    content: 'This markup has custom colors applied.',
    title: 'Custom Styling',
    backgroundColor: '#e8f5e8',
    textColor: '#2e7d32',
  },
};

export const LongScrollableContent: Story = {
  args: {
    content: `
      This is a long content example that demonstrates scrolling.<br/>
      <br/>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. <b>Sed do eiusmod</b> tempor incididunt ut labore et dolore magna aliqua.<br/>
      <br/>
      Ut enim ad minim veniam, quis nostrud <i>exercitation ullamco</i> laboris nisi ut aliquip ex ea commodo consequat.<br/>
      <br/>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br/>
      <br/>
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/>
      <br/>
      <strong>More content continues...</strong><br/>
      <br/>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.<br/>
      <br/>
      Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    `,
    title: 'Scrollable Content',
    scrollable: true,
  },
};

export const NonScrollable: Story = {
  args: {
    content:
      'This content is not scrollable, so it will expand to fit all content.',
    title: 'Non-Scrollable',
    scrollable: false,
  },
};
