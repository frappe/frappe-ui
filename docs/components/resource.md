<script setup>
import { Resource, Button } from '../../src/index'
</script>

# Resource

This is a headless component wrapper over [Resource](/resources/resource).

## Usage

The Resource component does not render any markup. It provides the resource
object via slotProps.

<Story>
  <Resource
    :options="{
      url: 'https://jsonplaceholder.typicode.com/users/1',
    }"
    v-slot="{ resource }"
  >
    <div class="w-full">
      <Button @click="resource.fetch()" :loading="resource.loading">
        Fetch User
      </Button>
      <pre>{{ resource.data }}</pre>
    </div>
  </Resource>
</Story>

```vue
<template>
  <Resource
    :options="{
      url: 'https://jsonplaceholder.typicode.com/users/1',
    }"
    v-slot="{ resource }"
  >
    <div class="w-full">
      <Button @click="resource.fetch()" :loading="resource.loading">
        Fetch Post
      </Button>
      <pre>{{ resource.data }}</pre>
    </div>
  </Resource>
</template>

<script setup>
import { Resource, Button } from 'frappe-ui'
</script>
```

## Props

| Name      | Default | Value                                                                |
| :-------- | :------ | :------------------------------------------------------------------- |
| `options` | `null`  | [Resource Options](/resources/resource.html#list-of-options-and-api) |
