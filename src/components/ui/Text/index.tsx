import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { BaseComponentProps } from '../types';

export interface TextProps extends BaseComponentProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps & Omit<RNTextProps, 'style'>> = ({
  className = '',
  style,
  disabled = false,
  testID,
  variant = 'body',
  weight = 'normal',
  align = 'left',
  color = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-xl',
    body: 'text-base',
    caption: 'text-sm',
    small: 'text-xs',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const colorStyles = {
    default: 'text-gray-800 dark:text-gray-100',
    muted: 'text-gray-500 dark:text-gray-400',
    primary: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <RNText
      className={`${variantStyles[variant]} ${weightStyles[weight]} ${alignStyles[align]} ${colorStyles[color]} ${disabledStyles} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </RNText>
  );
};
