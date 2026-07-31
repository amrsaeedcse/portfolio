/// MaskRevealText — cinematic text mask-wipe reveal animation.
/// Rule 14: shared generic component in src/components/common/.
/// Vercel animation-gpu-properties: only transform (translateX) + opacity.
/// Splits text into lines/words and wipes each in sequence with a clip mask.

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface MaskRevealTextProps {
  /** Full text to reveal word-by-word. */
  data: string;
  /** Font size (will be passed to moderateScale). */
  fontSize: number;
  /** Optional fontFamily. Defaults to AppFonts.heading. */
  fontFamily?: string;
  /** Text color. */
  color?: string;
  /** Delay before reveal starts (ms). */
  delay?: number;
  /** Stagger per word (ms). */
  stagger?: number;
  /** Duration per word reveal. */
  wordDuration?: number;
  style?: StyleProp<ViewStyle>;
}

interface WordRevealProps {
  word: string;
  index: number;
  delay: number;
  stagger: number;
  wordDuration: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

function WordReveal({
  word,
  index,
  delay,
  stagger,
  wordDuration,
  fontSize,
  fontFamily,
  color,
}: WordRevealProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const wordDelay = delay + index * stagger;
    const timeout = setTimeout(() => {
      translateY.set(withSpring(0, { damping: 18, stiffness: 100, mass: 0.8 }));
      opacity.set(withTiming(1, { duration: wordDuration * 0.6, easing: Easing.out(Easing.cubic) }));
    }, wordDelay);
    return () => clearTimeout(timeout);
  }, [delay, index, stagger, wordDuration, translateY, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
    opacity: opacity.get(),
  }));

  return (
    <View style={styles.wordClip}>
      <Animated.Text
        style={[
          {
            fontSize: moderateScale(fontSize),
            fontFamily,
            color,
            includeFontPadding: false,
            ...(Platform.OS === 'web' && { willChange: 'transform, opacity' } as any),
          },
          style,
        ]}
      >
        {word}{' '}
      </Animated.Text>
    </View>
  );
}

export function MaskRevealText({
  data,
  fontSize,
  fontFamily = AppFonts.heading,
  color,
  delay = 0,
  stagger = 80,
  wordDuration = 500,
  style,
}: MaskRevealTextProps) {
  const { colors } = useAppTheme();
  const resolvedColor = color ?? colors.primary;
  const words = data.split(' ').filter(Boolean);

  return (
    <View style={[styles.container, style]}>
      {words.map((word, i) => (
        <WordReveal
          key={`${word}-${i}`}
          word={word}
          index={i}
          delay={delay}
          stagger={stagger}
          wordDuration={wordDuration}
          fontSize={fontSize}
          fontFamily={fontFamily}
          color={resolvedColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'visible',
  },
  wordClip: {
    overflow: 'hidden',
    marginRight: 0,
  },
});
