<script setup lang="ts">
import { computed, ref } from 'vue'
import { Textarea } from 'frappe-ui'
import {
  Editor,
  EditorContent,
  EditorFixedMenu,
  RichTextKit,
  Bold,
  Italic,
  InsertLink,
  BulletList,
  Separator,
} from 'frappe-ui/editor'

// Card 2: the same release note on both sides. The Editor formats it; in a
// Textarea people fall back to typing the formatting as symbols, which stay
// in the saved text. Both sides are live.
const extensions = [RichTextKit]
const toolbar = [Bold, Italic, InsertLink, Separator, BulletList]
const formatted = ref(
  '<p>This release makes <strong>imports faster</strong>:</p><ul><li><p>CSV files up to 50 MB</p></li><li><p>Progress shown while it runs</p></li></ul>',
)
const typedFormatting = ref(
  'This release makes **imports faster**:\n- CSV files up to 50 MB\n- Progress shown while it runs',
)

// Card 1 is live: a bio with a 160-character limit, partly written. Type past
// the limit on both sides. "Do" counts down as you go; "don't" says nothing
// until you're already over.
const LIMIT = 160
// Starts close to the limit, so "do" already shows how little room is left
// while "don't" shows nothing.
const start =
  'Product designer at Frappe. I write about forms, error messages and the small details that make software feel calm. Based in Mumbai, often on a bike.'
// Same message as the Bio example: it says how much to cut.
const tooLong = (n: number) =>
  n > LIMIT ? `Shorten your bio by ${n - LIMIT} characters.` : ''

const counted = ref(start)
const countedLeft = computed(() => LIMIT - counted.value.length)

const silent = ref(start)
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. With a limit, show how much room is left as people type, so they
         can trim as they go instead of meeting an error at submit. Same
         pattern as the Bio example: `description` counts down, and `error`
         takes its place past the limit. -->
    <Guideline
      layout="stack"
      caption="Show the character count before people hit a limit, not only once they pass it."
    >
      <template #do>
        <Textarea
          v-model="counted"
          label="Bio"
          :description="`${countedLeft} characters left`"
          :error="tooLong(counted.length)"
          class="w-80"
        />
      </template>
      <template #dont>
        <Textarea
          v-model="silent"
          label="Bio"
          :error="tooLong(silent.length)"
          class="w-80"
        />
      </template>
    </Guideline>

    <!-- 2. Use an editor for formatted text -->
    <Guideline
      layout="stack"
      caption="When long-form text needs formatting, like bold or lists, use the Editor instead."
    >
      <template #do>
        <Editor v-model="formatted" :extensions="extensions">
          <template #default>
            <div
              class="w-[440px] overflow-hidden rounded-6 border border-outline-gray-2 bg-surface-base"
            >
              <div class="border-b border-outline-gray-1 px-2 py-1.5">
                <EditorFixedMenu :items="toolbar" />
              </div>
              <EditorContent class="min-h-24 px-3 py-2 text-ink-gray-8" />
            </div>
          </template>
        </Editor>
      </template>
      <template #dont>
        <div class="w-[440px]">
          <Textarea
            v-model="typedFormatting"
            :rows="4"
            aria-label="Release note"
          />
        </div>
      </template>
    </Guideline>
  </div>
</template>

<style scoped>
/* Guideline previews sit inside `.not-prose` to keep the article's text
   styles out, and Tailwind Typography can't turn list styles back on in
   there, so the editor's bullets disappear. Restore them for this editor
   only. */
:deep([data-slot='editor-content'] ul) {
  list-style: disc;
  padding-left: 1.25em;
}
</style>
