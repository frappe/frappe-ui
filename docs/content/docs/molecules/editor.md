# Editor

The editor family lives under the `frappe-ui/editor` subpath. Use ready-made editors for common cases, or compose primitives when you need a custom layout.

## Comment editor

For comments and chat composers. It includes a bubble menu, a bottom toolbar, upload plumbing, and an `actions` slot for submit/discard buttons.

<ComponentPreview name="Editor-Comment" csr="true" />

```vue
<script setup>
import { ref } from 'vue'
import { CommentEditor } from 'frappe-ui/editor'

const comment = ref('')
</script>

<template>
  <CommentEditor v-model="comment" placeholder="Write a comment…" />
</template>
```

## Rich text editor

For articles, wiki pages, notes, and other long-form content. It includes a top toolbar, bubble menu, and floating menu.

<ComponentPreview name="Editor-RichText" csr="true" />

## Inline editor

For lightweight inline rich text. It has no fixed toolbar, uploads, or actions slot.

<ComponentPreview name="Editor-Inline" csr="true" />

## Composing primitives

Use `useEditor`, `EditorContent`, and menu primitives directly when the ready-made layout does not fit.

<ComponentPreview name="Editor-Primitives" csr="true" />

```vue
<script setup>
import { ref } from 'vue'
import {
  useEditor,
  EditorContent,
  EditorFixedMenu,
  StarterKit,
  Placeholder,
  Link,
  minimalToolbar,
} from 'frappe-ui/editor'

const html = ref('<p>Hello</p>')
const editor = useEditor({
  content: html,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: 'Write something…' }),
    Link,
  ],
})
</script>

<template>
  <div class="rounded border">
    <EditorContent :editor="editor" class="min-h-24 p-3 prose-sm" />
    <EditorFixedMenu :editor="editor" :buttons="minimalToolbar" />
  </div>
</template>
```

## Suggestions

Build custom `@`, `#`, `/`, or `:` suggestion extensions with `SuggestionExtension.configure(...)`, then pass the configured extension to `useEditor`.

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

## Import surface

```ts
import {
  RichTextEditor,
  CommentEditor,
  InlineEditor,
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  EditorFloatingMenu,
  StarterKit,
  Placeholder,
  Link,
  Image,
  SuggestionExtension,
  commentToolbar,
  articleToolbar,
  minimalToolbar,
} from 'frappe-ui/editor'
```
