/**
 * Helpers for classifying `item.icon` strings across selection components.
 *
 * Three flavors of string are supported:
 * - `lucide-*` — rendered via the Tailwind mask-based utility plugin.
 * - Legacy feather names (e.g. `home`, `chevron-down`) — rendered via
 *   `FeatherIcon` for back-compat with existing call sites.
 * - Emoji / symbol glyphs (e.g. `🚀`, `✨`, `⚠️`) — rendered as plain text.
 */

export function isLucideIconString(icon: unknown): icon is string {
  return typeof icon === 'string' && icon.startsWith('lucide-')
}

/**
 * Heuristic: a non-lucide string that contains no basic ASCII letters or
 * digits is treated as an emoji. This keeps legacy feather names like
 * `copy` or `chevron-right` on the FeatherIcon path while catching
 * `🚀`, `✨`, `⚠️`, `❌`, etc.
 */
export function isEmojiIconString(icon: unknown): icon is string {
  if (typeof icon !== 'string' || !icon) return false
  if (icon.startsWith('lucide-')) return false
  return !/[a-zA-Z0-9]/.test(icon)
}

export function isFeatherIconString(icon: unknown): icon is string {
  if (typeof icon !== 'string' || !icon) return false
  if (isLucideIconString(icon)) return false
  if (isEmojiIconString(icon)) return false
  return true
}

import { warnDeprecated } from './warnDeprecated'

/**
 * Emit a one-time dev-mode warning when a component receives a legacy
 * feather-name string in an icon-name prop. Dedups per (component, prop)
 * pair so a single migration message fires for each call site.
 */
export function warnFeatherIconUsage(
  component: string,
  prop: string,
  value: unknown,
) {
  if (!isFeatherIconString(value)) return
  warnDeprecated(
    `${component}.${prop} feather-name icon`,
    `a lucide-* string (e.g. "lucide-${value}") or a passed Component`,
  )
}
