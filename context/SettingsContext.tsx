import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/constants/Translations';

type Language = 'en' | 'fr' | 'ar';

interface SettingsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  t: (key: string) => string;
}

const defaultContext: SettingsContextType = {
  language: 'en',
  setLanguage: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
  voiceEnabled: true,
  setVoiceEnabled: () => {},
  darkMode: false,
  setDarkMode: () => {},
  t: (key: string) => key,
};

const SettingsContext = createContext<SettingsContextType>(defaultContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Translate function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  // Load saved settings on mount
  useEffect(() => {
    // In a real app, we would load from AsyncStorage or similar
    // For simplicity, just using defaults here
  }, []);

  // Save settings when changed
  useEffect(() => {
    // In a real app, we would save to AsyncStorage or similar
  }, [language, soundEnabled, voiceEnabled, darkMode]);

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
        voiceEnabled,
        setVoiceEnabled,
        darkMode,
        setDarkMode,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);