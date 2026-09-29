<script setup lang="ts">
// Figma: espresso-2.0 › WYSIWYG editor › toolbar (30534:59617). A 36px bar,
// 4px in, ruled beneath, its controls 28px on an 8px radius:
//   + ⌄ insert · Text ⌃ block style · Inter ⌄ font · − 14 + size ·
//   B I U S · A ⌃ colour │ code quote rule │ list ⌄ align ⌄ spacing ⌄
//   to-do indent │ link table ⌄ emoji ⌄ │ image ⌄ video ⌄ audio ⌄ file ⌄ │
//   highlight comment │ ⋯
// A select is an icon (or word) and a 16px chevron, 8px in; a plain
// control a 16px glyph; pressed and open ones sit on gray-100. Everything
// runs the library's editor commands; the pickers (colour, table size,
// link) are the library's own.
import { computed, h, ref, watch, type Component } from 'vue'
import {
  Button,
  Dialog,
  Dropdown,
  Popover,
  TextInput,
  Tooltip,
} from '../../../src'
import type { DropdownOptions } from '../../../src/components/Dropdown/types'
import { useResolvedEditor } from '../../../src/molecules/editor/editor-context'
import {
  FontColor,
  FontHighlight,
  InsertLink,
  InsertTable,
} from '../../../src/molecules/editor/menu'
import type { TiptapEditor } from '../../../src/molecules/editor'
import RteIcon from './RteIcon.vue'
import EmojiPicker from '../popover/EmojiPicker.vue'

const emit = defineEmits<{
  /** the comment button: a thread on the selection */
  comment: []
}>()

const editor = useResolvedEditor(() => undefined)

// the editor is not reactive on its own; a tick per transaction lets the
// controls read their state fresh (as the library's MenuItems does)
const version = ref(0)
watch(
  () => editor.value,
  (ed, _old, onCleanup) => {
    if (!ed) return
    const bump = () => version.value++
    ed.on('transaction', bump)
    onCleanup(() => ed.off('transaction', bump))
  },
  { immediate: true },
)
function live<T>(read: (ed: TiptapEditor) => T, fallback: T): T {
  void version.value
  return editor.value ? read(editor.value) : fallback
}

const icon =
  (name: string): Component =>
  () =>
    h(RteIcon, { name })
const lucide =
  (name: string): Component =>
  () =>
    h('span', { class: `lucide-${name} size-4`, 'aria-hidden': 'true' })

const chain = () => editor.value!.chain().focus()

// ---- the block style: what the cursor sits in, and the menu to change it
const BLOCKS = [
  { value: 'paragraph', label: 'Text', icon: 'paragraph' },
  { value: 'h1', label: 'Heading 1', icon: 'heading1' },
  { value: 'h2', label: 'Heading 2', icon: 'heading2' },
  { value: 'h3', label: 'Heading 3', icon: 'heading3' },
  { value: 'h4', label: 'Heading 4', icon: 'heading4' },
  { value: 'h5', label: 'Heading 5', icon: 'heading5' },
  { value: 'h6', label: 'Heading 6', icon: 'heading6' },
  { value: 'bulletList', label: 'Bulleted list', icon: 'multiple-list' },
  { value: 'orderedList', label: 'Numbered list', icon: 'numbered-list' },
  { value: 'taskList', label: 'To-do list', icon: 'todo' },
  { value: 'codeBlock', label: 'Code', icon: 'code' },
  { value: 'blockquote', label: 'Quote', icon: 'quote' },
  { value: 'columns', label: '3 Coloumn', icon: 'grid-3' },
] as const
type BlockValue = (typeof BLOCKS)[number]['value']

const activeBlock = computed<BlockValue>(() =>
  live((ed) => {
    for (const l of [1, 2, 3, 4, 5, 6] as const)
      if (ed.isActive('heading', { level: l })) return `h${l}` as BlockValue
    if (ed.isActive('codeBlock')) return 'codeBlock'
    if (ed.isActive('taskList')) return 'taskList'
    if (ed.isActive('bulletList')) return 'bulletList'
    if (ed.isActive('orderedList')) return 'orderedList'
    if (ed.isActive('blockquote')) return 'blockquote'
    if (ed.isActive('columns')) return 'columns'
    return 'paragraph'
  }, 'paragraph'),
)
const activeBlockLabel = computed(
  () => BLOCKS.find((b) => b.value === activeBlock.value)?.label ?? 'Text',
)
function setBlock(value: BlockValue) {
  const c = chain()
  if (value === 'paragraph') c.setParagraph().run()
  else if (value.startsWith('h'))
    c.toggleHeading({
      level: Number(value[1]) as 1 | 2 | 3 | 4 | 5 | 6,
    }).run()
  else if (value === 'bulletList') c.toggleBulletList().run()
  else if (value === 'orderedList') c.toggleOrderedList().run()
  else if (value === 'taskList') c.toggleTaskList().run()
  else if (value === 'codeBlock') c.toggleCodeBlock().run()
  else if (value === 'blockquote') c.toggleBlockquote().run()
  else if (value === 'columns') c.insertColumns(3).run()
}
const blockOptions = computed<DropdownOptions>(() =>
  BLOCKS.map((b) => ({
    label: b.label,
    icon: icon(b.icon),
    selected: activeBlock.value === b.value,
    onClick: () => setBlock(b.value),
  })),
)

// ---- font family and size, on the textStyle mark
const FONTS = [
  { label: 'Inter', value: null },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: 'ui-monospace, "SF Mono", Menlo, monospace' },
]
const activeFont = computed(() =>
  live((ed) => {
    const family = ed.getAttributes('textStyle').fontFamily as
      | string
      | undefined
    return FONTS.find((f) => f.value === family)?.label ?? 'Inter'
  }, 'Inter'),
)
const fontOptions = computed<DropdownOptions>(() =>
  FONTS.map((f) => ({
    label: f.label,
    selected: activeFont.value === f.label,
    onClick: () =>
      f.value
        ? chain().setFontFamily(f.value).run()
        : chain().unsetFontFamily().run(),
  })),
)

const DEFAULT_SIZE = 14
const fontSize = computed(() =>
  live((ed) => {
    const raw = ed.getAttributes('textStyle').fontSize as string | undefined
    const n = raw ? parseInt(raw, 10) : NaN
    return Number.isFinite(n) ? n : DEFAULT_SIZE
  }, DEFAULT_SIZE),
)
function stepSize(delta: number) {
  const next = Math.min(72, Math.max(8, fontSize.value + delta))
  if (next === DEFAULT_SIZE) chain().unsetFontSize().run()
  else chain().setFontSize(`${next}px`).run()
}

// ---- lists, alignment and line spacing
const listOptions = computed<DropdownOptions>(() => [
  {
    label: 'Bulleted list',
    icon: icon('multiple-list'),
    selected: live((ed) => ed.isActive('bulletList'), false),
    onClick: () => chain().toggleBulletList().run(),
  },
  {
    label: 'Numbered list',
    icon: icon('numbered-list'),
    selected: live((ed) => ed.isActive('orderedList'), false),
    onClick: () => chain().toggleOrderedList().run(),
  },
  {
    label: 'To-do list',
    icon: icon('todo'),
    selected: live((ed) => ed.isActive('taskList'), false),
    onClick: () => chain().toggleTaskList().run(),
  },
])
const ALIGNS = [
  { value: 'left', label: 'Left', icon: 'align-left' },
  { value: 'center', label: 'Center', icon: 'align-center' },
  { value: 'right', label: 'Right', icon: 'align-right' },
  { value: 'justify', label: 'Justify', icon: 'align-justify' },
]
const alignOptions = computed<DropdownOptions>(() =>
  ALIGNS.map((a) => ({
    label: a.label,
    icon: lucide(a.icon),
    selected: live((ed) => ed.isActive({ textAlign: a.value }), false),
    onClick: () => chain().setTextAlign(a.value).run(),
  })),
)
const SPACINGS = ['1', '1.15', '1.5', '1.75', '2']
const spacingOptions = computed<DropdownOptions>(() => [
  {
    label: 'Default',
    selected: live((ed) => !ed.getAttributes('textStyle').lineHeight, true),
    onClick: () => chain().unsetLineHeight().run(),
  },
  ...SPACINGS.map((s) => ({
    label: s,
    selected: live(
      (ed) => ed.getAttributes('textStyle').lineHeight === s,
      false,
    ),
    onClick: () => chain().setLineHeight(s).run(),
  })),
])

// ---- media: from the disk through the library's pickers, or by URL
type UrlKind = 'image' | 'video' | 'audio' | 'file' | 'embed'
const urlDialog = ref<{ kind: UrlKind; url: string; name: string } | null>(null)
const URL_TITLES: Record<UrlKind, string> = {
  image: 'Insert image',
  video: 'Insert video',
  audio: 'Insert audio',
  file: 'Attach file',
  embed: 'Embed link',
}
function askUrl(kind: UrlKind) {
  urlDialog.value = { kind, url: '', name: '' }
}
function insertUrl() {
  const d = urlDialog.value
  if (!d || !editor.value) return
  const url = d.url.trim()
  if (!url) return
  const c = chain()
  if (d.kind === 'image') c.setImage({ src: url }).run()
  else if (d.kind === 'video') c.setVideo({ src: url }).run()
  else if (d.kind === 'audio') c.setAudio({ src: url }).run()
  else if (d.kind === 'embed') c.insertIframeURL(url).run()
  else
    c.setAttachment({
      src: url,
      fileName: d.name.trim() || url.split('/').pop() || 'file',
    }).run()
  urlDialog.value = null
}
// audio has no library uploader: a file input, and the file as it is
const audioInput = ref<HTMLInputElement | null>(null)
function takeAudio(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  chain()
    .setAudio({ src: URL.createObjectURL(file), title: file.name })
    .run()
  ;(e.target as HTMLInputElement).value = ''
}
const mediaOptions = (kind: UrlKind, fromDisk: () => void): DropdownOptions => [
  { label: 'Insert from computer', icon: icon('paragraph'), onClick: fromDisk },
  { label: 'Insert via URL', icon: icon('link'), onClick: () => askUrl(kind) },
]
const imageOptions = mediaOptions('image', () =>
  chain().selectAndUploadImage().run(),
)
const videoOptions = mediaOptions('video', () =>
  chain().selectAndUploadVideo().run(),
)
const audioOptions = mediaOptions('audio', () => audioInput.value?.click())
const fileOptions = mediaOptions('file', () =>
  chain().selectAndUploadFile().run(),
)

// ---- the + menu: every block the editor can hold
const insertOptions = computed<DropdownOptions>(() => [
  {
    group: 'Media',
    options: [
      {
        label: 'Image',
        icon: icon('image'),
        onClick: () => chain().selectAndUploadImage().run(),
      },
      {
        label: 'Video',
        icon: icon('video'),
        onClick: () => chain().selectAndUploadVideo().run(),
      },
      {
        label: 'Audio',
        icon: icon('audio-waves'),
        onClick: () => audioInput.value?.click(),
      },
      {
        label: 'File',
        icon: icon('file-upload'),
        onClick: () => chain().selectAndUploadFile().run(),
      },
      {
        label: 'Embed',
        icon: lucide('gallery-vertical'),
        onClick: () => askUrl('embed'),
      },
    ],
  },
  {
    group: 'Blocks',
    options: [
      {
        label: 'Table',
        icon: icon('table-view'),
        onClick: () =>
          chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
      {
        label: 'Code block',
        icon: icon('code'),
        onClick: () => chain().toggleCodeBlock().run(),
      },
      {
        label: 'Quote',
        icon: icon('quote'),
        onClick: () => chain().toggleBlockquote().run(),
      },
      {
        label: 'Divider',
        icon: icon('divider'),
        onClick: () => chain().setHorizontalRule().run(),
      },
      {
        label: 'Callout',
        icon: lucide('lightbulb'),
        onClick: () => chain().setCallout().run(),
      },
      {
        label: 'Expand / collapse',
        icon: lucide('chevron-right'),
        onClick: () => chain().insertDetails().run(),
      },
    ],
  },
  {
    group: 'Layout',
    options: [
      {
        label: 'Columns',
        icon: icon('grid-3'),
        submenu: [2, 3, 4].map((n) => ({
          label: `${n} columns`,
          onClick: () => chain().insertColumns(n).run(),
        })),
      },
    ],
  },
])

// ---- the ⋯ overflow
const moreOptions = computed<DropdownOptions>(() => [
  {
    label: 'Superscript',
    icon: icon('superscript'),
    selected: live((ed) => ed.isActive('superscript'), false),
    onClick: () => chain().toggleSuperscript().run(),
  },
  {
    label: 'Subscript',
    icon: icon('subscript'),
    selected: live((ed) => ed.isActive('subscript'), false),
    onClick: () => chain().toggleSubscript().run(),
  },
  {
    label: 'Clear formatting',
    icon: lucide('remove-formatting'),
    onClick: () => chain().unsetAllMarks().clearNodes().run(),
  },
])

// ---- plain toggles
const marks = [
  {
    name: 'bold',
    icon: 'bold',
    label: 'Bold',
    run: () => chain().toggleBold().run(),
  },
  {
    name: 'italic',
    icon: 'italic',
    label: 'Italic',
    run: () => chain().toggleItalic().run(),
  },
  {
    name: 'underline',
    icon: 'underline1',
    label: 'Underline',
    run: () => chain().toggleUnderline().run(),
  },
  {
    name: 'strike',
    icon: 'strike-through',
    label: 'Strikethrough',
    run: () => chain().toggleStrike().run(),
  },
]
const isActive = (name: string) => live((ed) => ed.isActive(name), false)

function pickColor(e: MouseEvent) {
  if (editor.value)
    FontColor.action(editor.value, {
      event: e,
      trigger: e.currentTarget as HTMLElement,
    })
}
function pickTable(e: MouseEvent) {
  if (editor.value)
    InsertTable.action(editor.value, {
      event: e,
      trigger: e.currentTarget as HTMLElement,
    })
}
function insertEmoji(emoji: string) {
  chain().insertContent(emoji).run()
}
const canIndent = computed(() =>
  live(
    (ed) =>
      ed.can().sinkListItem('listItem') || ed.can().sinkListItem('taskItem'),
    false,
  ),
)
function indent() {
  if (!chain().sinkListItem('listItem').run())
    chain().sinkListItem('taskItem').run()
}
</script>

<template>
  <div
    class="rte-toolbar flex h-9 items-center gap-0 overflow-x-auto border-b border-outline-gray-1 p-1"
    role="toolbar"
    aria-label="Formatting"
  >
    <!-- + insert -->
    <Dropdown :options="insertOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Insert"
        >
          <RteIcon name="add" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>

    <!-- block style -->
    <Dropdown :options="blockOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Text style"
        >
          <span class="text-base leading-4 text-ink-gray-7">{{
            activeBlockLabel
          }}</span>
          <RteIcon :name="open ? 'small-up' : 'small-down'" class="size-4" />
        </button>
      </template>
    </Dropdown>

    <!-- font -->
    <Dropdown :options="fontOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Font"
        >
          <span class="text-base leading-4 text-ink-gray-7">{{
            activeFont
          }}</span>
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>

    <!-- size: − 14 + -->
    <div class="flex h-7 items-center gap-1 p-0.5" aria-label="Font size">
      <Tooltip text="Smaller">
        <button
          type="button"
          class="rte-step"
          aria-label="Smaller text"
          @click="stepSize(-1)"
        >
          <RteIcon name="divider" class="size-3.5" />
        </button>
      </Tooltip>
      <span
        class="w-6 text-center text-base leading-4 tabular-nums text-ink-gray-7"
        >{{ fontSize }}</span
      >
      <Tooltip text="Larger">
        <button
          type="button"
          class="rte-step"
          aria-label="Larger text"
          @click="stepSize(1)"
        >
          <RteIcon name="add" class="size-3.5" />
        </button>
      </Tooltip>
    </div>

    <!-- B I U S -->
    <Tooltip v-for="m in marks" :key="m.name" :text="m.label">
      <button
        type="button"
        class="rte-btn"
        :aria-pressed="isActive(m.name)"
        :aria-label="m.label"
        @click="m.run"
      >
        <RteIcon :name="m.icon" class="size-4" />
      </button>
    </Tooltip>

    <!-- text colour -->
    <Tooltip text="Text colour">
      <button
        type="button"
        class="rte-select rte-select-tight"
        aria-label="Text colour"
        @click="pickColor"
      >
        <RteIcon name="text" class="size-3.5" />
        <RteIcon name="small-down" class="size-4" />
      </button>
    </Tooltip>

    <span class="rte-divider" aria-hidden="true" />

    <Tooltip text="Code">
      <button
        type="button"
        class="rte-btn"
        :aria-pressed="isActive('code')"
        aria-label="Code"
        @click="chain().toggleCode().run()"
      >
        <RteIcon name="code" class="size-4" />
      </button>
    </Tooltip>
    <Tooltip text="Quote">
      <button
        type="button"
        class="rte-btn"
        :aria-pressed="isActive('blockquote')"
        aria-label="Quote"
        @click="chain().toggleBlockquote().run()"
      >
        <RteIcon name="quote" class="size-4" />
      </button>
    </Tooltip>
    <Tooltip text="Divider">
      <button
        type="button"
        class="rte-btn"
        aria-label="Divider"
        @click="chain().setHorizontalRule().run()"
      >
        <RteIcon name="divider" class="size-4" />
      </button>
    </Tooltip>

    <span class="rte-divider" aria-hidden="true" />

    <Dropdown :options="listOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Lists"
        >
          <RteIcon name="numbered-list" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>
    <Dropdown :options="alignOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Alignment"
        >
          <RteIcon name="align-left" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>
    <Dropdown :options="spacingOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Line spacing"
        >
          <RteIcon name="align-justify" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>
    <Tooltip text="To-do list">
      <button
        type="button"
        class="rte-btn"
        :aria-pressed="isActive('taskList')"
        aria-label="To-do list"
        @click="chain().toggleTaskList().run()"
      >
        <RteIcon name="todo" class="size-4" />
      </button>
    </Tooltip>
    <Tooltip text="Indent">
      <button
        type="button"
        class="rte-btn"
        aria-label="Indent"
        :disabled="!canIndent"
        @click="indent"
      >
        <RteIcon name="group" class="size-4" />
      </button>
    </Tooltip>

    <span class="rte-divider" aria-hidden="true" />

    <Tooltip text="Link">
      <button
        type="button"
        class="rte-btn"
        :aria-pressed="isActive('link')"
        aria-label="Link"
        @click="editor && InsertLink.action(editor)"
      >
        <RteIcon name="link" class="size-4" />
      </button>
    </Tooltip>
    <Tooltip text="Table">
      <button
        type="button"
        class="rte-select"
        aria-label="Table"
        @click="pickTable"
      >
        <RteIcon name="table-view" class="size-4" />
        <RteIcon name="small-down" class="size-4" />
      </button>
    </Tooltip>
    <Popover side="bottom" align="start" :offset="6" bare>
      <template #trigger="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Emoji"
        >
          <RteIcon name="add-emoji1" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
      <template #default="{ close }">
        <EmojiPicker @pick="(e: string) => (insertEmoji(e), close())" />
      </template>
    </Popover>

    <span class="rte-divider" aria-hidden="true" />

    <Dropdown :options="imageOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Image"
        >
          <RteIcon name="image" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>
    <Dropdown :options="videoOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Video"
        >
          <RteIcon name="video" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>
    <Dropdown :options="audioOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="Audio"
        >
          <RteIcon name="audio-waves" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>
    <Dropdown :options="fileOptions" side="bottom" align="start">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-select"
          :class="open && 'is-open'"
          aria-label="File"
        >
          <RteIcon name="file-upload" class="size-4" />
          <RteIcon name="small-down" class="size-4" />
        </button>
      </template>
    </Dropdown>

    <span class="rte-divider" aria-hidden="true" />

    <Tooltip text="Highlight">
      <button
        type="button"
        class="rte-btn"
        :aria-pressed="isActive('highlight')"
        aria-label="Highlight"
        @click="editor && FontHighlight.action(editor)"
      >
        <RteIcon name="highlight" class="size-4" />
      </button>
    </Tooltip>
    <Tooltip text="Comment">
      <button
        type="button"
        class="rte-btn"
        aria-label="Comment"
        @click="emit('comment')"
      >
        <RteIcon name="comment1" class="size-4" />
      </button>
    </Tooltip>

    <span class="rte-divider" aria-hidden="true" />

    <Dropdown :options="moreOptions" side="bottom" align="end">
      <template #default="{ open }">
        <button
          type="button"
          class="rte-btn"
          :class="open && 'is-open'"
          aria-label="More"
        >
          <RteIcon name="dot-horizontal" class="size-4" />
        </button>
      </template>
    </Dropdown>

    <input
      ref="audioInput"
      type="file"
      accept="audio/*"
      class="hidden"
      @change="takeAudio"
    />

    <!-- by URL -->
    <Dialog
      :model-value="!!urlDialog"
      :options="{
        title: urlDialog ? URL_TITLES[urlDialog.kind] : '',
        size: 'sm',
      }"
      @update:model-value="(v: boolean) => !v && (urlDialog = null)"
    >
      <template #body-content>
        <form
          v-if="urlDialog"
          class="flex flex-col gap-3"
          @submit.prevent="insertUrl"
        >
          <TextInput
            v-model="urlDialog.url"
            label="URL"
            placeholder="https://"
            autofocus
          />
          <TextInput
            v-if="urlDialog.kind === 'file'"
            v-model="urlDialog.name"
            label="File name"
            placeholder="report.pdf"
          />
        </form>
      </template>
      <template #actions>
        <Button variant="solid" class="w-full" @click="insertUrl">
          {{ urlDialog?.kind === 'embed' ? 'Embed link' : 'Insert' }}
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<style>
/* a plain control: 28px, the glyph centred; pressed or open on gray-100 */
.rte-btn {
  @apply flex size-7 shrink-0 items-center justify-center rounded-4 text-ink-gray-7 transition-colors hover:bg-surface-gray-2 disabled:opacity-40 disabled:hover:bg-transparent;
}
.rte-btn[aria-pressed='true'],
.rte-btn.is-open {
  @apply bg-surface-gray-3;
}
/* a select: its glyph or word, 4px, the chevron; 8px in either side */
.rte-select {
  @apply flex h-7 shrink-0 items-center gap-1 rounded-4 px-2 text-ink-gray-7 transition-colors hover:bg-surface-gray-2;
}
.rte-select.is-open {
  @apply bg-surface-gray-3;
}
/* the colour select is tighter: 2px around its 24px glyph box */
.rte-select-tight {
  @apply gap-0.5 px-0.5;
}
.rte-select-tight > :first-child {
  @apply flex size-6 items-center justify-center rounded-4;
}
/* the size stepper's − and +: 24px on gray-100 */
.rte-step {
  @apply flex size-6 items-center justify-center rounded-4 bg-surface-gray-2 text-ink-gray-7 transition-colors hover:bg-surface-gray-3;
}
.rte-divider {
  @apply mx-1 h-5 w-px shrink-0 bg-surface-gray-3;
}
</style>
