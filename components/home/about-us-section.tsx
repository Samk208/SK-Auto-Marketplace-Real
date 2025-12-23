"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { CheckCircle } from "lucide-react"

export function AboutUsSection() {
    const { t } = useTranslation()

    return (
        <section id="about" className="py-16 md:py-20 bg-primary-soft/20 scroll-mt-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t("about.title")}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("about.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">{t("about.mission_title")}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            {t("about.mission_desc_1")}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            {t("about.mission_desc_2")}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">{t("about.values_title")}</h3>
                        <ul className="space-y-4">
                            {[
                                {
                                    title: t("about.value_1_title"),
                                    desc: t("about.value_1_desc")
                                },
                                {
                                    title: t("about.value_2_title"),
                                    desc: t("about.value_2_desc")
                                },
                                {
                                    title: t("about.value_3_title"),
                                    desc: t("about.value_3_desc")
                                }
                            ].map((val, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">{val.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {val.desc}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
