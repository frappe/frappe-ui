import type { Component } from 'vue'

export type SelectOptionValue = string | number | bigint | Record<string, any>

export type SelectOption =
  | string
  | {
      label: string
      value: SelectOptionValue
      disabled?: boolean
      icon?: string | Component
      description?: string
      slot?: string
      [key: string]: any
    }

export type SelectNormalizedOption = Exclude<SelectOption, string>

export interface SelectProps {
  /** Size of the select input. */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Visual style of the select input. */
  variant?: 'subtle' | 'outline' | 'ghost'

  /** Placeholder text displayed when no option is selected. */
  placeholder?: string

  /** If true, disables the select input. */
  disabled?: boolean

  /** Optional HTML id for the select element. */
  id?: string

  /** The currently selected value. */
  modelValue?: SelectOptionValue

  /** Controls the visibility of the select menu. */
  open?: boolean

  /** Options to display in the dropdown. */
  options?: SelectOption[]

  /** Fallback empty-state copy rendered when no options are available. */
  emptyText?: string
}

export interface SelectTriggerSlotProps {
  /** Whether the select menu is currently open. */
  open: boolean

  /** Whether the trigger is disabled. */
  disabled: boolean

  /** Currently selected option, if any. */
  selectedOption: SelectNormalizedOption | null

  /** Plain-text label shown in the trigger. */
  displayValue: string
}

export interface SelectItemSlotProps {
  /** Option currently being rendered. */
  option: SelectNormalizedOption
}

export interface SelectSlots {
  /** Fully custom trigger renderer. */
  trigger?: (props: SelectTriggerSlotProps) => any

  /** Content rendered before the trigger value. */
  prefix?: () => any

  /** Content rendered after the trigger value. */
  suffix?: () => any

  /**
   * Shared renderer for option labels.
   * @deprecated use `#item-label` for per-row label customization. `#option` remains as a back-compat alias through v1.x.
   */
  option?: (props: SelectItemSlotProps) => any

  /** Content rendered before the standard option label. */
  'item-prefix'?: (props: SelectItemSlotProps) => any

  /** Content rendered for the standard option label area. */
  'item-label'?: (props: SelectItemSlotProps) => any

  /** Content rendered after the standard option label. */
  'item-suffix'?: (props: SelectItemSlotProps) => any

  /** Fallback content rendered when no options are available. */
  empty?: () => any

  /** Content rendered below the option list. */
  footer?: () => any

  [slotName: string]: ((props: any) => any) | undefined
}

export interface SelectEmits {
  /** Fired when the selected value changes. */
  'update:modelValue': [value: SelectOptionValue | undefined]

  /** Fired when the open state changes. */
  'update:open': [value: boolean]
}

export interface SelectExposed {}
