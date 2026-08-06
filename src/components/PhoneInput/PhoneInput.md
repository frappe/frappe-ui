# PhoneInput

`PhoneInput` is a form control component for capturing international phone numbers with country code search, flags, and standard `frappe-ui` input labeling.

## Usage

```vue
<template>
  <PhoneInput
    v-model="phone"
    label="Mobile Number"
    description="Enter your mobile number with country code"
    default_country="IN"
    placeholder="Enter phone number"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PhoneInput } from 'frappe-ui'

const phone = ref('')
</script>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | The phone value (formatted as `[dialCode]-[number]`). |
| `label` | `string` | `undefined` | Label text above input field. |
| `description` | `string` | `undefined` | Helper text below input field. |
| `error` | `string \| FrappeUIError` | `undefined` | Error message or error object. |
| `required` | `boolean` | `false` | Marks field as required. |
| `disabled` | `boolean` | `false` | Disables input. |
| `loading` | `boolean` | `false` | Sets loading state. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Size variant of the input field. |
| `variant` | `'subtle' \| 'outline'` | `'subtle'` | Visual style variant of input. |
| `default_country` | `string` | `'in'` | Default country code or name (e.g. `'IN'`, `'US'`). |
| `placeholder` | `string` | `'Enter phone number'` | Input placeholder text. |
| `minlength` | `number \| string` | `undefined` | Minimum allowed length for the input number. |
| `maxlength` | `number \| string` | `undefined` | Maximum allowed length for the input number. |
| `countries` | `CountryCode[]` | `defaultCountries` | Array of country objects. |
| `fetchCountries` | `Function` | `undefined` | Custom sync/async country dataset fetcher function. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `value: string` | Emitted when phone number or country changes. |
| `change` | `value: string` | Emitted on input blur or value commit. |
| `country-change` | `country: CountryCode` | Emitted when a user selects a different country. |

## Country Object Interface

```ts
interface CountryCode {
  code: string
  name: string
  dialCode: string
  flag?: string
}
```
