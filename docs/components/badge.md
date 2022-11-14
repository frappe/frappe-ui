<script setup>
import {Badge} from '../../src/index'
let colorMap = {
    'Success': 'green',
    'Warning': 'yellow',
    'Info': 'blue',
}
</script>

# Badge

The Badge component is used to show a status badge for an entity.

## Usage

<Story class="gap-4">
    <Badge>Draft</Badge>
    <Badge color="yellow">Pending</Badge>
    <Badge color="green">Completed</Badge>
    <Badge color="red">Error</Badge>
    <Badge color="blue">In Progress</Badge>
    <Badge :colorMap="colorMap" label="Success" />
    <Badge :colorMap="colorMap" label="Warning" />
    <Badge :colorMap="colorMap" label="Info" />
</Story>

```vue
<template>
  <Badge>Draft</Badge>
  <Badge color="yellow">Pending</Badge>
  <Badge color="green">Completed</Badge>
  <Badge color="red">Error</Badge>
  <Badge color="blue">In Progress</Badge>
  <!-- using colorMap and label -->
  <Badge :colorMap="colorMap" label="Success" />
  <Badge :colorMap="colorMap" label="Warning" />
  <Badge :colorMap="colorMap" label="Info" />
</template>

<script setup>
import { Badge } from 'frappe-ui'
let colorMap = {
  Success: 'green',
  Warning: 'yellow',
  Info: 'blue',
}
</script>
```

## Props

| Name       | Default  | Value                                    | Description                                          |
| :--------- | :------- | :--------------------------------------- | :--------------------------------------------------- |
| `color`    | `'gray'` | `gray \| yellow \| green \| red \| blue` |                                                      |
| `colorMap` | `null`   | `Object`                                 | An object containing label as key and color as value |
| `label`    | `null`   | `String`                                 | This must be passed when using `colorMap`            |
