type OptionValue = string | number | boolean

export type Option = {
  label: string
  value: OptionValue
  description?: string
  [key: string]: any
}

export type AutocompleteOption = OptionValue | Option

export type AutocompleteOptionGroup = {
  group: string
  items: AutocompleteOption[]
  hideLabel?: boolean
}

type AutocompleteOptions = AutocompleteOption[] | AutocompleteOptionGroup[]

export type AutocompleteProps = {
  label?: string
  options: AutocompleteOptions
  hideSearch?: boolean
  placeholder?: string
  bodyClasses?: string | string[]
  loading?: boolean
  placement?: string
  showFooter?: boolean
} & (
  | {
      multiple: true
      modelValue?: AutocompleteOption[] | null
    }
  | {
      multiple?: false
      modelValue?: AutocompleteOption | null
    }
)