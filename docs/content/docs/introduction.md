# Introduction

Frappe UI is a Vue 3 component library for building apps on the
[Frappe Framework](https://frappeframework.com). It gives you the components,
design tokens and data fetching that Frappe's own products use.

```vue
<script setup>
import { Button, LoadingText, useList } from 'frappe-ui'

const todos = useList({
  doctype: 'ToDo',
  fields: ['name', 'description'],
})
</script>

<template>
  <LoadingText v-if="todos.loading" />
  <ul v-else class="text-base text-ink-gray-8">
    <li v-for="todo in todos.data" :key="todo.name">
      {{ todo.description }}
    </li>
  </ul>
  <Button
    variant="solid"
    @click="todos.insert.submit({ description: 'New to-do' })"
  >
    Add to-do
  </Button>
</template>
```

## What's included

- **[Components](./components/button.md):** buttons, inputs, dialogs, menus,
  tables and more, built on [Reka UI](https://reka-ui.com) for keyboard and
  screen reader support.
- **[Foundations](./foundations/colors.md):** the colors, type scale, radius and
  shadows, as Tailwind classes that switch with dark mode.
- **[Data fetching](./data-fetching/use-list.md):** `useList`, `useDoc`,
  `useCall` and friends, which read and write Frappe documents and keep them in
  sync across the page.
- **[Charts](./charts/overview.md)** and the
  **[Editor](./molecules/editor.md):** larger pieces for dashboards and rich
  text.

It also works without a Frappe server. The components and styles don't need
one.

## Built on

[Vue 3](https://vuejs.org), [Tailwind CSS](https://tailwindcss.com),
[Reka UI](https://reka-ui.com), [TipTap](https://tiptap.dev) and
[Lucide](https://lucide.dev) icons.

## Used in

Frappe UI started in 2019 as the components shared between Frappe Books and
Frappe Cloud. It now powers most Frappe apps, including:

- [Frappe Cloud](https://frappe.io/cloud)
- [Frappe CRM](https://github.com/frappe/crm)
- [Helpdesk](https://github.com/frappe/helpdesk)
- [Frappe HR](https://github.com/frappe/hrms)
- [Frappe Learning](https://github.com/frappe/lms)
- [Insights](https://github.com/frappe/insights)
- [Frappe Drive](https://github.com/frappe/drive)
- [Builder](https://github.com/frappe/builder)
- [Gameplan](https://github.com/frappe/gameplan)

## Next steps

[Install frappe-ui](./getting-started.md) in a new or existing app. Moving from
v0? Read the [migration guide](./migration.md).

## License

MIT.
