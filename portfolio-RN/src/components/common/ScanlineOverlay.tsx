/// ScanlineOverlay — retro CRT scanline + vignette HUD overlay.
/// Rule 14: Shared generic component. Pointer-events none so it never blocks interaction.
/// Pure decoration — uses a tiled linear-gradient on web and a striping pattern on native.

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { scale } from 'react-native-size-matters';

interface ScanlineOverlayProps {
  /** Opacity of the scanlines 0..1. */
  intensity?: number;
  /** Add a subtle CRT vignette around the screen edges. */
  vignette?: boolean;
  /** Add a slow flicker gradient on top (BEST on web). */
  flicker?: boolean;
}

export function ScanlineOverlay({
  intensity = 0.5,
  vignette = true,
  flicker = true,
}: ScanlineOverlayProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.root} pointerEvents="none">
      {/* Scanlines */}
      <View
        style={[
          styles.scanlines,
          {
            opacity: intensity,
            ...(Platform.OS === 'web'
              ? {
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 2px, rgba(0,0,0,0.45) 3px, rgba(0,0,0,0.0) 4px)',
                }
              : {}),
          },
        ]}
      >
        {!Platform.OS === ('web' as any) ? null : null}
      </View>

      {/* Vignette */}
      {vignette ? (
        <View
          style={[
            styles.vignette,
            {
              ...(Platform.OS === 'web'
                ? {
                    backgroundImage:
                      'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
                  }
                : {}),
              borderColor: colors.accent,
            },
          ]}
        />
      ) : null}

      {/* Flicker band */}
      {flicker && Platform.OS === 'web' ? (
        <View
          style={[
            styles.flicker,
            {
              backgroundImage:
                'linear-gradient(180deg, rgba(0,255,209,0.04) 0%, rgba(0,0,0,0) 50%)',
            },
          ]}
        />
      ) : null}

      {/* Corner HUD brackets */}
      <View style={[styles.bracket, styles.bracketTL, { borderColor: colors.accent }]} />
      <View style={[styles.bracket, styles.bracketTR, { borderColor: colors.accent }]} />
      <View style={[styles.bracket, styles.bracketBL, { borderColor: colors.accent }]} />
      <View style={[styles.bracket, styles.bracketBR, { borderColor: colors.accent }]} />
    </View>
  );
}

const kBracketLen = scale(18);
const kBracketThick = scale(2);

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 5,
    overflow: 'hidden',
  },
  scanlines: {
    ...StyleSheet.absoluteFill,
    ...(Platform.OS !== 'web' && {
      // Native crude scanline bands without gradients — light overlay only.
      backgroundColor: 'rgba(0,0,0,0.04)',
    }),
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    borderWidth: 0,
  },
  flicker: {
    ...StyleSheet.absoluteFill,
  },
  bracket: {
    position: 'absolute',
    width: kBracketLen,
    height: kBracketLen,
    borderStyle: 'solid',
  },
  bracketTL: {
    top: scale(12),
    left: scale(12),
    borderLeftWidth: kBracketThick,
    borderTopWidth: kBracketThick,
  },
  bracketTR: {
    top: scale(12),
    right: scale(12),
    borderRightWidth: kBracketThick,
    borderTopWidth: kBracketThick,
  },
  bracketBL: {
    bottom: scale(12),
    left: scale(12),
    borderLeftWidth: kBracketThick,
    borderBottomWidth: kBracketThick,
  },
  bracketBR: {
    bottom: scale(12),
    right: scale(12),
    borderRightWidth: kBracketThick,
    borderBottomWidth: kBracketThick,
  },
});
