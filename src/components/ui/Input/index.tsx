import React, { useState } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface InputProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

export const Input: React.FC<InputProps & Omit<TextInputProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  label,
  error,
  helperText,
  size = 'md',
  leftIcon,
  rightIcon,
  value,
  onChangeText,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-4 py-4 text-lg min-h-[52px]',
  };

  const baseInputStyles = 'rounded-lg bg-white dark:bg-gray-900 border text-gray-800 dark:text-gray-100';
  const borderStyles = error
    ? 'border-red-500 dark:border-red-400'
    : isFocused
    ? 'border-blue-600 dark:border-blue-400'
    : 'border-gray-300 dark:border-gray-600';

  const disabledStyles = disabled ? 'opacity-50 bg-gray-100 dark:bg-gray-800' : '';

  return (
    <View className={`${containerClassName}`} testID={testID}>
      {label && (
        <Text
          variant="caption"
          weight="medium"
          className="mb-2 text-gray-700 dark:text-gray-300"
        >
          {label}
        </Text>
      )}

      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {leftIcon}
          </View>
        )}

        <TextInput
          className={`${baseInputStyles} ${borderStyles} ${sizeStyles[size]} ${disabledStyles} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          style={style}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <View className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </View>
        )}
      </View>

      {error && (
        <Text variant="small" color="error" className="mt-1">
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text variant="small" color="muted" className="mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};
