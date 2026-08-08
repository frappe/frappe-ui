const iconProp = {
    type: [String, Object, Function],
    default: undefined,
};
/**
 * Runtime prop definitions — the single source of truth for the button's props.
 * `Button.vue` spreads these into `defineComponent`, and the public `ButtonProps`
 * type is derived from them, so the runtime and the type can never drift apart.
 */
export const buttonProps = {
    /** Visual color theme of the button */
    theme: { type: String, default: 'gray' },
    /** Controls the button size */
    size: { type: String, default: 'sm' },
    /** Visual style of the button */
    variant: { type: String, default: 'subtle' },
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
        type: [String, Object],
        default: undefined,
    },
    /** External link URL */
    link: { type: String, default: undefined },
    /** Native button type */
    type: {
        type: String,
        default: 'button',
    },
};
