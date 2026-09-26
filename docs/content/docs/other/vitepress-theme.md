# VitePress theme

The `frappe-ui/vitepress` subpath is the VitePress theme and config builder
behind this docs site. It provides the layout, sidebar, search, command
palette, and a `defineDocsConfig()` helper that builds a VitePress config with
them.

> **Unstable API.** `frappe-ui/vitepress` ships in `1.0.0` with no stability
> promise. The deprecation policy and the additive-only rule for frappe-ui's
> build-time entries do not apply to it: it can change or disappear in _any_
> release, including minor and patch releases, with no deprecation period. This
> docs site is its only user today, so `DefineDocsConfigOptions` was designed
> for one caller and will change when a second Frappe docs site uses it.

## Usage

```ts
// .vitepress/config.ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineDocsConfig } from 'frappe-ui/vitepress'

// VitePress config runs as native ESM, so there is no __dirname. Get the
// docs root from the config file's own URL instead.
const configDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(configDir, '..')

export default defineDocsConfig({
  rootDir,
  name: 'My Docs',
  description: '…',
  sidebar: [
    /* … */
  ],
})
```

```ts
// .vitepress/theme/index.ts
import { theme } from 'frappe-ui/vitepress'

export default theme
```

`frappe-ui/vitepress` imports `shiki`, `@shikijs/transformers` and
`@vue/compiler-dom`. Your `vitepress` and `vue` installs supply all three, so
frappe-ui declares them as optional peers. With pnpm in strict mode, add the
three packages to your site's own `devDependencies`.

`DefineDocsConfigOptions` is not listed here because it is expected to change.
Read it in `vitepress/index.node.ts` in the frappe-ui source.
