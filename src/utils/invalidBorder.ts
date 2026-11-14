/**
 * An input with an `error` gets a red border. The gray border colors are
 * swapped out, not layered under the red: two border-color utilities on one
 * element resolve by stylesheet order, not class order, so the gray hover and
 * focus colors could win. Swapping keeps the field red at rest, on hover and
 * on focus.
 *
 * Only the border color changes. A borderless variant (`border-0`, or a
 * transparent border like `ghost`) stays borderless.
 */

// A border-color utility, with or without variants: `border-outline-gray-2`,
// `hover:border-outline-elevation-2`, `border-[--surface-gray-2]`.
const BORDER_COLOR =
  /^(?:[a-z-]+:)*border-(?:\[--[^\]]+\]|outline-[a-z0-9-]+|transparent)$/

export const INVALID_BORDER_CLASSES = [
  'border-outline-red-4',
  'hover:border-outline-red-5',
  'focus:border-outline-red-5',
  'focus-within:border-outline-red-5',
]

export function withInvalidBorder(classes: string, invalid: boolean): string {
  if (!invalid) return classes
  const tokens = classes.split(/\s+/).filter(Boolean)
  const borderless =
    tokens.includes('border-0') || tokens.includes('border-transparent')
  if (borderless || !tokens.includes('border')) return classes
  return [
    ...tokens.filter((token) => !BORDER_COLOR.test(token)),
    ...INVALID_BORDER_CLASSES,
  ].join(' ')
}
