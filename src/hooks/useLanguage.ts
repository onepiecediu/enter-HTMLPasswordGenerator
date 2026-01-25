import { useState, useCallback, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n';

const LANGUAGE_STORAGE_KEY = 'password-generator-language';

export const useLanguage = () => {
  // 从 localStorage 读取保存的语言，默认为中文
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved as Language) || 'zh';
  });

  // 获取当前语言的翻译
  const t = translations[language];

  // 切换语言
  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  // 设置特定语言
  const setLang = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  // 保存语言偏好到 localStorage
  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  return {
    language,
    t,
    toggleLanguage,
    setLang,
  };
};
