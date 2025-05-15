// components/ui/StyledButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import theme, { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme'; // Assuming theme.ts is in constants

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const getButtonStyles = () => {
    let backgroundColor = Colors.primary;
    let borderColor = Colors.primary;
    let textColor = Colors.textOnPrimary;
    let borderWidth = 0;

    switch (variant) {
      case 'secondary':
        backgroundColor = Colors.secondary;
        borderColor = Colors.secondary;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderColor = Colors.primary;
        textColor = Colors.primary;
        borderWidth = 1;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        borderColor = 'transparent';
        textColor = Colors.primary;
        break;
      case 'danger':
        backgroundColor = Colors.error;
        borderColor = Colors.error;
        textColor = Colors.textOnPrimary;
        break;
    }

    if (disabled || isLoading) {
      backgroundColor = Colors.grayLight;
      borderColor = Colors.grayLight;
      textColor = Colors.grayMedium;
    }

    return { backgroundColor, borderColor, textColor, borderWidth };
  };

  const getSizeStyles = () => {
    let paddingVertical = Spacing.md;
    let paddingHorizontal = Spacing.lg;
    let fontSize = FontSizes.lg;

    switch (size) {
      case 'sm':
        paddingVertical = Spacing.sm;
        paddingHorizontal = Spacing.md;
        fontSize = FontSizes.md;
        break;
      case 'lg':
        paddingVertical = Spacing.lg;
        paddingHorizontal = Spacing.xl;
        fontSize = FontSizes.xl;
        break;
    }
    return { paddingVertical, paddingHorizontal, fontSize };
  };

  const { backgroundColor, borderColor, textColor, borderWidth } = getButtonStyles();
  const { paddingVertical, paddingHorizontal, fontSize } = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, borderWidth, paddingVertical, paddingHorizontal },
        style,
        (disabled || isLoading) ? styles.disabled : {}
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon && <Text style={[styles.iconStyle, {color: textColor}]}>{leftIcon}</Text>}
          <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
            {title}
          </Text>
          {rightIcon && <Text style={[styles.iconStyle, {color: textColor}]}>{rightIcon}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    ...theme.Shadows.light,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    // fontFamily: Fonts.bold, // Example if fonts are set up
  },
  disabled: {
    opacity: 0.7,
  },
  iconStyle: {
    marginHorizontal: Spacing.sm,
  }
});

export default StyledButton;