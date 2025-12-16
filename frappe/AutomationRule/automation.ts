import { inject } from 'vue'
import { AutomationState, AutomationStateSymbol } from './types'

export function useAutomationState(): AutomationState {
  const state = inject(AutomationStateSymbol)
  if (!state) {
    throw new Error('AutomationState must be provided')
  }
  return state
}
