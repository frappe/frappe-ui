# Vite Plugin

`frappe-ui/vite` is a collection of Vite plugins for Frappe applications:
dev-server proxying, Lucide icon auto-imports, barrel-import rewriting for
faster dev builds, TypeScript type generation from DocTypes, boot data
injection, and production build configuration.

## Installation

```bash
npm install frappe-ui
```

## Basic setup

Add the plugin to your `vite.config.ts`:

```ts
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

Every sub-plugin except `frappeTypes` is **enabled by default**. Pass `false`
to disable one, or an options object to override its defaults. `frontendRoute`
and `frappeTypes` need explicit configuration — `frontendRoute` sets the app
route, and `frappeTypes` needs an `input` map of app names to doctype names.

Types ship with the package — `frappeui(...)` and its options are fully typed,
no `@ts-expect-error` needed.

## `frontendRoute`

The route your app is served on (e.g. `'/g'`). Shared across sub-plugins:

- **Dev server site banner** — prints clickable URLs for every site the app
  is installed on, on startup.
- **Build output path** — `buildConfig.indexHtmlPath` is auto-inferred as
  `../<appName>/www/<path>.html`.

```ts
frappeui({
  frontendRoute: '/g',
})
```

## Barrel imports

`frappe-ui`'s entry point is a pure re-export barrel — around 100
`export * from` lines with no side effects. In dev, Vite serves unbundled ESM,
so importing one component from it makes the browser request the barrel *and*
every module it re-exports: echarts, TipTap, CodeMirror, socket.io included.
Vite's dependency optimizer then discovers those packages mid-crawl and
triggers a full "optimized dependencies changed, reloading" round trip.

The `barrelImports` sub-plugin rewrites `import { Button } from 'frappe-ui'`
at transform time into a deep import of the module that actually declares
`Button`, so authors keep writing the barrel import while dev only ever loads
what's used. It's on by default — no configuration needed for the common case.

```ts
frappeui({
  barrelImports: {
    // Rewrite additional barrels alongside 'frappe-ui'.
    packages: ['frappe-ui', 'my-shared-components'],
  },
})
```

Options:

| Option        | Description                                                                     | Default                              |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------- |
| `packages`    | Bare specifiers to rewrite. Each must resolve to a pure re-export barrel.        | `['frappe-ui']`                       |
| `include`     | `RegExp` matching file paths whose source may contain rewritable imports.        | `/\.(vue\|ts\|tsx\|js\|jsx\|mts\|mjs)($\|\?)/` |
| `exclude`     | `RegExp` of files to skip. Excludes installed `node_modules`, but not the target packages' own sources — those are the bulk of the rewrite when one is symlinked in. | Generated from `packages` |
| `linkedOnly`  | Only rewrite when a target package resolves to a working copy (source, or a symlink into `node_modules`) rather than an installed dependency — rewriting an installed package is a net loss, since Vite already pre-bundles it as one chunk. | `true` |
| `apply`       | Vite's `apply`. Dev-only by default: a production build resolves and tree-shakes the barrel anyway, and the rewrite would bake absolute filesystem paths into the graph. Pass `'build'` or `null` to override. | `'serve'` |

Only named imports are rewritten. Namespace imports (`import * as`) and
side-effect imports are left alone, as is any named import the plugin can't
map — it falls back to a residual barrel import so behavior never silently
changes.

## Frappe Proxy

Configures the Vite dev server to proxy backend requests to your Frappe
instance.

- Proxies routes like `/app`, `/login`, `/api`, `/assets`, `/files`, `/private`.
- Auto-detects the Frappe port from `common_site_config.json`.

| Option   | Description                | Default                                                |
| -------- | --------------------------- | ------------------------------------------------------- |
| `port`   | Vite dev server port        | Auto-calculated from `webserver_port`                    |
| `source` | Regex for routes to proxy   | `'^/(desk\|app\|login\|api\|assets\|files\|private)'`   |

```ts
frappeui({
  frappeProxy: {
    port: 8080,
    source: '^/(app|login|api|assets|files|private)',
  },
})
```

## Lucide Icons

Integrates [Lucide icons](https://lucide.dev) with auto-import support. See
the [Icons](./icons) page for how to use icons in your templates — this
sub-plugin is what powers the `~icons/lucide/*` import and `<LucideName />`
auto-import forms.

```ts
frappeui({
  lucideIcons: {
    // Scope which files unplugin-vue-components scans for auto-importable tags.
    componentGlobs: ['src/**/*.vue'],
  },
})
```

## Frappe Types

Auto-generates TypeScript interfaces from Frappe DocType JSON files.
Interfaces are regenerated only when the source DocType changes. Off by
default, and unlike the other sub-plugins it doesn't accept `true` — pass an
options object with `input` to turn it on, since it needs that map to know
which doctypes to generate.

| Option   | Description                                | Default                  |
| -------- | -------------------------------------------- | ------------------------- |
| `input`  | Map of `app_name` → array of doctype names   | *(required)*               |
| `output` | Output file path for generated types         | `src/types/doctypes.ts`    |

```ts
frappeui({
  frappeTypes: {
    input: {
      your_app_name: ['doctype1', 'doctype2'],
    },
    output: 'src/types/doctypes.ts',
  },
})
```

## Jinja Boot Data

Injects a Jinja block that reads keys from the `boot` context object and sets
them on `window`. Useful for global values like `csrf_token` and `site_name`.

```ts
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

```js
console.log(window.user)
console.log(window.user_info)
```

## Build Configuration

Handles production builds with proper asset paths and HTML output for
Frappe's directory structure.

- Configures output directories for build assets.
- Sets the correct base URL for Frappe's asset serving.
- Copies the built `index.html` to the specified location (typically in `www/`).

| Option          | Description                          | Default                                   |
| --------------- | -------------------------------------- | -------------------------------------------- |
| `outDir`        | Build output directory                 | `'../app_name/public/frontend'` (auto)         |
| `baseUrl`       | Base URL for assets                    | `'/assets/app_name/frontend/'` (auto)          |
| `indexHtmlPath` | Where to copy built `index.html`       | Inferred from `frontendRoute`                  |
| `emptyOutDir`   | Clear output directory before build    | `true`                                          |
| `sourcemap`     | Generate source maps                   | `false`                                         |

```ts
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
