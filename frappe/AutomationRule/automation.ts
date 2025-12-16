import { inject } from 'vue'
import { AutomationState, AutomationStateSymbol } from './types'

export function useAutomationState(): AutomationState {
  // this is done to ensure the state is always provided,
  // inject by definition says the injected key could be undefined
  const state = inject(AutomationStateSymbol)
  if (!state) {
    throw new Error('AutomationState must be provided')
  }
  return state
}

export function useFilterConditions(doctype: string, state: any[]) {
  // dummyObj
  // addRow
  // deleteRow
  // getFields
  // getField
}
