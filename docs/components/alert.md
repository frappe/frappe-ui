<script setup>
import { Alert, Button } from '../../src/index'
</script>

# Alert

## Usage

<Story class="gap-4" :iframe="true">
  <Alert title="Info">
    <span>
    This is a test alert message
    </span>
    <template #actions>
        <Button appearance="primary">Take Action</Button>
    </template>
  </Alert>
</Story>

```vue
<template>
  <Alert title="Info">
    <span> This is a test alert message </span>
    <template #actions>
      <Button appearance="primary">Take Action</Button>
    </template>
  </Alert>
</template>

<script setup>
import { Alert, Button } from 'frappe-ui'
</script>
```

## Props

| Name    | Default | Value    |
| :------ | :------ | :------- |
| `title` | `null`  | `String` |

## Slots

| Name      | Description                        |
| :-------- | :--------------------------------- |
| `default` | Default slot to render the message |
