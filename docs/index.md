# What is Frappe UI?

Frappe UI is a set of components and utilities to build frontend apps based on
the [Frappe Framework](https://frappeframework.com).

Along with generic components which are required to build a frontend like
Button, Link, Dialog, etc., frappe-ui also contains utilities for handling
server-side data fetching, directives and utilities.

**Usage example**

```vue
<script setup>
import { Button, LoadingText, createResource } from 'frappe-ui'

let todos = createResource({
  type: 'list',
  doctype: 'ToDo',
  fields: ['name', 'description'],
  cache: 'ToDos',
  auto: true,
})
</script>

<template>
  <LoadingText v-if="todos.loading" />
  <ul v-else>
    <li v-for="todo in todos.data" :key="todo.name">
      {{ todo.description }}
    </li>
  </ul>
  <Button>Add ToDo</Button>
</template>
```

## Dependencies

Frappe UI is built on top of the following amazing projects &ndash;

- [Vue 3](https://vuejs.org)
- [TailwindCSS](https://tailwindcss.com)
- [Headless UI](https://headlessui.com)
- [PopperJS](https://popper.js.org/)
- [TipTap](https://tiptap.dev)
- [Feather Icons](https://feathericons.com)

See full list of dependencies:
[package.json](https://github.com/frappe/frappe-ui/blob/main/package.json)

## Motivation

In 2019, I started building [Frappe Books](https://frappebooks.com) based on an
experimental design system by [Timeless](https://timeless.co). As the product
got built, a set of small reusable components (like Button, Dialog, Card, etc.)
were also built.

After the launch of Frappe Books (and me dropping the project) I moved on to
building the UI for [Frappe Cloud](https://frappecloud.com) in 2020. It also
needed these components, so I copy-pasted them from Frappe Books to Frappe
Cloud. These components evolved over time in Frappe Cloud. After working on the
Frappe Cloud UI for about a year and a half, I moved on to my next project.

At the start of 2022, I started working on
[Gameplan](https://github.com/frappe/gameplan). I didn't want to copy-paste yet
again, so I extracted these components in a separate package called
[`frappe-ui`](https://npm.im/frappe-ui). This package is being developed in
parallel along with the Gameplan project. I keep adding generic components and
utilities useful for frontend development.

## Products

Frappe UI is now being used in a lot of products by Frappe.

- [Frappe Cloud](https://frappecloud.com)
- [Gameplan](https://github.com/frappe/gameplan)
- [Frappe Desk](https://frappedesk.com)
- [Frappe Insights](https://github.com/frappe/insights)
- [Frappe Drive](https://github.com/frappe/drive)

## License

Frappe UI is MIT licensed
