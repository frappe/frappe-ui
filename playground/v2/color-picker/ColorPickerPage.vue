<script setup lang="ts">
// The Colour picker page: the controller on the left switches the card's
// parts on and off, the way the file lays out its ten variants, and the
// picker itself stands beside it, live — what it holds is shown under the
// controls as the CSS it would hand back.
import { ref } from 'vue'
import { Button, Switch } from '../../../src'
import ColorPicker from './ColorPicker.vue'
import { CHECKER, layer, type Mode } from './color'

const tabs = ref(true)
const hueLabel = ref(false)
const eyedropper = ref(true)
const alpha = ref(true)
const inputs = ref(true)
const saved = ref(true)

const picker = ref<InstanceType<typeof ColorPicker> | null>(null)
const value = ref('')
const mode = ref<Mode>('solid')
function onChange(v: string, m: Mode) {
  value.value = v
  mode.value = m
}
</script>

<template>
  <div
    class="flex h-full flex-wrap items-center justify-center gap-10 px-5 py-10"
  >
    <!-- the controller -->
    <div
      class="flex w-[360px] flex-col gap-4 rounded-6 border border-outline-gray-1 bg-surface-elevation-2 p-4 dark:border-outline-gray-2 dark:bg-surface-elevation-1"
    >
      <div class="flex flex-col gap-1">
        <p class="text-lg-medium text-ink-gray-8">Colour picker</p>
        <p class="text-p-sm text-ink-gray-5">
          Switch the card's parts on and off; pick on the right.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <Switch
          v-model="tabs"
          size="sm"
          label="Tabs"
          description="Solid, gradient and image across the top"
        />
        <Switch
          v-model="hueLabel"
          size="sm"
          label="Hue label"
          description="“Hue” and its degrees over the bar"
        />
        <Switch
          v-model="eyedropper"
          size="sm"
          label="Eyedropper"
          description="A button to pick from the screen"
        />
        <Switch
          v-model="alpha"
          size="sm"
          label="Opacity"
          description="A second bar under the hue"
        />
        <Switch
          v-model="inputs"
          size="sm"
          label="Inputs"
          description="Format select and its fields"
        />
        <Switch
          v-model="saved"
          size="sm"
          label="Saved"
          description="Kept colours, and Add"
        />
      </div>

      <div class="flex items-center gap-3">
        <span
          class="size-7 shrink-0 rounded-4 border border-outline-gray-2"
          :style="{
            background: value ? `${layer(value)}, ${CHECKER}` : CHECKER,
          }"
          :class="mode === 'image' && 'bg-cover bg-center'"
          aria-hidden="true"
        />
        <code class="min-w-0 flex-1 truncate text-p-sm text-ink-gray-6">
          {{ value || 'No image yet' }}
        </code>
        <Button variant="subtle" size="sm" @click="picker?.loadSample()">
          Sample photo
        </Button>
      </div>
    </div>

    <ColorPicker
      ref="picker"
      :tabs="tabs"
      :hue-label="hueLabel"
      :eyedropper="eyedropper"
      :alpha="alpha"
      :inputs="inputs"
      :saved="saved"
      @change="onChange"
    />
  </div>
</template>
