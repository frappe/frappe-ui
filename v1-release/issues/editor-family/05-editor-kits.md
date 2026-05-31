# Build the editor kits (`StarterKit`, `CommentKit`, `RichTextKit`, `InlineKit`)

Labels: `needs-triage`
Type: AFK
Status: ❌ Not started — only a plain `StarterKit` re-export exists; no `CommentKit`/`RichTextKit`/`InlineKit`.

## Parent

`spec/editor.md` (§3 Kits)

## What to build

`StarterKit`-style configurable extension bundles — the unit of "good defaults" and the tree-shaking boundary. Each kit is a single extension that adds member extensions; every member is configured or removed through `.configure(...)`. This is the canonical home for mention/tag/slash configuration — there is no component prop for them.

## Acceptance criteria

- [ ] `StarterKit`, `CommentKit`, `RichTextKit`, `InlineKit` are exported from `frappe-ui/editor`.
- [ ] `.configure({ member: {...} })` configures a member; `{ member: false }` removes it.
- [ ] All members are present by default; data-driven members (`mention`, `tag`, `slashCommands`) are inert until given `items`.
- [ ] Member option types are typed (StarterKit-grade), including the data-driven members' `items`.
- [ ] Mentions are configured via the kit member (`CommentKit.configure({ mention: { items } })`); confirm no `mentions`/`tags` prop exists anywhere in the family.
- [ ] Adding an extension alongside a kit works (`[CommentKit, MyExt]`); swapping a member is `{ member: false }` + adding your own, with no TipTap duplicate-name errors.
- [ ] Each kit pulls only its members into the bundle — verify `CommentKit` excludes `table`/`toc`/`slashCommands`.
- [ ] `InlineKit` produces single-line rich text (marks + link + placeholder; no block-splitting on Enter).
- [ ] Tests cover member configure, member disable, inert-until-configured data members, dedupe on swap, and per-kit bundle membership.

## Blocked by

- `02`
- `04`

## Notes

**Recommended structure** (see `spec/editor.md` §3): build each kit as `Extension.create({ addExtensions() })` over tiptap's `StarterKit` (base bundle), with `heading` threaded into `StarterKit.configure({ heading })`, a `starterKit` passthrough for other base config, and a flat `Partial<Opts> | false` option per non-StarterKit member — rather than hand-flattening StarterKit's ~15 sub-members. `RichTextKit`'s `color` member must also register `TextStyle`. Confirm the structure during implementation.

Member lists in `spec/editor.md` §3 are tentative; finalize them against the migration call sites in `research/11`. If a kit needs a member not yet in the catalog, add it in `02` first. If the configure/disable contract must change, stop for HITL.
