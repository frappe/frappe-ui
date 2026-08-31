# TabButtons

A segmented control with radiogroup semantics. It picks a value for a filter, a
setting, or a form field.

Use [Tabs](./tabs) when the UI switches visible panels or routes. The two share
variants, sizes, and the item vocabulary, and are pixel-identical at the same
`variant` and `size`. The choice is semantic, not visual.

## Playground

<ComponentPlayground name="TabButtons" />

## Variants

<ComponentPreview name="TabButtons-Variants" />

## Sizes

<ComponentPreview name="TabButtons-Sizes" />

## Filter

The plain `subtle` control: a content filter above a list.

<ComponentPreview name="TabButtons-Filter" />

## Settings rows

Value pickers on the trailing side of settings rows.

<ComponentPreview name="TabButtons-SettingsRows" />

## Toolbar

The `sm` size lines up with toolbar buttons and selects.

<ComponentPreview name="TabButtons-Toolbar" />

## View toggle

Icon-only options take `icon`; the `label` becomes the accessible name.

<ComponentPreview name="TabButtons-ViewToggle" />

## Fluid

With `fluid`, the buttons stretch to equal widths and fill the container.

<ComponentPreview name="TabButtons-Fluid" />

## Inspector rows

Fixed-width `fluid` controls in a property panel. Options mix icon-only and text
items.

<ComponentPreview name="TabButtons-InspectorRows" />

## Vertical

<ComponentPreview name="TabButtons-Vertical" />

## Prefix and suffix

<ComponentPreview name="TabButtons-PrefixSuffix" />

## Styling a single tab

Each tab exposes data-attribute hooks for styling:

- `data-slot="tab-button"` on every tab.
- `data-value` carries that tab's `value`, so CSS can address one tab.
- `data-state="checked|unchecked"` and `data-disabled` for state.

This is the only way to style one specific tab. The per-option `class` field
was removed in `1.0.0`.

```vue
<template>
  <TabButtons class="status-tabs" v-model="status" :options="options" />
</template>

<style scoped>
.status-tabs :deep([data-slot='tab-button'][data-value='open']) {
  color: var(--ink-red-3);
}
</style>
```

<!-- @include: ./TabButtons.api.md -->

## Migration from v0

See the [migration guide](../migration#tabbuttons) for the full list.

- `type` is renamed to `variant`, matching `TabList`.
- The deprecated `buttons` prop is removed — use `options`.
- `value` is required on every option, and boolean values are no longer
  accepted. The label-as-value fallback and the `active: true` fallback are
  removed; the model is the single source of truth.
- `fluid` is new — buttons stretch to fill the container width. It replaces
  raw-CSS and wrapper-div workarounds.
- `class` on an option object is removed. Style one tab through
  `data-value` instead — see [Styling a single tab](#styling-a-single-tab).

TabButtons no longer wraps `<Button>` internally — each tab is a native
`<button>`, `<a href>`, or `<RouterLink>` rendering a `<Pill>` for its visual
treatment. This breaks consumers that passed Button props through option
entries:

- `theme`, `variant`, `size`, `loading`, `prefix` on individual options are no
  longer honored. Use `Button` or `Pill` directly if you need per-tab theming or
  a loading spinner.
- `hideLabel` on options is gone. Use `icon` for an icon-only tab — its `label`,
  if provided, is automatically exposed as accessibility text. Use `iconLeft`
  for an accent icon before a visible label, and the `#suffix` slot for
  trailing content.
- `route` and `href` on options are honored: a tab renders as a `<RouterLink>`
  when `route` is set, or an `<a href target=_blank>` when `href` is set.
- The per-tab `tooltip` value surfaces as the native `title` attribute rather
  than the floating `<Tooltip>` popover. Wrap the `TabButtons` instance in a
  custom tooltip if you need styled behavior.
