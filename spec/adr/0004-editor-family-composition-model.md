# Editor family: one `<TextEditor>` + kits, no ready-mades

**Status**: accepted

> Supersedes an earlier draft of this ADR (titled "headless primitives + ready-mades")
> that was never merged. The "Considered alternatives" section records why that shape
> was abandoned.

## Amendment (2026-06-01): `<TextEditor>` is renderless

The original decision below gave `<TextEditor>` a default-rendered chrome plus
`fixedMenu` / `bubbleMenu` / `floatingMenu` props *and* a `#default` layout slot.
That was a half-measure: the menu props baked layout opinions (a bordered box, a
toolbar position) into the library, competed with the slot as a second way to place
menus, and — as the gameplan port proved — went unused, because the heaviest
consumer composed everything in the `#default` slot anyway.

So `<TextEditor>` is now **renderless**: it owns the editor lifecycle, `v-model`,
upload and placeholder threading, and exposes `{ editor, isEmpty }` through its
`#default` slot, but renders no UI of its own. The menu/chrome props and the
`#actions` / `#fixedMenu` / `#bubbleMenu` / `#floatingMenu` slots are removed; the
consumer renders `EditorContent` and any menus/actions in the slot using the
building blocks. This is the purest form of this ADR's own thesis ("no one-size-
fits-all editor"): the component makes *zero* layout decisions, and the customization
ladder collapses to two rungs — the slot, and `useEditor` (L4). Predefined menu
items now also ship a default `icon` (a `lucide-*` string), so composing a toolbar
needs no per-item icon plumbing. The wording in points 2 and 5 and in Consequences
below is updated to match; the rest of the decision (one component, one engine,
kits, presets, no ready-mades) stands.

## Context

The v0 `TextEditor` is a monolith. Every consumer app (gameplan, helpdesk, drive, crm, insights) wraps it to peel off defaults it can't control: auto-loaded extensions, frappe-coupled upload, fixed menu presets, opinionated layout slots. The audit in [`v1-release/research/11-texteditor-usage-audit.md`](../../v1-release/research/11-texteditor-usage-audit.md) shows 4 of 5 apps maintain their own wrapper, five copies of the same toolbar-button array exist in the fleet, and most apps fight the same defaults in slightly different ways. Static imports in `TextEditor.vue` also defeat tree-shaking — everyone pays for every extension.

A fresh classification of all ~32 real call sites against a minimal drop-in component sharpened two facts the v0 design obscured:

1. **The genuinely-bespoke editors are real but few** (~6: drive's Y.js collaboration document, insights' notebook with embedded query/chart nodes, the helpdesk/crm email composers with CC/BCC/attachment headers). These need full layout and extension control.
2. **No app's "comment editor" matches another's.** Gameplan's needs `@`-mentions + `#`-tags + a RichQuote extension; helpdesk's needs agent mentions + `PreserveVideoControls` + an attachment row; drive's is a Y.js comment thread. A library component called `CommentEditor` would fit none of them without either growing into a configurable monolith or staying so rigid nobody can use it.

## Decision

The editor ships at one subpath, `frappe-ui/editor`, as **one component on one engine, customized progressively** — not as two layers.

1. **Engine — `useEditor`.** A composable that owns the TipTap `Editor` lifecycle, binds content via `v-model`, threads the upload function, detects collaboration, and destroys on unmount.
2. **Component — `<TextEditor>`.** The single component everything is built on. Capability is supplied through an explicit `extensions` array. It is **renderless** (see Amendment): it owns the editor lifecycle and exposes `{ editor, isEmpty }` through its `#default` slot, and the consumer composes the layout — content area, menus, action buttons — in that slot from the building blocks. Customization is a continuum on the *same* component — slot markup → drop to `useEditor` + building blocks — with no second component family to fork into.
3. **Kits.** Capability *defaults* ship as `StarterKit`-style configurable bundles: `StarterKit`, `CommentKit`, `RichTextKit`, `InlineKit`. Each member is configured or removed through the canonical `.configure()` — including data-driven members like `mention`. Kits are the unit of "good defaults" **and** the tree-shaking boundary.
4. **Presets + menu items.** Toolbar *content* defaults ship as plain `MenuItem[]` presets (`commentToolbar`, `articleToolbar`, `minimalToolbar`); individual buttons (`Bold`, `H2`, `Separator`, …) are typed objects. Both are opt-in imports.
5. **Building blocks.** `EditorContent`, `EditorFixedMenu`, `EditorBubbleMenu`, `EditorFloatingMenu` — the parts the consumer renders inside `<TextEditor>`'s slot (and the same parts used at L4 without the component). Each takes an unwrapped `editor` prop; menus take an `items: MenuItem[]`.

**Nothing import-heavy is defaulted on the component.** `extensions` is required (pass at least a kit); the menu surfaces default off. Tree-shaking falls out because every capability and every button is something the consumer imported and passed — the component itself references no kit and no preset.

**No ready-made assembled editors ship.** The library provides the engine, the component, the kits, the presets, and the building blocks — never `CommentEditor` / `RichTextEditor` / `InlineEditor`. The recommended pattern is that **each app builds its own thin component on `<TextEditor>`** (one file, reused across that app's call sites), encoding that app's mention source, local extensions, toolbar, and action buttons. The reuse unit for an assembled editor is per-app, because assembled editors are app-specific.

## Considered alternatives

- **Stay monolithic + `features` / `disable` array.** Rejected: static imports defeat tree-shaking; the API grows without solving wrapper proliferation.
- **Headless primitives + ready-made components** (the earlier draft of this ADR). Rejected after the per-call-site classification: a shipped `CommentEditor`/`RichTextEditor` fits no real app (every one needs custom extensions, a custom mention source, or custom layout), so it would be either rigid-and-unused or a config-monolith. The primitive↔ready-made split is also a *cliff*: the moment a ready-made lacks one thing, the consumer rewrites from scratch in primitives — a fork that fragments the API. And the proposed `mentions`/`tags` shorthand props are proxies for `Mention.configure({ items })` that compete with the canonical config path and don't generalize to the next data-driven extension.
- **Compound components** (`<Editor><Editor.Content/></Editor>` via dot-notation + `provide`/`inject`). Rejected: dot-notation re-exports and context plumbing aren't used elsewhere in frappe-ui, and "good defaults" become awkward when every part must be spelled out. The slot model on one component gives most of the layout freedom while staying idiomatic.

## Consequences

- **Good defaults are opt-in imports, not baked-in component defaults.** `<TextEditor :extensions="[RichTextKit]" v-slot="{ editor }">` with `EditorContent` + `<EditorFixedMenu :items="articleToolbar" />` in the slot is the "good default" form — a few imports, fully tree-shakeable. This is the deliberate trade: a zero-config *rich* editor is impossible to tree-shake, so we don't offer one; the convenience lives in the kit/preset you import and the small app component you wrap it in.
- **Apps own their editor components.** The thing that would have been a ready-made is now a ~30-line app component on `<TextEditor>`, documented as a recipe. Library surface shrinks; app code that already existed as a wrapper gets shorter and stops fighting defaults.
- **Capability and chrome are independently customizable.** `extensions` (what it can do) and `toolbar`/menu props/slots (how it looks) are orthogonal — neither forces the other to a lower layer.
- **v1 is a break from the v0 monolith, but a guarded one.** The v1 `<TextEditor>` ships alongside the v0 monolith, which is retained unmodified as a migration safety net (not extended, not aliased). Removal of v0 is a deliberate, human-gated step after consumers are migrated and verified — implementation agents do not delete it. The migration is proven by porting gameplan (the heaviest consumer) with functional parity and a measured bundle reduction; per-app guidance lives in the audit.
- **`useEditor` shadows TipTap's own `useEditor`** from `@tiptap/vue-3`. Consumers using both alias one side. Accepted for the cleaner name in the dominant case.
- **The subpath is a wall around a heavy/optional dependency graph and a large export surface — not a tree-shaking mechanism.** Prod tree-shaking is already handled package-wide by `sideEffects: false`; the subpath's job is to keep TipTap (and the editor's ~50 named exports — extensions, kits, menu items that collide with names like `Image`/`Code`/`Link`/`Table`) out of the top-level `frappe-ui` barrel, so `import { Button } from 'frappe-ui'` never pulls TipTap into the dev module graph. This is the same rationale behind the existing `./frappe`, `./drive`, and `./icons` subpaths. Ordinary components and most molecules (ListView, CommandPalette, Sidebar) carry no heavy isolated dep and stay in the top-level barrel; the only other subpath candidate is a charting family if it wraps a heavy engine. The bar is *isolated heavy dependency and/or large colliding export surface*, not "every molecule."
