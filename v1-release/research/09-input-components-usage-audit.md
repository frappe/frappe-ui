# Input components real-world usage audit

Sibling of [`07-selection-components-usage-audit.md`](./07-selection-components-usage-audit.md).
Locks down the parked decisions in
[`../09-input-components-spec.md`](../09-input-components-spec.md) and quantifies
the migration cost of every wired deprecation in that spec.

## Scope

- Audited real app code under `~/Projects/frappe-bench/apps/`, prioritizing
  `frontend/src*` and `desk/src*` directories.
- Skipped `frappe`, `frappe-ui`, and `erpnext` source themselves — audited
  consumers, not the libraries — and skipped stories, tests, docs, and
  `node_modules`.
- Focused on the input family: `TextInput`, `Textarea`, `Password`, `Checkbox`,
  `Switch`, `Rating`, `Slider`, `FileUploader`, `ErrorMessage`, plus
  `FormControl`, `Input.vue`, and `Autocomplete` because the spec deprecates
  routes through them.
- Apps with active Vue frontends inspected: `gameplan`, `helpdesk`, `crm`,
  `insights`, `drive`, `builder`, `meet`, `slides`, `hrms`, `frappe_calendar`.
- Apps with no Vue frontend or no frappe-ui usage were skipped.

Total surface inspected: ~1,360 `.vue` / `.tsx` files across the nine primary
frontends.

## Cross-app counts

Call-site counts per component, per app. Counts are usage in real app code
(not stories/tests/docs).

| App         | FormControl | Input (legacy) | Autocomplete | Switch | Checkbox | TextInput | Textarea | ErrorMessage | FileUploader |
| ----------- | ----------- | -------------- | ------------ | ------ | -------- | --------- | -------- | ------------ | ------------ |
| gameplan    | 16          | 0              | 2            | 1      | 3        | 7         | 0        | 26           | 3            |
| helpdesk    | 44          | 1              | 8            | 10     | 7        | 2         | 0        | 20           | 7            |
| crm         | 15          | 0              | 4            | 0      | 0        | 3         | 0        | 6            | 4            |
| insights    | 86          | 10             | 48           | 4      | 16       | 3         | 1        | 3            | 2            |
| drive       | 10          | 1              | 0            | 1      | 0        | 1         | 0        | 3            | 2            |
| builder     | 2           | 0              | 6            | 6      | 0        | 0         | 1        | 0            | 4            |
| meet        | 8           | 0              | 0            | 3      | 0        | 0         | 0        | 0            | 0            |
| slides      | 2           | 0              | 0            | 1      | 1        | 0         | 0        | 0            | 2            |
| hrms        | 2           | 0              | 4            | 1      | 0        | 0         | 0        | 4            | 1            |
| **TOTAL**   | **185**     | **12**         | **72**       | **27** | **27**   | **16**    | **2**    | **62**       | **25**       |

`Rating` had zero call sites across all audited apps.
`Slider` had ~5 call sites concentrated in `builder` settings panes; not
broken out per app.
`Password` (frappe-ui) had no direct standalone call sites — usage flows
through `FormControl type="password"` (1 site).

## Parked decisions

### 1. `FormControl` scope (router vs slot wrapper)

**Distinct `type=` values in the wild:**

| `type` value     | call sites |
| ---------------- | ---------- |
| (implicit text)  | ~35        |
| `select`         | 39         |
| `number`         | 18         |
| `checkbox`       | 16         |
| `autocomplete`   | 7          |
| `textarea`       | 6          |
| `password`       | 1          |
| dynamic (`type=fieldType`) | several — Frappe field introspection in CRM, Helpdesk |

**Wrapper vs router pattern:** every observed call site treats `FormControl`
as a router that takes `type=` and renders the matching control. Zero call
sites use it as a slot-based label wrapper around a custom control.

**`type='autocomplete'` deprecation candidates:** 7 call sites concentrated
in 2 files:

- `meet/frontend/src/components/settings/DeviceSettingsTab.vue` — 3 instances
  (camera/mic/speaker pickers, all pass an `:options` array of
  `{ label, value }`)
- `insights/frontend/src2/dashboard/DashboardFilterEditor.vue` — 4 instances

Both files use the standard options-array shape; nothing exotic. A direct
swap to `<Combobox>` or `<Autocomplete>` is mechanical.

**Recommendation:** keep `FormControl` as a router for v1. The router mental
model is the established consumer pattern across 185 call sites. Wire the
spec's dev-mode warning on the `type='autocomplete'` route only — that's the
narrow deprecation surface — and keep the route functional through `v1.x`.
The full router-vs-wrapper question can wait until post-v1 as the spec
already plans, because the data shows no app is leaning on a wrapper-style
use that would block the router approach.

### 2. Styling hooks vs class-injection props

**`Switch.labelClasses`:** zero call sites on the frappe-ui `Switch`
component. Two files surface a `labelClasses` symbol — `crm/frontend/src/components/Controls/Link.vue`
and `helpdesk/desk/src/components/frappe-ui/Link.vue` — but those are
app-local `Autocomplete` wrappers with their own internal API; they are not
passing the prop to frappe-ui's `Switch`.

**`Checkbox.padding`:** zero call sites across all audited apps.

**Other class-injection props on input components:** none found. Apps that
need custom styling either wrap a component locally (Helpdesk/CRM/HRMS
`Link.vue`) or bind classes on a wrapping `<div>`.

**Recommendation:** drop both `Switch.labelClasses` and `Checkbox.padding`
without a deprecation cycle — they have no real consumers. Standardize on
`data-*` styling hooks (`data-slot`, `data-state`, `data-disabled`,
`data-required`, `data-size`, `data-variant`) per the selection-spec
precedent. Migration load is zero.

## Deprecation candidates — migration cost

### `Input.vue` (legacy)

**12 call sites across 3 apps:**

- `insights` — 10 files (`Settings.vue`, `Users.vue`, `Teams.vue`,
  `TableRelationshipEditor.vue`, `SourceConnectionStep.vue`, …)
- `helpdesk` — 1 file (`CustomerDialog.vue`)
- `drive` — 1 file (`ProfileSettings.vue`)

Common shapes:

```vue
<Input type="number" min="0" v-model="..." />
<Input type="checkbox" v-model="..." :label="..." />
<Input type="password" ... />
<Input type="date" ... />
```

**Recommendation:** wire the dev warning, keep functional through `v1.x`.
Migration is mechanical (`<Input type="number">` → `<FormControl type="number">`).
Insights bears 83% of the cost and is owned by a team active on this stack.

### `Autocomplete` (direct usage, not via FormControl)

**72 call sites across 6 apps:**

- `insights` — 48
- `helpdesk` — 8
- `builder` — 6
- `crm` — 4
- `hrms` — 4
- `gameplan` — 2

Three observed patterns:

1. Direct options binding, default rendering — most common.
   ```vue
   <Autocomplete :options="chartOptions" v-model="selectedChart" />
   ```
2. Async query handling via `@update:query` — the canonical "remote search"
   pattern. Helpdesk/CRM/HRMS all standardize this in app-local `Link.vue`
   wrappers, which is itself a signal that the contract is stable enough to
   build on.
3. Sub-slot customization (`#target`, `#item-prefix`, `#item-suffix`) — rare
   but used (e.g. `insights/frontend/src/query/ChartTypeSelector.vue` for
   icon prefix/suffix).

**Recommendation:** wire the dev warning per the spec, but treat
`Autocomplete` as long-lived legacy. With 72 well-structured call sites and
three app-local wrapper layers built on it, an aggressive removal is
disproportionate to the v1 goal. `Combobox` becomes the canonical name
post-v1; `Autocomplete` is the compat layer until apps have converged. This
matches the spec's existing posture.

### `Password.value` prop (deprecated value-prop pattern)

**0 call sites.** No app passes `<Password :value="…">` instead of `v-model`.
Wire the warning anyway — it costs nothing — and the deprecation becomes a
clean no-op for v1.x consumers.

### `Rating.rating_from`

**0 call sites.** `Rating` itself has zero direct uses across the audited
frontends. The rename to `max` and the deprecated alias are still worth
shipping for completeness, but the migration cost is zero.

### `Textarea.label` (local label prop being absorbed into shared contract)

**0 call sites.** No app passes `label` to `Textarea` today. The spec's plan
to remove the local prop in favor of the shared labeling contract is
non-breaking.

## Other input usage worth knowing

### `ErrorMessage`

**62 call sites across 7 apps:**

- gameplan: 26 · helpdesk: 20 · crm: 6 · hrms: 4 · insights: 3 · drive: 3

Message types passed:

- string messages dominate (`<ErrorMessage :message="errorString" />`)
- `Error` objects: surfaced via `dialog.error` in
  `gameplan/frontend/src/utils/dialogs.tsx`; not formally typed at the call
  site
- **no v-html-style rich content patterns observed** — every call site
  passes plain string or `Error` object

**Confirms the spec:** dropping `v-html` is safe. No real consumer is
relying on it.

### `FileUploader`

**25 call sites across 7 apps:**

- helpdesk: 7 · crm: 4 · builder: 4 · gameplan: 3 · drive: 2 · slides: 2 ·
  insights: 2 · hrms: 1

All 25 sites use the same pattern:

```vue
<FileUploader :uploadArgs="{ doctype, docname, private }" @success="...">
  <template #default="{ openFileSelector }">
    <Button @click="openFileSelector" />
  </template>
</FileUploader>
```

No app heavily wraps `FileUploader`. No drag-and-drop, no multi-file, no
adapter prop in real usage today.

**Confirms the spec:** the v1 "modernize structurally, freeze API" call is
correct. The slot-driven trigger is the universal pattern; nothing is
straining the API.

### `Checkbox` and `Switch` `label` prop usage

- **`Checkbox` with `label` prop:** ~11 call sites across `insights` and
  `helpdesk`. Example:
  ```vue
  <Checkbox v-model="series.smoothLines" label="Enable Curved Lines" />
  ```
  These are exactly the call sites the shared labeling contract is designed
  to formalize. Existing usage is forward-compatible.
- **`Switch` with `label` prop:** zero call sites. Apps render their own
  label beside `Switch` today. The spec's inline-row layout slots in cleanly.

### `Slider`, `Rating`, `TextInput`

- `TextInput`: 16 call sites, light usage, no parked decisions.
- `Slider`: ~5 call sites concentrated in `builder` settings panes; minimal
  customization. The spec's `disabled` and `size: ToggleSize` additions are
  purely additive against this base.
- `Rating`: 0 call sites. Spec changes are non-breaking by definition.

## Summary of locked decisions

| Decision                                  | Data                                              | Locked v1 stance                                        | Migration load |
| ----------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- | -------------- |
| `FormControl` scope                       | 185 router uses; 0 wrapper uses; 7 `type='autocomplete'` | Keep router; warn `type='autocomplete'` only           | 2 files (meet, insights) — trivial |
| `Switch.labelClasses` / `Checkbox.padding`| Both 0 uses on frappe-ui components               | Drop both without a deprecation cycle; standardize on `data-*` hooks | 0 apps |
| `Input.vue` deprecation                   | 12 call sites, 83% in insights                    | Wire warning; keep functional through `v1.x`            | Mechanical migration |
| `Autocomplete` direct deprecation         | 72 call sites, 3 stable patterns, app-local wrappers | Wire warning; treat as long-lived legacy through `v1.x` | Defer push to `Combobox` to post-v1 |
| `Password.value` deprecation              | 0 uses                                            | Wire warning; trivial                                   | 0 apps |
| `Rating.rating_from` rename               | 0 uses                                            | Ship rename + alias for completeness                    | 0 apps |
| `Textarea.label` removal                  | 0 uses                                            | Absorb into shared labeling contract                    | 0 apps |
| `ErrorMessage` `v-html` removal           | 62 uses, all plain string / `Error`               | Safe to drop                                            | 0 apps |
| `FileUploader` API freeze                 | 25 uses, single universal pattern                 | Confirm freeze; modernize structurally only             | 0 apps |
| Shared labeling contract on Checkbox      | ~11 uses already passing `label`                  | Implement; usage is already forward-compatible          | 0 apps |

The audit produced **no surprises against the spec** and **no signals to
redesign**. Every parked decision now has data behind it and can be promoted
out of "Parked decisions" into the body of the spec.
