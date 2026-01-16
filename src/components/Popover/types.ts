export interface PopoverProps {
  /** Controls visibility of the popover */
  show?: boolean

  /** Event that triggers the popover */
  trigger?: 'click' | 'hover'

  /** Delay in ms before showing popover on hover */
  hoverDelay?: number

  /** Delay in ms before hiding popover on hover leave */
  leaveDelay?: number

  /** Placement of the popover relative to the target */
  placement?:
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
    | 'top'
    | 'bottom'
    | 'right'
    | 'left'
  popoverClass?: string | object | Array<string | object>

  /** Transition style to use */
  transition?: 'default' | null

  /** Whether to hide the popover when clicking outside */
  hideOnBlur?: boolean

  /** Whether the popover width should match the target element */
  matchTargetWidth?: boolean
  offset?: number
}

export interface PopoverEmits {
  /** Fired when the popover is opened */
  (event: 'open'): void

  /** Fired when the popover is closed */
  (event: 'close'): void

  /** Fired when the show state changes (v-model) */
  (event: 'update:show', value: boolean): void
}
