import { InjectionKey } from 'vue'

export interface AutomationState {
  enabled: boolean
  dt: string
  eventType: 'created' | 'updated' | 'time'
  selectedTimerOption: number
  presets: string
  presetsJson: any[]
  rule: string
}

export const AutomationStateSymbol: InjectionKey<AutomationState> =
  Symbol('AutomationState')
