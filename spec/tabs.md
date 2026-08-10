# Tabs Spec

This document defines the public API for the `Tabs` family: `Tabs`, `TabList`,
`TabTrigger`, and `TabPanel`. It replaces the v0 monolithic `Tabs` component.

`TabButtons` remains a separate component. The boundary and the vocabulary the
two share are defined in
[Relationship to TabButtons](#relationship-to-tabbuttons).

## Role

`Tabs` switches between panels of content, or between routes.

It should support:

- panel switching with a value-based model
- route-based tabs where selection derives from the current route
- every visual variant `TabButtons` has: `underline`, `subtle`, `ghost`,
  `browser-tab`
- badges, counts, and icons in triggers without replacing the trigger
- conditional tabs that appear and disappear at runtime
- vertical orientation and RTL

Important boundary:

- if the UI switches visible panels or routes, use `Tabs` (tablist semantics)
- if the UI picks a value for a filter, a setting, or a form field, use
  `TabButtons` (radiogroup semantics)

The two are pixel-identical at the same `variant` and `size`. The choice is
semantic, not visual.

## Why composition

The v0 `Tabs` was a single component driven by a `tabs` array and an
index-based `v-model`. Survey of downstream apps (crm, helpdesk, press,
gameplan, suite, frappe, insights, builder) found the same workarounds at
almost every call site:

- index ⇄ name translation layers (`useActiveTabManager` in crm and helpdesk,
  `TabsWithRouter` in press, literal route maps in gameplan)
- stale-index clamps when conditional tabs disappear
- styling through `[&_[role='tablist']]:...` arbitrary-variant class blobs
- full `#tab-item` rewrites for a badge or a router-link
- three apps reimplemented the component locally

The v1 API is composed: the app owns the `TabList` and `TabPanel` elements and
styles them directly. A `tabs` shorthand remains for generated tab sets.

## Exact public API for v1

### Canonical composed form

```vue
<Tabs v-model="tab">
  <TabList variant="underline" class="px-5">
    <TabTrigger value="activity" icon="lucide-activity" label="Activity">
      <template #suffix>
        <Badge>{{ count }}</Badge>
      </template>
    </TabTrigger>
    <TabTrigger v-if="doc.emails" value="emails" label="Emails" />
  </TabList>
  <TabPanel value="activity">…</TabPanel>
  <TabPanel value="emails">…</TabPanel>
</Tabs>
```

### Types

```ts
type TabValue = string | number
type TabsVariant = 'underline' | 'subtle' | 'ghost' | 'browser-tab'
type TabsSize = 'sm' | 'md'
type TabsDirection = 'left' | 'right'
```

### `Tabs` (root)

```ts
interface TabsProps {
  modelValue?: TabValue
  vertical?: boolean
  dir?: 'ltr' | 'rtl'
  /** Shorthand mode only. */
  tabs?: TabItem[]
  /** Shorthand mode only; forwarded to the generated TabList. */
  variant?: TabsVariant
  size?: TabsSize
}

interface TabsEmits {
  'update:modelValue': [value: TabValue]
}
```

Defaults:

- `vertical = false`
- `dir` = the resolved document direction
- `variant = 'underline'`
- `size = 'sm'`

State rules:

- the model is the trigger `value`, never an index
- with no `v-model`, the component keeps internal state; the first visible
  trigger is selected initially
- if the model matches no visible trigger, the component selects the first
  visible trigger and emits `update:modelValue`. This replaces the stale-index
  clamps apps wrote in v0
- `Tabs` exposes nothing on the template ref

### `TabList`

```ts
interface TabListProps {
  variant?: TabsVariant
  size?: TabsSize
  /** browser-tab + vertical only: which edge the tabs attach to. */
  direction?: TabsDirection
}
```

Defaults: `variant = 'underline'`, `size = 'sm'`, `direction = 'left'`.

- `TabList` renders one element the app can style directly: padding, gap,
  borders, and visibility belong to the call site. The v0
  `[&_[role='tablist']]` selectors and the hidden-tablist hack are no longer
  needed
- every variant supports both orientations. `direction` applies only when
  `variant = 'browser-tab'` and the root is `vertical`, matching v0
  `TabButtons`
- `underline` renders the animated active indicator; `subtle` renders raised
  pills on a gray track; `ghost` renders borderless pills; `browser-tab`
  renders attached tabs. All four share the trigger internals with
  `TabButtons`

### `TabTrigger`

```ts
interface TabTriggerProps {
  value: TabValue
  label?: string
  /** Icon-only trigger; `label` becomes the accessible name. */
  icon?: string | Component
  iconLeft?: string | Component
  iconRight?: string | Component
  disabled?: boolean
  /** Renders the trigger as a RouterLink. See Route mode. */
  route?: RouteLocationRaw
}
```

- `value` is required. There is no label-as-value fallback
- `icon` strings use the `lucide-*` class form, the same as every other
  component. `icon` without a default slot makes an icon-only trigger and
  `label` becomes the `aria-label`
- disabled triggers are skipped by keyboard navigation and cannot be selected

Slots:

```ts
type TabTriggerSlotProps = { selected: boolean; disabled: boolean }
```

- `#prefix="{ selected, disabled }"` — leading content, after `iconLeft`
- default slot `="{ selected, disabled }"` — replaces the label region
- `#suffix="{ selected, disabled }"` — trailing content (badges, counts)

The trigger shell — variant styling, selected state, focus ring — is always
owned by the component. There is no full-trigger escape hatch in v1; the v0
`#tab-item` rewrites existed only because badges, icons, and routes were
missing from the default trigger.

### `TabPanel`

```ts
interface TabPanelProps {
  value: TabValue
}
```

- a panel mounts when its `value` is selected and unmounts otherwise
- panels are optional. A `Tabs` with triggers and no panels is valid in route
  mode, where a `<router-view>` outside owns the content

### Shorthand mode

For generated tab sets (FormLayout, FieldLayout), `Tabs` accepts a `tabs`
array and renders the parts itself:

```vue
<Tabs v-model="tab" :tabs="items" variant="subtle">
  <template #panel="{ tab }">…</template>
</Tabs>
```

```ts
interface TabItem {
  value: TabValue
  label?: string
  icon?: string | Component
  iconLeft?: string | Component
  iconRight?: string | Component
  disabled?: boolean
  route?: RouteLocationRaw
  condition?: () => boolean
  [key: string]: any
}
```

Shorthand slots:

- `#prefix="{ tab, selected, disabled }"` / `#suffix="{ ... }"` — forwarded
  into every generated trigger
- `#tab="{ tab, selected, disabled }"` — replaces the label region of every
  generated trigger
- `#panel="{ tab }"` — the panel body for the selected tab

Rules:

- `condition()` is evaluated before rendering; items that return false are
  omitted. The model fallback rule above handles the selected tab
  disappearing
- extra app-defined fields pass through to slot props unchanged
- shorthand and composed children are mutually exclusive; when `tabs` is set,
  default-slot `TabList`/`TabPanel` children are not supported

## Route mode

A trigger with `route` renders as a `RouterLink`.

- if the root has no `modelValue` binding and any trigger has `route`,
  selection derives from the current route: a trigger is selected when its
  resolved route is active, using RouterLink's inclusive matching. Child
  routes keep the parent tab selected
- clicking a route trigger navigates; it does not emit `update:modelValue`
- panels are usually omitted in route mode; the app places a `<router-view>`
- if the root also binds `v-model`, the model wins and `route` is only a
  navigation side effect

This replaces the hand-rolled route sync in press (`TabsWithRouter`), crm and
helpdesk (hash + localStorage managers), and gameplan (route-name maps). Hash
or query persistence stays app-owned; a value-based model makes it a one-line
computed.

## Relationship to TabButtons

`TabButtons` stays a separate component with radiogroup semantics. It is a
value input, not a panel switcher. The two share:

- `TabValue`, `TabsVariant`, `TabsSize`, `TabsDirection`
- the item vocabulary: `value` (required), `label`, `icon`, `iconLeft`,
  `iconRight`, `disabled`
- trigger visuals: at the same `variant` and `size`, a `TabButtons` and a
  `TabList` are pixel-identical

`TabButtons` deltas in v1:

- gains `fluid?: boolean` — buttons stretch to fill the container width.
  Removes the raw-CSS and wrapper-div workarounds in helpdesk and suite
- `type` is renamed to `variant` to match `TabList`
- the deprecated `buttons` prop is removed per
  [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md)
- the `active: true` fallback and the label-as-value fallback are removed;
  `value` is required and the model is the single source of truth

## Styling hooks

- `data-slot="tab-list"`, `data-slot="tab-trigger"`, `data-slot="tab-panel"`
- `data-slot="tab-prefix"`, `data-slot="tab-suffix"` on the trigger regions
- `data-variant` and `data-size` on `TabList`
- `data-state="active|inactive"` on triggers and panels via the primitive
- `data-disabled` on disabled triggers
- `data-orientation="horizontal|vertical"` on root, list, and triggers

## Motion

- every sliding indicator uses one timing: 200ms
  `cubic-bezier(0.23, 1, 0.32, 1)` (easeOutQuint), in both `TabList` and
  `TabButtons`
- the `underline` indicator animates position and size on selection change,
  as in v0
- `subtle` and `ghost` slide the active pill surface (background + shadow)
  between triggers, in both `TabList` and `TabButtons`.
  The sliding layer is an overlay behind the triggers; triggers never move.
  No slide on initial mount — only on selection change
- `browser-tab` slides the active card between triggers, in both `TabList`
  and `TabButtons`. The sliding indicator IS the card: opaque surface, 1px
  borders except the attached edge, rounded detached corners, and the rail
  fusion mask — so the open edge in the rail travels with the card. Trigger
  label colors transition separately (150ms)
- hover state changes ease over 150ms; selection color changes ride the
  sliding surface
- panel switches are instant; no crossfade
- `prefers-reduced-motion: reduce` disables the indicator and slide
  animations

## Accessibility and semantics

- `Tabs` follows the tabs pattern via the underlying reka-ui primitives:
  `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`,
  `aria-controls`
- activation is automatic: arrow keys move focus and select
- roving tabindex; disabled triggers are skipped
- route mode renders links inside the tablist; the selected link carries
  `aria-selected`
- icon-only triggers require `label` for the accessible name

## Removed from v0

Before/afters live in [`migration.md`](../docs/content/docs/migration.md):

- the index-based `modelValue` — the model is the trigger `value`
- the `as` prop — composition covers container rendering
- the `#tab-item` and `#tab-panel` slots — `TabTrigger` slots and `TabPanel`
  replace them
- `Tab.route` as a string — `route` is a `RouteLocationRaw` on `TabTrigger`
  and `TabItem`
- `Tab.label` as the implied value — `value` is required

## Changelog

### 2026-08-10 (motion unified)

- **One slide timing for every indicator.** All sliding indicators
  (underline, subtle, ghost, browser-tab) now use 200ms
  `cubic-bezier(0.23, 1, 0.32, 1)` (easeOutQuint) in both `TabList` and
  `TabButtons`, replacing the 300ms-default / 200ms-ease-out split. Chosen
  from filmstrip comparison: the strong deceleration makes the switch feel
  immediate while long hops still read as travel; 150ms with the same ease
  read as a flicker.

### 2026-08-10 (later still)

- **Motion: `browser-tab` slides too.** The active card (surface, borders,
  radii, rail fusion) moves as one sliding indicator; triggers stay static
  and transparent. Timing is 200ms `cubic-bezier(0, 0, 0.2, 1)`, matching
  the reference (espresso Base UI tabs) — the 300ms default ease reads as a
  hesitation on the large opaque card. The at-rest render is unchanged.

### 2026-08-10 (later)

- **Motion: pill variants slide.** `subtle` and `ghost` animate the active
  pill surface between triggers instead of switching instantly; `browser-tab`
  keeps the instant switch. User decision during implementation review.
- **Subtle variant styling follows the shipped v0 look** (ui.frappe.io) where
  it differs from the Figma export: `surface-elevation-3` active pill, 13px
  regular labels, 1px track padding at md. The other variants keep the Figma
  values.

### 2026-08-10

- Initial v1 spec. Composed `Tabs`/`TabList`/`TabTrigger`/`TabPanel` API,
  value-based model, full `TabsVariant` parity with `TabButtons`, route mode,
  shorthand mode, and the shared-vocabulary contract with `TabButtons`.
