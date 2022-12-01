<script setup>
import { ref } from 'vue'
import { Input } from '../../src/index'
let fullName = ref('')
</script>

# Input

The Input component is a prettier version of `<input />` with some additional
features.

## Usage

<Story class="gap-4">
  <div class="w-full sm:w-1/2 space-y-4">
    <Input label="Full Name" placeholder="Jane Doe" v-model="fullName" />
    <Input label="Email" type="email" placeholder="jane@example.com" icon-left="mail" />
    <Input label="Country" type="select" :options="['India', 'Not India']" icon-left="globe" />
    <Input label="Bio" type="textarea" />
    <Input label="I have read terms and conditions" type="checkbox" />
  </div>
</Story>

```vue
<template>
  <Input label="Full Name" placeholder="Jane Doe" v-model="fullName" />
  <Input label="Email" type="email" placeholder="jane@example.com" />
  <Input label="Country" type="select" :options="['India', 'Not India']" />
  <Input label="Bio" type="textarea" />
  <Input label="I have read terms and conditions" type="checkbox" />
</template>

<script setup>
import { ref } from 'vue'
import { Input } from 'frappe-ui'
let fullName = ref('')
</script>
```

## Props

| Name          | Default  | Value                                                                           | Description                                             |
| :------------ | :------- | :------------------------------------------------------------------------------ | :------------------------------------------------------ |
| `label`       | `null`   | `String`                                                                        | Input label                                             |
| `type`        | `'text'` | `text \| number \| checkbox \| textarea \| select \| email \| password \| date` | Type of input                                           |
| `placeholder` | `null`   | `String`                                                                        | Input placeholder                                       |
| `inputClass`  | `null`   | `String \| Object \| Array`                                                     | Classes to apply to `input` element and not the wrapper |
| `iconLeft`    | `null`   | [FeatherIcon](/components/feathericon) name                                     | Show an icon to the left of the input                   |
| `debounce`    | `null`   | `Number`                                                                        | Debounce (in ms) applied to the `input` event           |
| `options`     | `null`   | `{label, value}[] \| String[]`                                                  | Only applicable if `type` is `select`                   |
| `disabled`    | `false`  | `Boolean`                                                                       | Disable input by setting this to `true`                 |
| `rows`        | `3`      | `Number`                                                                        | Only applicable if `type` is `textarea`                 |
