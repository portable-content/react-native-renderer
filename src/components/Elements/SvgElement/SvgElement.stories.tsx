import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { SvgElement } from './SvgElement';

const sampleSvgContent = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" stroke="#4CAF50" stroke-width="4" fill="#E8F5E8" />
  <text x="100" y="110" text-anchor="middle" font-family="Arial" font-size="16" fill="#2E7D32">SVG Element</text>
</svg>
`;

const complexSvgContent = `
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4ecdc4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#grad1)" />
  <circle cx="150" cy="100" r="60" fill="white" opacity="0.8" />
  <text x="150" y="110" text-anchor="middle" font-family="Arial" font-size="18" fill="#333">Complex SVG</text>
</svg>
`;

const meta = {
  title: 'Elements/SvgElement',
  component: SvgElement,
  args: {
    svgContent: sampleSvgContent,
    backgroundColor: '#ffffff',
    preserveAspectRatio: true,
  },
  decorators: [
    Story => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SvgElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    svgContent: sampleSvgContent,
    title: 'Basic SVG',
  },
};

export const WithTitle: Story = {
  args: {
    svgContent: sampleSvgContent,
    title: 'SVG with Title',
  },
};

export const ComplexSvg: Story = {
  args: {
    svgContent: complexSvgContent,
    title: 'Complex SVG with Gradients',
  },
};

export const CustomDimensions: Story = {
  args: {
    svgContent: sampleSvgContent,
    title: 'Custom Size',
    width: 150,
    height: 150,
  },
};

export const WithConstraints: Story = {
  args: {
    svgContent: sampleSvgContent,
    title: 'With Min/Max Width',
    minWidth: 100,
    maxWidth: 250,
  },
};

export const RemoteSvg: Story = {
  args: {
    svgUri: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/tiger.svg',
    title: 'Remote SVG',
    width: 200,
    height: 200,
  },
};

export const CustomBackground: Story = {
  args: {
    svgContent: sampleSvgContent,
    title: 'Custom Background',
    backgroundColor: '#f3e5f5',
    padding: 20,
  },
};

export const NoAspectRatio: Story = {
  args: {
    svgContent: sampleSvgContent,
    title: 'No Aspect Ratio Preservation',
    preserveAspectRatio: false,
    width: 300,
    height: 100,
  },
};

export const NoSource: Story = {
  args: {
    title: 'No SVG Source',
    // No svgContent, svgUri, or svgSource provided
  },
};
