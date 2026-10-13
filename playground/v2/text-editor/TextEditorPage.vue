<script setup lang="ts">
// The Text editor page: one editor — the file's "text-editor new"
// (espresso-2.0 › input texteditor & richtext, 31404:72705) — and beside
// it the controls that pick which of the file's editors it is: outline,
// subtle or ghost; the bar on top or at the bottom; empty or filled;
// enabled or disabled. Hover, focus and typing are the editor's own, live.
// The controls are the preview control's card and rows (35537:171483).
import { computed, ref } from 'vue'
import PreviewSelectRow from '../PreviewSelectRow.vue'
import PreviewSwitchRow from '../PreviewSwitchRow.vue'
import TeField from './TeField.vue'

const FILLED =
  '<p>Typography is the art of arranging type to make written language legible, readable, and visually appealing. It involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing to create a harmonious and effective design.</p>'
// the ghost editor stands on its own text, as the file fills it
const GHOST =
  "<p>Typography is the art of arranging type to make written language legible, readable, and visually appealing. It involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing to create a harmonious and effective design. Good typography enhances communication by guiding the reader's eye and emphasising important information. It also sets the tone and mood of the text Good typography enhances communication by guiding the reader's eye and emphasising important</p>"

const variant = ref<'outline' | 'subtle' | 'ghost'>('outline')
const toolbar = ref<'top' | 'bottom'>('top')
const filled = ref(false)
const disabled = ref(false)

const VARIANTS = [
  { label: 'Outline', value: 'outline' },
  { label: 'Subtle', value: 'subtle' },
  { label: 'Ghost', value: 'ghost' },
]
const TOOLBARS = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
]

const ghost = computed(() => variant.value === 'ghost')
const content = computed(() =>
  ghost.value ? GHOST : filled.value ? FILLED : '',
)
// the editor takes its text when it is made, so a change of what it holds
// makes it afresh; a change of how it is drawn does not
const key = computed(() => (ghost.value ? 'ghost' : String(filled.value)))
</script>

<template>
  <div class="v2-scroll h-full overflow-y-auto">
    <div class="te-page">
      <header class="flex flex-col gap-1">
        <h1 class="text-4xl-semibold text-ink-gray-9">Text editor</h1>
        <p class="text-p-base text-ink-gray-6">
          {{
            ghost
              ? 'Select some text to raise the bar over it.'
              : 'Pick the editor with the controls beside it.'
          }}
        </p>
      </header>

      <div class="te-stage">
        <div class="te-preview" :class="ghost && 'is-ghost'">
          <TeField
            :key="key"
            :variant="variant"
            :toolbar="ghost ? 'none' : toolbar"
            :content="content"
            :disabled="disabled"
          />
        </div>

        <!-- the preview control's card, in the page rather than over it -->
        <aside class="te-controls" aria-label="Controls">
          <p class="text-lg-semibold leading-[18.4px] text-ink-gray-9">
            Controls
          </p>
          <div class="flex flex-col gap-3">
            <p class="text-sm leading-[15px] text-ink-gray-5">Editor</p>
            <div class="flex flex-col gap-2">
              <PreviewSelectRow
                v-model="variant"
                label="Variant"
                :options="VARIANTS"
              />
              <PreviewSelectRow
                v-if="!ghost"
                v-model="toolbar"
                label="Toolbar"
                :options="TOOLBARS"
              />
            </div>
            <hr class="v2-preview-rule border-outline-gray-1" />
            <p class="text-sm leading-[15px] text-ink-gray-5">State</p>
            <div class="flex flex-col gap-2">
              <PreviewSwitchRow
                v-model="filled"
                label="Filled"
                :disabled="ghost"
              />
              <PreviewSwitchRow v-model="disabled" label="Disabled" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style>
/* 604 + 40 + 272 across, 24 in either side */
.te-page {
  @apply mx-auto flex w-full max-w-[964px] flex-col gap-10 px-6 py-12;
}
/* the editor at the file's 600 (the ghost's 604), the controls 272 beside
   it, 40 apart; short of room, one over the other */
.te-stage {
  @apply flex flex-wrap items-start gap-10;
}
.te-preview {
  @apply min-w-0 max-w-[600px] flex-1 basis-[480px];
}
.te-preview.is-ghost {
  @apply max-w-[604px];
}
.te-controls {
  @apply sticky top-6 flex w-[272px] shrink-0 flex-col gap-4 rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 pb-[13px] pt-4;
}
</style>
