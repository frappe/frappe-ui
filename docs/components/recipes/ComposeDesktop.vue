<script setup>
import { ref } from 'vue'
import { useTextareaAutosize } from '@vueuse/core'
import {
  Breadcrumbs,
  Button,
  DesktopShell,
  PageHeader,
  PageHeaderBase,
} from 'frappe-ui'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Blockquote,
  Bold,
  BulletList,
  Editor,
  EditorContent,
  EditorFixedMenu,
  FontColor,
  H2,
  H3,
  H4,
  HorizontalRule,
  InlineCode,
  InsertImage,
  InsertLink,
  InsertTable,
  InsertVideo,
  Italic,
  OrderedList,
  Paragraph,
  Redo,
  RichTextKit,
  Separator,
  Strike,
  Undo,
} from 'frappe-ui/editor'

const people = [
  { id: 'evan', label: 'Evan You' },
  { id: 'priya', label: 'Priya Nair' },
  { id: 'sam', label: 'Sam Rivera' },
  { id: 'ana', label: 'Ana Costa' },
]

const extensions = [RichTextKit.configure({ mention: { items: people } })]

// The rich-text compose toolbar, item for item.
const toolbar = [
  Paragraph,
  H2,
  H3,
  H4,
  Separator,
  Bold,
  Italic,
  Strike,
  Separator,
  BulletList,
  OrderedList,
  Separator,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FontColor,
  Separator,
  InsertImage,
  InsertVideo,
  InsertLink,
  Blockquote,
  InlineCode,
  HorizontalRule,
  Separator,
  InsertTable,
  Separator,
  Undo,
  Redo,
]

const title = ref('Design review: new onboarding flow')
const content = ref(`
  <p>I went through the latest onboarding prototype this morning and left inline comments in Figma. It is close to shippable. The new checklist makes the first run much clearer than the old three-step wizard, and the empty states no longer look broken when someone skips a step.</p>
  <p>Here is a walkthrough of what I saw, plus a few things we need to decide before this ships.</p>
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&amp;fit=crop&amp;w=1200&amp;q=80" alt="First-run screen with the new setup checklist" />
  <p>The new first-run screen. The checklist on the right replaces the old modal wizard.</p>
  <h2>What works well</h2>
  <ul>
    <li><p>The progress bar shows how many steps are left, so nobody feels stuck.</p></li>
    <li><p>Skipping a step now lands you on a useful screen instead of a blank one.</p></li>
    <li><p>Sample data loads fast enough that the workspace feels alive on the first visit.</p></li>
  </ul>
  <h3>Numbers from the last test round</h3>
  <p>Five people ran through both versions. The new flow won on every measure we tracked.</p>
  <table>
    <tbody>
      <tr><th><p>Metric</p></th><th><p>Old wizard</p></th><th><p>New checklist</p></th></tr>
      <tr><td><p>Setup completion</p></td><td><p>61%</p></td><td><p>78%</p></td></tr>
      <tr><td><p>Time to first post</p></td><td><p>4m 12s</p></td><td><p>2m 30s</p></td></tr>
      <tr><td><p>Dropped at invite step</p></td><td><p>3 of 5</p></td><td><p>1 of 5</p></td></tr>
    </tbody>
  </table>
  <h3>Open questions</h3>
  <ol>
    <li><p>Should sample data seed automatically, or sit behind a button?</p></li>
    <li><p>The invite step assumes email. What do we show for SSO-only workspaces?</p></li>
    <li><p>Do we keep the tour for returning users, or show it only once?</p></li>
  </ol>
  <p>One thing to sort out on the backend: the checklist state has to persist per user, not per session. Right now the prototype reads it from <code>localStorage</code>, which resets when you switch devices. Here is the response shape I am proposing:</p>
  <pre><code class="language-json">{
  "onboarding": {
    "completed": ["create_space", "invite_team"],
    "skipped": ["import_data"],
    "dismissed": false
  }
}</code></pre>
  <blockquote><p>Let's timebox this to one more revision and ship it behind the <code>new_onboarding</code> flag next week.</p></blockquote>
  <p>Full comments are in the design channel. Add anything I missed before Friday.</p>
`)

// Demo-only: turns dropped/pasted files into local object URLs. Real apps
// return a persisted URL from their upload endpoint.
const uploadFunction = async (file) => ({
  file_url: URL.createObjectURL(file),
  file_name: file.name,
})

// Autosized single-visual-line title.
const { textarea: titleTextarea } = useTextareaAutosize({ input: title })
</script>

<template>
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell>
      <Editor
        v-model="content"
        :extensions="extensions"
        :upload-function="uploadFunction"
        placeholder="Type '/' for commands or select text to format"
      >
        <template #default="{ editor }">
          <PageHeader>
            <Breadcrumbs
              :items="[{ label: 'Drafts' }, { label: 'New discussion' }]"
            />
            <div class="flex shrink-0 items-center space-x-2">
              <Button
                variant="ghost"
                icon="lucide-trash-2"
                label="Delete draft"
              />
              <Button variant="solid">Publish</Button>
            </div>
          </PageHeader>

          <PageHeaderBase
            class="flex h-10 items-center border-b bg-surface-base px-3 sm:px-5"
          >
            <div class="w-full overflow-x-auto">
              <EditorFixedMenu :editor="editor" :items="toolbar" />
            </div>
          </PageHeaderBase>

          <!-- Prose container: 720px of prose + padding. -->
          <div class="mx-auto w-full max-w-[770px] px-3 pt-4 sm:px-5">
            <textarea
              ref="titleTextarea"
              class="mt-1 w-full resize-none border-0 bg-transparent px-0 py-0.5 text-4xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0"
              v-model="title"
              placeholder="Title"
              rows="1"
              wrap="soft"
              maxlength="140"
              @keydown.enter.prevent="editor.commands.focus()"
              @keydown.down.prevent="editor.commands.focus()"
            />
            <EditorContent
              :editor="editor"
              class="prose-v3 -mx-2 min-h-[calc(100vh-200px)] max-w-[unset] overflow-auto px-2 pb-40"
            />
          </div>
        </template>
      </Editor>
    </DesktopShell>
  </div>
</template>
