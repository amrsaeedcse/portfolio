/// CustomTextField — MANDATORY generic input text field.
/// Rule 14 from 04_ui_theme_animations_widgets.md:
/// Text Field -> CustomTextField.tsx. Styled input with consistent decoration.

import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CustomText } from './CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface CustomTextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function CustomTextField({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: CustomTextFieldProps) {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <CustomText
          data={label}
          fontSize={12}
          fontFamily={AppFonts.bodyMedium}
          color={colors.secondary}
          style={styles.label}
        />
      ) : null}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: error ? '#ef4444' : isFocused ? colors.accent : colors.border,
            color: colors.primary,
            fontSize: moderateScale(14),
            fontFamily: AppFonts.body,
          },
          style,
        ]}
        placeholderTextColor={colors.muted}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <CustomText
          data={error}
          fontSize={11}
          color="#ef4444"
          style={styles.error}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  label: {
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderCurve: 'continuous',
  },
  error: {
    marginTop: verticalScale(4),
  },
});
