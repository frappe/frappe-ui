import { computed, type ComputedRef } from 'vue'
import { resolvePropValue } from '../utils/resolvePropValue'
import type { InputSize, InputVariant } from './inputTypes'

/**
 * Where the focus styles apply. `focus` for the focusable element itself (an
 * `<input>`), `focus-within` for a box that holds one — a contenteditable
 * wrapper, a tag field, a control that renders its own caret.
 */
export type InputFocusPrefix = 'focus' | 'focus-within'

export interface UseInputClassesOptions {
  /** Control height and text scale. Falls back to `sm`. */
  size?: () => InputSize | undefined
  /** Surface style. Falls back to `subtle`. */
  variant?: () => InputVariant | undefined
  /** Renders the disabled surface and ink, whatever the variant says. */
  disabled?: () => boolean | undefined
  /** Reserves room at the start of the box for a prefix element. */
  hasPrefix?: () => boolean
  /** Reserves room at the end of the box for a suffix element. */
  hasSuffix?: () => boolean
  /** Defaults to `focus`. */
  focusPrefix?: InputFocusPrefix
  /** Name carried by the dev warning when `size` is out of range. */
  component?: string
}

export interface UseInputClassesReturn {
  /** Height, radius, padding, surface and ink for the box itself. */
  inputClasses: ComputedRef<Array<string | string[]>>
  /** Ink color the box and its prefix/suffix share. */
  textColor: ComputedRef<string>
  /** Inset for an element absolutely positioned at the start of the box. */
  prefixClasses: ComputedRef<string>
  /** Inset for an element absolutely positioned at the end of the box. */
  suffixClasses: ComputedRef<string>
}

const SIZE_FALLBACK = 'sm'
const VARIANT_FALLBACK = 'subtle'

const VARIANT_NAMES: Record<InputVariant, InputVariant> = {
  subtle: 'subtle',
  outline: 'outline',
  ghost: 'ghost',
}

// Heights are fixed, not derived from line-height: 24/28/32/40px.
const sizeClassesBySize: Record<InputSize, string> = {
  xs: 'text-xs rounded-3 h-6',
  sm: 'text-base rounded-4 h-7',
  md: 'text-base rounded-4 h-8',
  lg: 'text-lg rounded-5 h-10',
}

const prefixPaddingBySize: Record<InputSize, string> = {
  xs: 'ps-1.5',
  sm: 'ps-2',
  md: 'ps-2.5',
  lg: 'ps-3',
}

const suffixPaddingBySize: Record<InputSize, string> = {
  xs: 'pe-1.5',
  sm: 'pe-2',
  md: 'pe-2.5',
  lg: 'pe-3',
}

const paddingBySize: Record<
  InputSize,
  {
    base: string
    start: string
    startWithPrefix: string
    end: string
    endWithSuffix: string
  }
> = {
  xs: {
    base: 'py-1',
    start: 'ps-1.5',
    startWithPrefix: 'ps-7',
    end: 'pe-1.5',
    endWithSuffix: 'pe-7',
  },
  sm: {
    base: 'py-1.5',
    start: 'ps-2',
    startWithPrefix: 'ps-8',
    end: 'pe-2',
    endWithSuffix: 'pe-8',
  },
  md: {
    base: 'py-1.5',
    start: 'ps-2.5',
    startWithPrefix: 'ps-9',
    end: 'pe-2.5',
    endWithSuffix: 'pe-9',
  },
  lg: {
    base: 'py-1.5',
    start: 'ps-3',
    startWithPrefix: 'ps-10',
    end: 'pe-3',
    endWithSuffix: 'pe-10',
  },
}

// The two prefixes are spelled out rather than composed: Tailwind reads class
// names as literal text, so `${focusPrefix}:bg-surface-base` generates no CSS
// in any app that scans this file. The rows sit next to each other so a
// restyle edits both.
const variantClassesByFocusPrefix: Record<
  InputFocusPrefix,
  Record<InputVariant, string>
> = {
  focus: {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 placeholder-ink-gray-4 hover:border-outline-elevation-2 hover:bg-surface-gray-3 focus:bg-surface-base focus:border-outline-gray-4 focus:shadow-sm focus:ring-0',
    outline:
      'border border-outline-gray-2 bg-surface-base placeholder-ink-gray-4 hover:border-outline-gray-3 hover:shadow-sm focus:bg-surface-base focus:border-outline-gray-4 focus:shadow-sm focus:ring-0',
    ghost: 'border-0 bg-transparent focus:ring-0 focus-visible:outline-none',
  },
  'focus-within': {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 placeholder-ink-gray-4 hover:border-outline-elevation-2 hover:bg-surface-gray-3 focus-within:bg-surface-base focus-within:border-outline-gray-4 focus-within:shadow-sm focus-within:ring-0',
    outline:
      'border border-outline-gray-2 bg-surface-base placeholder-ink-gray-4 hover:border-outline-gray-3 hover:shadow-sm focus-within:bg-surface-base focus-within:border-outline-gray-4 focus-within:shadow-sm focus-within:ring-0',
    ghost:
      'border-0 bg-transparent focus-within:ring-0 focus-within:outline-none',
  },
}

function disabledClasses(variant: InputVariant): string[] {
  return [
    'border bg-surface-gray-1 placeholder-ink-gray-3',
    variant === 'outline' ? 'border-outline-gray-2' : 'border-transparent',
  ]
}

/**
 * The size and variant classes `TextInput` renders, for an element that is not
 * an `<input>`. An editable title, a tag field or any box that holds its own
 * caret reads them here instead of copying them, and passes
 * `focusPrefix: 'focus-within'` so the focus treatment lands on the box.
 */
export function useInputClasses(
  options: UseInputClassesOptions = {},
): UseInputClassesReturn {
  const focusPrefix = options.focusPrefix ?? 'focus'
  const sizeContext = {
    component: options.component ?? 'useInputClasses',
    prop: 'size',
  }

  const size = computed(() =>
    resolvePropValue(sizeClassesBySize, options.size?.(), SIZE_FALLBACK, {
      ...sizeContext,
    }),
  )

  const padding = computed(() => {
    const table = resolvePropValue(
      paddingBySize,
      options.size?.(),
      SIZE_FALLBACK,
      { ...sizeContext },
    )
    return [
      table.base,
      options.hasPrefix?.() ? table.startWithPrefix : table.start,
      options.hasSuffix?.() ? table.endWithSuffix : table.end,
    ]
  })

  const textColor = computed(() =>
    options.disabled?.() ? 'text-ink-gray-5' : 'text-ink-gray-8',
  )

  const variantName = computed(() =>
    resolvePropValue(VARIANT_NAMES, options.variant?.(), VARIANT_FALLBACK, {
      component: sizeContext.component,
      prop: 'variant',
    }),
  )

  const variant = computed(() =>
    options.disabled?.()
      ? disabledClasses(variantName.value)
      : variantClassesByFocusPrefix[focusPrefix][variantName.value],
  )

  const inputClasses = computed<Array<string | string[]>>(() => [
    size.value,
    padding.value,
    variant.value,
    textColor.value,
    'transition-colors w-full dark:[color-scheme:dark]',
  ])

  const prefixClasses = computed(() =>
    resolvePropValue(prefixPaddingBySize, options.size?.(), SIZE_FALLBACK, {
      ...sizeContext,
    }),
  )

  const suffixClasses = computed(() =>
    resolvePropValue(suffixPaddingBySize, options.size?.(), SIZE_FALLBACK, {
      ...sizeContext,
    }),
  )

  return { inputClasses, textColor, prefixClasses, suffixClasses }
}
