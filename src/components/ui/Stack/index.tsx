import React from 'react';
import { View, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';

export interface StackProps extends BaseComponentProps {
  direction?: 'row' | 'column';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  children?: React.ReactNode;
}

export const Stack: React.FC<StackProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  direction = 'column',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  children,
  ...props
}) => {
  const directionStyles = {
    row: 'flex-row',
    column: 'flex-col',
  };

  const spacingStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const wrapStyles = wrap ? 'flex-wrap' : '';
  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`${directionStyles[direction]} ${spacingStyles[spacing]} ${alignStyles[align]} ${justifyStyles[justify]} ${wrapStyles} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};
