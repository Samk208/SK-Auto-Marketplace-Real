"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { BookOpen, MapPin, Users } from "lucide-react"
import Link from "next/link"

export function ResourcesSection() {
    const { t } = useTranslation()

    return (
        <section className="py-16 md:py-20 bg-primary-soft/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("resources.title")}</h2>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        {t("resources.subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t("resources.guide_buyer_title")}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t("resources.guide_buyer_desc")}
                            </p>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/resources">{t("resources.learn_more")}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t("resources.guide_import_title")}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t("resources.guide_import_desc")}
                            </p>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/resources">{t("resources.learn_more")}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t("resources.guide_seller_title")}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t("resources.guide_seller_desc")}
                            </p>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/resources">{t("resources.learn_more")}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <Button asChild size="lg">
                        <Link href="/resources">
                            {t("resources.view_all")}
                            <BookOpen className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
