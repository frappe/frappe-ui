import {
  matchesByLabelOrValue,
  resolveItemSlotsFromRaw as resolveItemSlotsFromRawShared,
} from '../shared/selection/utils'
import type {
  MultiSelectGroupedOption,
  MultiSelectItemSlotProps,
  MultiSelectItemSlots,
  MultiSelectOption,
  MultiSelectOptions,
} from './types'

export {
  inputFontSizeClasses,
  itemClasses,
  itemRootSizeClasses,
  toItemListSize,
  triggerSizeClasses,
  triggerVariantClasses,
} from '../shared/selection/utils'

export { triggerBaseClassesFocusVisible as triggerBaseClasses } from '../shared/selection/utils'

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

export function resolveItemSlotsFromRaw(
  raw: MultiSelectOption,
): ResolvedItemSlots {
  return resolveItemSlotsFromRawShared<ResolvedItemSlots>(raw, 'MultiSelect')
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
  return matchesByLabelOrValue(item, currentQuery)
}
