<div align="center" markdown="1">

<img src="https://github.com/user-attachments/assets/0a81cdc1-d957-47a9-b151-f5571be0d038" width="80" />

# Frappe UI

**Vue 3 components, design tokens and data composables for Frappe apps**

<a href="https://www.npmjs.com/package/frappe-ui"><img alt="npm version" src="https://img.shields.io/npm/v/frappe-ui.svg?style=flat" /></a>
<a href="https://www.npmjs.com/package/frappe-ui"><img alt="npm downloads" src="https://img.shields.io/npm/dm/frappe-ui.svg?style=flat" /></a>
<a href="./license.md"><img alt="MIT license" src="https://img.shields.io/npm/l/frappe-ui.svg?style=flat" /></a>

<a href="https://ui.frappe.io">
<img width="1292" alt="Frappe UI documentation site" src="https://github.com/user-attachments/assets/56800b45-2859-4dc5-92b8-e40959ce4902" />
</a>

[Documentation](https://ui.frappe.io) ·
[Getting started](https://ui.frappe.io/docs/getting-started) ·
[Migration guide](https://ui.frappe.io/docs/migration) ·
[Changelog](https://ui.frappe.io/docs/changelog) ·
[Discussions](https://github.com/frappe/frappe-ui/discussions)

</div>

## What you get

- **50+ components.** Buttons, form controls, dialogs, popovers, tabs, sidebars,
  app shells and more. Built with [Vue 3](https://vuejs.org),
  [Tailwind CSS](https://tailwindcss.com) and [Reka UI](https://reka-ui.com)
  primitives.
- **Design tokens with dark mode built in.** Semantic `surface`, `ink` and
  `outline` color tokens, plus radius, typography and elevation scales. Tokens
  flip under `[data-theme="dark"]`, so a `dark:` variant is never needed.
- **Data composables for Frappe.** `useCall`, `useList`, `useDoc`, `useDoctype`
  and `useNewDoc` handle fetching, caching, pagination and writes against a
  Frappe backend.
- **Rich text editor, lists and charts** as separate entries: `frappe-ui/editor`
  (TipTap), `frappe-ui/list` and `frappe-ui/charts` (ECharts).
- **Vite plugins** for the Frappe dev-server proxy, Lucide icon auto-imports,
  DocType type generation and production builds.
- **TypeScript first.** Every core component ships typed props, slots and emits.
- **Codemods** for every breaking change on the road to 1.0.

## Quick start

Requires **Node `>=20.19.0`**, **Vite**, **Vue `>=3.5`** and **Tailwind CSS
`>=3.4 <4`**.

```sh
npm install frappe-ui
```

Add the Vite plugin in `vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [frappeui(), vue()],
})
```

Add the preset and content globs in `tailwind.config.js`:

```js
import preset, { content } from 'frappe-ui/tailwind'

export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,js,ts}'],
}
```

Import the stylesheet once from your CSS entry:

```css
@import 'frappe-ui/style.css';
```

Wrap your app root in `FrappeUIProvider` and start using components:

```vue
<script setup>
import { FrappeUIProvider, Button, useList } from 'frappe-ui'

const todos = useList({
  doctype: 'ToDo',
  fields: ['name', 'description'],
  filters: { status: 'Open' },
})
</script>

<template>
  <FrappeUIProvider>
    <ul>
      <li v-for="todo in todos.data" :key="todo.name">
        {{ todo.description }}
      </li>
    </ul>
    <Button variant="solid" icon-left="lucide-plus" @click="todos.next()">
      Load more
    </Button>
  </FrappeUIProvider>
</template>
```

The full setup, including the starter template and TypeScript, is on the
[Installation](https://ui.frappe.io/docs/getting-started) page. The
[Frappe app](https://ui.frappe.io/docs/getting-started/frappe) guide covers the
dev-server proxy.

## Package entries

| Import                   | Contents                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `frappe-ui`              | Core components, data composables, `dialog` and `toast`, directives                 |
| `frappe-ui/editor`       | TipTap-based rich text editor, kits and extensions                                  |
| `frappe-ui/code-editor`  | CodeMirror-based code editor and `CodeKit`                                          |
| `frappe-ui/list`         | Composable `List` family: rows, cells, headers, groups, sorting                     |
| `frappe-ui/charts`       | ECharts-based area, bar, line, donut, funnel, heatmap, sankey, scatter              |
| `frappe-ui/icons`        | Frappe's own icons, such as `StepsIcon` and `LightningIcon`                         |
| `frappe-ui/experimental` | Components without a stability promise: Calendar, ListView, CommandPalette and more |
| `frappe-ui/vite`         | Vite plugins                                                                        |
| `frappe-ui/tailwind`     | Tailwind preset and content globs                                                   |
| `frappe-ui/style.css`    | Base stylesheet, fonts and token variables                                          |

## For AI coding agents

Frappe UI ships an [agent skill](./skills/frappe-ui/) that teaches Claude Code,
Cursor, Codex and similar tools the library's conventions: semantic tokens, the
`variant` and `theme` color axes, the data composables, common recipes and
anti-patterns.

```sh
npx skills add https://github.com/frappe/frappe-ui/tree/main/skills/frappe-ui
```

## Upgrading to 1.0

Every breaking change ships with a codemod. Run them from your frontend
directory:

```sh
npx -p frappe-ui tokens-v2 .     # semantic color tokens
npx -p frappe-ui overlays-v1 .   # Dialog, Popover, Dropdown, Tooltip
npx -p frappe-ui data-v1 .       # data composables
```

The [migration guide](https://ui.frappe.io/docs/migration) lists all ten
codemods and the changes behind them.

## Contributing

```sh
yarn                # install
yarn dev            # component playground
yarn docs:dev       # documentation site
yarn test           # vitest
yarn type-check     # vue-tsc
```

Before you change a public API, read [`PHILOSOPHY.md`](./PHILOSOPHY.md) for the
design rules, [`CONTEXT.md`](./CONTEXT.md) for the shared vocabulary and
[`spec/`](./spec/) for component contracts and decision records.

## Used by

- [Frappe Cloud](https://frappe.io/cloud)
- [Frappe CRM](https://github.com/frappe/crm)
- [Helpdesk](https://github.com/frappe/helpdesk)
- [Frappe HR](https://github.com/frappe/hrms)
- [Frappe Learning](https://github.com/frappe/lms)
- [Insights](https://github.com/frappe/insights)
- [Builder](https://github.com/frappe/builder)
- [Gameplan](https://github.com/frappe/gameplan)

## License

[MIT](./license.md)

<br>
<div align="center">
	<a href="https://frappe.io" target="_blank">
		<picture>
			<source media="(prefers-color-scheme: dark)" srcset="https://frappe.io/files/Frappe-white.png">
			<img src="https://frappe.io/files/Frappe-black.png" alt="Frappe Technologies" height="28"/>
		</picture>
	</a>
</div>
