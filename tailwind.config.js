import preset from './tailwind/preset'

export default {
  presets: [preset],
  // `prose-v3` is applied via a computed string in EditorContent, so the JIT can
  // drop it (HMR rebuilds, content-scan gaps). Safelist lives here in the watched
  // config — Vite reprocesses Tailwind on this file's changes, but not on changes
  // to transitively-imported files like the preset.
  safelist: ['prose', 'prose-v3'],
  content: [
    './index.html',
    './App.vue',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './docs/**/*.{vue,js,ts,md}',
    './docs/.vitepress/**/*.{vue,js,ts,css}',
    './frappe/**/*.{vue,js,ts,jsx,tsx}',
    './icons/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
