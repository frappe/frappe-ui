# Vite Plugin

`frappe-ui/vite` is one Vite plugin that sets up a Frappe app's frontend: the
dev-server proxy, production build paths, boot data, faster dev imports, and
optional icon and type generation.

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

Each option below turns one sub-plugin on or off. Pass `false` to turn one off,
or an options object to change its defaults.

| Option          | Default | What it does                                                   |
| --------------- | ------- | -------------------------------------------------------------- |
| `frontendRoute` | none    | The route your app is served on. Set it yourself.              |
| `barrelImports` | `true`  | Loads only the used modules from `frappe-ui` in dev.           |
| `codeLanguages` | `true`  | Lets the build pass without every CodeMirror language package. |
| `frappeProxy`   | `true`  | Proxies backend requests from the dev server to Frappe.        |
| `lucideIcons`   | `false` | Supports `~icons/lucide/*` imports and `<LucideName />` tags.  |
| `frappeTypes`   | `false` | Generates TypeScript interfaces from DocTypes.                 |
| `jinjaBootData` | `true`  | Puts server boot values on `window` in production builds.      |
| `buildConfig`   | `true`  | Sets build output paths for Frappe's folder layout.            |

The package ships its own types, so `frappeui(...)` and its options are typed
without `@ts-expect-error`.

## `frontendRoute`

Sets the route your app is served on, such as `'/g'`. Two sub-plugins read it:

- **Dev server site banner:** on startup, prints a clickable URL for every site
  the app is installed on.
- **Build output path:** `buildConfig.indexHtmlPath` defaults to
  `../<appName>/www/<path>.html`.

```ts
frappeui({
  frontendRoute: '/g',
})
```

## Barrel imports

Rewrites `import { Button } from 'frappe-ui'` into an import of the one module
that declares `Button`, so the dev server loads only what you use.

`frappe-ui`'s entry point is a barrel file: about 100 `export * from` lines with
no side effects. In dev, Vite serves unbundled ESM, so importing one component
from it makes the browser request the barrel and every module it re-exports,
including echarts, TipTap, CodeMirror and socket.io. Vite's dependency
optimizer then finds those packages late and reloads the page with
"optimized dependencies changed, reloading".

You keep writing the barrel import. The plugin is on by default and needs no
configuration in most apps.

```ts
frappeui({
  barrelImports: {
    // Rewrite additional barrels alongside 'frappe-ui'.
    packages: ['frappe-ui', 'my-shared-components'],
  },
})
```

| Option       | Default                                        | Description                                                                                                                                                  |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages`   | `['frappe-ui']`                                | Package names to rewrite. Each must resolve to a barrel of re-exports only.                                                                                  |
| `include`    | `/\.(vue\|ts\|tsx\|js\|jsx\|mts\|mjs)($\|\?)/` | `RegExp` of file paths whose imports may be rewritten.                                                                                                       |
| `exclude`    | Generated from `packages`                      | `RegExp` of files to skip. Skips installed `node_modules`, but not the source of a target package that is symlinked in.                                      |
| `linkedOnly` | `true`                                         | Rewrite only when a target package is a working copy (source, or a symlink into `node_modules`). Vite already pre-bundles an installed package as one chunk. |
| `apply`      | `'serve'`                                      | Vite's `apply`. A production build tree-shakes the barrel anyway, and the rewrite would put absolute file paths in the build. Pass `'build'` or `null` to change it. |

Only named imports are rewritten. Namespace imports (`import * as`) and
side-effect imports are left alone. A named import the plugin can't map stays a
barrel import, so behavior does not change.

## Code languages

Lets an app build and serve `frappe-ui/code-editor` with only the
`@codemirror/lang-*` packages it installed. On by default.

`loadLanguage(key)` loads ten language packages through literal dynamic
imports, and the ten are optional peer dependencies. Vite resolves those
imports ahead of time, so a package the app did not install stops the
production build:

```
[vite]: Rollup failed to resolve import "@codemirror/lang-sql"
```

It also stops the dev server during dependency pre-bundling:

```
Error during dependency optimization:
✘ [ERROR] Could not resolve "@codemirror/lang-sql"
```

The plugin replaces each missing package with a stub that throws when
`loadLanguage` reaches it. It does this for the build (a Rollup hook) and for
pre-bundling (an esbuild plugin). Both then succeed, and the error names the
package to install:

```
[frappe-ui] loadLanguage('sql') could not load @codemirror/lang-sql: Cannot find module '@codemirror/lang-sql'. If it is not installed: yarn add @codemirror/lang-sql
```

Only frappe-ui's own module is stubbed, found by resolving
`frappe-ui/code-editor` in your app. Your own `src/code-editor/languages.ts`
file is left alone, and so is a language package your app imports itself.

```ts
frappeui({ codeLanguages: false })
```

With it off, you must install all ten packages. See
[the code editor docs](/docs/molecules/code-editor#languages).

## Frappe Proxy

Proxies backend requests from the Vite dev server to your Frappe instance.

- Proxies routes such as `/desk`, `/app`, `/login`, `/api`, `/assets`, `/files`
  and `/private`.
- Reads the Frappe port from `FRAPPE_WEB_SERVER_PORT` or
  `common_site_config.json`, and falls back to `8000`.

| Option   | Default                                               | Description                   |
| -------- | ----------------------------------------------------- | ----------------------------- |
| `port`   | Frappe port + 80 (`8000` gives `8080`)                | Vite dev server port.         |
| `source` | `'^/(desk\|app\|login\|api\|assets\|files\|private)'` | Regex of routes to proxy.     |

```ts
frappeui({
  frappeProxy: {
    port: 8080,
    source: '^/(app|login|api|assets|files|private)',
  },
})
```

## Lucide Icons

Supports `~icons/lucide/*` imports and auto-imported `<LucideName />` tags in
your app. **Off by default.**

frappe-ui draws its own icons from `lucide-<name>` class names, which the
Tailwind plugin turns into CSS masks, so the library does not need this
sub-plugin. Turn it on only when your app imports `~icons/lucide/*` or writes
`<LucideName />` tags. The [Icons](./icons) page shows the three forms.

```ts
frappeui({ lucideIcons: true })
```

| Option           | Default | Description                                                        |
| ---------------- | ------- | ------------------------------------------------------------------ |
| `componentGlobs` | none    | Globs of files that `unplugin-vue-components` scans for icon tags. |

```ts
frappeui({
  lucideIcons: {
    componentGlobs: ['src/**/*.vue'],
  },
})
```

If your app needs it and it is off, an `import … from '~icons/lucide/x'` fails
the build. A `<LucideX />` tag compiles but renders nothing, with a "Failed to
resolve component" warning in development only.

## Frappe Types

Generates TypeScript interfaces from Frappe DocType JSON files, and regenerates
an interface only when its DocType changes.

Off by default. It does not accept `true`: pass an options object with `input`
to turn it on, because it needs that map to know which DocTypes to read.

| Option   | Default                 | Description                                  |
| -------- | ----------------------- | -------------------------------------------- |
| `input`  | required                | Map of `app_name` to an array of DocTypes.   |
| `output` | `src/types/doctypes.ts` | File the generated interfaces are written to. |

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

Adds a Jinja block to the built `index.html` that copies each key of the `boot`
context onto `window`. Use it for global values like `csrf_token` and
`site_name`. On by default, and it applies to production builds only. It takes
no options.

**Server side:** fill `context.boot` in your Python handler.

```python
def get_context(context):
    context.boot = {
        "csrf_token": "...",
        "user": frappe.session.user,
        "user_info": frappe.session.user_info,
    }
    return context
```

**Client side:** read the values from `window`.

```js
console.log(window.user)
console.log(window.user_info)
```

## Build Configuration

Sets production build paths for Frappe's folder layout. On by default.

- Sets the output directory for build assets.
- Sets the base URL Frappe serves the assets from.
- Copies the built `index.html` to a page route, usually in `www/`.

| Option          | Default                                 | Description                           |
| --------------- | --------------------------------------- | ------------------------------------- |
| `outDir`        | `'../app_name/public/frontend'` (found) | Build output directory.               |
| `baseUrl`       | `'/assets/app_name/frontend/'` (found)  | Base URL for assets, in builds only.  |
| `indexHtmlPath` | Inferred from `frontendRoute`           | Where the built `index.html` goes.    |
| `emptyOutDir`   | `true`                                  | Clear the output directory first.     |
| `sourcemap`     | `false`                                 | Generate source maps (slower builds). |

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
