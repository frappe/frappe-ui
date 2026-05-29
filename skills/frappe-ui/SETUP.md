# Project setup

Bootstrapping a fresh Vite + Vue 3 project with frappe-ui has several pitfalls — they all stem from frappe-ui shipping unbuilt source, exposing only a few package `exports` subpaths, and pulling in CJS / virtual-icon imports that Vite must be told how to handle. Follow this checklist to avoid running into them.

## Versions matter — pin them

`npm create vite@latest` currently scaffolds Vite 8 + Tailwind v4. **Both are incompatible with frappe-ui 0.1.x.** After scaffolding, immediately uninstall the defaults and pin to versions frappe-ui expects:

```bash
npm uninstall tailwindcss @tailwindcss/vite vite @vitejs/plugin-vue
npm install -D \
  tailwindcss@^3.4 postcss autoprefixer \
  vite@^5 @vitejs/plugin-vue@^5 \
  vue-router@^4 \
  unplugin-auto-import unplugin-vue-components unplugin-icons \
  lucide-static @iconify/json
npm install frappe-ui@beta
```

- **Tailwind must be v3.** frappe-ui's preset is a Tailwind v3 config (`darkMode`, `plugins`, `content`). Tailwind v4 ignores that shape entirely and the design tokens silently won't load.
- **Vite 5 (not 6/7/8).** frappe-ui's vite plugin is built against Vite 5's plugin API.
- **`vue-router` is effectively required.** `<Button>` from frappe-ui injects `Symbol(router)`. Without a router instance, every Button logs `[Vue warn]: injection "Symbol(router)" not found.` Install it even if your prototype has only one screen.
- **`unplugin-icons` + iconify data + lucide-static.** Required for resolving the `~icons/lucide/*` virtual imports that frappe-ui components do internally.

## Use the package `exports` subpaths

frappe-ui's `package.json` exposes only a handful of subpaths. The two most common mistakes:

| Mistake | Use this instead |
|---|---|
| `import frappeUIPreset from 'frappe-ui/tailwind/preset'` | `import frappeUIPreset from 'frappe-ui/tailwind'` |
| `@import 'frappe-ui/src/style.css'` | `@import 'frappe-ui/style.css'` |

Anything not in the `exports` map (like `frappe-ui/src/*`) will fail with `Package subpath '…' is not defined by "exports"`.

## `vite.config.js`

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui({
      // For non-Frappe prototypes, opt out of the Frappe-specific plugins:
      frappeProxy: false,
      jinjaBootData: false,
      buildConfig: false,
    }),
    vue(),
  ],
  optimizeDeps: {
    // frappe-ui ships unbuilt source with `~icons/lucide/*` virtual imports
    // that esbuild's prebundler cannot resolve. Skip prebundling for it; the
    // frappeui vite plugin handles the icon resolution at request time.
    exclude: ['frappe-ui'],
    // After excluding frappe-ui, its transitive CJS deps still need to be
    // converted to ESM for the browser — list them explicitly so Vite
    // prebundles them.
    include: [
      'feather-icons',
      'tippy.js',
      'showdown',
      'engine.io-client',
      'socket.io-client',
      'debug',
    ],
  },
})
```

The `frappeui()` plugin's defaults (`frappeProxy`, `jinjaBootData`, `buildConfig`, `siteBanner`) all assume you're running inside a Frappe site. Disable them for any prototype that isn't.

## `tailwind.config.js`

```js
import frappeUIPreset from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [frappeUIPreset],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // Include frappe-ui source so Tailwind generates classes for component internals.
    './node_modules/frappe-ui/src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/frappe-ui/frappe/**/*.{vue,js,ts,jsx,tsx}',
  ],
}
```

## `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## CSS entry (`src/style.css`)

```css
@import 'frappe-ui/style.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## App entry (`src/main.js`)

```js
import { createApp } from 'vue'
import { FrappeUI } from 'frappe-ui'
import { router } from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)   // required — frappe-ui's <Button> injects Symbol(router)
app.use(FrappeUI) // installs the plugin (resource provider, etc.)
app.mount('#app')
```

`FrappeUI` (plugin, `app.use`) and `FrappeUIProvider` (component, wraps your template) are two different things — you usually want both. The plugin provides app-level injections; the provider mounts the imperative `dialog.*` / `toast.*` portals.

## App root (`src/App.vue`)

```vue
<script setup>
import { FrappeUIProvider } from 'frappe-ui'
</script>

<template>
  <FrappeUIProvider>
    <router-view />
  </FrappeUIProvider>
</template>
```

## Minimal router stub (`src/router.js`)

Even if your prototype is single-page, install one — it silences Button warnings and lets `Button :route="..."` work later:

```js
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('./pages/HomeScreen.vue') },
  ],
})
```

## Sanity check

After `npm run dev`:

- Page renders the frappe-ui Inter font and semantic surface colors (not raw Tailwind grays).
- DevTools console is empty — no `Package subpath '…' is not defined`, no `Could not resolve '~icons/lucide/…'`, no `does not provide an export named 'default'`, no `injection "Symbol(router)" not found`.
- A `<Button icon-left="lucide-plus" label="New" />` renders a button with an inline lucide plus icon.

If any of the above fails, walk back through this file — every error in the wild from a fresh scaffold has corresponded to one of these checkboxes being skipped.
