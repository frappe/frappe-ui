interface DividerAction {
  label: string
  onClick?: () => any
  /** @deprecated Use onClick instead. */
  handler?: () => any
  loading?: boolean
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  position?: 'start' | 'center' | 'end'
  flexItem?: boolean
  action?: DividerAction
}
