/**
 * Size scale for text-style inputs.
 *
 * The four values map to fixed single-line control heights:
 * `xs` 24px, `sm` 28px, `md` 32px, `lg` 40px. Every renderer that accepts an
 * `InputSize` implements all four; a value outside the union resolves to the
 * component's own default through `resolvePropValue` rather than dropping the
 * geometry classes.
 *
 * `xl` was removed in 1.0.0. It was never a bigger box — it rendered `lg`'s
 * 40px height with an 18px font — so it added a fifth row to six class maps
 * without adding a size. See `docs/content/docs/migration.md#input-sizes`.
 */
export type InputSize = 'xs' | 'sm' | 'md' | 'lg'

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
