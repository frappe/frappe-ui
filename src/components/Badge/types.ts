interface Label {
  toString(): string
}

export interface BadgeProps {
  theme?: 'gray' | 'blue' | 'green' | 'orange' | 'red'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'
  label?: Label | string | number
}
