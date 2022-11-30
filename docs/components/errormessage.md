<script setup>
import { ErrorMessage } from '../../src/index'

let error = null
try {
  throw new Error('An error occurred')
} catch (e) {
  error = e
}
</script>

# ErrorMessage

The ErrorMessage component is used to show an error message when an action has
failed.

## Usage

You can pass an error message as a string to `message` prop. You can also pass
an
[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
object directly to `message` prop.

The component won't render if `message` is falsy. So, you don't have to write
the `v-if` directive.

<Story class="gap-4 flex-col">
    <ErrorMessage message="Task failed successfully" />
    <ErrorMessage :message="error" />
    <ErrorMessage :message="null" />
</Story>

```vue
<template>
  <ErrorMessage message="Task failed successfully" />
  <ErrorMessage :message="error" />
  <ErrorMessage :message="null" />
</template>

<script setup>
import { ErrorMessage } from 'frappe-ui'

let error = null
try {
  throw new Error('An error occurred')
} catch (e) {
  error = e
}
</script>
```

## Props

| Name      | Default | Value             | Description              |
| :-------- | :------ | :---------------- | :----------------------- |
| `message` | `null`  | `String \| Error` | Message to show as error |
