/// HeroTagline — terminal-typewriter hero subtitle using TypedTerminal.
/// Rule 11 + Rule 3 + Rule 1.

import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { scale } from 'react-native-size-matters';
import { TypedTerminal } from './TypedTerminal';

export function HeroTagline() {
  const { t } = useTranslation();
  return (
    <Animated.View entering={FadeIn.delay(400).duration(600)}>
      <TypedTerminal prompt={t('hud.terminalPrompt')} textKey="hud.typedIntro" speed={22} />
    </Animated.View>
  );
}
