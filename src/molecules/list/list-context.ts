import { inject, provide, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { ListDivider } from './types'

// Everything a List provides to its descendants. Internal — the public
// contract is the components' props/models and the CSS hooks
// (`--list-columns`, `--list-gap`, data-slot/data-state attributes).
export interface ListContext {
  divider: ComputedRef<ListDivider>
  selectable: ComputedRef<boolean>
  rowHeight: ComputedRef<number | undefined>

  // Header presence drives ARIA roles: list/listitem without a header,
  // table/row/columnheader/cell with one.
  hasHeader: Ref<boolean>

  isSelected: (value: string) => boolean
  toggleSelection: (value: string) => void

  // Header select-all. <ListRows> feeds the full selectable universe via
  // `setAllValues` — it holds the complete `items` array even when the rows are
  // virtualized, so the header checkbox can reflect/toggle "all" without every
  // row being mounted. `selectAllState` drives the header checkbox's
  // checked/indeterminate/empty rendering.
  setAllValues: (values: string[]) => void
  selectAllState: ComputedRef<'none' | 'some' | 'all'>
  toggleSelectAll: () => void

  // Single "active" row (v-model:active) — the one currently open/highlighted,
  // separate from the checkbox `selection` set. `activatable` is true only when
  // the List actually binds v-model:active, so plain navigation lists opt out.
  activatable: ComputedRef<boolean>
  isActive: (value: string) => boolean
  activate: (value: string) => void
}

const listContextKey: InjectionKey<ListContext> = Symbol('frappe-ui:list')

export function provideListContext(context: ListContext) {
  provide(listContextKey, context)
}

export function useListContext() {
  return inject(listContextKey, null)
}
