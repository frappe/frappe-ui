interface Label {
  toString(): string
}

export interface BadgeProps {
  /** Visual color theme of the badge */
  theme?: 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet'

  /** Controls the size of the badge */
  size?: 'sm' | 'md' | 'lg'

  /** Visual style of the badge */
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'

  /** Content displayed inside the badge */
  label?: Label | string | number
}
