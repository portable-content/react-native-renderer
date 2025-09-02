import React from 'react';
import { render } from '@testing-library/react-native';
import { MarkupElement } from '../MarkupElement';

describe('MarkupElement', () => {
  it('renders correctly with basic content', () => {
    const { getByText } = render(<MarkupElement content="Hello World" />);

    expect(getByText('Hello World')).toBeTruthy();
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('renders with title when provided', () => {
    const { getByText } = render(
      <MarkupElement content="Test content" title="Test Title" />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test content')).toBeTruthy();
  });

  it('displays screen size information', () => {
    const { getByText } = render(<MarkupElement content="Test content" />);

    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });

  it('parses basic HTML tags', () => {
    const { getByText } = render(
      <MarkupElement content="<b>Bold text</b> and <i>italic text</i>" />
    );

    expect(getByText('Bold text')).toBeTruthy();
    expect(getByText(' and ')).toBeTruthy();
    expect(getByText('italic text')).toBeTruthy();
  });

  it('handles line breaks', () => {
    const { getByText } = render(<MarkupElement content="Line 1<br/>Line 2" />);

    expect(getByText('Line 1')).toBeTruthy();
    expect(getByText('Line 2')).toBeTruthy();
  });

  it('applies custom background color', () => {
    const { getByText } = render(
      <MarkupElement content="Test content" backgroundColor="#ff0000" />
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('applies custom text color', () => {
    const { getByText } = render(
      <MarkupElement content="Test content" textColor="#0000ff" />
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('handles scrollable content', () => {
    const longContent = 'Lorem ipsum '.repeat(100);
    const { getByText } = render(
      <MarkupElement content={longContent} scrollable={true} />
    );

    expect(getByText(/Lorem ipsum/)).toBeTruthy();
  });

  it('handles non-scrollable content', () => {
    const { getByText } = render(
      <MarkupElement content="Short content" scrollable={false} />
    );

    expect(getByText('Short content')).toBeTruthy();
  });

  it('uses centralized screen management', () => {
    const { getByText } = render(<MarkupElement content="Test content" />);

    // The component should use the mocked ScreenProvider
    expect(getByText('Screen: 375×812 (small)')).toBeTruthy();
  });
});
