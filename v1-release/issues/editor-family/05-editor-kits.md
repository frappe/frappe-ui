# Build the editor kits (`StarterKit`, `CommentKit`, `RichTextKit`, `InlineKit`)

Labels: `needs-triage`
Type: AFK
Status: ✅ Done — `CommentKit`/`RichTextKit`/`InlineKit` ship in `kits.ts` (StarterKit stays a re-export). Built as `Extension.create({ addExtensions() })` over tiptap StarterKit with flat `Partial<Opts> | false` members, `heading` threaded into StarterKit, `color` co-registering `TextStyle`, and an `OneLineDocument` for the single-line InlineKit. Data members (`mention`/`tag`) are inert until given `items`. `kits.test.ts` covers membership, disable, inert data members, dedupe-on-swap, and single-line. See Notes for decisions taken during implementation.

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

### Decisions taken during implementation

These resolve the spec's "settled during implementation" / open-question items. None expand the public surface beyond the spec; flag at HITL if any should change:

- **StarterKit base, v3 reality.** tiptap v3's `StarterKit` already bundles `link` and `underline` and uses `undoRedo`/`trailingNode`. Each kit disables StarterKit's `link` and uses the frappe `Link` member instead (our `openOnClick:false` default, and no duplicate-name collision). `underline` is left on (harmless extra mark, not a named member).
- **Data members take `{ items }` and are inert until configured.** The canonical config is `kit.configure({ mention: { items }, tag: { items } })`. The underlying `Mention`/`Tag` exports were realigned from `mentions`/`tags` to `items` (issue 02). With no `items`, only the node loads (existing @mentions/#tags still render) and no suggestion fires; `false` removes the member entirely.
- **`SlashCommands` keeps its built-in registry.** Unlike `mention`/`tag` it has a useful default command list, so RichTextKit ships it enabled; `slashCommands: false` removes it. A configurable custom `items` registry (open question §3) is deferred.
- **Image ⇒ ImageGroup coupling.** `ImageGroup` nodes contain `image` nodes, so disabling `image` alone would break the schema. The kit drops `ImageGroup` automatically when `image: false`, so the simple disable does the friendly thing.
- **InlineKit single-line mechanism** (open question §4): a custom `OneLineDocument` (`topNode`, `content: 'block'`) replaces StarterKit's document and every block-level member is disabled, leaving marks + link + placeholder. Enter can't create a second block (schema rejects it), so it's a no-op — no key-handler hacks needed.
