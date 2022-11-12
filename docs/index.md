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
})
todos.fetch()
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

<style>
:root {
  --gray-50: #F9FAFA;
  --gray-100: #F4F5F6;
  --gray-200: #EBEEF0;
  --gray-300: #DCE0E3;
  --gray-400: #C0C6CC;
  --gray-500: #98A1A9;
  --gray-600: #687178;
  --gray-700: #505A62;
  --gray-800: #333C44;
  --gray-900: #1F272E;

  --blue-50: #F0F8FE;
  --blue-100: #D3E9FC;
  --blue-200: #A7D3F9;
  --blue-300: #7CBCF5;
  --blue-400: #50A6F2;
  --blue-500: #2490EF;
  --blue-600: #1579D0;
  --blue-700: #1366AE;
  --blue-800: #154875;
  --blue-900: #1A4469;

  --vp-c-text-light-1: var(--gray-900);
  --vp-c-text-light-2: var(--gray-700);
  --vp-c-text-light-3: var(--gray-500);
  --vp-c-text-light-4: var(--gray-300);

  --vp-c-white-soft: var(--gray-50);
  --vp-c-white-mute: var(--gray-50);
  --vp-c-black: var(--gray-900);

  --vp-c-gray-light-1: var(--gray-500);
  --vp-c-gray-light-2: var(--gray-400);
  --vp-c-gray-light-3: var(--gray-300);
  --vp-c-gray-light-4: var(--gray-200);
  --vp-c-gray-light-5: var(--gray-100);

  --vp-c-divider-light-1: var(--gray-200);
  --vp-c-divider-light-2: var(--gray-300);

  --vp-c-brand-darker: var(--blue-700);
  --vp-c-brand-dark: var(--blue-600);
  --vp-c-brand: var(--blue-500);
  --vp-c-brand-light: var(--blue-400);
  --vp-c-brand-lighter: var(--blue-200);
}
</style>
