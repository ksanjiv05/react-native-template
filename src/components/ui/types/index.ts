import { Animated, ViewStyle } from 'react-native';

export type BaseComponentProps = {
  containerClassName?: string;
  contentClassName?: string;
  className?: string;
  style?: Animated.Value | ViewStyle;
  disabled?: boolean;
  testID?: string;
};
