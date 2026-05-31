# Build the editor engine and content rendering on the `frappe-ui/editor` subpath

Labels: `needs-triage`
Type: AFK
Status: ✅ Done — verify only (engine + content + tests exist in `src/molecules/editor/`).

## Parent

`spec/editor.md` (§1 `useEditor`, §2 `EditorContent`, §7 content/format)

## What to build

The foundation of the editor family: consumers import from `frappe-ui/editor`, construct a TipTap editor through `useEditor`, render it with `EditorContent`, and bind content through the unnamed `v-model` in HTML or JSON. `extensions` is a required option — there is no implicit default list (this is what keeps the engine free of baked-in imports).

## Acceptance criteria

- [ ] `frappe-ui/editor` is a public subpath export (already wired in `package.json` `exports`).
- [ ] `useEditor(options)` owns TipTap editor creation/destruction and returns `ShallowRef<Editor | null>`.
- [ ] `extensions` is required; omitting it is a type error (no baked-in default list).
- [ ] HTML content binding is bidirectional and skips no-op external writes.
- [ ] JSON content binding is bidirectional without deep equality, using an `applyingExternalUpdate` guard.
- [ ] `editable` is reactive and calls `editor.setEditable()` on change.
- [ ] An extension named `collaboration` disables content binding and initial content seeding.
- [ ] `EditorContent` renders the passed editor, applies frappe-ui prose scaffolding, sets `data-slot="editor-content"`, and supports root `class` fallthrough (no class-name prop, P10).
- [ ] `Editor`, `JSONContent`, `UploadedFile` types are exported from the subpath.
- [ ] Tests cover lifecycle, HTML + JSON sync, editable sync, and collaboration-mode behavior.

## Blocked by

None — can start immediately.

## Notes

An earlier `useEditor` / `EditorContent` exists under `src/molecules/editor/`; align it to the spec rather than rewriting from scratch. If implementation reveals public-API ambiguity, stop for HITL before expanding the surface beyond `spec/editor.md`.
