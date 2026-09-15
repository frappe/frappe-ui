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

/**
 * Keys that only a Vue component carries. A compiled SFC has `__name` and
 * `render` or `setup`; a `defineComponent` object has `setup` or `render`; an
 * async component has `__asyncLoader`. A vnode is not a component, but
 * `<component :is>` renders one, so it is not a mistake either.
 */
const COMPONENT_KEYS = [
  'render',
  'setup',
  'template',
  'ssrRender',
  'components',
  'extends',
  'mixins',
  'functional',
  '__file',
  '__name',
  '__vccOpts',
  '__asyncLoader',
  '__v_isVNode',
] as const

/**
 * Whether a value can render as a component. Functions cover function
 * components and class components; objects need at least one component key.
 */
export function isComponentLike(value: unknown): boolean {
  if (typeof value === 'function') return true
  if (!value || typeof value !== 'object') return false
  return COMPONENT_KEYS.some((key) => key in (value as object))
}

const warnedIconObjects = new Set<string>()

/**
 * Emit a one-time dev-mode warning when a component receives a plain object
 * for an icon prop. The removed `{ name, theme }` shape (ADR-0008) lands here:
 * it is not a string, so it reaches the component branch and paints an empty
 * badge. Dedups per (component, prop) pair.
 */
export function warnUnsupportedIconObject(
  component: string,
  prop: string,
  value: unknown,
) {
  if (import.meta.env.PROD) return
  if (!value || typeof value !== 'object') return
  if (isComponentLike(value)) return
  const key = `${component}.${prop}`
  if (warnedIconObjects.has(key)) return
  warnedIconObjects.add(key)
  const keys = Object.keys(value as object).slice(0, 4).join(', ')
  console.warn(
    `[frappe-ui] ${component}.${prop} received a plain object (keys: ${keys}). The { name, theme } icon object was removed in 1.0.0. Pass a lucide-* string or a component, and set \`theme\` at the top level. The icon renders empty.`,
  )
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetWarnUnsupportedIconObject() {
  warnedIconObjects.clear()
}
