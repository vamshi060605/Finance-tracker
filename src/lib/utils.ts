// Utility function for combining class names using clsx and tailwind-merge

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combines class names and merges Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
