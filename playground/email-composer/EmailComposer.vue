<script setup lang="ts">
import { computed, h, nextTick, ref, watch } from 'vue'
import { Avatar, Button, Dropdown, Popover, TextInput } from '../../src'
import { Editor, EditorContent, RichTextKit } from '../../src/molecules/editor'
import type { TiptapEditor } from '../../src/molecules/editor'
import { FontColor, InsertLink } from '../../src/molecules/editor/menu'
import ComposerIcon from './ComposerIcon.vue'
import EmojiPicker from '../v2/popover/EmojiPicker.vue'
import { HoldSelection } from './holdSelection'
import {
  MultiEmailInput,
  isValidEmail,
} from '../../experimental/MultiEmailInput'
import type { MultiEmailOption } from '../../experimental/MultiEmailInput'
import { faceFor } from '../components/patterns/designAssets'

/**
 * The email composer (node 35709:58442, its three states): a 600x540 window
 * floating 24 in from the stage's bottom-right corner.
 *
 *   radius 16 · surface-elevation-1 · the 2xl elevation
 *   header     48 — surface-gray-1, 16 left / 12 right, the title, then two
 *              24px ghost buttons 4 apart (pop out, close)
 *   To         41 — 6 above and below a 28px ghost field (8 in, a 16px glyph,
 *              8, then the chips and the caret), Cc and Bcc at the right
 *              end 4 apart, a 1px outline-gray-1 rule under the row
 *   Cc / Bcc   the same row, shown when its button is pressed
 *   Subject    41 — the same ghost field with the bubble glyph
 *   body       fills — 16 of padding, 14/21 ink-gray-7, "Type a message..."
 *              in ink-gray-4
 *   toolbar    56 — 12 above, 16 below and either side: Send with its menu
 *              chevron, then eight 28px ghost icon buttons 4 apart; the bin
 *              alone at the right end
 *
 * The recipient fields are frappe-ui's MultiEmailInput — chips, an inline
 * caret and a suggestion menu are what it does — dressed to the file: the
 * chips are Espresso's `tag` (md, outline — the user's call: 24 tall,
 * radius 6, a 1px outline-gray-2 line and no fill, 6 in front and 4
 * behind, a 16px face, a 13px ink-gray-7 label, a 12px close), and the menu is its `dropdown` (280 wide, radius 10, 4 of padding,
 * 49px rows 1 apart with a 32px face, the name over the address, the
 * pointed-at row on surface-gray-2).
 *
 * One thing the file draws that the component can't: it hangs the menu under
 * the caret, wherever the typing has reached. MultiEmailInput anchors it to
 * the field, so here it opens under the field's left edge.
 */

/** Everything a draft holds — what Undo on the discard toast brings back. */
export interface Draft {
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  body: string
  attachments: File[]
}

const props = defineProps<{
  /** A discarded draft to open with, when the toast's Undo brings it back. */
  initial?: Draft | null
  /** "Default to full screen", from the ⋮ menu: the composer opens expanded. */
  fullScreenDefault?: boolean
  /** "Spell check", from the ⋮ menu (on unless turned off). */
  spellCheck?: boolean
}>()
const emit = defineEmits<{
  close: []
  'update:fullScreenDefault': [value: boolean]
  'update:spellCheck': [value: boolean]
  /** The bin: the draft as it was, for the toast's Undo. */
  discard: [draft: Draft]
}>()

/** Who can be written to — the names the file shows, with their faces. */
const people: MultiEmailOption[] = [
  'Michael Johnson',
  'Alison Samuel',
  'Jay Smith',
  'John Armstrong',
  'Sandeep Prabhakaran',
  'Joan Smith',
  'Emily Taylor',
  'Faris Ansari',
].map((name) => ({
  label: name,
  value: `${name.split(' ')[0].toLowerCase()}@frappe.io`,
  avatar: faceFor(name),
}))

/**
 * A recipient field shows its chips only while it is being edited. Left
 * alone with people in it, it folds to one line of their names, comma
 * separated, as Gmail does — chips three deep would eat the message's room.
 * A press on the line opens the field again, chips and caret and all.
 */
type Field = 'to' | 'cc' | 'bcc'
const editing = ref<Field | null>(null)
const fieldRefs: Record<Field, { focus: () => void } | null> = {
  to: null,
  cc: null,
  bcc: null,
}
const fieldEls: Record<Field, HTMLElement | null> = {
  to: null,
  cc: null,
  bcc: null,
}
/**
 * A name for an address: the person's, or — for one outside the list — a
 * name read off the address itself, "harsha.r@timeless.co" as "Harsha R",
 * so the folded line and the chip read as people, not addresses.
 */
const nameOf = (value: string) =>
  people.find((p) => p.value === value)?.label ??
  value
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
/**
 * A single field never folds while the focus is among the recipients: open
 * the folded line and To, Cc and Bcc all show their people as tags (the
 * user's call 2026-10-07). Folding happens once, for the group, when the
 * focus leaves them all — see `groupFolded`.
 */
const folded = (_field: Field, _values: string[]) => false
function openField(field: Field) {
  editing.value = field
  nextTick(() => fieldRefs[field]?.focus())
}
/**
 * Focus leaving the row — not into its own menu, and not in the moment a
 * pick lands (the menu takes the focus for a beat as it closes) — folds it.
 */
let lastPick = 0
function leaveField(field: Field) {
  setTimeout(() => {
    const active = document.activeElement
    const inside =
      fieldEls[field]?.contains(active) ||
      !!active?.closest('[data-slot=content]')
    if (inside || Date.now() - lastPick < 150) return
    if (editing.value === field) editing.value = null
  }, 0)
}

const to = ref<string[]>(props.initial?.to ?? [])
const cc = ref<string[]>(props.initial?.cc ?? [])
const bcc = ref<string[]>(props.initial?.bcc ?? [])
const showCc = ref(cc.value.length > 0)
const showBcc = ref(bcc.value.length > 0)
/**
 * The recipients folded together: with the focus out of all three fields,
 * the To line carries everyone — "Alison Samuel Cc: Sandeep Prabhakaran,
 * Faris Ansari" — and the Cc and Bcc rows stay out of the way until the
 * line is opened again (the user's call 2026-10-07, as Gmail does).
 */
const groupFolded = computed(
  () =>
    editing.value === null &&
    to.value.length + cc.value.length + bcc.value.length > 0,
)
const foldedGroups = computed(() =>
  [
    { label: '', names: to.value },
    { label: 'Cc:', names: cc.value },
    { label: 'Bcc:', names: bcc.value },
  ]
    .filter((g) => g.names.length)
    .map((g) => ({ label: g.label, text: g.names.map(nameOf).join(', ') })),
)
/** Opening the folded line: To, with Cc and Bcc back as they were. */
function openGroup() {
  openField('to')
}
/** Cc / Bcc pressed: the row shows, and takes the caret when it opens. */
function toggleRow(field: 'cc' | 'bcc') {
  const show = field === 'cc' ? showCc : showBcc
  show.value = !show.value
  if (show.value) openField(field)
}
const subject = ref(props.initial?.subject ?? '')
const body = ref(props.initial?.body ?? '')

/**
 * The suggestions for whichever field is being typed in: the people whose
 * name or address carries the query. The component hides the ones already
 * chosen in that field itself.
 */
const query = ref('')
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  // nothing typed, nothing offered: the menu only appears for a query
  if (!q) return []
  // a word of the name, or the address, starting with what is typed — not
  // a letter found anywhere ("c" is not Michael)
  return people.filter(
    (p) =>
      p.label
        .toLowerCase()
        .split(' ')
        .some((w) => w.startsWith(q)) || p.value.startsWith(q),
  )
})
/**
 * MultiEmailInput opens its menu on focus and again the moment a pick
 * resets the query, and shows "No results" for a query nobody matches. The
 * menu is for what it can offer: while nothing is typed, or while an
 * unknown address is still being typed and is not yet one the component
 * would offer to add, it is given no rows (above) and kept out of sight
 * (`is-quiet`). An address nobody matches is simply new — the menu's
 * absence says so; it returns with "Add …" once the address is complete.
 */
const quiet = computed(() => {
  const q = query.value.trim()
  return !q || (matches.value.length === 0 && !isValidEmail(q))
})

/**
 * A row's glyph wears the placeholder's grey until the row holds or is
 * being given something, then the text's own ink-gray-7.
 */
const glyphInk = (filled: boolean) =>
  filled ? 'text-ink-gray-7' : 'text-ink-gray-4'
const fieldFilled = (field: Field, values: string[]) =>
  values.length > 0 || (editing.value === field && query.value.trim() !== '')

const extensions = [
  RichTextKit.configure({ mention: false, tag: false }),
  HoldSelection,
]

/**
 * The toolbar's actions run the editor's own commands. `Editor` is
 * renderless and hands its instance out through a template ref; a file
 * picked for an image or an attachment is kept as it is, as an object URL.
 */
const editorRef = ref<{ editor: TiptapEditor | null } | null>(null)
const ed = () => editorRef.value?.editor ?? null
const chain = () => ed()!.chain().focus()
const uploadFunction = async (file: File) => ({
  file_url: URL.createObjectURL(file),
  file_name: file.name,
})
function pickColour(e: MouseEvent) {
  const editor = ed()
  if (editor)
    FontColor.action(editor, {
      event: e,
      trigger: e.currentTarget as HTMLElement,
    })
}
function insertLink() {
  const editor = ed()
  if (!editor) return
  // keep the run the link is for in view while the popup's field has focus
  editor.commands.holdSelection()
  InsertLink.action(editor)
}
function insertEmoji(emoji: string) {
  chain().insertContent(emoji).run()
}
/**
 * Attachments go with the message, not into it: the paperclip opens the
 * system's dialog and each file picked becomes a chip at the foot of the
 * body, as Gmail lays them — never a block among the words. The chip is the
 * same md outline tag the recipients wear, the file glyph where the face goes.
 */
watch([to, cc, bcc], () => (lastPick = Date.now()), { deep: true })

const attachments = ref<File[]>(props.initial?.attachments ?? [])
const fileInput = ref<HTMLInputElement | null>(null)
const attachFile = () => fileInput.value?.click()
function takeFiles(e: Event) {
  const input = e.target as HTMLInputElement
  attachments.value.push(...Array.from(input.files ?? []))
  input.value = ''
}
const detach = (i: number) => attachments.value.splice(i, 1)
const insertImage = () => chain().selectAndUploadImage().run()

/** The menu under Send's chevron: the file's one row. */
const sendOptions = [{ label: 'Schedule send', onClick: () => schedule() }]
function schedule() {
  // nothing behind it yet: a scheduled message leaves the way a sent one does
  send()
}

/** Pop out: the window takes the whole stage, 24 in on every side. */
const expanded = ref(!!props.fullScreenDefault)

/**
 * The toolbar's ⋮: a menu of three, each with its glyph from the icon set
 * (node 35872:126785 — expand, print, text). The two settings are the
 * library's switch items and live on the page, so they outlast the window:
 * Default to full screen opens every composer expanded (and expands this
 * one when turned on); Spell check turns the browser's checking in the
 * message on or off. Print prints the message as it stands.
 */
const glyph = (name: string) => () =>
  h(ComposerIcon, { name, class: 'size-4 text-ink-gray-7' })
const spellOn = computed(() => props.spellCheck !== false)
const moreOptions = computed(() => [
  {
    label: 'Default to full screen',
    icon: glyph('expand'),
    switch: true as const,
    switchValue: !!props.fullScreenDefault,
    onClick: (on: boolean) => {
      emit('update:fullScreenDefault', on)
      if (on) expanded.value = true
    },
  },
  { label: 'Print', icon: glyph('print'), onClick: () => printMessage() },
  {
    label: 'Spell check',
    icon: glyph('text'),
    switch: true as const,
    switchValue: spellOn.value,
    onClick: (on: boolean) => emit('update:spellCheck', on),
  },
])
watch(
  [spellOn, () => ed()],
  ([on]) => ed()?.view.dom.setAttribute('spellcheck', on ? 'true' : 'false'),
  { immediate: true, flush: 'post' },
)
/** The message on its own page, printed from a frame the page never shows. */
function printMessage() {
  const names = (list: string[]) => list.map(nameOf).join(', ')
  const esc = (t: string) =>
    t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)
  const lines = [
    to.value.length && `<p><b>To:</b> ${esc(names(to.value))}</p>`,
    cc.value.length && `<p><b>Cc:</b> ${esc(names(cc.value))}</p>`,
    bcc.value.length && `<p><b>Bcc:</b> ${esc(names(bcc.value))}</p>`,
  ].filter(Boolean)
  const frame = document.createElement('iframe')
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0'
  document.body.appendChild(frame)
  const doc = frame.contentDocument!
  doc.open()
  doc.write(
    `<html><head><title>${esc(subject.value || 'New message')}</title><style>body{font:14px/1.5 Inter,system-ui,sans-serif;margin:40px;color:#171717}h1{font-size:20px}</style></head><body><h1>${esc(subject.value || 'New message')}</h1>${lines.join('')}<hr>${ed()?.getHTML() ?? ''}</body></html>`,
  )
  doc.close()
  frame.contentWindow!.focus()
  frame.contentWindow!.print()
  setTimeout(() => frame.remove(), 1000)
}

function reset() {
  to.value = []
  cc.value = []
  bcc.value = []
  showCc.value = false
  showBcc.value = false
  subject.value = ''
  body.value = ''
  attachments.value = []
}

function send() {
  reset()
  emit('close')
}

function discard() {
  emit('discard', {
    to: to.value,
    cc: cc.value,
    bcc: bcc.value,
    subject: subject.value,
    body: body.value,
    attachments: attachments.value,
  })
  reset()
  emit('close')
}

/**
 * The suggestion menu hangs from where the typing is. MultiEmailInput
 * anchors it to the field's left edge; this moves it along to where the
 * caret's text starts — or, when 280 from there would run past the
 * window's right edge, ends it at the caret instead, never past the
 * window's left edge. Set as a margin on the menu through a variable on the
 * root, where the menu is portaled.
 */
const MENU_WIDTH = 280
const MENU_INSET = 8
function placeMenu() {
  const input = document.activeElement as HTMLInputElement | null
  const control = input?.closest<HTMLElement>('[data-slot=control]')
  if (!input || !control || !root.value) return
  const ir = input.getBoundingClientRect()
  const cr = control.getBoundingClientRect()
  const wr = root.value.getBoundingClientRect()
  let left = ir.left
  if (left + MENU_WIDTH > wr.right - MENU_INSET) {
    const cx = document.createElement('canvas').getContext('2d')!
    const cs = getComputedStyle(input)
    cx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const caret = ir.left + cx.measureText(input.value).width
    left = Math.max(wr.left + MENU_INSET, caret - MENU_WIDTH)
  }
  root.value.style.setProperty('--menu-dx', `${left - cr.left}px`)
}
function onQuery(q: string) {
  query.value = q
  nextTick(placeMenu)
}

const root = ref<HTMLElement | null>(null)
</script>

<template>
  <section
    ref="root"
    class="email-composer absolute bottom-6 right-6 z-20 flex flex-col overflow-hidden rounded-7 bg-surface-elevation-1 shadow-2xl dark:shadow-[inset_0_0.5px_1.5px_0.5px_#ffffff0f,0_0_14px_10px_#0000001f,0_44px_52px_-4px_#0000006b]"
    :class="[
      expanded ? 'left-6 top-6' : 'h-[540px] w-[600px]',
      quiet && 'is-quiet',
    ]"
    aria-label="New message"
  >
    <!-- the header: the title, then pop out and close -->
    <header
      class="flex h-12 shrink-0 items-center justify-between bg-surface-gray-1 pl-4 pr-2.5"
    >
      <h2 class="text-lg-medium text-ink-gray-8">New message</h2>
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          :label="expanded ? 'Shrink' : 'Pop out'"
          @click="expanded = !expanded"
        >
          <template #icon>
            <ComposerIcon
              :name="expanded ? 'compact' : 'arrow-up-right'"
              class="size-4"
            />
          </template>
        </Button>
        <Button variant="ghost" size="sm" label="Close" @click="emit('close')">
          <template #icon>
            <ComposerIcon name="small-close" class="size-4" />
          </template>
        </Button>
      </div>
    </header>

    <!--
      To. The row holds its top, not its middle: when the chips run to a
      second line the glyph and Cc/Bcc stay with the first line, where they
      were, rather than sliding down to the middle of two. The glyph's 6 is
      what centres it on that 28px first line.

      Cc and Bcc pressed are the word alone stepping up to ink-gray-7 — no
      fill (the user's call over the file's surface-gray-4 pill).

      11.2 on the right, not the file's 12: the file sets the button's box
      12 in, which leaves the word's ink 0.6 short of the close glyph's in
      the header above. The button keeps its own 8 either side, so the
      pressed pill is unchanged; only where it sits moves.
    -->
    <div
      class="flex shrink-0 items-start gap-2 border-b border-outline-gray-1 py-1.5 pl-2 pr-[11.2px]"
    >
      <span
        :ref="(el) => (fieldEls.to = el as HTMLElement)"
        class="composer-field flex min-w-0 flex-1 items-start gap-2 pl-2"
        @focusin="editing = 'to'"
        @focusout="leaveField('to')"
      >
        <ComposerIcon
          name="person"
          class="mt-1.5 size-4 transition-colors"
          :class="glyphInk(fieldFilled('to', to))"
        />
        <!-- the line takes no focus of its own: a press that focused it would
             open the field under the pointer before the click could land -->
        <button
          v-if="groupFolded"
          type="button"
          data-slot="folded-recipients"
          class="h-7 min-w-0 flex-1 truncate text-left text-base text-ink-gray-7"
          @mousedown.prevent
          @click="openGroup"
        >
          <template v-for="(g, i) in foldedGroups" :key="g.label">
            <span v-if="i" aria-hidden="true">&ensp;</span>
            <span v-if="g.label" class="mr-1 text-ink-gray-5">{{
              g.label
            }}</span
            >{{ g.text }}
          </template>
        </button>
        <button
          v-else-if="folded('to', to)"
          type="button"
          class="h-7 min-w-0 flex-1 truncate text-left text-base text-ink-gray-7"
          @mousedown.prevent
          @click="openField('to')"
        >
          {{ to.map(nameOf).join(', ') }}
        </button>
        <MultiEmailInput
          v-else
          :ref="(el) => (fieldRefs.to = el as any)"
          v-model="to"
          class="min-w-0 flex-1"
          size="sm"
          placeholder="Recipients"
          aria-label="Recipients"
          :options="matches"
          :portal-to="root ?? undefined"
          :offset="0"
          @update:query="onQuery"
          @focus="nextTick(placeMenu)"
        >
          <template #tag="{ value, option, removeTag }">
            <Avatar
              size="xs"
              class="shrink-0"
              :label="option?.label ?? nameOf(value)"
              :image="option?.avatar"
            />
            <span
              data-part="chip-label"
              class="truncate text-sm text-ink-gray-7"
              >{{ option?.label ?? nameOf(value) }}</span
            >
            <button
              type="button"
              class="flex size-3 shrink-0 items-center justify-center text-ink-gray-7 hover:text-ink-gray-8"
              :aria-label="`Remove ${option?.label ?? value}`"
              @click.stop="removeTag()"
            >
              <ComposerIcon name="small-close" class="size-3" />
            </button>
          </template>
          <template #item-prefix="{ item }">
            <Avatar size="xl" :label="item.label" :image="item.avatar" />
          </template>
          <template #item-label="{ item }">
            <span class="flex min-w-0 flex-col">
              <span
                data-part="name"
                class="truncate text-base leading-[1.15] text-ink-gray-8"
                >{{ item.label }}</span
              >
              <span
                data-part="mail"
                class="mt-0.5 truncate text-sm leading-[1.15] text-ink-gray-6"
                >{{ item.value }}</span
              >
            </span>
          </template>
        </MultiEmailInput>
      </span>
      <div class="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          label="Cc"
          :class="showCc ? '!text-ink-gray-7' : '!text-ink-gray-5'"
          :aria-pressed="showCc"
          @click="toggleRow('cc')"
        />
        <Button
          variant="ghost"
          size="sm"
          label="Bcc"
          :class="showBcc ? '!text-ink-gray-7' : '!text-ink-gray-5'"
          :aria-pressed="showBcc"
          @click="toggleRow('bcc')"
        />
      </div>
    </div>

    <!-- Cc and Bcc: the same row without the buttons -->
    <div
      v-for="row in [
        ['cc', 'Cc', showCc, cc, (v: string[]) => (cc = v)],
        ['bcc', 'Bcc', showBcc, bcc, (v: string[]) => (bcc = v)],
      ] as const"
      v-show="row[2] && !groupFolded"
      :key="row[0]"
      class="flex shrink-0 items-start gap-2 border-b border-outline-gray-1 px-2 py-1.5"
    >
      <span
        :ref="(el) => (fieldEls[row[0]] = el as HTMLElement)"
        class="composer-field flex min-w-0 flex-1 items-start gap-2 pl-2"
        @focusin="editing = row[0]"
        @focusout="leaveField(row[0])"
      >
        <ComposerIcon
          name="people"
          class="mt-1.5 size-4 transition-colors"
          :class="glyphInk(fieldFilled(row[0], row[3]))"
        />
        <button
          v-if="folded(row[0], row[3])"
          type="button"
          class="h-7 min-w-0 flex-1 truncate text-left text-base text-ink-gray-7"
          @mousedown.prevent
          @click="openField(row[0])"
        >
          {{ row[3].map(nameOf).join(', ') }}
        </button>
        <MultiEmailInput
          v-else
          :ref="(el) => (fieldRefs[row[0]] = el as any)"
          :model-value="row[3]"
          class="min-w-0 flex-1"
          size="sm"
          :placeholder="row[1]"
          :aria-label="row[1]"
          :options="matches"
          :portal-to="root ?? undefined"
          :offset="0"
          @update:model-value="row[4]"
          @update:query="onQuery"
          @focus="nextTick(placeMenu)"
        >
          <template #tag="{ value, option, removeTag }">
            <Avatar
              size="xs"
              class="shrink-0"
              :label="option?.label ?? nameOf(value)"
              :image="option?.avatar"
            />
            <span
              data-part="chip-label"
              class="truncate text-sm text-ink-gray-7"
              >{{ option?.label ?? nameOf(value) }}</span
            >
            <button
              type="button"
              class="flex size-3 shrink-0 items-center justify-center text-ink-gray-7 hover:text-ink-gray-8"
              :aria-label="`Remove ${option?.label ?? value}`"
              @click.stop="removeTag()"
            >
              <ComposerIcon name="small-close" class="size-3" />
            </button>
          </template>
          <template #item-prefix="{ item }">
            <Avatar size="xl" :label="item.label" :image="item.avatar" />
          </template>
          <template #item-label="{ item }">
            <span class="flex min-w-0 flex-col">
              <span
                data-part="name"
                class="truncate text-base leading-[1.15] text-ink-gray-8"
                >{{ item.label }}</span
              >
              <span
                data-part="mail"
                class="mt-0.5 truncate text-sm leading-[1.15] text-ink-gray-6"
                >{{ item.value }}</span
              >
            </span>
          </template>
        </MultiEmailInput>
      </span>
    </div>

    <!-- Subject -->
    <div class="shrink-0 border-b border-outline-gray-1 px-2 py-1.5">
      <TextInput
        v-model="subject"
        variant="ghost"
        size="sm"
        class="w-full"
        placeholder="Subjects"
        aria-label="Subject"
      >
        <template #prefix>
          <ComposerIcon
            name="subject"
            class="size-4 transition-colors"
            :class="glyphInk(subject.trim() !== '')"
          />
        </template>
      </TextInput>
    </div>

    <!-- the message, and under it whatever is attached -->
    <div class="composer-body flex min-h-0 flex-1 flex-col overflow-y-auto">
      <Editor
        ref="editorRef"
        v-model="body"
        :extensions="extensions"
        :upload-function="uploadFunction"
        placeholder="Type a message..."
      >
        <EditorContent class="flex-1 p-4 [--prose-font-size:14px]" />
      </Editor>
      <div
        v-if="attachments.length"
        class="flex shrink-0 flex-wrap items-center gap-1 px-4 pb-4"
      >
        <span
          v-for="(file, i) in attachments"
          :key="file.name + i"
          data-slot="attachment"
          class="flex h-6 max-w-full items-center gap-1 rounded-3 border border-outline-gray-2 pl-[5px] pr-[3px] transition-colors hover:border-outline-gray-3"
        >
          <ComposerIcon name="file" class="size-4 text-ink-gray-7" />
          <span class="truncate text-sm text-ink-gray-7">{{ file.name }}</span>
          <button
            type="button"
            class="flex size-3 shrink-0 items-center justify-center text-ink-gray-7 hover:text-ink-gray-8"
            :aria-label="`Remove ${file.name}`"
            @click="detach(i)"
          >
            <ComposerIcon name="small-close" class="size-3" />
          </button>
        </span>
      </div>
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        aria-hidden="true"
        tabindex="-1"
        @change="takeFiles"
      />
    </div>

    <!--
      The toolbar. Send is one solid pill in two parts: the word sends, the
      chevron beside it opens the file's one-row menu (Schedule send) above
      the button, and turns up while it is open. Then the file's glyphs,
      each running the editor's own command: text colour (the library's
      picker), attach (the system's file dialog, the file as a chip under
      the message), link (the library's link popover on the selection), emoji (the
      popover example's picker, exactly), Drive and More (nothing yet),
      image (the system's dialog, the picture inline). The bin at the far
      end discards.
    -->
    <!--
      The glyph buttons keep their press to themselves (`mousedown.prevent`):
      the caret and the selection stay in the message, which is what colour,
      link and emoji act on, and what the link popover anchors to.
    -->
    <div class="flex h-14 shrink-0 items-center justify-between px-4 pb-4 pt-3">
      <div class="flex items-center gap-1">
        <!--
          Send (node 35730:62544): two solid buttons laid side by side — the
          word, 50 wide with 8 either side and the right corners square, and
          the chevron, 24 wide with 4 either side and the left corners
          square, parted by a 1px line in the pill's own lighter grey. The
          pair is the menu's anchor so the menu hangs from the pill's left
          edge; the word keeps its press to itself and sends, the chevron
          opens Schedule send and turns up while it is open.
        -->
        <Dropdown :options="sendOptions" side="top" align="start" :offset="4">
          <template #trigger="{ open }">
            <div class="flex items-center">
              <Button
                size="sm"
                variant="solid"
                label="Send"
                class="!w-[50px] !rounded-r-none !px-2"
                @pointerdown.stop
                @click.stop="send"
              />
              <Button
                size="sm"
                variant="solid"
                label="Send options"
                class="send-chevron !w-6 !rounded-l-none !pl-[3px] !pr-1"
                :class="open && '!bg-surface-gray-9'"
              >
                <template #icon>
                  <ComposerIcon
                    :name="open ? 'small-up' : 'send-chevron'"
                    class="size-4"
                  />
                </template>
              </Button>
            </div>
          </template>
        </Dropdown>

        <Button
          variant="ghost"
          size="sm"
          class="!text-ink-gray-7"
          label="Text colour"
          @mousedown.prevent
          @click="pickColour"
        >
          <template #icon>
            <ComposerIcon name="text-colour" class="size-4" />
          </template>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="!text-ink-gray-7"
          label="Attach a file"
          @mousedown.prevent
          @click="attachFile"
        >
          <template #icon>
            <ComposerIcon name="attachment" class="size-4" />
          </template>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="!text-ink-gray-7"
          label="Link"
          @mousedown.prevent
          @click="insertLink"
        >
          <template #icon>
            <ComposerIcon name="link" class="size-4" />
          </template>
        </Button>
        <Popover side="top" align="start" :offset="6" bare>
          <template #trigger="{ open }">
            <Button
              variant="ghost"
              size="sm"
              class="!text-ink-gray-7"
              :class="open && '!bg-surface-gray-3'"
              label="Emoji"
              @mousedown.prevent
            >
              <template #icon>
                <ComposerIcon name="emoji" class="size-4" />
              </template>
            </Button>
          </template>
          <template #default="{ close }">
            <EmojiPicker @pick="(e: string) => (insertEmoji(e), close())" />
          </template>
        </Popover>
        <Button
          variant="ghost"
          size="sm"
          class="!text-ink-gray-7"
          label="Insert from Drive"
        >
          <template #icon>
            <ComposerIcon name="folder" class="size-4" />
          </template>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="!text-ink-gray-7"
          label="Image"
          @mousedown.prevent
          @click="insertImage"
        >
          <template #icon>
            <ComposerIcon name="image" class="size-4" />
          </template>
        </Button>
        <Dropdown :options="moreOptions" side="top" align="start" :offset="4">
          <Button
            variant="ghost"
            size="sm"
            class="!text-ink-gray-7"
            label="More"
            @mousedown.prevent
          >
            <template #icon>
              <ComposerIcon name="dot-vertical" class="size-4" />
            </template>
          </Button>
        </Dropdown>
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="!text-ink-gray-5"
        label="Discard"
        @click="discard"
      >
        <template #icon>
          <ComposerIcon name="delete" class="size-4" />
        </template>
      </Button>
    </div>
  </section>
</template>

<style scoped>
/*
  MultiEmailInput, dressed to the file. Its own control is a filled, ringed
  box with padded chips; here it is a ghost field inside a row that already
  carries the glyph and the padding, so the box goes bare.
*/
.composer-field :deep([data-slot='control']) {
  min-height: 28px;
  gap: 4px;
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none !important;
}
.composer-field :deep([data-slot='input']) {
  /* sized to what is typed (never narrower than 4rem), so a long address
     wraps to the next line rather than scrolling inside a fixed box */
  field-sizing: content;
  flex: 1 1 auto;
  min-width: 4rem;
  max-width: 100%;
  padding: 0;
  color: var(--ink-gray-7);
}
/* the tag, md outline (the set's size=md, variant=outline — the user's
   call over the states node's subtle): 24 tall, radius 6, a 1px
   outline-gray-2 line and no fill, 6 in front and 4 behind measured from
   the outer edge, 4 between its parts, a 16px face */
.composer-field :deep([data-slot='tag']) {
  height: 24px;
  gap: 4px;
  padding: 0 3px 0 5px;
  border: 1px solid var(--outline-gray-2);
  border-radius: var(--radius-3);
  background: transparent;
  transition: border-color 75ms;
}
/* pointed at (node 35757:137715): the line steps up to outline-gray-3 */
.composer-field :deep([data-slot='tag']:hover) {
  border-color: var(--outline-gray-3);
}
/* the menu: 280 wide, radius 10, the xl elevation, 4 of padding, moved
   along to the caret by `placeMenu` */
.email-composer :deep([data-slot='content']) {
  width: 280px;
  min-width: 280px;
  margin-left: var(--menu-dx, 0px);
  border-radius: var(--radius-5);
  background: var(--surface-elevation-2);
  box-shadow: var(--elevation-xl);
}
/* nothing typed, or nothing to offer (a letter that only matches people
   already picked would leave the component's "No results"): no menu,
   whatever the component thinks — it lays the menu out inline, hence the
   !important */
.email-composer.is-quiet :deep([data-slot='content']),
.email-composer :deep([data-slot='content']:not(:has([data-slot='item']))) {
  display: none !important;
}
/* only the "Add …" row (node 35740:62909): the menu hugs its label */
.email-composer
  :deep(
    [data-slot='content']:not(:has([data-slot='item']:not([data-create])))
  ) {
  width: max-content;
  min-width: 0;
  max-width: 280px;
}
/* its list scrolls with a scrollbar that can be seen: the component hides
   it with an inline style, hence the !important */
.email-composer :deep([data-slot='content'] > div) {
  scrollbar-width: thin !important;
  scrollbar-color: var(--outline-gray-3) transparent;
}
/* a row: 8 of padding, radius 10, 1 to the next, surface-gray-2 under the
   pointer, and always 49 tall — the "Add …" row has one line where a person
   has two, and must not be a different height.
   The row shell inside carries its own 8/6 and a floor of 28; the 8 here is
   the row's whole inset, so those go. */
.email-composer :deep([data-slot='item']) {
  display: flex;
  align-items: center;
  min-height: 49px;
  padding: 8px;
  border-radius: var(--radius-5);
}
.email-composer :deep([data-slot='item-list-row']) {
  min-height: 0;
  padding: 0;
}
.email-composer :deep([data-slot='item'] + [data-slot='item']) {
  margin-top: 1px;
}
/* the "Add …" row is the file's one-line item (node 35740:62909): 28 tall,
   6/8 inside, radius 8, a 16px glyph 6 before 14px text */
.email-composer :deep([data-slot='item'][data-create]) {
  min-height: 28px;
  padding: 6px 8px;
  border-radius: var(--radius-4);
}
.email-composer
  :deep([data-slot='item'][data-create] [data-slot='item-list-row']) {
  gap: 6px;
  line-height: 1.15;
}
.email-composer
  :deep([data-slot='item'][data-create] [data-slot='item-prefix'] > span) {
  width: 16px;
  height: 16px;
}
.email-composer :deep([data-slot='item'][data-highlighted]) {
  background: var(--surface-gray-2);
}

/* the line between Send and its chevron: 1px outline-gray-7 (#383838 in
   the file), inside the chevron's box as the file strokes it; 3 of padding
   beside it so the glyph still sits 4 in */
.send-chevron {
  border-left: 1px solid var(--outline-gray-7);
}

/* the subject's text is ink-gray-7, as the file fills it */
.email-composer :deep(input[type='text']) {
  color: var(--ink-gray-7);
}

/* the body: 14 on a 21px line. The editor is a flex child that grows, so
   the whole box takes the caret and the chips still fit under it. */
.composer-body :deep(.ProseMirror) {
  line-height: 1.5;
}
.composer-body :deep(.ProseMirror p) {
  margin: 0;
}
/* the run a link is being made for, painted while the popup has the focus */
.composer-body :deep(.composer-held-selection) {
  background: color-mix(in srgb, Highlight 35%, transparent);
}
</style>

<style>
/*
  The library's editor popovers — the colour picker and the link popup —
  wear the 2xl elevation inside a 1px outline-gray-2 border. The design
  draws every popover the way the popover examples do: the lg shadow and
  no border at all (the shadow's own 1.5px 18% layer is the edge). While
  the composer is up they take that. Unscoped on purpose: both popups are
  portaled to the body.
*/
body:has(.email-composer) .editor-popover {
  border: 0;
  box-shadow: var(--elevation-lg);
}
</style>
