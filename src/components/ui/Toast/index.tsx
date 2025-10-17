import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { BaseComponentProps } from '../types';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';
export type ToastPosition = 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastProps extends BaseComponentProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  showCloseButton?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'default',
  position = 'top',
  duration = 3000,
  onDismiss,
  action,
  showCloseButton = true,
  className = '',
  containerClassName = '',
  style,
  testID,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<number>();

  const dismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  useEffect(() => {
    if (visible) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Animate in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 150,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss if duration is set
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          dismiss();
        }, duration);
      }
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: position.includes('bottom') ? 100 : -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, position, duration, translateY, opacity, dismiss]);

  const typeStyles = {
    success: 'bg-success border-success',
    error: 'bg-error border-error',
    warning: 'bg-warning border-warning',
    info: 'bg-primary border-primary',
    default: 'bg-gray-800 dark:bg-gray-200 border-gray-800 dark:border-gray-200',
  };

  const textColorStyles = {
    success: 'text-success-foreground',
    error: 'text-error-foreground',
    warning: 'text-warning-foreground',
    info: 'text-primary-foreground',
    default: 'text-white dark:text-gray-900',
  };

  const positionStyles = {
    top: 'top-12 left-4 right-4',
    bottom: 'bottom-12 left-4 right-4',
    'top-right': 'top-12 right-4',
    'top-left': 'top-12 left-4',
    'bottom-right': 'bottom-12 right-4',
    'bottom-left': 'bottom-12 left-4',
  };

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    default: '',
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      className={`absolute z-50 ${positionStyles[position]} ${
        position.includes('left') || position.includes('right') ? 'max-w-sm' : ''
      } ${containerClassName}`}
      style={[
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
      testID={testID}
    >
      <View
        className={`flex-row items-center px-4 py-3 rounded-xl shadow-lg border-l-4 ${typeStyles[type]} ${className}`}
        style={style as ViewStyle}
      >
        {iconMap[type] && (
          <View className="mr-3">
            <Text className={`text-lg font-bold ${textColorStyles[type]}`}>
              {iconMap[type]}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text className={`text-sm font-medium ${textColorStyles[type]}`}>
            {message}
          </Text>
        </View>

        {action && (
          <TouchableOpacity
            onPress={() => {
              action.onPress();
              dismiss();
            }}
            className="ml-3 px-3 py-1"
          >
            <Text className={`text-sm font-semibold ${textColorStyles[type]} uppercase`}>
              {action.label}
            </Text>
          </TouchableOpacity>
        )}

        {showCloseButton && (
          <TouchableOpacity
            onPress={dismiss}
            className="ml-2 p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className={`text-base ${textColorStyles[type]}`}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Toast Manager (Context + Hook)
interface ToastContextValue {
  show: (config: Omit<ToastProps, 'visible' | 'onDismiss'>) => void;
  success: (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => void;
  error: (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => void;
  warning: (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => void;
  info: (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => void;
  dismiss: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

interface ToastState extends Omit<ToastProps, 'visible' | 'onDismiss'> {
  id: number;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);
  const toastIdRef = React.useRef(0);

  const show = useCallback((config: Omit<ToastProps, 'visible' | 'onDismiss'>) => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { ...config, id }]);
  }, []);

  const success = useCallback(
    (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => {
      show({ message, type: 'success', ...config });
    },
    [show]
  );

  const error = useCallback(
    (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => {
      show({ message, type: 'error', ...config });
    },
    [show]
  );

  const warning = useCallback(
    (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => {
      show({ message, type: 'warning', ...config });
    },
    [show]
  );

  const info = useCallback(
    (message: string, config?: Partial<Omit<ToastProps, 'visible' | 'onDismiss' | 'type' | 'message'>>) => {
      show({ message, type: 'info', ...config });
    },
    [show]
  );

  const dismiss = useCallback(() => {
    setToasts((prev) => prev.slice(1));
  }, []);

  const value: ToastContextValue = {
    show,
    success,
    error,
    warning,
    info,
    dismiss,
  };

  // Only show the first toast
  const currentToast = toasts[0];

  return (
    <ToastContext.Provider value={value}>
      {children}
      {currentToast && (
        <Toast
          {...currentToast}
          visible={true}
          onDismiss={dismiss}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
