# Add menu primitives, typed menu items, and toolbar presets

Labels: `needs-triage`
Type: AFK

## Parent

`spec/editor.md`

## What to build

Let consumers compose editor toolbars and contextual menus from typed menu items. A consumer should be able to pass predefined buttons, groups, separators, or presets into fixed, bubble, and floating menu primitives and get a usable formatting menu.

## Acceptance criteria

- [ ] `EditorFixedMenu` renders a flat `buttons: MenuItem[]` toolbar for the passed editor.
- [ ] `EditorBubbleMenu` wraps TipTap's bubble menu and accepts optional `shouldShow` and `tippyOptions` options.
- [ ] `EditorFloatingMenu` wraps TipTap's floating menu with the same menu item shape.
- [ ] `CommandMenuItem`, `MenuGroupItem`, and `MenuItem` types match `spec/editor.md`.
- [ ] Predefined command items, group items, and `Separator` are exported from `frappe-ui/editor`.
- [ ] `commentToolbar`, `articleToolbar`, and `minimalToolbar` are exported as plain `MenuItem[]` arrays.
- [ ] Missing extension/runtime `requires` checks are not added in v1; missing extensions remain consumer configuration errors.
- [ ] Tests or stories verify command items, groups, separators, active state, disabled state, and presets.

## Blocked by

- `01-editor-subpath-minimal-primitives.md`

## Notes

Menu catalog and preset contents are API-sensitive. If the catalog shape needs to change beyond the accepted spec, stop for HITL.
