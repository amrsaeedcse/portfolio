/// Tabs layout — adaptive web & mobile navigation with 4 portfolio sections.
/// On Desktop/Tablet Web (width >= 768px): renders a floating glassmorphic Top Navbar with glowing brand logo.
/// On Mobile (< 768px): renders a bottom glassmorphic tab bar.

import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { AppTabs } from '@/navigation/routes';

const kTabs = [
  { name: AppTabs.home, label: 'Home', icon: '⌂' },
  { name: AppTabs.projects, label: 'Work', icon: '◈' },
  { name: AppTabs.about, label: 'About', icon: '◉' },
  { name: AppTabs.contact, label: 'Contact', icon: '◎' },
] as const;

interface TabBarProps {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { emit: (args: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean }; navigate: (name: string) => void };
}

/// Animated mobile tab bar item with spring scale effect.
function MobileTabBarItem({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pressed.get(), [0, 1], [1, 0.88]) },
    ],
  }));

  return (
    <Pressable
      onPressIn={() => { pressed.set(withSpring(1, { damping: 15 })); }}
      onPressOut={() => { pressed.set(withSpring(0, { damping: 15 })); }}
      onPress={onPress}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.tabInner, animatedStyle]}>
        <CustomText
          data={icon}
          fontSize={18}
          color={isActive ? colors.accent : colors.muted}
          textAlign="center"
        />
        <CustomText
          data={label}
          fontSize={9}
          letterSpacing={1.5}
          fontFamily="DMSans_500Medium"
          color={isActive ? colors.accent : colors.muted}
          textAlign="center"
          style={{ textTransform: 'uppercase', marginTop: 2 }}
        />
        {isActive ? (
          <View style={[styles.activeDot, { backgroundColor: colors.accent }]} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

/// Desktop web navigation link item.
function DesktopNavItem({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const hovered = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(hovered.get(), [0, 1], [1, 1.05]) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => { hovered.set(withSpring(1)); }}
      onHoverOut={() => { hovered.set(withSpring(0)); }}
      style={[
        styles.desktopNavItem,
        {
          backgroundColor: isActive ? 'rgba(0, 255, 209, 0.1)' : 'transparent',
          borderColor: isActive ? colors.accent : 'transparent',
        },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <CustomText
          data={label}
          fontSize={13}
          fontFamily="DMSans_700Bold"
          color={isActive ? colors.accent : colors.secondary}
          letterSpacing={1}
          style={{ textTransform: 'uppercase' }}
        />
      </Animated.View>
    </Pressable>
  );
}

/// Custom adaptive navigation bar: Top Navbar on Desktop Web, Bottom Tab Bar on Mobile.
function CustomTabBar({ state, navigation }: TabBarProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleTabPress = (index: number, tabName: string) => {
    const route = state.routes[index];
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(tabName);
    }
  };

  if (isDesktop) {
    return (
      <View
        style={[
          styles.desktopHeader,
          {
            backgroundColor: 'rgba(10, 10, 15, 0.85)',
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.desktopContainer}>
          {/* Brand Logo & Status */}
          <View style={styles.brandContainer}>
            <View style={[styles.statusDot, { backgroundColor: colors.accent, shadowColor: colors.accent }]} />
            <CustomText
              data="AMR SAEED"
              fontSize={22}
              fontFamily="BebasNeue_400Regular"
              color={colors.primary}
              letterSpacing={2}
            />
            <View style={[styles.tagBadge, { borderColor: colors.border, backgroundColor: colors.surfaceCard }]}>
              <CustomText
                data="FULL-STACK ARCHITECT"
                fontSize={10}
                fontFamily="SpaceMono_400Regular"
                color={colors.accent}
              />
            </View>
          </View>

          {/* Nav Links */}
          <View style={styles.desktopNavLinks}>
            {kTabs.map((tab, index) => (
              <DesktopNavItem
                key={tab.name}
                label={tab.label}
                isActive={state.index === index}
                onPress={() => handleTabPress(index, tab.name)}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Mobile Bottom Tab Bar
  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: insets.bottom + verticalScale(4),
          backgroundColor: colors.glass,
          borderTopColor: colors.border,
        },
      ]}
    >
      {kTabs.map((tab, index) => (
        <MobileTabBarItem
          key={tab.name}
          label={tab.label}
          icon={tab.icon}
          isActive={state.index === index}
          onPress={() => handleTabPress(index, tab.name)}
        />
      ))}
    </View>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...(props as unknown as TabBarProps)} />}
      screenOptions={{
        headerShown: false,
        // On desktop, render content starting from top 0 (we pad with AdaptiveContainer)
        sceneStyle: { backgroundColor: '#0a0a0f' },
      }}
    >
      <Tabs.Screen name={AppTabs.home} />
      <Tabs.Screen name={AppTabs.projects} />
      <Tabs.Screen name={AppTabs.about} />
      <Tabs.Screen name={AppTabs.contact} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Mobile styles
  tabBarContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: verticalScale(8),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    paddingVertical: verticalScale(4),
    gap: 2,
    minWidth: scale(48),
  },
  activeDot: {
    width: scale(16),
    height: 2,
    borderRadius: 1,
    marginTop: 3,
  },
  // Desktop styles
  desktopHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    borderBottomWidth: 1,
    zIndex: 1000,
    justifyContent: 'center',
  },
  desktopContainer: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowRadius: 8,
    shadowOpacity: 0.8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  desktopNavLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  desktopNavItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
});
