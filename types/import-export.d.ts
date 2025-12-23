export type ExportStatus = "Ready for Export" | "In Transit" | "Delivered" | "Issue"

export interface ImportVehicle {
  id: string
  listingId: string
  title: string
  year: number
  make: string
  model: string
  dealerId: string
  dealerName: string
  exportPort: string
  destinationCountry: string
  destinationPort: string
  status: ExportStatus
  etd?: string // Estimated Time of Departure
  eta?: string // Estimated Time of Arrival
  actualDepartureDate?: string
  actualArrivalDate?: string
  shippingCompany?: string
  containerNumber?: string
  billOfLading?: string
  docsUploaded: boolean
  documents: ExportDocument[]
  timeline: TimelineStep[]
  createdAt: Date
  updatedAt: Date
}

export interface ExportDocument {
  id: string
  name: string
  type: "invoice" | "bill_of_lading" | "certificate" | "customs" | "photo" | "other"
  url: string
  uploadedAt: Date
  uploadedBy: string
  status: "pending" | "uploaded" | "verified"
}

export interface TimelineStep {
  id: string
  step: string
  status: "completed" | "in_progress" | "pending" | "issue"
  date?: Date
  notes?: string
}

export interface Port {
  id: string
  name: string
  country: string
  code: string
  defaultFreightFee: number
  currency: string
  allowedVehicleTypes: string[]
  active: boolean
}

export interface LogisticsPartner {
  id: string
  name: string
  type: "shipping" | "customs" | "freight_forwarder"
  contact: string
  email: string
  phone: string
  servicesOffered: string[]
  notes: string
  active: boolean
}
