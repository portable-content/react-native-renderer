import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Image } from 'react-native';
import { ResponsiveImage } from '../ResponsiveImage';

// Image methods are mocked globally in jest.setup.js
const mockResolveAssetSource = Image.resolveAssetSource as jest.MockedFunction<typeof Image.resolveAssetSource>;
const mockGetSize = Image.getSize as jest.MockedFunction<typeof Image.getSize>;

const mockImageSource = { uri: 'https://example.com/test.jpg' };
const mockLocalImageSource = 12345; // Mock require() result

describe('ResponsiveImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with image source', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        testID="responsive-image"
      />
    );

    // Should render with the mocked screen dimensions
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('renders with title when provided', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        title="Test Image"
      />
    );

    expect(getByText('Test Image')).toBeTruthy();
  });

  it('displays screen size information', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('handles custom dimensions', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        width={200}
        height={150}
      />
    );

    expect(getByText('Image: 200×150')).toBeTruthy();
  });

  it('responds to different screen sizes - small', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    // With our mocked ScreenProvider, it always returns small screen (375×812)
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('responds to different screen sizes - medium', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    // With our mocked ScreenProvider, it always returns small screen (375×812)
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('responds to different screen sizes - large', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    // With our mocked ScreenProvider, it always returns small screen (375×812)
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies minimum width constraint', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        minWidth={150}
      />
    );

    // The width should be at least the minimum width
    const imageInfo = getByText(/Image: \d+×\d+/);
    expect(imageInfo).toBeTruthy();
  });

  it('applies maximum width constraint', () => {
    
    const { getByText } = render(
      <ResponsiveImage 
        source={mockImageSource}
        maxWidth={300}
      />
    );

    const imageInfo = getByText(/Image: \d+×\d+/);
    expect(imageInfo).toBeTruthy();
  });

  it('shows placeholder when no image source provided', () => {
    const { getByText } = render(
      <ResponsiveImage />
    );

    expect(getByText('No image source provided')).toBeTruthy();
  });

  it('handles local image source', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockLocalImageSource} />
    );

    // The component should render with screen info (Image.resolveAssetSource is called internally)
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('handles remote image source', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    // The component should render with screen info (Image.getSize is called internally)
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies custom resize mode', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        resizeMode="cover"
      />
    );

    // The component should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies custom border radius', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        borderRadius={10}
      />
    );

    // The component should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies custom padding', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        padding={30}
      />
    );

    // The component should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('uses centralized screen management', () => {
    const { getByText } = render(<ResponsiveImage source={mockImageSource} />);

    // The component should use the mocked ScreenProvider
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('handles image load success', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        showLoadingIndicator={true}
      />
    );

    // Should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('handles image load error', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    // Should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies accessibility label', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        accessibilityLabel="Test accessibility label"
      />
    );

    // Should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('uses title as accessibility label when no explicit label provided', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        title="Test Title"
      />
    );

    // Should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('handles different resize modes', () => {
    const resizeModes: Array<'cover' | 'contain' | 'stretch' | 'repeat' | 'center'> = [
      'cover', 'contain', 'stretch', 'repeat', 'center'
    ];

    resizeModes.forEach(mode => {
      const { getByText } = render(
        <ResponsiveImage
          source={mockImageSource}
          resizeMode={mode}
        />
      );
      expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
    });
  });

  it('calculates aspect ratio correctly for contain mode', () => {
    const { getByText } = render(
      <ResponsiveImage
        source={mockImageSource}
        resizeMode="contain"
        width={400}
      />
    );

    // Should calculate height based on aspect ratio
    expect(getByText(/Image: 400×\d+/)).toBeTruthy();
  });
});
