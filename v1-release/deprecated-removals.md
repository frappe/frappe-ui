# Deprecated exports to remove before `1.0.0`

The work list for
[ADR-0008](../spec/adr/0008-no-deprecated-members-in-1-0-0.md): nothing marked
`@deprecated` ships in `1.0.0`, so everything below is deleted before the tag
rather than carried through `1.x`.

This covers whole exports — components, composables — plus deprecated **prop
values**, whether or not they pull an export out with them. A prop value is not
an export, so no scan of `src/index.ts` finds one; keeping them here is what
makes them countable. Member-level removals (individual props, slots, and emits
on components that survive) go in the published migration guide,
[`docs/content/docs/migration.md`](../docs/content/docs/migration.md).

## The list

Verified against `src/index.ts` on 2026-07-26. Every row below is **still
exported today**, except the rows marked done.

| Export                            | Lives in                                                             | Replaced by                                                    | Warns at runtime                                                                                                  |
| --------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| ~~`Card`~~                        | removed in [#983](https://github.com/frappe/frappe-ui/pull/983)                         | layout markup, or a domain-specific component in the app       | —                                                                                                                  |
| ~~`ConfirmDialog`~~               | removed in [#960](https://github.com/frappe/frappe-ui/pull/960)      | `dialog.confirm(...)`                                          | —                                                                                                                  |
| ~~`confirmDialog`~~               | removed in [#960](https://github.com/frappe/frappe-ui/pull/960)      | `dialog.confirm(...)`                                          | —                                                                                                                  |
| ~~`FeatherIcon`~~                 | removed in [#983](https://github.com/frappe/frappe-ui/pull/983)                         | a `lucide-*` string, or the `Icon` component                   | —                                                                                                                  |
| `Input`                           | `src/components/Input.vue`                                           | `TextInput` or `FormControl`                                   | yes                                                                                                               |
| ~~`ListItem`~~                    | removed in [#983](https://github.com/frappe/frappe-ui/pull/983)                         | list primitives from `frappe-ui/list`, or app-owned row markup | —                                                                                                                  |
| ~~`MonthPicker` (whole barrel)~~  | removed in [#876](https://github.com/frappe/frappe-ui/issues/876)   | `Select`                                                        | —                                                                                                                  |
| ~~`Toast` (the SFC)~~             | removed in [#983](https://github.com/frappe/frappe-ui/pull/983)                         | the imperative `toast(...)` API                                | —                                                                                                                  |
| ~~`ThemeSwitcher` (whole barrel)~~ | moved to `experimental/ThemeSwitcher/` in [#1094](https://github.com/frappe/frappe-ui/issues/1094) | `Select` plus the `useColorScheme` composable                        | yes, at its new path                                                                                              |
| ~~TextEditor root exports~~       | removed in [#884](https://github.com/frappe/frappe-ui/issues/884)    | the `frappe-ui/editor` subpath                                 | —                                                                                                                  |
| ~~TextEditor extension barrels~~  | removed in [#884](https://github.com/frappe/frappe-ui/issues/884)    | extensions from `frappe-ui/editor`                              | —                                                                                                                  |
| ~~`FormControl type="autocomplete"`~~ | removed in [#926](https://github.com/frappe/frappe-ui/issues/926) | `Combobox` | — |
| ~~`Autocomplete` (whole barrel)~~ | removed in [#926](https://github.com/frappe/frappe-ui/issues/926) | `Combobox` (single) / `MultiSelect` (multiple) | — |
| ~~`Badge theme="orange"`~~ | removed in [#1069](https://github.com/frappe/frappe-ui/issues/1069) | `theme="amber"` | — |

Eleven of the fourteen rows come from the one
`// Deprecated component compatibility` block in `src/index.ts` (lines 103–132).
Three rows sit outside it and are the easy ones to miss:

- **`FormControl type="autocomplete"`** is a value in a prop union, not an
  export, so it does not appear in that block. It went at the same time as
  `Autocomplete` — removing it narrowed `FormControl`'s `type` union (a second
  breaking change) and let `Autocomplete/deprecationKey.ts` and the `provide()`
  in `FormControl.vue` disappear with it.
- **`Autocomplete`** used to sit among the ordinary form controls in
  `src/index.ts` with no `@deprecated` JSDoc, even though it warned on mount —
  so ADR-0008's mechanical rule missed the largest removal on the list. It
  carried the marker into the deprecated block before being deleted.
- **`Badge theme="orange"`** is the same shape as the `FormControl` row: a
  value in a prop union, aliased to `amber` in the component. It carried no
  `@deprecated` tag at all — only a line comment in `Badge.vue` — so no
  mechanical scan could see it, and it reached the list late via the
  cross-family vocabulary pass ([#1054](https://github.com/frappe/frappe-ui/issues/1054))
  rather than the sweep. Removing it exposed a second bug: `Badge` chained two
  raw table lookups, so an unknown theme threw mid-render and blanked the
  parent. `Badge` now degrades an unsupported `theme`, `variant` or `size` to
  the prop's default and warns in dev, so the removal breaks **loudly in
  TypeScript** (compile error) and **silently in JavaScript** (gray badge).

The TextEditor rows are one deletion each in `src/index.ts`, but seven
`@deprecated` names behind them (`default`, `TextEditor`,
`TextEditorBubbleMenu`, `TextEditorFixedMenu`, `TextEditorFloatingMenu`,
`TextEditorContent`, `createEditorButton`).

## Already done

Do not re-add these to the queue:

- **`Resource.vue`** — listed in `plan.md` as a deprecated-but-retained export.
  The file no longer exists and nothing exports it.
- **`Pill`** — `plan.md` recommended un-exposing it (used only inside
  `TabButtons`). It is no longer exported from `src/index.ts`.

## Not in scope for ADR-0008

ADR-0008 reaches the stable entry points only. Anything parked in
`frappe-ui/experimental` is outside it and may stay `@deprecated` there, since
the tag freezes nothing on that subpath. That is why the `ThemeSwitcher` row
above is struck through without a deletion, and why the seven `@deprecated` v0
`TextEditor` re-exports in `experimental/TextEditor/index.ts` are not on this
list. Parking is not permanence: both are still on their way out, and removing
them needs no major version.

The rest of this section is different. These are deprecated-sounding surfaces
that ADR-0008 does **not** reach, because nothing in them is marked
`@deprecated`:

- **v1 resource APIs** (`src/resources/index.ts`) — still exported. The keep
  call is settled: [#886](https://github.com/frappe/frappe-ui/issues/886)
  found them the larger of the two surviving data layers by call-site count
  (344 sites across 204 files, five apps) and kept them supported and
  un-deprecated at the tag; [ADR-0013](../spec/adr/0013-v1-resources-implementation-freeze.md)
  records the resulting at-bar exception (implementation stays JS).
- **v2 data composables** — same #886 resolution: kept, supported, recommended
  for new code.
- **`ListView`** — sweep #882 confirmed the parity gap is real and structural
  (resizable columns, per-column function props, tooltips, disabled-row
  exclusion, select banner — none of which `frappe-ui/list`'s composition
  model replicates by design, P3). #985 superseded the "ships frozen at root"
  call: ListView is not taken to bar at root, and moves to
  `frappe-ui/experimental` (P14, no stability promise) instead — it stays
  there until `frappe-ui/list` reaches parity. Nothing on it is marked
  `@deprecated`, so ADR-0008 still doesn't reach it. See its row in
  `plan.md`.

If any of the three gets a `@deprecated` marker before the tag, it joins the
table above and has to be removed with the rest.

## Before deletion

Each row needs the same three things, per ADR-0008:

- a changelog entry in [`changelog.md`](../docs/content/docs/changelog.md)
- a before/after example in the migration guide where the shape changed
  meaningfully
- no remaining internal call sites in `src/` — migrate them first, since that
  migration is also the proof the replacement is sufficient
