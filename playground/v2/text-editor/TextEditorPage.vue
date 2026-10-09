<script setup lang="ts">
// The Text editor page: the file's "text-editor new" (espresso-2.0 ›
// input texteditor & richtext, 31404:72705) down one column, as the
// Popovers page lays its types out. Each section is one place for the bar
// — on top, at the bottom for a comment, or floating over a ghost editor —
// with the outline editor beside the subtle one, as the file sets them
// 600 wide in two columns: empty, filled, then disabled. Hover, focus and
// typing are the editors' own, live.
import TeField from './TeField.vue'

const FILLED =
  '<p>Typography is the art of arranging type to make written language legible, readable, and visually appealing. It involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing to create a harmonious and effective design.</p>'
const GHOST =
  "<p>Typography is the art of arranging type to make written language legible, readable, and visually appealing. It involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing to create a harmonious and effective design. Good typography enhances communication by guiding the reader's eye and emphasising important information. It also sets the tone and mood of the text Good typography enhances communication by guiding the reader's eye and emphasising important</p>"

const STATES = [
  { key: 'empty', content: '', disabled: false },
  { key: 'filled', content: FILLED, disabled: false },
  { key: 'disabled', content: '', disabled: true },
] as const
const VARIANTS = ['outline', 'subtle'] as const

const SECTIONS = [
  { id: 'toolbar-top', label: 'Toolbar on top', toolbar: 'top' },
  { id: 'toolbar-bottom', label: 'Toolbar at the bottom', toolbar: 'bottom' },
] as const
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections is-flow te-flow" data-sections>
      <header class="v2-flow-head">
        <h1 class="text-4xl-semibold text-ink-gray-9">Text editor</h1>
        <p class="text-p-base text-ink-gray-6">
          Every text editor type, down the page.
        </p>
      </header>

      <section
        v-for="s in SECTIONS"
        :id="s.id"
        :key="s.id"
        class="v2-section"
        data-section
        :data-label="s.label"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">{{ s.label }}</h2>
        <div class="te-grid">
          <template v-for="st in STATES" :key="st.key">
            <TeField
              v-for="v in VARIANTS"
              :key="`${st.key}-${v}`"
              :variant="v"
              :toolbar="s.toolbar"
              :content="st.content"
              :disabled="st.disabled"
            />
          </template>
        </div>
      </section>

      <section id="ghost" class="v2-section" data-section data-label="Ghost">
        <h2 class="text-3xl-semibold text-ink-gray-8">Ghost</h2>
        <p class="self-start text-p-base text-ink-gray-6">
          Select some text to raise the bar over it.
        </p>
        <div class="te-grid is-ghost">
          <TeField variant="ghost" toolbar="none" :content="GHOST" />
          <TeField variant="ghost" toolbar="none" :content="GHOST" disabled />
        </div>
      </section>
    </div>
  </div>
</template>

<style>
/* the file's two 600 columns, its rows 80 apart. The page takes the
   stage's width as the Cards page does; the file's 111 between the columns
   is the canvas's spacing, so here they sit 32 apart, ease under 600 when
   the stage is short of room, and stack once they would go under 480. */
.v2-sections.is-flow.te-flow > .v2-flow-head,
.v2-sections.is-flow.te-flow > .v2-section {
  max-width: 1232px;
}
.v2-sections.is-flow.te-flow > .v2-section {
  container-type: inline-size;
}
.te-grid {
  @apply grid w-full justify-center gap-x-8 gap-y-20 text-left;
  grid-template-columns: minmax(0, 600px);
}
/* the ghost editor is the file's 604: its text runs 580 between its 12s */
.te-grid.is-ghost {
  grid-template-columns: minmax(0, 604px);
}
@container (min-width: 992px) {
  .te-grid {
    grid-template-columns: repeat(2, minmax(0, 600px));
  }
  .te-grid.is-ghost {
    grid-template-columns: repeat(2, minmax(0, 604px));
  }
}
</style>
