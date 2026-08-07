# Legacy components

These components are deprecated and emit a `console.warn` in development.
They remain in the library for now to keep existing apps building, but new
code should use the replacements listed below. Each will be removed in a
future major release.

## Input

Replaced by [`TextInput`](./textinput) for text-like inputs (`text`,
`number`, `email`, `password`, `date`), [`Textarea`](./textarea),
[`Select`](./select), and [`Checkbox`](./checkbox) for the other type
modes the original `Input` accepted.

`TextInput` and friends share a labeling contract (`label`, `description`,
`error`, `required`) and a sized/variant API that the legacy `Input`
component does not.

## Removed in v1

These are no longer in the library. The
[migration guide](../migration#autocomplete-removed) has a before/after for
each.

- **`Autocomplete`** — use [`Combobox`](./combobox) for single-select and
  [`MultiSelect`](./multiselect) for multi-select. Both use the shared
  input primitives, render the same label/description/error contract as
  the rest of the v1 input family, and have a smaller, more predictable
  API surface.
- **`FormControl type="autocomplete"`** — use `type="combobox"`, or a
  standalone [`Combobox`](./combobox), which exposes the full set of slots
  and props without the wrapper layer. Removing this one is **silent**:
  the type falls through to a plain text input rather than failing.
