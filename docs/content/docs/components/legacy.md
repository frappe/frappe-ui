# Legacy components

Two different things happened to the v0 library. They need different work
from you, so check which one applies before you start.

| State | Import path | What to do |
| --- | --- | --- |
| **Removed** | none — the import fails | Rewrite the call site against the replacement |
| **Parked** | `frappe-ui/experimental` | Change the import path, then plan the move |

A removed component is gone for good and has a named replacement. A parked
component still ships and still works: it moved to the
[`frappe-ui/experimental`](/docs/experimental) subpath while its future is
decided, and it can come back to the root export or be deleted in any
release. Parked components are exempt from the deprecation policy, so treat
the import-path change as a stopgap, not a destination.

## Removed in v1

These are no longer in the library. The import fails at build time unless the
entry says otherwise. Most have a before/after in the
[migration guide](../migration); the rest are in the
[changelog](../changelog).

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
- **`MonthPicker`** — use [`Select`](./select) with month options. It
  duplicated `Select` for a narrower case.
- **`CircularProgressBar`** — use [`Progress`](./progress), or copy the old
  SFC into your app if you need the radial form. It was a second component
  for `Progress`'s concept, with hardcoded light-mode colors.
- **`FeatherIcon`** — use a `lucide-*` icon class, or pass a component. See
  [Icons](../other/icons) for the icon-class system.
- **`NestedPopover`** — use [`Popover`](./popover). It never nested anything.
- **`Card`, `ListItem`, standalone `<Toast>`** — three unmaintained wrappers.
  `Card` and `ListItem` have no drop-in replacement; rebuild the layout with
  plain markup (the migration guide has the before/after). For `<Toast>`, call
  the imperative [`toast`](./toast) API, which is unchanged.
- **`ListFilter`** — build filter UI in app code with [`Select`](./select)
  and [`Combobox`](./combobox).
- **`GridLayout`** — depend on `grid-layout-plus` directly. It was a thin
  passthrough with no docs page and no tests.
- **`CommandPalette`, `CommandPaletteItem`** — use the rebuilt family on
  [`frappe-ui/experimental`](/docs/experimental#commandpalette). The names carry
  over but the API does not: you compose the parts and write the rows instead of
  passing one `groups` shape, and the palette no longer registers `Mod+K` for
  you. It is a rewrite, not an import-path change. See the
  [CommandPalette migration section](../migration#commandpalette).

## Parked in `frappe-ui/experimental`

These still work. They left the root export, so the import path changes, and
they carry no stability promise while they sit there. The
[Experimental overview](/docs/experimental) states what each one is waiting
on.

- **`ListView`** and its row/column parts — import from
  [`frappe-ui/experimental`](/docs/experimental#listview).
  [`frappe-ui/list`](../molecules/list) is the replacement for new code, but
  it has no equivalent for ListView's config-driven columns yet, so ListView
  stays parked until it does. Page:
  [ListView](../experimental/listview).
- **`Calendar`** — import from
  [`frappe-ui/experimental`](/docs/experimental#calendar). The public API is
  unchanged; it stays parked until a redesigned calendar family replaces it.
  Page: [Calendar](../experimental/calendar).
- **`TextEditor`, `TextEditorBubbleMenu`, `TextEditorFixedMenu`,
  `TextEditorFloatingMenu`, `TextEditorContent`, `createEditorButton`** —
  import from [`frappe-ui/experimental`](/docs/experimental#texteditor-v0).
  [`Editor`](../molecules/editor) and its building blocks from the
  `frappe-ui/editor` subpath are the replacement; see the
  [Editor migration section](../migration#editor) for the full before/after.
- **`AxisChart`, `DonutChart`, `FunnelChart`, `NumberChart`, `ECharts`,
  `useAxisChartOptions`** — import from
  [`frappe-ui/experimental`](/docs/experimental#charts-v1).
  [`frappe-ui/charts`](../charts/overview) is the replacement family and
  draws everything these did.
- **`Icon`, `IconPicker`, `spritePlugin`** (the sprite icon trio) — import
  from [`frappe-ui/experimental`](/docs/experimental#sprite-icons).
  `lucide-*` classes and the root [`Icon`](./icon) component are the
  canonical way to render icons, so this trio will be removed.
