import {
  computed,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

/**
 * Drives the `filteredGroups` computed shared by MultiSelect and Combobox:
 *
 *   - While the popover is closed or the user hasn't typed since opening,
 *     skip the query-based `matches` filter (so a committed label like
 *     "Alex Rivera" doesn't filter the list to itself).
 *   - `alwaysMatch` runs on both paths — it's for items whose visibility
 *     is bespoke (e.g. Combobox's `type: 'custom'` action rows, whose
 *     `condition` callback must be authoritative even before the user
 *     types). Default: include every item.
 *   - On the typing path, items must pass BOTH `alwaysMatch` AND `matches`.
 *   - `filterable: false` switches the `matches` filter off entirely, for
 *     pickers whose options come from a server search — the backend already
 *     decided what matches, and a second literal substring pass on the
 *     client silently drops fuzzy, ranked, or id-based results.
 *     `alwaysMatch` still runs: it carries consumer-declared visibility
 *     (Combobox's custom-row `condition`), which is not client filtering.
 *
 * The `matches` predicate is supplied by each consumer — MultiSelect uses
 * a plain label/value substring match; Combobox uses it for selectable
 * rows only and defers custom rows to `alwaysMatch`.
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
  alwaysMatch?: (item: TItem) => boolean
  /** Client-side query filtering. Defaults to `true`. */
  filterable?: MaybeRefOrGetter<boolean>
}): ComputedRef<TGroup[]> {
  return computed(() => {
    const alwaysMatch = source.alwaysMatch ?? (() => true)
    const filterable = toValue(source.filterable) ?? true
    const filterByTypedQuery =
      filterable && source.open.value && source.hasTypedSinceOpen.value

    return source.groups.value
      .map((group) => ({
        ...group,
        options: group.options.filter((item) => {
          if (!alwaysMatch(item)) return false
          if (!filterByTypedQuery) return true
          return source.matches(item, source.query.value)
        }),
      }))
      .filter((group) => group.options.length > 0) as TGroup[]
  })
}
