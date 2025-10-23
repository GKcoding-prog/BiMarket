import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Burundian Franc (BIF) currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "1,000 FBu")
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('fr-FR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  })} FBu`;
}
