# frappe-ui — Design Philosophy

This is the rulebook that governs API design across `frappe-ui`. Every principle is **generative**: applying it gives you the right answer in situations it doesn't explicitly cover. When two principles tug in opposite directions, the principle text usually points at the tiebreaker.

**Audience:** contributors, AI agents doing PRs, reviewers. Not end users.

**How to use it:**
- Cite by ID in PRs and issues (`"this violates P3"`, `"P11 carve-out applies"`).
- When you draft a new component or refactor an old one, walk this doc top-to-bottom.
- When a principle stops being generative — when it forces a clearly wrong answer in a real case — propose an edit, don't carve a quiet exception.

**Relationship to other docs:**
- **`CONTEXT.md`** is the *vocabulary*: what `open`, `variant`, `theme`, `dismissible` mean. PHILOSOPHY is the *rules* that use the vocabulary.
- **`spec/adr/`** are *decisions* — specific applications of principles to specific design questions. ADRs cite principles; principles don't cite ADRs.
- **`spec/*.md`** are *component-family specs* that implement principles for a family (Dialog, inputs, selection).

---

## Naming

### P1. Name behaviors, not interactions

**Rule:** Event and slot names describe what happened to the component's state, not the physical input that produced it. Prefer `change`, `open`, `select`, `submit`, `dismiss` over `toggle`, `clickOutside`, `keydownEnter`.

Exception: when the DOM event *is* the behavior (e.g. `click` on a `Button`), don't rename it. The principle applies when the component layers its own state or intent above the raw event.

**Why:** Behavior names stay correct when the underlying interaction changes — a `Switch` flipped by click, drag, or keyboard all emits the same `change`. Interaction names tie callers to one input channel and break when the interaction model evolves.

```vue
<!-- Bad -->
<Switch @toggle="..." />
<Dialog @clickOutside="..." />
<TextInput @keydownEnter="..." />

<!-- Good -->
<Switch @change="..." />
<Dialog @dismiss="..." />
<TextInput @submit="..." />
```

---

## Prop design

### P2. Prefer v-model for two-way state

**Rule:** Any reactive state a component lets the caller both set and observe is exposed via `v-model`. Use Vue's named `v-model:<name>` for every piece of two-way state *except* the component's *primary value* (text content, selected option), which binds to unnamed `v-model` (= `modelValue`). Never invent ad-hoc `:value` + `@valueChange` pairs.

A component without a primary value (e.g. `Dialog` has visibility but no selected value) leaves `modelValue` unused and exposes every axis as a named v-model.

**Implementation:** use `defineModel`, not manual `defineProps` + `defineEmits` pairs.

**Why:** `v-model` is Vue 3's canonical two-way binding. Named v-models compose cleanly with `defineModel`, `ref`, and Composition-API patterns. Hand-rolled prop+emit pairs force every caller to wire two pieces and remember non-standard names.

```vue
<!-- Bad -->
<Input :value="x" @input="x = $event" />
<Combobox :selected="x" @selectedChange="x = $event"
          :query="q" @queryChange="q = $event" />

<!-- Good -->
<Input v-model="x" />
<Combobox v-model="selected" v-model:query="q" />
```

`Dialog`'s legacy unnamed-`v-model` binding to visibility survives as a documented backwards-compat exception in CONTEXT.md. P2 doesn't endorse it; new components don't propagate it.

---

### P3. Prefer primitive prop types

**Rule:** Component props are primitives (string, number, boolean) by default. Structured props (objects, arrays-of-objects) are allowed only when the prop represents irreducibly structured *data* the component renders — `options` for a Select, `actions` for a Dialog, `series` for a Chart. Config-blob props that bundle unrelated fields (title + size + icon + actions in one object) are forbidden.

**Multi-state props.** When a prop has more than two states, use a string enum named after the axis it varies (`density="compact" | "default"`, `panes="single" | "dual"`). Avoid a generic `mode` prop — name the axis instead.

**Boolean mode-switch** (e.g. `multi="true"`, `searchable="true"`) is a hint that the component should be split, not a prop to add. See **P8**.

**Why:** Primitive props force the component's interface into the open. Config blobs hide which fields are required, encourage do-it-all components, and break v-bind / v-model composability. Axis-named enums document what they vary; generic `mode` doesn't.

```vue
<!-- Bad -->
<Dialog :options="{ title, size, icon, actions }" />     <!-- config blob -->
<Picker mode="dualpane" />                               <!-- generic mode, no axis -->
<Select multi searchable />                              <!-- boolean mode-switches → split -->

<!-- Good -->
<Dialog v-model:open :title :size :actions />            <!-- flat primitives -->
<DateRangePicker dualPane />                             <!-- 2 states, boolean -->
<DateRangePicker panes="single" />                       <!-- 3+ states, axis-named enum -->
<MultiSelect />                                          <!-- split, not flagged -->
<Combobox />
```

---

### P4. Two color axes only: variant + theme — no semantic axis

**Rule:** Components that vary along color/style use exactly two axes:
- **`variant`** — visual style (`solid | outline | subtle | ghost`)
- **`theme`** — color tone (concrete color names)

No third axis (`intent`, `severity`, `appearance`, `kind`, `status`). "Warning" maps to `theme="yellow"` in the consumer, not in the API. Canonical values for `variant` and `theme` are defined in CONTEXT.md.

**State-driven appearance** (error, disabled, loading) is governed by state props (`error`, `disabled`, `loading`), not by `theme`. A `TextInput` turning red on error is not `theme="red"`.

**Components without a tone axis.** Components with one canonical look (Switch, TextInput, Checkbox) don't need a `theme` prop. P4 forbids inventing a *third* axis, not requiring a second.

**Why:** A semantic axis adds indirection (which `intent` maps to which color?), drifts across components (`intent` vs `appearance` vs `kind`), and breaks down under brand customization. Two axes — visual + tone — is what every mature component library converges to.

```vue
<!-- Bad -->
<Alert intent="warning" />
<Button appearance="primary" />
<Badge kind="success" />

<!-- Good -->
<Alert variant="subtle" theme="yellow" />
<Button variant="solid" theme="blue" />
<Badge variant="subtle" theme="green" />
```

---

### P5. Every input control exposes the shared labeling contract

**Rule:** Every form-control component (anything that holds a value the user enters, selects, or toggles) accepts the same four labeling props with identical semantics: `label`, `description`, `error`, `required`. Behavior is defined in `spec/inputs.md`; each conforming component is enumerated in its family's spec (`spec/selection.md` for the selection family, `spec/inputs.md` for input-family atoms).

Icon-only buttons, action toggles, and other controls that don't carry a value are **not** input controls — P5 doesn't apply.

**Why:** Forms are clusters of inputs. Inconsistent labeling props mean every form remembers which component spells the label `label` vs `title`, which auto-renders the required indicator, which wires `aria-describedby` correctly. Uniformity is what makes the input family a family and not a grab-bag.

```vue
<!-- Bad -->
<Select :title="..." />                  <!-- non-canonical prop name -->
<Checkbox>{{ label }}</Checkbox>         <!-- label as default slot -->
<DatePicker placeholder="Date" />        <!-- placeholder abused as label -->

<!-- Good -->
<Select :label :description :error required />
<Checkbox :label />
<DatePicker :label />
```

---

## Slot design

### P6. Use the shared slot vocabulary, scoped by unit

**Rule:** Slot names come from a shared vocabulary, not invented per component. Scope by the unit they belong to when slots repeat.

**Canonical generic slots (top level):**
- `#default` — main content
- `#prefix` / `#suffix` — leading/trailing visual elements (icon, avatar, badge, indicator)
- `#trigger` — the element that opens an overlay
- `#empty` — fallback when a list has no items
- `#footer` / `#header` — region wrappers
- `#label` / `#description` — overrides for the labeling contract (P5)

**Scoped slots (inside repeated units)** prefix with the unit name:
- `#item-prefix` / `#item-suffix` / `#item-label` — per-item in a list / dropdown / select
- `#tab-label` — per-tab in Tabs
- `#column-header` — per-column in a Table

**Type-specific slots** (`#icon`, `#avatar`, `#badge`) are forbidden when a generic slot (`#prefix`/`#suffix`) covers them. The one carve-out is **Button's singular `#icon` slot** — square icon-only Buttons are a standard, common shape.

**Why:** Discoverability — once a consumer knows the vocab, every component reads the same way. Composability — `#prefix` accepts an icon, an avatar, or a status dot without the component growing one prop per type. Stability — locked slot names survive component rewrites.

```vue
<!-- Bad -->
<Combobox><template #icon-left>…</template></Combobox>
<Combobox><template #avatar-right>…</template></Combobox>
<List><template #emptyState>…</template></List>
<Dropdown><template #after>…</template></Dropdown>

<!-- Good -->
<Combobox><template #prefix>…</template></Combobox>
<Combobox><template #suffix>…</template></Combobox>
<List><template #empty>…</template></List>
<Dropdown><template #footer>…</template></Dropdown>
```

---

### P7. Slot props expose component state

**Rule:** Slots that render dynamic content receive the component's relevant state as slot props. Callers should never have to re-derive state the slot already knows.

**Standard slot-prop shapes:**
- Per-item slots: `{ item, index, active, disabled, selected }`
- Trigger slots: `{ open, disabled, value }`
- Input slots (e.g. Combobox `#empty`): `{ query }`
- Tab / accordion slots: `{ active }`

**Why:** Forcing callers to re-derive state (looking up "is this item selected" by comparing IDs against the outer v-model) breaks encapsulation, duplicates matching logic, and silently drifts when internal selection rules change (e.g. multi-select, "select all" semantics).

Static-content slots (`#footer`, `#empty` with no dynamic context, `#prefix` on a non-list component) don't need slot props. P7 governs slots that render *per-item or per-state*.

```vue
<!-- Bad -->
<Combobox v-model="selected" :options="opts">
  <template #item="{ item }">
    <!-- caller re-derives selection from outer scope -->
    <div :class="{ bold: item.value === selected.value }">{{ item.label }}</div>
  </template>
</Combobox>

<!-- Good -->
<Combobox v-model="selected" :options="opts">
  <template #item="{ item, active, selected }">
    <div :data-active="active" :data-selected="selected">{{ item.label }}</div>
  </template>
</Combobox>
```

---

## Composition

### P8. Split components instead of overloading them

**Rule:** When a component grows a prop that *changes its fundamental contract* — what kind of value it emits, whether it's single- or multi-valued, what UI affordances it shows, what shape its `options` take — split into a separate component instead of adding the prop.

**Split when:**
- The value type changes (`string` vs `string[]`)
- A visible UI region appears/disappears (tag-input area, search field, multi-pane layout that's a different mental model)
- The docs grow `if X, then …` branches everywhere

**Keep one component when:**
- The variant is purely visual/layout (`dualPane`, `density="compact"`, `size="sm"`)
- The prop is additive without changing emitted shape
- The behavior under the prop is a strict subset of the base behavior

**Why:** A configurable behemoth has multiplicative bug surface (`multi × searchable × creatable × clearable = 16 combinations`), forces every caller to read prop docs to know what the value type is, and freezes the API around the union of every use case. Split components have stable contracts each.

**Shared internals are highly encouraged** — a `useSelection()` composable, a base `<Listbox>` primitive. P8 governs the *public surface*, not internal duplication. Splitting public components ≠ duplicating code.

```vue
<!-- Bad -->
<Autocomplete :fetch-options="fetchUsers" multi searchable creatable />

<!-- Good -->
<Select />          <!-- single, fixed options -->
<MultiSelect />     <!-- multi, fixed options -->
<Combobox />        <!-- single, searchable -->
<Autocomplete />    <!-- async-fetched, optionally creatable -->
```

---

### P9. Imperative APIs optimize for call-site boilerplate

**Rule:** Imperative helpers (`dialog.*`, `toast.*`, …) are shaped to minimize the code the caller writes for the common case. The shape — callback, Promise, or sync handle — is chosen per helper based on what makes the typical call site shortest while still letting advanced cases escape hatch.

**Non-negotiables:**
- **A namespace** — `dialog.confirm`, `toast.success`. Never flat `confirmDialog()`.
- **Provider-mounted** — helpers inherit `provide/inject` from the host app via `<FrappeUIProvider>`.
- **A synchronous handle** — `{ close }` returned at call time for programmatic dismissal (timeouts, route changes).
- **Escape hatches via a context object** — `({ close, setError, … })` passed to handlers, used only for non-typical paths.

Imperative UI is for **one-shot, orthogonal-to-view-tree** affordances. Persistent, trigger-anchored UI (Popover, Dropdown) stays component-only.

**Why:** Imperative helpers compete with `<Component>`-based UI on ergonomics. If the imperative call site isn't markedly shorter, callers reach for the component and skip the helper. The shape that wins varies — callback-based when the user's action begins an async flow (the callback owns close + error UX); Promise-based for fire-and-forget messaging.

```ts
// Bad
confirmDialog({ title: 'Delete?', onConfirm: () => api.delete() })  // flat, not namespaced
const r = await dialog.confirm({ title: 'Delete?' })                // forces post-await
if (!r.ok) return                                                   //   boilerplate when a
try { await api.delete(); r.close() } catch { /* lost error UX */ } //   callback is shorter

// Good
dialog.confirm({
  title: 'Delete?', theme: 'red',
  onConfirm: async () => { await api.delete() },   // auto-closes; throws → inline error
})
await toast.success('Saved')                       // Promise OK for fire-and-forget
const { close } = dialog.confirm({ … })            // sync handle for programmatic dismissal
setTimeout(close, 5000)
```

---

## Styling

### P10. Customize via slots and data-* attributes, never class-name props

**Rule:** Components expose customization through two channels:

1. **Slots** — for *content* injection (governed by P6/P7).
2. **`data-*` attributes** — for *styling* hooks. Components set stable `data-slot="…"`, `data-state="…"`, `data-disabled`, `data-variant`, `data-size` on rendered DOM so callers and brand themes target them via CSS.

**Forbidden:**
- Class-name injection props (`triggerClass`, `contentClass`, `itemClass`)
- Style-injection props (`triggerStyle`)
- Pass-through prop blobs (`:popoverProps="{ class }"`)

Root `class` fallthrough — `<MyDropdown class="my-4">` landing on the root via Vue's default attribute inheritance — is fine. P10 forbids *named class props for inner elements*, not the implicit single binding.

The exact data-slot / data-state taxonomy is per component family; each family's spec defines its own values.

**Why:**
- Class-injection props leak the internal DOM tree into the public API. Every restructure breaks every caller. `data-slot` keeps the *contract* stable.
- N class props become N² as components grow (`triggerHoverClass`, `triggerDisabledClass`, …). data-* + CSS scales without growing the prop surface.
- Callers get full state-aware styling via CSS without the component cooperating on each new state.

```vue
<!-- Bad — caller -->
<Dropdown
  triggerClass="bg-red-500"
  contentClass="shadow-xl"
  itemClass="hover:bg-gray-100"
/>
```

```html
<!-- Good — component output -->
<button data-slot="trigger" data-state="open" data-variant="solid">…</button>
<div data-slot="content" data-state="open">
  <div data-slot="item" data-state="active" data-disabled>…</div>
</div>
```
```css
/* Good — caller CSS */
[data-slot="trigger"][data-state="open"] { box-shadow: … }
[data-slot="item"][data-disabled]        { opacity: .5 }
```

---

### P11. Icon customization is uniform across the library

**Rule:** When a component accepts an icon as a customization point, the shape is the same everywhere:

- A **prop** that accepts `string | Component`.
  - String form: the `lucide-*` namespaced convention. No per-icon imports.
  - Component form: escape hatch for non-lucide icons (brand logos, custom glyphs).
- The generic **`#prefix` / `#suffix` slots** (P6) are the full-control override — not a parallel `#icon` slot competing with the prop.

**The Button exception:** Button has a singular `#icon` slot (and `icon` prop with no left/right pair) because square icon-only buttons are a standard, common component.

**Forbidden:**
- Structured icon-config objects (`icon: { name, theme, … }`). Identity is one value; theme/size are component-level concerns, not fields packed inside the icon prop.
- Bare un-namespaced names (`icon="edit"`) — collides the moment a second icon set ships.
- Multiple competing channels on one component (`iconName` prop + `iconComponent` prop + `#icon` slot).

**Why:** String-by-default kills per-icon imports at call sites; dynamic icons cost nothing. The namespace prefix is explicit, leaving room for `hero-*` or custom sets without breaking lucide callers. Uniform shape across components means no mental switch.

```vue
<!-- Bad -->
<Dialog :icon="{ name: 'lucide-alert', theme: 'red' }" />   <!-- icon-config blob -->
<Button icon="edit" />                                       <!-- un-namespaced -->
<Combobox iconName="…" iconComponent="…" />                  <!-- competing channels -->

<!-- Good -->
<Dialog icon="lucide-alert" theme="red" />                   <!-- string + theme on component -->
<Button icon="lucide-edit" />
<Button :icon="MyCustomLogo" />                              <!-- Component escape hatch -->
<Combobox>
  <template #prefix><LucideStar class="size-4" /></template> <!-- generic slot -->
</Combobox>
```

---

## Quality

### P12. Accessibility is non-negotiable

**Rule:** Every component ships with keyboard navigation, focus management, and ARIA semantics correct *at first release*. A11y is not a follow-up. A component that can't be operated by keyboard, doesn't trap focus when modal, or lacks the ARIA contract for its role is not done.

**The baseline every interactive component meets:**
- **Keyboard-operable.** Every action available by pointer is available by keyboard. Semantics follow the WAI-ARIA Authoring Practices pattern for the role (Dialog → focus trap + Esc; Combobox → arrows + Enter + Esc; Tabs → arrows; Switch → Space).
- **Visible focus on keyboard focus.** A focus ring (or equivalent indicator) appears when focus arrives via keyboard, not on mouse click. Style with `:focus-visible`, not `:focus`. Visible in light and dark mode.
- **ARIA semantics by props, not by markup.** Roles (`role="dialog"`, `role="combobox"`), state (`aria-expanded`, `aria-selected`, `aria-invalid`), and naming (`aria-labelledby`, `aria-describedby`, `aria-errormessage`) are wired by the component from its props.
- **IDs auto-generated.** `useId()` for every component that links a label to a control. Callers may override; the default works without thought.
- **Screen-reader-only text where the UI relies on visual cues.** Required asterisk pairs with `<span class="sr-only">(required)</span>`. Close buttons have `aria-label="Close"`. Icon-only buttons have an `aria-label` prop or fallback.
- **Reduced motion.** Animations respect `prefers-reduced-motion`.

**Why:** A11y as a follow-up never happens — components ship, apps depend on them, retrofitting becomes coordinated migration work. The library's job is to make accessibility the default. WAI-ARIA patterns are stable specifications; we implement them once so consumers don't have to.

**Edge cases:**
1. **A11y vs visual design.** When a designer wants something a11y forbids (removing the focus ring), the component still ships the baseline. Visual customization happens via data-state hooks (P10), not by stripping the contract.
2. **Wrapped libs.** Components wrapping `reka-ui` inherit a strong baseline — we audit and document deviations, not start from scratch.
3. **Genuine compromises.** Some patterns lack a perfect a11y answer (e.g. virtualized listboxes). Document the deviation in the component spec, pick the least bad option, don't pretend the trade-off doesn't exist.

```vue
<!-- Bad -->
<Dialog open>                                  <!-- no focus trap, Esc doesn't close -->
  <button @click="confirm">                    <!-- icon-only, no aria-label -->
    <LucideX />
  </button>
</Dialog>
<TextInput :error="msg" />                     <!-- error not linked via aria-errormessage -->

<!-- Good -->
<Dialog v-model:open>                          <!-- focus trapped, Esc closes, role+aria-* wired -->
  <Button icon="lucide-x" aria-label="Close" />
</Dialog>
<TextInput v-model="x" label="Email" :error="msg" />
<!-- → renders <input aria-invalid="true" aria-errormessage="email-error">
        + <span id="email-error">{{ msg }}</span> -->
```

---

## Evolution

### P13. Deprecate, don't remove

**Rule:** Changes to public-API surface keep the old surface working alongside the new one. Removal happens on the next major release, never in a minor/patch.

**Mechanics:**
1. Old API stays functional, same behavior, no breakage.
2. One-time `warnDeprecated(component, oldName, newName)` per `(component, prop)` per page-load — not on every render.
3. Renaming changes ship as a flat old → new mapping that codemods can read.
4. CONTEXT.md records the old name under `_Avoid:` so it stays searchable.
5. Removal happens in the next major; the major's migration guide lists every removed surface.

**Deprecation window:** through one major. v1 deprecations are removable in v2. No per-prop schedules.

**v1 is the freeze line.** Pre-v1, the library evolves freely. At v1 release, P13 turns on. v1 itself is the last opportunity to make breaking shape changes — and that opportunity is used **only** for surfaces that are genuinely wrong (semantically broken, dangerous defaults, strongly negative patterns).

Accepted v1 carve-outs:
- `DateRangePicker.modelValue`: concat-string → `string[]` (value is structurally an array; old shape forces callers to parse a delimiter).
- `DialogIcon` structured object → `string | Component` (per P11).

When in doubt, deprecate. The carve-out is for things you'd otherwise spend the next decade explaining as "the historical quirk."

**Bug-fix renames.** If a prop's *behavior* was wrong (semantic bug), fixing it is a breaking change in disguise. Treat as a deprecation: ship the corrected behavior under a new name, deprecate the old.

**Security/correctness fixes** that can't be done compatibly are not deprecations — they ship as outright fixes with a changelog + advisory. P13 covers normal evolution.

```ts
// Bad — outright rename, breaks every existing call site
- props: ['disableOutsideClickToClose']
+ props: ['dismissible']

// Good — add the new prop, deprecate the old, keep both working
const props = defineProps<{
  dismissible?: boolean
  /** @deprecated use `dismissible` */
  disableOutsideClickToClose?: boolean
}>()

const isDismissible = computed(() => {
  if (props.disableOutsideClickToClose !== undefined) {
    warnDeprecated('Dialog', 'disableOutsideClickToClose', 'dismissible')
    return !props.disableOutsideClickToClose
  }
  return props.dismissible ?? true
})
```

### P14. Experimental carries no promise

**Rule:** Code reached through the `frappe-ui/experimental` subpath is private and **exempt from P13**. It can change shape or be removed in any release — including minor/patch — with no deprecation window. Use it from first-party Frappe libraries without expecting stability.

**Why:** First-party libraries need to reuse internal building blocks, composables like `useInputLabeling`, class helpers, headless logic, and components whose API is still settling — without every one being promoted to the public API and frozen under P13. `experimental` is that escape hatch: the framework gets to consume these while the *public* surface stays small and the cost of evolving them stays zero. The alternative, re-exporting each helper from the public API, or opening a `./src/*` wildcard either freezes everything under P13 or exposes everything forever. `experimental` is the deliberate middle: a small, curated, explicitly-unstable surface.

**Mechanics:**
1. Exposed through a single curated barrel (`experimental.ts`) behind the `./experimental` export **not** a `./src/*` wildcard. Re-export only what a first-party consumer actually needs.
2. The barrel header restates the no-promise contract at the point of use.
3. "Private" is by convention, `exports` can't scope visibility to a specific consumer so the contract is the disclaimer, not enforcement. Product/third-party code is told not to import it.
4. To make an internal stable, deliberately promote it to a public entry point (and thus under P13). Until then, no guarantees.
