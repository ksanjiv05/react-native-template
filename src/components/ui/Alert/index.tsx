import React from 'react';
import { View, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface AlertProps extends BaseComponentProps {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  variant = 'default',
  title,
  description,
  icon,
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-4 border';

  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-800',
  };

  const titleColorStyles = {
    default: 'text-gray-900 dark:text-gray-100',
    info: 'text-blue-900 dark:text-blue-100',
    success: 'text-green-900 dark:text-green-100',
    warning: 'text-yellow-900 dark:text-yellow-100',
    error: 'text-red-900 dark:text-red-100',
  };

  const descriptionColorStyles = {
    default: 'text-gray-700 dark:text-gray-300',
    info: 'text-blue-700 dark:text-blue-300',
    success: 'text-green-700 dark:text-green-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    error: 'text-red-700 dark:text-red-300',
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      <View className="flex-row">
        {icon && <View className="mr-3">{icon}</View>}

        <View className="flex-1">
          {title && (
            <Text
              variant="body"
              weight="semibold"
              className={`mb-1 ${titleColorStyles[variant]}`}
            >
              {title}
            </Text>
          )}

          {description && (
            <Text
              variant="caption"
              className={descriptionColorStyles[variant]}
            >
              {description}
            </Text>
          )}

          {children && (
            <View className="mt-2">
              {children}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
