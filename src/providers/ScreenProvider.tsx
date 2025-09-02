import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Dimensions } from 'react-native';

export type ScreenSize = 'small' | 'medium' | 'large';

export interface ScreenDimensions {
  width: number;
  height: number;
}

interface ScreenContextType {
  screenData: ScreenDimensions;
  screenSize: ScreenSize;
}

const ScreenContext = createContext<ScreenContextType | null>(null);

// Screen size breakpoints
export const SCREEN_BREAKPOINTS = {
  small: 480,
  medium: 768,
} as const;

// Calculate screen size based on width
export const getScreenSize = (width: number): ScreenSize => {
  if (width < SCREEN_BREAKPOINTS.small) return 'small';
  if (width < SCREEN_BREAKPOINTS.medium) return 'medium';
  return 'large';
};

export const ScreenProvider = ({ children }: { children: React.ReactNode }) => {
  const [screenData, setScreenData] = useState<ScreenDimensions>(
    Dimensions.get('window')
  );

  const screenSize = useMemo(
    () => getScreenSize(screenData.width),
    [screenData.width]
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', result => {
      setScreenData(result.window);
    });

    return () => subscription?.remove();
  }, []);

  const value = useMemo(
    () => ({
      screenData,
      screenSize,
    }),
    [screenData, screenSize]
  );

  return (
    <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
  );
};

export const useResponsiveScreen = (): ScreenContextType => {
  const context = useContext(ScreenContext);

  if (!context) {
    throw new Error('useResponsiveScreen must be used within a ScreenProvider');
  }

  return context;
};
