<script setup>
import { Dropdown } from '../../src/index'
let alert = text => window.alert(text)
</script>

# Dropdown

The Dropdown component is used to show a list of options when a button is
clicked.

## Usage

<Story class="gap-4 overflow-visible">
  <Dropdown
    :options="[
      { label: 'Edit', icon: 'edit', handler: () => alert('New File') },
      { label: 'Delete', icon: 'trash', handler: () => alert('New File') },
    ]"
    :button="{ label: 'Menu', icon: 'more-horizontal' }"
  />
  <Dropdown
    :options="[
      {
        group: 'New',
        hideLabel: true,
        items: [
          {
            label: 'New File',
            handler: () => alert('New File'),
          },
          {
            label: 'New Window',
            handler: () => alert('New Window'),
            // show/hide option based on condition function
            condition: () => true,
          },
        ],
      },
      {
        group: 'Open',
        hideLabel: true,
        items: [
          { label: 'Open File', handler: () => alert('Open File') },
          { label: 'Open Folder' },
        ],
      },
      {
        group: 'Delete',
        items: [{ label: 'Delete File' }, { label: 'Delete Folder' }],
      },
    ]"
  >
    <template v-slot="{ open }">
      <button
        :class="[
          'rounded-md px-3 py-1 text-base font-medium',
          open ? 'bg-pink-200' : 'bg-pink-100',
        ]"
      >
        File
      </button>
    </template>
  </Dropdown>
</Story>

```vue
<template>
  <!-- basic dropdown -->
  <Dropdown
    :options="[
      { label: 'New File', handler: () => alert('New File') },
      { label: 'New Window' },
    ]"
    :button="{ label: 'Menu', icon: 'more-horizontal' }"
  />
  <!-- dropdown with groups and custom button -->
  <Dropdown
    :options="[
      {
        group: 'New',
        hideLabel: true,
        items: [
          {
            label: 'New File',
            handler: () => alert('New File'),
          },
          {
            label: 'New Window',
            handler: () => alert('New Window'),
            // show/hide option based on condition function
            condition: () => true,
          },
        ],
      },
      {
        group: 'Open',
        hideLabel: true,
        items: [
          { label: 'Open File', handler: () => alert('Open File') },
          { label: 'Open Folder' },
        ],
      },
      {
        group: 'Delete',
        items: [{ label: 'Delete File' }, { label: 'Delete Folder' }],
      },
    ]"
  >
    <template v-slot="{ open }">
      <button
        :class="[
          'rounded-md px-3 py-1 text-base font-medium',
          open ? 'bg-pink-200' : 'bg-pink-100',
        ]"
      >
        File
      </button>
    </template>
  </Dropdown>
</template>

<script setup>
import { Dropdown } from 'frappe-ui'
</script>
```

## Props

| Name        | Default  | Value                     | Description                                      |
| :---------- | :------- | :------------------------ | :----------------------------------------------- |
| `options`   | `null`   | `Array`                   | See [options](#options)                          |
| `button`    | `null`   | `String`                  | Object that is sent as props to Button component |
| `placement` | `'left'` | `left \| center \| right` | Placement of dropdown with respect to button     |

## `options`

The only required prop for Dropdown is `options`. It can be a list of options or
a list of groups of options.

```js
// list of options
options = [
  {
    label,
    handler,
    icon, // optional
    component, // optional
  },
  ...
]

// list of groups of options
options = [
  {
    group,
    hideLabel,
    items: [
      {
        label,
        handler,
        icon, // optional
        component, // optional
      },
      ...
    ]
  }
]
```
