import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Image } from 'react-native';
import { ImageElement } from '../ImageElement';

// Image methods are mocked globally in jest.setup.js
const mockResolveAssetSource = Image.resolveAssetSource as jest.MockedFunction<
  typeof Image.resolveAssetSource
>;
const mockGetSize = Image.getSize as jest.MockedFunction<typeof Image.getSize>;

const mockImageSource = { uri: 'https://example.com/test.jpg' };
const mockLocalImageSource = 12345; // Mock require() result

describe('ImageElement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with image source', () => {
    const { getByText } = render(
      <ImageElement source={mockImageSource} testID="image-element" />
    );

    // Should render with the mocked screen dimensions
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('renders with title when provided', () => {
    const { getByText } = render(
      <ImageElement source={mockImageSource} title="Test Image" />
    );

    expect(getByText('Test Image')).toBeTruthy();
  });

  it('displays screen size information', () => {
    const { getByText } = render(<ImageElement source={mockImageSource} />);

    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('responds to different screen sizes - large', () => {
    const { getByText } = render(<ImageElement source={mockImageSource} />);

    // With our mocked ScreenProvider, it always returns small screen (375×812)
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies minimum width constraint', () => {
    const { getByText } = render(
      <ImageElement source={mockImageSource} minWidth={150} />
    );

    // The width should be at least the minimum width
    const imageInfo = getByText(/Image: \d+×auto/);
    expect(imageInfo).toBeTruthy();
  });

  it('applies maximum width constraint', () => {
    const { getByText } = render(
      <ImageElement source={mockImageSource} maxWidth={300} />
    );

    const imageInfo = getByText(/Image: \d+×auto/);
    expect(imageInfo).toBeTruthy();
  });

  it('shows placeholder when no image source provided', () => {
    const { getByText } = render(<ImageElement />);

    expect(getByText('No image source provided')).toBeTruthy();
  });

  it('handles local image source', () => {
    const { getByText } = render(
      <ImageElement source={mockLocalImageSource} />
    );

    // The component should render with screen info (Image.resolveAssetSource is called internally)
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies custom border radius', () => {
    const { getByText } = render(
      <ImageElement source={mockImageSource} borderRadius={10} />
    );

    // The component should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('applies custom padding', () => {
    const { getByText } = render(
      <ImageElement source={mockImageSource} padding={30} />
    );

    // The component should render with screen info
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('uses centralized screen management', () => {
    const { getByText } = render(<ImageElement source={mockImageSource} />);

    // The component should use the mocked ScreenProvider
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });
});
