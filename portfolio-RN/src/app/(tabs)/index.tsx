/// Route entry for Home Tab — delegates rendering to modular feature screen.
/// Rule 11: Route files simply host feature screens.

import React from 'react';
import { HomeScreen } from '@/features/home/screens/HomeScreen';

export default function HomeRoute() {
  return <HomeScreen />;
}
