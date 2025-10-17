import React from 'react';
import { View, Pressable } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface CheckboxProps extends BaseComponentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  checked,
  onCheckedChange,
  label,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const baseStyles = 'rounded border-2 items-center justify-center';
  const checkedStyles = checked
    ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600';

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <Pressable
      className={`flex-row items-center ${disabledStyles} ${containerClassName}`}
      style={style}
      testID={testID}
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
    >
      <View className={`${baseStyles} ${checkedStyles} ${sizeStyles[size]} ${className}`}>
        {checked && (
          <View className={`bg-white rounded-sm ${iconSizeStyles[size]}`} />
        )}
      </View>

      {label && (
        <Text
          variant="body"
          className="ml-2 text-gray-800 dark:text-gray-100"
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};
