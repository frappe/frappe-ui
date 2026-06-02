import themePlugin from './plugin.js'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lucideIconsPlugin from './lucideIconsPlugin.js'

// NOTE: Tailwind v3 does NOT merge `content` from presets into the resolved
// config (it reads only the top-level config's content.files). So consuming
// apps must list frappe-ui's source globs in their own tailwind.config
// `content` — declaring them here would be silently ignored.
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  // The editor applies `prose prose-v3` via a computed string in EditorContent,
  // which the JIT scanner can miss (HMR rebuilds, or a consumer that didn't add
  // the molecules glob to `content`) — then prose-v3 typography silently drops.
  // Safelisting keeps the prose component rules emitted regardless of scanning.
  safelist: ['prose', 'prose-v3'],
  plugins: [forms, typography, themePlugin, lucideIconsPlugin],
}
