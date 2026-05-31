# Finalize the editor extension catalog and suggestion helper

Labels: `needs-triage`
Type: AFK
Status: ✅ Done — `extensions.ts` ships the flat catalog + `SuggestionExtension`. Verify pass during the kit/component build fixed four spec gaps: (1) `TextStyle` was missing as an export and the v3 `@tiptap/extension-text-style` import was a non-existent default — both corrected; (2) `Tag` was only the `#` suggestion (no node) — now a complete node + gated-suggestion extension; (3) data members now take the canonical `{ items }` (was `mentions`/`tags`) and stay inert until configured; (4) `Placeholder` is now storage-threaded (`editor.storage.placeholder.text`) so the `<TextEditor>` `placeholder` prop works without reconfiguring a consumer extension (spec §2). The custom `LinkExtension` popup (`extensions/link/`) is **not** yet wired into the exported `Link` (still plain tiptap link + `openOnClick:false`) — noted as a follow-up, non-blocking.

## Parent

`spec/editor.md` (§6 Extensions)

## What to build

Expose the flat extension catalog from `frappe-ui/editor` and the helper for building suggestion-style extensions. Consumers import only what they use, get frappe-ui defaults, override with `.configure(...)`, and build mention/tag/slash/emoji experiences from one primitive.

## Acceptance criteria

- [ ] TipTap-origin extensions from the spec (`Placeholder`, `Heading`, `Link`, `Code`, `CodeBlock`, `Table` + parts, `TaskList`/`TaskItem`, `Typography`, `TextAlign`, `Color`, `Highlight`) are flat named exports with frappe-ui defaults applied.
- [ ] Frappe-custom extensions (`Image`, `ImageGroup`, `ImageViewer`, `Video`, `Iframe`, `Mention`, `Tag`, `Emoji`, `SlashCommands`, `Toc`, `ContentPaste`, `StyleClipboard`) are flat named exports.
- [ ] `.configure(...)` overrides defaults on every export.
- [ ] Raw TipTap (`@tiptap/extension-*`) imports still work; frappe-ui does not hide that path.
- [ ] `SuggestionExtension.configure(...)` implements the `{ name, trigger, items, component?, command }` shape from the spec.
- [ ] `TextStyle` is exported (a `Color` dependency); anything that registers `Color` must also register `TextStyle`.
- [ ] The wrapped `Placeholder` reads its text from `editor.storage.placeholder` when no explicit `placeholder` option is set, and refreshes its decoration when that value changes — so the `<TextEditor>` `placeholder` prop can thread in reactively (mirrors the upload-storage pattern). An explicit `Placeholder.configure({ placeholder })` wins.
- [ ] Import surface is flat — no dot-notation namespace, no top-level `frappe-ui` editor exports.
- [ ] Tests verify representative wrapped defaults, `.configure(...)` overrides, and suggestion command flow.

## Blocked by

- `01`

## Notes

Most of `src/molecules/editor/extensions/*` already exists; align names and defaults to the spec rather than rewriting. Per-extension defaults and the suggestion shape are API-sensitive — if defaults or the helper shape must change beyond the spec, stop for HITL. Do **not** add mention/tag shorthand or a slash-command registry here; those are configured via the extension/kit member.
