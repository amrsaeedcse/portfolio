/// ScrollHint — HUD-style rotating ring + pulsing chevron.
/// Rule 11 + Rule 3 + Rule 1. GPU transform + opacity only.

import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

export function ScrollHint() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const spin = useSharedValue(0);
  const arrowY = useSharedValue(0);

  useEffect(() => {
    spin.set(
      withRepeat(withTiming(360, { duration: 9000, easing: Easing.linear }), -1, false)
    );
    arrowY.set(
      withRepeat(
        withSequence(
          withTiming(scale(6), { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [spin, arrowY]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.get()}deg` }],
  }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arrowY.get() }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.ring, { borderColor: colors.accent, borderTopColor: 'transparent' }, spinStyle]}
      />
      <View style={styles.center}>
        <Animated.View style={arrowStyle}>
          <CustomText data="↓" fontSize={14} color={colors.accent} textAlign="center" />
        </Animated.View>
        <CustomText
          data={t('common.scroll')}
          fontSize={8}
          color={colors.muted}
          fontFamily={AppFonts.mono}
          textAlign="center"
          letterSpacing={3}
          style={{ textTransform: 'uppercase', marginTop: 4 }}
        />
      </View>
    </View>
  );
}

const kRing = scale(46);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: verticalScale(28),
  },
  ring: {
    width: kRing,
    height: kRing,
    borderRadius: kRing / 2,
    borderWidth: moderateScale(2),
    borderStyle: 'dashed',
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    height: kRing,
  },
});
