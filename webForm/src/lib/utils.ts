import { clsx, type ClassValue } from "clsx"
import { Smartphone, Sofa, Shirt, Car, Home, Gamepad2, Book, Dumbbell, HeartPulse, Baby, PawPrint, Briefcase, Building, Wrench, UtensilsCrossed, Palette } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

export const conditions = [
  { value: "new", label: "New", description: "Brand new, never used" },
  { value: "like-new", label: "Like New", description: "Barely used, excellent condition" },
  { value: "good", label: "Good", description: "Used but in good working condition" },
  { value: "fair", label: "Fair", description: "Shows wear but still functional" },
  { value: "poor", label: "Poor", description: "Heavily used, may need repairs" },
]



export const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
    subcategories: [
      "Phones", "Laptops", "Tablets", "Wearables", "Cameras", "Drones",
      "TVs", "Audio Devices", "Power Banks", "Chargers", "Accessories"
    ],
  },
  {
    name: "Furniture",
    icon: Sofa,
    subcategories: [
      "Living Room", "Bedroom", "Dining", "Office", "Outdoor",
      "Storage", "Kids Furniture", "Shelves", "Beds", "Tables", "Chairs"
    ],
  },
  {
    name: "Fashion",
    icon: Shirt,
    subcategories: [
      "Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes",
      "Bags", "Watches", "Jewelry", "Traditional Wear", "Eyewear", "Accessories"
    ],
  },
  {
    name: "Vehicles",
    icon: Car,
    subcategories: [
      "Cars", "Motorcycles", "Bicycles", "Trucks", "Boats",
      "Vehicle Parts", "Tyres & Rims", "Car Electronics", "Accessories"
    ],
  },
  {
    name: "Home & Garden",
    icon: Home,
    subcategories: [
      "Appliances", "Kitchen", "Tools", "Cleaning", "Storage",
      "Lighting", "Garden", "Decor", "Beddings", "Curtains & Blinds"
    ],
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    subcategories: [
      "Consoles", "Games", "Controllers", "Virtual Reality", "Gaming Chairs",
      "Gaming PCs", "Mobile Gaming", "Collectibles", "Accessories"
    ],
  },
  {
    name: "Books & Media",
    icon: Book,
    subcategories: [
      "Textbooks", "Fiction", "Non-Fiction", "Children's Books", "Comics",
      "Magazines", "CDs & DVDs", "Educational", "Audiobooks"
    ],
  },
  {
    name: "Sports & Outdoors",
    icon: Dumbbell,
    subcategories: [
      "Fitness Equipment", "Outdoor Sports", "Team Sports", "Water Sports",
      "Cycling", "Camping Gear", "Sportwear", "Footwear", "Accessories"
    ],
  },
  {
    name: "Health & Beauty",
    icon: HeartPulse,
    subcategories: [
      "Skincare", "Haircare", "Makeup", "Fragrances", "Personal Care",
      "Health Equipment", "Supplements", "Grooming Tools"
    ],
  },
  {
    name: "Baby & Kids",
    icon: Baby,
    subcategories: [
      "Clothing", "Toys", "Strollers", "Car Seats", "Baby Gear",
      "Cribs & Furniture", "Feeding", "Diapering", "Learning & Education"
    ],
  },
  {
    name: "Pets",
    icon: PawPrint,
    subcategories: [
      "Pet Food", "Pet Accessories", "Pet Grooming", "Cages & Beds",
      "Adoption", "Pet Health"
    ],
  },
  {
    name: "Industrial & Business",
    icon: Briefcase,
    subcategories: [
      "Office Equipment", "Retail Equipment", "Heavy Machinery", "Safety Equipment",
      "Medical Equipment", "Restaurant Equipment", "Packaging Supplies"
    ],
  },
  {
    name: "Real Estate",
    icon: Building,
    subcategories: [
      "Houses for Sale", "Houses for Rent", "Land", "Commercial Property",
      "Short Let", "Hostels", "Shared Apartments", "Offices"
    ],
  },
  {
    name: "Services",
    icon: Wrench,
    subcategories: [
      "Home Services", "Event Services", "Tutoring", "Repair Services", "Cleaning",
      "Tech Support", "Logistics", "Beauty Services", "Legal Services"
    ],
  },
  {
    name: "Food & Agriculture",
    icon: UtensilsCrossed,
    subcategories: [
      "Groceries", "Fresh Produce", "Packaged Food", "Livestock", "Poultry",
      "Seafood", "Bakery", "Farm Equipment", "Organic", "Drinks"
    ],
  },
  {
    name: "Art & Collectibles",
    icon: Palette,
    subcategories: [
      "Artworks", "Crafts", "Antiques", "Handmade", "NFTs", 
      "Paintings", "Sculptures", "Music Memorabilia", "Stamps", "Coins"
    ],
  },
];



  