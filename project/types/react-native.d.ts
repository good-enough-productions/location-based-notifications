// This file adds type declarations for React Native components
declare module 'react-native' {
  import type { ComponentType, ReactNode } from 'react';

  // Basic Components
  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;
  export const Image: ComponentType<ImageProps>;
  export const ScrollView: ComponentType<ScrollViewProps>;
  export const TextInput: ComponentType<TextInputProps>;
  export const TouchableOpacity: ComponentType<TouchableOpacityProps>;
  export const TouchableHighlight: ComponentType<TouchableHighlightProps>;
  export const RefreshControl: ComponentType<RefreshControlProps>;

  // Style Types
  export type StyleProp<T> = T | T[] | null | undefined;
  export type ViewStyle = Record<string, any>;
  export type TextStyle = Record<string, any>;
  export type ImageStyle = Record<string, any>;

  // StyleSheet API
  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
    absoluteFillObject: ViewStyle;
    flatten: <T>(style: StyleProp<T>) => T;
  };

  // Prop Types
  export interface ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface TextProps {
    style?: StyleProp<TextStyle>;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface ImageProps {
    style?: StyleProp<ImageStyle>;
    source: { uri: string } | number;
    [key: string]: any;
  }

  export interface ScrollViewProps extends ViewProps {
    refreshControl?: ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    [key: string]: any;
  }

  export interface TextInputProps extends ViewProps {
    value?: string;
    onChangeText?: (text: string) => void;
    [key: string]: any;
  }

  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    [key: string]: any;
  }

  export interface TouchableHighlightProps extends ViewProps {
    onPress?: () => void;
    [key: string]: any;
  }

  export interface RefreshControlProps {
    refreshing: boolean;
    onRefresh: () => void;
    [key: string]: any;
  }

  // Platform API
  export const Platform: {
    OS: 'ios' | 'android' | 'web';
    Version: number;
    select: <T extends Record<string, any>>(obj: T) => any;
  };
}