import React from 'react';
import { View, ActivityIndicator, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface SpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  size = 'md',
  color = 'primary',
  label,
  ...props
}) => {
  const sizeMap = {
    sm: 'small' as const,
    md: 'large' as const,
    lg: 'large' as const,
  };

  const scaleStyles = {
    sm: 0.8,
    md: 1,
    lg: 1.5,
  };

  const colorMap = {
    primary: '#3B82F6',
    secondary: '#6B7280',
    white: '#FFFFFF',
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`items-center justify-center ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      <View style={{ transform: [{ scale: scaleStyles[size] }] }}>
        <ActivityIndicator
          size={sizeMap[size]}
          color={colorMap[color]}
        />
      </View>

      {label && (
        <Text
          variant="caption"
          color="muted"
          className="mt-2"
        >
          {label}
        </Text>
      )}
    </View>
  );
};
