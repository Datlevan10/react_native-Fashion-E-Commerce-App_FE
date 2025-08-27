// COMMENTED OUT - Multi-language feature temporarily disabled
// Will be implemented in future phase

// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as RNLocalize from 'react-native-localize';

// // Import translation files
// import commonEn from './locales/en/common.json';
// import commonVi from './locales/vi/common.json';
// import authEn from './locales/en/auth.json';
// import authVi from './locales/vi/auth.json';
// import settingsEn from './locales/en/settings.json';
// import settingsVi from './locales/vi/settings.json';

// // Define supported languages
// export const LANGUAGES = {
//   en: { label: 'English', flag: '🇺🇸', code: 'EN' },
//   vi: { label: 'Vietnamese', flag: '🇻🇳', code: 'VI' },
// };

// // Get device language
// const getDeviceLanguage = () => {
//   const locales = RNLocalize.getLocales();
//   if (Array.isArray(locales) && locales.length > 0) {
//     const deviceLang = locales[0].languageCode;
//     return Object.keys(LANGUAGES).includes(deviceLang) ? deviceLang : 'en';
//   }
//   return 'en';
// };

// // Language detection configuration
// const languageDetector = {
//   type: 'languageDetector',
//   async: true,
//   detect: async (callback) => {
//     try {
//       // Check if language is stored in AsyncStorage
//       const storedLanguage = await AsyncStorage.getItem('user-language');
//       if (storedLanguage && Object.keys(LANGUAGES).includes(storedLanguage)) {
//         callback(storedLanguage);
//         return;
//       }
      
//       // Fall back to device language
//       const deviceLanguage = getDeviceLanguage();
//       callback(deviceLanguage);
//     } catch (error) {
//       console.log('Error detecting language:', error);
//       callback('en');
//     }
//   },
//   init: () => {},
//   cacheUserLanguage: async (language) => {
//     try {
//       await AsyncStorage.setItem('user-language', language);
//     } catch (error) {
//       console.log('Error saving language preference:', error);
//     }
//   },
// };

// // Resources object containing all translations
// const resources = {
//   en: {
//     common: commonEn,
//     auth: authEn,
//     settings: settingsEn,
//   },
//   vi: {
//     common: commonVi,
//     auth: authVi,
//     settings: settingsVi,
//   },
// };

// // Initialize i18n
// i18n
//   .use(languageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     fallbackLng: 'en',
//     debug: __DEV__, // Enable debug in development
//     defaultNS: 'common',
//     ns: ['common', 'auth', 'settings'],
    
//     interpolation: {
//       escapeValue: false, // React already escapes values
//     },
    
//     react: {
//       useSuspense: false, // Disable suspense for React Native
//     },
    
//     // Additional configuration
//     supportedLngs: Object.keys(LANGUAGES),
//     cleanCode: true,
//     load: 'languageOnly',
//   });

// // Export i18n instance
// export default i18n;

// // Helper functions
// export const getCurrentLanguage = () => i18n.language;

// export const changeLanguage = async (languageCode) => {
//   try {
//     await i18n.changeLanguage(languageCode);
//     await AsyncStorage.setItem('user-language', languageCode);
//     return true;
//   } catch (error) {
//     console.error('Error changing language:', error);
//     return false;
//   }
// };

// export const getLanguageLabel = (code) => {
//   return LANGUAGES[code]?.label || 'English';
// };

// export const getLanguageFlag = (code) => {
//   return LANGUAGES[code]?.flag || '🇺🇸';
// };

// export const getLanguageCode = (code) => {
//   return LANGUAGES[code]?.code || 'EN';
// };