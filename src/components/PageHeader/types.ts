import type { RouteLocationRaw } from 'vue-router'

export interface PageHeaderMobileProps {
  /** Title shown centered in the header. Overridden by the default slot. */
  title?: string
}

export interface PageHeaderMobileTitleProps {
  /** Title text. Overridden by the default slot. */
  title?: string
}

export interface PageHeaderBackButtonProps {
  /** Where to navigate on tap. Omit to fall back to browser history. */
  to?: RouteLocationRaw

  /** Accessible label for the button. */
  label?: string
}
