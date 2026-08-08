# VitePress theme

The `frappe-ui/vitepress` subpath is the shared VitePress theme and config
builder that renders this docs site: the layout, sidebar, search, command
palette, and the `defineDocsConfig()` helper that wires them into a VitePress
config.

> **Unstable API** — `frappe-ui/vitepress` ships at `1.0.0` but carries no
> stability promise. It is exempt from the usual deprecation policy and from
> the additive-only rule that otherwise governs frappe-ui's build-time
> entries: it can change shape or disappear in _any_ release, including minor
> and patch releases, with no deprecation window. Its only consumer today is
> this docs site, so `DefineDocsConfigOptions` was shaped by exactly one
> caller — it needs room to change as a second Frappe docs site adopts it.

## Usage

```ts
// .vitepress/config.ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineDocsConfig } from 'frappe-ui/vitepress'

// VitePress config runs as native ESM — there's no __dirname. Derive the
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

`DefineDocsConfigOptions` isn't reproduced here since it's expected to
change — read it directly from `vitepress/index.node.ts` in the frappe-ui
source.
