/// ProjectsScreen — TRIPLE-VIEW FLAGSHIP SCREEN.
/// 3 completely different project display modes toggled by user:
///   [1] CINEMATIC — full-screen slideshow, each project = full viewport
///   [2] INDEX — editorial magazine table (title + hover reveal + cursor image)
///   [3] GRID — holographic neon cards (original)
/// Rule 11: Feature UI decomposition. All views use GPU-only animations.

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { AdaptiveContainer } from '@/components/common/AdaptiveContainer';
import { AmbientGlowBackground } from '@/components/common/AmbientGlowBackground';
import { GridMeshBackground } from '@/components/common/GridMeshBackground';
import { ParticleField } from '@/components/common/ParticleField';
import { GlitchText } from '@/components/common/GlitchText';
import { MaskRevealText } from '@/components/common/MaskRevealText';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { usePortfolioStore } from '@/stores/global/usePortfolioStore';
import { kProjects } from '@/constants/data';

import { ProjectCard } from '../components/ProjectCard';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { ProjectFilterBar } from '../components/ProjectFilterBar';
import { CinematicProjectViewer } from '../components/CinematicProjectViewer';
import { ProjectIndexTable } from '../components/ProjectIndexTable';
import { useProjectsFilterStore } from '../store/useProjectsFilterStore';

type ViewMode = 'cinematic' | 'index' | 'grid';

const VIEW_MODES: { id: ViewMode; icon: string; label: string }[] = [
  { id: 'cinematic', icon: '⬛', label: 'CINEMA' },
  { id: 'index', icon: '☰', label: 'INDEX' },
  { id: 'grid', icon: '⊞', label: 'GRID' },
];

function ViewToggle({ active, onChange }: { active: ViewMode; onChange: (v: ViewMode) => void }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.toggleBar, { borderColor: colors.border, backgroundColor: 'rgba(0,0,0,0.45)' }]}>
      {VIEW_MODES.map((mode) => {
        const isActive = mode.id === active;
        return (
          <Pressable
            key={mode.id}
            onPress={() => onChange(mode.id)}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: isActive ? `${colors.accent}20` : 'transparent',
                borderColor: isActive ? `${colors.accent}60` : 'transparent',
              },
            ]}
          >
            <CustomText
              data={`${mode.icon} ${mode.label}`}
              fontSize={9}
              fontFamily={AppFonts.mono}
              color={isActive ? colors.accent : colors.muted}
              letterSpacing={1.5}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export function ProjectsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isWideDesktop = width >= 1100;

  const [viewMode, setViewMode] = useState<ViewMode>('cinematic');

  const state = usePortfolioStore((s) => s.state);
  const activeFilter = useProjectsFilterStore((s) => s.activeFilter);

  const allProjects = useMemo(() => {
    return state.status === 'success' ? state.projects : kProjects;
  }, [state]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return allProjects;
    return allProjects.filter((p) => {
      const combined = `${p.tag} ${p.tech.join(' ')}`.toLowerCase();
      if (activeFilter === 'mobile') return combined.includes('flutter') || combined.includes('mobile') || combined.includes('react native') || combined.includes('dart');
      if (activeFilter === 'iot') return combined.includes('esp32') || combined.includes('iot') || combined.includes('vhdl') || combined.includes('hardware') || combined.includes('arduino');
      if (activeFilter === 'web') return combined.includes('web') || combined.includes('node') || combined.includes('express') || combined.includes('react');
      return true;
    });
  }, [allProjects, activeFilter]);

  const numCols = isWideDesktop ? 3 : isDesktop ? 2 : 1;

  // Shared header for Index + Grid modes
  const renderScrollableHeader = () => (
    <View style={styles.headerSection}>
      <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.eyebrow}>
        <View style={[styles.eyebrowLine, { backgroundColor: colors.purple }]} />
        <GlitchText data={t('projects.eyebrow')} fontSize={10} fontFamily={AppFonts.mono} color={colors.purple} chromatic={false} letterSpacing={3} loop={false} />
        <View style={[styles.eyebrowDot, { backgroundColor: colors.green }]} />
      </Animated.View>

      <View style={{ marginTop: verticalScale(12) }}>
        <MaskRevealText data={t('projects.titleLine1')} fontSize={isDesktop ? 52 : 34} fontFamily={AppFonts.heading} color={colors.primary} delay={200} stagger={55} />
        <MaskRevealText data={t('projects.titleLine2')} fontSize={isDesktop ? 52 : 34} fontFamily={AppFonts.heading} color={colors.purple} delay={380} stagger={65} />
      </View>

      <Animated.View entering={FadeIn.delay(750).duration(700)}>
        <CustomText data={t('projects.subtitle')} fontSize={isDesktop ? 16 : 14} color={colors.secondary} style={{ marginTop: verticalScale(12), lineHeight: 26, maxWidth: 650 }} />
      </Animated.View>

      {/* Count badge */}
      <Animated.View
        entering={FadeIn.delay(850).duration(600)}
        style={[styles.countBadge, { borderColor: `${colors.purple}40`, backgroundColor: `${colors.purple}0d` }]}
      >
        <CustomText
          data={`${filteredProjects.length} ${t('projects.projectsCount')}`}
          fontSize={10} fontFamily={AppFonts.mono} color={colors.purple} letterSpacing={1.5}
          style={{ textTransform: 'uppercase' }}
        />
      </Animated.View>

      {/* Filter bar */}
      <Animated.View entering={FadeIn.delay(600).duration(500)} style={{ marginTop: verticalScale(16) }}>
        <ProjectFilterBar />
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Background layers */}
      <AmbientGlowBackground intensity={1.3} />
      <GridMeshBackground columns={isDesktop ? 20 : 10} rows={22} lineOpacity={0.07} perspective={false} />
      <ParticleField count={isDesktop ? 16 : 8} />

      {/* ── VIEW TOGGLE (always visible at top) ── */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200, type: 'spring', damping: 14 }}
        style={[styles.toggleWrapper, { top: insets.top + verticalScale(12) }]}
      >
        <ViewToggle active={viewMode} onChange={setViewMode} />
      </MotiView>

      {/* ─────────────── CINEMATIC VIEW ─────────────── */}
      {viewMode === 'cinematic' && (
        <View style={[styles.cinematicWrapper, { paddingTop: insets.top + verticalScale(52) }]}>
          {/* Cinematic header in a mini strip */}
          <AdaptiveContainer maxWidth={1280}>
            <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.cinematicHeader}>
              <View style={[styles.eyebrowLine, { backgroundColor: colors.purple }]} />
              <GlitchText data={t('projects.eyebrow')} fontSize={9} fontFamily={AppFonts.mono} color={colors.purple} chromatic={false} letterSpacing={3} loop={false} />
              <View style={{ flex: 1 }} />
              <MaskRevealText data="CRAFTED WORK." fontSize={isDesktop ? 15 : 12} fontFamily={AppFonts.heading} color={colors.primary} delay={200} stagger={30} />
            </Animated.View>
          </AdaptiveContainer>

          <CinematicProjectViewer projects={filteredProjects} />
        </View>
      )}

      {/* ─────────────── INDEX VIEW ─────────────── */}
      {viewMode === 'index' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + verticalScale(64), paddingBottom: insets.bottom + verticalScale(120) },
          ]}
        >
          <AdaptiveContainer maxWidth={1280}>
            {renderScrollableHeader()}
            <Animated.View entering={FadeIn.delay(500).duration(600)} style={{ marginTop: verticalScale(32) }}>
              <ProjectIndexTable projects={filteredProjects} />
            </Animated.View>
          </AdaptiveContainer>
        </ScrollView>
      )}

      {/* ─────────────── GRID VIEW ─────────────── */}
      {viewMode === 'grid' && (
        <AdaptiveContainer maxWidth={1280} style={{ flex: 1 }}>
          <View style={[styles.listWrapper, { paddingTop: insets.top + verticalScale(64) }]}>
            <FlashList
              key={`grid-${numCols}`}
              data={filteredProjects}
              keyExtractor={(item) => item.id}
              numColumns={numCols}
              renderItem={({ item, index }) => <ProjectCard project={item} index={index} />}
              ListHeaderComponent={renderScrollableHeader}
              contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + verticalScale(120) }]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </AdaptiveContainer>
      )}

      <ProjectDetailModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cinematicWrapper: { flex: 1 },
  cinematicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingBottom: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: verticalScale(4),
  },
  toggleWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toggleBar: {
    flexDirection: 'row',
    gap: scale(2),
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: scale(3),
    alignSelf: 'center',
    backdropFilter: 'blur(12px)' as any,
  },
  toggleBtn: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    ...(Platform.OS === 'web' && { cursor: 'pointer', transition: 'all 0.2s ease' } as any),
  },
  scrollContent: { flexGrow: 1 },
  listWrapper: { flex: 1, width: '100%' },
  listContent: { paddingTop: verticalScale(8) },
  headerSection: {
    gap: verticalScale(4),
    marginBottom: verticalScale(8),
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  eyebrowLine: { width: scale(24), height: 1 },
  eyebrowDot: { width: scale(6), height: scale(6), borderRadius: scale(3) },
  countBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 999,
    borderWidth: 1,
    marginTop: verticalScale(8),
  },
});
