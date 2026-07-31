/// Placeholder — this route is not used in the portfolio app.
/// All navigation is handled via (tabs)/_layout.tsx.
import { Redirect } from 'expo-router';

export default function ExplorePage() {
  return <Redirect href="/" />;
}
