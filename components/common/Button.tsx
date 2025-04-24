import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onPress, 
  disabled = false,
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#175ADB',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 16,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#175ADB',
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Button;