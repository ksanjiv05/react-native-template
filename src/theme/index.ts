export * from './colors';
export * from './spacing';

export const theme = {
  colors: require('./colors').colors,
  spacing: require('./spacing').spacing,
  radius: require('./spacing').radius,
} as const;
