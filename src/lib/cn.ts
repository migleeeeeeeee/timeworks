import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes with proper conflict resolution.
 *
 * Use everywhere in components instead of bare template strings.
 *
 * @example
 *   cn("px-4 py-2", isActive && "bg-brand-600", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
