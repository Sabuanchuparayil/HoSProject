import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LocalizedString } from '../types';

interface Languages {
  [key: string]: string;
}

const languages: Languages = {
  en: 'English',
  es: 'Español',
};

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (localizedString: LocalizedString) => string;
  languages: Languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  const t = (localizedString: LocalizedString): string => {
    return localizedString[language] || localizedString['en'] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};