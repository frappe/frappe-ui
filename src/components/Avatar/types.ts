export type AvatarTheme =
  | 'gray'
  | 'blue'
  | 'green'
  | 'amber'
  | 'red'
  | 'violet'

export interface AvatarProps {
  /** Image URL used for the avatar */
  image?: string

  /** Fallback text shown when the image is missing */
  label?: string

  /** Controls the overall size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

  /** Defines the avatar shape */
  shape?: 'circle' | 'square'

  /** Visual color theme used for the fallback avatar */
  theme?: AvatarTheme

  /**
   * Hides the avatar from screen readers. Set it when the person's name is
   * already visible next to the avatar, so the name isn't read twice.
   */
  decorative?: boolean
}
