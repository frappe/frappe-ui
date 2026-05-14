# FormControl

A single import for building consistent forms. `FormControl` picks the right input component based on its `type` and forwards `label`, `description`, `error`, and `required` down to it. Use it when you want a uniform API across every kind of control in a form.

## Example
A realistic create-account form using every control type.

<ComponentPreview name="FormControl-RealForm" layout="stacked" />

## Supported input types

`FormControl` can render these control types:

- text-like inputs via `TextInput` (`text`, `email`, `password`, `number`, `date`, etc.)
- `textarea`
- `select`
- `combobox`
- `multiselect`
- `checkbox`

> `type="autocomplete"` is deprecated. See
> [Legacy components](./legacy#formcontrol-with-type-autocomplete).

## Labeling, description, and error

`label`, `description`, `error`, and `required` flow through to the underlying control, which owns the rendered label, helper text, and error message. Set `error` to flip `aria-invalid` on the control and replace the description with the error message.

```vue
<FormControl
  v-model="email"
  type="email"
  label="Email"
  description="We'll never share your email."
  :error="errors.email"
  required
/>
```

Each underlying component (`TextInput`, `Select`, `Combobox`, `MultiSelect`, `Textarea`, `Checkbox`) also accepts these props directly — reach for the underlying component when you don't need a uniform dispatcher.

## Attribute forwarding

Other props such as `placeholder`, `disabled`, `modelValue`, `options`, and similar control-specific attributes are forwarded to the rendered input. This means `FormControl` acts as a convenience wrapper rather than redefining every prop from each underlying control.

## Slot forwarding

All slots are forwarded to the rendered child generically. The available slots depend on the rendered control type — for example, `#prefix` / `#suffix` for `TextInput`, `#item-prefix` / `#item-label` for `Select` and `Combobox`, etc.

## Usage notes

- Prefer `FormControl` for standard forms where consistency matters more than custom structure.
- Prefer the underlying component directly when you need full control over layout or component-specific features.

<!-- @include: ../../../meta/FormControl.md -->
