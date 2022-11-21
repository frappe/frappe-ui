<script setup>
import { Tooltip, Button } from '../../src/index'
</script>

# Tooltip

This component is a wrapper over the [Popover](/components/popover) component
for an easy way to show tooltips on hover over elements.

## Usage

<Story class="gap-4 flex-col">
  <Tooltip text="Edit Post">
    <Button icon="edit" label="Edit Post" />
  </Tooltip>
</Story>

```vue
<template>
  <Tooltip text="Edit Post">
    <Button icon="edit" label="Edit" />
  </Tooltip>
</template>

<script setup>
import { Tooltip, Button } from 'frappe-ui'
</script>
```

## Props

| Name         | Default | Value                                                                                                                                        |
| :----------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`       | `null`  | `String`                                                                                                                                     |
| `hoverDelay` | `0.5`   | `Number` in seconds                                                                                                                          |
| `placement`  | `'top'` | `top-start \| top \| top-end \| bottom-start \| bottom \| bottom-end \| right-start \| right \| right-end \| left-start \| left \| left-end` |

## Slots

| Name      | Description                                  |
| :-------- | :------------------------------------------- |
| `default` | Default slot to render the reference element |
