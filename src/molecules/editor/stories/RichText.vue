<script setup>
import { ref } from 'vue'
import {
  Editor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  EditorFloatingMenu,
  RichTextKit,
  HeadingGroup,
  Separator,
  Bold,
  Italic,
  Strike,
  FontColor,
  FontHighlight,
  BulletList,
  OrderedList,
  Blockquote,
  InsertLink,
  InsertImage,
  InsertTable,
  InsertIframe,
  HorizontalRule,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'frappe-ui/editor'

const people = [
  { id: 'sarah', label: 'Sarah Chen' },
  { id: 'faris', label: 'Faris Ansari' },
  { id: 'maria', label: 'Maria Garcia' },
]

const tags = [
  { id: 'onboarding', label: 'onboarding' },
  { id: 'billing', label: 'billing' },
]

const extensions = [
  RichTextKit.configure({
    mention: { items: people },
    tag: { items: tags },
  }),
]

const toolbar = [
  HeadingGroup,
  Separator,
  Bold,
  Italic,
  Strike,
  FontColor,
  FontHighlight,
  Separator,
  BulletList,
  OrderedList,
  Blockquote,
  Separator,
  InsertLink,
  InsertImage,
  InsertTable,
  InsertIframe,
  HorizontalRule,
]

const bubbleToolbar = [
  Bold,
  Italic,
  Strike,
  InsertLink,
  Separator,
  AlignLeft,
  AlignCenter,
  AlignRight,
]

const content = ref(`
  <h2>Onboarding playbook</h2>
  <p>Use this guide to take a new customer from signup to their first win. Type <code>/</code> for blocks, <code>@</code> to mention a teammate, and <code>#</code> to tag.</p>
  <blockquote><p>Rule of thumb: if the customer is blocked on setup, reply within one business hour.</p></blockquote>
  <h3>First-week checklist</h3>
  <ul>
    <li><p>Confirm the workspace owner accepted the invite.</p></li>
    <li><p>Walk through the import flow together.</p></li>
    <li><p>Share the escalation matrix below.</p></li>
  </ul>
  <h3>Escalation matrix</h3>
  <table><tbody>
    <tr><th><p>Signal</p></th><th><p>Owner</p></th></tr>
    <tr><td><p>Billing mismatch</p></td><td><p>Finance Ops</p></td></tr>
    <tr><td><p>SSO setup</p></td><td><p>Success Engineer</p></td></tr>
  </tbody></table>
`)

// Demo-only: turns dropped/pasted files into local object URLs. Real apps return
// a persisted URL from their upload endpoint.
const uploadFunction = async (file) => ({
  file_url: URL.createObjectURL(file),
  file_name: file.name,
})
</script>

<template>
  <div class="w-full max-w-3xl">
    <Editor
      v-model="content"
      :extensions="extensions"
      :upload-function="uploadFunction"
      placeholder="Write something…"
    >
      <template #default>
        <!-- Inside <Editor>, the building blocks read the editor from
             context — no :editor prop needed. -->
        <div
          class="overflow-hidden rounded-lg border border-outline-gray-2 bg-surface-white"
        >
          <EditorBubbleMenu :items="bubbleToolbar" />
          <EditorFloatingMenu :items="toolbar" />
          <div class="border-b border-outline-gray-1 px-2 py-1.5">
            <EditorFixedMenu :items="toolbar" class="flex-wrap" />
          </div>
          <EditorContent class="min-h-96 px-5 py-4 text-ink-gray-8" />
        </div>
      </template>
    </Editor>
  </div>
</template>
