export interface TagProps {
  /** Visual color theme of the tag */
  theme?: 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet'

  /** Controls the size of the tag */
  size?: 'sm' | 'md' | 'lg'

  /** Visual style of the tag */
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'

  /** Content displayed inside the tag */
  label?: string | number

  /** Shows the × after the label. Clicking it, or pressing Delete or Backspace while the tag has focus, emits `dismiss` */
  dismissible?: boolean

  /** Dims the tag and ignores clicks, hover and `dismiss` */
  disabled?: boolean
}

export interface TagEmits {
  /** Fired when the user dismisses the tag — a click on the ×, or Delete or Backspace while it has focus. The parent owns removing it. */
  dismiss: []
}

export interface TagSlots {
  /** Content shown before the tag label */
  prefix?: () => any

  /** Main tag content (overrides `label` prop) */
  default?: () => any

  /** Content shown after the tag label, before the × */
  suffix?: () => any
}
