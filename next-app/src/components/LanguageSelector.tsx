'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/lib/i18n';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const emptySubscribe = () => () => {};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const currentLanguage =
    mounted && i18n.language
      ? languages.find((lang) => {
          const normalizedLang = i18n.language.split('-')[0].toLowerCase();
          return lang.code === i18n.language || lang.code === normalizedLang;
        }) || languages[0]
      : languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', languageCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-gray-800 border border-gray-300/30"
        aria-label="Select language"
      >
        <Globe size={18} className="shrink-0" />
        <span className="hidden sm:inline-block text-sm font-medium">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="sm:hidden text-lg">{currentLanguage.flag}</span>
        <ChevronDown
          size={16}
          className={cn(
            "transition-transform shrink-0 hidden sm:block",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-primary/5 transition-colors",
                  currentLanguage.code === language.code && "bg-primary/10 text-primary font-medium"
                )}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
