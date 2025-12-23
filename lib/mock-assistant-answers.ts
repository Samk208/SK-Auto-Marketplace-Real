// Mock AI assistant knowledge base for SK Auto Copilot
export const mockAssistantAnswers: Record<string, string> = {
  buy: "To buy a car on SK Auto Marketplace: 1) Browse listings or use filters to find your ideal vehicle. 2) Contact sellers via WhatsApp, phone, or SMS. 3) Schedule a test drive and inspection. 4) Verify all documents (registration, insurance, maintenance records). 5) Negotiate the price. 6) Complete the payment and transfer process at your local DMV or registration office.",

  sell: "To sell your car: 1) Create a detailed listing with clear photos and accurate information. 2) Set a competitive price based on market value. 3) Prepare all necessary documents (title, registration, maintenance records). 4) Respond promptly to buyer inquiries. 5) Allow test drives with proper precautions. 6) Complete the sale with a bill of sale and title transfer.",

  price:
    "Car prices on SK Auto Marketplace vary based on make, model, year, condition, and mileage. Use our price comparison tool to see similar listings. Generally, private party sales are 10-20% lower than dealer prices. Check the vehicle history report and consider factors like maintenance records and accident history when evaluating price.",

  documents:
    "Essential documents for buying/selling: 1) Vehicle Title (proof of ownership). 2) Registration Certificate. 3) Bill of Sale. 4) Vehicle History Report. 5) Maintenance Records. 6) Insurance Information. 7) Emissions/Safety Inspection certificates (if required in your area). Always verify document authenticity before completing a transaction.",

  inspection:
    "Before buying, we recommend: 1) Visual inspection for rust, damage, and wear. 2) Test drive to check engine, transmission, brakes, and handling. 3) Professional mechanic inspection ($100-200, highly recommended). 4) Check vehicle history report for accidents and title issues. 5) Verify VIN matches all documents. 6) Test all features (AC, electronics, etc.).",

  payment:
    "Safe payment methods: 1) Bank transfer or cashier's check (most secure). 2) Cash (for smaller amounts, meet at bank). 3) Escrow services (for high-value transactions). AVOID: Wire transfers to unknown parties, personal checks, or cryptocurrency. Always get a receipt and bill of sale documenting the transaction.",

  financing:
    "Financing options: 1) Bank/Credit Union loans (typically best rates, 3-7% APR). 2) Dealer financing (convenient but compare rates). 3) Online lenders (quick approval, variable rates). 4) Personal loans (for older vehicles). Pre-approval helps you negotiate better. Consider total cost including interest over the loan term.",

  insurance:
    "Before driving your new car: 1) Contact your insurance company to add the vehicle. 2) You typically have 7-30 days to update your policy. 3) Factors affecting rates: vehicle value, safety features, your driving history, location. 4) Required coverage varies by state (minimum liability). 5) Consider comprehensive and collision for newer vehicles.",

  warranty:
    "Warranty information: 1) New cars: Manufacturer warranty (3-5 years/36,000-60,000 miles typical). 2) Used cars: Check if factory warranty is transferable. 3) Extended warranties: Available but read terms carefully. 4) Private sales: Usually 'as-is' unless otherwise stated. 5) Verified dealers may offer limited warranties.",

  trade:
    "Trade-in process: 1) Get your car's value from multiple sources (KBB, Edmunds, etc.). 2) Clean and prepare your vehicle. 3) Gather all maintenance records. 4) Get quotes from multiple dealers. 5) Compare trade-in value vs. private sale (private typically yields 10-20% more). 6) Negotiate trade-in and new purchase separately.",

  fraud:
    "Avoid scams: 1) Meet in safe public places, prefer police station parking lots. 2) Never send money before seeing the car in person. 3) Verify seller's identity matches title. 4) Be wary of 'too good to be true' prices. 5) Use secure payment methods. 6) Get everything in writing. 7) Check VIN against title and vehicle. 8) Report suspicious listings to SK Auto support.",

  default:
    "I'm SK Auto Copilot, here to help! Ask me about: buying or selling process, pricing guidance, required documents, vehicle inspection tips, payment methods, financing options, insurance, warranties, trade-ins, or fraud prevention. Or try specific questions like 'How do I verify documents?' or 'What's a fair price for a used sedan?'",
}

export function getAssistantResponse(query: string): string {
  const lowerQuery = query.toLowerCase()

  // Keyword matching
  if (lowerQuery.includes("buy") && !lowerQuery.includes("sell")) return mockAssistantAnswers.buy
  if (lowerQuery.includes("sell")) return mockAssistantAnswers.sell
  if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("value"))
    return mockAssistantAnswers.price
  if (lowerQuery.includes("document") || lowerQuery.includes("paperwork") || lowerQuery.includes("title"))
    return mockAssistantAnswers.documents
  if (lowerQuery.includes("inspect") || lowerQuery.includes("check")) return mockAssistantAnswers.inspection
  if (lowerQuery.includes("payment") || lowerQuery.includes("pay")) return mockAssistantAnswers.payment
  if (lowerQuery.includes("financ") || lowerQuery.includes("loan")) return mockAssistantAnswers.financing
  if (lowerQuery.includes("insurance") || lowerQuery.includes("coverage")) return mockAssistantAnswers.insurance
  if (lowerQuery.includes("warrant")) return mockAssistantAnswers.warranty
  if (lowerQuery.includes("trade")) return mockAssistantAnswers.trade
  if (lowerQuery.includes("scam") || lowerQuery.includes("fraud") || lowerQuery.includes("safe"))
    return mockAssistantAnswers.fraud

  return mockAssistantAnswers.default
}
