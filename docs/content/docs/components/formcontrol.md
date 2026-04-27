# FormControl

Provides a consistent wrapper for common form inputs. It handles label rendering, helper text, and consistent spacing so related controls feel uniform in forms.

Use `FormControl` when you want a convenient default wrapper around the library's input primitives. For more specialized layouts or richer behavior, use the underlying component directly.

## Supported input types

`FormControl` can render these control types:

- text-like inputs via `TextInput`
- `textarea`
- `select`
- `combobox`
- `checkbox`

> `type="autocomplete"` is deprecated. See
> [Legacy components](./legacy#formcontrol-with-type-autocomplete).

## Attribute forwarding

Props such as `placeholder`, `disabled`, `modelValue`, `options`, and similar control-specific attributes are forwarded to the rendered input component.

This means `FormControl` acts as a convenience wrapper rather than redefining every prop from each underlying control.

## Slot behavior

Available slots depend on the rendered control type:

- `prefix` and `suffix` are useful for text-like inputs and select-like controls
- `description` replaces the description text block below the control

## Usage notes

- Prefer `FormControl` for standard forms where consistency matters more than custom structure.
- Prefer the underlying component directly when you need full control over layout or advanced component-specific features.
- Checkbox rendering differs from the other types because it renders the checkbox control directly instead of using the label + description wrapper layout.

<!-- @include: ../../../meta/FormControl.md -->
