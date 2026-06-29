import type { SelectionSize, SelectionVariant } from '../shared/selection/utils'

export {
  inputFontSizeClasses,
  itemRootSizeClasses,
  toItemListSize,
  triggerSizeClasses,
} from '../shared/selection/utils'

/** Sentinel used to disambiguate options whose value is an empty string. */
export const EMPTY_VALUE_PREFIX = '__frappe_ui_select_empty__'

/**
 * Inner padding for the trigger's value area. Mirrors the px portion of
 * `triggerSizeClasses` and is used to align the absolutely-positioned
 * trigger-value overlay with the rest of the trigger content.
 */
export function triggerContentPaddingClasses(size: SelectionSize) {
  return {
    sm: 'px-2',
    md: 'px-2.5',
    lg: 'px-3',
    xl: 'px-3',
  }[size]
}

/**
 * Variant classes for the Select trigger.
 *
 * Differs from the shared helper in two ways:
 *   - The disabled branch omits `text-ink-gray-4`; Select handles disabled
 *     text color via `data-[disabled]:text-ink-gray-4` on the base classes
 *     (reka's `SelectTrigger` emits `data-disabled` when disabled).
 *   - The ghost variant uses `focus:` rather than `focus-within:` because
 *     the Select trigger is a single button with no focusable descendants.
 */
export function triggerVariantClasses(
  variant: SelectionVariant,
  disabled: boolean,
) {
  if (disabled) {
    return [
      'cursor-not-allowed border',
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
      'border border-transparent bg-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3',
  }[variant]
}

/**
 * Base trigger classes for Select. Includes `data-[placeholder]:` and
 * `data-[disabled]:` text-color rules driven by reka's `SelectTrigger`,
 * which is why Select doesn't reuse the shared base string.
 */
export const triggerBaseClasses =
  'relative inline-flex items-center gap-2 text-left transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:focus-ring text-ink-gray-7 data-[placeholder]:text-ink-gray-4 data-[disabled]:text-ink-gray-4'
