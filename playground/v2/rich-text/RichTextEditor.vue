<script setup lang="ts">
// Figma: espresso-2.0 › WYSIWYG editor (30534:59617): a 1300px card on the
// base surface, 16px corners, a gray-100 hairline, the toolbar ruled across
// its top and the document a 700px column down its middle. The editor is
// the library's — its kit, bubble and table menus, link and colour pickers,
// slash menu, mentions, images, embeds and attachments — with the file's
// toolbar over it, the blocks it lacks (extensions.ts) added, and the
// document drawn to the file's type scale.
//
// Comments: the toolbar's comment button lays the amber run on the
// selection and opens the thread beside it, as the file shows; a card of
// its own, on the raised surface under the lg shadow.
import { computed, nextTick, ref, watch } from 'vue'
import { Avatar, Button, TextInput } from '../../../src'
import {
  Editor,
  EditorBubbleMenu,
  EditorContent,
  EditorTableMenu,
  RichTextKit,
  Bold,
  Italic,
  Strike,
  InsertLink,
  FontColor,
  FontHighlight,
  Separator,
  AlignLeft,
  AlignCenter,
  AlignRight,
  type TiptapEditor,
} from '../../../src/molecules/editor'
import RichTextToolbar from './RichTextToolbar.vue'
import { playgroundExtensions } from './extensions'
import { article, people, tags } from './content'

const props = withDefaults(
  defineProps<{ editable?: boolean; empty?: boolean }>(),
  { editable: true, empty: false },
)

const content = ref(props.empty ? '' : article)
watch(
  () => props.empty,
  (empty) => (content.value = empty ? '' : article),
)

const extensions = [
  RichTextKit.configure({
    mention: { items: people },
    tag: { items: tags },
  }),
  ...playgroundExtensions,
]

const bubble = [
  Bold,
  Italic,
  Strike,
  FontColor,
  FontHighlight,
  InsertLink,
  Separator,
  AlignLeft,
  AlignCenter,
  AlignRight,
]

// files dropped, pasted or picked stay in the page as object URLs
const uploadFunction = async (file: File) => ({
  file_url: URL.createObjectURL(file),
  file_name: file.name,
})

// ---- comments: a thread per amber run, shown beside the selection
interface Reply {
  who: string
  when: string
  text: string
}
interface Thread {
  id: string
  replies: Reply[]
}
const threads = ref<Thread[]>([
  {
    id: 'c1',
    replies: [
      {
        who: 'James Fenimore',
        when: '4d ago',
        text: 'Okay cool, shall i finalise this design then?',
      },
      {
        who: 'Bray Bill',
        when: '6h ago',
        text: 'No major issues. Let’s get feedback from the dev team once.',
      },
    ],
  },
])
const openThread = ref<string | null>(null)
const threadTop = ref(0)
const reply = ref('')
const editorRef = ref<{ editor: TiptapEditor | null } | null>(null)
const stage = ref<HTMLElement | null>(null)

function comment() {
  const ed = editorRef.value?.editor
  if (!ed) return
  const existing = ed.getAttributes('comment').id as string | undefined
  if (existing) return show(existing)
  if (ed.state.selection.empty) return
  const id = `c${Date.now()}`
  ed.chain().focus().setComment(id).run()
  threads.value.push({ id, replies: [] })
  show(id)
}
function show(id: string) {
  openThread.value = id
  nextTick(() => {
    const el = stage.value?.querySelector<HTMLElement>(`[data-comment="${id}"]`)
    const box = stage.value?.getBoundingClientRect()
    if (el && box) threadTop.value = el.getBoundingClientRect().top - box.top
  })
}
function onEditorClick(e: MouseEvent) {
  const run = (e.target as HTMLElement).closest<HTMLElement>('[data-comment]')
  if (run) show(run.dataset.comment!)
  else openThread.value = null
}
const current = computed(() =>
  threads.value.find((t) => t.id === openThread.value),
)
function send() {
  const t = current.value
  const text = reply.value.trim()
  if (!t || !text) return
  t.replies.push({ who: 'You', when: 'now', text })
  reply.value = ''
}
function resolve() {
  const t = current.value
  const ed = editorRef.value?.editor
  if (!t || !ed) return
  // the run goes with the thread
  ed.state.doc.descendants((node, pos) => {
    const mark = node.marks.find(
      (m) => m.type.name === 'comment' && m.attrs.id === t.id,
    )
    if (mark)
      ed.chain()
        .setTextSelection({ from: pos, to: pos + node.nodeSize })
        .unsetComment()
        .run()
  })
  threads.value = threads.value.filter((x) => x.id !== t.id)
  openThread.value = null
}
</script>

<template>
  <div
    ref="stage"
    class="rte relative mx-auto w-full max-w-[1300px] rounded-7 border border-outline-gray-1 bg-surface-base"
    :class="!editable && 'is-readonly'"
  >
    <Editor
      ref="editorRef"
      v-model="content"
      :extensions="extensions"
      :editable="editable"
      :upload-function="uploadFunction"
      placeholder="Type / for blocks, @ to mention, : for an emoji…"
    >
      <template #default>
        <RichTextToolbar v-if="editable" @comment="comment" />
        <EditorBubbleMenu :items="bubble" />
        <EditorTableMenu />
        <div class="px-4 py-8 sm:px-8" @click="onEditorClick">
          <EditorContent
            class="rte-doc mx-auto w-full max-w-[700px] [--prose-font-size:15px]"
          />
        </div>
      </template>
    </Editor>

    <!-- the thread beside the run -->
    <div
      v-if="current"
      class="absolute right-6 z-20 flex w-[300px] flex-col gap-3.5 rounded-6 bg-surface-elevation-2 pb-2.5 shadow-lg"
      :style="{ top: `${Math.max(48, threadTop - 8)}px` }"
    >
      <div class="flex h-9 items-center gap-1 pl-4 pr-2 pt-2">
        <span class="flex-1 text-base-medium text-ink-gray-8">Comment</span>
        <Button variant="ghost" size="sm" icon="lucide-ellipsis" label="More" />
        <Button
          variant="ghost"
          size="sm"
          icon="lucide-circle-check"
          label="Resolve"
          @click="resolve"
        />
        <Button
          variant="ghost"
          size="sm"
          icon="lucide-x"
          label="Close"
          @click="openThread = null"
        />
      </div>
      <div v-for="(r, i) in current.replies" :key="i" class="flex gap-2.5 px-4">
        <Avatar :label="r.who" size="md" shape="circle" class="shrink-0" />
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <p class="flex items-baseline gap-2">
            <span class="text-base-medium text-ink-gray-8">{{ r.who }}</span>
            <span class="text-sm text-ink-gray-5">{{ r.when }}</span>
          </p>
          <p class="text-p-base text-ink-gray-7">{{ r.text }}</p>
        </div>
      </div>
      <p v-if="!current.replies.length" class="px-4 text-p-sm text-ink-gray-5">
        Start the thread.
      </p>
      <form class="flex items-center gap-2.5 px-4" @submit.prevent="send">
        <Avatar label="You" size="md" shape="circle" class="shrink-0" />
        <TextInput
          v-model="reply"
          class="min-w-0 flex-1"
          placeholder="Reply"
          aria-label="Reply"
        >
          <template #suffix>
            <button
              type="submit"
              class="flex size-5 items-center justify-center text-ink-gray-6"
              aria-label="Send"
            >
              <span class="lucide-arrow-up size-4" />
            </button>
          </template>
        </TextInput>
      </form>
    </div>
  </div>
</template>

<style>
/* The document at the file's scale: 15/24 regular gray-700 body, headings
   from 28 down to 16 semibold. Everything else — lists, quotes, code,
   tables, links, images — is the library's prose-v3. */
.rte-doc.prose-v3 {
  line-height: 1.6;
}
.rte-doc.prose-v3 h1 {
  font-size: 28px;
  line-height: 1.3;
  margin-top: 0;
  margin-bottom: 12px;
}
.rte-doc.prose-v3 h2 {
  font-size: 24px;
  line-height: 1.3;
}
.rte-doc.prose-v3 h3 {
  font-size: 20px;
  line-height: 1.35;
}
.rte-doc.prose-v3 h4 {
  font-size: 18px;
  line-height: 1.35;
}
.rte-doc.prose-v3 h5 {
  font-size: 16px;
  line-height: 1.4;
}
.rte-doc.prose-v3 h6 {
  font-size: 15px;
  line-height: 1.4;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 8px;
}
.rte-doc.prose-v3 hr {
  width: 100%;
  margin: 24px 0;
  border-color: var(--outline-gray-1);
}
/* tables as the file draws them: a gray-100 grid, the header row unfilled,
   its labels gray-500 regular; the cell colours set the fills */
.rte-doc.prose-v3 th {
  background-color: transparent;
  font-weight: 420;
  color: var(--ink-gray-5);
}
.rte-doc.prose-v3 td,
.rte-doc.prose-v3 th {
  border-color: var(--outline-gray-1);
}
/* a mention: gray-100 chip, as the file marks a person */
.rte-doc .mention {
  background: var(--surface-gray-2);
  border-radius: 4px;
  padding: 0 3px;
  font-weight: 420;
  color: var(--ink-gray-8);
}

/* an audio bar: the browser's player on the file's 40px bar */
.rte-audio {
  display: block;
  width: 100%;
  height: 40px;
  margin: 8px 0;
  border-radius: 8px;
}
.rte-audio.ProseMirror-selectednode {
  outline: 2px solid var(--outline-gray-2);
  outline-offset: 2px;
}

/* a callout: gray-50, 12px in, the emoji leading its first line */
.rte-doc [data-type='callout'] {
  position: relative;
  margin: 8px 0;
  padding: 12px 12px 12px 36px;
  border-radius: 8px;
  background: var(--surface-gray-1);
}
.rte-doc [data-type='callout']::before {
  content: attr(data-emoji);
  position: absolute;
  left: 12px;
  top: 12px;
  font-size: 15px;
  line-height: 24px;
}
.rte-doc [data-type='callout'] > p:first-child {
  font-weight: 600;
  color: var(--ink-gray-8);
}
.rte-doc [data-type='callout'] > p + p {
  margin-top: 4px;
}

/* columns: side by side on a 24px gutter, a hairline between */
.rte-doc [data-type='columns'] {
  display: grid;
  gap: 24px;
  margin: 8px 0;
}
.rte-doc [data-type='columns'][data-count='2'] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.rte-doc [data-type='columns'][data-count='3'] {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.rte-doc [data-type='columns'][data-count='4'] {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.rte-doc [data-type='column'] {
  min-width: 0;
  border-left: 1px solid var(--outline-gray-2);
  padding-left: 12px;
}
.rte-doc [data-type='column']:first-child {
  border-left: 0;
  padding-left: 0;
}
.rte-doc [data-type='column'] > *:first-child {
  margin-top: 0;
}
.rte-doc [data-type='column'] > *:last-child {
  margin-bottom: 0;
}
@media (max-width: 640px) {
  .rte-doc [data-type='columns'] {
    grid-template-columns: 1fr !important;
  }
  .rte-doc [data-type='column'] {
    border-left: 0;
    padding-left: 0;
  }
}

/* expand / collapse: a 16px chevron before the summary, the content
   indented under it and folded away when closed */
.rte-details {
  position: relative;
  padding-left: 22px;
  margin: 2px 0;
}
.rte-details-toggle {
  position: absolute;
  left: 0;
  top: 4px;
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--ink-gray-6);
  transition:
    transform 150ms ease-out,
    background-color 150ms;
}
.rte-details-toggle:hover {
  background: var(--surface-gray-2);
}
.rte-details.is-open .rte-details-toggle {
  transform: rotate(90deg);
}
/* the grip: in the margin to the block's left, shown while the pointer is
   on the block, and the handle that drags it */
.rte-drag {
  position: absolute;
  left: -24px;
  top: 4px;
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--ink-gray-5);
  opacity: 0;
  cursor: grab;
  transition: opacity 120ms ease-out;
}
.rte-details:hover > .rte-drag,
.rte-drag:focus-visible {
  opacity: 1;
}
.rte-drag:hover {
  background: var(--surface-gray-2);
  color: var(--ink-gray-7);
}
.rte-drag:active {
  cursor: grabbing;
}
.rte-details.ProseMirror-selectednode {
  border-radius: 6px;
  box-shadow: 0 0 0 2px var(--outline-gray-2);
}
.rte-details summary {
  list-style: none;
  font-weight: 500;
  color: var(--ink-gray-8);
  cursor: text;
}
.rte-details summary::-webkit-details-marker {
  display: none;
}
.rte-details [data-type='details-content'] {
  display: none;
  padding-top: 4px;
  color: var(--ink-gray-7);
}
.rte-details.is-open [data-type='details-content'] {
  display: block;
}

/* sub- and superscript */
.rte-doc sup,
.rte-doc sub {
  font-size: 0.75em;
  line-height: 0;
}

/* a comment's run: amber beneath, as the file marks it */
.rte-comment {
  background: var(--surface-amber-1, #fff4d3);
  border-bottom: 1px solid var(--outline-amber-2, #df9311);
  cursor: pointer;
}

/* an embed and the players keep the column */
.rte-doc iframe {
  max-width: 100%;
}

/* read only: the document as it is, no caret */
.rte.is-readonly .ProseMirror {
  caret-color: transparent;
}
</style>
