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
}

const listContextKey: InjectionKey<ListContext> = Symbol('frappe-ui:list')

export function provideListContext(context: ListContext) {
  provide(listContextKey, context)
}

export function useListContext() {
  return inject(listContextKey, null)
}
