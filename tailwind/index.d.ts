import type { Config } from 'tailwindcss'

/**
 * The frappe-ui Tailwind preset. Put it in your config's `presets` array.
 *
 * It REPLACES Tailwind's `colors`, `fontSize`, `screens`, `borderRadius`, and
 * `boxShadow` sections, so stock classes from those five (`2xl:`,
 * `shadow-inner`, `text-base` at Tailwind's own value) are not generated.
 */
declare const preset: Config
export default preset

/**
 * Source globs that emit Tailwind classes inside frappe-ui. Tailwind v3 does
 * not merge a preset's `content`, so spread these into your own `content`.
 */
export declare const content: string[]

/**
 * The design tokens, as data — framework-neutral values with no Tailwind
 * sentinels in them. Read these when you need a token outside a Tailwind
 * class: a style picker, exported markup, a canvas renderer, codegen.
 *
 * This entry point pulls no Vue, so a Node script can import tokens without
 * the component tree. Per ADR-0010 the surface is additive-only until 2.0.0.
 */
export {
  colors,
  cssVariables,
  fontFamily,
  fontSize,
  fontWeight,
  radius,
  screens,
  semanticColors,
  shadows,
  spacing,
  textTransform,
  tracking,
} from './tokens.js'
export type { TextStyle, VariableMap } from './tokens.js'
