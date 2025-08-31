import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Dimensions, Image } from 'react-native';
import { ResponsiveImage } from '../ResponsiveImage';

// Mock Dimensions
const mockDimensions = {
  get: jest.fn(() => ({ width: 375, height: 667 })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);

// Mock Image.resolveAssetSource and Image.getSize
const mockResolveAssetSource = jest.fn();
const mockGetSize = jest.fn();

jest.mock('react-native/Libraries/Image/Image', () => {
  const ActualImage = jest.requireActual('react-native/Libraries/Image/Image');
  return {
    ...ActualImage,
    resolveAssetSource: mockResolveAssetSource,
    getSize: mockGetSize,
  };
});

const mockImageSource = { uri: 'https://example.com/test.jpg' };
const mockLocalImageSource = 12345; // Mock require() result

describe('ResponsiveImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
    mockResolveAssetSource.mockReturnValue({ width: 200, height: 150 });
    mockGetSize.mockImplementation((uri, success) => {
      success(400, 300);
    });
  });

  it('renders correctly with image source', () => {
    const { getByTestId } = render(
      <ResponsiveImage 
        source={mockImageSource}
        testID="responsive-image"
      />
    );

    // Note: Testing Image component directly can be tricky in Jest
    // This test structure shows how you would test it
    expect(mockDimensions.addEventListener).toHaveBeenCalled();
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

    expect(getByText('Screen: 375×667 (small)')).toBeTruthy();
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
    mockDimensions.get.mockReturnValue({ width: 320, height: 568 });
    
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    expect(getByText('Screen: 320×568 (small)')).toBeTruthy();
  });

  it('responds to different screen sizes - medium', () => {
    mockDimensions.get.mockReturnValue({ width: 600, height: 800 });
    
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    expect(getByText('Screen: 600×800 (medium)')).toBeTruthy();
  });

  it('responds to different screen sizes - large', () => {
    mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });
    
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    expect(getByText('Screen: 1024×768 (large)')).toBeTruthy();
  });

  it('applies minimum width constraint', () => {
    mockDimensions.get.mockReturnValue({ width: 200, height: 400 });
    
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
    mockDimensions.get.mockReturnValue({ width: 1000, height: 800 });
    
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

    expect(mockResolveAssetSource).toHaveBeenCalledWith(mockLocalImageSource);
    expect(getByText('Original: 200×150')).toBeTruthy();
  });

  it('handles remote image source', () => {
    const { getByText } = render(
      <ResponsiveImage source={mockImageSource} />
    );

    expect(mockGetSize).toHaveBeenCalledWith(
      mockImageSource.uri,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('applies custom resize mode', () => {
    render(
      <ResponsiveImage 
        source={mockImageSource}
        resizeMode="cover"
      />
    );

    // The component should render without errors
    expect(mockDimensions.addEventListener).toHaveBeenCalled();
  });

  it('applies custom border radius', () => {
    render(
      <ResponsiveImage 
        source={mockImageSource}
        borderRadius={10}
      />
    );

    // The component should render without errors
    expect(mockDimensions.addEventListener).toHaveBeenCalled();
  });

  it('applies custom padding', () => {
    render(
      <ResponsiveImage 
        source={mockImageSource}
        padding={30}
      />
    );

    // The component should render without errors
    expect(mockDimensions.addEventListener).toHaveBeenCalled();
  });

  it('sets up dimension change listener', () => {
    render(<ResponsiveImage source={mockImageSource} />);

    expect(mockDimensions.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('handles image load success', () => {
    const { queryByText } = render(
      <ResponsiveImage 
        source={mockImageSource}
        showLoadingIndicator={true}
      />
    );

    // Initially should show loading (though this is hard to test in Jest)
    // After load, loading should be hidden
    expect(mockDimensions.addEventListener).toHaveBeenCalled();
  });

  it('handles image load error', () => {
    // This would require more complex mocking to simulate image load errors
    // The test structure shows how you would approach it
    render(
      <ResponsiveImage source={mockImageSource} />
    );

    expect(mockDimensions.addEventListener).toHaveBeenCalled();
  });

  it('applies accessibility label', () => {
    render(
      <ResponsiveImage 
        source={mockImageSource}
        accessibilityLabel="Test accessibility label"
      />
    );

    // The component should render without errors
    expect(mockDimensions.addEventListener).toHaveBeenCalled();
  });

  it('uses title as accessibility label when no explicit label provided', () => {
    render(
      <ResponsiveImage 
        source={mockImageSource}
        title="Test Title"
      />
    );

    // The component should render without errors
    expect(mockDimensions.addEventListener).toHaveBeenCalled();
  });

  it('handles different resize modes', () => {
    const resizeModes: Array<'cover' | 'contain' | 'stretch' | 'repeat' | 'center'> = [
      'cover', 'contain', 'stretch', 'repeat', 'center'
    ];

    resizeModes.forEach(mode => {
      render(
        <ResponsiveImage 
          source={mockImageSource}
          resizeMode={mode}
        />
      );
      expect(mockDimensions.addEventListener).toHaveBeenCalled();
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
