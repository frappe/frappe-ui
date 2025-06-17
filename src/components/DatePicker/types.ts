export interface DatePickerProps {
  value?: string | string[] // format: "YYYY-MM-DD,YYYY-MM-DD" or ["YYYY-MM-DD","YYYY-MM-DD"]
  modelValue?: string | string[] // format: "YYYY-MM-DD,YYYY-MM-DD" or ["YYYY-MM-DD","YYYY-MM-DD"]
  placeholder?: string
  formatter?: (date: string) => string
  readonly?: boolean
  inputClass?: string | Array<string> | Record<string, boolean>
  placement?: string
}

export type DatePickerEmits = {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}
