import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { PortableContent } from '../PortableContent';
import { ScreenProvider } from '../../../providers/ScreenProvider';

// Mock Dimensions
const mockSubscription = { remove: jest.fn() };
const mockDimensions = {
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(() => mockSubscription),
  removeEventListener: jest.fn(),
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ScreenProvider>{children}</ScreenProvider>
);

describe('PortableContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscription.remove.mockClear();
    mockDimensions.get.mockReturnValue({ width: 375, height: 812 });
    mockDimensions.addEventListener.mockReturnValue(mockSubscription);
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <TestWrapper>
        <PortableContent>
          <Text>Test Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies default styles correctly', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent testID="container">
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    expect(container).toHaveStyle({
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 12, // Small screen default padding
    });
  });

  it('applies custom background color', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent backgroundColor="#ff0000" testID="container">
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    expect(container).toHaveStyle({
      backgroundColor: '#ff0000',
    });
  });

  it('applies custom padding', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent padding={24} testID="container">
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    expect(container).toHaveStyle({
      padding: 24,
    });
  });

  it('applies custom border radius', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent borderRadius={16} testID="container">
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    expect(container).toHaveStyle({
      borderRadius: 16,
    });
  });

  it('applies custom dimensions', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent
          width={300}
          height={200}
          minWidth={100}
          maxWidth={400}
          testID="container"
        >
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    expect(container).toHaveStyle({
      width: 300,
      height: 200,
      minWidth: 100,
      maxWidth: 400,
    });
  });

  it('applies shadow styles by default', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent testID="container">
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    expect(container).toHaveStyle({
      shadowColor: '#000',
      shadowOpacity: 0.1,
      elevation: 5,
    });
  });

  it('can disable shadow styles', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent showShadow={false} testID="container">
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    // Should not have shadow styles
    expect(container.props.style).not.toEqual(
      expect.objectContaining({
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 5,
      })
    );
  });

  it('merges custom styles correctly', () => {
    const customStyle = { marginTop: 10, marginBottom: 20 };
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent style={customStyle} testID="container">
          <Text>Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('container');
    expect(container).toHaveStyle(customStyle);
  });

  it('passes through ViewProps correctly', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent testID="pressable-container" onTouchEnd={onPress}>
          <Text>Pressable Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('pressable-container');
    fireEvent(container, 'touchEnd');
    expect(onPress).toHaveBeenCalled();
  });

  it('is designed to work with ScreenProvider', () => {
    const { getByText } = render(
      <TestWrapper>
        <PortableContent>
          <Text>Works with ScreenProvider</Text>
        </PortableContent>
      </TestWrapper>
    );

    expect(getByText('Works with ScreenProvider')).toBeTruthy();
  });

  it('updates dynamically when props change', () => {
    const DynamicTest = () => {
      const [bgColor, setBgColor] = React.useState('#ffffff');
      const [padding, setPadding] = React.useState(16);

      return (
        <TestWrapper>
          <PortableContent
            backgroundColor={bgColor}
            padding={padding}
            testID="dynamic-container"
          >
            <Text>Dynamic Content</Text>
            <TouchableOpacity
              testID="change-bg"
              onPress={() => setBgColor('#ff0000')}
            >
              <Text>Change Background</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="change-padding"
              onPress={() => setPadding(32)}
            >
              <Text>Change Padding</Text>
            </TouchableOpacity>
          </PortableContent>
        </TestWrapper>
      );
    };

    const { getByTestId } = render(<DynamicTest />);

    const container = getByTestId('dynamic-container');
    const changeBgButton = getByTestId('change-bg');
    const changePaddingButton = getByTestId('change-padding');

    // Initial state
    expect(container).toHaveStyle({
      backgroundColor: '#ffffff',
      padding: 16,
    });

    // Change background color
    fireEvent.press(changeBgButton);
    expect(container).toHaveStyle({
      backgroundColor: '#ff0000',
    });

    // Change padding
    fireEvent.press(changePaddingButton);
    expect(container).toHaveStyle({
      padding: 32,
    });
  });

  it('handles responsive behavior correctly', () => {
    // The responsive behavior is tested through the useResponsiveStyles hook
    // which is already tested in its own test suite. Here we just verify
    // that the component uses the responsive styles correctly.
    const { getByTestId } = render(
      <TestWrapper>
        <PortableContent testID="responsive-container">
          <Text>Responsive Content</Text>
        </PortableContent>
      </TestWrapper>
    );

    const container = getByTestId('responsive-container');
    // Should use the responsive padding from useResponsiveStyles
    expect(container).toHaveStyle({
      padding: 12, // Small screen padding (from our mock)
    });
  });

  it('composes well with Element components', () => {
    const { getByText } = render(
      <TestWrapper>
        <PortableContent backgroundColor="#f8f9fa">
          <Text>Element Container</Text>
          <Text>Multiple Elements</Text>
        </PortableContent>
      </TestWrapper>
    );

    expect(getByText('Element Container')).toBeTruthy();
    expect(getByText('Multiple Elements')).toBeTruthy();
  });
});
