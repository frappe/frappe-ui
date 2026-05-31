# Rewrite the editor docs: family page + build-your-own recipe

Labels: `needs-triage`
Type: AFK
Status: ❌ Not started — `docs/content/docs/molecules/editor.md` describes the old model.

## Parent

`spec/editor.md` (§9 recommended pattern)

## What to build

Replace the stale molecule editor docs (`docs/content/docs/molecules/editor.md`) with the v1 model: `useEditor`, `<TextEditor>`, kits, building blocks, menu items/presets — and, front and center, the recommended "build your app's editor component on `<TextEditor>`" recipe.

## Acceptance criteria

- [ ] The molecule editor docs page documents `useEditor`, `<TextEditor>` props/slots, kits (with configure/disable), building blocks, and menu items/presets.
- [ ] The "build your own component" recipe (spec §9) is the headline pattern; ready-mades are not presented (they don't exist).
- [ ] The customization ladder (L0–L4) is shown with runnable examples: a comment-shape, an article-shape, a `#default` bespoke layout (email-style), and a `useEditor` composition.
- [ ] Mentions/tags are documented via `kit.configure({ mention })`, never a prop.
- [ ] No reference to `CommentEditor`/`RichTextEditor`/`InlineEditor` or the v0 `TextEditor` monolith remains in published docs.
- [ ] Lucide icons in examples use the `class="lucide-*"` / `icon-left="lucide-*"` convention (no `~icons/lucide/*` imports, no `<LucideX />`); example fixtures use `@example.com`, never real domains.
- [ ] Docs build passes.

## Blocked by

- `06`

## Notes

This is the consumer-facing surface — examples must match the shipped API exactly, and the gameplan port (issue 07) is a good source of real worked examples. Keep it in the molecules docs section (editor is a molecule). If an example needs API the spec doesn't describe, fix the spec/component first, not the docs.
