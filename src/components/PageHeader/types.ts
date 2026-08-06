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
  /**
   * Fallback destination, used only when there is no in-app history to go back to
   * (a cold load onto a deep link). Taps otherwise go back through history.
   */
  to?: RouteLocationRaw

  /** Accessible label for the button. */
  label?: string
}
