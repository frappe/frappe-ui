# Add menu components, typed menu items, presets, and self-pruning

Labels: `needs-triage`
Type: AFK
Status: ✅ Done — `:buttons` renamed to `:items` across `EditorFixedMenu`/`EditorBubbleMenu`/`EditorFloatingMenu` + `MenuItems.vue`; `isAvailable?(editor)` added to `CommandMenuItem` and set on every predefined item (schema mark/node or extension check); `MenuItems.vue` hides unavailable items on both the top-level and group paths and drops empty groups. `menu.test.ts` covers self-pruning against a trimmed extension set.

## Parent

`spec/editor.md` (§4 building blocks, §5 menu items & presets)

## What to build

Let consumers compose toolbars and contextual menus from typed menu items. `EditorFixedMenu`, `EditorBubbleMenu`, and `EditorFloatingMenu` render a `MenuItem[]` against the passed editor; predefined items, groups, separators, and presets ship from the subpath.

## Acceptance criteria

- [ ] `EditorFixedMenu` renders a flat `items: MenuItem[]` toolbar for the passed editor; sets `data-slot="fixed-menu"`.
- [ ] Rename the `:buttons` prop to `:items` everywhere it exists today — `EditorFixedMenu`, `EditorBubbleMenu`, `EditorFloatingMenu`, and the shared `MenuItems.vue` renderer (all three components currently pass `:buttons` into `MenuItems`).
- [ ] `EditorBubbleMenu` wraps TipTap's bubble menu and accepts optional `options` (`shouldShow`, `tippyOptions`).
- [ ] `EditorFloatingMenu` wraps TipTap's floating menu with the same `items` + `options` shape.
- [ ] `CommandMenuItem`, `MenuGroupItem`, `MenuItem` types match the spec.
- [ ] Predefined command items, group items (`{ type: 'group' }`), and `Separator` are exported from `frappe-ui/editor`.
- [ ] `commentToolbar`, `articleToolbar`, `minimalToolbar` are exported as plain `MenuItem[]` (surface-agnostic).
- [ ] Self-pruning: add an optional `isAvailable?(editor): boolean` to `CommandMenuItem`; predefined items set it to check `editor.schema` (e.g. `Bold` → `'bold' in editor.schema.marks`, `InsertTable` → `'table' in editor.schema.nodes`). `MenuItems.vue` **renders an item only when `isAvailable` is not `false`** (hide-when-absent — apply to both the top-level and the group-item render paths) and keeps using `isDisabled` for `:disabled` (disable-when-not-runnable). One preset then adapts across kits with no re-curation (e.g. `table: false` drops the Table button instead of showing a dead one).
- [ ] No runtime `requires` checks beyond self-pruning; otherwise missing extensions remain consumer configuration errors.
- [ ] Tests/stories cover command items, groups, separators, active/disabled state, presets, and self-pruning against a trimmed extension set (e.g. `table: false` leaves no dead Table button).

## Blocked by

- `01`

## Notes

The existing menu components use `:buttons`; this issue renames to `:items` (a `MenuItem[]` includes separators/groups, not only buttons) and keeps the `EditorFixedMenu`/`EditorBubbleMenu`/`EditorFloatingMenu` naming. Catalog and preset contents are API-sensitive — if the catalog shape must change beyond the spec, stop for HITL.
