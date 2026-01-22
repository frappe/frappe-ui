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
  subject?: string
  message?: string
  template?: string
  doctype?: string
  create_communication: boolean
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
  eventType:
    | 'created'
    | 'updated'
    | 'Minutes After'
    | 'Minutes Before'
    | 'Days After'
    | 'Days Before'
    | 'Scheduled'
  timerOffset?: number
  timeField?: string
  eventFrequency?:
    | 'Every 5 Minutes'
    | 'Every 15 Minutes'
    | 'Every 30 Minutes'
    | 'Every Hour'
    | 'Every 6 Hours'
    | 'Every 12 Hours'
    | 'Every Day'
    | 'CRON Expression'
  cronFormat?: string
  presets: any[]
  rule: any[]
}

export const AutomationStateSymbol: InjectionKey<AutomationState> =
  Symbol('AutomationState')
