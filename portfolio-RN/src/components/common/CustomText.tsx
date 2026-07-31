/// CustomText — MANDATORY wrapper for ALL text in the app.
/// Rule 1: NEVER use raw <Text> — always use this component.
/// Uses moderateScale() for font sizing and colors from useAppTheme().

import React, { memo } from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { AppFonts } from '@/core/theme/appFonts';
import { useAppTheme } from '@/core/theme/ThemeContext';

interface CustomTextProps extends TextProps {
  /// The text content to display.
  data: string;
  /// Font size in logical points — will be scaled via moderateScale().
  fontSize: number;
  fontWeight?: TextStyle['fontWeight'];
  fontFamily?: string;
  color?: string;
  maxLines?: number;
  textAlign?: TextStyle['textAlign'];
  letterSpacing?: number;
  lineHeight?: number;
}

/// Portfolio's standard text component. Always renders within a <Text> node
/// and applies the project's typography system automatically.
export const CustomText = memo(function CustomText({
  data,
  fontSize,
  fontWeight = '400',
  fontFamily,
  color,
  maxLines,
  textAlign = 'left',
  letterSpacing,
  lineHeight,
  style,
  ...rest
}: CustomTextProps) {
  const { colors } = useAppTheme();

  return (
    <Text
      numberOfLines={maxLines}
      ellipsizeMode={maxLines ? 'tail' : undefined}
      style={[
        {
          fontSize: moderateScale(fontSize),
          fontWeight,
          fontFamily: fontFamily ?? AppFonts.mainFontName,
          color: color ?? colors.primary,
          textAlign,
          letterSpacing,
          lineHeight: lineHeight ? moderateScale(lineHeight) : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {data}
    </Text>
  );
});
