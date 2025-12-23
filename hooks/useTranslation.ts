import { useLanguage } from '@/lib/i18n/LanguageContext';

export function useTranslation() {
    const { t, locale, setLocale, dir } = useLanguage();
    return { t, locale, setLocale, dir };
}
