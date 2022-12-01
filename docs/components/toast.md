<script setup>
import { Toasts, Toast, toast, Button } from '../../src/index'
let makeToast = (props = {}) => toast({
    title: 'Success',
    text: 'File Uploaded Successfully!',
    timeout: 2,
    ...props
})
</script>

# Toast

This component is used to show a message in a floating box relative to the
browser window.

## Usage

Call the `toast` function with options to create a toast. You need to make sure
you include the `Toasts` component in your root component
([`App.vue`](#app-vue)).

<Story>
  <Button
    @click="
      toast({
        title: 'Success',
        text: 'File Uploaded Successfully!',
        icon: 'check',
        iconClasses: 'text-green-500',
      })
    "
  >
    Show Toast
  </Button>
  <Toasts />
</Story>

```vue
<template>
  <Button
    @click="
      toast({
        title: 'Success',
        text: 'File Uploaded Successfully!',
        icon: 'check',
        iconClasses: 'text-green-500',
      })
    "
  >
    Show Toast
  </Button>
</template>

<script setup>
import { toast, Button } from 'frappe-ui'
</script>
```

### App.vue

```vue
<template>
  <!-- your markup -->
  <Toasts />
</template>
<script setup>
import { Toasts } from 'frappe-ui'
</script>
```

### `position`

Toasts can be positioned in six places with respect to the browser window.

- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`

<Story>
    <div class="grid grid-cols-3 gap-4">
        <Button @click="makeToast({ position: 'top-left' })"> Top Left </Button>
        <Button @click="makeToast({ position: 'top-center' })"> Top Center </Button>
        <Button @click="makeToast({ position: 'top-right' })"> Top Right </Button>
        <Button @click="makeToast({ position: 'bottom-left' })">
        Bottom Left
        </Button>
        <Button @click="makeToast({ position: 'bottom-center' })">
        Bottom Center
        </Button>
        <Button @click="makeToast({ position: 'bottom-right' })">
        Bottom Right
        </Button>
    </div>
    <Toasts />
</Story>

<!-- prettier-ignore-start -->
```vue
<template>
  <div class="grid grid-cols-3 gap-4">
    <Button @click="makeToast({ position: 'top-left' })"> Top Left </Button>
    <Button @click="makeToast({ position: 'top-center' })"> Top Center </Button>
    <Button @click="makeToast({ position: 'top-right' })"> Top Right </Button>
    <Button @click="makeToast({ position: 'bottom-left' })"> Bottom Left </Button>
    <Button @click="makeToast({ position: 'bottom-center' })"> Bottom Center </Button>
    <Button @click="makeToast({ position: 'bottom-right' })"> Bottom Right </Button>
  </div>
</template>

<script setup>
import { Tooltip, Button } from 'frappe-ui'

let makeToast = (props = {}) => toast({
    title: 'Success',
    text: 'File Uploaded Successfully!',
    timeout: 2,
    ...props
})
</script>
```
<!-- prettier-ignore-end -->

## Options

| Name          | Default        | Value                                         |
| :------------ | :------------- | :-------------------------------------------- |
| `title`       | `null`         | `String`                                      |
| `text`        | `null`         | `String`                                      |
| `timeout`     | `5`            | `Number` in seconds                           |
| `position`    | `'top-center'` | See [position](#position)                     |
| `icon`        | `null`         | [FeatherIcon](/components/feathericon) name   |
| `iconClasses` | `null`         | CSS Classes to apply to FeatherIcon component |
