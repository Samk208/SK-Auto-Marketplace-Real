"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
    AlertCircle,
    Building2,
    CheckCircle2,
    FileSpreadsheet,
    Loader2,
    MessageCircle,
    Package,
    Plus,
    Send,
    Trash2,
    Upload,
    X
} from "lucide-react"
import * as React from "react"

interface PartLineItem {
    id: string
    partNumber: string
    description: string
    quantity: number
    vehicleModel?: string
}

interface WholesaleOrderModalProps {
    trigger?: React.ReactNode
    segment?: "new" | "used" | "machine"
}

export function WholesaleOrderModal({ trigger, segment = "new" }: WholesaleOrderModalProps) {
    const [open, setOpen] = React.useState(false)
    const [step, setStep] = React.useState<"form" | "review" | "success">("form")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Form state
    const [companyName, setCompanyName] = React.useState("")
    const [contactName, setContactName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [country, setCountry] = React.useState("")
    const [orderType, setOrderType] = React.useState<"regular" | "urgent">("regular")
    const [notes, setNotes] = React.useState("")

    // Parts list
    const [parts, setParts] = React.useState<PartLineItem[]>([
        { id: "1", partNumber: "", description: "", quantity: 1, vehicleModel: "" }
    ])

    // File upload
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Download CSV template
    const downloadTemplate = () => {
        // CSV content with headers and example rows
        const csvContent = [
            // Header row
            ["Part Number", "Description", "Quantity", "Vehicle/Machine Model", "Notes"].join(","),
            // Example rows to guide users
            ["26300-35504", "Oil Filter", "10", "Hyundai Sonata 2020", "OEM preferred"].join(","),
            ["58101-3QA10", "Front Brake Pad Set", "5", "Kia K5 2021", ""].join(","),
            ["92101-C1000", "Headlight Assembly Left", "2", "Hyundai Sonata LF", "LED type"].join(","),
            // Empty rows for user to fill
            ["", "", "", "", ""].join(","),
            ["", "", "", "", ""].join(","),
            ["", "", "", "", ""].join(","),
            ["", "", "", "", ""].join(","),
            ["", "", "", "", ""].join(","),
        ].join("\n")

        // Add BOM for Excel compatibility with special characters
        const BOM = "\uFEFF"
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
        
        // Create download link
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", "sk-autosphere-wholesale-order-template.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    // Segment colors
    const colors = {
        new: {
            primary: "bg-[#2558fa]",
            hover: "hover:bg-[#1a3ec1]",
            light: "bg-blue-50",
            text: "text-[#2558fa]",
            border: "border-[#2558fa]"
        },
        used: {
            primary: "bg-green-600",
            hover: "hover:bg-green-700",
            light: "bg-green-50",
            text: "text-green-600",
            border: "border-green-600"
        },
        machine: {
            primary: "bg-amber-600",
            hover: "hover:bg-amber-700",
            light: "bg-amber-50",
            text: "text-amber-600",
            border: "border-amber-600"
        }
    }[segment]

    const addPartLine = () => {
        setParts([
            ...parts,
            { id: Date.now().toString(), partNumber: "", description: "", quantity: 1, vehicleModel: "" }
        ])
    }

    const removePartLine = (id: string) => {
        if (parts.length > 1) {
            setParts(parts.filter(p => p.id !== id))
        }
    }

    const updatePart = (id: string, field: keyof PartLineItem, value: string | number) => {
        setParts(parts.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv'
            ]
            if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
                setUploadedFile(file)
            } else {
                alert("Please upload a CSV or Excel file")
            }
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        setStep("success")
    }

    const resetForm = () => {
        setStep("form")
        setCompanyName("")
        setContactName("")
        setEmail("")
        setPhone("")
        setCountry("")
        setOrderType("regular")
        setNotes("")
        setParts([{ id: "1", partNumber: "", description: "", quantity: 1, vehicleModel: "" }])
        setUploadedFile(null)
    }

    const validParts = parts.filter(p => p.partNumber.trim() !== "")
    const canProceed = (validParts.length > 0 || uploadedFile) && email && contactName

    return (
        <Dialog open={open} onOpenChange={(o) => {
            setOpen(o)
            if (!o) resetForm()
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <Package className="h-4 w-4" />
                        Wholesale Order
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                {step === "form" && (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg", colors.light)}>
                                    <Building2 className={cn("h-5 w-5", colors.text)} />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl">Wholesale / Bulk Order Request</DialogTitle>
                                    <DialogDescription>
                                        Submit your parts list for a custom quote. We'll respond within 24 hours.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                                    <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-xs text-white", colors.primary)}>1</span>
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company Name</Label>
                                        <Input
                                            id="company"
                                            placeholder="Your company name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact">Contact Name *</Label>
                                        <Input
                                            id="contact"
                                            placeholder="Your name"
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone / WhatsApp</Label>
                                        <Input
                                            id="phone"
                                            placeholder="+1 234 567 8900"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Select value={country} onValueChange={setCountry}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ng">Nigeria</SelectItem>
                                                <SelectItem value="gh">Ghana</SelectItem>
                                                <SelectItem value="ke">Kenya</SelectItem>
                                                <SelectItem value="tz">Tanzania</SelectItem>
                                                <SelectItem value="ug">Uganda</SelectItem>
                                                <SelectItem value="za">South Africa</SelectItem>
                                                <SelectItem value="eg">Egypt</SelectItem>
                                                <SelectItem value="ae">UAE</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Order Priority</Label>
                                        <Select value={orderType} onValueChange={(v) => setOrderType(v as "regular" | "urgent")}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="regular">Regular (5-7 days quote)</SelectItem>
                                                <SelectItem value="urgent">Urgent (24hr quote)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Parts List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                                        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-xs text-white", colors.primary)}>2</span>
                                        Parts List
                                    </h3>
                                    <Badge variant="secondary" className={cn(colors.light, colors.text)}>
                                        {validParts.length} item{validParts.length !== 1 ? 's' : ''}
                                    </Badge>
                                </div>

                                {/* Manual Entry */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-2 border-b">
                                        <p className="text-xs font-medium text-slate-600">Enter parts manually</p>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {parts.map((part, index) => (
                                            <div key={part.id} className="flex gap-2 items-start">
                                                <span className="text-xs text-slate-400 mt-2.5 w-4">{index + 1}.</span>
                                                <div className="flex-1 grid grid-cols-12 gap-2">
                                                    <Input
                                                        placeholder="Part Number *"
                                                        className="col-span-3 text-sm"
                                                        value={part.partNumber}
                                                        onChange={(e) => updatePart(part.id, "partNumber", e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Description (optional)"
                                                        className="col-span-4 text-sm"
                                                        value={part.description}
                                                        onChange={(e) => updatePart(part.id, "description", e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Vehicle/Model"
                                                        className="col-span-3 text-sm"
                                                        value={part.vehicleModel}
                                                        onChange={(e) => updatePart(part.id, "vehicleModel", e.target.value)}
                                                    />
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="Qty"
                                                        className="col-span-2 text-sm"
                                                        value={part.quantity}
                                                        onChange={(e) => updatePart(part.id, "quantity", parseInt(e.target.value) || 1)}
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-slate-400 hover:text-red-500"
                                                    onClick={() => removePartLine(part.id)}
                                                    disabled={parts.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 gap-2"
                                            onClick={addPartLine}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Another Part
                                        </Button>
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500">Or upload a file</span>
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                                        uploadedFile ? cn(colors.light, colors.border) : "border-slate-200 hover:border-slate-300"
                                    )}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    {uploadedFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <FileSpreadsheet className={cn("h-8 w-8", colors.text)} />
                                            <div className="text-left">
                                                <p className="font-medium text-sm">{uploadedFile.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {(uploadedFile.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setUploadedFile(null)
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm font-medium text-slate-700">
                                                Upload CSV or Excel file
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Columns: Part Number, Description, Quantity, Vehicle Model
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Download Template */}
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <FileSpreadsheet className="h-3 w-3" />
                                    <button 
                                        type="button"
                                        className="underline hover:text-slate-700"
                                        onClick={downloadTemplate}
                                    >
                                        Download template file (.csv)
                                    </button>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                                    <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-xs text-white", colors.primary)}>3</span>
                                    Additional Notes
                                </h3>
                                <Textarea
                                    placeholder="Any special requirements, preferred shipping method, or additional information..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Info Banner */}
                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-900">What happens next?</p>
                                    <ul className="mt-1 text-blue-700 space-y-1">
                                        <li>• Our team will verify part availability and pricing</li>
                                        <li>• You'll receive a detailed quote via email within 24-48 hours</li>
                                        <li>• Bulk orders (10+ items) qualify for wholesale discounts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => window.open("https://wa.me/821234567890", "_blank")}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Chat on WhatsApp
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    className={cn(colors.primary, colors.hover, "gap-2")}
                                    disabled={!canProceed}
                                    onClick={() => setStep("review")}
                                >
                                    Review Order
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {step === "review" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Review Your Order Request</DialogTitle>
                            <DialogDescription>
                                Please confirm the details before submitting
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Contact Summary */}
                            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                                <h4 className="font-medium text-sm">Contact Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-slate-500">Name:</span> {contactName}
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Email:</span> {email}
                                    </div>
                                    {companyName && (
                                        <div>
                                            <span className="text-slate-500">Company:</span> {companyName}
                                        </div>
                                    )}
                                    {phone && (
                                        <div>
                                            <span className="text-slate-500">Phone:</span> {phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Parts Summary */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between">
                                    <h4 className="font-medium text-sm">Parts Requested</h4>
                                    <Badge variant="secondary">{validParts.length + (uploadedFile ? " + file" : "")} items</Badge>
                                </div>
                                <div className="divide-y max-h-48 overflow-y-auto">
                                    {validParts.map((part) => (
                                        <div key={part.id} className="px-4 py-2 flex items-center justify-between text-sm">
                                            <div>
                                                <span className="font-mono font-medium">{part.partNumber}</span>
                                                {part.description && (
                                                    <span className="text-slate-500 ml-2">- {part.description}</span>
                                                )}
                                            </div>
                                            <Badge variant="outline">x{part.quantity}</Badge>
                                        </div>
                                    ))}
                                    {uploadedFile && (
                                        <div className="px-4 py-2 flex items-center gap-2 text-sm bg-slate-50">
                                            <FileSpreadsheet className="h-4 w-4 text-slate-500" />
                                            <span>{uploadedFile.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {notes && (
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-sm mb-1">Notes</h4>
                                    <p className="text-sm text-slate-600">{notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between pt-4 border-t">
                            <Button variant="ghost" onClick={() => setStep("form")}>
                                Back to Edit
                            </Button>
                            <Button
                                className={cn(colors.primary, colors.hover, "gap-2")}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit Request
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}

                {step === "success" && (
                    <div className="py-8 text-center">
                        <div className={cn("mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4", colors.light)}>
                            <CheckCircle2 className={cn("h-8 w-8", colors.text)} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
                        <p className="text-slate-600 mb-6">
                            We've received your wholesale order request. Our team will review it and send you a detailed quote within 24-48 hours.
                        </p>
                        <div className="p-4 bg-slate-50 rounded-lg text-sm text-left mb-6">
                            <p className="font-medium mb-2">What's next?</p>
                            <ul className="space-y-1 text-slate-600">
                                <li>✓ Confirmation email sent to {email}</li>
                                <li>✓ Our team will verify part availability</li>
                                <li>✓ You'll receive a quote with wholesale pricing</li>
                            </ul>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                            <Button
                                className={cn(colors.primary, colors.hover)}
                                onClick={() => {
                                    resetForm()
                                    setOpen(false)
                                }}
                            >
                                Submit Another Order
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
