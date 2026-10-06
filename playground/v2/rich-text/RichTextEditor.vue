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
// selection and opens the thread beside it — the file's comment card
// (31815:34334): 300px on a 12px radius under the xl shadow, a 32px
// header ruled beneath, a reply per 24px avatar, and the reply field.
import { computed, nextTick, ref, watch } from 'vue'
import { Avatar, TextInput, toast } from '../../../src'
import {
  Editor,
  EditorContent,
  RichTextKit,
  type MentionInviteHandler,
  type TiptapEditor,
  type UploadFunction,
} from '../../../src/molecules/editor'
import {
  IFRAME_ALLOWLIST,
  ANY_HOST,
} from '../../../src/molecules/editor/extensions/iframe'
import RichTextToolbar from './RichTextToolbar.vue'
import RteBubbleMenu from './RteBubbleMenu.vue'
import RteTableControls from './RteTableControls.vue'
import RteBlockHandle from './RteBlockHandle.vue'
import RteColumnResizer from './RteColumnResizer.vue'
import RteIcon from './RteIcon.vue'
import { playgroundExtensions } from './extensions'
import { rteSlashCommands } from './rteSlashCommands'
import { article, people, tags } from './content'
import team1 from '../assets/rte/team-1.jpg'
import team2 from '../assets/rte/team-2.jpg'
import team3 from '../assets/rte/team-3.jpg'

const props = withDefaults(
  defineProps<{ editable?: boolean; empty?: boolean }>(),
  { editable: true, empty: false },
)

const content = ref(props.empty ? '' : article)
watch(
  () => props.empty,
  (empty) => (content.value = empty ? '' : article),
)

// a name nobody has: the "@" list offers to invite it (32467:13501). Here
// the invitation is a toast, and the name stays in the text as a mention,
// so the sentence reads as it was meant to once they have joined
const invite: MentionInviteHandler = (name, { editor, range }) => {
  editor
    .chain()
    .focus()
    .insertContentAt(range, [
      {
        type: 'mention',
        attrs: { id: name.toLowerCase().replace(/\s+/g, '-'), label: name },
      },
      { type: 'text', text: ' ' },
    ])
    .run()
  toast.success(`Invitation sent to ${name}`)
}

const extensions = [
  RichTextKit.configure({
    mention: { items: people, onInvite: invite },
    tag: { items: tags },
    // the "/" menu offers the blocks the toolbar's Text select offers, from
    // the select's own list and running the select's own command
    slashCommands: { items: rteSlashCommands() },
    // the attachment node comes from ./extensions, drawn as the file's row
    attachment: false,
    // and the link mark, raising the file's card in place of the popup
    link: false,
    // and the table stack, its row carrying the file's border option
    table: false,
    // the file embeds a website as readily as a player, so every host
    iframe: { allowlist: [...IFRAME_ALLOWLIST, ANY_HOST] },
  }),
  ...playgroundExtensions,
]

// an upload goes to the dev server's store (playground/dev-uploads.ts) and
// comes back as an http URL — the editor takes no other kind (a blob: URL
// is turned away by url-safety.ts) — with its progress and cancel wired
const uploadFunction: UploadFunction = (file, options) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/__uploads')
    xhr.setRequestHeader(
      'content-type',
      file.type || 'application/octet-stream',
    )
    xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name))
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        options?.onProgress?.({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        })
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300)
        resolve(JSON.parse(xhr.responseText))
      else reject(new Error(`Upload failed (${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.onabort = () =>
      reject(new DOMException('Upload cancelled', 'AbortError'))
    options?.signal?.addEventListener('abort', () => xhr.abort())
    xhr.send(file)
  })

// ---- comments: a thread per amber run, shown beside the selection
interface Reply {
  who: string
  image?: string
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
        image: team1,
        when: '4d ago',
        text: 'Okay cool, shall i finalise this design then?',
      },
      {
        who: 'Bray Bill',
        image: team2,
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
  t.replies.push({ who: 'You', image: team3, when: 'now', text })
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
        <!-- the floating bar over a text selection, as the file draws it -->
        <RteBubbleMenu />
        <!-- the table's grips, strips and menus (32157:9144) -->
        <RteTableControls />
        <!-- every block's grip in the margin, as Notion draws it -->
        <RteBlockHandle />
        <!-- the bar between two columns, that gives one what it takes
             from the other -->
        <RteColumnResizer />
        <div class="px-4 py-8 sm:px-8" @click="onEditorClick">
          <EditorContent
            class="rte-doc mx-auto w-full max-w-[700px] [--prose-font-size:15px]"
          />
        </div>
      </template>
    </Editor>

    <!-- the thread beside the run: the file's comment card -->
    <div
      v-if="current"
      class="rte-thread absolute right-6 z-20 flex w-[300px] flex-col gap-3.5 rounded-6 bg-surface-elevation-2 pb-2.5 shadow-xl"
      :style="{ top: `${Math.max(48, threadTop - 8)}px` }"
      role="dialog"
      aria-label="Comment thread"
    >
      <!-- 32px: 10 in, the title, three 24px controls, 4 out; ruled beneath -->
      <div class="rte-thread-head flex h-8 items-center py-1 pl-2.5 pr-1">
        <span class="flex-1 text-base-medium leading-4 text-ink-gray-5"
          >Comment</span
        >
        <button
          type="button"
          class="rte-thread-btn"
          aria-label="More"
          title="More"
        >
          <RteIcon name="dot-horizontal" class="size-3.5" />
        </button>
        <button
          type="button"
          class="rte-thread-btn"
          aria-label="Resolve"
          title="Resolve"
          @click="resolve"
        >
          <RteIcon name="check-circle" class="size-3.5" />
        </button>
        <button
          type="button"
          class="rte-thread-btn"
          aria-label="Close"
          title="Close"
          @click="openThread = null"
        >
          <RteIcon name="close" class="size-3.5" />
        </button>
      </div>

      <div class="flex flex-col gap-2.5 px-2.5">
        <div class="flex flex-col gap-3.5">
          <!-- a reply: the avatar, 8, name · when over the text, 8, more -->
          <div
            v-for="(r, i) in current.replies"
            :key="i"
            class="flex items-start gap-2"
          >
            <Avatar
              :label="r.who"
              :image="r.image"
              size="md"
              shape="circle"
              class="shrink-0"
            />
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <p class="flex items-baseline gap-1">
                <span
                  class="truncate text-base-medium leading-4 text-ink-gray-7"
                  >{{ r.who }}</span
                >
                <span class="shrink-0 text-sm leading-[15px] text-ink-gray-5"
                  >· {{ r.when }}</span
                >
              </p>
              <p class="text-p-base text-ink-gray-6">{{ r.text }}</p>
            </div>
            <button
              type="button"
              class="flex size-4 shrink-0 items-center justify-center text-ink-gray-5"
              aria-label="More"
              title="More"
            >
              <RteIcon name="dot-horizontal" class="size-4" />
            </button>
          </div>
          <p v-if="!current.replies.length" class="text-p-base text-ink-gray-5">
            Start the thread.
          </p>
        </div>

        <!-- the reply field: 24px avatar, 8, the library's subtle input -->
        <form class="flex items-center gap-2" @submit.prevent="send">
          <Avatar
            label="You"
            :image="team3"
            size="md"
            shape="circle"
            class="shrink-0"
          />
          <TextInput
            v-model="reply"
            size="sm"
            variant="subtle"
            class="min-w-0 flex-1"
            placeholder="Reply"
            aria-label="Reply"
          >
            <template #suffix>
              <button
                type="submit"
                class="flex size-4 items-center justify-center text-ink-gray-7"
                aria-label="Send"
              >
                <RteIcon name="arrow-up" class="size-4" />
              </button>
            </template>
          </TextInput>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
/* The document at the file's scale: 15/24 regular gray-700 body, headings
   from 28 down to 16 semibold. Everything else — lists, quotes, code,
   tables, links, images — is the library's prose-v3. */
.rte-doc.prose-v3 {
  line-height: 1.6;
  /* the 700px column again: EditorContent brings prose's own max-w-none,
     and the two utilities carry the same weight, so which of them wins is
     the order they happen to land in — the dev server and a production
     build do not agree on it. Said here, it is not a matter of order. */
  max-width: 700px;
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

/* the audio player (31403:45371): a 42px bar, and its slider drawn to the
   file's 2px track, 14px knob on a soft shadow, the range in gray-900 */
.rte-doc .rte-player {
  margin: 8px 0;
}
.rte-player.ProseMirror-selectednode {
  outline: 2px solid var(--outline-gray-2);
  outline-offset: 2px;
}
.rte-player-slider {
  height: 14px;
}
.rte-player-slider > :first-child {
  height: 2px;
  border-radius: 16px;
  background-color: var(--surface-gray-3);
}
.rte-player-slider > :first-child > * {
  background-color: var(--ink-gray-8);
}
.rte-player-slider [role='slider'] {
  width: 14px;
  height: 14px;
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.14),
    0 0 1.5px rgba(0, 0, 0, 0.16),
    inset 0 0.25px 1.5px rgba(255, 255, 255, 0.16);
}
.rte-player-slider [role='slider']:hover {
  box-shadow:
    0 0 0 6px rgba(82, 82, 82, 0.12),
    0 2px 5px rgba(0, 0, 0, 0.14),
    0 0 1.5px rgba(0, 0, 0, 0.16);
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

/* a row of pictures (32243:108985): the file sets its cells 16 apart with
   no rule between them — 342 + 16 + 342 across the 700 column — and every
   picture fills the cell it is given without being stretched to it */
.rte-doc [data-type='columns'][data-media='true'] {
  gap: 16px;
}
.rte-doc [data-type='columns'][data-media='true'] [data-type='column'] {
  border-left: 0;
  padding-left: 0;
}
/* a cell keeps the shape the file gives it (342 × 170) whatever shape the
   picture is, so the row stays level: the picture covers the cell rather
   than being squeezed into it, and an empty cell beside a filled one is
   the same size */
.rte-doc [data-type='columns'][data-media='true'] img {
  width: 100%;
  aspect-ratio: 342 / 170;
  object-fit: cover;
  border-radius: 6px;
}
/* the paragraph a picture stands in carries no leading of its own, so the
   cells of a row keep their tops level, and the break ProseMirror leaves
   after the picture as a caret target is no line of the cell */
.rte-doc [data-type='columns'][data-media='true'] [data-type='column'] > p {
  margin: 0;
}
/* two pictures in one cell — one dropped onto another — stand 8px apart */
.rte-doc [data-type='columns'][data-media='true'] [data-type='column'] > p + p {
  margin-top: 8px;
}
.rte-doc [data-type='columns'][data-media='true'] .ProseMirror-trailingBreak {
  display: none;
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
/* the attachment row (31457:33634): the close shown while the pointer is
   on the row, and rows stacked close */
/* the row is a link, but not one of the document's underlined ones */
.rte-doc .rte-attachment > a {
  border-bottom: 0;
}
.rte-attachment .rte-attachment-close {
  margin-left: auto;
  opacity: 0;
  transition: opacity 120ms ease-out;
}
.rte-attachment:hover .rte-attachment-close,
.rte-attachment:focus-within .rte-attachment-close {
  opacity: 1;
}
/* a selected row is its button on the same gray-100 ground as under the
   pointer — the same width and corners — not the block's wider halo */
.rte-doc .rte-attachment.ProseMirror-selectednode {
  background-color: transparent;
  box-shadow: none;
}
.rte-attachment.ProseMirror-selectednode > a {
  background-color: var(--surface-gray-2);
}
.rte-doc .rte-attachment {
  margin: 8px 0;
}
.rte-doc .rte-attachment + .rte-attachment {
  margin-top: -8px;
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
/* an empty toggle says what it is, as Notion's does: "Toggle" where the
   summary goes, and what the body takes where that goes — in the editor's
   own placeholder gray, floated as the library floats its placeholder so
   the line keeps its break, and gone the moment there is text. An empty
   line is one ProseMirror has left only its break in. Not in read mode. */
.rte:not(.is-readonly)
  .rte-details
  summary:has(> .ProseMirror-trailingBreak:only-child)::before {
  content: 'Toggle';
  float: left;
  height: 0;
  font-weight: 400;
  color: var(--ink-gray-4);
  pointer-events: none;
}
.rte:not(.is-readonly)
  .rte-details
  [data-type='details-content']
  > p:only-child:has(> .ProseMirror-trailingBreak:only-child)::before {
  content: 'Empty toggle. Click or drop blocks inside.';
  float: left;
  height: 0;
  color: var(--ink-gray-4);
  pointer-events: none;
}

/* sub- and superscript */
.rte-doc sup,
.rte-doc sub {
  font-size: 0.75em;
  line-height: 0;
}

/* Tables (32157:9144): a 12px-radius card on a gray-100 hairline, cells
   ruled right and beneath — never on the outer edge — 6/8 in; the header
   row 32px of 13/15 gray-500, body rows 40px of 14/21 gray-600 that grow
   with their lines. The card is the table's viewport: a table at least
   its width, and one grown past it (tiptap sizes a table to its columns'
   widths, inline) scrolls inside it, never the page. */
.rte-doc.prose-v3 .tableWrapper {
  --rte-sbar: 9px;
  border: 1px solid var(--outline-gray-1);
  border-radius: 12px;
  margin: 16px 0;
  /* the card never scrolls its rows: it is as tall as they are */
  overflow-y: hidden;
  container-type: scroll-state;
}
/* the card's scrollbar (32179:58872): a 4px gray-200 pill 5px up from
   the card's bottom edge, on no track, the card's inner width — the 9px
   bar holds the 5px beneath the thumb as a clear border. The file's card
   is no taller for it (32176:58190 is the 314px of 32176:56166): the bar
   lies over the last row's foot, so the table gives the bar's height
   back and the card keeps the rows' height, scrolling or not */
@supports not selector(::-webkit-scrollbar) {
  .rte-doc.prose-v3 .tableWrapper {
    scrollbar-width: thin;
    scrollbar-color: var(--outline-gray-2) transparent;
  }
}
.rte-doc.prose-v3 .tableWrapper::-webkit-scrollbar {
  height: var(--rte-sbar);
}
.rte-doc.prose-v3 .tableWrapper::-webkit-scrollbar-track {
  background: transparent;
}
.rte-doc.prose-v3 .tableWrapper::-webkit-scrollbar-thumb {
  background: var(--outline-gray-2);
  background-clip: padding-box;
  border: 0 solid transparent;
  border-bottom-width: 5px;
  /* the pill's ends are half circles: the clear border beneath takes 5px
     off the lower corners' vertical radius, so they start at 7 to end at
     the 2 the upper ones have */
  border-radius: 2px / 2px 2px 7px 7px;
}
.rte-doc.prose-v3 table {
  margin: 0;
  width: 100%;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  line-height: 21px;
}
@container scroll-state(scrollable: x) {
  .rte-doc.prose-v3 table {
    margin-bottom: calc(-1 * var(--rte-sbar));
  }
}
.rte-doc.prose-v3 table td,
.rte-doc.prose-v3 table th {
  height: 40px;
  padding: 6px 8px;
  border: 0;
  border-right: 1px solid var(--outline-gray-1);
  border-bottom: 1px solid var(--outline-gray-1);
  vertical-align: middle;
  text-align: left;
  background: transparent;
}
.rte-doc.prose-v3 table tr > :last-child {
  border-right: 0;
}
.rte-doc.prose-v3 table tr:last-child > * {
  border-bottom: 0;
}
.rte-doc.prose-v3 table th {
  height: 32px;
  font-weight: 400;
}
.rte-doc.prose-v3 table td p {
  font-size: 14px;
  line-height: 21px;
  color: var(--ink-gray-6);
}
.rte-doc.prose-v3 table th p {
  font-size: 13px;
  line-height: 15px;
  color: var(--ink-gray-5);
}
/* the row's border option: one rule, or none */
.rte-doc.prose-v3 table tr[data-border] > * {
  border-right: 0;
  border-bottom: 0;
}
.rte-doc.prose-v3 table tr[data-border='top'] > * {
  border-top: 1px solid var(--outline-gray-1);
}
.rte-doc.prose-v3 table tr[data-border='right'] > * {
  border-right: 1px solid var(--outline-gray-1);
}
.rte-doc.prose-v3 table tr[data-border='bottom'] > * {
  border-bottom: 1px solid var(--outline-gray-1);
}
.rte-doc.prose-v3 table tr[data-border='left'] > * {
  border-left: 1px solid var(--outline-gray-1);
}
/* a block picked up by its grip, or selected by a click on it: a gray-100
   ground 4px past its edges. A picture, a video or an embed keeps the
   library's ring and pills instead: the selected node there is the media
   view's wrapper, the one that holds the media box, not the <img> itself */
.rte-doc
  .ProseMirror-selectednode:not(img):not(video):not(
    :has(> [data-video-fullscreen-root]),
    :has(> [data-embed-root])
  ) {
  background-color: var(--surface-gray-2);
  border-radius: 4px;
  box-shadow: 0 0 0 4px var(--surface-gray-2);
}
.rte-doc.rte-dragging
  .ProseMirror-selectednode:not(img):not(video):not(
    :has(> [data-video-fullscreen-root]),
    :has(> [data-embed-root])
  ) {
  opacity: 0.4;
}

/* the selection: a 1px gray-500 line around the cell or the run of cells;
   at the card's corners it turns on the card's inner 11px radius, or the
   card would clip its square corner (the run's box is rounded from
   RteTableControls, which knows which corners it reaches) */
.rte-doc .selectedCell::after,
.rte-doc .table-selection-box {
  border-radius: 0;
  box-shadow: inset 0 0 0 1px var(--ink-gray-5);
}
/* the run's box grows by the margin and padding the controls give it to
   reach the rules (RteTableControls' fitSelectionBox) */
.rte-doc .table-selection-box {
  box-sizing: content-box;
}
/* the cell's ring lies on the rules around it: the one to its left and
   above (the neighbours' own) and its own to the right and beneath. On the
   card's edge, where there is no rule and the card would clip it, it stays
   on the cell's own edge */
.rte-doc .selectedCell::after {
  inset: -1px;
}
.rte-doc.prose-v3 table tr > :first-child.selectedCell::after {
  left: 0;
}
.rte-doc.prose-v3 table tr:first-child > .selectedCell::after {
  top: 0;
}
.rte-doc.prose-v3 table tr > :last-child.selectedCell::after {
  right: 0;
}
.rte-doc.prose-v3 table tr:last-child > .selectedCell::after {
  bottom: 0;
}
/* over a scrolling table it closes above the bar, not under it */
@container scroll-state(scrollable: x) {
  .rte-doc.prose-v3 table tr:last-child > .selectedCell::after {
    bottom: var(--rte-sbar);
  }
}
.rte-doc.prose-v3 table tr:first-child > :first-child.selectedCell::after {
  border-top-left-radius: 11px;
}
.rte-doc.prose-v3 table tr:first-child > :last-child.selectedCell::after {
  border-top-right-radius: 11px;
}
.rte-doc.prose-v3 table tr:last-child > :first-child.selectedCell::after {
  border-bottom-left-radius: 11px;
}
.rte-doc.prose-v3 table tr:last-child > :last-child.selectedCell::after {
  border-bottom-right-radius: 11px;
}
/* tiptap's column resize handle: a 1px gray-600 line on the edge under
   the pointer, the cell's height */
.rte-doc .column-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -1px;
  width: 1px;
  background-color: var(--ink-gray-6);
  pointer-events: none;
  z-index: 1;
}
/* on the last column it stays inside the cell: 1px past the table is 1px of
   overflow in the card, and a scrollbar the table has no need of */
.rte-doc table tr > :last-child > .column-resize-handle {
  right: 0;
}

/* the thread card: the header's rule is drawn inside its 32px, as the
   file's inside stroke is, and its controls are 24px on an 8px radius */
.rte-thread-head {
  box-shadow: inset 0 -1px 0 var(--outline-gray-1);
}
.rte-thread-btn {
  @apply flex size-6 shrink-0 items-center justify-center rounded-4 text-ink-gray-5 transition-colors hover:bg-surface-gray-2 hover:text-ink-gray-7;
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
