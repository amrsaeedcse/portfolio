/// ContactFormWidget component.
/// Rule 11: Feature UI decomposition.
/// Provides an interactive message submission form using CustomTextField and CustomButton.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@/components/common/CustomText';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomButton } from '@/components/common/CustomButton';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { useContactFormStore } from '../store/useContactFormStore';

export function ContactFormWidget() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const {
    name,
    email,
    message,
    status,
    setName,
    setEmail,
    setMessage,
    submitForm,
  } = useContactFormStore();

  const isSending = status === 'sending';
  const isSuccess = status === 'success';

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(450)}
      style={[
        styles.formCard,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.topAccent, { backgroundColor: colors.accent }]} />

      <CustomText
        data={t('common.letsTalk')}
        fontSize={18}
        fontFamily={AppFonts.heading}
        color={colors.primary}
        style={{ marginBottom: verticalScale(16) }}
      />

      <CustomTextField
        label={t('contact.nameInput')}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Alex Rivera"
        editable={!isSending}
      />

      <CustomTextField
        label={t('contact.emailInput')}
        value={email}
        onChangeText={setEmail}
        placeholder="alex@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isSending}
      />

      <CustomTextField
        label={t('contact.messageInput')}
        value={message}
        onChangeText={setMessage}
        placeholder="Tell me about your project or architecture needs..."
        multiline
        numberOfLines={4}
        style={{ height: verticalScale(100), textAlignVertical: 'top' }}
        editable={!isSending}
      />

      {isSuccess ? (
        <Animated.View entering={ZoomIn.duration(300)} style={[styles.successBanner, { backgroundColor: '#10b98115', borderColor: '#10b98150' }]}>
          <CustomText data="✓" fontSize={16} color="#10b981" />
          <CustomText data={t('contact.successMsg')} fontSize={13} color="#10b981" style={{ flex: 1 }} />
        </Animated.View>
      ) : null}

      <CustomButton
        title={isSending ? t('contact.sending') : t('contact.sendBtn')}
        onPress={submitForm}
        variant="primary"
        loading={isSending}
        disabled={!name.trim() || !email.trim() || !message.trim() || isSending}
        style={{ marginTop: verticalScale(8) }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    padding: scale(20),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderCurve: 'continuous',
    position: 'relative',
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    padding: scale(12),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    marginBottom: verticalScale(12),
  },
});
