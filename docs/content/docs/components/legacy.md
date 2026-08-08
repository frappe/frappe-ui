# Legacy components

## Removed in v1

These are no longer in the library. The
[migration guide](../migration#autocomplete-removed) has a before/after for
each.

- **`Input`** — use [`TextInput`](./textinput) for text-like inputs (`text`,
  `number`, `email`, `password`, `date`), [`Textarea`](./textarea),
  [`Select`](./select), and [`Checkbox`](./checkbox) for the other type
  modes the original `Input` accepted. `TextInput` and friends share a
  labeling contract (`label`, `description`, `error`, `required`) and a
  sized/variant API that `Input` never had.
- **`Autocomplete`** — use [`Combobox`](./combobox) for single-select and
  [`MultiSelect`](./multiselect) for multi-select. Both use the shared
  input primitives, render the same label/description/error contract as
  the rest of the v1 input family, and have a smaller, more predictable
  API surface.
- **`FormControl type="autocomplete"`** — use `type="combobox"`, or a
  standalone [`Combobox`](./combobox), which exposes the full set of slots
  and props without the wrapper layer. Removing this one is **silent**:
  the type falls through to a plain text input rather than failing.
- **`TextEditor`, `TextEditorBubbleMenu`, `TextEditorFixedMenu`,
  `TextEditorFloatingMenu`, `TextEditorContent`, `createEditorButton`** — use
  [`Editor`](../molecules/editor) and its building blocks from the
  `frappe-ui/editor` subpath. See the [Editor migration
  section](../migration#editor) for the full before/after.
