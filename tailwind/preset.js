import themePlugin from './plugin.js'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lucideIconsPlugin from './lucideIconsPlugin.js'
import { spacing } from './tokens.js'

// NOTE: Tailwind v3 does NOT merge `content` from presets into the resolved
// config (it reads only the top-level config's content.files). So consuming
// apps must list frappe-ui's source globs in their own tailwind.config
// `content` — declaring them here would be silently ignored. Spread the
// `content` export from `frappe-ui/tailwind` (see content.js) instead of
// hand-maintaining the glob list; see docs/content/docs/getting-started/tailwind.md.

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
    // Presets DO merge `theme` (unlike `content`), so the spacing scale
    // declared in tokens.js reaches consuming apps from here.
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
