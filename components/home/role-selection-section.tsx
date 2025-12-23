"use client"

import { RoleBasedContent } from "@/components/role-based-content"
import { RoleSelector } from "@/components/role-selector"
import { useTranslation } from "@/hooks/useTranslation"
import { Locale } from "@/lib/i18n"
import { UserRole } from "@/lib/role-context"

interface RoleSelectionSectionProps {
    userRole: UserRole
    setUserRole: (role: UserRole) => void
    locale: Locale
}

export function RoleSelectionSection({ userRole, setUserRole, locale }: RoleSelectionSectionProps) {
    const { t } = useTranslation()

    return (
        <section id="get-started" className="py-12 md:py-16 bg-primary-soft/20 scroll-mt-24">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("role.choose")}</h2>
                        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                            {t("role.section_subtitle")}
                        </p>
                    </div>
                    <RoleSelector onRoleSelect={setUserRole} locale={locale} />
                    <div className="mt-8">
                        <RoleBasedContent role={userRole} />
                    </div>
                </div>
            </div>
        </section>
    )
}
