export interface DatePickerProps {
  value?: string
  modelValue?: string
  placeholder?: string
  formatter?: (date: string) => string
  readonly?: boolean
  inputClass?: string | Array<string> | Record<string, boolean>
}

export type DatePickerEmits = {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}
