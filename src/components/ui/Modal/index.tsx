import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal as RNModal,
  ModalProps as RNModalProps,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { BaseComponentProps } from '../types';

export interface ModalProps extends BaseComponentProps {
  visible: boolean;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'full';
  position?: 'center' | 'bottom' | 'top';
  animationType?: 'fade' | 'slide' | 'none';
  closeOnBackdrop?: boolean;
  showBackdrop?: boolean;
  children?: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Modal: React.FC<ModalProps & Omit<RNModalProps, 'visible' | 'animationType'>> = ({
  visible,
  onClose,
  size = 'md',
  position = 'center',
  animationType = 'fade',
  closeOnBackdrop = true,
  showBackdrop = true,
  className = '',
  containerClassName = '',
  style,
  testID,
  children,
  ...props
}) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        animationType === 'slide'
          ? Animated.spring(slideAnimation, {
              toValue: 0,
              useNativeDriver: true,
              damping: 20,
              stiffness: 150,
            })
          : Animated.timing(slideAnimation, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        animationType === 'slide'
          ? Animated.timing(slideAnimation, {
              toValue: SCREEN_HEIGHT,
              duration: 200,
              useNativeDriver: true,
            })
          : Animated.timing(slideAnimation, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
      ]).start();
    }
  }, [visible, backdropOpacity, slideAnimation, animationType]);

  const sizeStyles = {
    sm: 'max-w-sm w-11/12',
    md: 'max-w-md w-11/12',
    lg: 'max-w-lg w-11/12',
    full: 'w-full h-full',
  };

  const positionStyles = {
    center: 'justify-center items-center',
    bottom: 'justify-end',
    top: 'justify-start items-center pt-20',
  };

  const contentPositionStyles = {
    center: 'rounded-2xl',
    bottom: 'rounded-t-3xl',
    top: 'rounded-b-3xl',
  };

  const handleBackdropPress = () => {
    if (closeOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      onRequestClose={onClose}
      testID={testID}
      {...props}
    >
      <View className={`flex-1 ${positionStyles[position]} ${containerClassName}`}>
        {/* Backdrop */}
        {showBackdrop && (
          <Pressable
            onPress={handleBackdropPress}
            className="absolute inset-0"
            style={{ backgroundColor: 'transparent' }}
          >
            <Animated.View
              className="flex-1 bg-black"
              style={{
                opacity: backdropOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              }}
            />
          </Pressable>
        )}

        {/* Modal Content */}
        <Animated.View
          className={`bg-white dark:bg-gray-800 ${sizeStyles[size]} ${contentPositionStyles[position]} ${className}`}
          style={[
            style,
            animationType === 'slide'
              ? {
                  transform: [{ translateY: slideAnimation }],
                }
              : {},
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
};

export interface DialogProps extends Omit<ModalProps, 'position' | 'size'> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  description,
  actions,
  children,
  className = '',
  ...props
}) => {
  return (
    <Modal
      {...props}
      position="center"
      size="md"
      className={`p-6 ${className}`}
    >
      {title && (
        <View className="mb-4">
          <View className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </View>
        </View>
      )}

      {description && (
        <View className="mb-6">
          <View className="text-base text-gray-600 dark:text-gray-300">
            {description}
          </View>
        </View>
      )}

      {children && <View className="mb-6">{children}</View>}

      {actions && (
        <View className="flex-row justify-end gap-3">
          {actions}
        </View>
      )}
    </Modal>
  );
};

export interface ModalHeaderProps extends BaseComponentProps {
  children?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  showCloseButton = true,
  onClose,
  className = '',
  containerClassName = '',
  style,
  testID,
}) => {
  return (
    <View
      className={`flex-row items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 ${containerClassName} ${className}`}
      style={style}
      testID={testID}
    >
      <View className="flex-1">{children}</View>
      {showCloseButton && onClose && (
        <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
          <View className="text-gray-500 dark:text-gray-400">✕</View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export interface ModalContentProps extends BaseComponentProps {
  children?: React.ReactNode;
}

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className = '',
  containerClassName = '',
  style,
  testID,
}) => {
  return (
    <View
      className={`py-4 ${containerClassName} ${className}`}
      style={style}
      testID={testID}
    >
      {children}
    </View>
  );
};

export interface ModalFooterProps extends BaseComponentProps {
  children?: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
  containerClassName = '',
  style,
  testID,
}) => {
  return (
    <View
      className={`flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 ${containerClassName} ${className}`}
      style={style}
      testID={testID}
    >
      {children}
    </View>
  );
};
