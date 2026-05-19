export interface LinkProps {
  doctype: string
  filters?: Record<string, any> | Array<any> | string
  allowCreate?: boolean
  allowClear?: boolean
  allowRedirect?: boolean
  disabled?: boolean
}

export type LinkOption = {
  label: string
  value: string
  description?: string
}
