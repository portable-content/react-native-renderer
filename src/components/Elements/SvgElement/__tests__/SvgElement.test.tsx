import React from 'react';
import { render, act } from '@testing-library/react-native';
import { SvgElement } from '../SvgElement';
import { ScreenProvider } from '../../../../providers/ScreenProvider';

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  SvgXml: ({ xml, width, height, onError }: any) => {
    const MockSvgXml = require('react-native').View;
    return (
      <MockSvgXml
        testID="svg-xml"
        style={{ width, height }}
        onLayout={() => {
          // Simulate successful render
        }}
      />
    );
  },
  SvgUri: ({ uri, width, height, onError }: any) => {
    const MockSvgUri = require('react-native').View;
    return (
      <MockSvgUri
        testID="svg-uri"
        style={{ width, height }}
        onLayout={() => {
          // Simulate successful render
        }}
      />
    );
  },
}));

const sampleSvgContent = `
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
  </svg>
`;

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ScreenProvider>{children}</ScreenProvider>
);

describe('SvgElement', () => {
  it('renders correctly with SVG content', () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <SvgElement svgContent={sampleSvgContent} />
      </TestWrapper>
    );

    expect(getByTestId('svg-xml')).toBeTruthy();
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('renders with title when provided', () => {
    const { getByText } = render(
      <TestWrapper>
        <SvgElement svgContent={sampleSvgContent} title="Test SVG" />
      </TestWrapper>
    );

    expect(getByText('Test SVG')).toBeTruthy();
  });

  it('displays screen size information', () => {
    const { getByText } = render(
      <TestWrapper>
        <SvgElement svgContent={sampleSvgContent} />
      </TestWrapper>
    );

    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('renders SVG with URI', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <SvgElement svgUri="https://example.com/test.svg" />
      </TestWrapper>
    );

    expect(getByTestId('svg-uri')).toBeTruthy();
  });

  it('handles custom dimensions', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <SvgElement svgContent={sampleSvgContent} width={200} height={150} />
      </TestWrapper>
    );

    const svgElement = getByTestId('svg-xml');
    expect(svgElement).toHaveStyle({ width: 200, height: 150 });
  });

  it('integrates with ScreenProvider for responsive behavior', () => {
    const { getByText } = render(
      <TestWrapper>
        <SvgElement svgContent={sampleSvgContent} />
      </TestWrapper>
    );

    // Should display the current screen size from ScreenProvider
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('shows placeholder when no SVG source provided', () => {
    const { getByText } = render(
      <TestWrapper>
        <SvgElement />
      </TestWrapper>
    );

    expect(getByText('No SVG source provided')).toBeTruthy();
  });

  it('shows placeholder for local SVG source', () => {
    const { getByText } = render(
      <TestWrapper>
        <SvgElement svgSource={12345} />
      </TestWrapper>
    );

    expect(getByText('Local SVG support coming soon')).toBeTruthy();
  });

  it('uses centralized screen management', () => {
    const { getByText } = render(
      <TestWrapper>
        <SvgElement svgContent={sampleSvgContent} />
      </TestWrapper>
    );

    // The component should use the mocked ScreenProvider
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });
});
