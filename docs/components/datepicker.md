<script setup>
import { ref } from 'vue';
import { DatePicker } from '../../src/index'
let date = ref(null)
</script>

# DatePicker

The DatePicker component is a prettier alternative to `<input type="date">`

## Usage

<Story class="gap-4">
<div class="space-y-4">
  <DatePicker v-model="date" />
  <DatePicker
    v-model="date"
    placeholder="Select your birthday"
    :formatValue="(val) => val.split('-').reverse().join('-')"
  />
  <pre class="text-base">Value: {{ date }}</pre>
</div>
</Story>

```vue
<template>
  <DatePicker v-model="date" />

  <DatePicker
    v-model="date"
    placeholder="Select your birthday"
    :formatValue="(val) => val.split('-').reverse().join('-')"
  />
</template>

<script setup>
import { ref } from 'vue'
import { DatePicker } from 'frappe-ui'
let date = ref(null)
</script>
```

## Props

| Name          | Default | Value      | Description                                   |
| :------------ | :------ | :--------- | :-------------------------------------------- |
| `placeholder` | `null`  | `String`   |                                               |
| `formatValue` | `null`  | `Function` | Function to format the date value for display |
