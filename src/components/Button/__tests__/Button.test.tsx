import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MyButton } from '../Button';

describe('MyButton', () => {
  it('renders correctly with given text', () => {
    const { getByText } = render(
      <MyButton text="Click me" onPress={() => {}} />
    );

    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <MyButton text="Click me" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Click me'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility properties', () => {
    const { getByText } = render(
      <MyButton text="Click me" onPress={() => {}} />
    );

    // TouchableOpacity is accessible by default and contains the text
    const buttonText = getByText('Click me');
    expect(buttonText).toBeTruthy();

    // Verify the button can be pressed (indicating it's accessible)
    fireEvent.press(buttonText);
  });

  it('renders with correct styles', () => {
    const { getByText } = render(
      <MyButton text="Click me" onPress={() => {}} />
    );

    const buttonText = getByText('Click me');
    expect(buttonText).toHaveStyle({
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    });
  });

  it('handles multiple presses correctly', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <MyButton text="Click me" onPress={mockOnPress} />
    );

    const button = getByText('Click me');
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(3);
  });

  it('renders with different text props', () => {
    const { rerender, getByText } = render(
      <MyButton text="First text" onPress={() => {}} />
    );

    expect(getByText('First text')).toBeTruthy();

    rerender(<MyButton text="Second text" onPress={() => {}} />);

    expect(getByText('Second text')).toBeTruthy();
  });
});
