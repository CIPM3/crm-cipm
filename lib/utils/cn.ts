// === CSS UTILITY FUNCTIONS ===
// Core styling utilities

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and deduplicates Tailwind CSS classes
 * Resolves conflicts by merging classes intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates conditional classes based on state
 */
export function conditionalClass(
  baseClass: string,
  condition: boolean,
  conditionalClass: string
): string {
  return cn(baseClass, condition && conditionalClass)
}

/**
 * Variant-based class generation
 */
export function createVariantClasses<T extends string>(
  base: string,
  variants: Record<T, string>,
  selectedVariant: T
): string {
  return cn(base, variants[selectedVariant])
}