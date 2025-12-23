
export type CheckoutStep = "cart" | "contact" | "shipping" | "delivery" | "payment" | "review" | "confirmation"

export interface CartItem {
    id: string
    name: string
    partNumber: string
    price: number
    quantity: number
    image: string
}

export interface CheckoutState {
    step: CheckoutStep
    cart: CartItem[]
    contact: {
        email: string
        phone: string
        countryCode: string
        whatsapp: boolean
    }
    shippingAddress: {
        firstName: string
        lastName: string
        address1: string
        address2?: string
        city: string
        state: string
        zip: string
        country: string
    }
    shippingMethod: "standard" | "express"
    paymentMethod: "card" | "bank" | "mpesa" | "mtn"
}

export const INITIAL_CHECKOUT_STATE: CheckoutState = {
    step: "cart",
    cart: [
        {
            id: "p1",
            name: "Front Brake Pad Set",
            partNumber: "58101-2TA00",
            price: 89000,
            quantity: 1,
            image: "/images/parts/brake-pads.jpg"
        },
        {
            id: "p2",
            name: "Engine Oil Filter",
            partNumber: "26300-35504",
            price: 12000,
            quantity: 2,
            image: "/images/parts/oil-filter.jpg"
        }
    ],
    contact: {
        email: "",
        phone: "",
        countryCode: "+234",
        whatsapp: true
    },
    shippingAddress: {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "Nigeria"
    },
    shippingMethod: "standard",
    paymentMethod: "card"
}
