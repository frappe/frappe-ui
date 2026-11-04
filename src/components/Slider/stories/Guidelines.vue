<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Slider, TextInput } from 'frappe-ui'

// These cards point things out rather than mark mistakes, so each shows one
// example with no do/don't mark. Every slider is live.

// Card 1: a field beside the slider for people who know the exact value.
// Builder pairs a number field with a slider on every range property. The
// field and the slider share one value.
const opacity = ref([100])
const temperature = ref([55])
function numberField(model: typeof opacity, max: number) {
  return computed({
    get: () => String(model.value[0]),
    set: (text: string) => {
      const n = Number(text)
      if (text !== '' && Number.isFinite(n)) {
        model.value = [Math.min(max, Math.max(0, n))]
      }
    },
  })
}
const opacityText = numberField(opacity, 100)
const temperatureText = numberField(temperature, 100)

// Card 2: the value sits in the label row, through the #label slot, so it's
// readable without dragging. Draw shows its transparency this way. The value
// is aria-hidden: the name stays "Session length", and each handle
// announces its own value.
const session = ref([10, 45])

// Card 3: volume and brightness are set by feel, not to an exact number.
const volume = ref([30])
const brightness = ref([60])
function nudgeVolume(by: number) {
  volume.value = [Math.min(100, Math.max(0, volume.value[0] + by))]
}

const labelClass = 'text-sm leading-tighter text-ink-gray-6'
const endLabels = 'flex justify-between text-xs text-ink-gray-5'
// The sun icons take a button's width, so both tracks start and end at the
// same place as Volume's, between its − and + buttons.
const iconBox = 'flex size-7 shrink-0 items-center justify-center'
const panel = 'flex flex-col gap-2 rounded-6 bg-surface-gray-1 px-3 py-2.5'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. A number field for an exact value, next to the slider for a
         rough one. Type in either field or drag either slider. -->
    <Guideline
      :mark="false"
      caption="Add a number field beside the slider. Some people know the exact value they want."
    >
      <template #do>
        <div class="flex w-72 flex-col gap-6">
          <div class="flex items-center gap-3">
            <span :class="[labelClass, 'w-16']">Opacity</span>
            <TextInput
              v-model="opacityText"
              type="number"
              class="w-16"
              aria-label="Opacity, percent"
            />
            <Slider v-model="opacity" class="flex-1" aria-label="Opacity" />
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-3">
              <span :class="labelClass">Temperature (°C)</span>
              <TextInput
                v-model="temperatureText"
                type="number"
                class="w-16"
                aria-label="Temperature, °C"
              />
            </div>
            <Slider v-model="temperature" aria-label="Temperature" />
            <div :class="endLabels" aria-hidden="true">
              <span>0°C</span>
              <span>100°C</span>
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 2. The value in the label row, so it can be read at a glance. -->
    <Guideline
      :mark="false"
      caption="Show the current value next to the slider, so people don't have to guess it."
    >
      <template #do>
        <Slider v-model="session" class="w-72" :min="0" :max="120" :step="5">
          <template #label>
            <span class="flex items-center justify-between">
              Session length
              <span class="tabular-nums text-ink-gray-8" aria-hidden="true">
                {{ session[0] }} – {{ session[1] }} min
              </span>
            </span>
          </template>
        </Slider>
      </template>
    </Guideline>

    <!-- 3. A slider suits a value set by feel. For an exact number, like a
         price or a quantity, a number field is quicker. -->
    <Guideline
      :mark="false"
      caption="Use a slider for settings where an approximate value is fine, like volume or brightness."
    >
      <template #do>
        <div class="flex w-72 flex-col gap-3">
          <div :class="panel">
            <span :class="[labelClass, 'flex items-center gap-1.5']">
              <span class="lucide-volume-1 size-4" aria-hidden="true" />
              Volume
            </span>
            <div class="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon="lucide-minus"
                label="Volume down"
                @click="nudgeVolume(-10)"
              />
              <Slider v-model="volume" class="flex-1" aria-label="Volume" />
              <Button
                variant="ghost"
                size="sm"
                icon="lucide-plus"
                label="Volume up"
                @click="nudgeVolume(10)"
              />
            </div>
          </div>
          <div :class="panel">
            <span :class="labelClass">Brightness</span>
            <div class="flex items-center gap-2">
              <span :class="iconBox" aria-hidden="true">
                <span class="lucide-sun-dim size-4 text-ink-gray-5" />
              </span>
              <Slider
                v-model="brightness"
                class="flex-1"
                aria-label="Brightness"
              />
              <span :class="iconBox" aria-hidden="true">
                <span class="lucide-sun size-4 text-ink-gray-5" />
              </span>
            </div>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
