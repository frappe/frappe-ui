# Frappe UI Vite Plugins

A collection of Vite plugins for Frappe applications that handle common
development tasks like dev server proxying, icon auto-imports, TypeScript type
generation, boot data injection, and production builds.

## Getting Started

### Installation

```bash
npm install frappe-ui
```

### Basic Setup

Add the plugin to your `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui({
      frontendRoute: '/g',
      frappeTypes: {
        input: {
          app_name: ['doctype_1', 'doctype_2'],
        },
      },
    }),
    vue(),
  ],
})
```

All plugins except `frappeTypes` are **enabled by default**. `frontendRoute` and
`frappeTypes` require explicit configuration — `frontendRoute` sets the app
route, and `frappeTypes` needs an `input` map of app names to doctype names.
Pass custom options to override any plugin, or `false` to disable it.

---

## Configuration Reference

### `frontendRoute`

The route where your app is served (e.g. `'/g'`). This top-level option is
shared across plugins and controls:

- **Dev server site banner** — prints clickable URLs for all sites where the app
  is installed on startup.
- **Build output path** — `indexHtmlPath` is auto-inferred as
  `../<appName>/www/<path>.html`.

```javascript
frappeui({
  frontendRoute: '/g',
})
```

---

## Plugins

### Frappe Proxy

Configures the Vite dev server to proxy backend requests to your Frappe
instance.

- Proxies routes like `/api`, `/app`, `/assets`, `/files`, etc.
- Auto-detects the Frappe port from `common_site_config.json`

| Option   | Description               | Default                                         |
| -------- | ------------------------- | ----------------------------------------------- |
| `port`   | Vite dev server port      | Auto-calculated from `webserver_port`           |
| `source` | Regex for routes to proxy | `'^/(app\|login\|api\|assets\|files\|private)'` |

```javascript
frappeui({
  frappeProxy: {
    port: 8080,
    source: '^/(app|login|api|assets|files|private)',
  },
})
```

### Lucide Icons

Integrates [Lucide icons](https://lucide.dev/) with auto-import support and a
standardized stroke-width of 1.5.

**Auto-import** — use directly in templates, no import needed:

```vue
<template>
  <LucideArrowRight class="size-4" />
</template>
```

**Explicit import** — for use in `<script setup>`:

```ts
import LucideArrowRight from '~icons/lucide/arrow-right'
```

**Static `Button` icon props** — literal string props on `Button` are rewritten
at build time to direct Lucide imports, so the icon stays tree-shakeable:

```vue
<Button icon="menu" />
<Button icon-left="search" icon-right="chevron-down" />
```

This only applies to static string literals in `.vue` templates. Dynamic string
values are not transformed; prefer passing the imported Lucide component in
those cases.

### Frappe Types

Auto-generates TypeScript interfaces from Frappe DocType JSON files. Interfaces
are regenerated only when the source DocType changes.

| Option   | Description                                | Default                 |
| -------- | ------------------------------------------ | ----------------------- |
| `input`  | Map of `app_name` → array of doctype names | _(required)_            |
| `output` | Output file path for generated types       | `src/types/doctypes.ts` |

```javascript
frappeui({
  frappeTypes: {
    input: {
      your_app_name: ['doctype1', 'doctype2'],
    },
    output: 'src/types/doctypes.ts',
  },
})
```

### Jinja Boot Data

Injects a Jinja block that reads keys from the `boot` context object and sets
them on `window`. Useful for global values like `csrf_token` and `site_name`.

```javascript
frappeui({
  jinjaBootData: true,
})
```

**Server side** — populate `context.boot` in your Python handler:

```python
def get_context(context):
    context.boot = {
        "csrf_token": "...",
        "user": frappe.session.user,
        "user_info": frappe.session.user_info,
    }
    return context
```

**Client side** — access values directly from `window`:

```javascript
console.log(window.user)
console.log(window.user_info)
```

### Build Configuration

Handles production builds with proper asset paths and HTML output for Frappe's
directory structure.

- Configures output directories for build assets
- Sets correct base URLs for Frappe's asset serving
- Copies the built `index.html` to the specified location (typically in `www/`)

| Option          | Description                         | Default                                |
| --------------- | ----------------------------------- | -------------------------------------- |
| `outDir`        | Build output directory              | `'../app_name/public/frontend'` (auto) |
| `baseUrl`       | Base URL for assets                 | `'/assets/app_name/frontend/'` (auto)  |
| `indexHtmlPath` | Where to copy built `index.html`    | Inferred from `frontendRoute`          |
| `emptyOutDir`   | Clear output directory before build | `true`                                 |
| `sourcemap`     | Generate source maps                | `true`                                 |

```javascript
frappeui({
  buildConfig: {
    outDir: '../app_name/public/frontend',
    baseUrl: '/assets/app_name/frontend/',
    indexHtmlPath: '../app_name/www/app_name.html',
    emptyOutDir: true,
    sourcemap: true,
  },
})
```
