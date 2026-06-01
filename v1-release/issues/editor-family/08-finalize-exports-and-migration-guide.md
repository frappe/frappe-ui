# Finalize the `frappe-ui/editor` exports and write the migration guide (v0 left in place)

Labels: `needs-triage`
Type: AFK
Status: ✅ Done — `index.ts` exports the spec surface (engine, `Editor`, building blocks, kits, extensions, menu items, presets, types); the ready-made exports + source are removed; the v0 monolith and its top-level export are untouched. The per-app v0→v1 migration guide is written (`docs/content/docs/migration.md`, `## Editor` section), keyed off the gameplan port (issue 07) as its worked example.

## Parent

`spec/editor.md` (§12 Migration, "Public surface")

## What to build

Lock the public `frappe-ui/editor` surface to the spec and write the v0 → v1 migration guide, informed by the real gameplan port. The v0 monolith is **left untouched** — this issue does not delete it.

## Acceptance criteria

- [ ] `frappe-ui/editor` exports exactly the surface in `spec/editor.md` "Public surface" (engine, `TextEditor`, building blocks, kits, extensions, menu items, presets, types).
- [ ] The abandoned ready-mades (`RichTextEditor`/`CommentEditor`/`InlineEditor`) are removed from the editor exports and source — these are the v1 family's own dead code, not v0.
- [ ] The v0 monolith at `src/components/TextEditor/` and its existing top-level `frappe-ui` export are **left in place and unmodified**; removing v0 is explicitly out of scope (a later human-gated cleanup).
- [ ] The v1 `TextEditor` is exported only from `frappe-ui/editor`, not added to top-level `frappe-ui` (no top-level editor exports beyond the existing v0 one).
- [ ] A migration guide (per-app, keyed off `research/11`'s table) documents v0 prop → v1 equivalent, the move to kits, mentions via `kit.configure`, and the "build your own component on `<TextEditor>`" pattern — using the gameplan port (issue 07) as the worked example.
- [ ] frappe-ui build + typecheck pass.

## Blocked by

- `07`

## Notes

Keeping v0 in place means `import { TextEditor } from 'frappe-ui'` (v0) and `import { TextEditor } from 'frappe-ui/editor'` (v1) coexist during the migration window — intentional and temporary, not a maintained alias. Do **not** delete v0; that is a separate human-gated step. If a consumer can't migrate without v0 staying longer, that's fine — note it in the guide.
