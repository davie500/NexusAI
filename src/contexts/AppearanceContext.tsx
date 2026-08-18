import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AccentColor = 'purple' | 'blue' | 'yellow' | 'red' | 'green';
export type FontSizeOption = 'small' | 'medium' | 'large';

interface AppearanceContextType {
  accentColor: AccentColor;
  fontSize: FontSizeOption;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSizeOption) => void;
}

const STORAGE_KEY = 'nexus-appearance';

const accentPresets: Record<
  AccentColor,
  {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    accent: string;
  }
> = {
  blue: {
    primary: '221 83% 53%',
    primaryLight: '221 83% 65%',
    primaryDark: '221 83% 43%',
    secondary: '199 89% 48%',
    secondaryLight: '191 91% 64%',
    accent: '214 95% 93%',
  },
  purple: {
    primary: '262 88% 58%',
    primaryLight: '262 88% 70%',
    primaryDark: '262 88% 45%',
    secondary: '213 94% 68%',
    secondaryLight: '213 94% 78%',
    accent: '196 75% 88%',
  },
  yellow: {
    primary: '45 93% 47%',
    primaryLight: '48 96% 60%',
    primaryDark: '39 96% 38%',
    secondary: '32 95% 56%',
    secondaryLight: '43 98% 65%',
    accent: '52 100% 90%',
  },
  red: {
    primary: '0 84% 60%',
    primaryLight: '0 91% 71%',
    primaryDark: '0 72% 51%',
    secondary: '14 90% 58%',
    secondaryLight: '18 96% 68%',
    accent: '0 93% 94%',
  },
  green: {
    primary: '142 72% 42%',
    primaryLight: '142 70% 55%',
    primaryDark: '142 72% 32%',
    secondary: '160 84% 39%',
    secondaryLight: '163 88% 48%',
    accent: '142 40% 90%',
  },
};

const fontSizes: Record<FontSizeOption, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

const applyAppearance = (accentColor: AccentColor, fontSize: FontSizeOption) => {
  const preset = accentPresets[accentColor];
  const root = document.documentElement;

  root.style.setProperty('--primary', preset.primary);
  root.style.setProperty('--ring', preset.primary);
  root.style.setProperty('--accent', preset.accent);
  root.style.setProperty('--nexus-purple', preset.primary);
  root.style.setProperty('--nexus-purple-light', preset.primaryLight);
  root.style.setProperty('--nexus-purple-dark', preset.primaryDark);
  root.style.setProperty('--nexus-blue', preset.secondary);
  root.style.setProperty('--nexus-blue-light', preset.secondaryLight);
  root.style.fontSize = fontSizes[fontSize];
};

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<AccentColor>('purple');
  const [fontSize, setFontSize] = useState<FontSizeOption>('medium');

  useEffect(() => {
    const savedRaw = localStorage.getItem(STORAGE_KEY);

    if (!savedRaw) {
      return;
    }

    try {
      const saved = JSON.parse(savedRaw) as {
        accentColor?: AccentColor;
        fontSize?: FontSizeOption;
      };

      if (saved.accentColor && accentPresets[saved.accentColor]) {
        setAccentColor(saved.accentColor);
      }

      if (saved.fontSize && fontSizes[saved.fontSize]) {
        setFontSize(saved.fontSize);
      }
    } catch (error) {
      console.error('[APPEARANCE] Failed to parse saved appearance', error);
    }
  }, []);

  useEffect(() => {
    applyAppearance(accentColor, fontSize);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accentColor, fontSize }));
  }, [accentColor, fontSize]);

  const value = useMemo(
    () => ({
      accentColor,
      fontSize,
      setAccentColor,
      setFontSize,
    }),
    [accentColor, fontSize],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }

  return context;
};
