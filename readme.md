<div align="center" markdown="1">

<img src="https://github.com/user-attachments/assets/0a81cdc1-d957-47a9-b151-f5571be0d038" width="80" />

# Frappe UI
**Rapidly build modern frontends for Frappe apps**

<img alt="NPM Downloads" src="https://img.shields.io/npm/dm/frappe-ui.svg?style=flat"/>

<a href="https://ui.frappe.io">
<img width="1292" alt="Screenshot 2024-12-12 at 5 27 58 PM" src="https://github.com/user-attachments/assets/56800b45-2859-4dc5-92b8-e40959ce4902" />
</a>
</div>

## Frappe UI

Frappe UI provides a set of components and utilities for rapid UI development. Components are built using Vue 3 and Tailwind.
Along with generic components like Button, Link, Dialog, etc., it also contains utilities for handling server-side data fetching, directives and utilities.


### Motivation
In 2019, I began building [Frappe Books](https://github.com/frappe/books) which had a new design. This led to the creation of small reusable components like Button, Dialog, and Card. Moving on to [Frappe Cloud](https://github.com/frappe/press) in 2020, I reused and evolved these components in the Frappe Cloud UI. In 2022, while starting a new project, I decided to extract these components into a standalone package to avoid repeating the copy-paste process. This package is now being developed alongside the [Gameplan](https://github.com/frappe/gameplan), continually adding generic components and utilities for frontend development.

### Under the Hood

- [TailwindCSS](https://github.com/tailwindlabs/tailwindcss): Utility first CSS Framework to build design system based UI.
- [Reka UI](https://github.com/unovue/reka-ui): Unstyled and accessible UI primitives.
- [TipTap](https://github.com/ueberdosis/tiptap): ProseMirror based rich-text editor with a Vue API.
- [dayjs](https://github.com/iamkun/dayjs): Minimal javascript library for working with dates.

## Links

- [Documentation](https://ui.frappe.io)
- [Vite Plugins](vite/README.md)
- [Frappe UI Starter Boilerplate](https://github.com/netchampfaris/frappe-ui-starter)
- [Community](https://github.com/frappe/frappe-ui/discussions)

## Usage

Requires **Node `>=20.19.0`**, Vite, Vue 3 and Tailwind CSS v3.4.

```sh
npm install frappe-ui
# or
yarn add frappe-ui
```

Add the frappe-ui Vite plugin in `vite.config.js`:

```js
import vue from '@vitejs/plugin-vue'
import frappeui from 'frappe-ui/vite'

export default {
  plugins: [frappeui(), vue()],
}
```

Add the preset and frappe-ui's source globs in `tailwind.config.js`:

```js
import frappeUIPreset, { content } from 'frappe-ui/tailwind'

export default {
  presets: [frappeUIPreset],
  content: ['./index.html', './src/**/*.{vue,js,ts}', ...content],
}
```

Import the stylesheet once, from your CSS entry:

```css
@import 'frappe-ui/style.css';
```

Now use the components:

```vue
<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <Button variant="solid" icon-left="lucide-plus">Click me</Button>
</template>
```

The full setup, including TypeScript, is on the
[Installation](https://ui.frappe.io/docs/getting-started) page. The
[Frappe app](https://ui.frappe.io/docs/getting-started/frappe) guide covers the
dev-server proxy.

## Claude Code skill

For AI coding agents (Claude Code, Cursor, Codex, etc.), Frappe UI ships an agent skill that teaches the agent the library's conventions — semantic Tailwind tokens, the `variant` + `theme` color axes, the `useCall` data-fetching composable, common UI recipes, and anti-patterns to avoid.

Install with [Vercel's `skills` CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add https://github.com/frappe/frappe-ui/tree/main/skills/frappe-ui
```

The skill lives in [`skills/frappe-ui/`](./skills/frappe-ui/) and is updated alongside the library.

## Used By

Frappe UI is being used in a lot of products by
[Frappe](https://github.com/frappe).

- [Frappe Cloud](https://frappecloud.com)
- [Gameplan](https://github.com/frappe/gameplan)
- [Helpdesk](https://github.com/frappe/helpdesk)
- [Frappe Insights](https://github.com/frappe/insights)
- [Frappe Drive](https://github.com/frappe/drive)
- [Frappe Builder](https://github.com/frappe/builder)

<br>
<br>
<div align="center">
	<a href="https://frappe.io" target="_blank">
		<picture>
			<source media="(prefers-color-scheme: dark)" srcset="https://frappe.io/files/Frappe-white.png">
			<img src="https://frappe.io/files/Frappe-black.png" alt="Frappe Technologies" height="28"/>
		</picture>
	</a>
</div>
