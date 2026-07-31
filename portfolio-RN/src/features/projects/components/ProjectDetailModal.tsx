/// ProjectDetailModal component.
/// Rule 11: Feature UI decomposition.
/// Displays comprehensive details, architecture notes, and GitHub links for the selected project.

import React from 'react';
import { View, StyleSheet, Modal, ScrollView, Pressable, Linking } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { CustomText } from '@/components/common/CustomText';
import { CachedImage } from '@/components/common/CachedImage';
import { CustomButton } from '@/components/common/CustomButton';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { useProjectsFilterStore } from '../store/useProjectsFilterStore';

export function ProjectDetailModal() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { selectedProject, closeProjectDetail } = useProjectsFilterStore();

  if (!selectedProject) return null;

  return (
    <Modal
      visible={!!selectedProject}
      transparent
      animationType="none"
      onRequestClose={closeProjectDetail}
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(200)}
        style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.8)' }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeProjectDetail} />

        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.duration(250)}
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingTop: scale(20),
              paddingBottom: insets.bottom + verticalScale(20),
            },
          ]}
        >
          {/* Top handle bar */}
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Close button top right */}
          <Pressable onPress={closeProjectDetail} style={styles.closeButton}>
            <CustomText data="✕" fontSize={18} color={colors.secondary} />
          </Pressable>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header tag & title */}
            <CustomText
              data={selectedProject.tag}
              fontSize={11}
              fontFamily={AppFonts.mono}
              color={selectedProject.color}
              letterSpacing={1.5}
              style={{ textTransform: 'uppercase' }}
            />

            <CustomText
              data={selectedProject.title}
              fontSize={26}
              fontFamily={AppFonts.heading}
              color={colors.primary}
            />

            <CustomText
              data={selectedProject.subtitle}
              fontSize={14}
              color={colors.secondary}
            />

            {/* Main image */}
            <View style={styles.imageContainer}>
              <CachedImage
                uri={selectedProject.img}
                style={styles.mainImage}
                contentFit="cover"
                recyclingKey={`modal-${selectedProject.id}`}
              />
            </View>

            {/* Description section */}
            <View style={styles.section}>
              <CustomText
                data={t('projects.featuresLbl')}
                fontSize={14}
                fontFamily={AppFonts.heading}
                color={colors.primary}
                letterSpacing={0.5}
              />
              <CustomText
                data={selectedProject.description}
                fontSize={14}
                color={colors.secondary}
                style={{ lineHeight: 22 }}
              />
            </View>

            {/* Features check list */}
            <View style={styles.featuresList}>
              {selectedProject.features.map((feature) => (
                <View key={feature} style={styles.featureItem}>
                  <CustomText data="✓" fontSize={14} color={selectedProject.color} fontFamily={AppFonts.mono} />
                  <CustomText data={feature} fontSize={13} color={colors.primary} style={{ flex: 1 }} />
                </View>
              ))}
            </View>

            {/* Technology stack */}
            <View style={styles.section}>
              <CustomText
                data={t('projects.techLbl')}
                fontSize={14}
                fontFamily={AppFonts.heading}
                color={colors.primary}
                letterSpacing={0.5}
              />
              <View style={styles.techGrid}>
                {selectedProject.tech.map((tech) => (
                  <View key={tech} style={[styles.techBadge, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                    <CustomText data={tech} fontSize={12} fontFamily={AppFonts.mono} color={colors.accent} />
                  </View>
                ))}
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionsContainer}>
              {selectedProject.github ? (
                <CustomButton
                  title={t('projects.viewCode')}
                  onPress={() => Linking.openURL(selectedProject.github)}
                  variant="primary"
                  style={{ width: '100%', backgroundColor: selectedProject.color }}
                />
              ) : null}

              <Pressable onPress={closeProjectDetail} style={styles.closeTextButton}>
                <CustomText data={t('projects.closeModal')} fontSize={14} color={colors.secondary} />
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '90%',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    borderWidth: 1,
    paddingHorizontal: scale(20),
  },
  handleBar: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  handle: {
    width: scale(40),
    height: 4,
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: scale(16),
    right: scale(20),
    zIndex: 20,
    padding: scale(8),
  },
  scrollContent: {
    gap: verticalScale(16),
    paddingBottom: verticalScale(40),
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    gap: verticalScale(8),
    marginTop: verticalScale(8),
  },
  featuresList: {
    gap: verticalScale(8),
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(10),
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  techBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    borderWidth: 1,
  },
  actionsContainer: {
    marginTop: verticalScale(16),
    gap: verticalScale(12),
    alignItems: 'center',
  },
  closeTextButton: {
    paddingVertical: verticalScale(8),
  },
});
