"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { t, type Locale } from "@/lib/i18n"
import { type UserRole } from "@/lib/role-context"
import { Briefcase, ShoppingBag } from 'lucide-react'
import Link from "next/link"

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void
  locale: Locale
}

export function RoleSelector({ onRoleSelect, locale }: RoleSelectorProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("role.choose", locale)}
        </h2>
        <p className="text-muted-foreground">
          Select your path to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buyer Card */}
        <Card className="card-gradient hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border-0">
          <CardHeader className="text-center pb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">{t("role.buyer_title", locale)}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {t("role.buyer_desc", locale)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/shop" className="w-full">
              <Button className="w-full h-11">
                {t("role.buyer_title", locale)}
              </Button>
            </Link>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Browse verified listings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Compare multiple cars
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Secure payment options
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Seller Card */}
        <Card className="card-gradient hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border-0">
          <CardHeader className="text-center pb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">{t("role.seller_title", locale)}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {t("role.seller_desc", locale)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/register?role=dealer" className="w-full">
              <Button
                className="w-full h-11"
                variant="secondary"
              >
                {t("role.seller_title", locale)}
              </Button>
            </Link>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Professional dealer tools
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Analytics dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Bulk listing management
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
