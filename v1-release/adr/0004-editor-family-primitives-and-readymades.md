# Editor family: headless primitives + ready-mades, all at `frappe-ui/editor`

**Status**: accepted

## Context

The v0 `TextEditor` is a monolith. Every consumer app (gameplan, helpdesk, drive, crm, insights) wraps it to peel off defaults it can't control: auto-loaded extensions, frappe-coupled upload, fixed menu presets, opinionated layout slots. The audit in [`v1-release/research/11-texteditor-usage-audit.md`](../research/11-texteditor-usage-audit.md) shows 4 of 5 apps maintain their own wrapper, five copies of the same `textEditorMenuButtons` array exist in the fleet, and most apps fight the same defaults in slightly different ways.

For v1 we considered keeping the monolith and adding a `features` / `disable` prop family to opt out of built-ins; this approach was abandoned because static imports in `TextEditor.vue` defeat tree-shaking — runtime opt-outs don't shrink the bundle, and the API just grows.

## Decision

The editor ships as **two layers, both at one subpath**:

1. **Headless primitives.** A composable (`useEditor`) and four small components (`EditorContent`, `EditorFixedMenu`, `EditorBubbleMenu`, `EditorFloatingMenu`) that take the underlying TipTap `Editor` instance as an explicit `:editor` prop. No auto-loaded extensions, no implicit defaults, no provide/inject. Every extension is a flat named export the consumer imports explicitly and passes through `useEditor({ extensions })`. Tree-shaking falls out naturally because every dependency is a named ESM import.
2. **Ready-made components.** `RichTextEditor`, `CommentEditor`, `InlineEditor` are small (~50 lines each) opinionated assemblies built on the primitives. They are the "use this and move on" answer and double as the canonical worked example of composing primitives.

Everything editor-related — primitives, extensions, ready-mades, and the deprecated v0 alias — lives at the single subpath `frappe-ui/editor`. No other component family in frappe-ui uses a subpath; this is reserved for subsystems big enough to warrant their own mental location.

## Considered alternatives

- **Stay monolithic + features array.** Rejected: static imports defeat tree-shaking; the API surface grows without solving the wrapper proliferation problem.
- **Radix-style dot-notation namespace (`Editor.Content`, `Editor.useEditor`).** Rejected: dot-notation re-exports aren't used elsewhere in frappe-ui and the subpath model gives the same separation cleaner.
- **Flat top-level exports (`import { EditorContent, Image } from 'frappe-ui'`).** Rejected: the editor surface is ~50 named exports (primitives + extensions + menu items + presets + ready-mades); polluting the top-level namespace makes IDE autocomplete on `frappe-ui` noisy and collides with consumer-side names (`Image`, `Code`, `Link`, `Table`).

## Consequences

- **Breaking change for v1.** Every existing call site eventually rewrites. The v0 `TextEditor` ships as a deprecated alias from both `frappe-ui` and `frappe-ui/editor` through v1 (one-time warning on mount, points at `RichTextEditor`); removed in v2.
- **`useEditor` shadows TipTap's own `useEditor`** from `@tiptap/vue-3`. Consumers using both alias one side. Accepted for the cleaner name in the dominant case.
- **No `extensions` prop on ready-mades.** Consumers needing custom extensions drop to primitives — this is what keeps ready-mades from sliding back into "configurable monolith" territory.
- **Editor is the only component family with a subpath.** Future families do not adopt this pattern unless they reach the same bar (headless primitives layer + ready-made layer + extensive named-export surface).
