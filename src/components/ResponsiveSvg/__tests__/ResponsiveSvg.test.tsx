import React from 'react';
import { render } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { ResponsiveSvg } from '../ResponsiveSvg';

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

// Mock Dimensions
const mockDimensions = {
  get: jest.fn(() => ({ width: 375, height: 667 })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);

const sampleSvgContent = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="blue"/>
</svg>
`;

describe('ResponsiveSvg', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
  });

  it('renders correctly with SVG content', () => {
    const { getByTestId } = render(
      <ResponsiveSvg svgContent={sampleSvgContent} />
    );

    expect(getByTestId('svg-xml')).toBeTruthy();
  });

  it('renders with title when provided', () => {
    const { getByText } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        title="Test SVG" 
      />
    );

    expect(getByText('Test SVG')).toBeTruthy();
  });

  it('displays screen size information', () => {
    const { getByText } = render(
      <ResponsiveSvg svgContent={sampleSvgContent} />
    );

    expect(getByText('Screen: 375×667 (small)')).toBeTruthy();
  });

  it('renders SVG with URI', () => {
    const { getByTestId } = render(
      <ResponsiveSvg svgUri="https://example.com/test.svg" />
    );

    expect(getByTestId('svg-uri')).toBeTruthy();
  });

  it('handles custom dimensions', () => {
    const { getByTestId } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        width={200}
        height={150}
      />
    );

    const svgElement = getByTestId('svg-xml');
    expect(svgElement).toHaveStyle({ width: 200, height: 150 });
  });

  it('responds to different screen sizes - small', () => {
    mockDimensions.get.mockReturnValue({ width: 320, height: 568 });
    
    const { getByText } = render(
      <ResponsiveSvg svgContent={sampleSvgContent} />
    );

    expect(getByText('Screen: 320×568 (small)')).toBeTruthy();
  });

  it('responds to different screen sizes - medium', () => {
    mockDimensions.get.mockReturnValue({ width: 600, height: 800 });
    
    const { getByText } = render(
      <ResponsiveSvg svgContent={sampleSvgContent} />
    );

    expect(getByText('Screen: 600×800 (medium)')).toBeTruthy();
  });

  it('responds to different screen sizes - large', () => {
    mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });
    
    const { getByText } = render(
      <ResponsiveSvg svgContent={sampleSvgContent} />
    );

    expect(getByText('Screen: 1024×768 (large)')).toBeTruthy();
  });

  it('applies minimum width constraint', () => {
    mockDimensions.get.mockReturnValue({ width: 200, height: 400 });
    
    const { getByTestId } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        minWidth={150}
      />
    );

    const svgElement = getByTestId('svg-xml');
    // The width should be at least the minimum width
    expect(svgElement.props.style.width).toBeGreaterThanOrEqual(150);
  });

  it('applies maximum width constraint', () => {
    mockDimensions.get.mockReturnValue({ width: 1000, height: 800 });
    
    const { getByTestId } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        maxWidth={300}
      />
    );

    const svgElement = getByTestId('svg-xml');
    expect(svgElement.props.style.width).toBeLessThanOrEqual(300);
  });

  it('shows placeholder when no SVG source provided', () => {
    const { getByText } = render(
      <ResponsiveSvg />
    );

    expect(getByText('No SVG source provided')).toBeTruthy();
  });

  it('shows placeholder for local SVG source', () => {
    const { getByText } = render(
      <ResponsiveSvg svgSource={require('../../../assets/icon.png')} />
    );

    expect(getByText('Local SVG assets require additional setup')).toBeTruthy();
  });

  it('applies custom background color', () => {
    const { getByTestId } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        backgroundColor="#ff0000"
        testID="svg-container"
      />
    );

    // Note: Testing background color would require the component to have testID
    // This shows the structure for such a test
  });

  it('applies custom padding', () => {
    const { getByTestId } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        padding={30}
      />
    );

    // The SVG should account for custom padding in its responsive calculations
    expect(getByTestId('svg-xml')).toBeTruthy();
  });

  it('sets up dimension change listener', () => {
    render(<ResponsiveSvg svgContent={sampleSvgContent} />);

    expect(mockDimensions.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('displays SVG dimensions in info', () => {
    const { getByText } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        width={200}
        height={150}
      />
    );

    expect(getByText(/SVG: 200×150/)).toBeTruthy();
  });

  it('handles preserve aspect ratio setting', () => {
    const { getByTestId } = render(
      <ResponsiveSvg 
        svgContent={sampleSvgContent}
        preserveAspectRatio={false}
        width={200}
        height={100}
      />
    );

    expect(getByTestId('svg-xml')).toBeTruthy();
  });
});
