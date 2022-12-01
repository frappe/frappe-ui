<script setup>
import { ref } from 'vue'
import { Autocomplete } from '../../src/index'
let fruit = ref(null)
</script>

# Autocomplete

The Autocomplete component is used to select an option from a list of options.
Additionally, it provides a search input to filter the options.

## Usage

<Story>
    <div class="w-1/2">
        <Autocomplete
            :options="[
                {label: 'Apple', value: 'apple'},
                {label: 'Banana', value: 'banana'},
                {label: 'Orange', value: 'orange'},
            ]"
            v-model="fruit"
            placeholder="Select a fruit"
        />
        <div class="text-base mt-4">Selected Value:</div>
        <pre class="text-base">{{ JSON.stringify(fruit) }}</pre>
    </div>
</Story>

```vue
<template>
  <Autocomplete
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Orange', value: 'orange' },
    ]"
    v-model="fruit"
    placeholder="Select a fruit"
  />
</template>

<script>
import { ref } from 'vue'
import { Autocomplete } from 'frappe-ui'
let fruit = ref(null)
</script>
```

## Props

| Name          | Default | Value    | Description                                                                                                                                                                       |
| :------------ | :------ | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `null`  | `Object` | No need to directly pass this prop. Just use `v-model`.                                                                                                                           |
| `value`       | `null`  | `Object` | This prop should be used if you are not using `v-model`. Value must be one of the options object from `options` or `null`. This object must be a direct reference and not a copy. |
| `options`     | `null`  | `Array`  | Array of objects with `label` and `value` keys                                                                                                                                    |
| `placeholder` | `null`  | `String` | String to show as placeholder when no value is set                                                                                                                                |

## Events

| Name                | Description                                                                    |
| :------------------ | :----------------------------------------------------------------------------- |
| `update:modelValue` | This event is emitted when value is changed or unset and `v-model` is used.    |
| `change`            | This event is emitted when value is changed or unset and `value` prop is used. |
