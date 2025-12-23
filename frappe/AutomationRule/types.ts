import { InjectionKey } from 'vue'

// Re-export Dropdown types
export type {
  DropdownItem,
  DropdownOption,
  DropdownOptions,
} from '../../src/components/Dropdown/types'

export type IconType =
  | ''
  | 'scope'
  | 'timer'
  | 'event'
  | 'condition'
  | 'action'
  | 'notification'
  | 'filter'
  | 'title'
  | 'align'

export type RoundedType = 'all' | 'top' | 'bottom' | 'none'

// Condition types
export type ConditionTuple = [string, string, string]
export type ConditionArray = (ConditionTuple | string)[]

// Action types
export interface SetAction {
  type: 'set'
  field: string
  value: string
}
export interface SendEmailAction {
  type: 'email'
  to: string
  via: 'rich_text' | 'template'
  template?: string
  text?: string
}

// Block types
export interface IfBlockData {
  type: 'if'
  conditions: ConditionArray
  actions: SetAction[] | SendEmailAction[]
}

export interface ElseBlockData {
  type: 'else'
  conditions: string
  actions: SetAction[]
}

export interface AutomationState {
  name: string
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
