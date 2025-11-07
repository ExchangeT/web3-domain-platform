// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export format utilities
export { formatAddress, formatPrice, formatTimeAgo, formatDomain, parseDomain } from './utils/format'

// Re-export validation utilities
export { validateDomainName, validateEthereumAddress, validatePrice, validateEmail, validateUrl } from './utils/validation'

// Clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}