import { type Component, type ExtractPublicPropTypes, type PropType } from 'vue'
import type { ButtonProps } from '../Button'

/** Color themes for the alert's status icon and row action label. */
export type AlertTheme = 'gray' | 'blue' | 'green' | 'amber' | 'red'

/** Computed layout of the alert, stamped on the root as `data-layout`. */
export type AlertLayout = 'row' | 'banner'

/** Context passed to an alert action's `onClick` handler. */
export type AlertActionContext = {
  /** Emits the alert's `dismiss` event. The parent owns hiding the alert. */
  dismiss: () => void
}

/** Button config for `primaryAction`/`secondaryAction`: `ButtonProps` plus a context-aware `onClick`. */
export type AlertAction = ButtonProps & {
  /** Called on click with `{ dismiss }` to dismiss the alert from the handler. */
  onClick?: (context: AlertActionContext) => void | Promise<void>
}

/**
 * Runtime prop definitions — the single source of truth for the alert's props.
 * `Alert.vue` passes these to `defineProps`, and the public `AlertProps` type
 * is derived from them, so the runtime and the type can never drift apart.
 */
export const alertProps = {
  /** Main heading text of the alert */
  title: { type: String, required: true as const },
  /** Supporting text below the title; its presence switches the alert to the banner layout */
  description: { type: String, default: undefined },
  /** Color theme of the status icon and the row action label; the container never changes with theme */
  theme: { type: String as PropType<AlertTheme>, default: 'gray' },
  /** Status icon: unset shows the theme's auto icon (none for gray), `true` forces it, `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */
  icon: {
    type: [Boolean, String, Object, Function] as PropType<
      boolean | string | Component
    >,
    default: undefined,
  },
  /** Primary action button (`ButtonProps` plus `onClick({ dismiss })`) */
  primaryAction: {
    type: Object as PropType<AlertAction>,
    default: undefined,
  },
  /** Second action button; its presence forces the banner layout */
  secondaryAction: {
    type: Object as PropType<AlertAction>,
    default: undefined,
  },
  /** Shows the dismiss (×) button, which emits `dismiss` */
  dismissible: { type: Boolean, default: false },
}

/** Public prop types for `<Alert>`. Derived from {@link alertProps}. */
export type AlertProps = ExtractPublicPropTypes<typeof alertProps>
