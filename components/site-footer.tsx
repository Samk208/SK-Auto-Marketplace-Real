"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"
import { Car, Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
    const { t } = useTranslation()

    return (
        <footer className="bg-primary-soft/30 border-t border-border-subtle">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-sm">
                                <Car className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">SK AutoSphere</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t("footer.moto")}
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 hover:bg-primary/10">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 hover:bg-primary/10">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 hover:bg-primary/10">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 hover:bg-primary/10">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm">{t("footer.for_buyers")}</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.browse_cars")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.advanced_search")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.financing_options")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="hover:text-primary transition-colors">
                                    {t("footer.buyers_guides")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:text-primary transition-colors">
                                    {t("footer.shipping_logistics")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.car_comparison")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm">{t("footer.for_sellers")}</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.list_your_car")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/dealers/become-dealer" className="hover:text-primary transition-colors">
                                    {t("footer.dealer_registration")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.pricing_tools")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="hover:text-primary transition-colors">
                                    {t("footer.sellers_guides")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.marketing_services")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm">{t("footer.company")}</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.about_us")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="hover:text-primary transition-colors">
                                    {t("footer.resources_hub")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.contact")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.careers")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    {t("footer.blog")}
                                </Link>
                            </li>
                        </ul>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span className="font-mono">+82 2-1234-5678</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="font-mono">support@skautosphere.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} SK AutoSphere. {t("footer.rights_reserved")}</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary transition-colors">
                            {t("footer.privacy_policy")}
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            {t("footer.terms_of_service")}
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            {t("footer.cookie_policy")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
