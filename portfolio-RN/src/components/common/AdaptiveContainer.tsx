/// AdaptiveContainer component.
/// Rule 10: Responsive Sizing & Web Adaptive Layouts.
/// Ensures content on Desktop / Tablet Web is constrained to a readable maxWidth (1140px) and centered,
/// while seamlessly expanding to full width on mobile devices.

import React from 'react';
import { View, StyleSheet, useWindowDimensions, ViewStyle, StyleProp } from 'react-native';
import { scale } from 'react-native-size-matters';

interface AdaptiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export function AdaptiveContainer({
  children,
  style,
  maxWidth = 1140,
}: AdaptiveContainerProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View
      style={[
        styles.root,
        {
          maxWidth: isDesktop ? maxWidth : '100%',
          paddingHorizontal: isDesktop ? 32 : scale(16),
          paddingTop: isDesktop ? 88 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
});
