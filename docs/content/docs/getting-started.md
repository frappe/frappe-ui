# Getting Started

Two paths: the starter template, or a manual setup you can paste into an
existing Vite app.

Requires **Node `>=20.19.0`**, **Vite**, **Vue 3** and **Tailwind CSS
`>=3.4.0 <4`**. `vue`, `vue-router` and `tailwindcss` are peer dependencies;
install them in your app.

## Quick start

You can set up `frappe-ui` with
[`frappe-ui-starter`](https://github.com/netchampfaris/frappe-ui-starter). If
you already have a Frappe app for which you want to build a frontend, start with
**Step 2**.

### Create your Frappe app

```sh
bench new-app todo
```

### Setup frappe-ui

```sh
cd apps/todo
# this will setup a vue project with frappe-ui set up
# inside the frontend directory
npx degit netchampfaris/frappe-ui-starter frontend
```

Refer [frappe-ui-starter](https://github.com/netchampfaris/frappe-ui-starter)
for more details.

### Ignore_csrf config

```sh
bench --site todo.test set-config ignore_csrf 1
```

This will prevent CSRFToken errors while using the vite dev server. In
production environment, the csrf_token is attached to the window object in
index.html for you.

### Start dev server

```sh
cd frontend
yarn
yarn dev
```

The Vite dev server will start on the port `8080`. This can be changed from
`vite.config.js`. The development server is configured to proxy your frappe app
(usually running on port 8000). If you have a site named `todo.test`, open
`http://todo.test:8080` in your browser. If you see a button named "Click to
send 'ping' request", congratulations!

If you notice the browser URL is `/frontend`, this is the base URL where your
frontend app will run in production. To change this, open `src/router.js` and
change the base URL passed to `createWebHistory`.

## Manual setup

Five files. Every step below is required; skipping the Tailwind `content` entry
is the single most common cause of an app that renders unstyled.

### Install

`npm create vite@latest` currently scaffolds Tailwind v4, which frappe-ui does
not support. Replace it:

```sh
npm uninstall tailwindcss @tailwindcss/vite
npm install -D tailwindcss@^3.4 postcss autoprefixer
npm install frappe-ui vue-router
```

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [frappeui({ frontendRoute: '/todo' }), vue()],
})
```

`frontendRoute` is the route the app is served on. It drives the dev-server site
banner and the production `indexHtmlPath`.

Every sub-plugin except `lucideIcons` and `frappeTypes` is on by default. Pass
`false` to turn one off. For a prototype with no Frappe backend:

```ts
frappeui({ frappeProxy: false, jinjaBootData: false, buildConfig: false })
```

Add `lucideIcons: true` only if your own code imports `~icons/lucide/*` or
writes `<LucideX />` tags. frappe-ui's own icons are class names and need
nothing from Vite. See [Icons](./other/icons).

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
[Tailwind Setup](./foundations/tailwind) for what the preset replaces.

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

### TypeScript

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
`frappe-ui/charts`, `frappe-ui/icons`,
`frappe-ui/experimental`, `frappe-ui/tailwind`, `frappe-ui/vite`,
`frappe-ui/vite/lucideIconsPlugin`, `frappe-ui/vitepress`, `frappe-ui/style.css`
and `frappe-ui/tsconfig.base.json`. Anything else (`frappe-ui/src/...`) fails
with `Package subpath '…' is not defined`.

### Check it works

After `npm run dev`:

- The page renders in Inter, on semantic surface colors.
- The console has no `Package subpath '…' is not defined` and no
  `injection "Symbol(router)" not found`.
- `<Button icon-left="lucide-plus" label="New" />` shows a plus icon. An empty
  square means Tailwind is not scanning frappe-ui's source: check the `content`
  array.
