<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

// Solid heart geometry for the "Favourited" concept, colored per half state so
// the real Rating drives the fill. The star uses the component's own default.
const HEART =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

// Interactive models for rule 3.
const pqEditable = ref(3.5)
const pqEditableBad = ref(3.5)
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Half-fill fractional values -->
    <Guideline
      caption="Use a half-filled icon to accurately reflect values that fall between whole numbers."
    >
      <template #do>
        <div class="flex flex-col items-center gap-2">
          <Rating :model-value="3.5" :step="0.5" size="md" />
          <span class="text-sm text-ink-gray-5">3.5 average</span>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col items-center gap-2">
          <Rating :model-value="4" :step="1" size="md" />
          <span class="text-sm text-ink-gray-5">3.5 shown as 4 stars</span>
        </div>
      </template>
    </Guideline>

    <!-- 2. One icon per concept, used consistently -->
    <Guideline
      caption="Use the same icon consistently for the same concept across the product."
    >
      <template #do>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Favourited</span>
            <Rating :model-value="3" :max="3" size="md">
              <template #icon="{ state }">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-5"
                  :class="state === 'empty' ? 'text-ink-gray-3' : 'text-red-500'"
                  aria-hidden="true"
                >
                  <path :d="HEART" />
                </svg>
              </template>
            </Rating>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Product quality</span>
            <Rating :model-value="3.5" :step="0.5" size="md" />
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Product quality</span>
            <Rating :model-value="3.5" :step="0.5" size="md" />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Product quality</span>
            <Rating :model-value="3" :max="3" size="md">
              <template #icon="{ state }">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-5"
                  :class="state === 'empty' ? 'text-ink-gray-3' : 'text-red-500'"
                  aria-hidden="true"
                >
                  <path :d="HEART" />
                </svg>
              </template>
            </Rating>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Read-only ratings should look non-editable -->
    <Guideline
      caption="Visually distinguish read-only ratings from interactive ones so users don't try to edit them."
    >
      <template #do>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Product quality (Interactive)</span>
            <Rating v-model="pqEditable" :step="0.5" size="md" />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Product quality (Read only)</span>
            <Rating
              :model-value="3.5"
              :step="0.5"
              size="md"
              disabled
              class="opacity-80 grayscale"
            />
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Product quality (Interactive)</span>
            <Rating v-model="pqEditableBad" :step="0.5" size="md" />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5">Product quality (Read only)</span>
            <Rating :model-value="3.5" :step="0.5" size="md" disabled />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
