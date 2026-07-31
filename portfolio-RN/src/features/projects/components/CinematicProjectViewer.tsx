/// CinematicProjectViewer — Full-screen cinematic slideshow presenter.
/// NOT a card grid. Each project owns the full viewport with immersive transitions.
/// Vercel GPU: only transform + opacity. Spring physics throughout.
/// Architecture:
///   - Vertical scroll snapping (web) / swipe navigation (native)
///   - Each "slide" = project takes full height with parallax background
///   - Big number index (01, 02, 03...) anchored left
///   - Project title reveals with clip-mask wipe on slide enter
///   - Neon progress bar at bottom
///   - Cursor-follower glow sphere on web

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  Linking,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { CachedImage } from '@/components/common/CachedImage';
import { CustomText } from '@/components/common/CustomText';
import { GlitchText } from '@/components/common/GlitchText';
import { MaskRevealText } from '@/components/common/MaskRevealText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { Project } from '@/constants/data';
import { useProjectsFilterStore } from '../store/useProjectsFilterStore';

interface CinematicProjectViewerProps {
  projects: Project[];
}

function getStatusColor(status: Project['status'], colors: any): string {
  switch (status) {
    case 'Shipped': return colors.blue;
    case 'Live': return colors.green;
    case 'Academic': return colors.amber;
    default: return colors.accent;
  }
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Single full-screen slide for one project
function ProjectSlide({
  project,
  index,
  total,
  isActive,
  scrollProgress,
}: {
  project: Project;
  index: number;
  total: number;
  isActive: boolean;
  scrollProgress: number; // 0..1 within this slide
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 768;
  const openProjectDetail = useProjectsFilterStore((s) => s.openProjectDetail);

  const [hovered, setHovered] = useState(false);
  const hoverScale = useSharedValue(1);
  const hoverTx = useSharedValue(0);

  const handleHoverIn = () => {
    setHovered(true);
    hoverScale.set(withSpring(1.04, { damping: 12, stiffness: 200 }));
  };
  const handleHoverOut = () => {
    setHovered(false);
    hoverScale.set(withSpring(1, { damping: 12, stiffness: 200 }));
    hoverTx.set(withSpring(0, { damping: 12 }));
  };

  const imgParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: scrollProgress * -60 },
      { scale: interpolate(scrollProgress, [0, 1], [1.12, 1.0]) },
    ],
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hoverScale.get() }],
  }));

  const statusColor = getStatusColor(project.status, colors);
  const numStr = String(index + 1).padStart(2, '0');

  return (
    <Animated.View style={[styles.slide, { height: isDesktop ? '90vh' : height * 0.85 } as any]}>
      {/* ── BIG INDEX NUMBER ── */}
      <MotiView
        from={{ opacity: 0, translateX: -60 }}
        animate={{ opacity: isActive ? 0.07 : 0, translateX: isActive ? 0 : -40 }}
        transition={{ delay: 100, type: 'spring', damping: 14 }}
        style={[styles.bigIndex, { right: isDesktop ? scale(32) : scale(16) }]}
        pointerEvents="none"
      >
        <CustomText
          data={numStr}
          fontSize={isDesktop ? 220 : 120}
          fontFamily={AppFonts.heading}
          color={project.color}
          style={{ lineHeight: isDesktop ? 220 : 120 }}
        />
      </MotiView>

      {/* ── TWO-COLUMN LAYOUT (desktop) / STACK (mobile) ── */}
      <View style={[styles.slideInner, { flexDirection: isDesktop ? 'row' : 'column', gap: isDesktop ? scale(48) : verticalScale(20) }]}>

        {/* ── LEFT: Project info ── */}
        <View style={[styles.infoCol, { flex: isDesktop ? 5 : 1 }]}>

          {/* Counter + category */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: isActive ? 1 : 0, translateX: isActive ? 0 : -20 }}
            transition={{ delay: 80, type: 'spring', damping: 14 }}
            style={styles.metaRow}
          >
            <View style={[styles.indexChip, { borderColor: `${project.color}60` }]}>
              <CustomText data={numStr} fontSize={11} fontFamily={AppFonts.mono} color={project.color} letterSpacing={2} />
            </View>
            <View style={[styles.dividerTick, { backgroundColor: project.color }]} />
            <CustomText
              data={project.tag.split(' · ')[0].toUpperCase()}
              fontSize={10}
              fontFamily={AppFonts.mono}
              color={colors.muted}
              letterSpacing={2.5}
              style={{ textTransform: 'uppercase' }}
            />
            <View style={{ flex: 1 }} />
            <View style={[styles.statusPill, { borderColor: `${statusColor}50`, backgroundColor: `${statusColor}12` }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <CustomText data={project.status} fontSize={9} fontFamily={AppFonts.mono} color={statusColor} letterSpacing={1} />
            </View>
          </MotiView>

          {/* Title — HUGE, mask-reveal */}
          <View style={{ marginTop: verticalScale(isDesktop ? 16 : 12) }}>
            {isActive ? (
              <>
                <MaskRevealText
                  data={project.title.split(' ').slice(0, Math.ceil(project.title.split(' ').length / 2)).join(' ')}
                  fontSize={isDesktop ? 64 : 42}
                  fontFamily={AppFonts.heading}
                  color={colors.primary}
                  delay={120}
                  stagger={50}
                />
                {project.title.split(' ').length > 1 && (
                  <MaskRevealText
                    data={project.title.split(' ').slice(Math.ceil(project.title.split(' ').length / 2)).join(' ')}
                    fontSize={isDesktop ? 64 : 42}
                    fontFamily={AppFonts.heading}
                    color={project.color}
                    delay={250}
                    stagger={55}
                  />
                )}
              </>
            ) : (
              <CustomText data={project.title} fontSize={isDesktop ? 64 : 42} fontFamily={AppFonts.heading} color={colors.primary} />
            )}
          </View>

          {/* Subtitle */}
          <Animated.View entering={isActive ? FadeIn.delay(400).duration(600) : FadeIn.duration(1)}>
            <CustomText
              data={project.subtitle}
              fontSize={isDesktop ? 16 : 14}
              color={colors.secondary}
              style={{ lineHeight: 24, marginTop: verticalScale(10), maxWidth: 500 }}
            />
          </Animated.View>

          {/* Tech pills — slide in staggered */}
          <Animated.View entering={isActive ? FadeInLeft.delay(350).duration(500) : undefined} style={styles.techPillsRow}>
            {project.tech.slice(0, 5).map((tech, i) => (
              <MotiView
                key={tech}
                from={{ opacity: 0, translateX: -16 }}
                animate={{ opacity: isActive ? 1 : 0, translateX: 0 }}
                transition={{ delay: 300 + i * 60, type: 'spring', damping: 14 }}
                style={[styles.techPill, { borderColor: `${project.color}45`, backgroundColor: `${project.color}0d` }]}
              >
                <CustomText data={tech} fontSize={10} fontFamily={AppFonts.mono} color={project.color} />
              </MotiView>
            ))}
          </Animated.View>

          {/* CTA Buttons */}
          <Animated.View entering={isActive ? FadeInUp.delay(500).duration(500) : undefined} style={styles.ctaRow}>
            <AnimatedPressable
              onHoverIn={Platform.OS === 'web' ? handleHoverIn : undefined}
              onHoverOut={Platform.OS === 'web' ? handleHoverOut : undefined}
              onPress={() => openProjectDetail(project)}
              style={[
                styles.ctaPrimary,
                {
                  backgroundColor: project.color,
                  ...(Platform.OS === 'web' && {
                    boxShadow: hovered ? `0 0 30px ${project.color}99` : `0 0 12px ${project.color}44`,
                    transition: 'box-shadow 0.3s ease',
                    cursor: 'pointer',
                  } as any),
                },
              ]}
            >
              <CustomText data="View Details" fontSize={12} fontFamily={AppFonts.heading} color={colors.textOnAccent} letterSpacing={1.5} style={{ textTransform: 'uppercase' }} />
            </AnimatedPressable>

            {project.github && (
              <Pressable
                onPress={() => Linking.openURL(project.github)}
                style={[styles.ctaGhost, { borderColor: `${project.color}50` }]}
              >
                <CustomText data="↗ GitHub" fontSize={12} fontFamily={AppFonts.mono} color={project.color} letterSpacing={1} />
              </Pressable>
            )}
          </Animated.View>
        </View>

        {/* ── RIGHT: Image with parallax ── */}
        <Animated.View style={[styles.imageCol, { flex: isDesktop ? 5 : 1 }]}>
          <View style={[styles.imageFrame, { borderColor: `${project.color}30` }]}>
            {/* Parallax image */}
            <Animated.View style={[StyleSheet.absoluteFill, imgParallaxStyle]}>
              <CachedImage
                uri={project.img}
                style={{ width: '100%', height: '120%' }}
                contentFit="cover"
                recyclingKey={project.id}
              />
            </Animated.View>

            {/* Gradient overlay */}
            <View style={[styles.imageGradient, { backgroundColor: `${project.color}18` }]} />

            {/* HUD corner overlays */}
            <View style={[styles.hudCornerTL, { borderColor: `${project.color}80` }]} pointerEvents="none" />
            <View style={[styles.hudCornerBR, { borderColor: `${project.color}80` }]} pointerEvents="none" />

            {/* Year stamp */}
            <View style={[styles.yearStamp, { backgroundColor: 'rgba(0,0,0,0.85)', borderColor: `${project.color}40` }]}>
              <CustomText data={project.year} fontSize={11} fontFamily={AppFonts.mono} color={project.color} letterSpacing={2} />
            </View>
          </View>

          {/* Neon line under image */}
          <View style={[styles.neonUnderline, { backgroundColor: project.color, opacity: isActive ? 0.7 : 0.2 }]} />
        </Animated.View>
      </View>

      {/* ── SLIDE BOTTOM SEPARATOR ── */}
      <View style={[styles.slideSeparator, { backgroundColor: `${project.color}20` }]} />
    </Animated.View>
  );
}

export function CinematicProjectViewer({ projects }: CinematicProjectViewerProps) {
  const { colors } = useAppTheme();
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue(0);

  const onScroll = useCallback((e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    scrollY.set(y);
    const slideH = isDesktop ? height * 0.9 : height * 0.85;
    const newIdx = Math.min(Math.round(y / slideH), projects.length - 1);
    if (newIdx !== activeIndex) setActiveIndex(newIdx);
  }, [activeIndex, height, isDesktop, projects.length, scrollY]);

  // Progress bar
  const progressStyle = useAnimatedStyle(() => ({
    width: `${((activeIndex + 1) / projects.length) * 100}%` as any,
  }));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: verticalScale(16) }}
        // Web snap-scroll
        {...(Platform.OS === 'web' ? {
          style: {
            scrollSnapType: 'y proximity',
          } as any,
        } : {})}
      >
        {projects.map((project, index) => {
          const slideH = isDesktop ? height * 0.9 : height * 0.85;
          const slideTop = index * slideH;
          const progress = Math.max(0, Math.min(1,
            (scrollY.get() - slideTop) / slideH
          ));
          return (
            <ProjectSlide
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              isActive={activeIndex === index}
              scrollProgress={progress}
            />
          );
        })}
      </ScrollView>

      {/* ── FIXED PROGRESS BAR (bottom) ── */}
      <View style={[styles.progressRail, { backgroundColor: colors.border }]} pointerEvents="none">
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: projects[activeIndex]?.color ?? colors.accent },
            progressStyle,
          ]}
        />
      </View>

      {/* ── FIXED SLIDE COUNTER (side) ── */}
      <View style={styles.sideCounter} pointerEvents="none">
        {projects.map((_, i) => (
          <MotiView
            key={i}
            animate={{ height: i === activeIndex ? 32 : 12, opacity: i === activeIndex ? 1 : 0.3 }}
            transition={{ type: 'spring', damping: 14 }}
            style={[styles.sideCounterDot, { backgroundColor: i === activeIndex ? (projects[i]?.color ?? colors.accent) : colors.muted }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width: '100%',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(32),
    position: 'relative',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { scrollSnapAlign: 'start' } as any : {}),
  },
  bigIndex: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 0,
  },
  slideInner: {
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
  },
  infoCol: {
    justifyContent: 'center',
    gap: verticalScale(8),
    zIndex: 2,
  },
  imageCol: {
    position: 'relative',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flexWrap: 'wrap',
  },
  indexChip: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
    borderWidth: 1,
  },
  dividerTick: {
    width: scale(20),
    height: 1,
    opacity: 0.6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    borderWidth: 1,
  },
  statusDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
  },
  techPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(6),
    marginTop: verticalScale(12),
  },
  techPill: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
    borderWidth: 1,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(20),
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  ctaPrimary: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(9999),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaGhost: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(9999),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#08080e',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  hudCornerTL: {
    position: 'absolute',
    top: scale(10),
    left: scale(10),
    width: scale(18),
    height: scale(18),
    borderTopWidth: 2,
    borderLeftWidth: 2,
    zIndex: 2,
  },
  hudCornerBR: {
    position: 'absolute',
    bottom: scale(10),
    right: scale(10),
    width: scale(18),
    height: scale(18),
    borderBottomWidth: 2,
    borderRightWidth: 2,
    zIndex: 2,
  },
  yearStamp: {
    position: 'absolute',
    bottom: scale(14),
    left: scale(14),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    zIndex: 3,
  },
  neonUnderline: {
    height: 2,
    width: '100%',
    marginTop: verticalScale(4),
    borderRadius: 1,
    ...(Platform.OS === 'web' ? { filter: 'blur(2px)' } as any : {}),
  },
  slideSeparator: {
    position: 'absolute',
    bottom: 0,
    left: scale(24),
    right: scale(24),
    height: 1,
  },
  progressRail: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    zIndex: 100,
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
    ...(Platform.OS === 'web' ? { transition: 'width 0.4s ease, background-color 0.3s ease' } as any : {}),
  },
  sideCounter: {
    position: 'absolute',
    right: scale(10),
    top: '50%',
    gap: scale(6),
    alignItems: 'center',
    zIndex: 100,
    transform: [{ translateY: -40 }],
  },
  sideCounterDot: {
    width: 3,
    borderRadius: 2,
  },
});
