/// Navigation routes and bottom tab identifiers — NEVER use raw string literals.
/// Rule 4: Never hardcode tab indices -> use AppTabs.home, AppTabs.projects, etc.
/// Rule 5: Never hardcode route names -> use AppRoutes.home, AppRoutes.projectDetail, etc.
/// Rule 10: Never scatter raw navigation calls -> use these typed constants.

import { Href } from 'expo-router';

export const AppTabs = {
  home: 'index',
  projects: 'projects',
  about: 'about',
  contact: 'contact',
} as const;

export type AppTab = (typeof AppTabs)[keyof typeof AppTabs];

export const AppRoutes = {
  home: '/(tabs)' as Href,
  projects: '/projects' as Href,
  about: '/about' as Href,
  contact: '/contact' as Href,
  projectDetail: '/project-detail' as Href,
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];
