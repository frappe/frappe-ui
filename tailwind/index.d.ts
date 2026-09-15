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
