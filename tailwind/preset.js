import themePlugin from './plugin.js'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lucideIconsPlugin from './lucideIconsPlugin.js'

// NOTE: Tailwind v3 does NOT merge `content` from presets into the resolved
// config (it reads only the top-level config's content.files). So consuming
// apps must list frappe-ui's source globs in their own tailwind.config
// `content` — declaring them here would be silently ignored.
// Stock Tailwind's numeric spacing scale has gaps above 12 (13, 15, 17, 18,
// 19, 21… are undefined), so `h-17` / `size-17` silently don't compile. Fill
// every integer 1–64 at the canonical 0.25rem step. Values match Tailwind's own
// formula, so overriding the already-defined keys is a no-op; the win is the
// in-between steps. Presets DO merge `theme` (unlike `content`), so this reaches
// consuming apps automatically.
const integerSpacing = Object.fromEntries(
  Array.from({ length: 64 }, (_, i) => i + 1).map((n) => [n, `${n * 0.25}rem`]),
)

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      spacing: integerSpacing,
    },
  },
  // The editor applies `prose prose-v3` via a computed string in EditorContent,
  // which the JIT scanner can miss (HMR rebuilds, or a consumer that didn't add
  // the molecules glob to `content`) — then prose-v3 typography silently drops.
  // Safelisting keeps the prose component rules emitted regardless of scanning.
  safelist: ['prose', 'prose-v3'],
  plugins: [forms, typography, themePlugin, lucideIconsPlugin],
}
