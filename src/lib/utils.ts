// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format an Ethereum price in ETH
 * @param price - Price in ETH as string or number
 * @param decimals - Number of decimal places to show (default: 4)
 * @returns Formatted price string
 */
export function formatPrice(price: string | number, decimals: number = 4): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(numPrice)) return '0.0000 ETH'
  return `${numPrice.toFixed(decimals)} ETH`
}

/**
 * Format an Ethereum address for display (0x1234...5678)
 * @param address - Ethereum address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Formatted address string
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return ''
  if (address.length < startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Format a timestamp to relative time (e.g., "2 hours ago", "3 days ago")
 * @param timestamp - Date object, timestamp string, or number
 * @returns Formatted time string
 */
export function formatTimeAgo(timestamp: Date | string | number): string {
  const date = typeof timestamp === 'string' || typeof timestamp === 'number'
    ? new Date(timestamp)
    : timestamp

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`

  const years = Math.floor(months / 12)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

/**
 * Copy text to clipboard and show a toast notification
 * @param text - Text to copy
 * @param successMessage - Optional success message (default: "Copied to clipboard")
 */
export async function copyToClipboard(text: string, successMessage?: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(successMessage || 'Copied to clipboard')
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    toast.error('Failed to copy to clipboard')
  }
}