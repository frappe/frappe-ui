export interface PopoverProps {
  show?: boolean
  trigger?: 'click' | 'hover'
  hoverDelay?: number
  leaveDelay?: number
  placement?:
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
  popoverClass?: string | object | Array<string | object>
  transition?: 'default' | null
  hideOnBlur?: boolean
}

export interface PopoverEmits {
  (event: 'open'): void
  (event: 'close'): void
  (event: 'update:show', value: boolean): void
}
