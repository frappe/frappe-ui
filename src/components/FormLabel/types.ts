export interface FormLabelProps {
  /** Text content of the label. */
  label: string

  /** Size of the label text. */
  size?: 'sm' | 'md'

  /** id of the form control this label is for; wired to the `for` attribute. */
  id?: string

  /** Marks the field as required; renders an asterisk and an accessible "(required)" note. */
  required?: boolean
}
