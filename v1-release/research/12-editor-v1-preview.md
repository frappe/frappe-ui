# Editor v1 — preview in real app code

> **⚠️ Superseded.** This preview was written against an earlier draft (headless
> primitives + shipped ready-mades such as `RichTextEditor` / `CommentEditor`).
> The accepted v1 design is **one `<TextEditor>` + kits, with no ready-mades** —
> apps build their own editor component on `<TextEditor>`. See
> [`spec/editor.md`](../../spec/editor.md) and
> [`spec/adr/0004-editor-family-composition-model.md`](../../spec/adr/0004-editor-family-composition-model.md).
> The scenarios below are kept for historical context and need rewriting against the new API.

Four scenarios from the [audit](./11-texteditor-usage-audit.md) rewritten against the v1 API.
Demonstrates the two-layer split: ready-mades for the common shapes, primitives when
the layout is bespoke.

See [`../../spec/adr/0004-editor-family-composition-model.md`](../../spec/adr/0004-editor-family-composition-model.md) for the architectural decision and [`11-texteditor-usage-audit.md` § "Decisions locked"](./11-texteditor-usage-audit.md#decisions-locked-v1-grilling-session) for the prescriptive design these examples assume.

---

## 1. Comment box — `CommentEditor` ready-made

Replaces gameplan's `CommentEditor.vue` (~110 lines today, full of `textEditorMenuButtons` arrays and slot wiring).

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { CommentEditor } from 'frappe-ui/editor'
import { Button } from 'frappe-ui'
import { activeUsers } from '@/data/users'
import { uploadAttachment } from '@/utils'

const props = defineProps<{ placeholder?: string }>()
const emit = defineEmits<{ submit: [html: string]; discard: [] }>()

const content = ref('')
const submitting = ref(false)

const mentions = computed(() =>
  activeUsers.value.map((u) => ({ label: u.full_name, value: u.name })),
)

async function submit() {
  submitting.value = true
  try {
    await api.createComment(content.value)
    emit('submit', content.value)
    content.value = ''
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <CommentEditor
    v-model="content"
    :placeholder="placeholder"
    :upload-function="uploadAttachment"
    :mentions="mentions"
    max-height="50vh"
  >
    <template #actions="{ isEmpty }">
      <Button label="Discard" @click="$emit('discard')" />
      <Button
        variant="solid"
        label="Submit"
        :disabled="isEmpty"
        :loading="submitting"
        @click="submit"
      />
    </template>
  </CommentEditor>
</template>
```

**What's gone vs. today:**

- The 30-item `textEditorMenuButtons` array (baked into `CommentEditor` as `commentToolbar`).
- The `#bottom` slot with hand-laid-out flex containers (replaced by the single `actions` slot rendered inline with the toolbar).
- The template ref to reach `editor.isEmpty` (slot prop).
- The app-wrapper file just to pass `:mentions` and custom extensions (`:mentions` is now a flat prop).

---

## 2. Article editor — `RichTextEditor` with autosave

Replaces gameplan's `Page.vue` (page body, not the chrome).

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { RichTextEditor } from 'frappe-ui/editor'
import { debounce, useDoc } from 'frappe-ui'

const props = defineProps<{ pageId: string }>()

const page = useDoc({ doctype: 'GP Page', name: () => props.pageId })
const title = ref('')
const content = ref('')

page.onSuccess((doc) => {
  title.value = doc.title || ''
  content.value = doc.content || ''
})

const save = debounce(() => {
  page.setValue.submit({ title: title.value, content: content.value })
}, 1000)

watch([title, content], save)
</script>

<template>
  <div class="mx-auto max-w-3xl px-8 py-6">
    <input
      v-model="title"
      class="w-full border-0 text-3xl font-semibold focus:ring-0"
      placeholder="Title"
    />
    <RichTextEditor
      v-model="content"
      placeholder="Start writing here…"
      :upload-function="uploadAttachment"
      class="mt-4"
    />
  </div>
</template>
```

**What's gone vs. today:**

- The bespoke `editor-class="rounded-b-lg max-w-[unset] prose-v3 pb-[50vh] md:px-[70px]"` (the ready-made carries article defaults).
- The manual `:bubbleMenu="true"`.
- The `useTemplateRef('textEditor')` reach-in for `editor.commands.focus()` — `<input>` and `<RichTextEditor>` are now siblings, focus moves cleanly via `Tab`.

---

## 3. Drive document — full primitives composition with Y.js collab

The complex case. Drive owns its `Editor` instance, mixes our extensions with tiptap's `Collaboration` + `CollaborationCursor`, and renders a side-by-side Table of Contents.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import TableOfContents, { getHierarchicalIndexes } from '@tiptap/extension-table-of-contents'

import {
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  StarterKit, Placeholder, Link,
  Image, Video, Iframe, Table, TableRow, TableCell, TableHeader,
  SlashCommands, Mention,
  articleToolbar,
} from 'frappe-ui/editor'

import { uploadEmbed } from '@/api'
import FloatingComments from './FloatingComments.vue'
import ToC from './ToC.vue'

const props = defineProps<{ entity: Entity; users: User[] }>()

const doc = new Y.Doc({ gc: false })
const provider = new WebrtcProvider('fdoc-' + props.entity.name, doc, {
  signaling: ['wss://signal.frappe.cloud'],
})
const anchors = ref<TocAnchor[]>([])

// No `content` ref — collab editor reads from the Y.Doc.
const editor = useEditor({
  uploadFunction: uploadEmbed,
  editable: () => props.entity.editable,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: 'Start writing here…' }),
    Link, Image, Video, Iframe,
    Table, TableRow, TableCell, TableHeader,
    SlashCommands,
    Mention.configure({ items: props.users }),
    Collaboration.configure({ document: doc, field: 'default' }),
    CollaborationCursor.configure({
      provider,
      user: { name: currentUser.full_name, color: getColor() },
    }),
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate: (val) => (anchors.value = val),
    }),
  ],
})
</script>

<template>
  <div class="flex h-full flex-col">
    <EditorFixedMenu
      :editor
      :buttons="articleToolbar"
      class="shrink-0 border-b px-4 py-2"
    />
    <div class="flex flex-1 overflow-hidden">
      <EditorContent
        :editor
        class="prose-sm mx-auto flex-1 overflow-y-auto px-12 py-6"
      />
      <ToC v-if="anchors.length > 1" :editor :anchors />
    </div>
    <EditorBubbleMenu :editor :buttons="articleToolbar" />
    <FloatingComments :editor :entity />
  </div>
</template>
```

**Notice:**

- **No content `v-model`.** `useEditor` sees a `Collaboration` extension in the list and skips the setContent watcher; the Y.Doc is the source of truth. Drive stops writing `:content="!collab ? rawContent : undefined"` workarounds.
- **The extension list is the whole story.** Frappe-ui extensions (`Image`, `Video`, `SlashCommands`, `Mention`) and raw tiptap extensions (`Collaboration`, `CollaborationCursor`, `TableOfContents`) sit side by side in one array — no layering, no wrappers.
- **Layout in the template.** Toolbar above, ToC sibling to content, FloatingComments overlay — visible in 20 lines of markup.

---

## 4. Helpdesk EmailEditor — primitives with custom layout

The CC/BCC/attachments header doesn't fit `CommentEditor`'s rigid layout, so helpdesk drops to primitives.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  useEditor,
  EditorContent,
  EditorFixedMenu,
  StarterKit, Placeholder, Link,
  Image, Video, ContentPaste,
  commentToolbar,
} from 'frappe-ui/editor'
import { PreserveVideoControls } from '@/tiptap-extensions'  // helpdesk-local
import { uploadFunction } from '@/utils'
import { Button, FileUploader } from 'frappe-ui'
import MultiSelectInput from '@/components/MultiSelectInput.vue'
import AttachmentItem from '@/components/AttachmentItem.vue'

const props = defineProps<{ ticketId: string; placeholder: string }>()
const emit = defineEmits<{
  send: [{ html: string; to: string[]; attachments: File[] }]
}>()

const html = ref('')
const toEmails = ref<string[]>([])
const ccEmails = ref<string[]>([])
const showCc = ref(false)
const attachments = ref<File[]>([])

const editor = useEditor({
  content: html,
  uploadFunction: (file) => uploadFunction(file, 'HD Ticket', props.ticketId),
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
    Placeholder.configure({ placeholder: props.placeholder }),
    Link, Image, Video, ContentPaste,
    PreserveVideoControls,    // helpdesk's local extension
  ],
})

const sending = ref(false)
async function send() {
  sending.value = true
  try {
    await emit('send', {
      html: html.value,
      to: toEmails.value,
      attachments: attachments.value,
    })
    editor.value?.commands.clearContent(true)
    attachments.value = []
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border">
    <!-- TO / CC headers (the part that doesn't fit a ready-made) -->
    <div class="flex items-center gap-2 border-b px-10 py-2.5">
      <span class="text-xs text-gray-500">TO:</span>
      <MultiSelectInput v-model="toEmails" class="flex-1" />
      <Button
        label="CC"
        :class="showCc && 'bg-gray-300'"
        @click="showCc = !showCc"
      />
    </div>
    <div v-if="showCc" class="flex items-center gap-2 border-b px-10 py-2.5">
      <span class="text-xs text-gray-500">CC:</span>
      <MultiSelectInput v-model="ccEmails" class="flex-1" />
    </div>

    <EditorContent
      :editor
      class="prose-sm mx-10 my-3 min-h-28 max-h-[35vh] overflow-y-auto"
    />

    <!-- Attachments + toolbar + send -->
    <div class="flex flex-wrap gap-2 px-10">
      <AttachmentItem
        v-for="a in attachments"
        :key="a.file_url"
        :label="a.file_name"
      />
    </div>
    <div class="flex items-center justify-between border-t px-10 py-2.5">
      <div class="flex items-center gap-2">
        <FileUploader
          :upload-args="{ doctype: 'HD Ticket', docname: ticketId, private: true }"
          @success="(f) => attachments.push(f)"
        />
        <EditorFixedMenu :editor :buttons="commentToolbar" />
      </div>
      <Button
        variant="solid"
        label="Send"
        :loading="sending"
        :disabled="!editor || editor.isEmpty"
        @click="send"
      />
    </div>
  </div>
</template>
```

**Notice:**

- Layout decisions (where TO/CC sit, how attachments stack) are all in the template — no `#top` / `#bottom` slot dance.
- `editor.value?.isEmpty` reads directly off the `useEditor` return value; no template ref chains.
- The helpdesk-local `PreserveVideoControls` extension drops into the extension array unmodified — no special path for "custom" extensions.

---

## Summary

| Scenario | Layer | Lines (before → after) | Why |
|---|---|---|---|
| Gameplan comment box | ready-made `CommentEditor` | ~110 → ~40 | Fits the dominant shape; no layout customization needed beyond `actions` slot |
| Gameplan Page article | ready-made `RichTextEditor` | ~70 → ~25 | Same as above; title + editor sibling |
| Drive document w/ collab | primitives `useEditor` + parts | ~600 → similar shape, but no wrapper fighting frappe-ui defaults | Bespoke layout (ToC side-pane), bespoke extensions (Y.js, TableOfContents); ready-mades don't fit |
| Helpdesk EmailEditor | primitives `useEditor` + parts | ~250 → ~80 | Bespoke layout (TO/CC/BCC headers); doesn't fit `CommentEditor` |

The pattern that emerges: **when the layout matches a known shape, use the ready-made; when it doesn't, drop one layer down and compose.** No middle "wrapper that fights frappe-ui defaults" tier — that's the layer the v1 design deletes.

---

## 5. Building a ready-made — `RichTextEditor.vue` source

This is what frappe-ui ships as `RichTextEditor`. It's also the canonical worked example consumers fork when they need a custom assembly — a different toolbar layout, a different extension set, a different border style.

The whole thing is one file. Read it top to bottom.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Editor, JSONContent } from '@tiptap/core'
import {
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  EditorFloatingMenu,
  StarterKit, Placeholder, Link,
  Image, ImageGroup, Video, ContentPaste, StyleClipboard,
  TaskList, TaskItem,
  Table, TableRow, TableCell, TableHeader,
  Iframe, Toc, SlashCommands, Emoji,
  Color, Highlight, Typography, TextAlign,
  Mention, Tag,
  articleToolbar,
  type MentionItem,
  type TagItem,
  type UploadedFile,
} from 'frappe-ui/editor'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    format?: 'html' | 'json'
    editable?: boolean
    autofocus?: boolean
    uploadFunction?: (file: File) => Promise<UploadedFile>
    mentions?: MentionItem[]
    tags?: TagItem[]
    maxHeight?: string
    showToolbar?: boolean
  }>(),
  {
    format: 'html',
    editable: true,
    autofocus: false,
    showToolbar: true,
  },
)

const content = defineModel<string | JSONContent | null>()

defineSlots<{
  actions(slotProps: { editor: Editor | null; isEmpty: boolean }): any
}>()

const editor = useEditor({
  content,
  format: props.format,
  editable: () => props.editable,
  autofocus: props.autofocus,
  uploadFunction: props.uploadFunction,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: () => props.placeholder ?? '' }),
    Link,
    TaskList, TaskItem,
    Image, ImageGroup, Video, ContentPaste, StyleClipboard,
    Table, TableRow, TableCell, TableHeader,
    Iframe, Toc,
    SlashCommands, Emoji,
    Color, Highlight, Typography, TextAlign,
    ...(props.mentions ? [Mention.configure({ items: props.mentions })] : []),
    ...(props.tags ? [Tag.configure({ items: props.tags })] : []),
  ],
})

const isEmpty = computed(() => editor.value?.isEmpty ?? true)
</script>

<template>
  <div class="rounded-lg border border-outline-gray-2">
    <div
      v-if="showToolbar"
      class="flex items-center justify-between border-b border-outline-gray-2 px-2 py-1.5"
    >
      <EditorFixedMenu
        :editor
        :buttons="articleToolbar"
        class="overflow-x-auto"
      />
      <div class="flex shrink-0 items-center gap-2">
        <slot name="actions" :editor :is-empty="isEmpty" />
      </div>
    </div>
    <div :style="maxHeight ? { maxHeight, overflowY: 'auto' } : undefined">
      <EditorContent :editor class="prose prose-sm max-w-none px-4 py-3" />
    </div>
    <EditorBubbleMenu :editor :buttons="articleToolbar" />
    <EditorFloatingMenu :editor :buttons="articleToolbar" />
  </div>
</template>
```

### What this demonstrates

- **No hidden plumbing.** Every behavior — what extensions load, where the toolbar sits, what's inside the border — is visible in this file. No provide/inject, no internal "feature flag" branching, no monolith config blob.
- **Conditional extensions are arithmetic.** `mentions` and `tags` join the array via spread; no `mentions: prop ? value : undefined` config-blob threading.
- **Reactive props are explicit.** `editable` passes as a getter (`() => props.editable`); `placeholder` passes as a getter; `content` is `defineModel`'s ref. Each reactive surface is one line.
- **The shape of `useEditor` is the shape of the composition.** Anyone who reads this file once knows how to write `EmailEditor`, `KnowledgeBaseEditor`, or any other consumer assembly.

### How a consumer would fork it

Suppose helpdesk wants a `KnowledgeBaseEditor` — same shape as `RichTextEditor` but with `PreserveIds` (their custom heading-id-preserving extension) and a custom button in the toolbar. They copy this file into their repo, rename, and:

```diff
+ import { PreserveIds } from '@/tiptap-extensions'
+ import { CustomFieldButton } from './buttons'

  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: () => props.placeholder ?? '' }),
    Link,
    // ...
+   PreserveIds,
  ],

  <EditorFixedMenu
    :editor
-   :buttons="articleToolbar"
+   :buttons="[...articleToolbar, CustomFieldButton]"
    class="overflow-x-auto"
  />
```

Two diffs, no inheritance, no override hooks. The fork *is* the customization mechanism — same model as shadcn-vue.
