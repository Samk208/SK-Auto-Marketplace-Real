"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MessageCircle } from "lucide-react"
import { useState } from "react"

interface InquiryFormProps {
    listingId: string
    dealerId: string
    listingTitle: string
}

export function InquiryForm({ listingId, dealerId, listingTitle }: InquiryFormProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        buyer_name: "",
        buyer_email: "",
        buyer_phone: "",
        buyer_country: "",
        message: `I am interested in this ${listingTitle}. Please send me more information.`,
        inquiry_type: "general",
        preferred_contact_method: "email",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/inquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listing_id: listingId,
                    ...formData,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to submit inquiry")
            }

            toast({
                title: "Inquiry Sent!",
                description: "The dealer has been notified and will contact you soon.",
            })

            // Reset form
            setFormData({
                buyer_name: "",
                buyer_email: "",
                buyer_phone: "",
                buyer_country: "",
                message: `I am interested in this ${listingTitle}. Please send me more information.`,
                inquiry_type: "general",
                preferred_contact_method: "email",
            })
        } catch (error) {
            console.error("Error submitting inquiry:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit inquiry",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Contact Seller
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="buyer_name">Name *</Label>
                            <Input
                                id="buyer_name"
                                name="buyer_name"
                                value={formData.buyer_name}
                                onChange={handleChange}
                                required
                                placeholder="Your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="buyer_email">Email *</Label>
                            <Input
                                id="buyer_email"
                                name="buyer_email"
                                type="email"
                                value={formData.buyer_email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="buyer_phone">Phone (Optional)</Label>
                            <Input
                                id="buyer_phone"
                                name="buyer_phone"
                                type="tel"
                                value={formData.buyer_phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="buyer_country">Country (Optional)</Label>
                            <Input
                                id="buyer_country"
                                name="buyer_country"
                                value={formData.buyer_country}
                                onChange={handleChange}
                                placeholder="Your country"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inquiry_type">Inquiry Type</Label>
                        <Select
                            value={formData.inquiry_type}
                            onValueChange={(value) => handleSelectChange("inquiry_type", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="price_negotiation">Price Negotiation</SelectItem>
                                <SelectItem value="inspection">Request Inspection</SelectItem>
                                <SelectItem value="shipping">Shipping Quote</SelectItem>
                                <SelectItem value="financing">Financing</SelectItem>
                                <SelectItem value="test_drive">Test Drive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Preferred Contact Method</Label>
                        <RadioGroup
                            value={formData.preferred_contact_method}
                            onValueChange={(value) => handleSelectChange("preferred_contact_method", value)}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="contact-email" />
                                <Label htmlFor="contact-email">Email</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="phone" id="contact-phone" />
                                <Label htmlFor="contact-phone">Phone</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="whatsapp" id="contact-whatsapp" />
                                <Label htmlFor="contact-whatsapp">WhatsApp</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="I am interested in this vehicle..."
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Message"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
