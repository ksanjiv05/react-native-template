import React from 'react';
import {
  View,
  ViewProps,
  TouchableOpacity,
  TouchableOpacityProps,
  FlatList,
  FlatListProps,
  SectionList,
  SectionListProps,
} from 'react-native';
import { BaseComponentProps } from '../types';

export interface ListProps extends BaseComponentProps {
  variant?: 'default' | 'bordered' | 'divided';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const List: React.FC<ListProps & Omit<ViewProps, 'style'>> = ({
  variant = 'default',
  spacing = 'none',
  className = '',
  containerClassName = '',
  style,
  testID,
  children,
  ...props
}) => {
  const variantStyles = {
    default: '',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
    divided: '',
  };

  const spacingStyles = {
    none: '',
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  };

  return (
    <View
      className={`${variantStyles[variant]} ${spacingStyles[spacing]} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

export interface ListItemProps extends BaseComponentProps {
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'flat';
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  divider?: boolean;
}

export const ListItem: React.FC<ListItemProps & Omit<TouchableOpacityProps, 'style'>> = ({
  onPress,
  variant = 'default',
  leading,
  trailing,
  subtitle,
  children,
  divider = false,
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800',
    elevated: 'bg-white dark:bg-gray-800 shadow-sm rounded-lg',
    flat: 'bg-gray-50 dark:bg-gray-900',
  };

  const interactiveStyles = onPress && !disabled ? 'active:bg-gray-50 dark:active:bg-gray-700' : '';

  const content = (
    <>
      <View
        className={`flex-row items-center p-4 ${variantStyles[variant]} ${interactiveStyles} ${containerClassName} ${className}`}
        style={style}
      >
        {leading && <View className="mr-3">{leading}</View>}

        <View className="flex-1">
          {children}
          {subtitle && <View className="mt-1">{subtitle}</View>}
        </View>

        {trailing && <View className="ml-3">{trailing}</View>}
      </View>

      {divider && (
        <View className="h-px bg-gray-200 dark:bg-gray-700 ml-4" />
      )}
    </>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        activeOpacity={0.7}
        {...props}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} {...props}>
      {content}
    </View>
  );
};

export interface ListSectionProps extends BaseComponentProps {
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const ListSection: React.FC<ListSectionProps & Omit<ViewProps, 'style'>> = ({
  title,
  header,
  footer,
  children,
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
      {(title || header) && (
        <View className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
          {header || (
            <View className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {title}
            </View>
          )}
        </View>
      )}

      {children}

      {footer && (
        <View className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
          {footer}
        </View>
      )}
    </View>
  );
};

export interface ListDividerProps extends BaseComponentProps {
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  inset?: boolean;
}

export const ListDivider: React.FC<ListDividerProps & Omit<ViewProps, 'style'>> = ({
  spacing = 'none',
  inset = false,
  className = '',
  containerClassName = '',
  style,
  testID,
  ...props
}) => {
  const spacingStyles = {
    none: '',
    sm: 'my-1',
    md: 'my-2',
    lg: 'my-4',
  };

  const insetStyles = inset ? 'ml-4' : '';

  return (
    <View
      className={`h-px bg-gray-200 dark:bg-gray-700 ${spacingStyles[spacing]} ${insetStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    />
  );
};

// FlatList wrapper with consistent styling
export interface StyledFlatListProps<T> extends BaseComponentProps {
  data: ReadonlyArray<T>;
  renderItem: FlatListProps<T>['renderItem'];
  variant?: 'default' | 'bordered' | 'divided';
  showDividers?: boolean;
  keyExtractor?: FlatListProps<T>['keyExtractor'];
}

export function StyledFlatList<T>({
  data,
  renderItem,
  variant = 'default',
  showDividers = false,
  keyExtractor,
  className = '',
  containerClassName = '',
  style,
  testID,
  ...props
}: StyledFlatListProps<T> & Omit<FlatListProps<T>, 'data' | 'renderItem' | 'style'>) {
  const variantStyles = {
    default: '',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg',
    divided: '',
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={
        showDividers || variant === 'divided'
          ? () => <ListDivider inset />
          : undefined
      }
      className={`${variantStyles[variant]} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...(props as any)}
    />
  );
}

// SectionList wrapper with consistent styling
export interface StyledSectionListProps<T, S = any> extends BaseComponentProps {
  sections: ReadonlyArray<SectionListProps<T, S>['sections'][0]>;
  renderItem: SectionListProps<T, S>['renderItem'];
  renderSectionHeader?: SectionListProps<T, S>['renderSectionHeader'];
  variant?: 'default' | 'bordered' | 'divided';
  showDividers?: boolean;
  keyExtractor?: SectionListProps<T, S>['keyExtractor'];
}

export function StyledSectionList<T, S = any>({
  sections,
  renderItem,
  renderSectionHeader,
  variant = 'default',
  showDividers = false,
  keyExtractor,
  className = '',
  containerClassName = '',
  style,
  testID,
  ...props
}: StyledSectionListProps<T, S> & Omit<SectionListProps<T, S>, 'sections' | 'renderItem' | 'style'>) {
  const variantStyles = {
    default: '',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg',
    divided: '',
  };

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={
        showDividers || variant === 'divided'
          ? () => <ListDivider inset />
          : undefined
      }
      className={`${variantStyles[variant]} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...(props as any)}
    />
  );
}
