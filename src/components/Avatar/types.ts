export interface AvatarProps {
  /** Image URL used for the avatar */
  image?: string

  /** Fallback text shown when the image is missing */
  label?: string

  /** Controls the overall size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

  /** Defines the avatar shape */
  shape?: 'circle' | 'square'
}
