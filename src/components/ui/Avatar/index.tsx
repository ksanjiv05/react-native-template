import React from 'react';
import { View, Image, ImageProps, ImageSourcePropType } from 'react-native';
import { BaseComponentProps } from '../types';
import { Text } from '../Text';

export interface AvatarProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  source?: ImageSourcePropType;
  fallback?: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps & Omit<ImageProps, 'style' | 'source'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  size = 'md',
  source,
  fallback,
  alt,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  };

  const baseStyles = 'rounded-full items-center justify-center overflow-hidden bg-gray-300 dark:bg-gray-600';
  const disabledStyles = disabled ? 'opacity-50' : '';

  const getFallbackText = () => {
    if (fallback) {
      return fallback
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  };

  const showFallback = !source || imageError;

  return (
    <View
      className={`${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
    >
      {showFallback ? (
        <Text
          weight="semibold"
          className={`text-white dark:text-white ${textSizeStyles[size]}`}
        >
          {getFallbackText()}
        </Text>
      ) : (
        <Image
          source={source!}
          className="w-full h-full"
          onError={() => setImageError(true)}
          accessibilityLabel={alt}
          {...props}
        />
      )}
    </View>
  );
};
