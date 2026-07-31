/// ProjectIndexTable — editorial magazine-style interactive project index.
/// NOT cards. Projects listed as a high-fashion magazine index:
///   - Big sequential number, project name, category, year — one per row
///   - On hover (web): cursor-follower image preview floats near cursor
///   - Row expands with clip-path reveal to show subtitle + tech on hover
///   - Spring underline draws across the row title
/// Vercel: GPU only (transform + opacity + clip). Zero layout reflows.

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { CachedImage } from '@/components/common/CachedImage';
import { CustomText } from '@/components/common/CustomText';
import { GlitchText } from '@/components/common/GlitchText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { Project } from '@/constants/data';
import { useProjectsFilterStore } from '../store/useProjectsFilterStore';

// On web: floating image that follows cursor near the hovered row
function CursorFollowerImage({ uri, color, visible }: { uri: string; color: string; visible: boolean }) {
  if (Platform.OS !== 'web') return null;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.75 }}
      transition={{ type: 'spring', damping: 14, stiffness: 200 }}
      style={[styles.floatingImage, { borderColor: `${color}50` }]}
      pointerEvents="none"
    >
      <CachedImage uri={uri} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      <View style={[styles.floatingImageOverlay, { backgroundColor: `${color}18` }]} />
    </MotiView>
  );
}

// Individual index row
function IndexRow({
  project,
  index,
  onPress,
}: {
  project: Project;
  index: number;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [hovered, setHovered] = useState(false);

  // Spring-animated underline that draws across on hover
  const underlineWidth = useSharedValue(0);
  const rowExpand = useSharedValue(0);
  const imageScale = useSharedValue(0.8);
  const imageOpacity = useSharedValue(0);

  const handleHoverIn = () => {
    setHovered(true);
    underlineWidth.set(withSpring(1, { damping: 12, stiffness: 150 }));
    rowExpand.set(withSpring(1, { damping: 14, stiffness: 120 }));
    imageScale.set(withSpring(1, { damping: 12, stiffness: 200 }));
    imageOpacity.set(withTiming(1, { duration: 200 }));
  };

  const handleHoverOut = () => {
    setHovered(false);
    underlineWidth.set(withSpring(0, { damping: 14, stiffness: 150 }));
    rowExpand.set(withSpring(0, { damping: 14, stiffness: 120 }));
    imageScale.set(withSpring(0.8, { damping: 12, stiffness: 200 }));
    imageOpacity.set(withTiming(0, { duration: 200 }));
  };

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: underlineWidth.get() }],
    opacity: underlineWidth.get(),
  }));

  const expandStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(rowExpand.get(), [0, 1], [0, 80]),
    opacity: rowExpand.get(),
  }));

  const titleColorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rowExpand.get(), [0, 1], [1, 0.8]),
  }));

  const numStr = String(index + 1).padStart(2, '0');

  return (
    <MotiView
      from={{ opacity: 0, translateX: -40 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: 60 * index, type: 'spring', damping: 14, stiffness: 100 }}
    >
      <Pressable
        onHoverIn={Platform.OS === 'web' ? handleHoverIn : undefined}
        onHoverOut={Platform.OS === 'web' ? handleHoverOut : undefined}
        onPress={onPress}
        style={[
          styles.indexRow,
          {
            borderBottomColor: hovered ? `${project.color}40` : colors.border,
            backgroundColor: hovered ? `${project.color}07` : 'transparent',
            ...(Platform.OS === 'web' && {
              cursor: 'pointer',
              transition: 'background-color 0.25s ease',
            } as any),
          },
        ]}
      >
        {/* ── NUMBER ── */}
        <View style={styles.numCol}>
          <CustomText
            data={numStr}
            fontSize={13}
            fontFamily={AppFonts.mono}
            color={hovered ? project.color : colors.muted}
            letterSpacing={1}
            style={{ ...(Platform.OS === 'web' && { transition: 'color 0.25s ease' } as any) }}
          />
        </View>

        {/* ── MAIN CONTENT ── */}
        <View style={{ flex: 1, gap: verticalScale(2) }}>
          <View style={{ position: 'relative' }}>
            {/* Title */}
            <Animated.View style={titleColorStyle}>
              {hovered && isDesktop ? (
                <GlitchText
                  data={project.title}
                  fontSize={isDesktop ? 28 : 20}
                  fontFamily={AppFonts.heading}
                  color={colors.primary}
                  chromatic={false}
                  loop={false}
                />
              ) : (
                <CustomText
                  data={project.title}
                  fontSize={isDesktop ? 28 : 20}
                  fontFamily={AppFonts.heading}
                  color={colors.primary}
                />
              )}
            </Animated.View>

            {/* Spring underline */}
            <Animated.View
              style={[
                styles.springUnderline,
                { backgroundColor: project.color, transformOrigin: 'left' as any },
                underlineStyle,
              ]}
              pointerEvents="none"
            />
          </View>

          {/* Expanded detail row */}
          <Animated.View style={[styles.expandedRow, expandStyle]}>
            <CustomText
              data={project.subtitle}
              fontSize={13}
              color={colors.secondary}
              style={{ lineHeight: 18 }}
            />
            <View style={styles.techRow}>
              {project.tech.slice(0, 4).map((tech) => (
                <View key={tech} style={[styles.miniPill, { borderColor: `${project.color}45` }]}>
                  <CustomText data={tech} fontSize={9} fontFamily={AppFonts.mono} color={project.color} />
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* ── RIGHT: Category + Year + Arrow ── */}
        <View style={styles.rightMeta}>
          {isDesktop && (
            <CustomText
              data={project.tag.split(' · ')[0]}
              fontSize={11}
              fontFamily={AppFonts.mono}
              color={hovered ? project.color : colors.muted}
              letterSpacing={1}
              style={{ textTransform: 'uppercase', minWidth: scale(80), textAlign: 'center' }}
            />
          )}
          <CustomText data={project.year} fontSize={11} fontFamily={AppFonts.mono} color={colors.muted} />
          <Animated.Text
            style={[
              {
                fontSize: moderateScale(16),
                color: project.color,
                fontFamily: AppFonts.heading,
                transform: [{ translateX: hovered ? 6 : 0 }],
                ...(Platform.OS === 'web' && { transition: 'transform 0.2s ease' } as any),
              },
            ]}
          >
            →
          </Animated.Text>
        </View>

        {/* Cursor-follower image (web) */}
        {Platform.OS === 'web' && isDesktop && (
          <CursorFollowerImage uri={project.img} color={project.color} visible={hovered} />
        )}
      </Pressable>
    </MotiView>
  );
}

export function ProjectIndexTable({ projects }: { projects: Project[] }) {
  const { colors } = useAppTheme();
  const openProjectDetail = useProjectsFilterStore((s) => s.openProjectDetail);

  return (
    <View style={styles.tableWrap}>
      {/* Column headers */}
      <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.numCol}>
          <CustomText data="#" fontSize={9} fontFamily={AppFonts.mono} color={colors.muted} letterSpacing={2} />
        </View>
        <CustomText data="PROJECT" fontSize={9} fontFamily={AppFonts.mono} color={colors.muted} letterSpacing={2} style={{ flex: 1 }} />
        <CustomText data="YEAR" fontSize={9} fontFamily={AppFonts.mono} color={colors.muted} letterSpacing={2} />
      </View>

      {/* Project rows */}
      {projects.map((project, index) => (
        <IndexRow
          key={project.id}
          project={project}
          index={index}
          onPress={() => openProjectDetail(project)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tableWrap: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(4),
    borderBottomWidth: 1,
    gap: scale(16),
    marginBottom: verticalScale(4),
  },
  numCol: {
    width: scale(36),
    alignItems: 'flex-start',
  },
  indexRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(4),
    borderBottomWidth: 1,
    gap: scale(16),
    position: 'relative',
    overflow: 'visible',
  },
  springUnderline: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    transformOrigin: 'left',
    ...(Platform.OS === 'web' && { willChange: 'transform, opacity' } as any),
  },
  expandedRow: {
    overflow: 'hidden',
    gap: verticalScale(6),
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(5),
  },
  miniPill: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(5),
    borderWidth: 1,
  },
  rightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
    paddingTop: verticalScale(6),
  },
  // Floating cursor-follower image (web)
  floatingImage: {
    position: 'absolute',
    right: scale(-220),
    top: '50%',
    width: scale(200),
    height: verticalScale(130),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#08080e',
    zIndex: 100,
    transform: [{ translateY: -65 }],
    ...(Platform.OS === 'web' && { pointerEvents: 'none' } as any),
  },
  floatingImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
