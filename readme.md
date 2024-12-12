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
- [Headless UI](https://github.com/tailwindlabs/headlessui): Unstyled and accessible UI components.
- [TipTap](https://github.com/ueberdosis/tiptap): ProseMirror based rich-text editor with a Vue API.
- [dayjs](https://github.com/iamkun/dayjs): Minimal javascript library for working with dates.

## Links

- [Documentation](https://frappeui.com)
- [Frappe UI Starter Boilerplate](https://github.com/netchampfaris/frappe-ui-starter)
- [Community](https://github.com/frappe/frappe-ui/discussions)

## Usage

```sh
npm install frappe-ui
# or
yarn add frappe-ui
```

Now, import the FrappeUI plugin and components in your Vue app's `main.js`:

```js
import { createApp } from 'vue'
import { FrappeUI } from 'frappe-ui'
import App from './App.vue'
import './index.css'

let app = createApp(App)
app.use(FrappeUI)
app.mount('#app')
```

In your `tailwind.config.js` file, include the frappe-ui preset:

```js
module.exports = {
  presets: [
    require('frappe-ui/src/utils/tailwind.config')
  ],
  ...
}
```

Now, you can import needed components and start using it:

```html
<template>
  <button>Click me</button>
</template>
<script>
  import { Button } from 'frappe-ui'
  export default {
    components: {
      Button,
    },
  }
</script>
```

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
