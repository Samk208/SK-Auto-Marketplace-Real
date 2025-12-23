"use client"

import { Button } from "@/components/ui/button"
import { Check, Mail, MessageCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"

export function OrderConfirmation() {
    return (
        <div className="text-center py-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-lg text-gray-600 mb-8">
                Order #SK-82910 has been placed successfully.
            </p>

            <div className="bg-white border rounded-xl p-6 max-w-sm mx-auto mb-8 shadow-sm">
                <p className="text-sm text-gray-500 mb-4">
                    We've sent a confirmation email to <span className="font-medium text-gray-900">john@example.com</span>
                </p>
                <div className="flex flex-col gap-3">
                    <Button variant="outline" className="w-full justify-start h-12 border-green-200 bg-green-50 text-green-700 hover:bg-green-100/50 hover:text-green-800">
                        <MessageCircle className="w-5 h-5 mr-3 text-green-600" />
                        Track via WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-12">
                        <Mail className="w-5 h-5 mr-3 text-gray-400" />
                        View Order Details
                    </Button>
                </div>
            </div>

            <Link href="/parts">
                <Button className="bg-[#2558fa] hover:bg-[#1a3ec1] h-12 px-8">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Continue Shopping
                </Button>
            </Link>
        </div>
    )
}
