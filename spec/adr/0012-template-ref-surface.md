# What earns a place on the template-ref surface

**Status**: accepted

## Context

Every component has four public surfaces: props, slots, emits, and whatever it hands back
when you grab it with a template ref. The first three were reviewed component by component
before the v1 freeze. The fourth never was.

[`imperative-api.md`](../imperative-api.md) documented how bad it had got — `open` meaning
both a function and a boolean inside one file, four names for "give me the element", three
ways to focus and most things unfocusable, two exported types with nothing behind them. It
proposed five verbs, an element policy, and a required type per component. It sat at
`proposed` and so [at-bar](../at-bar.md) item 8 had nothing to check against, blocking nine
of the map's fourteen sweeps.

Its §3 put four breaking changes up for sign-off and declared everything additive exempt,
on the grounds that additions break nobody.

**That exemption was the thing worth arguing with.** Under the map's Rule 2, an added
method is frozen until `2.0.0` exactly like a renamed one. The spec's own §2.1 concedes the
asymmetry — "adding a verb later is a minor release" — which makes an unproven method the
expensive direction and an omitted one cheap to fix.

## Decision

### A member earns its place when parent script needs it and nothing else reaches

Vue already offers three ways out of a component. Slot props reach code inside the slot.
`v-model` and emits reach state. A template ref exists for what neither can do: driving the
component from the parent's `<script>`.

So the test for putting anything on this surface is that a parent's script needs it and no
other surface reaches. This is what the rest of the decisions below fall out of.

Counting against freshly fetched app trees, the test discriminates rather than rubber-stamps:

- `focus()` passes overwhelmingly. 31 sites reach through `TextInput.el` purely to call it,
  seven more use `querySelector`/`getElementById` as a workaround (builder 5, helpdesk 2),
  and apps call `.focus()` on their own components as a matter of habit. §1.3's gap is real:
  the library's two most-used inputs cannot be focused at all.
- `clear()` passes only where it already ships. Outside `Select` / `Combobox` /
  `MultiSelect`, the whole bench has one site — builder's `propertyCombobox.value?.reset()`.
  For a text input, `v-model` already empties the value.
- `FileUploader.inputRef` fails. Zero sites, and its replacement was covered by a slot prop
  the whole time.

### `open` and `close` are for overlays that own their trigger

Popover, HoverCard, Dropdown and the pickers all render the trigger inside themselves
through a `trigger` slot. Code outside that slot has no handle on it, so a template ref is
the only way in — and apps do exactly that: builder's `ColorPicker` calls `open()` and
`close()` from a function in its `<script>`, and helpdesk opens a date picker from a menu
item's `onClick` in three places.

`Dialog` has no trigger slot. The parent decides when it appears and already holds that
state in `v-model`, so there is nothing a ref reaches that the parent does not already have.

This replaces the reasoning `imperative-api.md` §2.8 originally used, which was that nobody
in the bench calls Dialog's `close()` through a ref. That is true, and it is weak: zero
usage is evidence nobody hit the need, not that the need is absent. Trigger ownership is a
property of the component, so it predicts rather than observes — and it gives the same
answer for Dialog while keeping Popover and HoverCard, which pure usage-counting would not
have justified as cleanly.

### The four sign-off calls

1. **`el` → `inputElement` on `TextInput` and `Textarea`.** Renamed, as a read-only computed
   typed as precisely as possible. `el` says nothing about which element arrives and does
   not match `ScrollArea`'s `viewportElement`; keeping it would freeze two naming
   conventions for one idea. Keeping `el` alongside the new name was never available —
   ADR-0008 bans deprecated members in `1.0.0`.
2. **`Dialog` hands back nothing.** `defineExpose` goes and the exported `DialogExposed` is
   deleted, per the trigger-ownership rule. Growing it to `{ open, close }` for symmetry
   with Popover was rejected: symmetry is not the rule, trigger ownership is.
3. **`FileUploader` hands back nothing.** `inputRef` is removed with nothing in its place.
   The spec's proposed `open()` would have been a second public name for an action already
   called `openFileSelector` as a slot prop in 28 app files across five apps, and the slot
   prop reaches every real use — all 28 put the trigger button inside the slot. Renaming the
   slot prop to match was rejected as a quiet break in 28 files, bought for nothing.
4. **`Combobox.reset` → `clear`** was already shipped before this ADR, via
   [`selection.md`](../selection.md). It carries one live migration site.

### The additive half is bounded, not exempt

- `focus(options?)` goes on everything you can type in or tab to.
- `open` / `close` go on trigger-owning overlays only. Popover and HoverCard keep theirs;
  the three date pickers and `TimePicker` gain both.
- `clear()` stays on `Select`, `Combobox` and `MultiSelect` and goes nowhere new.
- `DropdownExposed` — exported, promising a `close()` that `Dropdown.vue` never defines — is
  **deleted**, not implemented. Implementing it would add an unproven pair of methods to
  make a type true that no one should have been relying on.

Anything else waits for a real request and arrives in a minor release.

## Consequences

- **`imperative-api.md` is accepted**, so [at-bar](../at-bar.md) item 8 has a contract to
  check against and the nine blocked sweeps are unblocked.
- **The `el` rename is the widest change in the document, and most of it is not a rename.**
  Of 39 app sites, 31 only call `focus()` and move to the new method; 5 (all crm, doing
  `select()` / `blur()`) take the new name; 3 read `el._value` and need rewriting against
  the model value. Every break surfaces as a type error, not a runtime crash.
- **Three migration entries are silent breaks** under ADR-0011's test and need a
  before/after: the `el._value` reads in crm's and helpdesk's vendored `Autocomplete` forks,
  builder's live `Combobox.reset()` call, and the `select()` / `blur()` sites in crm.
  Removing `DialogExposed` and `FileUploader.inputRef` are loud breaks and need only a
  changelog line.
- **Each sweep does its own family's work.** This ADR sets the contract; the `defineExpose`
  edits happen inside the sweep that owns each component, as at-bar item 8.
- **A sixth verb, or a third element role, still needs an ADR.** That limit is what stops
  this surface drifting back into four names for one idea.
