# Implement `InlineEditor` ready-made

Labels: `needs-triage`
Type: AFK

## Parent

`spec/editor.md`

## What to build

Ship the single-line rich text ready-made for lightweight inline fields. Consumers should get a minimal formatting bubble menu without upload, fixed menus, floating menus, or actions slots.

## Acceptance criteria

- [ ] `InlineEditor` is exported from `frappe-ui/editor`.
- [ ] Unnamed `v-model` binds `string | null` content.
- [ ] `placeholder` and `editable` are reactive.
- [ ] `autofocus` is supported as a construction-time option.
- [ ] Layout uses a bubble menu only with `minimalToolbar`.
- [ ] No fixed menu, floating menu, upload function, mention/tag shorthand, or `actions` slot is exposed.
- [ ] No `extensions` prop, broad layout slots, or per-extension config props are added.
- [ ] Tests/stories cover model sync, placeholder/editable reactivity, autofocus, and minimal toolbar behavior.

## Blocked by

- `01-editor-subpath-minimal-primitives.md`
- `02-menu-primitives-items-presets.md`

## Notes

If single-line behavior requires public API not described in `spec/editor.md`, stop for HITL.
