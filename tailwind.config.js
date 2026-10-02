import preset from './tailwind/preset'
import typography from './tailwind/tokens/typography.js'

// The Typography docs page applies `text-<size>-<weight>` / `text-p-<size>-<weight>`
// (and the bare regular `text-<size>`) via a computed class from its weight
// switcher, so the JIT scanner never sees the literal names. Build the exact
// set the plugin emits (WEIGHT_VARIANTS, only pairings present in the tracking
// export) and safelist it. Mirrors buildTextStyleUtilities() in plugin.js.
const WEIGHT_VARIANTS = ['medium', 'semibold', 'bold']
const typeSafelist = []
for (const [group, prefix] of [
  ['text', 'text-'],
  ['paragraph', 'text-p-'],
]) {
  const tracking = typography.tracking[group] || {}
  for (const [size, byWeight] of Object.entries(tracking)) {
    typeSafelist.push(`${prefix}${size}`)
    for (const weight of WEIGHT_VARIANTS) {
      if (weight in byWeight) typeSafelist.push(`${prefix}${size}-${weight}`)
    }
  }
}

export default {
  presets: [preset],
  // `prose-v3` is applied via a computed string in EditorContent, so the JIT can
  // drop it (HMR rebuilds, content-scan gaps). Safelist lives here in the watched
  // config — Vite reprocesses Tailwind on this file's changes, but not on changes
  // to transitively-imported files like the preset.
  safelist: ['prose', 'prose-v3', ...typeSafelist],
  content: [
    './index.html',
    './App.vue',
    './playground/**/*.{vue,js,ts}',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './experimental/**/*.{vue,js,ts,jsx,tsx}',
    './docs/**/*.{vue,js,ts,md}',
    './docs/.vitepress/**/*.{vue,js,ts,css}',
    // Build artifacts, not sources. Without these negations the two globs
    // above sweep in ~900 files / 90MB of prebundled deps and built output,
    // which Tailwind re-reads on every CSS rebuild — and `cache/deps_temp_*`
    // is renamed mid-optimize, so PostCSS intermittently dies with ENOENT.
    '!./docs/.vitepress/cache/**',
    '!./docs/.vitepress/dist/**',
    // Reusable VitePress theme (Layout/Navbar/Sidebar live here now) — without
    // this, theme-only classes like `lg:grid-cols-[220px_1fr]` aren't emitted
    // and the docs layout collapses.
    './vitepress/**/*.{vue,js,ts,css}',
    './icons/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Espresso 2.0's `shadow/light/xs` (the alert card, 31304:58510):
      // 0 0.5 3 at 6% · 0 0 1 at 27% · an inner white 0 0.25 1.5 at 8%.
      // The library's shadow scale starts at `sm` — its Figma export has
      // no xs step — so the playground carries it here, composed the way
      // tokens.js composes the others (front-to-back, Figma's stack
      // reversed), until the export brings it in.
      boxShadow: {
        xs: 'inset 0px 0.25px 1.5px 0px #ffffff14, 0px 0px 1px 0px #00000045, 0px 0.5px 3px 0px #0000000f',
      },
    },
  },
  plugins: [],
}
