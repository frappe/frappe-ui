# Implement `RichTextEditor` and v0 `TextEditor` deprecation bridge

Labels: `needs-triage`
Type: AFK

## Parent

`spec/editor.md`

## What to build

Ship the ready-made article/page editor and keep existing v0 `TextEditor` consumers working during the v1 deprecation window. New consumers should use `RichTextEditor`; old imports should emit a one-time deprecation warning and continue to work.

## Acceptance criteria

- [ ] `RichTextEditor` is exported from `frappe-ui/editor`.
- [ ] Unnamed `v-model` supports HTML by default and JSON when `format="json"`.
- [ ] `change` emits on content updates as a side-event, not as the binding mechanism.
- [ ] `placeholder` and `editable` are reactive.
- [ ] `autofocus`, `uploadFunction`, `maxHeight`, and `showToolbar` props are implemented as specified.
- [ ] Layout includes top fixed menu with `articleToolbar`, bubble menu, and floating menu.
- [ ] `actions` slot renders inline with the top toolbar row and exposes the unwrapped editor plus `isEmpty`.
- [ ] No `extensions` prop, broad layout slots, or per-extension config props are added.
- [ ] v0 `TextEditor` remains exported from both top-level `frappe-ui` and `frappe-ui/editor`.
- [ ] v0 `TextEditor` emits a one-time deprecation warning per mount lifecycle.
- [ ] Existing v0 props continue to work for the deprecation window.
- [ ] Tests/stories cover rich text model sync, toolbar visibility, slot props, deprecated exports, and warning behavior.

## Blocked by

- `01-editor-subpath-minimal-primitives.md`
- `02-menu-primitives-items-presets.md`
- `03-upload-plumbing.md`

## Notes

The `RichTextEditor` extension list and deprecation bridge are API-sensitive. If implementation suggests extra public props or a different migration path, stop for HITL.
