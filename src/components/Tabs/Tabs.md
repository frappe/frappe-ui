# Tabs

Switches between panels of content, or between pages. To pick a value for a
filter, a setting or a form field, use [TabButtons](./tabbuttons) instead.

<ComponentPlayground name="Tabs" />

## Anatomy

`Tabs` holds the selected value. `TabList` draws the row of triggers, and each
`TabPanel` shows while its `value` is selected. You lay the parts out and style
them directly.

```vue
<Tabs v-model="tab">
  <TabList>
    <TabTrigger value="emails" label="Emails" />
    <TabTrigger value="calls" label="Calls" />
  </TabList>
  <TabPanel value="emails">…</TabPanel>
  <TabPanel value="calls">…</TabPanel>
</Tabs>
```

## Examples

### Record sections

The default `underline` variant with a leading icon on each trigger, as on a
CRM record page.

<ComponentPreview name="Tabs-Underline" />

### Tabs above a table

The `browser-tab` variant attaches the tabs to the panel below. The `#suffix`
slot holds a count on each tab.

<ComponentPreview name="Tabs-BrowserTabTable" />

### Ticket status

The `#prefix` slot puts a status dot before each label. It receives
`{ active, disabled }`.

<ComponentPreview name="Tabs-Prefix" />

### Icon rail

A vertical `ghost` list of icon-only triggers. A trigger with `icon` and no
default slot shows only the icon, and its `label` becomes the name screen
readers announce.

<ComponentPreview name="Tabs-IconRail" />

### Mailbox pages

A trigger with `route` renders as a link. Without a `v-model`, the selected
tab follows the current route. Leave out the panels and put a `<router-view>`
outside the tabs.

<ComponentPreview name="Tabs-RouteMode" />

### Tabs from data

Pass a `tabs` array and the component renders every part for you. An item with
a `condition` shows only while the function returns true. The `#tab-prefix`,
`#tab-label`, `#tab-suffix` and `#tab-panel` slots shape each tab, and receive
the item as `tab`. Put your own fields in the item's `data` and read them as
`tab.data`.

<ComponentPreview name="Tabs-Shorthand" />

## Behavior

### Vertical tabs

`vertical` on `Tabs` changes the orientation and the arrow keys, not the
layout. Add `class="flex"` to put the list beside the panel. With
`variant="browser-tab"`, `edge="start"` or `edge="end"` on `TabList` sets the
edge of the list the tabs attach to. `start` is the left edge in left-to-right
text. The `tabs` array mode lays itself out.

### Disabled tabs

A disabled trigger cannot be selected, and the arrow keys skip it.

### When the selected tab goes away

In `tabs` array mode, if the selected tab's `condition` turns false, the first
visible tab is selected and `update:modelValue` fires.

<!-- @include: ./Tabs.api.md -->
