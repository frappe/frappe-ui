import type { ItemListSize } from '../ItemListRow'
import type {
  MultiSelectGroupedOption,
  MultiSelectItemSlotProps,
  MultiSelectItemSlots,
  MultiSelectOption,
  MultiSelectOptions,
  MultiSelectSize,
  MultiSelectVariant,
} from './types'

/** Sentinel used to disambiguate options whose value is an empty string. */
export const EMPTY_VALUE_PREFIX = '__frappe_ui_multiselect_empty__:'

export type ResolvedItemSlots = MultiSelectItemSlots<MultiSelectItemSlotProps>

export type NormalizedOption = MultiSelectOption & {
  resolvedSlots: ResolvedItemSlots
}

export type NormalizedGroup = Omit<MultiSelectGroupedOption, 'options'> & {
  options: NormalizedOption[]
}

export function isGroupedOption(
  option: MultiSelectOption | MultiSelectGroupedOption,
): option is MultiSelectGroupedOption {
  return typeof option === 'object' && option !== null && 'group' in option
}

/** Resolve the deprecated `render` alias into a normalized `slots` object. */
export function resolveItemSlotsFromRaw(
  raw: MultiSelectOption,
): ResolvedItemSlots {
  const legacy = raw.render
  let legacySlots: ResolvedItemSlots | undefined

  if (typeof legacy === 'function') {
    legacySlots = { item: () => legacy() }
  } else if (legacy && typeof legacy === 'object') {
    legacySlots = legacy as ResolvedItemSlots
  }

  const resolved: ResolvedItemSlots = {
    ...(legacySlots ?? {}),
    ...(raw.slots ?? {}),
  }

  if (
    import.meta.env.DEV &&
    resolved.item &&
    (resolved.prefix || resolved.label || resolved.suffix)
  ) {
    console.warn(
      '[MultiSelect] `slots.item` is mutually exclusive with `slots.prefix` / `slots.label` / `slots.suffix`. `slots.item` wins.',
    )
  }

  return resolved
}

export function normalizeOption(
  option: MultiSelectOption | null | undefined,
): NormalizedOption | null {
  if (!option) return null
  if (option.value === undefined || option.value === null) return null

  return {
    ...option,
    slot: option.slot ?? option.slotName,
    resolvedSlots: resolveItemSlotsFromRaw(option),
  }
}

export function normalizeMultiSelectOptions(
  options: MultiSelectOptions,
): NormalizedGroup[] {
  const groups: NormalizedGroup[] = []
  let pendingUngrouped: NormalizedOption[] = []

  const flushUngrouped = () => {
    if (!pendingUngrouped.length) return

    groups.push({
      key: `__ungrouped__${groups.length}`,
      group: '',
      hideLabel: true,
      options: pendingUngrouped,
    })

    pendingUngrouped = []
  }

  options.forEach((option, index) => {
    if (!option) return

    if (isGroupedOption(option)) {
      flushUngrouped()

      const normalizedOptions = option.options
        .map(normalizeOption)
        .filter((item): item is NormalizedOption => Boolean(item))

      if (!normalizedOptions.length) return

      groups.push({
        key: option.key ?? `group-${index}`,
        group: option.group,
        hideLabel: option.hideLabel,
        options: normalizedOptions,
      })

      return
    }

    const normalized = normalizeOption(option)
    if (normalized) pendingUngrouped.push(normalized)
  })

  flushUngrouped()
  return groups
}

export function matchesOption(item: NormalizedOption, currentQuery: string) {
  const normalizedQuery = currentQuery.toLowerCase()
  if (!normalizedQuery) return true

  return (
    item.label.toLowerCase().includes(normalizedQuery) ||
    item.value.toLowerCase().includes(normalizedQuery)
  )
}

export function triggerSizeClasses(size: MultiSelectSize) {
  return {
    sm: 'min-h-7 rounded px-2',
    md: 'min-h-8 rounded px-2.5',
    lg: 'min-h-10 rounded-md px-3',
    xl: 'min-h-10 rounded-md px-3',
  }[size]
}

export function inputFontSizeClasses(size: MultiSelectSize) {
  return {
    sm: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[size]
}

export function itemRootSizeClasses(size: MultiSelectSize) {
  return {
    sm: 'min-h-7',
    md: 'min-h-8',
    lg: 'min-h-10',
    xl: 'min-h-10',
  }[size]
}

export function toItemListSize(size: MultiSelectSize): ItemListSize {
  return size
}

export function triggerVariantClasses(
  variant: MultiSelectVariant,
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
      'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3',
    outline:
      'border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3',
    ghost:
      'border border-transparent bg-transparent hover:bg-surface-gray-3 focus-within:bg-surface-gray-3',
  }[variant]
}

export const triggerBaseClasses =
  'relative inline-flex items-center gap-2 text-left text-ink-gray-7 outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 data-[state=open]:ring-2 ring-outline-gray-3'

export const itemClasses =
  'select-none rounded border-0 text-base text-ink-gray-9 transition-colors duration-100 ease-out data-[disabled]:text-ink-gray-4 data-[highlighted]:bg-surface-gray-2 data-[state=checked]:bg-surface-gray-3 data-[highlighted]:data-[state=checked]:bg-surface-gray-4'
