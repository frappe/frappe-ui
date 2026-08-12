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
type TabsSide = 'left' | 'right'
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
  side?: TabsSide
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
- "bound" means the `modelValue` prop was passed, not that it holds a value.
  `const tab = ref()` with `v-model` is a bound model that starts undefined,
  and it must not be mistaken for an unbound root — route mode would turn on,
  and route mode never emits for a route trigger, so the ref would stay
  undefined and the binding would be dead for the life of the component.
  Listening to `update:modelValue` without passing the prop is not a binding
- with no `v-model`, the component keeps internal state; the first visible
  trigger is selected initially. That initial pick does not emit. A bound
  model is always told, including one that started undefined
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
  side?: TabsSide
}
```

Defaults: `variant = 'underline'`, `size = 'sm'`, `side = 'left'`.

- `TabList` renders one element the app can style directly: padding, gap,
  borders, and visibility belong to the call site. The v0
  `[&_[role='tablist']]` selectors and the hidden-tablist hack are no longer
  needed
- no component in the family ships layout defaults. v0 forced `flex flex-1
  overflow-hidden flex-col` on the root, `overflow-x-auto` on the list, and
  `flex flex-col overflow-auto` on every panel. A `Tabs` that force-grows to
  fill its parent is wrong everywhere the tabs are not the whole screen, and
  apps fought those defaults more often than they used them. Scrolling is the
  call site's decision; the migration guide carries the recipe for both modes
- every variant supports both orientations. `side` applies only when
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
  disabled?: boolean
  /** Renders the trigger as a RouterLink. See Route mode. */
  route?: RouteLocationRaw
}
```

- `value` is required. There is no label-as-value fallback
- `icon` strings use the `lucide-*` class form, the same as every other
  component. `icon` without a default slot makes an icon-only trigger and
  `label` becomes the `aria-label`
- there is no `iconRight`. Trailing content on a tab is a count or a badge,
  which the `#suffix` slot already carries
- disabled triggers are skipped by keyboard navigation and cannot be selected.
  A disabled trigger counts as absent everywhere selection is resolved: a
  `v-model` pointing at one falls back to the first selectable trigger and
  emits, and disabling the selected trigger moves selection off it the same
  way. An all-disabled list selects nothing and emits nothing

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
  <template #tab-panel="{ tab }">…</template>
</Tabs>
```

```ts
interface TabItem {
  value: TabValue
  label?: string
  icon?: string | Component
  iconLeft?: string | Component
  disabled?: boolean
  route?: RouteLocationRaw
  condition?: () => boolean
  data?: Record<string, unknown>
}
```

Shorthand slots:

- `#tab-prefix="{ tab, selected, disabled }"` / `#tab-suffix="{ ... }"` —
  forwarded into every generated trigger
- `#tab-label="{ tab, selected, disabled }"` — replaces the label region of
  every generated trigger
- `#tab-panel="{ tab }"` — the panel body for the selected tab

Rules:

- `condition()` is evaluated before rendering; items that return false are
  omitted. The model fallback rule above handles the selected tab
  disappearing
- app-defined extras go in `data` and reach the slots as `tab.data`. The item
  itself takes no unknown keys, so a misspelled `label` or `route` is a type
  error instead of silent passthrough
- shorthand and composed children are mutually exclusive; when `tabs` is set,
  default-slot `TabList`/`TabPanel` children are not supported

## Route mode

A trigger with `route` renders as a `RouterLink`.

- if the root has no `modelValue` binding and any trigger has `route`,
  selection derives from the current route: a trigger is selected when its
  resolved route is active, using RouterLink's inclusive matching. Child
  routes keep the parent tab selected
- clicking a route trigger navigates; it does not emit `update:modelValue`
- disabled route triggers are excluded. They render as buttons, so a matching
  URL must not select one, and one on its own does not turn route mode on
- lists may mix route and non-route triggers. A non-route trigger has nothing
  to navigate, so clicking it selects it and emits `update:modelValue`, even
  while a route matches elsewhere. Selection returns to the route on the next
  navigation, or when that trigger turns disabled or unmounts. Those exits are
  final: re-enabling the trigger, or a `condition` flipping back, does not let
  the tab reclaim selection without another click
- when no route matches, selection falls back to the first selectable
  non-route trigger. An all-route list starts with nothing selected —
  highlighting a trigger would claim a route the app is not on
- a `route` added after the trigger mounts does nothing — `useLink` runs at
  setup only. DEV warns; remount with a `:key` to change it
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

- `TabValue`, `TabsVariant`, `TabsSize`, `TabsSide`
- the item vocabulary: `value` (required), `label`, `icon`, `iconLeft`,
  `disabled`
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
- with no `v-model`, `TabButtons` keeps internal state and still emits, the
  same rule as `Tabs`. It never hands `RadioGroupRoot` an undefined model:
  reka would then track selection privately, and the sliding indicator —
  which measures the checked element rather than using an indicator
  primitive — would have nothing to re-measure on

## Styling hooks

- `data-slot="tab-list"`, `data-slot="tab-trigger"`, `data-slot="tab-panel"`
- `data-slot="tab-prefix"`, `data-slot="tab-suffix"` on the trigger regions
- `data-slot="tab-indicator"` on the sliding indicator, in `TabList` and in
  `TabButtons`. The two are pixel-identical at the same variant, so indicator
  CSS must reach both with one selector. On `subtle` and `ghost` the indicator
  paints inside a layer clipped to the track, so anything a consumer adds
  through this hook that reaches past the track edge — a larger shadow, an
  outline, a scale — is cut there. See the 2026-08-12 changelog entry
- `TabButtons` names its track `data-slot="tab-buttons"` and its shells
  `data-slot="tab-button"`. The track and shell names differ from `TabList`
  because the roles differ (radiogroup, not tablist); the shared parts —
  indicator, prefix, suffix — do not
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
- activation is automatic: arrow keys move focus and select. A list holding
  any route trigger is the one exception — it activates manually, so arrow
  keys move focus and Enter commits. Selecting a route tab navigates, and the
  ARIA APG asks for manual activation whenever activation has a significant
  side effect. This does not depend on whether a model is bound: with a bound
  model the router still moves on click, so automatic activation would land
  the keyboard and the mouse on different URLs
- the mode is decided before the first render, because the reka primitive
  reads it once during its own setup. It cannot come from the trigger
  registry — triggers register after the root renders — and remounting the
  root to force a re-read would tear down every panel. Shorthand mode reads
  `tabs`; composed mode reads the default slot's vnodes, which exist before
  they mount. That walk is narrow by rule: it enters fragments, plain
  elements, and `TabList`, and reads `route` off `TabTrigger`. It must never
  call an unknown component's slot — a scoped slot destructures its argument,
  so calling it with none throws, and this runs in setup where a throw takes
  the whole component down. Elements are safe because Vue normalises their
  children into an array at creation, leaving no slot function to call.
  Staying out of panels also keeps a nested route `Tabs` from flipping the
  outer, route-free list
- the walk reads the raw children off the vnode, not `slots.default`. Vue
  wraps a slot passed from a render function or JSX, and that wrapper warns
  when it is called outside a render — which is where this runs
- a trigger the scan cannot see leaves the mode automatic and DEV warns when
  it registers. Two ways to land there: the app wrapped its triggers in its
  own component, or the routed items arrived after mount — whether they came
  through `tabs` or through a `v-for` over a resource in composed mode
- every focusable trigger carries `focus-visible:focus-ring` (P12), and no
  track may clip it. The subtle track has 1px of padding, so `overflow-hidden`
  on the track would cut the outer half of the ring — it never sets it. The
  active pill's shadow is clipped one layer down instead, by a layer that
  holds the indicator and nothing else
- the root never hands the reka primitive an undefined model. reka reads
  that as uncontrolled and starts driving selection itself, which would flip
  `aria-selected` onto a trigger the rest of the component still draws as
  inactive. With nothing selected it receives a value no trigger carries
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
- `iconRight` on `TabTrigger`, `TabItem`, and `TabButtons` options — the
  `#suffix` slot covers trailing content

## Changelog

### 2026-08-12 (shadow clip)

- **The pill indicator carries its own clip layer.** The track cannot clip its
  shadow: with 1px of padding, `overflow-hidden` on the track also cuts the
  outer half of a focused trigger's ring, which is why it was set (2026-08-10,
  track containment) and then taken back off. The indicator now sits in an
  `absolute inset-0 overflow-hidden` layer rounded like the track, so
  `shadow-base` stops at the track edge while the ring, which belongs to the
  trigger outside that layer, still paints in full. `TabList` and
  `TabButtons`, both orientations. The layer sets no `data-slot` — it is
  presentational and must stay restructurable (P10).

### 2026-08-10 (iconRight removed)

- **`iconRight` is gone** from `TabTrigger`, `TabItem`, and `TabButtons`
  options. P11 asks for one `icon` prop plus the `#prefix`/`#suffix` slots;
  the family had inherited Button's three-prop shape without needing it. No
  story, doc, or Figma usage pattern used `iconRight` — trailing content on a
  tab is a count or a badge, which `#suffix` already carries, and `#suffix`
  reaches shorthand mode too. `iconLeft` stays: leading icons are a real
  pattern, and a one-line item field beats a slot for the common case. (The
  first version of this note said a slot could not read a `TabItem`. That was
  wrong — `#prefix` receives `{ tab }`. `iconLeft` stays on ergonomics alone.)

### 2026-08-10 (vocabulary)

- **`direction` is now `side`** on `TabList` and `TabButtons`; `TabsDirection`
  is `TabsSide`. `direction` sat one letter from `dir` (`ltr`/`rtl`) in the
  same family, and `side` is the word the library already uses for an edge.
- **`TabItem` no longer takes unknown keys.** The `[key: string]: any` index
  signature put `any` on the public surface and switched off typo checking for
  every other field, so `{ value, lable }` type-checked. App extras move to
  `data?: Record<string, unknown>` and reach the slots as `tab.data`.
- **The root shorthand slots carry the `tab-` unit prefix**:
  `#tab-prefix` / `#tab-label` / `#tab-suffix` / `#tab-panel`. They were
  `#prefix` / `#tab` / `#suffix` / `#panel`. Every one of them is per-tab, and
  P6 prefixes slots inside a repeated unit — `Select` names the same shape
  `#item-prefix` / `#item-label` / `#item-suffix`, and `Tree` moved `#label` to
  `#item-label` for the same reason. `#label` also already means the P5
  labeling override at top level, so it could not carry a second meaning here.
  Composed `TabTrigger` keeps plain `#prefix` / `#suffix`, which is what makes
  the two modes distinguishable at the call site. `#tab-panel` lands back on
  its v0 name.

### 2026-08-10 (track containment)

- **Pill tracks hug their content.** `subtle` and `ghost` tracks in `TabList`
  get `self-start`. `inline-flex` alone does not stop a flex item from
  stretching, so shorthand mode (a flex root) rendered a full-width track.
  `underline` and `browser-tab` rails still span the full width.
- **The `subtle` track clips its own shadow.** The track has 1px of padding,
  so the active pill's `shadow-base` spilled past the track edge onto
  neighbouring content. The track now sets `overflow-hidden`.

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
