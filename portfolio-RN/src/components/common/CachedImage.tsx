/// CachedImage — MANDATORY wrapper for ALL remote images.
/// Rule 2: NEVER use <Image source={{uri}}> directly — always use this.
/// Wraps expo-image for memory-efficient caching, blurhash placeholders, and contentFit.

import React, { memo } from 'react';
import { Image, ImageStyle } from 'expo-image';
import { StyleProp } from 'react-native';

/// Subtle shimmer blurhash placeholder used while images load.
const kDefaultBlurhash = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

interface CachedImageProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: 'low' | 'normal' | 'high';
  recyclingKey?: string;
  blurhash?: string;
}

/// Portfolio's standard image component. Provides memory-efficient caching,
/// blurhash placeholders while loading, and consistent contentFit behavior.
export const CachedImage = memo(function CachedImage({
  uri,
  style,
  contentFit = 'cover',
  priority = 'normal',
  recyclingKey,
  blurhash = kDefaultBlurhash,
}: CachedImageProps) {
  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      placeholder={{ blurhash }}
      transition={300}
      priority={priority}
      cachePolicy="memory-disk"
      recyclingKey={recyclingKey}
    />
  );
});
