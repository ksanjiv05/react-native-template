import React from 'react';
import { View, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-full items-center justify-center';

  const variantStyles = {
    default: 'bg-gray-200 dark:bg-gray-700',
    primary: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-yellow-600 dark:bg-yellow-500',
    error: 'bg-red-600 dark:bg-red-500',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'px-4 py-1.5',
  };

  const textColorStyles = {
    default: 'text-gray-800 dark:text-gray-100',
    primary: 'text-white dark:text-white',
    success: 'text-white dark:text-white',
    warning: 'text-white dark:text-white',
    error: 'text-white dark:text-white',
    outline: 'text-gray-800 dark:text-gray-100',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          weight="medium"
          className={`${textColorStyles[variant]} ${textSizeStyles[size]}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
