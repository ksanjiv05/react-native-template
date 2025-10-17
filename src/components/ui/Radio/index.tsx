import React from 'react';
import { View, Pressable } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface RadioProps extends BaseComponentProps {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio: React.FC<RadioProps> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  selected,
  onSelect,
  label,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dotSizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const baseStyles = 'rounded-full border-2 items-center justify-center';
  const selectedStyles = selected
    ? 'border-blue-600 dark:border-blue-500'
    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900';

  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <Pressable
      className={`flex-row items-center ${disabledStyles} ${containerClassName}`}
      style={style}
      testID={testID}
      onPress={() => !disabled && onSelect()}
      disabled={disabled}
    >
      <View className={`${baseStyles} ${selectedStyles} ${sizeStyles[size]} ${className}`}>
        {selected && (
          <View className={`bg-blue-600 dark:bg-blue-500 rounded-full ${dotSizeStyles[size]}`} />
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

export interface RadioGroupProps extends BaseComponentProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  value,
  onValueChange,
  children,
}) => {
  return (
    <View
      className={`gap-2 ${containerClassName} ${className}`}
      style={style}
      testID={testID}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === RadioGroupItem) {
          return React.cloneElement(child as React.ReactElement<RadioGroupItemProps>, {
            selected: child.props.value === value,
            onSelect: () => !disabled && onValueChange(child.props.value),
            disabled: disabled || child.props.disabled,
          });
        }
        return child;
      })}
    </View>
  );
};

export interface RadioGroupItemProps extends BaseComponentProps {
  value: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onSelect?: () => void;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  value,
  label,
  size = 'md',
  selected = false,
  onSelect = () => {},
}) => {
  return (
    <Radio
      className={className}
      containerClassName={containerClassName}
      style={style}
      disabled={disabled}
      testID={testID}
      selected={selected}
      onSelect={onSelect}
      label={label}
      size={size}
    />
  );
};
