import {
  matchesByLabelOrValue,
  resolveItemSlotsFromRaw as resolveItemSlotsFromRawShared,
} from '../shared/selection/utils'
import type {
  ComboboxCustomOption,
  ComboboxCustomOptionContext,
  ComboboxGroupedOption,
  ComboboxItemSlotProps,
  ComboboxItemSlots,
  ComboboxOption,
  ComboboxSelectableOption,
  ComboboxSimpleOption,
} from './types'

export {
  inputFontSizeClasses,
  itemClasses,
  itemRootSizeClasses,
  toItemListSize,
  triggerSizeClasses,
  triggerVariantClasses,
} from '../shared/selection/utils'

export { triggerBaseClassesFocusWithin as triggerBaseClasses } from '../shared/selection/utils'

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

export function resolveItemSlotsFromRaw(
  raw: ComboboxSelectableOption | ComboboxCustomOption,
): ResolvedItemSlots {
  return resolveItemSlotsFromRawShared<ResolvedItemSlots>(raw, 'Combobox')
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
  return matchesByLabelOrValue(item, currentQuery)
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

export const inputClasses =
  'min-w-0 flex-1 border-0 bg-transparent p-0 text-ink-gray-8 outline-none ring-0 placeholder:text-ink-gray-4 focus:border-0 focus:outline-none focus:ring-0'
