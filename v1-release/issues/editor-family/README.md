# Editor family — v1 implementation issues

Design of record: [`spec/editor.md`](../../../spec/editor.md) and
[`spec/adr/0004-editor-family-composition-model.md`](../../../spec/adr/0004-editor-family-composition-model.md).
Usage data: [`research/11-texteditor-usage-audit.md`](../../research/11-texteditor-usage-audit.md).

The family is **one `<Editor>` component on the `useEditor` engine, configured by kits and explicit menu props** — there are no ready-made `CommentEditor` / `RichTextEditor` / `InlineEditor` components. Each app builds its own thin editor component on `<Editor>`. (The component was named `<TextEditor>` in these issues; it shipped as `<Editor>`.)

An earlier implementation under `src/molecules/editor/` predates this design (it ships the abandoned ready-mades, `EditorFixedMenu` with a `:buttons` prop, and no kits). These issues realign that code; treat them as "align to spec," not greenfield, where prior code exists. **Salvage, don't restart** — see the keep / new / delete inventory below before starting.

**Two standing guardrails for the implementation agents:**

- **Never delete the v0 monolith** (`src/components/TextEditor/`). It stays in place, unmodified, as a migration safety net and coexists with the v1 editor. Removing it is a separate, human-gated step — out of scope for these issues.
- **The gameplan port (07) is the acceptance gate.** The API is not "done" until gameplan runs on it with functional parity *and* a measured bundle reduction. If parity needs API the spec doesn't provide, stop for HITL and change the spec/component — not gameplan.

## Current code: keep / new / delete

The v1 editor lives at `src/molecules/editor/`. Salvage and align — do not rewrite:

**Keep & align:**
- `extensions/**` — the extension catalog (38 files, ~6.8k lines: node views, paste handlers, suggestion infra; carries shipped bug fixes). → issue 02
- `useEditor.ts`, `EditorContent.vue` — engine + content. → issue 01
- `EditorFixedMenu.vue` / `EditorBubbleMenu.vue` / `EditorFloatingMenu.vue` / `MenuItems.vue` / `menu.ts` — menus, items, presets. → issue 03
- `SuggestionExtension.ts`, `components/**` (node-view + popup internals), `useEditor.test.ts`, `menu.test.ts`.

**New:**
- Kits — `CommentKit` / `RichTextKit` / `InlineKit` (today there is only a plain `StarterKit` re-export). → issue 05
- The single `<TextEditor>` — rewrite `TextEditor.vue` (currently a v0 alias). → issue 06

**Delete** (the v1 family's own dead code — *not* v0):
- `RichTextEditor.vue`, `CommentEditor.vue`, `InlineEditor.vue` (~200 lines). → issues 06 / 08

**Never touch** (guardrail): `src/components/TextEditor/` — the v0 monolith (67 files). Human-gated removal only.

## Build order

| # | Issue | Blocked by |
| --- | --- | --- |
| 01 | [Editor engine + content rendering](./01-editor-engine-and-content.md) | — |
| 02 | [Extension catalog + suggestion helper](./02-extension-catalog-and-suggestion-helper.md) | 01 |
| 03 | [Menu components, items, presets](./03-menu-components-items-presets.md) | 01 |
| 04 | [Upload plumbing](./04-upload-plumbing.md) | 01, 02 |
| 05 | [Editor kits](./05-editor-kits.md) | 02, 04 |
| 06 | [`<TextEditor>` component](./06-texteditor-component.md) | 01, 03, 04, 05 |
| 07 | [Migrate gameplan + verify parity/bundle](./07-migrate-gameplan-and-verify.md) | 06 |
| 08 | [Finalize exports + migration guide (v0 left in place)](./08-finalize-exports-and-migration-guide.md) | 07 |
| 09 | [Editor docs: family page + build-your-own recipe](./09-editor-docs.md) | 06 |
