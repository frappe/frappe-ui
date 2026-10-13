import type { ItemListSize } from '../../ItemListRow'
import type { InputSize, InputVariant } from '../../../composables/inputTypes'
import { resolvePropValue } from '../../../utils/resolvePropValue'

/**
 * Shared helpers for the Select / MultiSelect / Combobox component family.
 *
 * Anything genuinely component-specific (types, sentinel prefixes, custom-option
 * handling) lives in each component's own `utils.ts` — this module holds only
 * the pieces that were proven duplicates across at least two of those files.
 */

/**
 * Trigger size scale for the selection family. The trigger is a text input in
 * every way but the caret, so this is `InputSize` itself — same 24/28/32/40px
 * heights — under a name the selection components' public types reference
 * directly. An alias rather than a copy: the two cannot drift apart while the
 * trigger renders on the input geometry.
 */
export type SelectionSize = InputSize
export type SelectionVariant = InputVariant

const SIZE_FALLBACK = 'sm'

// One context for the whole family, deliberately. `resolvePropValue` dedupes
// on `component.prop=value`, so a single `<Select size="xl">` — which hits the
// trigger map, the font map, the item map and then `ItemListRow` — reports the
// stale value once instead of four times. The name is the family rather than
// the component because these helpers are shared and exported; naming the
// caller would mean a new parameter on public API.
const sizeContext = {
  component: 'Select / Combobox / MultiSelect',
  prop: 'size',
}

const triggerSizeMap: Record<SelectionSize, string> = {
  xs: 'min-h-6 rounded-3 px-1.5',
  sm: 'min-h-7 rounded-4 px-2',
  md: 'min-h-8 rounded-4 px-2.5',
  lg: 'min-h-10 rounded-5 px-3',
}

const inputFontSizeMap: Record<SelectionSize, string> = {
  xs: 'text-xs',
  sm: 'text-base',
  md: 'text-base',
  lg: 'text-lg',
}

const itemRootSizeMap: Record<SelectionSize, string> = {
  xs: 'min-h-6',
  sm: 'min-h-7',
  md: 'min-h-8',
  lg: 'min-h-10',
}

export function triggerSizeClasses(size: SelectionSize) {
  return resolvePropValue(triggerSizeMap, size, SIZE_FALLBACK, sizeContext)
}

export function inputFontSizeClasses(size: SelectionSize) {
  return resolvePropValue(inputFontSizeMap, size, SIZE_FALLBACK, sizeContext)
}

export function itemRootSizeClasses(size: SelectionSize) {
  return resolvePropValue(itemRootSizeMap, size, SIZE_FALLBACK, sizeContext)
}

export function toItemListSize(size: SelectionSize): ItemListSize {
  // Resolve here rather than forwarding the raw value: `ItemListRow` has the
  // same scale and the same fallback, so passing an unsupported size straight
  // through would make it warn a second time about the same call site.
  return resolvePropValue(
    itemListSizePassthrough,
    size,
    SIZE_FALLBACK,
    sizeContext,
  )
}

const itemListSizePassthrough: Record<SelectionSize, ItemListSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
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
  'relative inline-flex items-center gap-2 text-left text-ink-gray-7 transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:focus-ring'

export const triggerBaseClassesFocusWithin =
  'relative inline-flex items-center gap-2 text-left text-ink-gray-7 outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-within:focus-ring data-[state=open]:focus-ring'

export const itemClasses =
  'select-none rounded-4 border-0 text-base text-ink-gray-9 transition-colors duration-100 ease-out data-[disabled]:text-ink-gray-4 data-[highlighted]:bg-surface-alpha-gray-2 data-[state=checked]:bg-surface-gray-3 data-[highlighted]:data-[state=checked]:bg-surface-gray-4'

/**
 * Case-insensitive substring match against an option's label and value.
 * Used as the default filter predicate by MultiSelect and Combobox.
 */
export function matchesByLabelOrValue(
  item: { label: string; value: string | number },
  query: string,
) {
  const normalizedQuery = query.toLowerCase()
  if (!normalizedQuery) return true

  return (
    item.label.toLowerCase().includes(normalizedQuery) ||
    String(item.value).toLowerCase().includes(normalizedQuery)
  )
}

/**
 * Read a grouped option's children.
 *
 * `Autocomplete`, which `Combobox` and `MultiSelect` replaced, spelled this key
 * `items`. Both normalizers used to reach straight for `option.options.map(…)`,
 * so an un-migrated group died inside `map` with "cannot read properties of
 * undefined" and named neither the group nor the rename. Same failure, but it
 * says what is actually wrong.
 *
 * Deliberately not an alias: `items` is not accepted, only diagnosed. Per
 * ADR-0012 an added member freezes until `2.0.0` exactly like a renamed one,
 * and #869 settled that nothing is added to these two on `Autocomplete`'s way
 * out.
 */
export function readGroupOptions<TOption>(
  group: { group: string; options?: TOption[] },
  componentName: string,
): TOption[] {
  if (Array.isArray(group.options)) return group.options

  const complaint = Array.isArray((group as { items?: unknown }).items)
    ? 'uses `items`. That key was renamed to `options` when `Autocomplete` was removed in 1.0.0 — rename it: `{ group, items }` → `{ group, options }`.'
    : 'needs an `options` array.'

  throw new TypeError(
    `[${componentName}] grouped option "${group.group}" ${complaint}`,
  )
}

/**
 * Normalize an option's per-item `slots` object into a plain, always-defined
 * slot map.
 *
 * In dev, warns when `slots.item` is mixed with `slots.prefix` / `slots.label`
 * / `slots.suffix` (mutually exclusive — `slots.item` wins).
 */
export function resolveItemSlots<TSlots>(
  slots: TSlots | undefined,
  componentName: string,
): TSlots {
  const resolved: TSlots = { ...(slots ?? ({} as TSlots)) } as TSlots

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
