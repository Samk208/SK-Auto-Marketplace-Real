
export interface Guide {
    slug: string
    title: string
    items: string
    category: "Identification" | "Maintenance" | "Import/Tax" | "DIY Repairs"
    readTime: string
    image: string
    excerpt: string
    content: string // HTML or Markdown content
}

export const MOCK_GUIDES: Guide[] = [
    {
        slug: "how-to-find-vin",
        title: "How to Find Your VIN Number",
        items: "5 min read",
        category: "Identification",
        readTime: "5 min",
        image: "/images/guides/vin-location.jpg",
        excerpt: "Locating your Vehicle Identification Number (VIN) is the first step to ordering the correct parts. Here are the 4 most common places to find it.",
        content: `
      <h2>Why You Need Your VIN</h2>
      <p>Your Vehicle Identification Number (VIN) is your car's unique fingerprint. It tells us exactly which parts fit your specific model, year, and production batch.</p>
      
      <h3>1. Dashboard</h3>
      <p>The most common place is on the driver's side dashboard, visible through the windshield.</p>

      <h3>2. Driver's Door Jamb</h3>
      <p>Open the driver's door and look for a sticker on the door pillar.</p>

      <h3>3. Engine Block</h3>
      <p>Pop the hood and look at the front of the engine block.</p>
      
      <h3>4. Registration Documents</h3>
      <p>Your vehicle registration or insurance card will always list the VIN.</p>
    `
    },
    {
        slug: "spot-fake-parts",
        title: "How to Spot Fake Mobis Parts",
        items: "4 min read",
        category: "Identification",
        readTime: "7 min",
        image: "/images/guides/fake-vs-real.jpg",
        excerpt: "Don't get scammed with counterfeit parts. Learn the 5 tell-tale signs of fake Hyundai/Kia parts and how to verify authenticity.",
        content: `
      <h2>The Dangers of Counterfeit Parts</h2>
      <p>Fake parts can fail catastrophically, endangering you and your vehicle. Here is how to spot them.</p>
      
      <h3>1. Hologram Sticker</h3>
      <p>Genuine Hyundai Mobis parts always have a holographic sticker that changes color when tilted.</p>
      
      <h3>2. Packaging Quality</h3>
      <p>Inspect the box for poor printing, spelling errors, or flimsy materials.</p>
    `
    },
    {
        slug: "importing-parts-nigeria",
        title: "Importing Car Parts to Nigeria: A Guide",
        items: "5 min read",
        category: "Import/Tax",
        readTime: "10 min",
        image: "/images/guides/shipping-container.jpg",
        excerpt: "Everything you need to know about customs duties, shipping times, and clearing processes for auto parts in Lagos ports.",
        content: `
      <h2>Understanding Customs Duties</h2>
      <p>Importing auto parts into Nigeria attracts specific duties and levies.</p>
    `
    },
    {
        slug: "sonata-service-schedule",
        title: "Sonata LF Service Schedule (100k km)",
        items: "2 min read",
        category: "Maintenance",
        readTime: "5 min",
        image: "/images/guides/mechanic.jpg",
        excerpt: "Keep your Sonata running like new. A complete breakdown of what to service at 60k, 80k, and 100k kilometers.",
        content: `
      <h2>100,000km Major Service</h2>
      <ul>
        <li>Replace Timing Belt/Chain</li>
        <li>Flush Coolant</li>
        <li>Replace Spark Plugs</li>
      </ul>
    `
    }
]

export const GUIDES_CATEGORIES = ["Identification", "Maintenance", "Import/Tax", "DIY Repairs"]
