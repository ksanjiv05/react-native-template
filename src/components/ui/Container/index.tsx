import React from 'react';
import { View, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';

export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  maxWidth = 'lg',
  padding = 'md',
  centered = true,
  children,
  ...props
}) => {
  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full',
  };

  const paddingStyles = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6',
  };

  const centeredStyles = centered ? 'mx-auto' : '';
  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`w-full ${maxWidthStyles[maxWidth]} ${paddingStyles[padding]} ${centeredStyles} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};
