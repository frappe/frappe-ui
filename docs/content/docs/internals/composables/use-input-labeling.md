# useInputLabeling

Shared headless logic for input components: it wires up the label, description,
and error region of a form control, and computes the matching ARIA and `data-*`
attributes. All frappe-ui input components (TextInput, Select, Checkbox, etc.)
use it internally, so a custom control built with it gets the same behavior and
styling hooks for free.

> **Unstable API** — this composable is exported from `frappe-ui/internals`
> and can change or disappear in any release. See
> [Internals](/docs/internals/introduction).

## Usage

```vue
<template>
  <div class="space-y-1.5" v-bind="dataAttrs">
    <label v-if="props.label" :id="labelId" :for="inputId">
      {{ props.label }}
      <span v-if="props.required">*</span>
    </label>

    <input
      :id="inputId"
      :required="props.required"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-invalid="hasError || undefined"
    />

    <p v-if="showDescription" :id="descriptionId">
      {{ props.description }}
    </p>

    <div v-if="hasError" :id="errorMessageId">
      <p v-for="line in errorLines" :key="line">{{ line }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInputLabeling } from 'frappe-ui/internals'
import type { InputLabelingProps } from 'frappe-ui/internals'

const props = defineProps<InputLabelingProps & { size?: 'sm' | 'md' }>()

const {
  inputId,
  labelId,
  descriptionId,
  errorMessageId,
  labelledBy,
  describedBy,
  hasError,
  errorLines,
  showDescription,
  dataAttrs,
} = useInputLabeling(props, {
  size: () => props.size,
})
</script>
```

## Signature

```ts
function useInputLabeling(
  props: InputLabelingProps,
  options?: UseInputLabelingOptions,
)
```

### Props

The first argument is the component's reactive `props` object, conforming to
`InputLabelingProps`:

| Prop          | Type                     | Description                                                                                                                       |
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`                 | Label rendered above (or beside, for binary controls) the input.                                                                   |
| `description` | `string`                 | Helper text rendered below the input. Hidden when `error` is set.                                                                  |
| `error`       | `string \| FrappeUIError` | Error message rendered below the input. An `Error` with `messages?: string[]` (as returned by Frappe's API) renders stacked lines. |
| `required`    | `boolean`                | Marks the field as required and forwards `required` / `aria-required` to the control.                                              |
| `id`          | `string`                 | HTML id of the underlying control. Auto-generated if omitted.                                                                       |

### Options

The second argument provides reactive getters used to compute `dataAttrs`:

| Option     | Type                            | Description                                            |
| ---------- | ------------------------------- | ------------------------------------------------------ |
| `size`     | `() => InputSize \| ToggleSize` | Size token for `data-size`.                            |
| `variant`  | `() => InputVariant`            | Variant token for `data-variant`.                      |
| `disabled` | `() => boolean`                 | Disabled state for `data-disabled`.                    |
| `state`    | `() => string`                  | State token override for `data-state` (e.g. `'checked'`). |

## Return value

| Key               | Type                       | Description                                                                                       |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------- |
| `inputId`         | `ComputedRef<string>`      | Id for the underlying control (`props.id` or auto-generated).                                      |
| `labelId`         | `ComputedRef<string>`      | Id for the label element.                                                                          |
| `descriptionId`   | `ComputedRef<string>`      | Id for the description element.                                                                    |
| `errorMessageId`  | `ComputedRef<string>`      | Id for the error region.                                                                           |
| `labelledBy`      | `ComputedRef<string \| undefined>` | Value for `aria-labelledby`; set only when a label is present.                              |
| `describedBy`     | `ComputedRef<string \| undefined>` | Value for `aria-describedby`; combines description and error ids.                          |
| `hasError`        | `ComputedRef<boolean>`     | Whether a non-empty error is set.                                                                  |
| `errorLines`      | `ComputedRef<string[]>`    | Error text split into renderable lines (supports Frappe's multi-message errors).                   |
| `showDescription` | `ComputedRef<boolean>`     | Whether to render the description (hidden while an error is shown).                                |
| `dataAttrs`       | `ComputedRef<Record<string, string>>` | `data-state` / `data-size` / `data-variant` / `data-disabled` / `data-required` attributes for the root element. |

When an error is present, `dataAttrs['data-state']` is `'invalid'`; otherwise
it is the `state` option's value or `'valid'`.
