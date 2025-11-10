import { clsx, type ClassValue } from "clsx"
import { Smartphone, Sofa, Shirt, Car, Home, Gamepad2, Book, Dumbbell, HeartPulse, Baby, PawPrint, Briefcase, Building, Wrench, UtensilsCrossed, Palette } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BASE_URL = process.env.BASE_URL || "https://api.sirz.co.uk"
// export const BASE_URL = process.env.BASE_URL || "http://localhost:5000"

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}


  