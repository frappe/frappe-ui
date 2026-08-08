import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { FrappeUIError } from '../../composables/useInputLabeling'

export interface CountryCode {
  code: string
  name: string
  dialCode: string
  flag?: string
}

export interface PhoneInputProps {
  /** The full phone number value formatted as `[dialCode]-[number]` or raw number string */
  modelValue?: string

  /** Form field label */
  label?: string

  /** Helper description text displayed below field */
  description?: string

  /** Error message or FrappeUIError object */
  error?: string | FrappeUIError

  /** Indicates whether the field is required */
  required?: boolean

  /** Disables user input */
  disabled?: boolean

  /** Shows loading state on component */
  loading?: boolean

  /** Field size variant */
  size?: InputSize

  /** Field visual style variant */
  variant?: InputVariant

  /** Default ISO 2-letter country code or country name (e.g. 'IN', 'US', 'India') */
  default_country?: string

  /** Custom placeholder text for phone input */
  placeholder?: string

  /** Minimum allowed length for the input number */
  minlength?: number | string

  /** Maximum allowed length for the input number */
  maxlength?: number | string

  /** Custom list of countries to select from */
  countries?: CountryCode[]

  /** Custom async or sync fetcher function to retrieve country list */
  fetchCountries?: () => Promise<CountryCode[]> | CountryCode[]
}

export interface PhoneInputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'country-change', country: CountryCode): void
}
