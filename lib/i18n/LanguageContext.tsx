"use client"

import { Locale, SUPPORTED_LOCALES, t as translate } from '@/lib/i18n';
import React, { createContext, useContext, useEffect, useState } from 'react';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load persisted preference
        const saved = localStorage.getItem('sk_locale') as Locale;
        if (saved && SUPPORTED_LOCALES.some(l => l.code === saved)) {
            setLocaleState(saved);
        }
        setMounted(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('sk_locale', newLocale);

        // Update HTML dir and lang attributes
        document.documentElement.lang = newLocale;
        const dir = SUPPORTED_LOCALES.find(l => l.code === newLocale)?.direction || 'ltr';
        document.documentElement.dir = dir;
    };

    const t = (key: string) => translate(key, locale);

    const dir = SUPPORTED_LOCALES.find(l => l.code === locale)?.direction || 'ltr';

    if (!mounted) {
        // Avoid hydration mismatch by rendering uniform state initially or nothing
        // But for SEO we usually want default content. 
        // For now, simpler to just return children with default 'en' or risk hydration mismatch if we used generic storage reading directly.
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
