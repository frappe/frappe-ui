import type { InputLabelingProps } from '../../src/composables/useInputLabeling'

export interface LinkProps extends InputLabelingProps {
  doctype: string
  filters?: Record<string, unknown> | Array<unknown> | string
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
