# TabButtons

A row of buttons that picks one value, such as a filter, a setting or a form
field. To switch between panels or pages, use [Tabs](./tabs) instead.

<ComponentPlayground name="TabButtons" />

## Examples

### Settings rows

A value picker at the end of each settings row.

<ComponentPreview name="TabButtons-SettingsRows" />

### Calendar toolbar

The default `sm` size has the same height as the toolbar buttons around it.

<ComponentPreview name="TabButtons-Toolbar" />

### List or calendar view

Options with `icon` show only the icon. The `label` becomes the name screen
readers announce.

<ComponentPreview name="TabButtons-ViewToggle" />

### Report period

With `fluid`, the buttons share the container width equally.

<ComponentPreview name="TabButtons-Fluid" />

### Property panel

Fixed-width `fluid` controls in a property panel. The options mix icon-only and
text items.

<ComponentPreview name="TabButtons-InspectorRows" />

### Notification filter with counts

The `#prefix` slot puts an icon before each label, and the `#suffix` slot shows
a count after it. Both receive `{ button, active, disabled }`.

<ComponentPreview name="TabButtons-InboxCounts" />

## Behavior

### TabButtons or Tabs

TabButtons and Tabs share the same variants, sizes and option fields, and look
the same at the same `variant` and `size`. The difference is meaning:
TabButtons is a radio group that picks a value, and Tabs switches the content
shown below it.

### Options

Each option needs a `value` and a `label`.

- `icon` makes an icon-only tab. The `label` becomes its `aria-label` and
  `title`.
- `iconLeft` shows an icon before the visible label.
- `route` renders the tab as a router link. `href` renders it as an `<a>` that
  opens in a new tab.
- `disabled` makes the tab a disabled `<button>`, even when it has a `route` or
  `href`.
- `onClick` runs when the tab is clicked.

### Without v-model

Without a `v-model`, TabButtons keeps the selected value itself and still
emits `update:modelValue`.

### Vertical

`vertical` stacks the buttons in a column. With `variant="browser-tab"`,
`side="left"` or `side="right"` sets the edge the selected tab attaches to.

### Attributes

Attributes and classes on `TabButtons` go to the root element. Each tab has a
`data-value` attribute set to its option's `value`, so CSS can target one tab.
Options have no `class` field.

## Accessibility

TabButtons is a `radiogroup`, and each tab is a radio. The group is a single
tab stop: `Tab` moves focus to the selected option, or to the first enabled
option when nothing is selected.

| Key                                    | Action                                     |
| -------------------------------------- | ------------------------------------------ |
| `Tab`                                  | Moves focus into the group, then out of it |
| `ArrowRight` (`ArrowDown` when vertical) | Selects the next option                  |
| `ArrowLeft` (`ArrowUp` when vertical)  | Selects the previous option                |

The arrow keys skip disabled options.

## Migrating from v0

See the [migration guide](../migration#tabbuttons) for the full list.

- `type` is renamed to `variant`, matching `TabList`.
- The deprecated `buttons` prop is removed. Use `options`.
- `value` is required on every option, and boolean values are no longer
  accepted. The label-as-value fallback and the `active: true` fallback are
  removed. The model is the only source of the selected value.
- `fluid` is new. The buttons stretch to fill the container width. It replaces
  CSS and wrapper `div` workarounds.
- `class` on an option object is removed. Target one tab through its
  `data-value` attribute instead. See [Attributes](#attributes) and the
  [migration guide](../migration#tabbuttons-class).

TabButtons no longer wraps `<Button>`. Each tab is a native `<button>`,
`<a href>` or `<RouterLink>` that renders a `<Pill>`. This breaks code that
passed Button props through option entries:

- `theme`, `variant`, `size`, `loading` and `prefix` on individual options are
  no longer used. Use `Button` or `Pill` directly if you need per-tab theming or
  a loading spinner.
- `hideLabel` on options is gone. Use `icon` for an icon-only tab. Its required
  `label` becomes the accessible name. Use `iconLeft` for an icon before a
  visible label, and the `#suffix` slot for content after it.
- `route` and `href` on options still work: a tab renders as a `<RouterLink>`
  when `route` is set, or as an `<a href target=_blank>` when `href` is set.
- The per-tab `tooltip` field is removed. Put help text in your own UI when a
  label alone is not enough.

<!-- @include: ./TabButtons.api.md -->
