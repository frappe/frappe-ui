<p align="center">
  <a href="https://github.com/frappe/frappe-ui">
    <img src="./docs/public/frappe-ui-logo.svg" width="250" />
  </a>
</p>
<h1 style="font-size: 24px" align="center">Rapidly build modern frontends for Frappe apps</h1>

<p align="center">
  <img alt="MIT License" src="https://img.shields.io/github/license/frappe/frappe-ui"/>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/frappe-ui.svg?style=flat"/>
</p>

Frappe UI provides a set of components and utilities for rapid UI development.
Components are built using Vue 3 and Tailwind. Along with components, there are
directives and utilities that make UI development easier.

## Links

- [Documentation](https://frappeui.com)
- [Frappe UI Starter Boilerplate](https://github.com/netchampfaris/frappe-ui-starter)
- [Community](https://github.com/frappe/frappe-ui/discussions)

## Installation

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
  <Button>Click me</Button>
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

## License

MIT
