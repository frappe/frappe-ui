import type { ItemListSize } from '../../ItemListRow'

/**
 * Shared helpers for the Select / MultiSelect / Combobox component family.
 *
 * Anything genuinely component-specific (types, sentinel prefixes, custom-option
 * handling) lives in each component's own `utils.ts` — this module holds only
 * the pieces that were proven duplicates across at least two of those files.
 */

export type SelectionSize = 'sm' | 'md' | 'lg' | 'xl'
export type SelectionVariant = 'subtle' | 'outline' | 'ghost'

export function triggerSizeClasses(size: SelectionSize) {
  return {
    sm: 'min-h-7 rounded px-2',
    md: 'min-h-8 rounded px-2.5',
    lg: 'min-h-10 rounded-md px-3',
    xl: 'min-h-10 rounded-md px-3',
  }[size]
}

export function inputFontSizeClasses(size: SelectionSize) {
  return {
    sm: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[size]
}

export function itemRootSizeClasses(size: SelectionSize) {
  return {
    sm: 'min-h-7',
    md: 'min-h-8',
    lg: 'min-h-10',
    xl: 'min-h-10',
  }[size]
}

export function toItemListSize(size: SelectionSize): ItemListSize {
  return size
}

export function triggerVariantClasses(
  variant: SelectionVariant,
  disabled: boolean,
) {
  if (disabled) {
    return [
      'cursor-not-allowed border text-ink-gray-4',
      variant !== 'ghost' ? 'bg-surface-gray-1' : '',
      variant === 'outline' ? 'border-outline-gray-2' : 'border-transparent',
    ].join(' ')
  }

  return {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-elevation-2 hover:bg-surface-gray-3',
    outline:
      'border border-outline-gray-2 bg-surface-base hover:border-outline-gray-3',
    ghost:
      'border border-transparent bg-transparent hover:bg-surface-gray-3 focus-within:bg-surface-gray-3',
  }[variant]
}

/**
 * Trigger base classes. Two variants because Combobox has an inner `<input>`
 * and needs `focus-within`, while Select / MultiSelect rely on `focus-visible`
 * on the trigger itself.
 */
export const triggerBaseClassesFocusVisible =
  'relative inline-flex items-center gap-2 text-left text-ink-gray-7 outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:focus-ring data-[state=open]:focus-ring'

export const triggerBaseClassesFocusWithin =
  'relative inline-flex items-center gap-2 text-left text-ink-gray-7 outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-within:focus-ring data-[state=open]:focus-ring'

export const itemClasses =
  'select-none rounded border-0 text-base text-ink-gray-9 transition-colors duration-100 ease-out data-[disabled]:text-ink-gray-4 data-[highlighted]:bg-surface-gray-2 data-[state=checked]:bg-surface-gray-3 data-[highlighted]:data-[state=checked]:bg-surface-gray-4'

/**
 * Case-insensitive substring match against an option's label and value.
 * Used as the default filter predicate by MultiSelect and Combobox.
 */
export function matchesByLabelOrValue(
  item: { label: string; value: string },
  query: string,
) {
  const normalizedQuery = query.toLowerCase()
  if (!normalizedQuery) return true

  return (
    item.label.toLowerCase().includes(normalizedQuery) ||
    item.value.toLowerCase().includes(normalizedQuery)
  )
}

/**
 * Resolve the deprecated `render` alias into a normalized `slots` object.
 *
 * - `render` as a function → maps to `slots.item` (full-row takeover).
 * - `render` as an object  → merged one-to-one into slots.
 * - `slots` always wins on key conflict.
 *
 * In dev, warns when `slots.item` is mixed with `slots.prefix` / `slots.label`
 * / `slots.suffix` (mutually exclusive — `slots.item` wins).
 */
export function resolveItemSlotsFromRaw<TSlots>(
  raw: { render?: unknown; slots?: TSlots },
  componentName: string,
): TSlots {
  const legacy = raw.render
  let legacySlots: TSlots | undefined

  if (typeof legacy === 'function') {
    legacySlots = {
      item: () => (legacy as () => unknown)(),
    } as unknown as TSlots
  } else if (legacy && typeof legacy === 'object') {
    legacySlots = legacy as TSlots
  }

  const resolved: TSlots = {
    ...(legacySlots ?? ({} as TSlots)),
    ...(raw.slots ?? ({} as TSlots)),
  } as TSlots

  if (import.meta.env.DEV) {
    const r = resolved as Record<string, unknown>
    if (r.item && (r.prefix || r.label || r.suffix)) {
      console.warn(
        `[${componentName}] \`slots.item\` is mutually exclusive with \`slots.prefix\` / \`slots.label\` / \`slots.suffix\`. \`slots.item\` wins.`,
      )
    }
  }

  return resolved
}
