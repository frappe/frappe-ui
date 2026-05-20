# Implement `CommentEditor` ready-made end to end

Labels: `needs-triage`
Type: AFK

## Parent

`spec/editor.md`

## What to build

Ship the ready-made comment/chat composer built from editor primitives. Consumers should be able to bind content with unnamed `v-model`, get comment-oriented menus and upload behavior, and render submit/discard buttons through the `actions` slot.

## Acceptance criteria

- [ ] `CommentEditor` is exported from `frappe-ui/editor`.
- [ ] Unnamed `v-model` supports HTML by default and JSON when `format="json"`.
- [ ] `change` emits on content updates as a side-event, not as the binding mechanism.
- [ ] `placeholder` and `editable` are reactive.
- [ ] `autofocus`, `uploadFunction`, and `maxHeight` props are implemented as specified.
- [ ] Layout includes comment-oriented bubble menu and bottom fixed menu using `commentToolbar`.
- [ ] `actions` slot renders inline with the fixed menu inside the editor border.
- [ ] `actions` slot props expose the unwrapped editor and `isEmpty`.
- [ ] No `extensions` prop, broad layout slots, or per-extension config props are added.
- [ ] Tests/stories cover model sync, slot props, upload plumbing, placeholder/editable reactivity, and max height behavior.

## Blocked by

- `01-editor-subpath-minimal-primitives.md`
- `02-menu-primitives-items-presets.md`
- `03-upload-plumbing.md`

## Notes

The final extension list is intentionally settled during implementation. If choosing that list requires API tradeoffs or extra props, stop for HITL.
