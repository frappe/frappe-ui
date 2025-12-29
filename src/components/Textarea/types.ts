export interface TextareaProps {
  /** Controls the visual size of the textarea */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Visual style variant */
  variant?: 'subtle' | 'outline'

  /** Placeholder text shown when empty */
  placeholder?: string

  /** Disables user interaction */
  disabled?: boolean

  /** HTML id attribute */
  id?: string

  /** Bound value of the textarea */
  modelValue?: string

  /** Debounce delay (ms) before emitting value updates */
  debounce?: number

  /** Number of visible text rows */
  rows?: number

  /** Optional label text */
  label?: string
}
