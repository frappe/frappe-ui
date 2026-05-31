# Editor Family API Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the v1 API for the editor family — the headless TipTap-based primitives and the ready-made compositions that ship on top of them. It supersedes the v0 monolithic `TextEditor` component.

Real-world usage data backing the decisions in this spec lives in
[`research/11-texteditor-usage-audit.md`](./research/11-texteditor-usage-audit.md).
The architectural shape (two layers, single subpath) is decided in
[`adr/0004-editor-family-primitives-and-readymades.md`](./adr/0004-editor-family-primitives-and-readymades.md).
Vocabulary is in [`../CONTEXT.md`](../CONTEXT.md) under "Editor family."

## Scope

This spec covers:

- the `frappe-ui/editor` subpath surface (composable, components, extensions, ready-mades)
- the public API of every primitive and ready-made
- the menu-item shape and presets
- the upload-function plumbing
- the v0 `TextEditor` deprecation

Out of scope:

- collaboration (Y.js / WebRTC) — drive composes its own collab stack on top of the primitives; whether frappe-ui ships any collab helper is deferred
- the implementation-time list of extensions baked into each ready-made (tentative — see §7)
- per-extension default-config decisions (Table resizable, Link openOnClick, etc.) — settled during implementation

## Decision summary

- editor family ships at one subpath: `frappe-ui/editor`
- two layers: **headless primitives** (composable + four components) and **ready-mades** (`RichTextEditor`, `CommentEditor`, `InlineEditor`)
- ready-mades use the primitive composable (`useEditor`) internally — they are worked examples of composition, not a parallel implementation
- content is the unnamed `v-model`; `format` prop ('html' | 'json') declares the shape
- one `actions` slot on ready-mades that have a toolbar; broader layout customization means dropping to primitives
- extensions are flat named exports with our default config pre-applied; consumers import what they use
- menu items are predefined typed objects (`Bold`, `Italic`, `H2`, `Separator`, `HeadingGroup`, …); dropdowns use an explicit `{ type: 'group' }` shape; presets (`commentToolbar`, `articleToolbar`, `minimalToolbar`) are plain arrays of these objects
- upload function is one option on `useEditor`; an internal storage extension threads it via `editor.storage.upload` to `Image`, `Video`, `ImageGroup`, `ContentPaste`
- content + `editable` + placeholder are reactive; everything else is construction-time
- v0 `TextEditor` ships as a deprecated alias from both `frappe-ui` and `frappe-ui/editor` in v1; removed in v2

## Public surface

```ts
import {
  // Primitives — composable + components
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  EditorFloatingMenu,

  // Helpers
  SuggestionExtension,

  // Types
  type Editor,
  type JSONContent,
  type UploadedFile,
  type MenuItem,
  type CommandMenuItem,
  type MenuGroupItem,

  // Extensions (flat named exports, with frappe-ui default config applied)
  StarterKit, Placeholder, Heading, Link, Code, CodeBlock,
  Table, TableRow, TableCell, TableHeader,
  TaskList, TaskItem,
  Typography, TextAlign, Color, Highlight,
  Image, ImageGroup, ImageViewer, Video, Iframe,
  Mention, Tag, Emoji, SlashCommands, Toc,
  ContentPaste, StyleClipboard,

  // Predefined menu items
  Bold, Italic, Strike, BulletList, OrderedList, Blockquote,
  Paragraph, H1, H2, H3, H4, H5, H6, HeadingGroup,
  AlignLeft, AlignCenter, AlignRight,
  FontColor, FontHighlight, InsertImage, InsertVideo, InsertLink,
  InsertTable, HorizontalRule, Separator,
  // (full catalog defined in implementation)

  // Menu presets — plain MenuItem arrays
  commentToolbar, articleToolbar, minimalToolbar,

  // Ready-mades
  RichTextEditor, CommentEditor, InlineEditor,

  // v0 deprecated alias (also re-exported from top-level 'frappe-ui')
  TextEditor,
} from 'frappe-ui/editor'
```

The only top-level `'frappe-ui'` editor export is the deprecated `TextEditor` alias.

## 1. `useEditor` — the composable

Owns the TipTap `Editor` lifecycle, binds content via `v-model`, threads upload, applies the reactivity model, and destroys on unmount.

```ts
function useEditor(options: {
  content?: Ref<string | JSONContent | null>
  format?: 'html' | 'json'                                  // default 'html', construction-time
  editable?: MaybeRefOrGetter<boolean>                      // reactive — setEditable() on change
  autofocus?: boolean                                       // construction-time
  uploadFunction?: (file: File) => Promise<UploadedFile>    // construction-time
  extensions: Extension[]                                   // construction-time
  onUpdate?: (editor: Editor) => void
  onFocus?: (editor: Editor, event: FocusEvent) => void
  onBlur?: (editor: Editor, event: FocusEvent) => void
  onTransaction?: (editor: Editor) => void
}): ShallowRef<Editor | null>
```

### Content reactivity

The `content` ref is bidirectional:

- External writes (`content.value = newHTML`) call `editor.commands.setContent(newHTML, false)`. For HTML, skip when `editor.getHTML() === content.value`. For JSON, avoid deep-equality requirements by using an internal `applyingExternalUpdate` guard so TipTap's echo update does not write the same object back immediately.
- Internal updates emit through tiptap's `onUpdate` and write back to `content.value` via `editor.getHTML()` or `editor.getJSON()` per `format`, unless the update was caused by the external-write guard.

If `format` is `'json'`, the ref's type narrows to `JSONContent | null`; if `'html'`, to `string | null`. Setting `format` mid-life is undefined behavior.

When the `extensions` list contains an extension whose name is `'collaboration'`, content binding is disabled entirely — the Y.Doc owns the truth. In collaboration mode `useEditor` does **not** pass `content` as initial TipTap content and does not watch it after construction. Initial seeding is caller-owned.

### Upload plumbing

When `uploadFunction` is set, `useEditor` prepends a tiny internal `UploadStorage` extension whose storage shape is `{ uploadFunction: null }`, then writes the function to `editor.storage.upload.uploadFunction` after the Editor is constructed. The four upload-aware extensions (`Image`, `ImageGroup`, `Video`, `ContentPaste`) read from that slot. Per-extension override via `Image.configure({ uploadFunction })` wins over the storage default.

Extensions used outside our `useEditor` (e.g. with tiptap's own `useEditor`) and without per-extension configuration log a one-time warning and treat upload as no-op.

`uploadArgs` from v0 is removed — consumers bake args into their function closure.

### Naming collision

`useEditor` shadows tiptap's `useEditor` from `@tiptap/vue-3`. Consumers importing both alias one side; the cleaner name is preferred for the dominant case.

## 2. Primitive components

Each takes an unwrapped `editor: Editor | null` prop. `useEditor` returns `ShallowRef<Editor | null>`, but Vue templates unwrap refs when passing props, so the public component prop is the Editor instance, not the ref. No provide/inject, no implicit defaults.

### `EditorContent`

Thin wrapper around tiptap's `EditorContent` with the frappe-ui prose class scaffolding. Class fallthrough via Vue's normal `class=""` attribute inheritance (no `editor-class` prop).

```vue
<EditorContent :editor="editor" class="prose-sm max-w-none min-h-16" />
```

Renders a `data-slot="editor-content"` root for CSS targeting (P10).

### `EditorFixedMenu`

A toolbar row that renders a flat list of `MenuItem`s.

```ts
defineProps<{
  editor: Editor | null
  buttons: MenuItem[]
}>()
```

Sets `data-slot="fixed-menu"` on the root.

### `EditorBubbleMenu`

Tiptap bubble menu (anchored to the current selection). Same `buttons` shape. Accepts optional `options` for `shouldShow` and `tippyOptions` — covers the one insights site that needs `shouldShow` to suppress the menu inside specific node types.

```ts
defineProps<{
  editor: Editor | null
  buttons: MenuItem[]
  options?: {
    shouldShow?: (props: { editor, view, state, oldState, from, to }) => boolean
    tippyOptions?: Partial<TippyProps>
  }
}>()
```

### `EditorFloatingMenu`

Tiptap floating menu (appears at empty lines, like Notion's "+"). Same shape as `EditorBubbleMenu`.

## 3. Menu items

```ts
type CommandMenuItem = {
  icon?: Component
  label: string
  action: (editor: Editor) => void
  isActive?: (editor: Editor) => boolean
  isDisabled?: (editor: Editor) => boolean
}

type MenuGroupItem = {
  type: 'group'
  icon?: Component
  label: string
  items: CommandMenuItem[]
}

type MenuItem = CommandMenuItem | MenuGroupItem | { type: 'separator' }
```

Predefined items are typed `MenuItem` constants. Example:

```ts
export const Bold: CommandMenuItem = {
  icon: BoldIcon,
  label: 'Bold',
  action: (e) => e.chain().focus().toggleBold().run(),
  isActive: (e) => e.isActive('bold'),
}

export const HeadingGroup: MenuGroupItem = {
  type: 'group',
  label: 'Heading',
  items: [H2, H3, H4],
}

export const Separator: MenuItem = { type: 'separator' }
```

Consumer composition:

```ts
<EditorFixedMenu
  :editor="editor"
  :buttons="[Bold, Italic, Separator, HeadingGroup, Link]"
/>
```

Each predefined item assumes the corresponding extension is registered (e.g. `Bold` needs StarterKit or another extension supplying the `bold` mark). Missing extensions are consumer configuration errors. We do not do runtime `requires` checks in v1.

### Presets

```ts
export const commentToolbar: MenuItem[] = [/* curated set */]
export const articleToolbar: MenuItem[] = [/* curated set */]
export const minimalToolbar: MenuItem[] = [/* Bold, Italic, Link */]
```

Tree-shake naturally — unimported presets vanish.

## 4. Extensions

Every extension is a flat named export from `frappe-ui/editor` with our default config pre-applied. Consumers `.configure(...)` to override:

```ts
import { StarterKit, Link, Table, Image } from 'frappe-ui/editor'

useEditor({
  extensions: [
    StarterKit,                                    // headings, lists, marks
    Link,                                          // openOnClick: false (our default)
    Table, TableRow, TableCell, TableHeader,       // resizable: true, renderWrapper: true
    Image.configure({ /* per-extension overrides */ }),
  ],
})
```

Extensions split by origin:

- **Re-exports of tiptap extensions with our default config**: `StarterKit`, `Placeholder`, `Heading`, `Link`, `Code`, `CodeBlock`, `Table`*, `TaskList`*, `Typography`, `TextAlign`, `Color`, `Highlight`. Consumers who want raw tiptap behavior import from `@tiptap/extension-*` directly.
- **Frappe-custom**: `Image`, `ImageGroup`, `ImageViewer`, `Video`, `Iframe`, `Mention`, `Tag`, `Emoji`, `SlashCommands`, `Toc`, `ContentPaste`, `StyleClipboard`.
- **Helper**: `SuggestionExtension.configure(...)` — primitive for building `@` / `#` / `{{` / `:emoji:` style suggestion extensions.

```ts
const Extension = SuggestionExtension.configure<TItem>({
  name: string
  trigger: string
  items: TItem[] | ((query: string) => TItem[] | Promise<TItem[]>)
  component?: Component
  command: (props: { editor: Editor; item: TItem; range: { from: number; to: number } }) => void
})
```

Specific extension config defaults (`Table.resizable`, `Link.openOnClick`, etc.) are decided during implementation and live in the source, not this spec.

## 5. Ready-mades

Built on `useEditor` + primitives. Each is the "use this and move on" answer for a use case the audit found dominant.

Surfaces are **tentative** — frozen on the foundational decisions (slots, v-model shape, prop names) but the specific extension list and any auxiliary props per ready-made will be tuned during implementation.

### `CommentEditor`

For comment/chat composers. Audit pattern: gameplan `CommentEditor`, helpdesk `CommentTextEditor`, crm Notes/NoteModal, drive comment box. ~14 audit call sites.

```ts
const model = defineModel<string | JSONContent | null>()

defineProps<{
  format?: 'html' | 'json'
  placeholder?: string                   // reactive
  editable?: boolean                     // default true
  autofocus?: boolean
  uploadFunction?: (file: File) => Promise<UploadedFile>
  maxHeight?: string                     // CSS length; wraps content in overflow-y-auto
}>()

defineSlots<{ actions(props: { editor: Editor, isEmpty: boolean }): any }>()
defineEmits<{ change: [value: string | JSONContent | null] }>()
```

Internal layout: bubble menu (`commentToolbar`) + bottom fixed menu (`commentToolbar`); `actions` slot inline with the fixed menu inside the editor border.

### `RichTextEditor`

For article/wiki/page editors. Audit pattern: gameplan Page/ReadmeEditor/ProjectDiscussionNew, helpdesk Article/NewArticle, insights HelpDialog. Replaces v0 `TextEditor`.

```ts
const model = defineModel<string | JSONContent | null>()

defineProps<{
  // ...same props as CommentEditor, plus:
  format?: 'html' | 'json'
  placeholder?: string
  editable?: boolean
  autofocus?: boolean
  uploadFunction?: (file: File) => Promise<UploadedFile>
  maxHeight?: string
  showToolbar?: boolean                  // default true — top fixed menu visibility
}>()

defineSlots<{ actions(props: { editor: Editor, isEmpty: boolean }): any }>()
defineEmits<{ change: [value: string | JSONContent | null] }>()
```

Internal layout: top fixed menu (`articleToolbar`), bubble menu, floating menu. `actions` slot inline with the top toolbar row.

### `InlineEditor`

For inline-rich single-line fields (titles with bold/italic). No major audit usage today — greenfield. Lower priority than the other two.

```ts
const model = defineModel<string | null>()

defineProps<{
  placeholder?: string
  editable?: boolean
  autofocus?: boolean
}>()

// No actions slot, no upload, no mentions
```

Internal layout: bubble menu only (`minimalToolbar`). No fixed menu, no floating menu.

### What ready-mades do *not* expose

- **No `extensions` prop.** Consumers needing custom extensions drop to primitives. This is the firewall against ready-mades growing back into configurable monoliths.
- **No `#top` / `#bottom` / `#editor` slots.** Only `actions`. Broader layout customization → primitives.
- **No per-extension config props** (no `linkOpenOnClick`, no `tableResizable`). Our defaults are applied; if you want different defaults, use primitives.
- **No mention/tag shorthand props in the first v1 cut.** Consumers use `Mention.configure(...)`, `Tag.configure(...)`, or `SuggestionExtension.configure(...)` through primitives until those item shapes are frozen.

## 6. Content `v-model` semantics

Content is the primary value — bound via the unnamed `v-model` (P2-canonical). The `format` prop declares the shape:

```vue
<!-- HTML (default) -->
<CommentEditor v-model="html" />

<!-- JSON -->
<CommentEditor v-model="json" format="json" />
```

There is no `v-model:content`, `v-model:html`, or `v-model:json`. One v-model carries whichever format `format` declares.

A `change` event is also emitted on every content update (per P1 — name the behavior, not the binding mechanism). `v-model` is implemented with `defineModel`; `change` is a side-event for event-style consumers, not the binding mechanism.

## 7. The `actions` slot

`CommentEditor` and `RichTextEditor` expose one named slot, `actions`, rendered inline with the fixed toolbar row inside the editor's rounded border. Slot props expose what the consumer needs to wire Submit/Discard buttons:

```vue
<CommentEditor v-model="comment">
  <template #actions="{ editor, isEmpty }">
    <Button @click="discard">Discard</Button>
    <Button variant="solid" :disabled="isEmpty" @click="submit">Submit</Button>
  </template>
</CommentEditor>
```

`isEmpty` is maintained as a Vue ref and synced from `editor.isEmpty` on editor creation, updates, and transactions. `editor` is the unwrapped Editor instance (not the ref) for direct method access — same as P7 slot-prop conventions.

`InlineEditor` has no slots.

## 8. Reactivity model

| Option | Reactive? | Type | Notes |
|---|---|---|---|
| Content (`html` / `json`) | ✅ two-way | `Ref<string \| JSONContent \| null>` | The defining reactive surface |
| `editable` | ✅ | `MaybeRefOrGetter<boolean>` | Calls `editor.setEditable()` |
| Placeholder (via `Placeholder` ext) | ✅ | `MaybeRefOrGetter<string>` | Our wrapped extension watches and forces decoration refresh |
| `format` | ❌ | `'html' \| 'json'` | Construction-time. Mid-life change is undefined. |
| `autofocus` | ❌ | `boolean` | One-shot at mount |
| `uploadFunction` | ❌ | function | Construction-time; threaded to editor storage |
| `extensions` | ❌ | `Extension[]` | Construction-time. Reactive extensions = destroy + recreate; not supported. |
| Callbacks (`onUpdate`, etc.) | ❌ | functions | Captured once at construction |

Ready-mades expose `placeholder: string` as a regular Vue-reactive prop; internally they forward `() => props.placeholder` to our wrapped `Placeholder` extension.

## 9. Composing primitives — worked example

This is the canonical pattern for consumers who outgrow a ready-made:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  StarterKit, Placeholder, Link, Image, Mention,
  commentToolbar,
  type Editor,
} from 'frappe-ui/editor'

const html = ref('')
const placeholder = ref('Write a comment…')
const isEmpty = ref(true)

function syncEditorState(editor: Editor) {
  isEmpty.value = editor.isEmpty
}

const editor = useEditor({
  content: html,
  uploadFunction: uploadAttachment,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder }),
    Link,
    Image,                                         // reads uploadFunction from editor.storage
    Mention.configure({ items: users }),
  ],
  onUpdate: syncEditorState,
  onTransaction: syncEditorState,
})
</script>

<template>
  <div class="rounded border">
    <EditorContent :editor="editor" class="prose-sm max-w-none min-h-16 p-3" />
    <EditorBubbleMenu :editor="editor" :buttons="commentToolbar" />
    <div class="flex items-center justify-between border-t px-2 py-1.5">
      <EditorFixedMenu :editor="editor" :buttons="commentToolbar" />
      <div class="flex gap-2">
        <Button @click="discard">Discard</Button>
        <Button variant="solid" :disabled="isEmpty" @click="submit">Submit</Button>
      </div>
    </div>
  </div>
</template>
```

Notice: no slots, no namespaced exports, no provide/inject. Everything is a value the consumer passed in.

## 10. Headless / multi-element layouts

The audit found one site (gameplan's `NewDiscussion`) that needs the Editor instance to live in a parent composable and render `EditorContent` as a sibling of a separate `<textarea>` (for shared keyboard navigation). This is the "headless" pattern and is supported natively — `useEditor` returns the Editor ref from any composable; in templates that ref is auto-unwrapped when passed to `EditorContent`. No special opt-in.

```ts
// composable
export function useDiscussion() {
  const editor = useEditor({ ... })
  return { editor, ... }
}

// component template
<textarea @keydown.enter.prevent="editor?.commands.focus()" />
<EditorContent :editor="editor" />
```

## 11. v0 `TextEditor` deprecation

The v0 monolith ships in v1 as a deprecated alias.

- Exported from **both** `frappe-ui` (back-compat — existing imports keep working) and `frappe-ui/editor` (canonical v1 home).
- Emits a one-time `console.warn` per mount lifecycle: `"<TextEditor> is deprecated. Use <RichTextEditor> for standard rich text, or primitives from 'frappe-ui/editor' for custom editors. See <docs link>."`
- All v0 props continue to work for the deprecation window.
- Removed in v2 from both paths.

Apps migrate at their own pace during v1. The audit's migration table in [`research/11-texteditor-usage-audit.md`](./research/11-texteditor-usage-audit.md) gives per-app guidance.

## Open questions / deferred

These were called out in the grilling session and are intentionally deferred until implementation surfaces real friction:

1. **Collaboration story.** Drive composes its own Y.js + WebRTC stack on top of the primitives. Whether frappe-ui ships a `Collaboration` re-export, a recipe in docs, or nothing at all is unresolved. `useEditor` detects a `collaboration` extension and disables content binding/initial content seeding — that's the only built-in accommodation for now.
2. **Per-ready-made extension list.** The §5 tables are tentative. Final lists are settled when each ready-made is implemented and tested against migration call sites.
3. **`SlashCommands` item registry.** Insights and drive both want to register custom slash-command items. The shape will fall out of `SlashCommands.configure({ items })` during implementation; this spec doesn't pre-design it.
4. **Edge case: frappe-ui extensions used outside our `useEditor`.** Decision sketched (warn + no-op) but not implemented; revisit if real consumers hit it.
5. **Mention/tag ready-made shorthands.** v0 types accepted polymorphic shapes (`MentionSuggestionItem[] | { mentions, component }`); v1 primitives support `Mention.configure(...)` and `Tag.configure(...)`, but ready-made shorthand props are deferred until the item shapes are frozen.

## Related documents

- [`CONTEXT.md`](../CONTEXT.md) — vocabulary
- [`PHILOSOPHY.md`](../PHILOSOPHY.md) — design rules (P1–P13) this spec follows
- [`adr/0004-editor-family-primitives-and-readymades.md`](./adr/0004-editor-family-primitives-and-readymades.md) — architectural shape decision
- [`research/11-texteditor-usage-audit.md`](./research/11-texteditor-usage-audit.md) — usage data and migration impact
