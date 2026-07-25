# Selection Family API Finalization

Status: **accepted — ready to implement**. Written against `1.0.0-beta.25`.
Implementation lands on `agent/multiselect-search-slots` (PR #856).

Everything in §2, §3, and §5 is decided and unblocked. The only open question
is one of scope, not design: whether the `Autocomplete` removal (§6) rides in
the same PR or follows separately. §6 also gained one new hard prerequisite —
see §6.9.

This document is an adversarial audit of the *shipped* public API of the
selection family, measured against [`selection.md`](./selection.md) and against
the goal of freezing a surface where every future change is additive.

Scope:

- `Select`
- `MultiSelect`
- `Combobox`
- `Autocomplete` — **removed entirely** before `1.0.0` (§6)

`Dropdown` and `ItemListRow` are in the same family but are not audited here —
they are action-menu and row-primitive concerns, and their divergences are
already tracked in their own specs.

## Relationship to `selection.md`

[`selection.md`](./selection.md) is the accepted direction and stays
authoritative for vocabulary, item customization, positioning, motion, and
grouping. This document does not restate any of it.

What this document adds:

1. The **decided deprecation policy** for the v1 freeze (§1), which reverses
   `selection.md` §13.
2. A record of where the **implementation has drifted from the accepted spec**
   (§2). These are bugs against the spec, not new proposals.
3. Findings on API surface that `selection.md` never covered because the
   members were added during implementation (§3).
4. A verdict on PR #856 (§5).
5. The removal plan for `Autocomplete` (§6).

---

## 1. Decision: the deprecation window closes at `1.0.0`

**Decided.** Nothing marked `@deprecated` ships in `1.0.0` — neither
individual members nor whole components. Everything listed below is deleted
before the stable tag.

This **reverses** `selection.md` §13 (*"do not break existing public APIs"*,
*"keep older APIs exported and functioning"*) and the v1 release contract's
*"no breaking API removals"*. Those were written to protect bench apps already
consuming these components. The reversal rests on one fact: **we are on
`1.0.0-beta.25`**. Nothing here is covered by a stability promise yet, and
once `1.0.0` ships every deprecated member is locked until a major. This is
the last free window.

`selection.md` §13, the v1 release contract, and the "Autocomplete
compatibility note" (`selection.md:775-795`, which commits to *"a long
migration, not an abrupt rename"*) all need amending, and an ADR should record
the reversal.

### 1.1 Deprecated members in this family

| Member | Component | Replacement |
| --- | --- | --- |
| `option.slotName` | MultiSelect, Combobox | `option.slot` |
| `option.render` | MultiSelect, Combobox | `option.slots` |
| `#option` slot | Select, MultiSelect | `#item-label` |
| `SelectItemSlotProps.option` | Select | `item` |
| `placement` prop | Combobox | `align` |
| `ComboboxPlacement` type | Combobox | `PopoverAlign` |
| `searchTerm` in custom-option context | Combobox | `query` |
| `input` emit | Combobox | `update:query` |

Plus the whole of `Autocomplete` — see §6.

### 1.2 Deprecated components elsewhere in the library

The policy is library-wide, so these go too. They are listed for completeness;
each needs its own migration pass and none is covered by this document:

| Export | `src/index.ts` | Replacement |
| --- | --- | --- |
| `Card` | :103 | layout markup / domain components |
| `ConfirmDialog`, `confirmDialog` | :106, :108 | `dialog.confirm(...)` |
| `FeatherIcon` | :111 | lucide names or `Icon` |
| `Input` | :114 | `TextInput` / `FormControl` |
| `ListItem` | :117 | `frappe-ui/list` primitives |
| `MonthPicker` | :119 | `Select` |
| `Toast` (SFC) | :121 | imperative `toast(...)` |
| `ThemeSwitcher` | :123 | `Select` + `useTheme` |
| `TextEditor` root exports | :125-129 | `frappe-ui/editor` subpath |
| `FormControl type="autocomplete"` | `FormControl.vue:78` | `Combobox` |

`FormControl type="autocomplete"` is the one entry that overlaps this
document — removing it narrows `FormControl`'s `type` union and is a
prerequisite for §6.

**Decided:** the sweep happens one component family at a time, selection
family first. The `1.0.0` tag waits for the whole sweep, but each family lands
as its own change set. Nothing in §1.2 blocks the selection-family work.

---

## 2. Implementation drift from the accepted spec

These are cases where the shipped code does not match `selection.md` or its
sub-specs. They need to be reconciled regardless of the §1 decision.

### 2.1 `toggleOpen` was never implemented; `setOpen` shipped instead

`selection.md` §2 lists `toggleOpen` and `close` as the canonical open-state
slot helpers. `multiselect.md` repeats `toggleOpen` in six places
(`multiselect.md:148,158,194,196,202,210`).

Shipped:

- `MultiSelect` exposes `setOpen(value: boolean)` (`MultiSelect/types.ts:132`)
- `Combobox` exposes `setOpen(value: boolean)` (`Combobox/types.ts:182`)
- `Select` exposes **neither** (`Select/types.ts:46-61`)

`setOpen(boolean)` is the better primitive — `toggleOpen` and `close` are both
derivable from it, and a setter composes with `v-model:open` semantics that the
rest of the family already uses.

**Decided:** Standardize on `setOpen(value: boolean)`. Add it to `Select`.
Amend `selection.md` §2 and `multiselect.md` to say `setOpen`, and drop
`toggleOpen` / `close` from the spec rather than implementing them.

`setOpen` does **not** replace or compete with `v-model:open` — the two are
complementary and both stay:

- `v-model:open` is the outside-in control surface, for a parent that owns the
  open state. Supported on all three today.
- `setOpen` is the inside-out helper, for code running *inside* a slot
  (`#trigger`, `#footer`, `#item`) that has no reference to the parent's state.

A consumer writing a custom `#trigger` needs `setOpen`; a consumer driving the
popover from application state needs `v-model:open`. Neither substitutes for
the other.

One related drift worth fixing while here: `Select` and `MultiSelect` implement
`open` with `defineModel('open')`, while `Combobox` hand-rolls it as a local
`ref` plus a `props.open` watcher and an `update:open` emit
(`Combobox.vue:86,386,395`). Behavior matches, but `Combobox` should move to
`defineModel` so all three share one implementation.

### 2.2 `clearSelection` was invented during implementation

`selection.md` never mentions a clear helper by name. `multiselect.md` uses
`clearAll` (`multiselect.md:157,177,225,269`). During implementation `Select`
and `Combobox` grew `clearSelection` for the same concept.

Result: the same verb has two names, and it appears in the slot props of
**every slot on every component in the family** — the single
highest-frequency inconsistency in the surface.

**Fix:** Canonical name is `clear()`. `MultiSelect` keeps `selectAll()`
alongside it, which reads correctly next to `clear()` and does not need a
`clearAll` counterpart. `clearAll` and `clearSelection` are both deleted, not
aliased.

**Userland impact: none.** The only consumer found anywhere was
`frappe/ui/TableMultiSelect.vue:57` (`#footer="{ clearAll }"`), and everything
under `frappe/` is deprecated in favour of `framework/ui` in the frappe repo —
so it is not a design input and gets deleted rather than migrated. No app in the
bench uses `clearAll`, `clearSelection`, or `selectAll` at all.

`setOpen` does have a real external consumer
(`gameplan-settings-exploration/.../CommunitySwitcherCombobox.vue:17`,
`#footer="{ setOpen }"`), which supports keeping that name (§2.1).

### 2.3 `Select` is missing the positioning props the spec promises

`selection.md` §7 and its cohesion section both state that `Select` and
`MultiSelect` gain `side`, `align`, `offset`, and `portalTo` additively.
`MultiSelect` has them. `Select` does not (`Select/types.ts:20-44`).

**Fix:** Add all four to `SelectProps` with the shared defaults
(`side: 'bottom'`, `align: 'start'`, `offset: 4`, `portalTo: 'body'`).
Purely additive.

---

## 3. Findings on surface the spec never covered

Ranked by cost of getting them wrong at freeze.

### 3.1 `compareFn` does not have the signature it advertises

`MultiSelectProps.compareFn` is typed as
`(a: MultiSelectOption, b: MultiSelectOption) => boolean`. The implementation
never passes a real second option:

```ts
// MultiSelect.vue:123-131
function findOptionByValue(value: string): NormalizedOption | null {
  if (props.compareFn) {
    const probe = { label: value, value } as NormalizedOption
    return allOptions.value.find((option) => props.compareFn!(option, probe)) ?? null
  }
  return allOptions.value.find((option) => option.value === value) ?? null
}
```

`b` is always a synthetic stub with `label` and `value` both set to the same
string. It never carries `icon`, `description`, `disabled`, or any custom
field. Any consumer who writes `compareFn` against the documented type — for
example comparing `a.value === b.value && a.group === b.group` — gets silently
wrong results.

It is also the only member of its kind in the family: `Select` and `Combobox`
resolve options by value with no override.

**Fix:** Delete `compareFn`. It is a leftover from `Autocomplete`'s API — and
`Autocomplete` itself is going away (§6) — so the compatibility argument for
keeping it disappears with it. `MultiSelect` has no behavior that requires it.
If a real need appears later, add an honest single-purpose hook —
`resolveOption?: (value: string, options: MultiSelectOption[]) =>
MultiSelectOption | null` — which is additive.

### 3.2 The slot index signature disables slot-name typechecking

All three `*Slots` interfaces end with:

```ts
[slotName: string]: ((props: any) => any) | undefined
```

(`MultiSelect/types.ts:268`, `Select/types.ts:135`, `Combobox/types.ts:251`)

This exists to support the per-option `slot?: string` dynamic-name feature. The
cost is that **every slot name typo compiles clean** — `#itm-label`,
`#item-sufix`, `#serch-prefix` all typecheck, render nothing, and fail
silently. For a component family whose whole customization story is slots,
this removes the main safety net.

Since `selection.md` §9 landed the per-item inline `slots` object, the
template-side `slot?: string` dispatch is no longer the only way to reach a
custom row from JavaScript-built options — `slots.label` covers the same need
with no global slot name at all.

**Fix:** Keep `option.slot`, drop the deprecated `slotName`, and narrow the
index signature to a template-literal key:

```ts
[slotName: `item-${string}`]: ((props: ItemSlotProps) => any) | undefined
```

`item.slot` already resolves to `` `item-${item.slot}` ``
(`MultiSelectResults.vue:55`), so this key pattern is exactly the current
runtime behavior — nothing breaks. Dynamic dispatch is preserved, and every
fixed slot name (`item-prefix`, `group-label`, `search-prefix`, …) becomes
typechecked again.

This is the highest-leverage type change available in the family and it costs
nothing.

### 3.3 Generic type names are squatting the package root

`src/index.ts:38` does `export * from './components/Combobox'`, which publishes
these at the top level of `frappe-ui`:

- `SelectableOption`, `CustomOption`, `SimpleOption`, `GroupedOption`
  (`Combobox/types.ts:72-89`) — unprefixed aliases of the `Combobox*` types
- `PopoverSide`, `PopoverAlign` (`Combobox/types.ts:7-8`)

Related problems:

- `PopoverSide` / `PopoverAlign` are **declared twice** — once in
  `Combobox/types.ts:7-8` and again in `MultiSelect/types.ts:7-8` — as
  separate, structurally identical types. Only Combobox's copy is exported,
  so the two can drift without a compile error.
- `SelectExposed {}` (`Select/types.ts:146`) is an exported empty interface.
  It is a public type that carries no information.
- `MultiSelect/index.ts` already uses an explicit export list. `Select` and
  `Combobox` use `export *`, so every future type added to their `types.ts`
  is published automatically whether or not that was intended.

**Fix:**

- Hoist `PopoverSide` / `PopoverAlign` to `src/components/shared/` and import
  them in both places. Export once.
- Delete the unprefixed `SelectableOption` / `CustomOption` / `SimpleOption` /
  `GroupedOption` aliases.
- Delete `SelectExposed` or give it real members (see 3.6).
- Convert `Select/index.ts` and `Combobox/index.ts` to explicit export lists
  so publishing a type is a deliberate act.

### 3.4 Three slot props describe "what is selected"

`MultiSelect` slot props carry all of:

- `selectedOptions` — the resolved option objects
- `displayValue` — `selectedOptions.map(o => o.label).join(', ')`
  (`MultiSelect.vue:139-141`)
- `summary` (on `#summary` only) — the compact `"N selected"` trigger text

`displayValue` is one line of consumer code derived from `selectedOptions`, and
it is the only slot prop in the family that hardcodes a **formatting**
decision. `summary` is not derivable and earns its place. `Select`'s
`displayValue` is likewise `selectedOption?.label ?? ''`.

**Fix:** Drop `displayValue` from `Select` and `MultiSelect` slot props. Keep
`summary`, and keep `displayValue` on `Combobox`, where the committed-value vs
typed-query distinction makes it genuinely non-derivable.

Note this conflicts with `selection.md` §2, which lists `displayValue` as a
slot prop to expose where relevant — that line needs amending.

### 3.5 `#footer` receives a different shape on each component

| Component | `#footer` slot props |
| --- | --- |
| `Select` | `{ selectedOption, clearSelection }` |
| `MultiSelect` | `{ clearAll, selectAll, selectedOptions, query }` |
| `Combobox` | full `ComboboxControlSlotProps` |

Three shapes for one slot name, and only Combobox's is predictable from the
rest of its API.

**Fix:** `#footer` receives the component's control slot-prop shape — exactly
what Combobox already does — plus `selectAll` on `MultiSelect`. One shape per
component, reusing the type name already exported for `#trigger`. Removes
`SelectFooterSlotProps` and `MultiSelectFooterSlotProps` from the surface.

### 3.6 `defineExpose` is asymmetric and `reset()` becomes `clear()`

- `Combobox` exposes `{ reset, focus }` (`Combobox.vue:421`)
- `MultiSelect` exposes nothing
- `Select` exposes nothing (and has an empty `SelectExposed` type)

`reset()` has no spec entry and its name does not say what it resets. It
currently does four things (`Combobox.vue:369-375`):

```ts
function reset() {
  query.value = ''
  hasTypedSinceOpen.value = false
  model.value = null
  emit('update:query', '')
  emit('update:selectedOption', null)
}
```

**Decided:** every component exposes exactly `{ clear, focus }`.

- `reset()` is renamed to `clear()`, matching the `clear()` slot prop from
  §2.2 so the same verb means the same thing on both surfaces.
- `clear()` clears the selection. The query reset stays in the implementation
  because clearing while the popover is open should not leave a stale filter,
  but it is no longer a separate advertised concern — the popover already
  resets the query on close (`MultiSelect.vue:274-278`), so this is not new
  observable behavior for the common case.
- `focus()` is added to `Select` and `MultiSelect`. It is the minimum
  programmatic surface for a form control and consumers reach for it
  constantly.
- `focus()` must stop resolving its target via `document.getElementById`
  (`Combobox.vue:377-381` does this today, and PR #856 copies the pattern —
  see §5.3). Use `useTemplateRef`.

`SelectExposed` and `ComboboxExposed` collapse to one shared exported type.

### 3.7 `data-slot` values are a public styling surface and disagree

`data-slot` is documented in `selection.md` §4 as a stable styling hook.
Shipped values:

| Region | Select | MultiSelect | Combobox |
| --- | --- | --- | --- |
| in-popover search row | — | `search` | `content-search` |
| chevron | — | — | `chevron` |
| content body wrapper | — | `content-body` | — |

A consumer writing `[data-slot='search']` to style the search row gets
MultiSelect and misses Combobox.

**Fix:** Pick one vocabulary and freeze it. Recommend `search` for the search
row (drop `content-` prefixing, since `content-body` and `content-search` are
the only two users of it), and add `chevron` to `Select` / `MultiSelect` so
the default suffix indicator is stylable everywhere.

### 3.8 There is no `query` prop anywhere in the family

`MultiSelect` and `Combobox` both emit `update:query` but neither accepts a
`query` prop. `selection.md` §1 made this call deliberately: *"query stays
internal for now"*, *"should not require `v-model:query`"*.

That was the right default. The consequence has now surfaced: PR #856 has to
invent an imperative `setQuery` handed out through a slot, because a slot is
the only place a consumer can reach the query at all.

**Fix:** Add `query?: string` to `MultiSelect` and `Combobox`, completing
`v-model:query`. This is additive, matches how `open` already works
(`open` prop + `update:open`), and turns `setQuery` in slot props into a
convenience rather than the sole access path. `selection.md` §1's "should not
*require* `v-model:query`" is preserved — it stays optional.

### 3.9 Option value types are inconsistent across the family

Shipped:

| Component | Value type |
| --- | --- |
| `Select` | `string \| number \| bigint \| Record<string, any>` |
| `Combobox` | `string \| null` |
| `MultiSelect` | `string[]` |

`selection.md` lists unifying value types as an explicit non-goal, on the
grounds that the divergence carries real semantics. That reasoning does not
survive contact with the code: **the divergence is self-imposed, not forced by
the primitives.**

`Select` passes `option.value` straight through to Reka's `SelectItem`
(`Select.vue:368`) with no coercion, and Reka accepts
`string | number | boolean | Record<string, any>`. Reka's Combobox primitive
accepts the same union. `Combobox` and `MultiSelect` are narrower purely
because of their own TypeScript declarations (`Combobox.vue:84`,
`MultiSelect.vue:67`) — not because anything downstream requires strings.

**Decided:** all three accept `string | number`. A userland expectation that a
numeric ID works in every picker is reasonable, and there is no technical
reason it should not.

Implementation notes:

- `MultiSelectOption.value` and `ComboboxSelectableOption.value` widen to
  `string | number`; the models become `Array<string | number>` and
  `string | number | null`.
- The substring filter used by `matchesOption` needs `String()` coercion so
  numeric values remain searchable.
- `useEmptyValueMapping` is unaffected — it only special-cases `''`, and
  returns `option.value` untouched otherwise.
- `Combobox.allowCustomValue` still produces strings by definition (the value
  is the typed query). With a widened union that is simply one arm of it.

**Research result: narrow `Select` to `string | number`.** Across every app
actually read — gameplan, gameplan-settings-exploration, meet, builder, crm,
helpdesk, and frappe-ui's own `frappe/` package — the counts are:

- **string** — effectively every call site (docnames, enum values, fieldnames,
  IANA timezones, device IDs)
- **number** — 2 sites, both `Select`, both `{value: 0} / {value: 1}` for a
  Check field (`gameplan-settings-exploration/.../AddTeamDialog.vue:13-16`,
  `.../Project.vue:130-138`). Confirms `number` is needed.
- **object as an option's `value`** — **zero, everywhere**
- **boolean** — zero. `helpdesk/.../CFCondition.vue:266` explicitly stringifies
  Check fields to `"Yes"/"No"` first.
- **bigint** — zero
- **empty string** — used as a real "none" value in several apps, confirming
  `useEmptyValueMapping` stays (§6.7)

So `Record<string, any>` and `bigint` come out of `SelectOptionValue`.

**Insights confirmed — the narrowing is safe.** Every option value built in
insights is a string: `c.column`, `table.table`, `query.name`, `team.name`,
`field.fieldname`, `dataSource.name`, `result[valueField]`. The only non-string
is `value: index` (`setup/SetupQuestions.vue:119`), a number — which the union
keeps.

One near-miss worth recording so nobody re-opens this: `dashboard/SimpleFilter.vue`
assigns `{ value, label }` objects to `filter.value` (`:319,336,346`). That is
its own local filter state, not an option value handed to a picker, and the
`Combobox` in that file is headlessui's, not frappe-ui's. Not a counter-example.

So `Record<string, any>` and `bigint` come out of `SelectOptionValue`, and
§3.9 is closed.

One related signal worth recording: `meet/.../DeviceSettingsTab.vue:130-163`
carries defensive code, `typeof newDeviceId === "object" ? newDeviceId?.value :
newDeviceId`, commented *"Handle both string and object formats from
autocomplete :/"*. That is a consumer working around inconsistent **emit
payload** shape, not designing for object values — more evidence for the
payload-identity rule in §6.6.

---

## 4. Divergence matrix (post-fix target)

|  | Select | MultiSelect | Combobox |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` (+ object? §3.9) | **`Array<string \| number>`** | **`string \| number \| null`** |
| `v-model:open` | yes | yes | yes |
| `v-model:query` | n/a | **add** | **add** |
| `side`/`align`/`offset`/`portalTo` | **add** | yes | yes |
| `loading` | no (static by spec) | yes | yes |
| `emptyText` + `#empty` | yes | yes | yes |
| `clear()` in slot props | **rename** | **rename** | **rename** |
| `setOpen()` in slot props | **add** | yes | yes |
| `selectedOption(s)` | singular | plural | singular |
| `displayValue` | **remove** | **remove** | keep (input mode needs it) |
| `#item` | **add** | yes | yes |
| `#group-label` | n/a — no grouping (§7.1) | yes | yes |
| `#search-prefix` / `#search-suffix` | n/a | **add (#856)** | **add (#856)** |
| `#summary` | no | yes | no |
| exposed `{ clear, focus }` | **add** | **add** | **rename `reset`** |
| `compareFn` | no | **remove** | no |
| `#footer` props | control shape | control shape + `selectAll` | control shape |

Cells marked **bold** are changes this document proposes.

---

## 5. Verdict on PR #856 (`#search-prefix` / `#search-suffix`)

<https://github.com/frappe/frappe-ui/pull/856> — closes #855.

**Decided: the whole selection-family freeze lands in this PR**, on the
`agent/multiselect-search-slots` branch, rather than merging #856 first and
reworking afterwards. Three of the four fixes below (`focus` via template ref,
the query model, the slot-prop shape) overlap directly with §2, §3, and §6, so
splitting them means doing the same work twice. The PR title and description
need rewriting to match the widened scope.

**The slot names are correct.** `search-prefix` / `search-suffix` follows the
established `<region>-<part>` vocabulary (`item-prefix`, `item-label`,
`group-label`) and does not collide with the trigger `#prefix` / `#suffix`.
The feature is worth having.

Four changes before merge:

### 5.1 Combobox must get the same slots in the same release

`Combobox.vue:680-698` renders the identical in-popover search row in
`trigger: 'button'` mode — same markup, same `${inputId}-search-input` id
convention, same styling. Landing the slots on `MultiSelect` alone turns a
family convention into MultiSelect trivia, and creates exactly the kind of
per-component divergence §3 spends its length cataloguing.

Note this also intersects the deferred `hideSearchInput` decision in
`combobox.md` (#659) — Combobox's search row currently cannot be hidden at
all, while MultiSelect has `hideSearch`.

### 5.2 The slot-prop object should be four fields, not six

Shipped in the PR: `{ query, disabled, loading, setQuery, clearQuery,
focusSearch }`.

- `clearQuery` is `setQuery('')`. Remove.
- `loading` is a prop the consumer just passed to the component. Remove.
- `focusSearch` inside a `search-*` slot is redundantly named. Rename to
  `focus`.

Target: `{ query, setQuery, disabled, focus }`.

### 5.3 `focus` must not resolve the input via `getElementById`

```ts
// MultiSelect.vue:222-227
function focusSearch() {
  const el = document.getElementById(
    `${inputId.value}-search-input`,
  ) as HTMLInputElement | null
  el?.focus()
}
```

This promotes an internal id template to a de-facto public contract, and it is
the third distinct focus mechanism in the family. Use `useTemplateRef` on the
`ComboboxInput`. Land it alongside the `defineExpose({ focus })` work in §3.6
so there is one focus story.

### 5.4 `clearQuery()` asserts the user has typed

```ts
function setQuery(value: string) {
  if (props.disabled) return
  query.value = value
  hasTypedSinceOpen.value = true   // ← also runs for clearQuery()
  emit('update:query', value)
}
```

Clearing the query should restore the "hasn't typed since opening" state, which
is what the open watcher does (`MultiSelect.vue:274-278`). Benign in
`MultiSelect` today — `useFilteredGroups` runs a substring match and the empty
string matches everything — but it is wrong state, and it will not stay benign
in `Combobox`, where the typed path additionally gates `alwaysMatch` custom
rows.

**Fix:** `hasTypedSinceOpen.value = value !== ''`.

### 5.5 Smaller notes

- Three exported type names (`MultiSelectSearchSlotProps`,
  `...SearchPrefixSlotProps`, `...SearchSuffixSlotProps`) for one interface,
  copying the existing `Prefix`/`Suffix` alias pattern. Export one name; the
  existing aliases should be deprecated rather than extended.
- Both slots are inside the `v-if="!hideSearch"` block, so they disappear
  silently when `hide-search` is set. Document it.

---

## 6. Removing `Autocomplete`

`Autocomplete` already warns at runtime (`Autocomplete.vue:219`,
`Autocomplete.cy.ts:9`) and `selection.md` designates `Combobox` (single) and
`MultiSelect` (multiple) as its replacements. Under §1 it is deleted before
`1.0.0` rather than carried through `1.x`.

This is the largest single item in the freeze, and unlike everything else in
this document it has a blocking internal dependency.

### 6.1 frappe-ui depends on `Autocomplete` itself

Three internal call sites must migrate **before** the component can be
deleted:

| File | Usage |
| --- | --- |
| `src/components/ListFilter/ListFilter.vue` | 3 usages (`:34`, `:90-108`), imports `AutocompleteOption` |
| `src/components/ListFilter/SearchComplete.vue` | 1 usage, imports `Option` from `Autocomplete/types` |

(`frappe/DataImport/MappingStep.vue` also uses it, but everything under
`frappe/` is superseded by the `framework/ui` components in the frappe repo and
is not a design input — it needs no migration, only deletion with the rest of
that folder.)

`SearchComplete.vue` and `ListFilter.vue` are the interesting ones — they use
`Autocomplete` as a remote-search picker, which is exactly the case
`Combobox` needs to cover well. Migrating them is the real proof that
`Combobox` is a sufficient replacement. Do this first; if it turns up gaps in
`Combobox`, those gaps are additive fixes that belong in the freeze.

### 6.2 `FormControl type="autocomplete"` goes with it

`FormControl.vue:78` maps `type="autocomplete"` onto the component and already
warns (`FormControl.vue:45-46`). Removing `Autocomplete` narrows
`FormControl`'s `type` union — a breaking change to a second component. It
also lets `provide(autocompleteDeprecationSuppressed, true)`
(`FormControl.vue:42`) and the whole `Autocomplete/deprecationKey.ts` module
disappear.

### 6.3 External blast radius

My first pass counted files by grep and reported ~93 across five apps. **That
number was wrong** — it counted vendored forks and local look-alikes as if they
were live-package consumers. Verified counts of genuine
`import { Autocomplete } from 'frappe-ui'` call sites:

| App | Genuine live call sites | Notes |
| --- | --- | --- |
| **insights** | **~83 sites / 48 files** | Globally registered in `frontend/src/globals.js`; genuine frappe-ui import. **This is the entire migration problem.** |
| helpdesk | ~3 | `TimezoneControl.vue:2`, `conditions-filter/CFCondition.vue:35`, `Settings/Telephony/TwilioSettings.vue:66`. Three separate forks also exist; `SearchComplete.vue` is a false positive (local component via the `@/components` barrel) |
| crm | 1 | `ConditionsFilter/CFCondition.vue:35`. `Filter.vue:161`, `SortBy.vue:168`, `Controls/Link.vue`, `ColumnSettings.vue` all import the **vendored fork** at `@/components/frappe-ui/Autocomplete.vue` |
| builder | **0** | `PageClientScriptManager.vue:87,135` already uses `Combobox`. Its other five sites use a local reka-ui look-alike |
| frappe (core) | **0** | All six matches are hand-rolled local components (`public/js/vue-components/Autocomplete.vue`, `form_builder/components/Autocomplete.vue`) with no frappe-ui import |
| gameplan, meet, raven, erpnext | 0 | raven and erpnext frontends are React — the grep hits were an unrelated component |

**Correction to my earlier count.** I first reported ~93 files across five apps
from a raw grep. That was wrong twice over: it counted vendored forks and local
look-alikes as live consumers, and it counted `frappe` core (which has none).

**The real shape: insights is ~95% of the migration, and everything else is
four call sites.** Any plan for removing `Autocomplete` is really a plan for
migrating insights.

**Secondary finding — the forks.** crm, helpdesk, and builder each keep their
own copy rather than use the published component. §6.5 explains why.

### 6.4 Coverage gap — insights is unanalyzed

The research covered gameplan, gameplan-settings-exploration, meet, frappe, and
frappe-ui's own `frappe/` package thoroughly, and produced a verified file list
for insights. It did **not** read insights' call sites.

That means the migration-blocker analysis — the deliverable that actually gates
the removal — has only negative evidence from apps with little or no usage. The
one app that matters is uncharacterized.

Highest-value next step: `insights/frontend/src/components/ListFilter/ListFilter.vue`
and `.../SearchComplete.vue`. They share names with frappe-ui's own internal
remote-search consumers (§6.1), which is where the `filterable` gap (§6.5)
surfaced. If insights has the same pattern, the gap is confirmed at scale.

**Partly closed since.** Two targeted sweeps of insights have now run:

- **Option value types** — clean, all strings plus one number. Closes §3.9.
- **Search-box control** — found `:hideSearch="true"` on two `Autocomplete`
  call sites, which turns the deferred #659 into a hard prerequisite (§6.8).

That is two questions answered, not the ~83 call sites read. A sweep aimed at
*API gaps* has now found two (`filterable`, `hideSearch`) in as many passes,
which is itself a signal that more are likely.

**Still: do not commit to a removal date until insights' call sites are read.**

**Requirements before deletion:**

- a migration guide with side-by-side `Autocomplete` → `Combobox` /
  `MultiSelect` examples covering the common shapes: single, `multiple`,
  grouped options, remote search, `#target` → `#trigger`
- `Combobox` / `MultiSelect` verified against the `ListFilter` and
  `SearchComplete` migrations (§6.1) before the guide is published
- a codemod if the `#target` → `#trigger` and prop renames turn out to be
  mechanical enough to warrant one

### 6.5 Combobox cannot do remote search — this is why apps forked

The single most important research finding, and it changes the removal plan.

`Combobox` unconditionally substring-filters consumer-supplied options once the
user types (`shared/selection/useFilteredGroups.ts:38-42`,
`Combobox/utils.ts:158-177`). There is no opt-out — `ComboboxProps` has no
`filterable` or equivalent.

For a picker whose options come from a server search, that is fatal: the
backend already returned the matches, and the client then filters them *again*
by literal substring. Any result that doesn't literally contain the typed
string — fuzzy matches, ID lookups, relevance ranking — is silently dropped.

crm hit exactly this. `crm/frontend/src/components/Controls/Link.vue:15,107-138`
runs a debounced `search_link` refetch and passes `:filterable="false"` to
suppress client filtering. It backs roughly 15 record pickers across the app.

**`:filterable` is a fork-added prop.** frappe-ui's own `Autocomplete` never
had it either — it filters unconditionally too
(`Autocomplete/Autocomplete.vue:285-293`). So this is not a regression
introduced by the migration; it is a gap in *both* components, and it is the
most likely reason three apps forked instead of adopting.

**Consequence for the removal plan:** deleting `Autocomplete` without adding
remote-search support does not bring the forks back. It just removes a
component nobody was using while leaving the reason they forked untouched.

**Fix:** add opt-out filtering to `Combobox` and `MultiSelect` before the
removal lands. Additive.

**Naming decided: `filterable?: boolean`, default `true`.** I looked for call
sites that want a *custom* client-side filter rather than just an off switch.
There are none. The only `filterable` in the bench is the one crm added to its
own fork (`crm/.../frappe-ui/Autocomplete.vue:173,227`), and it is a plain
boolean. Every `filterFn` hit belongs to something else — gameplan's
`useGroupedSpaceOptions`, which pre-filters the options array before it ever
reaches a picker, and insights' TanStack table.

So the boolean covers 100% of observed need at the smallest size. If a custom
matcher is ever wanted, widening to
`filterable?: boolean | ((option, query) => boolean)` is additive, so nothing is
lost by starting small.

### 6.6 Payload identity is already solved on Combobox, missing on MultiSelect

Several consumers depend on getting the **original option object** back, not a
`{ label, value }` stub — they read custom fields off it:

- `helpdesk/.../conditions-filter/CFCondition.vue:233-236` reads `.fieldname`
- `helpdesk/.../Settings/Profile/UserEmailSettings.vue:94-101` reads `.email`
- `helpdesk/.../Settings/EmailNotifications/ShareFeedback.vue:61,81` persists
  the whole option object as its stored value

`Combobox` already covers this: `update:selectedOption` emits the option
resolved out of `allSelectableOptions` (`Combobox.vue:277-280`), so custom
fields survive intact. The migration path is
`@update:modelValue` → `@update:selectedOption`.

`MultiSelect` has **no equivalent** — it emits only `update:modelValue`
(`string[]`) and `update:query`. Consumers who need the full objects can reach
`selectedOptions` inside a slot, but not from application code.

**Fix:** add `update:selectedOptions` to `MultiSelect` emitting
`MultiSelectOption[]`, for parity with Combobox. Additive.

This is also the second instance of the same failure class as `compareFn`
(§3.1) — synthesizing a stub option instead of carrying the real one. Worth
stating as a family rule: **anything that hands an option back to the consumer
hands back the original object.**

### 6.7 Empty-string values are load-bearing

`value: ''` is used as a real "none" / reset option across all three audited
apps — `builder/.../Settings/PageGeneral.vue:196-197,222-223` (selectable, not
just a disabled placeholder), `helpdesk/.../CallLogModal.vue:202,208`,
`helpdesk/.../FieldDependency.vue:131-132,261` where `''` gates UI logic.

`useEmptyValueMapping` exists precisely to support this against Reka's
prohibition on `''` item values. Confirms it stays, and that the widened
`string | number` union in §3.9 must keep `''` working.

### 6.8 `Combobox` must be able to hide its search input

`combobox.md` tracks this as a deferred decision (#659) — `MultiSelect` has
`hideSearch`, `Combobox` has no way to hide its search row at all. §5.1 noted
it in passing. It is now a confirmed blocker rather than a nice-to-have.

`insights/frontend/src/query/visual/TableJoinEditor.vue:99,107` passes
`:hideSearch="true"` to `Autocomplete` on two pickers — a left-table picker and
a join-type picker, both short static lists where a search box is noise.
`Autocomplete`'s replacement for single-select is `Combobox`, so those two call
sites cannot migrate until `Combobox` supports it.

**Fix:** add `hideSearch?: boolean` to `Combobox`, same name and same meaning as
`MultiSelect`'s. Additive, and it resolves #659 in the direction the family
already established.

### 6.9 Amend `selection.md`

The "Autocomplete compatibility note" (`selection.md:775-795`) says *"keep
`Autocomplete` exported and functioning"* and *"This should be a long
migration, not an abrupt rename."* Rewrite it as a removal record pointing at
the migration guide. `dropdown.md` and other sub-specs should be checked for
the same assumption.

---

## 7. Implementation record

Where the shipped implementation departed from this document, and why. Written
during implementation, not before it.

### 7.1 `Select` has no grouped options, so it gets no `#group-label`

§4 originally listed `#group-label` as an addition for `Select`. It cannot have
one: `SelectOption` is flat, the template iterates a single list with no Reka
`SelectGroup` / `SelectLabel`, and `spec/select.md` states Select accepts flat
options only in v1. `#item` was added; `#group-label` was not. Adding grouping
to `Select` is separate work, and additive whenever it happens.

### 7.2 `Select`'s positioning props switch it out of item-aligned mode

Reka's `SelectContent` only honours `side` / `align` / `sideOffset` when
`position="popper"`. `Select` defaults to `item-aligned` — the menu anchored
over the trigger, macOS-style — and `spec/select.md:90-92` promises callers who
pass none of these props keep that placement.

So the three props are deliberately **not** given `withDefaults` values. They
stay `undefined` until set, and the component switches to `position="popper"`
the moment any one of them is provided, using `'bottom'` / `'start'` / `4` for
whichever were left out. `portalTo` is a normal default because it applies in
both modes.

Consequence: the generated `Select.api.md` shows no default for `side`, `align`
and `offset`, because vue-component-meta reads `withDefaults`. The defaults are
documented in the prop JSDoc instead.

### 7.3 `MultiSelectFooterSlotProps` survives, named

§3.5 said to delete both bespoke footer types. `Select`'s is gone as specified.
`MultiSelect`'s came back as
`MultiSelectFooterSlotProps extends MultiSelectSlotProps { selectAll }`.

The intent of §3.5 was to kill the *bespoke* footer shape — three unrelated
shapes for one slot name — not to ban a named type for `base + one addition`.
Deleting it outright left `selectAll` in an anonymous inline intersection, which
made the component inconsistent with itself (`#summary`'s extra prop kept a
named type) and gave consumers no type to import when annotating a footer
handler.

### 7.4 Combobox's custom rows split into two visibility paths

§6.5 left one question open: `matchesCustomOption` substring-matches a custom
row's label, and it ran through `alwaysMatch`, so `filterable: false` would not
have disabled it — a server-search Combobox could still lose its action rows.

Resolved by splitting the predicate. A row that declares a `condition` is
governed only by that condition, which is consumer-declared visibility and
therefore never filtered. A row without one falls back to a label substring
match, which is ordinary client filtering and is switched off by
`filterable: false`.

### 7.5 `v-model:query` emits more often than `update:query` used to

Both `MultiSelect` and `Combobox` now implement `query` with `defineModel`, so
every internal query write emits — not just the ones that previously did.

On `Combobox` this means an extra emit at mount when a `modelValue` is preset,
and one after each selection (the query is set to the committed option's label).
This is required for a bound `v-model:query` to stay in sync and matches how
`open` already behaves, but it is a real behavior change for existing
`@update:query` listeners and belongs in the changelog.

**Open — the two components disagree on a seeded query.** `Combobox` guards its
initial display sync so a consumer-supplied `query` wins on first render.
`MultiSelect` clears the query when the popover opens (long-standing behavior),
which now emits `update:query('')` and overwrites whatever the parent seeded.
Both are defensible alone; together they are inconsistent. Needs a decision
before the freeze ships.

### 7.6 Styling-contract divergences still outstanding

`data-slot` was unified on `search` and `chevron` was added to `Select` and
`MultiSelect` per §3.7. Three related divergences surfaced during
implementation and are **not** yet resolved:

- **`Select` publishes `data-slot="trigger-value"`**, which has no counterpart
  on the other two. It marks the invisible `SelectValue` overlay that keeps
  Reka's item-aligned measurement working under a custom `#trigger` — an
  implementation detail currently exposed as a public styling hook. Candidate
  for removal from the frozen contract.
- **`content-body`** exists on `Select` (via `PopoverPanel`) and `MultiSelect`
  (hand-rolled), but not on `Combobox`.
- **`MultiSelect`'s content element carries `data-selection` and `data-loading`;
  `Combobox`'s carries neither.** Same class of problem as `data-slot` — a
  public styling hook that only one component in the family offers — and not
  covered anywhere in this document.

## Task list

Ordered. `Autocomplete` removal is last because it depends on `Combobox` being
finished.

**Policy**
- [ ] ADR recording the reversal of `selection.md` §13
- [ ] Amend `selection.md` §13, the v1 release contract, and the Autocomplete
      compatibility note (`selection.md:775-795`)
- [ ] Rewrite the PR #856 title/description for the widened scope

**Spec drift**
- [ ] Add `setOpen` to `Select` slot props; amend `selection.md` §2 and
      `multiselect.md` from `toggleOpen`/`close` to `setOpen`
- [ ] Rename `clearAll` / `clearSelection` → `clear` across all three
- [ ] Add `side` / `align` / `offset` / `portalTo` to `SelectProps`

**Surface reduction**
- [ ] Delete the eight deprecated members listed in §1.1
- [ ] Remove `compareFn` from `MultiSelect`
- [ ] Narrow the `[slotName: string]` index signature to `` `item-${string}` ``
- [ ] Remove `displayValue` from `Select` / `MultiSelect` slot props; amend
      `selection.md` §2
- [ ] Collapse `#footer` onto the control slot-prop shape; delete
      `SelectFooterSlotProps` and `MultiSelectFooterSlotProps`

**Type hygiene**
- [ ] Hoist `PopoverSide` / `PopoverAlign` to `shared/`; remove the duplicate
      declaration in `MultiSelect/types.ts`
- [ ] Delete `SelectableOption` / `CustomOption` / `SimpleOption` /
      `GroupedOption`
- [ ] Delete `SelectExposed` or populate it
- [ ] Convert `Select/index.ts` and `Combobox/index.ts` to explicit export lists

**Additive parity**
- [ ] Add `query` prop to `MultiSelect` and `Combobox` (`v-model:query`)
- [ ] Expose `{ clear, focus }` on all three; rename Combobox's `reset` →
      `clear`; resolve `focus` via `useTemplateRef`, not `getElementById`
- [ ] Collapse `SelectExposed` / `ComboboxExposed` into one shared type
- [ ] Widen `Combobox` / `MultiSelect` values to `string | number`; add
      `String()` coercion in the substring filter
- [ ] Move `Combobox`'s `open` to `defineModel` to match Select / MultiSelect
- [ ] Add `#item` and `#group-label` to `Select`
- [ ] Unify `data-slot` vocabulary; add `chevron` to `Select` / `MultiSelect`
- [ ] Narrow `SelectOptionValue` to `string | number` (drop `Record` /
      `bigint`) — insights confirmed clean (§3.9)
- [ ] Add `filterable?: boolean` (default `true`) to `Combobox` / `MultiSelect`
      for remote search (§6.5) — gates whether removing `Autocomplete` is worth
      anything
- [ ] Add `hideSearch?: boolean` to `Combobox`, matching `MultiSelect` (§6.8,
      closes #659)
- [ ] Add `update:selectedOptions` to `MultiSelect` (§6.6)

**PR #856**
- [ ] Add `#search-prefix` / `#search-suffix` to `Combobox` button mode
- [ ] Reduce search slot props to `{ query, setQuery, disabled, focus }`
- [ ] Replace `getElementById` with `useTemplateRef`
- [ ] Fix `hasTypedSinceOpen` on `clearQuery`
- [ ] Export one search slot-prop type name
- [ ] Document the `hideSearch` interaction

**Autocomplete removal (§6) — last, depends on Combobox being finished**
- [ ] Migrate `ListFilter.vue` (3 usages) off `Autocomplete`
- [ ] Migrate `SearchComplete.vue` off `Autocomplete`
- [ ] Migrate `frappe/DataImport/MappingStep.vue` off `Autocomplete`
- [ ] Fix any `Combobox` gaps the three migrations expose (additive)
- [ ] Remove `type="autocomplete"` from `FormControl`; narrow its `type` union
- [ ] Publish the `Autocomplete` → `Combobox` / `MultiSelect` migration guide
- [ ] Delete `src/components/Autocomplete/` and its root export
- [ ] Delete `Autocomplete/deprecationKey.ts` and the `provide()` in
      `FormControl.vue:42`
- [ ] Rewrite `selection.md:775-795` as a removal record

**Library-wide sweep (§1.2) — separate effort, does not block the freeze**
- [ ] One migration pass per deprecated export in the §1.2 table

**Docs**
- [ ] Regenerate `*.api.md` for all three components after the changes
- [ ] Changelog migration table for every removed member and component
