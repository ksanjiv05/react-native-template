import React from 'react';
import { View, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';

export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: 'default' | 'muted' | 'strong';
}

export const Divider: React.FC<DividerProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  orientation = 'horizontal',
  thickness = 1,
  color = 'default',
  ...props
}) => {
  const colorStyles = {
    default: 'bg-gray-300 dark:bg-gray-700',
    muted: 'bg-gray-200 dark:bg-gray-800',
    strong: 'bg-gray-400 dark:bg-gray-600',
  };

  const orientationStyles =
    orientation === 'horizontal'
      ? `w-full h-[${thickness}px]`
      : `w-[${thickness}px] h-full`;

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`${colorStyles[color]} ${orientationStyles} ${disabledStyles} ${containerClassName} ${className}`}
      style={[
        orientation === 'horizontal'
          ? { height: thickness }
          : { width: thickness },
        style,
      ]}
      testID={testID}
      {...props}
    />
  );
};
