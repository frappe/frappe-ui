import { SimpleOption } from "../Combobox/types"

export interface TagInputProps {
  options: Array<SimpleOption>
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
}