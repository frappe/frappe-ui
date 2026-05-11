import { computed, type ComputedRef, type Ref } from 'vue'

/**
 * Drives the `filteredGroups` computed shared by MultiSelect and Combobox:
 *
 *   - While the popover is closed or the user hasn't typed since opening,
 *     return groups untouched (so a committed label like "Alex Rivera"
 *     doesn't filter the list to itself).
 *   - Otherwise, filter each group's options through `matches(item, query)`
 *     and drop groups that end up empty.
 *
 * The `matches` predicate is supplied by each consumer — MultiSelect uses
 * a plain label/value substring match; Combobox dispatches on item type
 * to handle its `custom` rows.
 */
export function useFilteredGroups<
  TItem,
  TGroup extends { options: TItem[] },
>(source: {
  groups: Ref<TGroup[]> | ComputedRef<TGroup[]>
  open: Ref<boolean>
  hasTypedSinceOpen: Ref<boolean>
  query: Ref<string>
  matches: (item: TItem, query: string) => boolean
}): ComputedRef<TGroup[]> {
  return computed(() => {
    if (!source.open.value || !source.hasTypedSinceOpen.value) {
      return source.groups.value
    }

    return source.groups.value
      .map((group) => ({
        ...group,
        options: group.options.filter((item) =>
          source.matches(item, source.query.value),
        ),
      }))
      .filter((group) => group.options.length > 0) as TGroup[]
  })
}
