# Editor

A rich text editor for comments, documents and titles, built on TipTap. Import
it from `frappe-ui/editor`.

<ComponentPreview name="Editor-Comment" csr="true" />

## Anatomy

An editor is built from three kinds of pieces:

- **`<Editor>`** creates the editor and handles `v-model`, the placeholder and
  uploads. It draws nothing itself. You put the visible parts in its default
  slot, which gives you `{ editor, isEmpty }`.
- **A kit** (`CommentKit`, `RichTextKit` or `InlineKit`) is a bundle of
  extensions that you pass to `:extensions`. The kit decides what the editor
  can do.
- **Building blocks** (`EditorContent`, the menus and `EditorDropZone`) are the
  visible parts you place in the slot.

```vue
<Editor v-model="content" :extensions="[CommentKit]">
  <EditorBubbleMenu :items="minimalToolbar" />
  <EditorContent />
  <EditorFixedMenu :items="commentToolbar" />
</Editor>
```

## Examples

### Comment editor

`CommentKit` has text formatting, lists, links, images, video, attachments,
paste handling, emoji, and `@` and `#` suggestions. The preview at the top of
this page is a comment editor: a bubble menu, a toolbar at the bottom, and
submit and discard buttons. Open its **View Code** to see the layout.

### Rich text editor

`RichTextKit` is `CommentKit` plus headings, tables, task lists, slash
commands, color, highlight, text alignment and embeds. Use it for articles,
wiki pages and notes. This example has a toolbar at the top that wraps, a
bubble menu and a floating menu.

<ComponentPreview name="Editor-RichText" csr="true" />

### Inline editor

`InlineKit` edits one line of text. The document holds one block, so Enter does
nothing. It keeps bold, italic, strike, underline, inline code and links, and
has no block formatting. Use it for titles and names.

<ComponentPreview name="Editor-Inline" csr="true" />

### Markdown editor

For content stored as markdown (wikis, docs sites, README files), set
`format="markdown"` and add the `Markdown` extension. `v-model` then holds a
markdown string. The editor parses it when it loads and writes markdown back on
every change, so your app never handles HTML.

```vue
<template>
  <Editor v-model="markdown" format="markdown" :extensions="[RichTextKit, Markdown]">
    <EditorContent />
  </Editor>
</template>

<script setup>
import { ref } from 'vue'
import { Editor, EditorContent, RichTextKit, Markdown } from 'frappe-ui/editor'

const markdown = ref('# Hello\n\nSome **markdown** content.')
</script>
```

Configure the extension with `Markdown.configure`. It takes `markedOptions`
(passed to marked) and `indentation` (for lists and code blocks):

```js
Markdown.configure({ markedOptions: { breaks: true } })
```

Headings, lists, tables, task lists, code blocks, links and images convert both
ways with no setup. A custom node converts when its extension defines
`renderMarkdown` and `parseMarkdown`. Without them, it uses the defaults of
`@tiptap/markdown`.

### Composing primitives

When no kit and slot layout fits, call `useEditor` and render the building
blocks yourself, with no `<Editor>` wrapper. You own the editor instance and
can read its state. This example shows a live word count.

<ComponentPreview name="Editor-Primitives" csr="true" />

## Behavior

### Content and `change`

`v-model` holds the content. Its type follows `format`: an HTML string
(default), a JSON document, or a markdown string. `change` fires on every edit
with the new value.

When you set `v-model` from outside, the editor replaces its content only if
the new value is different from what it holds. Your own edits coming back
through `v-model` do not reset the cursor.

### Extensions are set once

The editor reads `extensions` when it is created. Changing the array later has
no effect. To change what the editor can do, create a new editor, for example
with a `key` on `<Editor>`.

`placeholder` and `editable` are reactive.

### Configuring a kit

Configure or remove any member of a kit with `Kit.configure({ member: options })`
or `{ member: false }`. Each member is typed against the options of its
extension, so a misspelled key is a compile error.

```ts
// Add the table of contents and the format painter.
RichTextKit.configure({ toc: {}, styleClipboard: {} })

// Replace the built-in slash menu. `slashCommands: {}` keeps it.
RichTextKit.configure({ slashCommands: { items: myCommands } })

// Mention and tag items are `{ label, value }`. Extra fields reach the
// item slot unchanged.
RichTextKit.configure({
  mention: { items: [{ label: 'Jane Doe', value: 'jane@example.com' }] },
  tag: { items: [{ label: 'design', value: 'TAG-0001' }] },
})
```

### Toolbar items hide when not supported

A menu item hides itself when the extension it needs is not loaded. So one
toolbar preset works with every kit: `InsertTable` hides in a `CommentKit`
editor, where tables are off by default. Items also disable themselves when
their command cannot run, for example Undo with nothing to undo.

### Uploads

Pass `upload-function` to let people add images, videos and attachments. It
receives the `File` and must resolve with an object that has a `file_url`. A
second argument carries an abort `signal` and an `onProgress` callback, which
you can ignore.

Files dropped on the text insert at the drop point. Wrap the editor in
`EditorDropZone` to also accept drops on the toolbar and padding around it.
Those files insert at the end of the document.

### Size

`EditorContent` uses `prose-v3` typography with a `15px` base. Every size in
it (headings, lists, code, quotes) is relative to that base, so one CSS
variable, `--prose-font-size`, resizes the whole editor. Line height scales
with it.

```vue
<!-- a 16px base; headings and spacing follow -->
<EditorContent class="[--prose-font-size:1rem]" />

<!-- or set it from a value -->
<EditorContent :style="{ '--prose-font-size': fontSize }" />
```

Do not use a font size class like `text-base` for this. It overrides the line
height of `prose-v3`, which makes the text cramped, and it resizes only that
element.

To use a Tailwind Typography size instead (`prose-sm`, `prose-lg`, and so on),
put that class on `EditorContent`. It then drops `prose-v3` so your class
applies.

### Suggestions

Build your own `@`, `#`, `/` or `:` menus with `SuggestionExtension.configure()`,
then add the result to `extensions` next to a kit or in a `useEditor` list.
The `@` mentions and `#` tags in the kits are suggestion menus of the same
kind.

`allowSpaces` lets the query contain spaces. `allowedPrefixes` lists the
characters allowed right before the trigger. The default is a space, and
`null` allows any character. Kit mentions also open after brackets and quotes.

```ts
import { SuggestionExtension } from 'frappe-ui/editor'
import PeopleSuggestionList from './PeopleSuggestionList.vue'

const People = SuggestionExtension.configure({
  name: 'people',
  trigger: '@',
  items: (query) => users.filter((user) => user.name.includes(query)),
  listComponent: PeopleSuggestionList,
  command: ({ editor, item, range }) => {
    editor.chain().focus().deleteRange(range).insertContent(item.name).run()
  },
})
```

## Accessibility

### Keyboard

| Keys | Action |
| --- | --- |
| <kbd>Mod</kbd> <kbd>B</kbd> / <kbd>I</kbd> / <kbd>U</kbd> | Bold, italic, underline. |
| <kbd>Mod</kbd> <kbd>Shift</kbd> <kbd>S</kbd> | Strikethrough. |
| <kbd>Mod</kbd> <kbd>K</kbd> | Opens the link editor. The key does not reach app shortcuts, such as a command palette. |
| <kbd>Mod</kbd> <kbd>Z</kbd> / <kbd>Mod</kbd> <kbd>Shift</kbd> <kbd>Z</kbd> | Undo, redo. |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>Enter</kbd> | Move through and pick from an open suggestion menu. |
| <kbd>Escape</kbd> | Closes a suggestion menu. Stops the format painter. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> <kbd>Tab</kbd> | In a code block, indent and dedent. In a table, move to the next or previous cell. |
| <kbd>Mod</kbd> <kbd>Shift</kbd> <kbd>G</kbd> | Groups the selected images. |

In a table, arrow keys move between cells when a whole cell is selected. Enter
starts editing the cell, and Enter or Escape stops editing it. At the top or
bottom edge, the arrow keys leave the table. <kbd>Mod</kbd> <kbd>A</kbd>
selects the cell, then the table, then the document.

### Screen readers

Toolbar buttons have an accessible name from the item's label, and a tooltip
with the same text. Active formatting, such as bold at the cursor, is shown with
`aria-pressed`.

## API Reference

Everything below is imported from `frappe-ui/editor`.

### Editor

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` | `string \| JSONContent \| null` | | The content, in the shape `format` sets. |
| `extensions` | `Extensions` | required | Every extension the editor loads. Include a kit. Read once. |
| `format` | `'html' \| 'json' \| 'markdown'` | `'html'` | The shape of `v-model`. `'markdown'` needs the `Markdown` extension. |
| `placeholder` | `string` | | Text shown while the editor is empty. Reactive. |
| `editable` | `boolean` | `true` | Set to `false` for read-only. Reactive. |
| `autofocus` | `boolean` | `false` | Focuses the editor when it mounts. |
| `upload-function` | `UploadFunction` | | Uploads a file and resolves with `{ file_url }`. |

| Event | Payload | Description |
| --- | --- | --- |
| `change` | `value` | Fires on every edit with the new content. |
| `focus` | `FocusEvent` | The editor gained focus. |
| `blur` | `FocusEvent` | The editor lost focus. |
| `transaction` | `editor` | Fires on every editor transaction, including selection changes. |

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ editor, isEmpty }` | The editor's layout. |

A template ref exposes `editor` and `isEmpty`.

### useEditor

`useEditor(options)` creates a TipTap editor and returns a
`ShallowRef<TiptapEditor | null>`. It destroys the editor on unmount. Options:
`content` (a `Ref`, two-way), `extensions` (required), `format`, `editable`
(reactive), `autofocus`, `uploadFunction`, and the `onUpdate`, `onFocus`,
`onBlur` and `onTransaction` callbacks.

### Building blocks

Inside `<Editor>`, these read the editor from context, so `:editor` is
optional. Pass it when you [compose primitives](#composing-primitives).

| Export | Props | Description |
| --- | --- | --- |
| `EditorContent` | `editor?` | The editable text area. |
| `EditorFixedMenu` | `editor?`, `items`, `size?` (`xs` or `sm`) | A toolbar row that stays in place. |
| `EditorBubbleMenu` | `editor?`, `items`, `options?` | A toolbar shown over selected text. |
| `EditorFloatingMenu` | `editor?`, `items`, `options?` | A toolbar shown on an empty line. |
| `EditorTableMenu` | `editor?` | Table controls shown above the table while the cursor is in it. Hidden in editors without tables. |
| `EditorDropZone` | `editor` (required), `disabled?`, `label?` | Accepts dropped files anywhere over what it wraps. `#overlay` slot replaces the drop hint. |

`options` on the bubble and floating menus sets `side`, `align`, `strategy`,
`offset`, `flip`, `shift` and `shouldShow` (type `EditorMenuOptions`).

### Kits

| Export | What it bundles |
| --- | --- |
| `CommentKit` | StarterKit base, heading, placeholder, link, image, image group, image viewer, video, attachment, paste handling, emoji, `@` mention, `#` tag. Tables are off; add `table: {}`. |
| `RichTextKit` | Everything in `CommentKit`, plus tables, task lists, iframe embeds, slash commands, color, highlight, typography and text alignment. `toc` and `styleClipboard` are off; add `toc: {}` or `styleClipboard: {}`. |
| `InlineKit` | A one-line document with bold, italic, strike, underline, inline code, placeholder and link. |

Option types: `CommentKitOptions`, `RichTextKitOptions`, `InlineKitOptions`,
`InlineStarterKitOptions`.

### Extensions

Single TipTap extensions with frappe-ui defaults. Use them to build your own
extension list, or next to a kit. `StarterKit` has no `link`, `code` or
`codeBlock` member, so you can add the frappe `Link`, `Code` and `CodeBlock`
next to it without a duplicate-name warning.

| Group | Exports |
| --- | --- |
| Base | `StarterKit`, `Placeholder` (+ `setPlaceholder`), `Heading`, `HeadingIds`, `EditorDropcursor`, `Markdown` |
| Marks | `Link`, `Code`, `TextStyle`, `Color`, `Highlight` |
| Blocks | `CodeBlock`, `TaskList`, `TaskItem` |
| Tables | `Table`, `TableRow`, `TableCell`, `TableHeader`, `TableNavigation`, `TableCellColor`, `TableSelectionOverlay` |
| Media | `Image`, `ImageGroup`, `ImageViewer`, `Video`, `Attachment`, `MediaDrop`, `Iframe` |
| Suggestions | `Mention`, `Tag`, `Emoji`, `SlashCommands`, `SuggestionExtension` |
| Behavior | `Typography`, `TextAlign`, `Toc`, `ContentPaste`, `StyleClipboard`, `ListJoin` |

### Menu items

Ready-made `CommandMenuItem`s for the `items` prop of the menus.

| Group | Exports |
| --- | --- |
| Marks | `Bold`, `Italic`, `Strike`, `InlineCode` |
| Blocks | `Paragraph`, `H1`–`H6`, `HeadingGroup`, `BulletList`, `OrderedList`, `Blockquote` |
| Insert | `InsertLink`, `InsertImage`, `InsertVideo`, `InsertAttachment`, `InsertTable`, `InsertIframe`, `HorizontalRule` |
| Color | `FontColor`, `FontHighlight` |
| Align | `AlignLeft`, `AlignCenter`, `AlignRight` |
| History | `Undo`, `Redo` |
| Table | `TableAddColumnBefore`, `TableAddColumnAfter`, `TableDeleteColumn`, `TableAddRowBefore`, `TableAddRowAfter`, `TableDeleteRow`, `TableToggleHeaderRow`, `TableMergeOrSplit`, `TableDelete`, `CellColor` |
| Layout | `Separator` |

### Toolbar presets

Ready-made `MenuItem[]` lists.

| Export | Contents |
| --- | --- |
| `minimalToolbar` | Bold, Italic, InsertLink |
| `commentToolbar` | Bold, Italic, Strike, BulletList, OrderedList, InsertLink |
| `articleToolbar` | HeadingGroup, marks, lists, Blockquote, InsertLink, InsertImage, InsertTable |
| `tableToolbar` | Column and row insert and delete, header row, merge or split, cell color, delete table |

### Types

`TiptapEditor` (the editor instance), `JSONContent`, `UploadedMedia`,
`UploadFunction`, `MediaUploadProgress`, `MediaUploadRequestOptions`,
`MenuItem`, `CommandMenuItem`, `MenuGroupItem`, `MenuActionContext`,
`EditorMenuOptions`, `EditorMenuShouldShowContext`, `MentionSuggestionItem`,
`TagSuggestionItem`, `SuggestionExtensionOptions`, `SuggestionRange`,
`StarterKitOptions`, `CommandItem`, `SlashCommandsOptions`,
`MarkdownExtensionOptions`, and the kit option types above.

<style scoped>
/* One width for every table's first column, so the columns line up down the page. */
th:first-child,
td:first-child {
  width: 11rem;
}
</style>
