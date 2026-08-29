# Project setup

## Versions to pin

`npm create vite@latest` currently scaffolds Tailwind v4, which frappe-ui 1.0.x does not support. After scaffolding, uninstall the Tailwind defaults and pin what frappe-ui expects:

```bash
npm uninstall tailwindcss @tailwindcss/vite
npm install -D tailwindcss@^3.4 postcss autoprefixer vite@^7 @vitejs/plugin-vue@^6
npm install frappe-ui@beta vue-router@^4
```

- **Tailwind v3.** frappe-ui ships a Tailwind v3 preset (`darkMode`, `theme`, `plugins`, `safelist`). Tailwind v4 ignores that shape and the design tokens never load.
- **Vite 7, Node `>=20.19.0`.** frappe-ui builds and tests against `vite@^7.3.2` (`package.json` `engines`, `devDependencies`).
- **`vue-router`.** It is a peer dependency (`vue-router@^4.1.6`). `<Button :route>`, `Breadcrumbs`, `SidebarItem`, `Tabs` and `PageHeaderBackButton` render `RouterLink` or call `useRouter()`, and warn without a router instance.
- `unplugin-icons`, `unplugin-auto-import`, `unplugin-vue-components` and `lucide-static` are already frappe-ui dependencies. frappe-ui's own vite sub-plugin resolves `~icons/lucide/*` from `lucide-static`, so install none of them yourself.

## Import from the package `exports` subpaths

The exported subpaths are `frappe-ui`, `frappe-ui/list`, `frappe-ui/editor`, `frappe-ui/charts`, `frappe-ui/icons`, `frappe-ui/experimental`, `frappe-ui/tailwind`, `frappe-ui/vite`, `frappe-ui/vite/lucideIconsPlugin`, `frappe-ui/vitepress`, `frappe-ui/style.css` and `frappe-ui/tsconfig.base.json`. The two most common mistakes:

| Mistake | Use this instead |
|---|---|
| `import frappeUIPreset from 'frappe-ui/tailwind/preset'` | `import preset from 'frappe-ui/tailwind'` |
| `@import 'frappe-ui/src/style.css'` | `@import 'frappe-ui/style.css'` |

Anything outside the `exports` map (like `frappe-ui/src/*`) fails with `Package subpath '…' is not defined by "exports"`.

## `vite.config.js`

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui({ frontendRoute: '/todo' }),
    vue(),
  ],
})
```

Every `frappeui()` sub-plugin except `frappeTypes` is on by default; pass `false` to turn one off, or an options object to configure it. `frontendRoute` is the route the app is served on. It drives the dev-server site banner and the inferred production `indexHtmlPath`.

`frappeProxy`, `jinjaBootData` and `buildConfig` assume a Frappe site around the app. For a prototype that has no Frappe backend, turn those three off:

```js
frappeui({ frappeProxy: false, jinjaBootData: false, buildConfig: false })
```

Leave `optimizeDeps` alone. The plugin declares its own `optimizeDeps.include` (`highlight.js/lib/core`, `reka-ui`, `vue-sonner`, `dompurify`), and its `barrelImports` sub-plugin expects Vite to pre-bundle an installed frappe-ui as one chunk.

### Prototyping against a non-Frappe backend

`useCall` expects Frappe's response envelope (`{ data: T }`); against a generic REST API `.data` stays `null`. Use `useFetch` from `@vueuse/core` for such prototypes — frappe-ui's fetch layer is built on the same `createFetch`. Moving to a Frappe backend is then `useFetch(url).json()` → `useCall({ url })`.

## `tailwind.config.js`

```js
import preset, { content } from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
```

Spread the exported `content`. Tailwind v3 does not merge a preset's `content` into the app config, so frappe-ui's own source globs have to be listed by the app. A hand-copied `node_modules/frappe-ui/src/**` glob drops `icons/**` and the parked families, and their utility classes then never compile.

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
```

That one file emits `@tailwind base`, `@tailwind components`, `@tailwind utilities` and the Inter font import. Adding the directives again emits every Tailwind layer twice.

## App entry (`src/main.js`)

```js
import { createApp } from 'vue'
import { router } from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

`app.use(FrappeUI)` is optional for a new app: the plugin provides no injections. It installs the v1 resources Options API (`this.$resources`) when called as `app.use(FrappeUI, { resources: true })`, and otherwise only adds dev-mode guards for the removed `$socket` / `$call` / `$resources` globals.

## App root (`src/App.vue`)

`<FrappeUIProvider>` is the one to mount. It renders the `dialog.*` and `toast.*` portals, wraps the app once at the root, and adds no element of its own.

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

Mount exactly one. `<ToastProvider>` has no dedup guard, so a second provider renders every toast twice.

## Router stub (`src/router.js`)

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

- The page renders in the Inter font, on semantic surface colors.
- The DevTools console is empty — no `Package subpath '…' is not defined`, no `Could not resolve '~icons/lucide/…'`, no `injection "Symbol(router)" not found`.
- `<Button icon-left="lucide-plus" label="New" />` renders a button with an inline lucide plus icon.
