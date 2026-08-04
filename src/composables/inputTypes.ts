/** Size scale for text-style inputs. */
export type InputSize = 'sm' | 'md' | 'lg' | 'xl'

/** Size scale for binary controls (Checkbox, Radio, Switch). */
export type ToggleSize = 'xs' | 'sm' | 'md'

/**
 * Size scale for numeric range controls (Slider). Deliberately narrower than
 * `ToggleSize`: Slider has no `xs` dimensions, so offering the value would
 * type-check and then silently render at `sm`.
 */
export type RangeSize = 'sm' | 'md'

/** Variant scale for text-style inputs that have a container surface. */
export type InputVariant = 'subtle' | 'outline' | 'ghost'
