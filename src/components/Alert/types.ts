import { type Component, type ExtractPublicPropTypes, type PropType } from 'vue'
import type { ButtonProps } from '../Button'

/** Color themes for the alert's status icon and row action label. */
export type AlertTheme = 'gray' | 'blue' | 'green' | 'amber' | 'red'

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
 *
 * There is no layout prop. The computed layout is stamped on the root as
 * `data-layout` — `"row"` when there is no description and no secondary
 * action, `"banner"` otherwise.
 */
export const alertProps = {
  /** Main heading text of the alert. Optional when the `#title` slot is used */
  title: { type: String, default: undefined },
  /** Supporting text below the title; its presence switches the alert to the banner layout */
  description: { type: String, default: undefined },
  /** Color theme of the status icon and the row action label; the container never changes with theme */
  theme: { type: String as PropType<AlertTheme>, default: 'gray' },
  /** Status icon: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */
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

export interface AlertEmits {
  /** Fired when the user dismisses the alert — the × button or an action's `context.dismiss()`. The parent owns hiding. */
  dismiss: []
}

/** Scoped payload for the `#actions` slot. */
export interface AlertActionsSlotProps {
  /** Emits the alert's `dismiss` event. */
  dismiss: () => void
}

export interface AlertSlots {
  /** Overrides the status icon area */
  prefix?: () => any

  /** Rich title content (overrides the `title` prop) */
  title?: () => any

  /** Rich description content; its presence forces the banner layout */
  description?: () => any

  /** Replaces the auto-rendered action buttons; receives `{ dismiss }` */
  actions?: (props: AlertActionsSlotProps) => any
}
