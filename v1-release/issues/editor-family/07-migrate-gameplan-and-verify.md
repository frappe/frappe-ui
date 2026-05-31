# Migrate gameplan to the new editor API and verify parity, bundle, and ergonomics

Labels: `needs-triage`
Type: AFK
Status: ❌ Not started.

## Parent

`spec/editor.md` (§9 recommended pattern); `v1-release/research/11-texteditor-usage-audit.md` (gameplan call sites)

## What to build

Port gameplan — the heaviest real consumer (`@`-mentions, `#`-tags, RichQuote/FloatingQuote, ~9 call sites) — onto the new editor API, then prove the migration is behavior-preserving and lighter. This is the **acceptance gate** for the whole family: the API is not "done" until a real app runs on it with identical behavior.

Work happens in the gameplan app (`~/Projects/frappe-bench/apps/gameplan`) against a linked dev build of frappe-ui (the existing `apps/frappe-ui` symlink). Do **not** modify or delete the v0 monolith in frappe-ui.

## Acceptance criteria

- [ ] Gameplan's editor wrapper(s) are replaced by app components built on `<TextEditor>` + `CommentKit`/`RichTextKit`, with gameplan-local `RichQuote`/`FloatingQuote` appended and mentions/tags configured via `kit.configure` (not props).
- [ ] All gameplan editor call sites from `research/11` are migrated (comments, discussions, task description, page/readme).
- [ ] The duplicated `textEditorMenuButtons` arrays are replaced by presets (+ gameplan-specific buttons as `MenuItem` objects where needed).
- [ ] **Functional parity** (hard requirement): comment compose/submit/discard, `@`-mentions, `#`-tags, rich quote ("quote this reply"), the readonly floating-quote button, discussion bodies, task descriptions, image/video upload, placeholder, editable toggling, and focus behavior all behave exactly as before. Existing gameplan editor tests pass (updated only for import/markup, not behavior); a manual parity checklist is recorded.
- [ ] **Lighter bundle**: measure the editor-related chunk(s) before vs after and record the delta. Expect a reduction (no monolith auto-loading every extension; tree-shaken kits). If it is **not** lighter, stop for HITL — that signals the tree-shaking story isn't holding.
- [ ] **Cleaner code**: record wrapper/call-site LOC before vs after and the removal of the duplicated menu-button arrays.
- [ ] A short report (parity checklist + bundle delta + LOC delta) is committed alongside the migration for review.

## Blocked by

- `06`

## Notes

Use the `verify` workflow (run the app, exercise the flows) for the parity check. If achieving parity requires API the spec doesn't provide (a missing surface, a behavior the L0–L4 ladder can't express), **stop for HITL** — that is the design feedback this issue exists to surface, and it should change the spec/component, not bolt a one-off prop onto gameplan.
