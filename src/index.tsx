// Element components
export {
  ImageElement,
  MarkupElement,
  SvgElement,
  type ImageElementProps,
  type MarkupElementProps,
  type SvgElementProps,
} from './components/Elements';

// Container component
export {
  PortableContent,
  type PortableContentProps,
} from './components/PortableContent';

// Export providers and hooks for advanced usage
export {
  ScreenProvider,
  useResponsiveScreen,
  getScreenSize,
  SCREEN_BREAKPOINTS,
} from './providers/ScreenProvider';
export {
  useResponsiveStyles,
  useResponsiveDimensions,
  RESPONSIVE_STYLES,
} from './hooks/useResponsiveStyles';
export { useImageDimensions } from './hooks/useImageDimensions';
