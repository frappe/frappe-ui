# Deprecated exports to remove before `1.0.0`

The work list for
[ADR-0008](../spec/adr/0008-no-deprecated-members-in-1-0-0.md): nothing marked
`@deprecated` ships in `1.0.0`, so everything below is deleted before the tag
rather than carried through `1.x`.

This covers whole exports — components, composables, and the one prop value that
pulls a component in with it. Member-level removals (individual props, slots,
and emits on components that survive) go in the published migration guide,
[`docs/content/docs/migration.md`](../docs/content/docs/migration.md).

## The list

Verified against `src/index.ts` on 2026-07-26. Every row below is **still
exported today**, except the four marked done.

| Export                            | Lives in                                                             | Replaced by                                                    | Warns at runtime                                                                                                  |
| --------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Card`                            | `src/components/Card.vue`                                            | layout markup, or a domain-specific component in the app       | no                                                                                                                |
| ~~`ConfirmDialog`~~               | removed in [#960](https://github.com/frappe/frappe-ui/pull/960)      | `dialog.confirm(...)`                                          | —                                                                                                                  |
| ~~`confirmDialog`~~               | removed in [#960](https://github.com/frappe/frappe-ui/pull/960)      | `dialog.confirm(...)`                                          | —                                                                                                                  |
| `FeatherIcon`                     | `src/components/FeatherIcon.vue`                                     | a `lucide-*` string, or the `Icon` component                   | on feather-name icon props, via `warnFeatherIconUsage` in `src/utils/iconString.ts` — not on the component itself |
| `Input`                           | `src/components/Input.vue`                                           | `TextInput` or `FormControl`                                   | yes                                                                                                               |
| `ListItem`                        | `src/components/ListItem.vue`                                        | list primitives from `frappe-ui/list`, or app-owned row markup | no                                                                                                                |
| `MonthPicker` (whole barrel)      | `src/components/MonthPicker/`                                        | `Select`                                                       | no                                                                                                                |
| `Toast` (the SFC)                 | `src/components/Toast/Toast.vue`                                     | the imperative `toast(...)` API                                | yes                                                                                                               |
| `ThemeSwitcher` (whole barrel)    | `src/components/ThemeSwitcher/`                                      | `Select` plus the `useColorScheme` composable                        | yes                                                                                                               |
| TextEditor root exports           | `src/components/TextEditor/index.ts`                                 | the `frappe-ui/editor` subpath                                 | no                                                                                                                |
| TextEditor extension barrels      | `src/components/TextEditor/extensions/{image,suggestion}`            | extensions from `frappe-ui/editor`                             | no                                                                                                                |
| ~~`FormControl type="autocomplete"`~~ | removed in [#926](https://github.com/frappe/frappe-ui/issues/926) | `Combobox` | — |
| ~~`Autocomplete` (whole barrel)~~ | removed in [#926](https://github.com/frappe/frappe-ui/issues/926) | `Combobox` (single) / `MultiSelect` (multiple) | — |

Twelve of the thirteen rows come from the one
`// Deprecated component compatibility` block in `src/index.ts` (lines 103–132).
Two rows sit outside it and are the easy ones to miss:

- **`FormControl type="autocomplete"`** is a value in a prop union, not an
  export, so it does not appear in that block. It went at the same time as
  `Autocomplete` — removing it narrowed `FormControl`'s `type` union (a second
  breaking change) and let `Autocomplete/deprecationKey.ts` and the `provide()`
  in `FormControl.vue` disappear with it.
- **`Autocomplete`** used to sit among the ordinary form controls in
  `src/index.ts` with no `@deprecated` JSDoc, even though it warned on mount —
  so ADR-0008's mechanical rule missed the largest removal on the list. It
  carried the marker into the deprecated block before being deleted.

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

Deprecated-sounding surfaces that ADR-0008 does **not** reach, because nothing
in them is marked `@deprecated`:

- **v1 resource APIs** (`src/resources/index.ts`) — still exported, with a
  comment saying to keep them public until official apps finish the v3
  migration. Removing them is a v3-migration decision, not a `1.0.0` blocker.
- **v2 data composables** — same situation.
- **`ListView`** — sweep #882 confirmed the parity gap is real and structural
  (resizable columns, per-column function props, tooltips, disabled-row
  exclusion, select banner — none of which `frappe-ui/list`'s composition
  model replicates by design, P3). Decision: ListView ships frozen, not
  deprecated, for v1. See its row in `plan.md`.

If any of the three gets a `@deprecated` marker before the tag, it joins the
table above and has to be removed with the rest.

## Before deletion

Each row needs the same three things, per ADR-0008:

- a changelog entry in [`changelog.md`](./changelog.md)
- a before/after example in the migration guide where the shape changed
  meaningfully
- no remaining internal call sites in `src/` — migrate them first, since that
  migration is also the proof the replacement is sufficient
