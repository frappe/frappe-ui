# Ship `frappe-ui/editor` subpath with minimal primitive editing path

Labels: `needs-triage`
Type: AFK

## Parent

`spec/editor.md`

## What to build

Create the first usable vertical slice of the editor family: consumers can import from `frappe-ui/editor`, construct a TipTap editor through `useEditor`, render it with `EditorContent`, and bind content through the unnamed `v-model` equivalent ref in either HTML or JSON format.

## Acceptance criteria

- [ ] `frappe-ui/editor` exists as a public subpath export.
- [ ] `useEditor` owns TipTap editor creation/destruction and returns `ShallowRef<Editor | null>`.
- [ ] HTML content binding works bidirectionally and skips no-op external writes.
- [ ] JSON content binding works bidirectionally without requiring deep equality, using an external-update guard.
- [ ] `editable` is reactive and calls `editor.setEditable()` when it changes.
- [ ] Collaboration extensions named `collaboration` disable content binding and initial content seeding.
- [ ] `EditorContent` renders the passed editor and applies the frappe-ui prose/data-slot scaffolding.
- [ ] Minimal extension exports needed to demo a working primitive editor are available from the subpath.
- [ ] Tests cover lifecycle, content sync, editable sync, and collaboration-mode behavior.

## Blocked by

None - can start immediately

## Notes

If implementation reveals public API ambiguity, stop for HITL before expanding the surface beyond `spec/editor.md`.
