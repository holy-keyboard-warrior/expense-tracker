import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryLabel(category: string): string {
  const categories = {
    food: "Food & Dining",
    transportation: "Transportation",
    housing: "Housing",
    utilities: "Utilities",
    entertainment: "Entertainment",
    healthcare: "Healthcare",
    shopping: "Shopping",
    personal: "Personal Care",
    education: "Education",
    travel: "Travel",
    other: "Other",
  }

  return categories[category as keyof typeof categories] || category
}

