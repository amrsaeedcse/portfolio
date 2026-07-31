/// Root layout — fonts, providers, and Expo Router Stack navigation.
/// Loads custom fonts from local assets/fonts/ directory via useFonts.
/// Falls back to system fonts if files are not present (for Expo Go web).

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import '@/locales';
import { AppThemeProvider } from '@/core/theme/ThemeContext';

// Keep splash screen until fonts are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular: require('../../assets/fonts/BebasNeue-Regular.ttf'),
    DMSans_400Regular: require('../../assets/fonts/DMSans-Regular.ttf'),
    DMSans_500Medium: require('../../assets/fonts/DMSans-Medium.ttf'),
    DMSans_700Bold: require('../../assets/fonts/DMSans-Bold.ttf'),
    SpaceMono_400Regular: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Hide splash even if fonts failed — app must be usable
    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <AppThemeProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
});
