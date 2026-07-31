/// ContactInfoCard component.
/// Rule 11: Feature UI decomposition.
/// Displays direct communication channels (Email, Phone, WhatsApp) with glassmorphic cards.

import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { kContactInfo } from '@/constants/data';

export function ContactInfoCard() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const handleEmail = () => Linking.openURL(`mailto:${kContactInfo.email}`);
  const handlePhone = () => Linking.openURL(`tel:${kContactInfo.phone}`);
  const handleWhatsapp = () => Linking.openURL(kContactInfo.whatsapp);

  const kChannels = [
    { label: t('contact.emailLbl'), val: kContactInfo.email, icon: '✉', color: '#0ea5e9', action: handleEmail },
    { label: t('contact.phoneLbl'), val: kContactInfo.phone, icon: '☎', color: '#10b981', action: handlePhone },
    { label: t('common.whatsapp'), val: '+20 112 115 3059', icon: '💬', color: '#22c55e', action: handleWhatsapp },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.container}>
      {kChannels.map((chan) => (
        <Pressable
          key={chan.label}
          onPress={chan.action}
          style={({ pressed }) => [
            styles.channelCard,
            {
              backgroundColor: pressed ? `${chan.color}15` : colors.surfaceCard,
              borderColor: `${chan.color}35`,
            },
          ]}
        >
          <View style={[styles.iconBox, { backgroundColor: `${chan.color}15`, borderColor: `${chan.color}40` }]}>
            <CustomText data={chan.icon} fontSize={18} color={chan.color} />
          </View>
          <View style={styles.textWrap}>
            <CustomText
              data={chan.label}
              fontSize={11}
              fontFamily={AppFonts.mono}
              color={colors.secondary}
              style={{ textTransform: 'uppercase' }}
            />
            <CustomText
              data={chan.val}
              fontSize={15}
              fontFamily={AppFonts.heading}
              color={colors.primary}
            />
          </View>
          <CustomText data="↗" fontSize={16} color={chan.color} />
        </Pressable>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(12),
    marginVertical: verticalScale(16),
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
    padding: scale(16),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  iconBox: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: verticalScale(2),
  },
});
