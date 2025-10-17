import React from 'react';
import { Switch as RNSwitch, View, Pressable } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface SwitchProps extends BaseComponentProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  value,
  onValueChange,
  label,
  size = 'md',
}) => {
  const scaleStyles = {
    sm: 0.8,
    md: 1,
    lg: 1.2,
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  const content = (
    <View
      className={`flex-row items-center ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
    >
      {label && (
        <Text
          variant="body"
          className="mr-3 text-gray-800 dark:text-gray-100"
        >
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: '#D1D5DB',
          true: '#3B82F6',
        }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        ios_backgroundColor="#D1D5DB"
        style={{ transform: [{ scale: scaleStyles[size] }] }}
      />
    </View>
  );

  if (label) {
    return (
      <Pressable onPress={() => !disabled && onValueChange(!value)} disabled={disabled}>
        {content}
      </Pressable>
    );
  }

  return content;
};
