import { type RouterLinkProps } from 'vue-router'
import { type Component, type ExtractPublicPropTypes, type PropType } from 'vue'

export type Theme = 'gray' | 'blue' | 'green' | 'red'
export type Size = 'xs' | 'sm' | 'md' | 'lg'
export type Variant = 'solid' | 'subtle' | 'outline' | 'ghost'

const iconProp = {
  type: [String, Object, Function] as PropType<string | Component>,
  default: undefined,
}

/**
 * Runtime prop definitions — the single source of truth for the button's props.
 * `Button.vue` spreads these into `defineComponent`, and the public `ButtonProps`
 * type is derived from them, so the runtime and the type can never drift apart.
 */
export const buttonProps = {
  /** Visual color theme of the button */
  theme: { type: String as PropType<Theme>, default: 'gray' },
  /** Controls the button size */
  size: { type: String as PropType<Size>, default: 'sm' },
  /** Visual style of the button */
  variant: { type: String as PropType<Variant>, default: 'subtle' },
  /** Text label displayed inside the button */
  label: { type: String, default: undefined },
  /** Icon shown when no left or right icon is specified */
  icon: iconProp,
  /** Icon shown before the label */
  iconLeft: iconProp,
  /** Icon shown after the label */
  iconRight: iconProp,
  /** Tooltip text shown on hover */
  tooltip: { type: String, default: undefined },
  /** Shows a loading state and disables interaction */
  loading: { type: Boolean, default: false },
  /** Text shown while the button is loading */
  loadingText: { type: String, default: undefined },
  /** Disables the button */
  disabled: { type: Boolean, default: false },
  /** Router destination when used as a link */
  route: {
    type: [String, Object] as PropType<RouterLinkProps['to']>,
    default: undefined,
  },
  /** External link URL */
  link: { type: String, default: undefined },
  /** Native button type */
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
}

/** Public prop types for `<Button>`. Derived from {@link buttonProps}. */
export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>

/** Combined theme and variant key */
export type ThemeVariant = `${Theme}-${Variant}`
