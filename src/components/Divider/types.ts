interface DividerAction {
  label: string
  handler: () => any
  loading?: boolean
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  position?: 'start' | 'center' | 'end'
  flexItem?: boolean
  action?: DividerAction
}