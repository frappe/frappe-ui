# Tabs

Switches between panels of content, or between routes. Compose `TabList`,
`TabTrigger`, and `TabPanel` inside the `Tabs` root. The app owns the layout and
styles the parts directly.

Use `Tabs` when the UI switches visible panels or routes (tablist semantics).
Use [TabButtons](./tabbuttons) when the UI picks a value for a filter, a
setting, or a form field (radiogroup semantics). The two are pixel-identical at
the same `variant` and `size`.

## Playground

<ComponentPlayground name="Tabs" />

## Underline

The default variant. Common on record pages: one trigger per section, with a
leading icon.

<ComponentPreview name="Tabs-Underline" />

## Browser tabs

The `browser-tab` variant renders attached tabs. Use the `#suffix` slot for
count badges.

<ComponentPreview name="Tabs-BrowserTabCounts" />

A `TabPanel` attaches flush below the tab bar:

<ComponentPreview name="Tabs-BrowserTabTable" />

## Icon rail

Set `vertical` on the root for vertical orientation. An icon-only trigger takes
`icon` without a default slot; its `label` becomes the accessible name.

`vertical` sets the orientation, not the layout. In composed mode the root
ships no layout classes, so add `class="flex"` yourself to put the list beside
the panel. Shorthand mode (`tabs` prop) owns the whole structure and does this
for you.

<ComponentPreview name="Tabs-IconRail" />

## Sizes

`TabList` supports `sm` (default) and `md`.

<ComponentPreview name="Tabs-Sizes" />

## Disabled

A disabled trigger cannot be selected. Keyboard navigation skips it.

<ComponentPreview name="Tabs-Disabled" />

## Vertical browser tabs

With `variant="browser-tab"` and a vertical root, `side` sets the edge the
tabs attach to.

<ComponentPreview name="Tabs-VerticalBrowserTab" />

## Prefix slot

`#prefix` renders leading content inside a trigger, after `iconLeft`. It
receives `{ selected, disabled }`.

<ComponentPreview name="Tabs-Prefix" />

## Route mode

A trigger with `route` renders as a `RouterLink`. With no `v-model`, selection
derives from the current route. Clicking a trigger navigates and does not emit
`update:modelValue`. Omit the panels and place a `<router-view>` outside the
tabs.

<ComponentPreview name="Tabs-RouteMode" />

## Shorthand mode

For generated tab sets, pass a `tabs` array and the component renders the parts
itself. An item with a `condition` renders only while the function returns true.
When the selected tab disappears, the component selects the first visible
trigger and emits `update:modelValue`.

The `#tab-prefix`, `#tab-label`, `#tab-suffix`, and `#tab-panel` slots shape
every generated tab; each one receives its item as `tab`. Put app-defined
extras in the item's `data` field and read them as `tab.data`.

<ComponentPreview name="Tabs-Shorthand" />

<!-- @include: ./Tabs.api.md -->

## Migration from v0

The v0 `Tabs` was one component driven by a `tabs` array and an index-based
`v-model`. The v1 API is composed: the model is the trigger `value`, and the app
owns the `TabList` and `TabPanel` elements. See the
[migration guide](../migration#tabs) for the full list.

| Before                             | After                                        |
| ---------------------------------- | -------------------------------------------- |
| `v-model="index"` (number)         | `v-model="value"` (trigger `value`)          |
| `:tabs="[{ label: 'Emails' }]"`    | `value` is required; `label` is display-only |
| `<template #tab-item>`             | `TabTrigger` props and slots                 |
| `<template #tab-panel="{ tab }">`  | `<TabPanel :value>` children; the shorthand slot keeps the same name |
| `as="div"`                         | removed — compose the container directly     |
| `[&_[role='tablist']]:...` classes | style `<TabList class="...">` directly       |

```vue
<!-- Before -->
<Tabs v-model="tabIndex" :tabs="[{ label: 'Emails' }, { label: 'Calls' }]">
  <template #tab-panel="{ tab }">
    <div>{{ tab.label }}</div>
  </template>
</Tabs>

<!-- After -->
<Tabs v-model="tab">
  <TabList>
    <TabTrigger value="emails" label="Emails" />
    <TabTrigger value="calls" label="Calls" />
  </TabList>
  <TabPanel value="emails">…</TabPanel>
  <TabPanel value="calls">…</TabPanel>
</Tabs>
```
