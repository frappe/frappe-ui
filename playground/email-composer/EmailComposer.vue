<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Button, Dropdown, Popover, TextInput } from '../../src'
import { Editor, EditorContent, RichTextKit } from '../../src/molecules/editor'
import type { TiptapEditor } from '../../src/molecules/editor'
import { FontColor, InsertLink } from '../../src/molecules/editor/menu'
import ComposerIcon from './ComposerIcon.vue'
import EmojiPicker from '../v2/popover/EmojiPicker.vue'
import { MultiEmailInput } from '../../experimental/MultiEmailInput'
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
 * chips are Espresso's `tag` (md, subtle — node 35730:62525: 24 tall,
 * radius 6, surface-gray-2, 6 in front and 4 behind, a 16px face, a 13px
 * ink-gray-7 label, a 12px close), and the menu is its `dropdown` (280 wide, radius 10, 4 of padding,
 * 49px rows 1 apart with a 32px face, the name over the address, the
 * pointed-at row on surface-gray-2).
 *
 * One thing the file draws that the component can't: it hangs the menu under
 * the caret, wherever the typing has reached. MultiEmailInput anchors it to
 * the field, so here it opens under the field's left edge.
 */

const emit = defineEmits<{ close: [] }>()

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

const to = ref<string[]>([])
const cc = ref<string[]>([])
const bcc = ref<string[]>([])
const showCc = ref(false)
const showBcc = ref(false)
const subject = ref('')
const body = ref('')

/**
 * The suggestions for whichever field is being typed in: the people whose
 * name or address carries the query. The component hides the ones already
 * chosen in that field itself.
 */
const query = ref('')
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return people
  return people.filter(
    (p) => p.label.toLowerCase().includes(q) || p.value.includes(q),
  )
})

const extensions = [RichTextKit.configure({ mention: false, tag: false })]

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
  if (editor) InsertLink.action(editor)
}
function insertEmoji(emoji: string) {
  chain().insertContent(emoji).run()
}
const attachFile = () => chain().selectAndUploadFile().run()
const insertImage = () => chain().selectAndUploadImage().run()

/** The menu under Send's chevron: the file's one row. */
const sendOptions = [{ label: 'Schedule send', onClick: () => schedule() }]
function schedule() {
  // nothing behind it yet: a scheduled message leaves the way a sent one does
  send()
}

/** Pop out: the window takes the whole stage, 24 in on every side. */
const expanded = ref(false)

function reset() {
  to.value = []
  cc.value = []
  bcc.value = []
  showCc.value = false
  showBcc.value = false
  subject.value = ''
  body.value = ''
}

function send() {
  reset()
  emit('close')
}

function discard() {
  reset()
  emit('close')
}

const root = ref<HTMLElement | null>(null)
</script>

<template>
  <section
    ref="root"
    class="email-composer absolute bottom-6 right-6 z-20 flex flex-col overflow-hidden rounded-7 bg-surface-elevation-1 shadow-2xl dark:shadow-[inset_0_0.5px_1.5px_0.5px_#ffffff0f,0_0_14px_10px_#0000001f,0_44px_52px_-4px_#0000006b]"
    :class="expanded ? 'left-6 top-6' : 'h-[540px] w-[600px]'"
    aria-label="New message"
  >
    <!-- the header: the title, then pop out and close -->
    <header
      class="flex h-12 shrink-0 items-center justify-between bg-surface-gray-1 pl-4 pr-3"
    >
      <h2 class="text-lg-medium text-ink-gray-8">New message</h2>
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          :label="expanded ? 'Shrink' : 'Pop out'"
          @click="expanded = !expanded"
        >
          <template #icon>
            <ComposerIcon name="arrow-up-right" class="size-3.5" />
          </template>
        </Button>
        <Button variant="ghost" size="xs" label="Close" @click="emit('close')">
          <template #icon>
            <ComposerIcon name="small-close" class="size-3.5" />
          </template>
        </Button>
      </div>
    </header>

    <!--
      To. The row holds its top, not its middle: when the chips run to a
      second line the glyph and Cc/Bcc stay with the first line, where they
      were, rather than sliding down to the middle of two. The glyph's 6 is
      what centres it on that 28px first line.

      11.4 on the right, not the file's 12: the file sets the button's box
      12 in, which leaves the word's ink 0.6 short of the close glyph's in
      the header above. The button keeps its own 8 either side, so the
      pressed pill is unchanged; only where it sits moves.
    -->
    <div
      class="flex shrink-0 items-start gap-2 border-b border-outline-gray-1 py-1.5 pl-2 pr-[11.4px]"
    >
      <span class="composer-field flex min-w-0 flex-1 items-start gap-2 pl-2">
        <ComposerIcon name="person" class="mt-1.5 size-4 text-ink-gray-7" />
        <MultiEmailInput
          v-model="to"
          class="min-w-0 flex-1"
          size="sm"
          placeholder="Recipients"
          aria-label="Recipients"
          :options="matches"
          :portal-to="root ?? undefined"
          :offset="0"
          @update:query="query = $event"
        >
          <template #tag="{ value, option, removeTag }">
            <Avatar
              size="xs"
              class="shrink-0"
              :label="option?.label ?? value"
              :image="option?.avatar"
            />
            <span
              data-part="chip-label"
              class="truncate text-sm text-ink-gray-7"
              >{{ option?.label ?? value }}</span
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
          :class="
            showCc ? '!bg-surface-gray-4 !text-ink-gray-7' : '!text-ink-gray-5'
          "
          :aria-pressed="showCc"
          @click="showCc = !showCc"
        />
        <Button
          variant="ghost"
          size="sm"
          label="Bcc"
          :class="
            showBcc ? '!bg-surface-gray-4 !text-ink-gray-7' : '!text-ink-gray-5'
          "
          :aria-pressed="showBcc"
          @click="showBcc = !showBcc"
        />
      </div>
    </div>

    <!-- Cc and Bcc: the same row without the buttons -->
    <div
      v-for="row in [
        ['Cc', showCc, cc, (v: string[]) => (cc = v)],
        ['Bcc', showBcc, bcc, (v: string[]) => (bcc = v)],
      ] as const"
      v-show="row[1]"
      :key="row[0]"
      class="flex shrink-0 items-start gap-2 border-b border-outline-gray-1 px-2 py-1.5"
    >
      <span class="composer-field flex min-w-0 flex-1 items-start gap-2 pl-2">
        <ComposerIcon name="people" class="mt-1.5 size-4 text-ink-gray-7" />
        <MultiEmailInput
          :model-value="row[2]"
          class="min-w-0 flex-1"
          size="sm"
          :placeholder="row[0]"
          :aria-label="row[0]"
          :options="matches"
          :portal-to="root ?? undefined"
          :offset="0"
          @update:model-value="row[3]"
          @update:query="query = $event"
        >
          <template #tag="{ value, option, removeTag }">
            <Avatar
              size="xs"
              class="shrink-0"
              :label="option?.label ?? value"
              :image="option?.avatar"
            />
            <span
              data-part="chip-label"
              class="truncate text-sm text-ink-gray-7"
              >{{ option?.label ?? value }}</span
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
          <ComposerIcon name="subject" class="size-4 text-ink-gray-7" />
        </template>
      </TextInput>
    </div>

    <!-- the message -->
    <div class="composer-body min-h-0 flex-1 overflow-y-auto">
      <Editor
        ref="editorRef"
        v-model="body"
        :extensions="extensions"
        :upload-function="uploadFunction"
        placeholder="Type a message..."
      >
        <EditorContent class="min-h-full p-4 [--prose-font-size:14px]" />
      </Editor>
    </div>

    <!--
      The toolbar. Send is one solid pill in two parts: the word sends, the
      chevron beside it opens the file's one-row menu (Schedule send) above
      the button, and turns up while it is open. Then the file's glyphs,
      each running the editor's own command: text colour (the library's
      picker), attach (the system's file dialog, the file as an attachment
      block), link (the library's link popover on the selection), emoji (the
      popover example's picker, exactly), Drive and More (nothing yet),
      image (the system's dialog, the picture inline). The bin at the far
      end discards.
    -->
    <div class="flex h-14 shrink-0 items-center justify-between px-4 pb-4 pt-3">
      <div class="flex items-center gap-1">
        <!--
          The whole pill is the menu's anchor, so the menu hangs from its
          left edge as the file draws it; the word itself keeps the press
          to itself and sends.
        -->
        <Dropdown :options="sendOptions" side="top" align="start" :offset="4">
          <template #trigger="{ open }">
            <div class="flex items-center">
              <Button
                size="sm"
                variant="solid"
                label="Send"
                class="!rounded-r-none !pr-1"
                @pointerdown.stop
                @click.stop="send"
              />
              <Button
                size="sm"
                variant="solid"
                label="Send options"
                class="!rounded-l-none !pl-1 !pr-2"
                :class="open && '!bg-surface-gray-9'"
              >
                <template #icon>
                  <ComposerIcon
                    :name="open ? 'small-up' : 'small-down'"
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
          @click="insertImage"
        >
          <template #icon>
            <ComposerIcon name="image" class="size-4" />
          </template>
        </Button>
        <Button variant="ghost" size="sm" class="!text-ink-gray-7" label="More">
          <template #icon>
            <ComposerIcon name="dot-vertical" class="size-4" />
          </template>
        </Button>
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
  min-width: 4rem;
  padding: 0;
  color: var(--ink-gray-7);
}
/* the tag, md (node 35730:62525): 24 tall, radius 6, 6 in front and 4
   behind, 4 between its parts, a 16px face */
.composer-field :deep([data-slot='tag']) {
  height: 24px;
  gap: 4px;
  padding: 0 4px 0 6px;
  border: 0;
  border-radius: var(--radius-3);
  background: var(--surface-gray-2);
}
/* the menu: 280 wide, radius 10, the xl elevation, 4 of padding */
.email-composer :deep([data-slot='content']) {
  width: 280px;
  min-width: 280px;
  border-radius: var(--radius-5);
  background: var(--surface-elevation-2);
  box-shadow: var(--elevation-xl);
}
/* a row: 8 of padding, radius 10, 1 to the next, surface-gray-2 under the pointer.
   The row shell inside carries its own 8/6 and a floor of 28; the 8 here is
   the row's whole inset, so those go. */
.email-composer :deep([data-slot='item']) {
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
.email-composer :deep([data-slot='item'][data-highlighted]) {
  background: var(--surface-gray-2);
}

/* the subject's text is ink-gray-7, as the file fills it */
.email-composer :deep(input[type='text']) {
  color: var(--ink-gray-7);
}

/* the body: 14 on a 21px line, and the whole box takes the caret */
.composer-body :deep(.ProseMirror) {
  min-height: 100%;
  line-height: 1.5;
}
.composer-body :deep(.ProseMirror p) {
  margin: 0;
}
</style>
