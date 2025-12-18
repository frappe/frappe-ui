import { InjectionKey } from 'vue'

export type IconType =
  | ''
  | 'scope'
  | 'timer'
  | 'event'
  | 'condition'
  | 'action'
  | 'notification'
  | 'filter'

export type RoundedType = 'all' | 'top' | 'bottom' | 'none'

export interface AutomationState {
  enabled: boolean
  dt: string
  eventType: 'created' | 'updated' | 'time'
  selectedTimerOption: number
  presets: string
  presetsJson: any[]
  rule: any[]
}

export const AutomationStateSymbol: InjectionKey<AutomationState> =
  Symbol('AutomationState')
