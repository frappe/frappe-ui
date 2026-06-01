# TextEditor real-world usage audit

Sibling of [`09-input-components-usage-audit.md`](./09-input-components-usage-audit.md).
Surveys every real `TextEditor` call site across the Frappe app fleet to lock
down the v1 API: which props, slots, and editor commands are actually load-
bearing, where the current API forces every consumer into copy-paste, and what
should change before v1 freezes.

## Scope

- Audited app code under `~/Projects/frappe-bench/apps/`. For each app the
  `frontend/src*` or `desk/src*` trees were inspected.
- Skipped vendored copies of frappe-ui inside `*/frappe-ui/`, built bundles
  under `*/public/`, stories, tests, and `components.d.ts`.
- Apps with active TextEditor usage inspected: `gameplan`, `helpdesk`, `crm`,
  `drive`, `insights`. `slides` uses TipTap directly (own `useTextEditor`
  composable, no frappe-ui import) and is excluded. `builder` only carries a
  vendored copy of the editor (used internally) and is excluded.
- The current TextEditor source: `src/components/TextEditor/TextEditor.vue`
  and `types.ts`.

## Cross-app counts

Counts of real call sites (`<TextEditor` / `<FTextEditor` open tags) per app
and what they import from `frappe-ui`.

| App      | TextEditor sites | TextEditorFixedMenu | TextEditorContent | createSuggestionExtension | Editor wrapper file |
| -------- | ---------------- | ------------------- | ----------------- | ------------------------- | ------------------- |
| gameplan | 7                | 4                   | 1                 | 0                         | yes (`TextEditor.vue`) |
| helpdesk | 9                | 5                   | 0                 | 1                         | yes (`TextEditor.vue` + `TicketTextEditor.vue`) |
| crm      | 6                | 1                   | 0                 | 0                         | no (inlined) |
| drive    | 2                | 1                   | 0                 | 0                         | yes (`DocEditor/TextEditor.vue`) |
| insights | 5                | 0                   | 0                 | 0                         | no (inlined) |
| **TOTAL**| **~29 direct + 11 wrapper invocations** | **11** | **1** | **1** | 4 of 5 |

Bubble/floating/fixed menu *as a prop* on `<TextEditor>` is rare — `bubble-menu`
is the only one set as a prop in real apps. The fixed menu is overwhelmingly
rendered as a child of the `#bottom` or `#top` slot via `<TextEditorFixedMenu>`,
never as a prop. The floating menu is set to `true` in two gameplan sites
(`TaskDetail`, `ReadmeEditor`) and otherwise unused.

## Prop usage matrix

Real props passed in consumer code (excluding stories/tests):

| Prop                | gameplan | helpdesk | crm | drive | insights | Total sites |
| ------------------- | -------- | -------- | --- | ----- | -------- | ----------- |
| `content`           | 6        | 7        | 5   | 1     | 5        | **24**      |
| `placeholder`       | 5        | 7        | 4   | 1     | 5        | **22**      |
| `editor-class`      | 7        | 9        | 6   | 1     | 5        | **28** (essentially every site) |
| `editable`          | 4        | 6        | 2   | 1     | 0        | **13**      |
| `starterkit-options`| 1        | 2        | 1   | 0     | 0        | **4** — all to set `{ heading: { levels: [2,3,4,5,6] } }` |
| `bubble-menu`       | 4        | 2        | 2   | 1     | 1        | **10**      |
| `floating-menu`     | 2        | 0        | 0   | 0     | 0        | **2**       |
| `fixed-menu` (prop) | 0        | 0        | 0   | 0     | 0        | **0** — always rendered as slot child |
| `extensions`        | 1 (wrapper) | 3     | 0   | 1     | 1        | **6**       |
| `mentions`          | 1 (wrapper) | 1     | 0   | 1     | 0        | **3** (used by every wrapper that needs @-mentions) |
| `tags` (hashtags)   | 1        | 0        | 0   | 0     | 0        | **1**       |
| `uploadFunction`    | 0        | 3        | 0   | 1     | 0        | **4**       |
| `bubble-menu-options` | 0      | 0        | 0   | 0     | 1        | **1**       |
| `autofocus`         | 0        | 1 (in wrapper) | 0 | 0  | 0        | **1**       |
| `@change`           | 5        | 7        | 5   | 1     | 5        | **23**      |
| `@transaction`      | 0        | 0        | 0   | 1 (drive collab) | 0 | **1** |
| `@focus`/`@blur`    | 0        | 0        | 0   | 0     | 0        | **0**       |

### What every site looks like

The boilerplate is consistent enough that you can describe ~80% of usage with
one snippet:

```vue
<TextEditor
  :content="value"
  @change="value = $event"
  :placeholder="placeholder"
  :editable="editable"
  :editor-class="['prose-sm max-w-none', editable && 'min-h-[7rem]']"
  :starterkit-options="{ heading: { levels: [2, 3, 4, 5, 6] } }"
  :bubble-menu="true"
>
  <template #bottom>
    <div class="flex justify-between border-t py-2">
      <TextEditorFixedMenu :buttons="textEditorMenuButtons" />
      <div class="flex gap-2">
        <Button label="Discard" />
        <Button variant="solid" label="Submit" :disabled="isEmpty" />
      </div>
    </div>
  </template>
</TextEditor>
```

Five different copies of `textEditorMenuButtons` exist in the fleet (gameplan
`CommentEditor`, gameplan `ProjectDiscussionNew`, helpdesk `utils.ts`, crm,
drive `bubbleMenuButtons`). They are 80% identical:

```
Paragraph
[H2, H3, H4, H5, H6]
---
Bold, Italic
---
Bullet List, Numbered List
---
Align Left / Center / Right
FontColor
---
Image, Video, (Iframe), Link, Blockquote, Code, Horizontal Rule
---
[Table cluster]
```

## Slot usage

| Slot      | Sites | What's rendered |
| --------- | ----- | --------------- |
| `#bottom` | ~14   | Fixed menu + action bar (Discard/Submit), attachments, file uploader |
| `#top`    | ~5    | TO/CC/BCC email fields, user avatar, fixed menu (drive renders top instead of bottom) |
| `#editor` | ~3    | Wraps `EditorContent` to apply `max-h-[50vh] overflow-y-auto` scroll container |

Two surprises:

1. **`#editor` slot purpose is almost entirely "give me a scroll container."**
   gameplan `CommentEditor`, crm `EmailEditor`, drive `DocEditor` all override
   `#editor` only to wrap `EditorContent` in a div with `max-h-* overflow-y-auto`.
   None of them swap the editor for something else — they just need the scroll
   region to live outside the prose container so menus stay sticky.

2. **`TextEditorContent` is exported but used exactly once** —
   gameplan's `NewDiscussion/DiscussionEditor.vue` renders the title `<textarea>`
   and `<TextEditorContent :editor="editor"/>` as siblings, with the actual
   `Editor` instance created in a parent composable. This is the
   "headless / unbundled" use case: caller owns the `Editor` lifecycle.

## Editor-instance access patterns

Every wrapper exposes `editor` via `defineExpose` and consumers reach in via
template ref. Counts of distinct command calls across all five apps:

| Operation                                  | Sites | Apps |
| ------------------------------------------ | ----- | ---- |
| `editor.commands.focus()`                  | 9     | gameplan, helpdesk, drive |
| `editor.commands.clearContent(true)`       | 3     | helpdesk |
| `editor.commands.setContent(...)`          | 3     | insights, drive |
| `editor.isEmpty`                           | 6     | gameplan, helpdesk, crm |
| `editor.getHTML()`                         | 3     | gameplan, drive |
| `editor.getText()`                         | 2     | drive |
| `editor.getJSON()`                         | 2     | insights |
| `editor.chain().focus()…run()`             | many  | drive (heading toggles, set comment), every consumer that customizes a button |
| `editor.state.doc` / `editor.view`         | 3     | drive (Y.js sync, scrollParent for TOC) |
| `editor.commands.unsetComment(name)`       | 1     | drive |

Practical takeaway: the **TipTap `Editor` instance is the actual public API**.
Consumers have learned to grab it via `ref.editor` and operate on it directly.
Any v1 refactor must keep this escape hatch intact and ideally make it the
sanctioned path rather than something you have to bolt on via template ref.

## Custom extensions in the wild

Extensions consumers register via the `extensions` prop:

- helpdesk `PreserveVideoControls` — keeps `controls` attribute on `<video>` in
  rendered HTML. Used everywhere helpdesk renders a video.
- helpdesk `PreserveIds` — keeps `id="..."` on headings (for KB deep links).
- helpdesk `FieldAutocomplete` — `{{ field }}` template autocomplete (Saved
  Replies). Built on `createSuggestionExtension` from frappe-ui.
- gameplan `FloatingQuoteButton` + `RichQuoteNodeExtension` — "Quote this" UX
  for discussion replies.
- drive `FontFamily`, `CharacterCount`, `EmbedExtension`, `CollaborationCursor`,
  `Collaboration` (Y.js), `TableOfContents`, `CommentExtension`,
  `FloatingQuoteButton` — full document editor stack.
- insights `SlashCommand` (custom suggestion), `QueryEditor`, `Chart` — embeds
  query/chart blocks inside notebook prose.

Three extensions are reimplemented across apps and could be promoted:

1. **PreserveVideoControls** — helpdesk has it; everyone else with video would
   benefit. The current `VideoExtension` strips `controls`. Either ship
   controls=true by default in `VideoExtension`, or expose this as a built-in
   toggle.
2. **PreserveIds on headings** — needed by anyone exporting/deep-linking
   articles. The TOC extension already injects IDs; consumers want them
   preserved on round-trip parsing. Should be on by default for headings.
3. **CharacterCount** — drive has it; gameplan and helpdesk would want it for
   a "max length" UI affordance. Ship as an opt-in built-in.

## Pain points the current API forces

Each item below is grounded in at least one real call site.

### 1. No `v-model` for content

Every site writes `:content="x" @change="x = $event"` or routes through a
wrapper that translates to `model-value` (helpdesk `TicketTextEditor.vue`).
There are **23 `@change` handlers across the audit, zero `@focus` / `@blur`
listeners** — the only event anyone uses is content change, and it's always
two-way. The `content` prop should be a `defineModel('content')` so consumers
get `v-model:content="x"` for free, and the explicit `@change` keeps working
as an alias for compatibility with insights/notebook which want `setContent`
semantics.

### 2. The five copies of `textEditorMenuButtons`

Every "rich" comment box hand-builds the same ~30-item menu config. The button
list should be a named preset that ships from frappe-ui (`commentToolbar`,
`articleToolbar`, etc.), with `bubble-menu="comment"` / `fixed-menu="article"`
shorthand on top of the existing `boolean | array` types. The customizer can
still pass an array.

### 3. `starterkit-options` is used only to drop H1

4 of 4 sites that set `starterkit-options` set
`{ heading: { levels: [2, 3, 4, 5, 6] } }`. Replace with a dedicated
`heading-levels` prop (`number[]`, default `[1,2,3,4,5,6]`); fall back to the
escape hatch only for the rare consumer who wants finer control. The same
applies to `bulletList`, `orderedList` configuration which nobody overrides
today.

### 4. `extensions` is concat-only

The current implementation always loads image, image-group, video, iframe,
slash-commands, emoji, table, table-of-contents, mentions, tags, content-paste,
link, code-block, copy-styles, typography, text-align, text-style, named
colors, named highlight. There is **no way to disable any of these**. Drive's
DocEditor is the heaviest user — and it has to live with all of frappe-ui's
slash commands plus its own. Insights has its own slash commands and gets ours
on top.

Proposed v1 shape — split bundled extensions into named groups consumers can
opt out of:

```ts
type ExtensionGroup =
  | 'starter'      // paragraph, bold/italic/strike/code, lists, blockquote, hr
  | 'heading'
  | 'table'
  | 'link'
  | 'image'        // image + image-group + image-viewer
  | 'video'
  | 'iframe'
  | 'slashCommands'
  | 'emoji'
  | 'codeBlock'
  | 'textAlign'
  | 'color'        // named-color + named-highlight + text-style
  | 'typography'
  | 'toc'
  | 'contentPaste'

defineProps<{
  // Default: 'all' (current behavior)
  features?: ExtensionGroup[] | 'all'
  disable?: ExtensionGroup[]   // sugar: features = all minus these
  extensions?: Extension[]     // bring your own
}>()
```

Tree-shake: each built-in lives in its own entry under
`frappe-ui/text-editor/extensions/*`. When `features` excludes a group, the
import is removed. This is the "tree-shakeable" requirement — today everything
is statically imported in `TextEditor.vue` so consumers pay for everything.

### 5. Image/video upload is silently frappe-coupled

`defaultUploadFunction` calls `useFileUpload()`, which is frappe-specific.
Consumers in non-frappe contexts have to remember to pass `uploadFunction`.
Make this explicit: if no `uploadFunction` and no Frappe globals, the upload
button stays visible but errors clearly ("no upload handler configured")
instead of silently invoking a Frappe API that may not exist.

Drive's pattern — `uploadFunction` that returns `Promise<UploadedFile>` with
the file URL — is the right shape. Keep it.

### 6. `bubbleMenu` / `floatingMenu` props mix three meanings

`bubbleMenu={false}` (off), `bubbleMenu={true}` (built-in default set),
`bubbleMenu={array}` (custom). The `bubbleMenuOptions` prop sits next to it
to inject Tippy options. Cleaner v1 shape:

```ts
type MenuConfig =
  | false
  | true                                  // default preset
  | 'comment' | 'article' | 'minimal'     // named presets
  | MenuItem[]                            // explicit list
  | { items: MenuItem[]; options?: BubbleMenuOptions }
```

Same shape for fixed/floating. Drop `bubbleMenuOptions` as a top-level prop —
it's a corner case (one site, in `insights/notebook/tiptap/TipTap.vue`, which
needs `shouldShow` to suppress the menu inside `query-editor` and `chart`
nodes).

### 7. Mentions / tags / suggestion plumbing is inconsistent

Today:

- `mentions`: `MentionSuggestionItem[] | { mentions, component } | null`
- `tags`: `any[] | null`
- arbitrary suggestion extensions: must build via exported
  `createSuggestionExtension` and pass through `extensions`.

v1 should unify into a single `suggestions` prop:

```ts
defineProps<{
  suggestions?: Array<{
    trigger: string                              // '@' | '#' | '{{' | ':'
    items: SuggestionItem[] | ((q: string) => SuggestionItem[] | Promise<…>)
    component?: Component                        // custom dropdown
    insert?: (editor, item) => void              // custom insert behavior
  }>
}>()
```

This collapses `mentions`, `tags`, and `createSuggestionExtension`-driven
ones (helpdesk `{{field}}`) into one mental model. The built-in mention/tag
nodes still ship as extensions for rendering; the prop becomes the glue.

### 8. Scroll container needs are awkward via the `#editor` slot

Three consumers override `#editor` only to wrap `EditorContent` with
`max-h-* overflow-y-auto`. A `max-height` / `scroll` prop would remove this:

```vue
<TextEditor v-model:content="x" max-height="50vh" />
<!-- equivalent to wrapping EditorContent in overflow-y-auto -->
```

Keep the `#editor` slot for the genuine custom-render case (drive renders ToC
side-by-side with EditorContent), but cover the 90% case with a prop.

### 9. Wrapper proliferation = a smell

4 of 5 apps have built their own `TextEditor.vue` wrapper. The wrappers exist
to:

- Bake in the app-specific `extensions` array (helpdesk: PreserveVideoControls;
  gameplan: RichQuote; drive: collab + comments).
- Bake in the app's `mentions` data source (gameplan users + tags).
- Provide a sane `editor-class` default plus app-specific font-family logic.

The third point is the noisiest — every wrapper munges `editor-class` arrays
including conditional Tailwind. A `variant` prop on the v1 editor
(`comment` | `article` | `inline`) that ships sensible `editor-class` +
`min-h` defaults would let many wrappers disappear. The first point is
genuine extension composition — see §4 and §7.

### 10. No introspection helpers

Every consumer that wants to disable a submit button writes
`$refs.editor?.editor?.isEmpty` (or worse, a stringified-DOM check —
helpdesk `isContentEmpty()` parses the HTML with `DOMParser` to test
emptiness). The wrapper should expose:

```ts
defineExpose({
  editor,           // current — the TipTap Editor instance
  isEmpty,          // computed ref proxying editor.isEmpty
  getHTML,          // bound method
  getJSON,          // bound method
  getText,          // bound method
  focus,            // editor.commands.focus()
  clear,            // editor.commands.clearContent(true)
})
```

These are all thin wrappers — they exist purely to spare consumers a
`?.editor?.commands?.x()` chain in the template.

### 11. `setContent` overwrites in collab mode

The current watcher on `props.content` calls `editor.commands.setContent(val)`
unconditionally. Drive's Y.js workflow has to set `:content="!collab ? rawContent : undefined"`
to dodge this — pass `undefined` while collab is mounted to avoid clobbering
the shared doc. A v1 `collaboration` flag (or just docs) should make this
explicit, and the watcher should skip `setContent` when a Collaboration
extension is registered.

## Proposed v1 design — two layers

The audit makes clear that **the current `<TextEditor>` is doing two jobs at
once**: it's both the only way to get an editor up on screen, and the place
where every "smart" default lives (auto-loaded extensions, built-in menu
presets, frappe-coupled upload). That's why every app wraps it: the smart
defaults are wrong for at least one of their use cases, but you can't peel
them off.

v1 should split these into two layers:

1. **Headless primitives.** Small, unopinionated, no auto-imports, no slots
   with provide/inject, no magic. Consumer composes parts by passing the
   `Editor` instance to each part. Everything tree-shakes because every
   dependency is an explicit named import in the consumer's code.
2. **Ready-made components.** A handful of opinionated assemblies (
   `CommentEditor`, `TextEditor`, `InlineEditor`) built on the primitives, in
   frappe-ui itself, that cover ~80% of consumer needs. These are the "use
   this and move on" answer. They double as the canonical examples of how to
   compose the primitives — apps that need something different fork the
   source or write their own composition.

### Layer 1 — Headless primitives

Named exports from `frappe-ui` (or a `frappe-ui/text-editor` subpath):

```ts
// Composable — owns Editor lifecycle, handles v-model on content, guards
// setContent under Collaboration, destroys on unmount.
function useTextEditor(options: {
  content?: Ref<string> | Ref<string | null>   // bidirectional ref
  extensions: Extension[]                       // consumer-supplied, no defaults
  editable?: MaybeRefOrGetter<boolean>
  autofocus?: boolean
  onUpdate?: (editor: Editor) => void
  onFocus?: (editor: Editor, event: FocusEvent) => void
  onBlur?: (editor: Editor, event: FocusEvent) => void
  onTransaction?: (editor: Editor) => void
}): Ref<Editor | null>

// Components — each takes :editor as a required prop, nothing else implicit.
TextEditorContent      // wraps tiptap's EditorContent; applies editor-class
TextEditorFixedMenu    // toolbar; takes :buttons
TextEditorBubbleMenu   // bubble menu; takes :buttons and optional :options (shouldShow, tippy)
TextEditorFloatingMenu // floating menu; takes :buttons

// Each extension as its own named export. Consumer imports what they want.
// Configured by the consumer with .configure({...}).
Image, ImageGroup, ImageViewer
Video, Iframe
Link
Table, TableRow, TableCell, TableHeader
TaskList, TaskItem
Heading
CodeBlock, Code
Color, Highlight
Typography
TextAlign
Mention
Tag
SlashCommands
Emoji
Placeholder
Toc
ContentPaste
CopyStyles

// Helpers
createSuggestionExtension       // primitive for building @-style suggestions
                                // (mention/tag/emoji/slash all use this under the hood)

// Toolbar presets — plain arrays. If you don't import, they tree-shake away.
commentToolbar, articleToolbar, minimalToolbar
```

Consumer code in the headless model:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import {
  useTextEditor,
  TextEditorContent,
  TextEditorFixedMenu,
  TextEditorBubbleMenu,
  Image,
  Link,
  Mention,
  Placeholder,
  commentToolbar,
} from 'frappe-ui'

const content = ref('')

const editor = useTextEditor({
  content,
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
    Placeholder.configure({ placeholder: 'Write a comment...' }),
    Link,
    Image.configure({ uploadFunction: uploadAttachment }),
    Mention.configure({ items: users }),
  ],
})
</script>

<template>
  <div class="rounded border">
    <TextEditorContent :editor="editor" class="prose-sm max-w-none min-h-16" />
    <TextEditorBubbleMenu :editor="editor" :buttons="commentToolbar" />
    <div class="flex justify-between border-t px-2 py-1.5">
      <TextEditorFixedMenu :editor="editor" :buttons="commentToolbar" />
      <Button variant="solid" :disabled="editor?.isEmpty">Submit</Button>
    </div>
  </div>
</template>
```

Everything is explicit: the Editor instance, the extension list, the toolbar
layout. There are no slots, no `:bubble-menu="true"` polymorphism, no
auto-loaded image/video extensions, no `defineExpose` chains to reach the
underlying editor. The consumer's bundle contains exactly the extensions
they imported.

### Layer 2 — Ready-made components

Built on the primitives, shipped from frappe-ui. Each is ~50 lines of
straightforward composition that consumers can read, copy, and modify.

| Component        | What it composes                                                  | Use case                                  |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| `CommentEditor`  | starter + placeholder + link + image + mention + bubble + bottom fixed menu | Comments, chat, replies (gameplan/helpdesk/crm patterns) |
| `TextEditor`     | full extension set + top fixed menu + bubble menu                 | Articles, docs, wiki pages (gameplan Page, helpdesk knowledge base) |
| `InlineEditor`   | starter + bold/italic only + bubble menu, no fixed menu           | Single-line / titles with light formatting |

Each accepts the props you'd expect (`v-model:content`, `placeholder`,
`editable`, `autofocus`, `uploadFunction`, slot for action buttons), maps
them onto `useTextEditor` + the matching primitives, and stops there. No
hidden levers. If you need to drop slash-commands, you can't — you compose
your own from the primitives instead.

This is the shadcn pattern: ready-made = "starter template you can copy,"
not "configurable monolith you fight with."

### What the new shape resolves

Mapping back to the pain points above:

| Pain point | How the two-layer model resolves it |
| --- | --- |
| §1 No v-model | `useTextEditor({ content: ref })` is bidirectional by construction. |
| §2 Five copies of `textEditorMenuButtons` | `commentToolbar` / `articleToolbar` are named exports; not imported = tree-shaken. |
| §3 `starterkit-options` only used to drop H1 | Consumer passes `StarterKit.configure({ heading: { levels: ... } })` directly — no proxy prop. |
| §4 `extensions` concat-only | Consumer owns the entire extension list. No built-in defaults. |
| §5 Frappe-coupled upload | No default `uploadFunction`. Consumer wires `Image.configure({ uploadFunction })`; frappe adapter lives in `frappe-ui/frappe`. |
| §6 Menu prop polymorphism | Menus are sibling components, not props. The `boolean / true / array` mess is gone. |
| §7 Mentions / tags / suggestions inconsistent | All three are extensions you `.configure()` and pass in. `createSuggestionExtension` is the shared primitive. |
| §8 Scroll container via `#editor` slot | Consumer wraps `<TextEditorContent>` in whatever they want — `<div class="max-h-[50vh] overflow-y-auto"><TextEditorContent /></div>`. No slot needed. |
| §9 Wrapper proliferation | Wrappers become much smaller (just `useTextEditor` + a few `<TextEditorXyz>` children) and stop fighting the framework. The ready-mades absorb the most common ones. |
| §10 No introspection helpers | `editor.value?.isEmpty` is directly accessible because `editor` is *the* return value of `useTextEditor`, not buried in a template ref. |
| §11 setContent overwrites in collab mode | `useTextEditor` detects a Collaboration extension in the list and skips the content watcher. |

### Treeshaking — why this actually works

Every extension is a named ESM export with no side effects at module
evaluation time (`Extension.create({...})` produces a value; it doesn't
register anything globally). Rollup/Vite drop unused named exports cleanly.

The ready-made `CommentEditor` will of course import everything it uses —
that's the price of "convenience component." Consumers who care about bundle
size skip the ready-mades and compose primitives directly. Both options are
available, and the cost is visible in the import statements.

### Migration impact

This is a breaking change. Every existing call site will need to update.
Quantified from the audit:

| App      | Direct call sites | Wrapper files | Migration |
| -------- | ----------------- | ------------- | --------- |
| gameplan | 7                 | 1             | Wrapper rewrites to ~30 lines using primitives; call sites mostly become `<CommentEditor>` / `<TextEditor>` ready-mades. |
| helpdesk | 9                 | 2             | TextEditor.vue + TicketTextEditor.vue wrappers consolidate around primitives + `commentToolbar`. PreserveVideoControls / PreserveIds stay as local extensions in `tiptap-extensions.ts`. |
| crm      | 6                 | 0 (inlined)   | Inlined sites move to `<CommentEditor>` or compose primitives. |
| drive    | 2                 | 1             | DocEditor uses primitives directly — it already does mostly that; the value-add is dropping our auto-loaded slash-commands etc. |
| insights | 5                 | 0             | Notebook TipTap component rewires to primitives + its own slash extension. |

Migration aid: ship a one-time `<TextEditor.legacy>` (or just keep the old
component name available under an `unstable` subpath) for one minor release,
documented as deprecated. Consumers migrate at their own pace; v2 deletes it.

## Decisions locked (v1 grilling session)

The grilling session resolved the foundational shape of the v1 API. These
override the prose above where they conflict — the prose remains for the
*why*, the section below for the *what*.

### Naming and import structure

**Single subpath: `frappe-ui/editor`.** Everything editor-related —
primitives, extensions, ready-mades, the deprecated v0 alias — lives at this
one subpath. No top-level editor exports except the deprecated `TextEditor`
back-compat alias.

```ts
import {
  // Primitives (composable + components)
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  EditorFloatingMenu,
  createSuggestionExtension,

  // Extensions — flat named exports, with our default config pre-applied
  Image, Video, Mention, SlashCommands, Tag, Emoji, Iframe, Toc,
  Placeholder, Link, Table, TableRow, TableCell, TableHeader,
  TaskList, TaskItem, Color, Highlight, Heading, Code, CodeBlock,
  Typography, TextAlign, StarterKit,
  ContentPaste, StyleClipboard, ImageGroup, ImageViewer,

  // Predefined menu items (for primitives users)
  Bold, Italic, Strike, Code as CodeItem, BulletList, OrderedList,
  H1, H2, H3, H4, H5, H6, Paragraph,
  Link as LinkItem, Image as ImageItem, Separator,
  // ... full catalog ...

  // Menu presets
  commentToolbar, articleToolbar, minimalToolbar,

  // Ready-mades
  RichTextEditor, CommentEditor, InlineEditor,

  // v0 deprecated alias (also exported from top-level 'frappe-ui')
  TextEditor,
} from 'frappe-ui/editor'
```

`useEditor` shadows TipTap's own `useEditor` from `@tiptap/vue-3` —
consumers who import both alias one side. Accepted trade for the cleaner
name in the common case.

### `useEditor` signature

```ts
function useEditor(options: {
  content?: Ref<string | JSONContent | null>     // v-model two-way
  format?: 'html' | 'json'                        // default 'html', construction-time
  editable?: MaybeRefOrGetter<boolean>            // reactive — calls setEditable()
  autofocus?: boolean                             // construction-time
  uploadFunction?: (file: File) => Promise<UploadedFile>  // construction-time; threaded to Image/Video/ImageGroup/ContentPaste via editor.storage
  extensions: Extension[]                         // construction-time
  onUpdate?, onFocus?, onBlur?, onTransaction?    // construction-time
}): ShallowRef<Editor | null>
```

**Reactivity:** content, `editable`, and placeholder (via our wrapped
`Placeholder` extension which accepts `MaybeRefOrGetter<string>`) are
reactive. Everything else is construction-time.

**Upload plumbing:** `uploadFunction` lives on `useEditor` as an option.
Internally, `useEditor` writes it to `editor.storage.upload.uploadFunction`.
`Image`, `Video`, `ImageGroup`, `ContentPaste` read from there. Per-extension
override (`Image.configure({ uploadFunction })`) wins over the shared default.
Drop `uploadArgs` — consumers bake args into their function closures.

### Content shape: one `v-model`, format-tagged

Editors expose content via the unnamed `v-model` (P2-canonical — text content
is the primary value). The `format` prop ('html' | 'json', default 'html')
declares what shape the modelValue carries:

```vue
<CommentEditor v-model="html" />                    <!-- default: HTML string -->
<CommentEditor v-model="json" format="json" />      <!-- JSON object -->
```

No `v-model:content`, no `v-model:html`, no `v-model:json`. One v-model.
Format is a declared prop, not type-sniffed at runtime.

### Ready-made slots: one `actions` slot only

`CommentEditor` and `RichTextEditor` expose a single named slot, `actions`,
rendered inline with the fixed-toolbar row inside the editor's border. Slot
props: `{ editor, isEmpty }`. `InlineEditor` has no slots.

Broader layout customization (CC/BCC headers, attachment rows, custom scroll
containers) means dropping to primitives. Ready-mades stay rigid by design.

### Menu items: predefined objects + presets

Each menu item is a typed `MenuItem` object, imported by name:

```ts
type MenuItem =
  | {
      icon?: Component
      label: string
      action: (editor: Editor) => void
      isActive?: (editor: Editor) => boolean
      isDisabled?: (editor: Editor) => boolean
    }
  | MenuItem[]                        // nested array = dropdown group
  | { type: 'separator' }

// Predefined buttons:
import { Bold, Italic, H2, H3, H4, Separator, commentToolbar } from 'frappe-ui/editor'

<EditorFixedMenu :editor :buttons="[Bold, Italic, Separator, [H2, H3, H4]]" />
```

Presets (`commentToolbar`, `articleToolbar`, `minimalToolbar`) are plain
arrays of these objects. No string registry, no magic.

Coupling to extensions is the consumer's responsibility — `Bold` works only
if StarterKit (or another extension providing the `bold` mark) is registered.
Documented per button; no runtime `requires` check.

### Ready-made surfaces — *tentative, subject to change*

Frozen on the foundational decisions above; the specific extension list and
prop names for each ready-made are best-guess based on the audit and will be
refined during implementation.

| Component | Extensions (tentative) | Menus | Props (tentative) |
|---|---|---|---|
| `CommentEditor` | StarterKit (no H1), Placeholder, Link, TaskList/Item, Image+ImageGroup+Video+ContentPaste (if uploadFunction), Mention (if mentions), Tag (if tags), Emoji | bubble (`commentToolbar`) + bottom fixed (`commentToolbar`) | `v-model`, `format?`, `placeholder?`, `editable?`, `autofocus?`, `uploadFunction?`, `mentions?`, `tags?`, `maxHeight?` |
| `RichTextEditor` | CommentEditor's set + full headings, Table+rows/cells/header, Iframe, Toc, SlashCommands, StyleClipboard, Color, Highlight, Typography, TextAlign | top fixed (`articleToolbar`) + bubble + floating | CommentEditor's props + `showToolbar?` |
| `InlineEditor` | StarterKit (bold/italic/strike/code/link only — no lists, headings, blockquote, hard-break), Placeholder | bubble only (`minimalToolbar`) | `v-model`, `placeholder?`, `editable?`, `autofocus?` |

### Migration

- v0 `TextEditor` ships as a deprecated alias in v1, exported from both
  `frappe-ui` (back-compat) and `frappe-ui/editor` (canonical home). Emits a
  one-time warning per mount lifecycle pointing at `RichTextEditor`.
- Removed in v2 from both paths.

## Open questions

1. **Collaboration as a primitive vs. a recipe?** Drive needs `Collaboration`
   + `CollaborationCursor` + a Y.js provider. Three options:
   - Ship them as importable extensions from frappe-ui (pulls `yjs` / `y-prosemirror`
     into the package's optional peer deps).
   - Document a "collab recipe" in the docs site that consumers copy.
   - Leave entirely to consumer — they import tiptap's `Collaboration` extension
     and we just guarantee `useTextEditor` honors it (skip setContent watcher).
   Recommend: third option. We don't need to ship tiptap's collab extensions —
   `@tiptap/extension-collaboration` is already a public package. `useTextEditor`
   just needs to detect it and adjust behavior.

2. **Slash-commands content registry.** Insights and drive both add custom
   slash-command items. With primitives, this stops being a registry problem:
   `SlashCommands.configure({ items: [...] })` is the consumer's call. The
   *built-in* SlashCommands extension we ship can default to an empty
   item list — consumers pass theirs in.

3. **What ships in `CommentEditor` vs. `TextEditor` ready-mades?** Needs a
   product call. Proposal:
   - `CommentEditor`: StarterKit (no H1), Placeholder, Link, Image (if
     `uploadFunction` provided), Mention (if `mentions` provided), bubble
     menu = `commentToolbar`, optional bottom-bar slot for submit/discard.
   - `TextEditor`: full extension set including Table, Video, Iframe,
     SlashCommands, TaskList, TOC, Emoji. Fixed menu on top = `articleToolbar`.
   - `InlineEditor`: StarterKit minus heading/lists/etc., bubble menu only,
     `minimalToolbar`. Suitable for single-line rich titles.

4. **Headless escape hatch for the Editor itself.** Gameplan's NewDiscussion
   creates the `Editor` in a parent composable and renders `<TextEditorContent>`
   as a sibling of the title `<textarea>`. The headless model handles this
   natively — that's literally how everything works now. Worth a dedicated
   docs section ("Headless / multi-element layouts") so consumers see the
   pattern.
