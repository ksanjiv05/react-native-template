import React from 'react';
import { Pressable, PressableProps, ActivityIndicator } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps & Omit<PressableProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  onPress,
  ...props
}) => {
  const baseStyles = 'rounded-2xl items-center justify-center';

  const variantStyles = {
    primary: 'bg-blue-600 dark:bg-blue-500 active:bg-blue-700 dark:active:bg-blue-600',
    secondary: 'bg-gray-200 dark:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600',
    outline: 'border-2 border-gray-300 dark:border-gray-600 active:bg-gray-100 dark:active:bg-gray-800',
    ghost: 'active:bg-gray-100 dark:active:bg-gray-800',
    destructive: 'bg-red-600 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 min-h-[32px]',
    md: 'px-4 py-3 min-h-[44px]',
    lg: 'px-6 py-4 min-h-[52px]',
  };

  const textColorStyles = {
    primary: 'text-white dark:text-white',
    secondary: 'text-gray-800 dark:text-gray-100',
    outline: 'text-gray-800 dark:text-gray-100',
    ghost: 'text-gray-800 dark:text-gray-100',
    destructive: 'text-white dark:text-white',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const disabledStyles = disabled || loading ? 'opacity-50' : '';

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'destructive' ? '#ffffff' : '#374151'}
        />
      );
    }

    if (typeof children === 'string') {
      return (
        <Text
          weight="semibold"
          className={`${textColorStyles[variant]} ${textSizeStyles[size]}`}
        >
          {children}
        </Text>
      );
    }

    return children;
  };

  return (
    <Pressable
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      disabled={disabled || loading}
      testID={testID}
      onPress={onPress}
      {...props}
    >
      {renderContent()}
    </Pressable>
  );
};
