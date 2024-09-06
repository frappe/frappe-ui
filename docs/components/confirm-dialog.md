# Confirm Dialog

This component is to confirm an action with the user.

## Usage

Call the `confirmDialog` function with options to show a confirmation dialog.
You need to make sure you include the `Dialogs` component in your root component
([`App.vue`](#app-vue)).

<Story>
  <Button
    @click="
      confirmDialog({
        title: 'Are you sure?',
        message: 'This will permanently delete the file. Are you sure you want to proceed?',
        onConfirm: ({ hideDialog }) => {
          // deleteFile()
          // hideDialog() // closes dialog
        },
      })
    "
  >
    Delete File
  </Button>
</Story>

```vue
<template>
  <Button
    @click="
      confirmDialog({
        title: 'Are you sure?',
        message:
          'This will permanently delete the file. Are you sure you want to proceed?',
        onConfirm: ({ hideDialog }) => {
          // deleteFile()
          // hideDialog() // closes dialog
        },
      })
    "
  >
    Delete File
  </Button>
</template>

<script setup>
import { confirmDialog, Button } from 'frappe-ui'
</script>
```

### App.vue

```vue
<template>
  <!-- your markup -->
  <Dialogs />
</template>
<script setup>
import { Dialogs } from 'frappe-ui'
</script>
```
