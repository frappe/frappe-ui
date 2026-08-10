import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { TabsSide, TabsSize, TabsVariant, TabValue } from './types'

/**
 * Internal wiring between the composed Tabs parts. Not public API — apps
 * interact through props and slots only.
 */
export interface TabTriggerRegistration {
  value: () => TabValue
  disabled: () => boolean
  /** Root element, for document-order sorting of "first visible". */
  el: Ref<HTMLElement | null>
  hasRoute: () => boolean
  routeActive?: Ref<boolean>
  routeExactActive?: Ref<boolean>
}

export interface TabsRootContext {
  selected: ComputedRef<TabValue | undefined>
  /** Selection follows the router rather than the model. */
  routeMode: ComputedRef<boolean>
  orientation: ComputedRef<'horizontal' | 'vertical'>
  /** Returns an unregister function. */
  register: (trigger: TabTriggerRegistration) => () => void
}

export interface TabListContext {
  variant: ComputedRef<TabsVariant>
  size: ComputedRef<TabsSize>
  side: ComputedRef<TabsSide>
}

export const tabsRootKey: InjectionKey<TabsRootContext> = Symbol(
  'frappe-ui-tabs-root',
)

export const tabListKey: InjectionKey<TabListContext> = Symbol(
  'frappe-ui-tab-list',
)
