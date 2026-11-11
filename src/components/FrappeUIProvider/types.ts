import type { ToasterProps } from 'vue-sonner'

export interface FrappeUIProviderProps {
  /** Distance of the toast stack from the screen edge. */
  offset?: ToasterProps['offset']
  /** Same as `offset`, but applied on mobile viewports. */
  mobileOffset?: ToasterProps['mobileOffset']
}
