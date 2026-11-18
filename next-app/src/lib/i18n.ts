import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import swCommon from '../locales/sw/common.json';
import swHome from '../locales/sw/home.json';
import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import plCommon from '../locales/pl/common.json';
import plHome from '../locales/pl/home.json';
import zhCommon from '../locales/zh/common.json';
import zhHome from '../locales/zh/home.json';
import frCommon from '../locales/fr/common.json';
import frHome from '../locales/fr/home.json';
import hiCommon from '../locales/hi/common.json';
import hiHome from '../locales/hi/home.json';
import arCommon from '../locales/ar/common.json';
import arHome from '../locales/ar/home.json';
import ptCommon from '../locales/pt/common.json';
import ptHome from '../locales/pt/home.json';
import deCommon from '../locales/de/common.json';
import deHome from '../locales/de/home.json';
import jaCommon from '../locales/ja/common.json';
import jaHome from '../locales/ja/home.json';
import koCommon from '../locales/ko/common.json';
import koHome from '../locales/ko/home.json';

const resources = {
  en: { common: enCommon, home: enHome },
  sw: { common: swCommon, home: swHome },
  es: { common: esCommon, home: esHome },
  pl: { common: plCommon, home: plHome },
  zh: { common: zhCommon, home: zhHome },
  fr: { common: frCommon, home: frHome },
  hi: { common: hiCommon, home: hiHome },
  ar: { common: arCommon, home: arHome },
  pt: { common: ptCommon, home: ptHome },
  de: { common: deCommon, home: deHome },
  ja: { common: jaCommon, home: jaHome },
  ko: { common: koCommon, home: koHome },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
