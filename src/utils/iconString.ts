/**
 * Helpers for classifying icon-name strings across the library (P11).
 *
 * Two flavors of string are supported:
 * - `lucide-*` — rendered via the Tailwind mask-based utility plugin.
 * - Emoji / symbol glyphs (e.g. `🚀`, `✨`, `⚠️`) — rendered as plain text.
 *
 * Anything else (bare feather-style names like `home`, `chevron-down`) is
 * not a supported icon string. `FeatherIcon` back-compat was removed in
 * `1.0.0` (ADR-0008) — such a value renders nothing and, in dev, warns once
 * per (component, prop) via `warnUnsupportedIconString`.
 */

export function isLucideIconString(icon: unknown): icon is string {
  return typeof icon === 'string' && icon.startsWith('lucide-')
}

/**
 * Heuristic: a non-lucide string that contains no basic ASCII letters or
 * digits is treated as an emoji, catching `🚀`, `✨`, `⚠️`, `❌`, etc.
 */
export function isEmojiIconString(icon: unknown): icon is string {
  if (typeof icon !== 'string' || !icon) return false
  if (icon.startsWith('lucide-')) return false
  return !/[a-zA-Z0-9]/.test(icon)
}

const warnedIconStrings = new Set<string>()

/**
 * Emit a one-time dev-mode warning when a component receives an icon-name
 * string that is neither a `lucide-*` string nor an emoji/symbol glyph.
 * Dedups per (component, prop) pair.
 */
export function warnUnsupportedIconString(
  component: string,
  prop: string,
  value: unknown,
) {
  if (typeof value !== 'string' || !value) return
  if (isLucideIconString(value)) return
  if (isEmojiIconString(value)) return
  if (import.meta.env.PROD) return
  const key = `${component}.${prop}`
  if (warnedIconStrings.has(key)) return
  warnedIconStrings.add(key)
  console.warn(
    `[frappe-ui] ${component}.${prop}="${value}" is not a supported icon string — use a lucide-* string (e.g. "lucide-${value}") or a Component. The icon will not render.`,
  )
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetWarnUnsupportedIconString() {
  warnedIconStrings.clear()
}
