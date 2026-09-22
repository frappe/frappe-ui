# Getting Started

frappe-ui is a Vue 3 component library. It runs in any Vite app, with or without
a Frappe server behind it. This page is the install that both setups share. The
guide for your backend covers the rest:

- [Frappe app](./getting-started/frappe): the frontend for a Frappe app. Dev
  server proxy, CSRF, boot data, the production build and the page that serves
  it.
- [Standalone app](./getting-started/standalone): a plain Vite app. Which
  sub-plugins to turn off, and which parts of the library assume a Frappe
  server.

Requires **Node `>=20.19.0`**, **Vite**, **Vue 3** and **Tailwind CSS
`>=3.4.2 <4`**. `vue`, `vue-router` and `tailwindcss` are peer dependencies;
install them in your app.

## Install

`npm create vite@latest` currently scaffolds Tailwind v4, which frappe-ui does
not support. Replace it:

```sh
npm uninstall tailwindcss @tailwindcss/vite
npm install -D tailwindcss@^3.4 postcss autoprefixer
npm install frappe-ui vue-router
```

Then five files. Every step below is required; skipping the Tailwind `content`
entry is the single most common cause of an app that renders unstyled.

### `tailwind.config.js`

```js
import preset, { content } from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
```

Spread the exported `content`. Tailwind v3 does not merge a preset's `content`
into the app config, so frappe-ui's own source globs have to be listed by the
app or none of its utility classes compile. See
[Tailwind Setup](./getting-started/tailwind) for what the preset replaces.

### `postcss.config.js`

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
```

### `src/style.css`

```css
@import 'frappe-ui/style.css';
```

That one file emits `@tailwind base`, `@tailwind components`,
`@tailwind utilities` and the Inter font import. Adding the directives again
emits every Tailwind layer twice.

### `src/main.ts`

```ts
import { createApp } from 'vue'
import { router } from './router'
import './style.css'
import App from './App.vue'

createApp(App).use(router).mount('#app')
```

`app.use(FrappeUI)` is optional. It installs the Options API resources surface
(`this.$resources`) when called as `app.use(FrappeUI, { resources: true })`, and
otherwise only adds dev-mode guards for the removed globals.

### `src/App.vue`

```vue
<script setup lang="ts">
import { FrappeUIProvider } from 'frappe-ui'
</script>

<template>
  <FrappeUIProvider>
    <RouterView />
  </FrappeUIProvider>
</template>
```

`FrappeUIProvider` renders the `dialog.*` and `toast.*` portals and adds no
element of its own. Mount exactly one.

### Vite config

`vite.config.ts` is the one file that differs between the two setups. The
[Frappe](./getting-started/frappe#vite-config) and
[standalone](./getting-started/standalone#vite-config) guides each give theirs.

## TypeScript

frappe-ui ships a base config. Extend it: it sets `moduleResolution: bundler`
and `allowImportingTsExtensions`, which the package needs to resolve its own
subpaths.

```json
{
  "extends": "frappe-ui/tsconfig.base.json",
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

Keep `types: ["vite/client"]`. The package ships TypeScript source, so your
compiler checks that source too, and frappe-ui reads `import.meta.env`. Without
it the check fails with `Property 'env' does not exist on type 'ImportMeta'`.

Import types from the same subpath as the value:

```ts
import { Button, type ButtonProps } from 'frappe-ui'
import { Editor, type RichTextKitOptions } from 'frappe-ui/editor'
```

Only the paths in the package `exports` map resolve: `frappe-ui`,
`frappe-ui/list`, `frappe-ui/editor`, `frappe-ui/code-editor`,
`frappe-ui/charts`, `frappe-ui/icons`, `frappe-ui/experimental`,
`frappe-ui/tailwind`, `frappe-ui/vite`, `frappe-ui/vite/lucideIconsPlugin`,
`frappe-ui/vitepress`, `frappe-ui/style.css` and `frappe-ui/tsconfig.base.json`.
Anything else (`frappe-ui/src/...`) fails with
`Package subpath '…' is not defined`.

## Check it works

After `npm run dev`:

- The page renders in Inter, on semantic surface colors.
- The console has no `Package subpath '…' is not defined` and no
  `injection "Symbol(router)" not found`.
- `<Button icon-left="lucide-plus" label="New" />` shows a plus icon. An empty
  square means Tailwind is not scanning frappe-ui's source: check the `content`
  array.
