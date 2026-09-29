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
    class="flex h-full flex-wrap items-start justify-center gap-10 px-5 py-10"
  >
    <!-- the controller -->
    <div
      class="flex w-[362px] flex-col gap-4 rounded-6 border border-outline-gray-1 bg-surface-elevation-2 p-4 dark:border-outline-gray-2 dark:bg-surface-elevation-1"
    >
      <div class="flex flex-col gap-1">
        <p class="text-lg-medium text-ink-gray-8">Colour picker</p>
        <p class="text-p-sm text-ink-gray-5">
          Switch the card's parts on and off; pick on the right.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <Switch v-model="tabs" size="sm" label="Tabs" />
        <Switch v-model="hueLabel" size="sm" label="Hue label" />
        <Switch v-model="eyedropper" size="sm" label="Eyedropper" />
        <Switch v-model="alpha" size="sm" label="Opacity" />
        <Switch v-model="inputs" size="sm" label="Inputs" />
        <Switch v-model="saved" size="sm" label="Saved" />
      </div>

      <!-- the value: a 330 × 60 preview, and the CSS under it -->
      <div class="flex flex-col gap-2">
        <div
          class="h-[60px] w-[330px] rounded-4 border border-outline-gray-2"
          :style="{
            background: value
              ? `${layer(value)}${mode === 'image' ? ' center / cover' : ''}, ${CHECKER}`
              : CHECKER,
          }"
          aria-hidden="true"
        />
        <div class="flex items-center gap-3">
          <code class="min-w-0 flex-1 truncate text-p-sm text-ink-gray-6">
            {{ value || 'No image yet' }}
          </code>
          <Button variant="subtle" size="sm" @click="picker?.loadSample()">
            Sample photo
          </Button>
        </div>
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
