import type {
  ComboboxCustomOption,
  ComboboxCustomOptionContext,
  ComboboxGroupedOption,
  ComboboxItemSlotProps,
  ComboboxItemSlots,
  ComboboxOption,
  ComboboxSelectableOption,
  ComboboxSimpleOption,
  ComboboxSize,
  ComboboxVariant,
} from './types'
import type { ItemListSize } from '../ItemList'

/** Sentinel values used internally — never exposed to consumers. */
export const EMPTY_SELECTABLE_VALUE_PREFIX = '__frappe_ui_combobox_empty__:'
export const CREATE_OPTION_VALUE = '__frappe_ui_combobox_create__'

export type ResolvedItemSlots = ComboboxItemSlots<ComboboxItemSlotProps>

export type NormalizedSelectableOption = ComboboxSelectableOption & {
  type: 'option'
  resolvedSlots: ResolvedItemSlots
}

export type NormalizedCustomOption = ComboboxCustomOption & {
  type: 'custom'
  resolvedSlots: ResolvedItemSlots
}

export type NormalizedItem = NormalizedSelectableOption | NormalizedCustomOption

export type NormalizedGroup = Omit<ComboboxGroupedOption, 'options'> & {
  options: NormalizedItem[]
}

export function isGroupedOption(
  option: ComboboxOption,
): option is ComboboxGroupedOption {
  return typeof option === 'object' && option !== null && 'group' in option
}

export function isCustomOption(
  item: NormalizedItem,
): item is NormalizedCustomOption {
  return item.type === 'custom'
}

export function isSelectableOption(
  item: NormalizedItem,
): item is NormalizedSelectableOption {
  return item.type === 'option'
}

/** Resolve the deprecated `render` alias into a normalized `slots` object. */
export function resolveItemSlotsFromRaw(
  raw: ComboboxSelectableOption | ComboboxCustomOption,
): ResolvedItemSlots {
  // Legacy `render` alias: function form → slots.item (full-row takeover);
  // object form → merged one-to-one into slots.
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
      '[Combobox] `slots.item` is mutually exclusive with `slots.prefix` / `slots.label` / `slots.suffix`. `slots.item` wins.',
    )
  }

  return resolved
}

export function normalizeSimpleOption(
  option: ComboboxSimpleOption | null | undefined,
): NormalizedItem | null {
  if (!option) return null

  if (typeof option === 'string') {
    return {
      type: 'option',
      label: option,
      value: option,
      resolvedSlots: {},
    }
  }

  if (option.type === 'custom') {
    return {
      ...option,
      type: 'custom',
      slot: option.slot ?? option.slotName,
      resolvedSlots: resolveItemSlotsFromRaw(option),
    }
  }

  if (option.value === undefined || option.value === null) {
    return null
  }

  return {
    ...option,
    type: 'option',
    slot: option.slot ?? option.slotName,
    resolvedSlots: resolveItemSlotsFromRaw(option),
  }
}

export function normalizeComboboxOptions(
  options: ComboboxOption[],
): NormalizedGroup[] {
  const groups: NormalizedGroup[] = []
  let pendingUngrouped: NormalizedItem[] = []

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
    if (isGroupedOption(option)) {
      flushUngrouped()

      const normalizedOptions = option.options
        .map(normalizeSimpleOption)
        .filter((item): item is NormalizedItem => Boolean(item))

      if (!normalizedOptions.length) return

      groups.push({
        key: option.key ?? `group-${index}`,
        group: option.group,
        hideLabel: option.hideLabel,
        options: normalizedOptions,
      })

      return
    }

    const normalizedOption = normalizeSimpleOption(option)
    if (normalizedOption) {
      pendingUngrouped.push(normalizedOption)
    }
  })

  flushUngrouped()

  return groups
}

export function matchesSelectableOption(
  item: NormalizedSelectableOption,
  currentQuery: string,
) {
  const normalizedQuery = currentQuery.toLowerCase()

  if (!normalizedQuery) return true

  return (
    item.label.toLowerCase().includes(normalizedQuery) ||
    item.value.toLowerCase().includes(normalizedQuery)
  )
}

export function matchesCustomOption(
  item: NormalizedCustomOption,
  currentQuery: string,
) {
  const context = buildCustomOptionContext(currentQuery)

  if (item.condition) {
    return item.condition(context)
  }

  if (!currentQuery) return true

  return item.label.toLowerCase().includes(currentQuery.toLowerCase())
}

export function buildCustomOptionContext(
  query: string,
): ComboboxCustomOptionContext {
  return { query, searchTerm: query }
}

export function triggerSizeClasses(size: ComboboxSize) {
  return {
    sm: 'min-h-7 rounded px-2',
    md: 'min-h-8 rounded px-2.5',
    lg: 'min-h-10 rounded-md px-3',
    xl: 'min-h-10 rounded-md px-3',
  }[size]
}

export function inputFontSizeClasses(size: ComboboxSize) {
  return {
    sm: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[size]
}

export function itemRootSizeClasses(size: ComboboxSize) {
  return {
    sm: 'min-h-7',
    md: 'min-h-8',
    lg: 'min-h-10',
    xl: 'min-h-10',
  }[size]
}

export function toItemListSize(size: ComboboxSize): ItemListSize {
  return size
}

export function triggerVariantClasses(
  variant: ComboboxVariant,
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
  'relative inline-flex items-center gap-2 text-left text-ink-gray-7 outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-within:ring-2 data-[state=open]:ring-2 ring-outline-gray-3'

export const inputClasses =
  'min-w-0 flex-1 border-0 bg-transparent p-0 text-ink-gray-8 outline-none ring-0 placeholder:text-ink-gray-4 focus:border-0 focus:outline-none focus:ring-0'

export const itemClasses =
  'select-none rounded border-0 text-base text-ink-gray-9 transition-colors duration-100 ease-out data-[disabled]:text-ink-gray-4 data-[highlighted]:bg-surface-gray-2 data-[state=checked]:bg-surface-gray-3'
