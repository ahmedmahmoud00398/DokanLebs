'use client';

import { useCallback, useEffect, useState } from 'react';

const LANGUAGE_EVENT = 'dokan-language-changed';

export function useSiteLanguage() {
  const [isArabic, setIsArabic] = useState(false);

  const setLanguage = useCallback((language) => {
    const nextLanguage = language === 'ar';
    setIsArabic(nextLanguage);
    localStorage.setItem('dokan-language', nextLanguage ? 'ar' : 'en');
    window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: nextLanguage ? 'ar' : 'en' }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(isArabic ? 'en' : 'ar');
  }, [isArabic, setLanguage]);

  useEffect(() => {
    const syncLanguage = (event) => {
      const language = event.type === 'storage' ? event.newValue : event.detail;
      const nextLanguage = language === 'ar';
      setIsArabic(nextLanguage);
    };

    const savedLanguage = localStorage.getItem('dokan-language') === 'ar' ? 'ar' : 'en';
    setIsArabic(savedLanguage === 'ar');
    window.addEventListener(LANGUAGE_EVENT, syncLanguage);
    window.addEventListener('storage', syncLanguage);
    return () => {
      window.removeEventListener(LANGUAGE_EVENT, syncLanguage);
      window.removeEventListener('storage', syncLanguage);
    };
  }, []);

  return { isArabic, setLanguage, toggleLanguage };
}
