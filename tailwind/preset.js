import themePlugin from './plugin.js'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lucideIconsPlugin from './lucideIconsPlugin.js'

// NOTE: Tailwind v3 does NOT merge `content` from presets into the resolved
// config (it reads only the top-level config's content.files). So consuming
// apps must list frappe-ui's source globs in their own tailwind.config
// `content` — declaring them here would be silently ignored. Spread the
// `content` export from `frappe-ui/tailwind` (see content.js) instead of
// hand-maintaining the glob list; see docs/content/docs/foundations/tailwind.md.
// Stock Tailwind's numeric spacing scale has gaps above 12 (13, 15, 17, 18,
// 19, 21… are undefined), so `h-17` / `size-17` silently don't compile. Fill
// every integer 1–128 plus every half step 0.5–19.5, all at the canonical
// 0.25rem step. Values match Tailwind's own formula, so overriding the
// already-defined keys is a no-op; the win is the in-between steps. Presets DO
// merge `theme` (unlike `content`), so this reaches consuming apps
// automatically.
//
// This is the ONE place sizing is declared. Tailwind 3.4 reads `theme('spacing')`
// for width, height, size, minWidth, maxWidth, minHeight and maxHeight, which
// is why the peer range starts at 3.4 and why the plugin declares no sizing
// blocks of its own.
const spacing = Object.fromEntries(
  [
    ...Array.from({ length: 20 }, (_, i) => i + 0.5),
    ...Array.from({ length: 128 }, (_, i) => i + 1),
  ]
    .sort((a, b) => a - b)
    .map((n) => [n, `${n * 0.25}rem`]),
)

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  // `hover:` compiles under `@media (hover: hover) and (pointer: fine)`, so a
  // hover style is only ever worn by a device that can point at something. A phone has no
  // pointer to take away: it applies :hover on tap and keeps it there until the
  // next tap lands elsewhere, so every ghost button a thumb touched stayed
  // filled behind it. A laptop with a touchscreen answers (hover: hover) and
  // keeps both.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      spacing,
    },
  },
  // The editor applies `prose prose-v3` via a computed string in EditorContent,
  // which the JIT scanner can miss (HMR rebuilds, or a consumer that didn't add
  // the molecules glob to `content`) — then prose-v3 typography silently drops.
  // Safelisting keeps the prose component rules emitted regardless of scanning.
  safelist: ['prose', 'prose-v3'],
  plugins: [forms, typography, themePlugin, lucideIconsPlugin],
}
