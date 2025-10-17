import React from 'react';
import { View, ViewProps } from 'react-native';
import { BaseComponentProps } from '../types';

export interface GridProps extends BaseComponentProps {
  columns?: 1 | 2 | 3 | 4;
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
}

export const Grid: React.FC<GridProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  columns = 2,
  spacing = 'md',
  children,
  ...props
}) => {
  const spacingStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const disabledStyles = disabled ? 'opacity-50' : '';

  // Convert children to array
  const childArray = React.Children.toArray(children);

  // Calculate column width based on columns and spacing
  const getItemWidth = () => {
    // Approximate percentage accounting for gaps
    const spacingValues = { none: 0, xs: 1, sm: 2, md: 4, lg: 6, xl: 8 };
    const gap = spacingValues[spacing];
    const totalGaps = (columns - 1) * gap;
    const baseWidth = 100 / columns;

    // Return flex basis approximation
    return `${baseWidth - (totalGaps / columns)}%`;
  };

  return (
    <View
      className={`flex-row flex-wrap ${spacingStyles[spacing]} ${disabledStyles} ${containerClassName} ${className}`}
      style={style}
      testID={testID}
      {...props}
    >
      {childArray.map((child, index) => (
        <View
          key={index}
          style={{
            flexBasis: getItemWidth(),
            minWidth: 0, // Prevent overflow
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

export interface GridItemProps extends BaseComponentProps {
  span?: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
}

export const GridItem: React.FC<GridItemProps & Omit<ViewProps, 'style'>> = ({
  className = '',
  containerClassName = '',
  style,
  disabled = false,
  testID,
  span = 1,
  children,
  ...props
}) => {
  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <View
      className={`${disabledStyles} ${containerClassName} ${className}`}
      style={[{ flex: span }, style]}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};
