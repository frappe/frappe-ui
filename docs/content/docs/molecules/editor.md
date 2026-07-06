# Editor

A TipTap-based rich text editor that lives under the `frappe-ui/editor` subpath.

It isn't one monolithic widget — it's three pieces that snap together:

- **`<Editor>`** — a renderless component that owns the editor lifecycle, `v-model`, upload, and placeholder. It renders no UI of its own; you render the chrome via its default slot, which exposes `{ editor, isEmpty }`.
- **Kits** (`CommentKit`, `RichTextKit`, `InlineKit`) — configurable bundles of extensions you pass to `:extensions`. The kit decides what the editor can do.
- **Building blocks** (`EditorContent`, `EditorFixedMenu`, `EditorBubbleMenu`, `EditorFloatingMenu`) — the UI you compose inside the slot.

The examples below are the common recipes. See [Exports](#exports) for the full surface.

## Comment editor

`CommentKit` is comment- and chat-grade: marks, lists, links, images, paste handling, emoji, and `@`/`#` suggestions. Here it's wired into a composer with a bubble menu, a bottom toolbar, and submit/discard actions. Open **View Code** to see the full layout.

<ComponentPreview name="Editor-Comment" csr="true" />

## Rich text editor

`RichTextKit` extends `CommentKit` with block-level extras — headings, tables, task lists, slash commands, color, highlight, alignment, and embeds. It suits articles, wiki pages, and notes. This recipe pairs a wrapping top toolbar with a bubble menu and a floating menu.

<ComponentPreview name="Editor-RichText" csr="true" />

## Inline editor

`InlineKit` is single-line rich text: the document holds exactly one block, so Enter is a no-op. It keeps inline marks and links but drops every block-level affordance — ideal for titles and names. It has no fixed toolbar, uploads, or actions.

<ComponentPreview name="Editor-Inline" csr="true" />

## Markdown editing

For markdown-backed content (wikis, docs sites, README editors), set `format="markdown"` — the `v-model` then carries a markdown string. The editor parses it into the document on the way in and serializes back to markdown on every update, so the rest of your app never touches HTML.

```vue
<template>
  <Editor v-model="markdown" format="markdown" :extensions="[RichTextKit, Markdown]">
    <template #default>
      <EditorContent />
    </template>
  </Editor>
</template>

<script setup>
import { ref } from 'vue'
import { Editor, EditorContent, RichTextKit, Markdown } from 'frappe-ui/editor'

const markdown = ref('# Hello\n\nSome **markdown** content.')
</script>
```

Tune the `Markdown` extension with `Markdown.configure` (marked config, list/code indentation):

```js
Markdown.configure({ markedOptions: { breaks: true } })
```

Standard nodes and marks (headings, lists, tables, task lists, code blocks, links, images) round-trip out of the box. Custom nodes participate by defining `renderMarkdown`/`parseMarkdown` in their extension — nodes without them fall back to `@tiptap/markdown`'s defaults.

## Composing primitives

When no kit-and-slot recipe fits, drop to `useEditor` and render the primitives yourself. This owns the editor instance directly — no `<Editor>` wrapper — and reads editor state (here, a live word count).

<ComponentPreview name="Editor-Primitives" csr="true" />

## Customizing size

`EditorContent` applies `prose-v3` typography by default, with a `14px` base. Every size in the scale — headings, lists, code, blockquotes — is `em`-relative to that base, so you change the whole editor's size by overriding one CSS variable, `--prose-font-size`. Line spacing (unitless `line-height`) scales with it automatically.

```vue
<!-- scale the editor to a 16px base; headings and spacing follow -->
<EditorContent class="[--prose-font-size:1rem]" />

<!-- or drive it dynamically -->
<EditorContent :style="{ '--prose-font-size': fontSize }" />
```

Reach for this instead of a font-size utility like `text-base`: a utility overwrites `prose-v3`'s `line-height` (cramping the text) and only resizes the element it's on, whereas `--prose-font-size` feeds the scale that `prose-v3` itself derives every size and line-height from.

To pick a different *named* size altogether, pass a Tailwind Typography size modifier (`prose-sm`, `prose-lg`, …) instead — `EditorContent` detects it and steps aside so the modifier governs.

## Suggestions

Build custom `@`, `#`, `/`, or `:` suggestion menus with `SuggestionExtension.configure(...)`, then pass the configured extension to a kit or to `useEditor`. The kits use this internally for `mention` (`@`) and `tag` (`#`).

```ts
import { SuggestionExtension } from 'frappe-ui/editor'

const People = SuggestionExtension.configure({
  name: 'people',
  trigger: '@',
  items: (query) => users.filter((user) => user.name.includes(query)),
  command: ({ editor, item, range }) => {
    editor.chain().focus().deleteRange(range).insertContent(item.name).run()
  },
})
```

## Exports

Everything below is importable from `frappe-ui/editor`.

```ts
import { Editor, RichTextKit, articleToolbar } from 'frappe-ui/editor'
```

### Engine & component

| Export        | What it is                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useEditor`   | Creates and owns a TipTap editor from an options object. Returns a `ShallowRef<Editor \| null>`. Reach for it when you compose primitives by hand.    |
| `Editor`  | Renderless component. Owns the editor lifecycle, `v-model`, `upload-function`, and `placeholder`; exposes `{ editor, isEmpty }` through its slot.     |

### Building-block components

| Export               | What it is                                                                              |
| -------------------- | --------------------------------------------------------------------------------------- |
| `EditorContent`      | Renders the editable surface for a given `:editor`.                                     |
| `EditorFixedMenu`    | A static toolbar row. Takes `:editor` and `:items` (a `MenuItem[]`).                    |
| `EditorBubbleMenu`   | Floating toolbar shown over the current text selection.                                 |
| `EditorFloatingMenu` | Floating toolbar shown on an empty line.                                                |

Inside `<Editor>`, `EditorContent` and the three menu components read the editor from context — the `:editor` prop is optional. Pass it explicitly only when composing primitives without `<Editor>` (see [Composing primitives](#composing-primitives)).

### Kits

Configurable extension bundles — pass one (or more) to `:extensions`. Configure or remove any member with `Kit.configure({ member: options })` or `{ member: false }`.

| Export         | What it bundles                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `CommentKit`   | StarterKit base + link, image, video, paste handling, emoji, `@` mention, `#` tag. For comments and chat.                      |
| `RichTextKit`  | Everything in `CommentKit` plus tables, task lists, iframe embeds, table of contents, slash commands, color, highlight, typography, and text alignment. |
| `InlineKit`    | Single-line document (one block, Enter disabled) with inline marks + link only. For titles and names.                          |

Option types: `CommentKitOptions`, `RichTextKitOptions`, `InlineKitOptions`.

### Extensions

Individual TipTap extensions with frappe-ui defaults already applied. Use these to assemble a custom extension list (or alongside a kit). `StarterKit` already ships `link`, `code`, and `codeBlock`, so disable them (`StarterKit.configure({ link: false })`) before adding the frappe versions to avoid duplicate-name warnings — the kits do this for you.

| Group       | Exports                                                              |
| ----------- | ------------------------------------------------------------------- |
| Base        | `StarterKit`, `Placeholder` (+ `setPlaceholder`), `Heading`, `HeadingIds` |
| Marks       | `Link`, `Code`, `TextStyle`, `Color`, `Highlight`                   |
| Blocks      | `CodeBlock`, `Table`, `TableRow`, `TableCell`, `TableHeader`, `TaskList`, `TaskItem` |
| Media       | `Image`, `ImageGroup`, `ImageViewer`, `Video`, `Iframe`             |
| Suggestions | `Mention`, `Tag`, `Emoji`, `SlashCommands`, `SuggestionExtension`   |
| Behavior    | `Typography`, `TextAlign`, `Toc`, `ContentPaste`, `StyleClipboard`  |

### Menu items

Ready-made `CommandMenuItem`s for `:items` on the menu components.

| Group   | Exports                                                                 |
| ------- | ----------------------------------------------------------------------- |
| Marks   | `Bold`, `Italic`, `Strike`, `InlineCode`                                |
| Blocks  | `Paragraph`, `H1`–`H6`, `HeadingGroup`, `BulletList`, `OrderedList`, `Blockquote` |
| Insert  | `InsertLink`, `InsertImage`, `InsertVideo`, `InsertTable`, `InsertIframe`, `HorizontalRule` |
| Color   | `FontColor`, `FontHighlight`                                            |
| Align   | `AlignLeft`, `AlignCenter`, `AlignRight`                                |
| History | `Undo`, `Redo`                                                          |
| Layout  | `Separator`                                                             |

### Toolbar presets

Pre-curated `MenuItem[]` arrays. Items whose extension isn't loaded hide themselves, so one preset adapts across kits.

| Export           | Contents                                                          |
| ---------------- | ----------------------------------------------------------------- |
| `minimalToolbar` | Bold, Italic, InsertLink                                          |
| `commentToolbar` | Bold, Italic, Strike, BulletList, OrderedList, InsertLink         |
| `articleToolbar` | HeadingGroup, marks, lists, Blockquote, InsertLink, InsertImage, InsertTable |

### Types

`Editor`, `JSONContent`, `UploadedFile`, `MenuItem`, `CommandMenuItem`, `MenuGroupItem`, `MenuActionContext`, `MentionSuggestionItem`, `TagSuggestionItem`, `SuggestionExtensionOptions`, `SuggestionRange`, and the kit option types listed above.
