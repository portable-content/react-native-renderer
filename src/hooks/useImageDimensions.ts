import { useState, useEffect } from 'react';
import { Image, ImageSourcePropType } from 'react-native';

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Hook that fetches image dimensions for both local and remote images
 * @param source - Image source (local require() or remote URI)
 * @returns Image dimensions or null if not loaded yet
 */
export const useImageDimensions = (
  source?: ImageSourcePropType
): ImageDimensions | null => {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);

  useEffect(() => {
    if (!source) {
      setDimensions(null);
      return;
    }

    if (typeof source === 'number') {
      // Local image - get dimensions synchronously
      const resolvedSource = Image.resolveAssetSource(source);
      if (resolvedSource) {
        setDimensions({
          width: resolvedSource.width,
          height: resolvedSource.height,
        });
      }
    } else if (source.uri) {
      // Remote image - get dimensions asynchronously
      Image.getSize(
        source.uri,
        (width, height) => {
          setDimensions({ width, height });
        },
        error => {
          console.warn('Failed to get image dimensions:', error);
          setDimensions(null);
        }
      );
    }
  }, [source]);

  return dimensions;
};
