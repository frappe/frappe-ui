# Installation

Set up frappe-ui in a Vite and Vue 3 app. You need Node 20.19 or later.

## Quick start

Create a new app with one command:

```sh
npm create frappe-ui@latest
```

It asks where to create the project and what it is for, then sets up Vue 3,
TypeScript, Vite, Tailwind CSS and frappe-ui with a starter page.

- **Frontend of a Frappe app:** run it from your app's folder, such as
  `apps/todo`. It creates `frontend/` and connects it to the app: the page that
  serves it, the route rule in `hooks.py`, the build scripts and `.gitignore`.
  It lists these changes and asks before it writes them.
- **Standalone app:** run it anywhere else for a plain Vite app with no Frappe
  server.

When it finishes, it prints the next steps, including the command that starts
the dev server.

## Set up by hand

Use these steps to add frappe-ui to an existing project, or to see what the
command above sets up. The steps are the same with or without a Frappe server
behind the app. Only the Vite config differs.

<div class="steps">

### Create your project

Start with a Vue and TypeScript project from Vite. Skip this step if you
already have one.

```sh
npm create vite@latest my-app -- --template vue-ts
cd my-app
```

Building the frontend of a Frappe app? Create the project inside your app
instead, as the [Frappe app](./getting-started/frappe#create-the-frontend)
guide shows.

### Install frappe-ui

Install Tailwind CSS v3, frappe-ui and Vue Router. frappe-ui doesn't support
Tailwind CSS v4 yet.

```sh
npm install -D tailwindcss@^3.4 postcss autoprefixer
npm install frappe-ui vue-router
```

### Configure Tailwind CSS

Add the frappe-ui preset to `tailwind.config.js`, and include frappe-ui's
`content` paths so its classes get generated.

```js
import preset, { content } from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
```

Then turn Tailwind on in `postcss.config.js`.

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
```

### Import the styles

Replace everything in `src/style.css` with one import. It brings in Tailwind and
the Inter font, so don't add the `@tailwind` lines yourself.

```css
@import 'frappe-ui/style.css';
```

### Add the provider

Wrap your app in `FrappeUIProvider` in `src/App.vue`. It renders dialogs and
toasts opened from code.

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

Then add a router and the styles in `src/main.ts`. Some components link to
routes, so frappe-ui needs Vue Router even in a one-page app.

```ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Home }],
})

createApp(App).use(router).mount('#app')
```

### Configure Vite

`vite.config.ts` depends on where the app runs. Follow the guide that fits:

- [Frappe app](./getting-started/frappe#add-the-vite-plugin): adds the frappe-ui Vite
  plugin, which proxies your bench and builds into the app.
- [Standalone app](./getting-started/standalone#vite-config): adds the same
  plugin with its Frappe server features turned off.

### Start using frappe-ui

Put a component in `src/pages/Home.vue` and run `npm run dev`.

```vue
<script setup lang="ts">
import { Button } from 'frappe-ui'
</script>

<template>
  <Button variant="solid" icon-left="lucide-plus" label="New task" />
</template>
```

You should see a dark button with a plus icon, in the Inter font. If the icon is
an empty square, Tailwind isn't reading frappe-ui's files. Check the `content`
line in `tailwind.config.js`.

</div>

## TypeScript

Extend frappe-ui's base config in `tsconfig.json`.

```json
{
  "extends": "frappe-ui/tsconfig.base.json",
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

Keep `vite/client` in `types`. frappe-ui ships its TypeScript source, and that
source reads `import.meta.env`.

Import types from the same place as the component:

```ts
import { Button, type ButtonProps } from 'frappe-ui'
import { Editor, type RichTextKitOptions } from 'frappe-ui/editor'
```

## Entry points

Import only from the paths frappe-ui exports. Deeper paths such as
`frappe-ui/src/...` fail with `Package subpath is not defined`.

| Path                               | What it has                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| `frappe-ui`                        | Components, composables and data fetching                    |
| `frappe-ui/list`                   | The list components                                          |
| `frappe-ui/editor`                 | The rich text editor                                         |
| `frappe-ui/code-editor`            | The code editor                                              |
| `frappe-ui/charts`                 | Charts                                                       |
| `frappe-ui/icons`                  | Frappe's own icon components                                 |
| `frappe-ui/experimental`           | Components whose API may still change                        |
| `frappe-ui/tailwind`               | The Tailwind preset and `content` paths                      |
| `frappe-ui/tailwind/tokens`        | The design tokens as plain data                              |
| `frappe-ui/vite`                   | The Vite plugin                                              |
| `frappe-ui/vite/lucideIconsPlugin` | Only the `~icons/lucide/*` resolver from the Vite plugin     |
| `frappe-ui/style.css`              | The base stylesheet                                          |
| `frappe-ui/tsconfig.base.json`     | The base TypeScript config                                   |
| `frappe-ui/vitepress`              | The theme for frappe-ui's own docs. Don't import it in apps. |
