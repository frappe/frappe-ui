export type LinkProps = {
  doctype: string
  label?: string
  placeholder?: string
  filters?: Array<any> | Record<string, any> | string
  onCreate?: (value: string, close: () => void) => void
  hideMe?: boolean
}

export type LinkOption = {
  label: string
  value: string
  description?: string
}
