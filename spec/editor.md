# Editor Family API Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the v1 API for the editor family — the TipTap-based engine, the single `<TextEditor>` component built on it, the kits that supply good defaults, and the building blocks for bespoke composition. It supersedes the v0 monolithic `TextEditor`.

Real-world usage data backing these decisions lives in
[`v1-release/research/11-texteditor-usage-audit.md`](../v1-release/research/11-texteditor-usage-audit.md).
The architectural shape is decided in
[`adr/0004-editor-family-composition-model.md`](./adr/0004-editor-family-composition-model.md).
Vocabulary is in [`../CONTEXT.md`](../CONTEXT.md) under "Editor family";
design rules cited as `P1`–`P13` live in [`../PHILOSOPHY.md`](../PHILOSOPHY.md).

## Scope

This spec covers:

- the `frappe-ui/editor` subpath surface (engine, component, building blocks, kits, extensions, presets)
- the public API of `useEditor` and `<TextEditor>`
- the kit model (configurable extension bundles) and the menu-item / preset model
- the two-axis menu model (which buttons vs how it renders)
- the upload-function plumbing
- the recommended "build your own component on `<TextEditor>`" pattern

Out of scope:

- collaboration (Y.js / WebRTC) — apps compose their own collab stack on top; whether frappe-ui ships any collab helper is deferred
- the exact member list baked into each kit (tentative — see §5)
- per-extension default-config decisions (Table resizable, Link openOnClick, etc.) — settled during implementation

## Decision summary

- one subpath: `frappe-ui/editor`
- **one component**, `<TextEditor>`, built on the **`useEditor`** composable; customized progressively (props → named slots → `#default` layout slot → `useEditor` + building blocks) with no second component family
- **no ready-made assembled editors** (`CommentEditor` / `RichTextEditor` / `InlineEditor` are *not* shipped). Each app builds its own thin component on `<TextEditor>`
- capability is the explicit **`extensions` array** (required, no default); chrome is explicit **`fixedMenu` / `bubbleMenu` / `floatingMenu`** props (default off)
- "good defaults" ship as **kits** (`StarterKit`-style configurable bundles) and **presets** (`MenuItem[]`) — opt-in imports, the tree-shaking boundary. Nothing import-heavy is defaulted on the component
- data-driven extensions (mentions, tags, slash items) are configured via canonical **`.configure()`** on a kit member — never via proxy props
- content is the unnamed `v-model`; the `format` prop ('html' | 'json') declares the shape
- `placeholder`, `editable`, content are reactive; everything else is construction-time

## Public surface

```ts
import {
  // Engine
  useEditor,

  // The component
  TextEditor,

  // Building blocks (compose without TextEditor)
  EditorContent, EditorFixedMenu, EditorBubbleMenu, EditorFloatingMenu,

  // Kits — configurable extension bundles
  StarterKit, CommentKit, RichTextKit, InlineKit,

  // Individual extensions (flat named exports, frappe-ui default config applied)
  Placeholder, Heading, Link, Code, CodeBlock,
  Table, TableRow, TableCell, TableHeader, TaskList, TaskItem,
  Typography, TextAlign, TextStyle, Color, Highlight,
  Image, ImageGroup, ImageViewer, Video, Iframe,
  Mention, Tag, Emoji, SlashCommands, Toc,
  ContentPaste, StyleClipboard, SuggestionExtension,

  // Menu items
  Bold, Italic, Strike, BulletList, OrderedList, Blockquote,
  Paragraph, H1, H2, H3, H4, H5, H6, HeadingGroup,
  AlignLeft, AlignCenter, AlignRight,
  FontColor, FontHighlight, InsertImage, InsertVideo, InsertLink,
  InsertTable, HorizontalRule, Separator,
  // (full catalog defined in implementation)

  // Toolbar presets — plain MenuItem arrays (surface-agnostic)
  commentToolbar, articleToolbar, minimalToolbar,

  // Types
  type Editor, type JSONContent, type UploadedFile,
  type MenuItem, type CommandMenuItem, type MenuGroupItem,
} from 'frappe-ui/editor'
```

There are no editor exports from top-level `'frappe-ui'`. There is no `CommentEditor` / `RichTextEditor` / `InlineEditor`.

## 1. `useEditor` — the engine

Owns the TipTap `Editor` lifecycle, binds content via `v-model`, threads upload, applies the reactivity model, and destroys on unmount.

```ts
function useEditor(options: {
  content?: Ref<string | JSONContent | null>
  format?: 'html' | 'json'                                  // default 'html', construction-time
  editable?: MaybeRefOrGetter<boolean>                      // reactive — setEditable() on change
  autofocus?: boolean                                       // construction-time
  uploadFunction?: (file: File) => Promise<UploadedFile>    // construction-time
  extensions: Extension[]                                   // required, construction-time
  onUpdate?: (editor: Editor) => void
  onFocus?: (editor: Editor, event: FocusEvent) => void
  onBlur?: (editor: Editor, event: FocusEvent) => void
  onTransaction?: (editor: Editor) => void
}): ShallowRef<Editor | null>
```

`extensions` is required — there is no implicit default list. Pass at least a kit (e.g. `[StarterKit]`). This is what keeps the engine free of baked-in imports.

### Content reactivity

The `content` ref is bidirectional:

- External writes call `editor.commands.setContent(value, { emitUpdate: false })`; for HTML, skip when `editor.getHTML() === content.value`; for JSON, an `applyingExternalUpdate` guard prevents TipTap's echo update from writing the same object back.
- Internal updates write back to `content.value` via `getHTML()` / `getJSON()` per `format`, unless caused by the external-write guard.

When the `extensions` list contains an extension named `'collaboration'`, content binding is disabled entirely — the Y.Doc owns the truth. `useEditor` does not seed initial content or watch `content` in that mode.

### Upload plumbing

When `uploadFunction` is set, `useEditor` prepends a tiny internal `UploadStorage` extension and writes the function to `editor.storage.upload.uploadFunction` after construction. The upload-aware extensions (`Image`, `ImageGroup`, `Video`, `ContentPaste`) read from that slot. Per-extension override via `Image.configure({ uploadFunction })` wins. `uploadFunction` is shared by several extensions, which is why it's one engine option rather than configured per extension.

### Naming collision

`useEditor` shadows tiptap's `useEditor` from `@tiptap/vue-3`. Consumers importing both alias one side; the cleaner name is preferred for the dominant case.

## 2. `<TextEditor>` — the component

The single component every editor is built on. It runs `useEditor` internally, renders the content area and whichever menu surfaces you configure, and exposes the editor for slots.

```ts
const model = defineModel<string | JSONContent | null>()

defineProps<{
  // capability
  extensions: Extension[]                 // REQUIRED — the complete list; include a kit

  // content / behavior knobs (universal, reactive where noted)
  format?: 'html' | 'json'                // default 'html'
  placeholder?: string                    // reactive; threads to the Placeholder extension
  editable?: boolean                      // default true; reactive
  autofocus?: boolean                     // default false
  uploadFunction?: (file: File) => Promise<UploadedFile>
  maxHeight?: string                      // CSS length; wraps content in overflow-y-auto

  // chrome (default off — explicit for tree-shaking)
  fixedMenu?: MenuItem[] | false          // default false; the persistent toolbar row
  fixedMenuPosition?: 'top' | 'bottom'    // default 'top'
  bubbleMenu?: MenuItem[] | false         // default false
  bubbleMenuOptions?: { shouldShow?: (...) => boolean; tippyOptions?: Partial<TippyProps> }
  floatingMenu?: MenuItem[] | false       // default false
}>()

defineSlots<{
  default?(props: { editor: Editor | null; isEmpty: boolean }): any    // own the layout
  actions?(props: { editor: Editor | null; isEmpty: boolean }): any     // buttons in the toolbar row
  fixedMenu?(props: { editor: Editor | null }): any                     // custom fixed-menu render
  bubbleMenu?(props: { editor: Editor | null }): any
  floatingMenu?(props: { editor: Editor | null }): any
}>()

defineEmits<{ change: [value: string | JSONContent | null] }>()
```

The three surface props (`fixedMenu` / `bubbleMenu` / `floatingMenu`) match the building-block component names (`EditorFixedMenu` / `EditorBubbleMenu` / `EditorFloatingMenu`) and v0's `fixed-menu` / `bubble-menu` / `floating-menu`. The `*Toolbar` presets are surface-agnostic item sets you assign to any of them.

### Why these are props vs `.configure()`

The line that keeps proxy-prop creep out (the `mentions`-prop smell):

- **Props** — universal display/behavior knobs every editor has, that aren't data sources: `v-model`/`format`, `editable`, `autofocus`, `placeholder`, `uploadFunction`, `maxHeight`, and the `fixedMenu`/`bubbleMenu`/`floatingMenu` chrome.
- **`.configure()` in `extensions`** — capabilities and data sources: `mention`, `tag`, slash items, heading levels, link behavior, custom nodes, collaboration.

`placeholder` stays a prop (universal, reactive, a display string — not a data source). It threads into the kit's `Placeholder` extension via `editor.storage`, the same pattern as `uploadFunction`: `<TextEditor>` writes the prop into `editor.storage.placeholder` after construction; the frappe-wrapped `Placeholder` (issue 02) reads its text from there when not explicitly configured and refreshes its decoration when the value changes; and an explicit `Placeholder.configure({ placeholder })` wins. The component never reconfigures a consumer-supplied extension. If no `Placeholder` extension is present, the prop is a no-op.

### The customization ladder

Every step adjusts the *same* component in place — there is no rewrite into another family:

| Rung | What you do | For |
|---|---|---|
| L0 | `<TextEditor :extensions="[kit]" v-model>` | content area, no chrome |
| L1 | `+ :fixed-menu="preset"` / `:bubble-menu="preset"` | standard menus |
| L2 | `+ #actions` / `#fixedMenu` slots | tweak the default chrome |
| L3 | `#default` slot (`{ editor, isEmpty }`) | own the layout; component still owns the editor lifecycle |
| L4 | `useEditor` + building blocks | own the lifecycle too (editor created in a parent composable) |

L3 covers bespoke layouts (email CC/BCC headers, a side Table-of-Contents) without leaving the component — you render `EditorContent` + menus where you want, using the slot's `editor`. L4 is only for when the `Editor` instance must live outside the component (shared with sibling inputs, or created with an external Y.Doc before mount).

## 3. Kits

A kit is a single extension that bundles others, in the `StarterKit` mold. Every member is configured or removed through canonical `.configure()`:

```ts
RichTextKit.configure({
  heading: { levels: [2, 3, 4] },     // configure a member
  mention: { items: searchUsers },    // data-driven member — the canonical way, no prop
  table: false,                       // remove a member
})
```

- All members are present by default. Data-driven members (`mention`, `tag`, `slashCommands`) are inert until configured with `items`; `false` removes any member.
- Add your own extension alongside a kit: `[CommentKit, MyExtension]`. To swap a kit member for your own, disable it then add yours: `[CommentKit.configure({ link: false }), MyLink]` (avoids TipTap duplicate-name errors).
- Kits are the tree-shaking boundary: `CommentKit` never pulls table/toc/slash into the bundle.

**Structure (recommended; confirm in implementation).** Build each kit as `Extension.create({ addExtensions() })` with tiptap's `StarterKit` as the base bundle (paragraph/text, bold/italic/strike/code, lists, blockquote, hr, hardbreak, history). `heading` threads through (`StarterKit.configure({ heading: options.heading })`) and a `starterKit` passthrough option covers other base config or disabling base members. Every non-StarterKit member (`placeholder`, `link`, `image`, `table`, `mention`, …) is a flat option typed `Partial<Opts> | false`. This delivers the flat config above without hand-flattening StarterKit's ~15 sub-members. Note `color` must also register `TextStyle` (its dependency).

Shipped kits (members **tentative** — final lists settle in implementation):

| Kit | Members (tentative) | For |
|---|---|---|
| `StarterKit` | paragraph, text, bold/italic/strike/code, headings, lists, blockquote, hr, hardbreak, history | the text-editing base |
| `CommentKit` | StarterKit + Placeholder, Link, Image, ImageGroup, Video, ContentPaste, Emoji, Mention, Tag | comments, chat, replies |
| `RichTextKit` | CommentKit + Table(+row/cell/header), TaskList/TaskItem, Iframe, Toc, SlashCommands, Color, Highlight, Typography, TextAlign, StyleClipboard | articles, docs, wiki |
| `InlineKit` | bold/italic/strike/code/link + Placeholder, single-line | rich titles / single-line |

## 4. Building-block components

Each takes an unwrapped `editor: Editor | null` prop (templates auto-unwrap the `useEditor` ref). No provide/inject, no implicit defaults. Each sets a stable `data-slot` for styling (P10).

### `EditorContent`

Wraps tiptap's `EditorContent` with the frappe-ui prose scaffolding; class fallthrough via normal `class=""` inheritance (no class-name prop, P10). `data-slot="editor-content"`.

```vue
<EditorContent :editor="editor" class="prose-sm max-w-none min-h-16" />
```

### `EditorFixedMenu`

A persistent toolbar row rendering a flat `MenuItem[]`. `data-slot="fixed-menu"`.

```ts
defineProps<{ editor: Editor | null; items: MenuItem[] }>()
```

### `EditorBubbleMenu`

Selection-anchored menu. Same `items` shape, plus optional `options` for `shouldShow` / `tippyOptions` (covers the insights site that suppresses the menu inside specific node types).

```ts
defineProps<{
  editor: Editor | null
  items: MenuItem[]
  options?: { shouldShow?: (...) => boolean; tippyOptions?: Partial<TippyProps> }
}>()
```

### `EditorFloatingMenu`

Empty-line menu (Notion-style "+"). Same shape as `EditorBubbleMenu`.

## 5. Menu items, presets, and the two-axis menu model

A menu surface varies along two independent axes: **which buttons** (data) and **how it renders** (chrome). They are customized separately.

### Menu items

```ts
type CommandMenuItem = {
  icon?: Component
  label: string
  action: (editor: Editor) => void
  isActive?: (editor: Editor) => boolean
  isDisabled?: (editor: Editor) => boolean
  isAvailable?: (editor: Editor) => boolean   // false → item is hidden (its extension isn't loaded)
}
type MenuGroupItem = { type: 'group'; icon?: Component; label: string; items: CommandMenuItem[] }
type MenuItem = CommandMenuItem | MenuGroupItem | { type: 'separator' }
```

Predefined items are typed constants imported by name. A custom button is just a `MenuItem` object — no custom rendering needed:

```ts
const QuoteButton: CommandMenuItem = {
  icon: LucideQuote,
  label: 'Quote',
  action: (e) => e.chain().focus().toggleBlockquote().run(),
  isActive: (e) => e.isActive('blockquote'),
}
```

**Self-pruning.** Items **hide** when unavailable — `isAvailable(editor)` returns `false` because the required mark/node isn't in `editor.schema` (predefined items set this, e.g. `Bold.isAvailable = (e) => 'bold' in e.schema.marks`) — and **disable** when present-but-not-currently-runnable (`isDisabled`). The renderer skips items whose `isAvailable` returns `false`. This is what lets one preset adapt across kits — `:fixed-menu="articleToolbar"` with `:extensions="[RichTextKit.configure({ table: false })]"` simply drops the Table button, no re-curation.

### Which buttons — the menu props

The `fixedMenu` / `bubbleMenu` / `floatingMenu` props mirror `extensions`: a preset is the good default, an array is the complete list, replace semantics, default off:

```ts
:fixed-menu="articleToolbar"                               // preset
:fixed-menu="[...commentToolbar, Separator, QuoteButton]"  // tweak a preset
:fixed-menu="[Bold, Italic, Link, Separator, H2, H3]"      // fully custom set
:fixed-menu="false"                                        // no fixed menu (default)
```

Presets (`commentToolbar`, `articleToolbar`, `minimalToolbar`) are plain `MenuItem[]`, opt-in imports — unimported presets tree-shake away. The same prop shape applies to `bubbleMenu` and `floatingMenu`.

### How it renders — the menu slots

For different *chrome* (a floating pill, a segmented control), take the `#fixedMenu` / `#bubbleMenu` / `#floatingMenu` slot and render your own, reusing the building blocks. A menu slot wins over its prop when both are present.

```vue
<TextEditor v-model="content" :extensions="extensions">
  <template #fixedMenu="{ editor }">
    <div class="my-pill">
      <EditorFixedMenu :editor="editor" :items="[Bold, Italic, Link]" />
      <MyControl :editor="editor" />
    </div>
  </template>
</TextEditor>
```

## 6. Extensions

Every extension is a flat named export with frappe-ui defaults pre-applied; consumers `.configure(...)` to override. Splits by origin:

- **Re-exports of tiptap extensions with our defaults**: `Placeholder`, `Heading`, `Link`, `Code`, `CodeBlock`, `Table`*, `TaskList`*, `Typography`, `TextAlign`, `TextStyle`, `Color`, `Highlight`. (`Color` requires `TextStyle` — register both together.) Raw tiptap behavior is available by importing from `@tiptap/extension-*` directly.
- **Frappe-custom**: `Image`, `ImageGroup`, `ImageViewer`, `Video`, `Iframe`, `Mention`, `Tag`, `Emoji`, `SlashCommands`, `Toc`, `ContentPaste`, `StyleClipboard`.
- **Helper**: `SuggestionExtension.configure(...)` — the primitive behind `@` / `#` / `{{` / `:emoji:` suggestions.

```ts
const Extension = SuggestionExtension.configure<TItem>({
  name: string
  trigger: string
  items: TItem[] | ((query: string) => TItem[] | Promise<TItem[]>)
  component?: Component
  command: (props: { editor: Editor; item: TItem; range: { from: number; to: number } }) => void
})
```

Kits are themselves extensions assembled from these. App-specific extensions (gameplan's RichQuote, helpdesk's PreserveVideoControls) are just appended to the array — no special path.

## 7. Content `v-model` and `format`

Content is the primary value — the unnamed `v-model` (P2). The `format` prop declares the shape:

```vue
<TextEditor v-model="html" :extensions="extensions" />               <!-- HTML (default) -->
<TextEditor v-model="json" format="json" :extensions="extensions" /> <!-- JSONContent -->
```

No `v-model:content`, `v-model:html`, or `v-model:json` — one v-model carries whichever format `format` declares. A `change` event fires on every content update (P1 — the behavior, not the binding mechanism); `v-model` is implemented with `defineModel`.

## 8. Reactivity model

| Option | Reactive? | Notes |
|---|---|---|
| Content (`html` / `json`) | ✅ two-way | the defining reactive surface |
| `editable` | ✅ | calls `editor.setEditable()` |
| `placeholder` | ✅ | forwarded as a getter to the `Placeholder` extension |
| `format` | ❌ | construction-time; mid-life change is undefined |
| `autofocus` | ❌ | one-shot at mount |
| `uploadFunction` | ❌ | construction-time; threaded to storage |
| `extensions` | ❌ | construction-time; reactive extensions = destroy + recreate, not supported |
| `fixedMenu` / `bubbleMenu` / `floatingMenu` | ✅ | item arrays may change reactively |

## 9. The recommended pattern — build your app's component on `<TextEditor>`

frappe-ui ships no assembled editor. Each app writes one thin component encoding its conventions and reuses it across call sites. This *is* the "use this and move on" answer — it just lives in the app, where the app-specific shape belongs.

```vue
<!-- gameplan/src/components/GPComment.vue — written once, reused at every comment site -->
<script setup lang="ts">
import { TextEditor, CommentKit, commentToolbar } from 'frappe-ui/editor'
import { RichQuote, FloatingQuote } from './editor/extensions'   // gameplan-local
import { activeUsers } from '@/data/users'
import { tags } from '@/data/tags'
import { uploadAttachment } from '@/utils'

const content = defineModel<string>()
defineEmits<{ submit: []; discard: [] }>()

const extensions = [
  CommentKit.configure({
    mention: { items: activeUsers },   // data via canonical configure
    tag: { items: tags },
  }),
  RichQuote, FloatingQuote,            // app-specific extensions, appended
]
</script>

<template>
  <TextEditor
    v-model="content"
    :extensions="extensions"
    :fixed-menu="commentToolbar"
    fixed-menu-position="bottom"
    :upload-function="uploadAttachment"
    placeholder="Write a comment…"
  >
    <template #actions="{ isEmpty }">
      <Button label="Discard" @click="$emit('discard')" />
      <Button variant="solid" label="Comment" :disabled="isEmpty" @click="$emit('submit')" />
    </template>
  </TextEditor>
</template>
```

Helpdesk writes its own with agent mentions + `PreserveVideoControls` + its toolbar + an attachment row (via `#default`); drive composes a collab document at L4. None fight a library component.

## 10. Bespoke layout without leaving the component (L3)

The email composer's CC/BCC header doesn't fit a default chrome, but it doesn't need `useEditor` either — take the `#default` slot:

```vue
<TextEditor v-model="content" :extensions="extensions" :upload-function="upload" v-slot="{ editor }">
  <EmailHeaders v-model:to="to" v-model:cc="cc" />
  <EditorContent :editor="editor" class="prose-sm min-h-28 px-3 py-2" />
  <div class="flex items-center justify-between border-t px-2 py-1.5">
    <EditorFixedMenu :editor="editor" :items="commentToolbar" />
    <Button variant="solid" label="Send" :disabled="!editor || editor.isEmpty" @click="send" />
  </div>
</TextEditor>
```

The component still owns the editor lifecycle, v-model, and upload threading; you only own the arrangement.

## 11. Composing without `<TextEditor>` (L4)

When the `Editor` instance must live in a parent composable (shared with a sibling `<textarea>`, or created with an external Y.Doc), use `useEditor` + the building blocks — the same parts `<TextEditor>` uses internally. No new API.

```vue
<script setup lang="ts">
const editor = useEditor({
  extensions: [
    CommentKit.configure({ mention: { items: users } }),
    Collaboration.configure({ document: ydoc }),   // content binding auto-disabled
  ],
  uploadFunction: uploadEmbed,
})
</script>

<template>
  <EditorFixedMenu :editor="editor" :items="articleToolbar" />
  <div class="flex">
    <EditorContent :editor="editor" class="prose-sm flex-1" />
    <ToC :editor="editor" />
  </div>
  <EditorBubbleMenu :editor="editor" :items="articleToolbar" />
</template>
```

## 12. Migration from the v0 monolith

The v1 `<TextEditor>` ships at `frappe-ui/editor` **alongside** the v0 monolith, which stays in place, unmodified, as a migration safety net — it is not extended, aliased, or auto-removed. During the window, `import { TextEditor } from 'frappe-ui'` (v0) and `import { TextEditor } from 'frappe-ui/editor'` (v1) coexist. Consumers migrate to `<TextEditor>` + a kit (or their own wrapper component); per-app guidance is in [`research/11`](../v1-release/research/11-texteditor-usage-audit.md)'s migration table, and the migration is **proven by porting gameplan** (the heaviest consumer) with functional parity and a measured bundle reduction before the API is considered done.

Removing the v0 monolith is a deliberate, **human-gated** cleanup once all consumers are migrated and verified — implementation agents do not delete it. (Pre-v1 the library may still make this break; P13's freeze line is v1 release.)

## Open questions / deferred

1. **Collaboration story.** Whether frappe-ui ships a `Collaboration` re-export, a docs recipe, or nothing. `useEditor` detects a `collaboration` extension and disables content binding — the only built-in accommodation for now.
2. **Per-kit member lists.** The §3 tables are tentative; finalized when each kit is implemented against migration call sites.
3. **`SlashCommands` item registry.** Shape falls out of `SlashCommands.configure({ items })` during implementation.
4. **`InlineKit` single-line mechanism.** Whether via a custom one-line `Document` or config; settled in implementation.

## Related documents

- [`../CONTEXT.md`](../CONTEXT.md) — vocabulary
- [`../PHILOSOPHY.md`](../PHILOSOPHY.md) — design rules (P1–P13)
- [`adr/0004-editor-family-composition-model.md`](./adr/0004-editor-family-composition-model.md) — architectural shape
- [`../v1-release/research/11-texteditor-usage-audit.md`](../v1-release/research/11-texteditor-usage-audit.md) — usage data and migration impact
