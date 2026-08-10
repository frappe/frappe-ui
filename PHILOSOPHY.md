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

**Rule:** Event and slot names describe what happened to the component's state, not the physical input that produced it. The same holds for every name an export hands back — composable return members, `defineExpose` members, utility and plugin export names. Prefer `change`, `open`, `select`, `submit`, `dismiss` over `toggle`, `clickOutside`, `keydownEnter`.

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

Accepted v1 carve-outs:
- The v1 resource surface (`createResource`, `createListResource`, `createDocumentResource`) and the v2 data-fetching composables (`useCall`, `useDoc`, `useList`, `useDoctype`, `useNewDoc`) keep every member name they ship today — including three names for one fetch (v1 `fetch` / `reload` / `submit`, v2 `execute` / `fetch` / `reload`) and two for one loading ref (v2 `loading` / `isFetching`). These names don't meet the rule; renaming them costs every consumer a migration and buys a tidier surface, and that trade is worse than the violation.

P13 freezes them at the v1 tag and ADR-0008 leaves no room for a compatible rename, so they ship as-is until `2.0.0`.

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

No third axis (`intent`, `severity`, `appearance`, `kind`, `status`). "Warning" maps to `theme="amber"` in the consumer, not in the API. Canonical values for `variant` and `theme` are defined in CONTEXT.md.

**State-driven appearance** (error, disabled, loading) is governed by state props (`error`, `disabled`, `loading`), not by `theme`. A `TextInput` turning red on error is not `theme="red"`.

**Components without a tone axis.** Components with one canonical look (Switch, TextInput, Checkbox) don't need a `theme` prop. P4 forbids inventing a *third* axis, not requiring a second.

**Why:** A semantic axis adds indirection (which `intent` maps to which color?), drifts across components (`intent` vs `appearance` vs `kind`), and breaks down under brand customization. Two axes — visual + tone — is what every mature component library converges to.

```vue
<!-- Bad -->
<Alert intent="warning" />
<Button appearance="primary" />
<Badge kind="success" />

<!-- Good -->
<Alert theme="amber" />
<Button variant="solid" theme="blue" />
<Badge variant="subtle" theme="green" />
```

---

### P5. Every input control exposes the shared labeling contract

**Rule:** Every form-control component (anything that holds a value the user enters, selects, or toggles) accepts the same four labeling props with identical semantics: `label`, `description`, `error`, `required`. Behavior is defined in `spec/inputs.md`; each conforming component is enumerated in its family's spec (`spec/selection.md` for the selection family, `spec/inputs.md` for input-family atoms).

Icon-only buttons, action toggles, and other controls that don't carry a value are **not** input controls — P5 doesn't apply.

**`Editor` carve-out.** `Editor` (`frappe-ui/editor`) holds a value the user enters, which would put it under P5, but it is **renderless** by design (ADR-0004): it makes zero layout decisions and renders no chrome of its own, so a `label`/`description`/`error` prop would have nowhere to draw itself. Labeling `Editor` is layout, same as its menus and action buttons — the consumer renders a label above the slot the same way it renders everything else inside it, typically via the app's own `FormControl`-style wrapper (see spec/editor.md's "build your app's component on `<Editor>`" pattern).

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
- `#content` — an overlay's content when `#default` is already the trigger
- `#empty` — fallback when a list has no items
- `#loading` / `#error` — the loading and error states; a slot replaces the whole state, not a line inside it
- `#actions` — the row of action buttons in a header or toolbar
- `#footer` / `#header` — region wrappers
- `#label` / `#description` — overrides for the labeling contract (P5)

A family spec may add region slots for parts only that family has — charts add
`#legend` and `#tooltip` (spec/charts.md). A family-specific slot still names the
part, never the interaction, and the family spec is where it is recorded.

**`#body` is not in the vocabulary.** It said "the content, but bypassing the
component's own shell", which is a *prop* (`bare`), not a slot — and every call
site that reached for it then hand-copied the shell classes it had just removed.
Dialog warns on it, Popover dropped it, Tooltip's became `#content` + `bare`.

**`#default` is the trigger on Tooltip**, the one inversion in the library. Its
shorthand — `<Tooltip text="Delete"><Button /></Tooltip>` — is what over 200 of
its call sites use, so `#content` names the other half rather than making every
one of them wrap a trigger in a named slot for no behavioral gain.

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
<Picker :fetch-options="fetchUsers" multi searchable creatable />

<!-- Good -->
<Select />          <!-- single, fixed options -->
<MultiSelect />     <!-- multi, fixed options -->
<Combobox />        <!-- single, searchable; :filterable="false" to search server-side -->
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

**The Rating exception:** Rating pairs its `icon` prop with an `#icon` slot. The star glyph *is* the component's content — `#prefix`/`#suffix` don't exist on it — and the slot receives per-star fill state (`state`, `previewValue`, …) that a prop cannot carry, which P7 requires for state-driven rendering (e.g. per-position emoji scales).

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

### P14. Unstable entry points carry no promise

**Rule:** Some entry points are curated barrels that ship with **no stability promise at all** — exempt from P13. They can change shape or be removed in any release, including minor/patch, with no deprecation window.

Two members today:
- **`frappe-ui/experimental`** — private internal building blocks: composables like `useInputLabeling`, class helpers, headless logic, and components whose API is still settling. Use it from first-party Frappe libraries without expecting stability.
- **`frappe-ui/vitepress`** — the shared VitePress docs theme. Ships at `1.0.0`, but is exempt from both P13 and P15's build-time additive-only rule. Its only consumer today is frappe-ui's own docs site, so every field of `DefineDocsConfigOptions` was shaped by exactly one caller; the theme needs room to change shape as a second Frappe docs site adopts it.

**Why:** First-party code needs to reuse things the public API isn't ready to freeze — internal building blocks not yet promoted (`experimental`), or a config surface shaped by a single caller that would ossify around that caller's needs the moment a second one shows up (`vitepress`). The alternative — re-exporting each of these from a public, frozen entry point, or opening a `./src/*` wildcard — either freezes something not ready to freeze or exposes everything forever. An unstable entry point is the deliberate middle: a small, curated, explicitly-unstable surface.

**Mechanics:**
1. Exposed through a single curated barrel behind its own subpath export (`experimental.ts`; `vitepress/index.ts` + `index.node.ts` + `index.d.ts`) — **not** a `./src/*` wildcard. Re-export only what a first-party consumer actually needs.
2. The barrel's header restates the no-promise contract at the point of use.
3. "Private"/"unstable" is by convention — `exports` can't scope visibility to a specific consumer, so the contract is the disclaimer, not enforcement. Product/third-party code is told not to import it.
4. To make a member stable, deliberately promote it to a public entry point (and thus under P13, or under P15's additive-only rule for a build-time member). Until then, no guarantees.

---

## Package structure

### P15. Root is the default; a subpath is earned, not organized into

**Rule:** Every export lives at the package root unless it clears one of three bars:

1. **Cost isolation** — it statically pulls a third-party dependency, or ships a CSS side effect, that root must not impose on every consumer. A dependency reached only through `await import()` is already isolated and doesn't count.
2. **Extensible registry** — consumers can add a *new kind* of member the library never defined (a custom TipTap extension, a custom menu item), with no library change. A component with props and slots isn't this, however complex internally; neither is assembling a fixed set of named parts into a layout, however many parts.
3. **Name collision** — its export names collide with root's, or would as root grows.

Part count, file count, and "it would read better organized" are explicitly **not** reasons. Grouping by domain is the docs' job, not the module graph's — and a subpath is a one-way door: exported at `1.0.0`, it freezes under P13 until `2.0.0`, while adding a subpath later is always additive. When in doubt, default to root; the cost of being wrong is much lower in that direction.

**Why:** A subpath makes a permanent promise about where something lives and what it costs to import. Without a written bar, every new family invents its own answer and the split reads as historical accident. The three bars above are the only things that have held up against every existing family, tested one by one — see ADR-0010 for the full audit and the size/collision-only alternatives it rejected along the way.

```
// Good — cost isolation: TipTap only loads if you import it
import { Editor } from 'frappe-ui/editor'

// Good — a fixed set of named parts, however many: root
import { SettingsDialog, SettingsSidebar, SettingsPanel } from 'frappe-ui'

// Bad — minting a subpath because a family "feels big enough"
import { Sidebar, SidebarItem } from 'frappe-ui/app-shell' // Sidebar has no
// dependency, no CSS side effect, and no colliding name — it stays at root.
```

**Consequence:** because root is the permanent home for everything that doesn't clear a bar, its compound families — `SettingsDialog`, `PageHeader`, `Sidebar`, list views — freeze there too. A subpath can't be used later to fix a name that shipped wrong; getting those names right is the cost of keeping them at root.

**`export *` only from a curated barrel.** An entry point may `export *` from an `index.ts` whose export list was reviewed — a component family's barrel, `data-fetching/`, `experimental.ts`. It may never `export *` from an implementation module. The two look identical in a diff and behave completely differently: a barrel's export list is the reviewed decision, while an implementation module exports whatever it happens to need exported next, and a helper added months later joins the public API with no review, no docs, and — after `1.0.0` — a freeze until `2.0.0`.

This is not hypothetical. At the time of the [#870](https://github.com/frappe/frappe-ui/issues/870) audit, six such lines in `src/index.ts` were publishing **31 members nobody had reviewed**, which is how `getSystemTheme`, `scrollTo`, `UseScrollContainerOptions` and `useIsMobile` came to be part of the public surface. `tailwind/tokens.js` reached the same state by the same route ([#887](https://github.com/frappe/frappe-ui/issues/887)).

The rule is a one-line grep, and the fix is mechanical — spell the members out:

```ts
// Bad — src/index.ts
export * from './composables/useScrollContainer'  // implementation module:
// today 9 members, tomorrow whatever the next commit adds

// Good
export {
  shellScrollContainer,
  useShellScrolled,
} from './composables/useShellScrolled'

// Good — a curated barrel, whose own list is the reviewed decision
export * from './components/Button'
```

Naming the members is also what makes the export surface readable at all: `src/index.ts` becomes the list of what ships, rather than a list of directories to go and expand by hand.

**Build-time and tooling entries are a separate category.** `tailwind`, `vite`, `vitepress`, `tsconfig.base.json`, and the `*-style.css` entries aren't judged by the three bars above — they aren't importable into a component tree, so cost isolation, an extensible registry, and name collision have nothing to say about them. ADR-0010 opened this category without saying what its own terms are; [#887](https://github.com/frappe/frappe-ui/issues/887) settled them:

**A build-time entry freezes additive-only at `1.0.0`.** Options, tokens, utilities, and compiler options may be *added* in a minor. Nothing may be renamed or removed before `2.0.0`.

Neither of P15's other two shapes fits. A P13-style freeze would end the design-token vocabulary the day we tag — the Figma token sync exists to keep adding tokens, and a deprecate-then-remove cycle has no answer for "add a new one." A P14-style no-promise carve-out is the other extreme, and not one the six apps whose CSS and builds depend on the tailwind preset and the vite plugin would accept. Additive-only is the shape where existing names can't move and new ones can still appear.

The one named exception is `frappe-ui/vitepress` — see P14.
