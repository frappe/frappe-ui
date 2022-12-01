<script setup>
import { LoadingIndicator } from '../../src/index'
</script>

# Loading Indicator

This component is used to show a pending state for async and long running
actions.

## Usage

This component doesn't accept any props. However, you can customize its size and
color using the `class` or `style` attribute.

<Story class="gap-4">
  <LoadingIndicator class="w-4" />
  <LoadingIndicator class="w-5 text-gray-500" />
  <LoadingIndicator class="w-6 text-blue-500" />
</Story>

```vue
<template>
  <LoadingIndicator class="w-4" />
  <LoadingIndicator class="w-5 text-gray-500" />
  <LoadingIndicator class="w-6 text-blue-500" />
</template>

<script setup>
import { LoadingIndicator } from 'frappe-ui'
</script>
```
