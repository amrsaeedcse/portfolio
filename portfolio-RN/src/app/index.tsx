/// Root index — redirects to the tabs home screen.
import { Redirect } from 'expo-router';
import { AppRoutes } from '@/navigation/routes';

export default function RootIndex() {
  return <Redirect href={AppRoutes.home} />;
}
