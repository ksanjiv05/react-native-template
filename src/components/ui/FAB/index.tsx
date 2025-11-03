import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  Animated,
  ViewStyle,
} from 'react-native';
import { BaseComponentProps } from '../types';

export interface FABProps extends BaseComponentProps {
  icon?: React.ReactNode;
  label?: string;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
  extended?: boolean;
}

export const FAB: React.FC<FABProps & Omit<TouchableOpacityProps, 'style'>> = ({
  icon,
  label,
  onPress,
  size = 'md',
  variant = 'primary',
  position = 'bottom-right',
  extended = false,
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sizeStyles = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const variantStyles = {
    primary: 'bg-primary shadow-lg',
    secondary: 'bg-secondary shadow-lg',
    success: 'bg-success shadow-lg',
    warning: 'bg-warning shadow-lg',
    error: 'bg-error shadow-lg',
  };

  const positionStyles = {
    'bottom-right': 'absolute bottom-6 right-6',
    'bottom-left': 'absolute bottom-6 left-6',
    'bottom-center': 'absolute bottom-6 left-1/2 -translate-x-1/2',
    'top-right': 'absolute top-6 right-6',
    'top-left': 'absolute top-6 left-6',
    'top-center': 'absolute top-6 left-1/2 -translate-x-1/2',
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      className={`${positionStyles[position]} ${containerClassName}`}
      style={{ transform: [{ scale: scaleAnim }] }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
        {...props}
      >
        <View
          className={`${extended ? 'flex-row items-center px-6 py-4 rounded-full' : `${sizeStyles[size]} rounded-full`} ${variantStyles[variant]} ${disabledStyles} justify-center items-center ${className}`}
          style={style as ViewStyle}
        >
          {icon && <View className={extended && label ? 'mr-2' : ''}>{icon}</View>}
          {extended && label && (
            <View className="text-base font-semibold text-white dark:text-gray-900">
              {label}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export interface FABGroupProps extends BaseComponentProps {
  icon?: React.ReactNode;
  actions: Array<{
    icon?: React.ReactNode;
    label?: string;
    onPress: () => void;
    color?: string;
  }>;
  visible?: boolean;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
}

export const FABGroup: React.FC<FABGroupProps> = ({
  icon,
  actions,
  visible: controlledVisible,
  onPress,
  variant = 'primary',
  position = 'bottom-right',
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
}) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const isControlled = controlledVisible !== undefined;
  const isOpen = isControlled ? controlledVisible : internalVisible;

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const actionAnims = useRef(actions.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.stagger(
        50,
        actionAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: isOpen ? 1 : 0,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [isOpen, rotateAnim, actionAnims]);

  const handleToggle = () => {
    if (!isControlled) {
      setInternalVisible(!internalVisible);
    }
    if (onPress) {
      onPress();
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const positionStyles = {
    'bottom-right': 'absolute bottom-6 right-6',
    'bottom-left': 'absolute bottom-6 left-6',
    'bottom-center': 'absolute bottom-6 items-center',
    'top-right': 'absolute top-6 right-6',
    'top-left': 'absolute top-6 left-6',
    'top-center': 'absolute top-6 items-center',
  };

  const variantStyles = {
    primary: 'bg-primary shadow-lg',
    secondary: 'bg-secondary shadow-lg',
    success: 'bg-success shadow-lg',
    warning: 'bg-warning shadow-lg',
    error: 'bg-error shadow-lg',
  };

  const getActionPosition = (index: number) => {
    const spacing = 70;
    if (position.includes('bottom')) {
      return { bottom: spacing * (index + 1) };
    } else {
      return { top: spacing * (index + 1) };
    }
  };

  return (
    <View className={`${positionStyles[position]} ${containerClassName}`} style={style as ViewStyle}>
      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          className="absolute inset-0 w-screen h-screen"
          style={{ position: 'absolute', top: -1000, left: -1000, right: -1000, bottom: -1000 }}
          onPress={handleToggle}
          activeOpacity={1}
        >
          <View className="flex-1 bg-black/20" />
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      {actions.map((action, index) => {
        const scale = actionAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        const opacity = actionAnims[index];

        return (
          <Animated.View
            key={index}
            className="absolute"
            style={[
              getActionPosition(index),
              {
                transform: [{ scale }],
                opacity,
              },
            ]}
          >
            <View className="flex-row items-center">
              {action.label && position.includes('right') && (
                <View className="mr-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <View className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {action.label}
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  action.onPress();
                  handleToggle();
                }}
                activeOpacity={0.8}
              >
                <View
                  className={`w-12 h-12 rounded-full ${action.color || 'bg-white dark:bg-gray-700'} shadow-lg justify-center items-center`}
                >
                  {action.icon}
                </View>
              </TouchableOpacity>

              {action.label && position.includes('left') && (
                <View className="ml-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <View className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {action.label}
                  </View>
                </View>
              )}
            </View>
          </Animated.View>
        );
      })}

      {/* Main FAB */}
      <TouchableOpacity
        onPress={handleToggle}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
        style={{ zIndex: 100 }}
      >
        <Animated.View
          className={`w-14 h-14 rounded-full ${variantStyles[variant]} justify-center items-center ${disabled ? 'opacity-50' : ''} ${className}`}
          style={{
            transform: [{ rotate }],
          }}
        >
          {icon}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export interface SpeedDialProps extends FABGroupProps {
  // Alias for FABGroup
}

export const SpeedDial: React.FC<SpeedDialProps> = (props) => {
  return <FABGroup {...props} />;
};
