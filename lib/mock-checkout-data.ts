export interface CheckoutItem {
  listingId: string
  title: string
  year: number
  make: string
  model: string
  amount: number
  currency: string
  dealerName: string
  dealerId: string
  exportPort: string
  image: string
  mileage: number
  mileageUnit: string
}

export const MOCK_CHECKOUT_ITEMS: CheckoutItem[] = [
  {
    listingId: "1",
    title: "Hyundai Sonata DN8 2.0 Turbo Premium",
    year: 2022,
    make: "Hyundai",
    model: "Sonata",
    amount: 28000,
    currency: "USD",
    dealerName: "Seoul Premium Motors",
    dealerId: "dealer-1",
    exportPort: "Busan Port, South Korea → Tema, Ghana",
    image: "/placeholder.svg?height=400&width=600&text=Hyundai+Sonata",
    mileage: 35000,
    mileageUnit: "km",
  },
  {
    listingId: "2",
    title: "Kia Carnival Hi-Limousine",
    year: 2023,
    make: "Kia",
    model: "Carnival",
    amount: 42000,
    currency: "USD",
    dealerName: "Busan Commercial Vehicles",
    dealerId: "dealer-2",
    exportPort: "Busan Port, South Korea → Apapa, Nigeria",
    image: "/placeholder.svg?height=400&width=600&text=Kia+Carnival",
    mileage: 15000,
    mileageUnit: "km",
  },
]

export function getCheckoutItemById(listingId: string): CheckoutItem | undefined {
  return MOCK_CHECKOUT_ITEMS.find((item) => item.listingId === listingId)
}
