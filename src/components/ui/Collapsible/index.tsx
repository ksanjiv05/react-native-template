import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  ViewProps,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { BaseComponentProps } from '../types';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface CollapsibleProps extends BaseComponentProps {
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  title?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  animationType?: 'timing' | 'spring' | 'layout';
  duration?: number;
  collapsedHeight?: number;
  showIndicator?: boolean;
  indicatorPosition?: 'left' | 'right';
}

export const Collapsible: React.FC<CollapsibleProps & Omit<ViewProps, 'style'>> = ({
  expanded: controlledExpanded,
  onToggle,
  title,
  header,
  children,
  animationType = 'timing',
  duration = 300,
  collapsedHeight = 0,
  showIndicator = true,
  indicatorPosition = 'right',
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  ...props
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const rotateAnimation = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const heightAnimation = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    if (animationType === 'layout') {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          duration,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );
    } else if (animationType === 'spring') {
      Animated.parallel([
        Animated.spring(rotateAnimation, {
          toValue: expanded ? 1 : 0,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
        Animated.spring(heightAnimation, {
          toValue: expanded ? 1 : 0,
          useNativeDriver: false,
          damping: 15,
          stiffness: 150,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(rotateAnimation, {
          toValue: expanded ? 1 : 0,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(heightAnimation, {
          toValue: expanded ? 1 : 0,
          duration: duration,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [expanded, rotateAnimation, heightAnimation, animationType, duration]);

  const handleToggle = () => {
    if (disabled) return;

    const newExpanded = !expanded;

    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }

    if (onToggle) {
      onToggle(newExpanded);
    }
  };

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const indicatorComponent = showIndicator ? (
    <Animated.View
      style={{
        transform: [{ rotate }],
      }}
    >
      <View className="text-gray-600 dark:text-gray-400 text-base">▼</View>
    </Animated.View>
  ) : null;

  return (
    <View
      className={`${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={handleToggle}
        disabled={disabled}
        activeOpacity={0.7}
        className={`flex-row items-center justify-between ${
          disabled ? 'opacity-50' : ''
        }`}
      >
        {indicatorPosition === 'left' && indicatorComponent && (
          <View className="mr-3">{indicatorComponent}</View>
        )}

        <View className="flex-1">
          {header || (
            <View className="py-3">
              {title}
            </View>
          )}
        </View>

        {indicatorPosition === 'right' && indicatorComponent && (
          <View className="ml-3">{indicatorComponent}</View>
        )}
      </TouchableOpacity>

      {/* Content */}
      {animationType === 'layout' ? (
        expanded && (
          <View className="overflow-hidden">
            {children}
          </View>
        )
      ) : (
        <Animated.View
          style={{
            opacity: heightAnimation,
            maxHeight: heightAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [collapsedHeight, 10000],
            }),
            overflow: 'hidden',
          }}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
};

export interface CollapsibleHeaderProps extends BaseComponentProps {
  children?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const CollapsibleHeader: React.FC<CollapsibleHeaderProps & Omit<ViewProps, 'style'>> = ({
  children,
  subtitle,
  className = '',
  containerClassName = '',
  style,
  testID,
  ...props
}) => {
  return (
    <View
      className={`${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      <View>{children}</View>
      {subtitle && <View className="mt-1">{subtitle}</View>}
    </View>
  );
};

export interface CollapsibleContentProps extends BaseComponentProps {
  children?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CollapsibleContent: React.FC<CollapsibleContentProps & Omit<ViewProps, 'style'>> = ({
  children,
  padding = 'md',
  className = '',
  containerClassName = '',
  style,
  testID,
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <View
      className={`${paddingStyles[padding]} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

// Accordion component for managing multiple collapsibles
export interface AccordionProps extends BaseComponentProps {
  children?: React.ReactNode;
  allowMultiple?: boolean;
  defaultExpanded?: number[];
}

export const Accordion: React.FC<AccordionProps & Omit<ViewProps, 'style'>> = ({
  children,
  allowMultiple = false,
  defaultExpanded = [],
  className = '',
  containerClassName = '',
  style,
  testID,
  ...props
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>(defaultExpanded);

  const handleToggle = (index: number) => {
    setExpandedItems((prev) => {
      if (allowMultiple) {
        // Multiple items can be open
        if (prev.includes(index)) {
          return prev.filter((i) => i !== index);
        } else {
          return [...prev, index];
        }
      } else {
        // Only one item can be open
        if (prev.includes(index)) {
          return [];
        } else {
          return [index];
        }
      }
    });
  };

  return (
    <View
      className={`${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Collapsible) {
          return React.cloneElement(child as React.ReactElement<CollapsibleProps>, {
            expanded: expandedItems.includes(index),
            onToggle: () => handleToggle(index),
          });
        }
        return child;
      })}
    </View>
  );
};
