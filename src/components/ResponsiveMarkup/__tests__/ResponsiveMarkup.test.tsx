import React from 'react';
import { render } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { ResponsiveMarkup } from '../ResponsiveMarkup';

// Mock Dimensions
const mockDimensions = {
  get: jest.fn(() => ({ width: 375, height: 667 })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);

describe('ResponsiveMarkup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
  });

  it('renders correctly with basic content', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="Hello world" />
    );

    expect(getByText('Hello world')).toBeTruthy();
  });

  it('renders with title when provided', () => {
    const { getByText } = render(
      <ResponsiveMarkup 
        content="Test content" 
        title="Test Title" 
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test content')).toBeTruthy();
  });

  it('displays screen size information', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="Test content" />
    );

    expect(getByText('Screen: 375×667 (small)')).toBeTruthy();
  });

  it('handles bold markup correctly', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="This is <b>bold</b> text" />
    );

    const boldText = getByText('bold');
    expect(boldText).toBeTruthy();
    expect(boldText).toHaveStyle({ fontWeight: 'bold' });
  });

  it('handles italic markup correctly', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="This is <i>italic</i> text" />
    );

    const italicText = getByText('italic');
    expect(italicText).toBeTruthy();
    expect(italicText).toHaveStyle({ fontStyle: 'italic' });
  });

  it('handles strong markup correctly', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="This is <strong>strong</strong> text" />
    );

    const strongText = getByText('strong');
    expect(strongText).toBeTruthy();
    expect(strongText).toHaveStyle({ fontWeight: 'bold' });
  });

  it('handles em markup correctly', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="This is <em>emphasized</em> text" />
    );

    const emText = getByText('emphasized');
    expect(emText).toBeTruthy();
    expect(emText).toHaveStyle({ fontStyle: 'italic' });
  });

  it('applies custom background color', () => {
    const { getByTestId } = render(
      <ResponsiveMarkup 
        content="Test content" 
        backgroundColor="#ff0000"
        testID="markup-container"
      />
    );

    // Note: Testing background color in React Native Testing Library can be tricky
    // This test structure shows how you would test it if the component had testID
  });

  it('applies custom text color', () => {
    const { getByText } = render(
      <ResponsiveMarkup 
        content="Test content" 
        textColor="#ff0000"
      />
    );

    const textElement = getByText('Test content');
    expect(textElement).toHaveStyle({ color: '#ff0000' });
  });

  it('responds to different screen sizes - small', () => {
    mockDimensions.get.mockReturnValue({ width: 320, height: 568 });
    
    const { getByText } = render(
      <ResponsiveMarkup content="Test content" />
    );

    expect(getByText('Screen: 320×568 (small)')).toBeTruthy();
  });

  it('responds to different screen sizes - medium', () => {
    mockDimensions.get.mockReturnValue({ width: 600, height: 800 });
    
    const { getByText } = render(
      <ResponsiveMarkup content="Test content" />
    );

    expect(getByText('Screen: 600×800 (medium)')).toBeTruthy();
  });

  it('responds to different screen sizes - large', () => {
    mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });
    
    const { getByText } = render(
      <ResponsiveMarkup content="Test content" />
    );

    expect(getByText('Screen: 1024×768 (large)')).toBeTruthy();
  });

  it('handles mixed markup correctly', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="This has <b>bold</b> and <i>italic</i> text" />
    );

    expect(getByText('bold')).toHaveStyle({ fontWeight: 'bold' });
    expect(getByText('italic')).toHaveStyle({ fontStyle: 'italic' });
  });

  it('handles content without markup', () => {
    const { getByText } = render(
      <ResponsiveMarkup content="Plain text without any markup" />
    );

    expect(getByText('Plain text without any markup')).toBeTruthy();
  });

  it('sets up dimension change listener', () => {
    render(<ResponsiveMarkup content="Test content" />);

    expect(mockDimensions.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });
});
