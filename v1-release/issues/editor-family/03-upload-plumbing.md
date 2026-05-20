# Thread upload plumbing through editor storage and upload-aware extensions

Labels: `needs-triage`
Type: AFK

## Parent

`spec/editor.md`

## What to build

Allow consumers to provide one `uploadFunction` to `useEditor` and have upload-aware extensions use it through editor storage, while still allowing per-extension overrides.

## Acceptance criteria

- [ ] `useEditor({ uploadFunction })` prepends an internal upload storage extension when an upload function is provided.
- [ ] After editor construction, the upload function is written to `editor.storage.upload.uploadFunction`.
- [ ] `Image`, `ImageGroup`, `Video`, and `ContentPaste` can read upload behavior from editor storage.
- [ ] Per-extension upload overrides win over the storage default.
- [ ] Upload-aware extensions used outside frappe-ui `useEditor` without per-extension upload config warn once and treat upload as no-op.
- [ ] `uploadArgs` from v0 is not reintroduced; callers close over extra args in their upload function.
- [ ] Tests cover storage default, per-extension override, missing upload no-op, and one-time warning behavior.

## Blocked by

- `01-editor-subpath-minimal-primitives.md`

## Notes

If real extension constraints require changing the public upload contract, stop for HITL before doing so.
