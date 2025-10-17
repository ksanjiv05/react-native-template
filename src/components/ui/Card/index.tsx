import React from 'react';
import { View, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';

export interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'outline' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  variant = 'elevated',
  padding = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl bg-white dark:bg-gray-800';

  const variantStyles = {
    elevated: 'shadow-md',
    outline: 'border border-gray-200 dark:border-gray-700',
    flat: '',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

export interface CardHeaderProps extends BaseComponentProps {
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  testID,
  children,
  ...props
}) => {
  return (
    <View
      className={`mb-3 ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

export interface CardContentProps extends BaseComponentProps {
  children?: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  testID,
  children,
  ...props
}) => {
  return (
    <View
      className={`${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

export interface CardFooterProps extends BaseComponentProps {
  children?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  testID,
  children,
  ...props
}) => {
  return (
    <View
      className={`mt-3 ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};
