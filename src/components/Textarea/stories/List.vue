<script setup lang="ts">
import Story from '@/components/Story.vue'
import { Textarea } from 'frappe-ui'
import { ref } from 'vue'
import type { InputSize, InputVariant } from '../../../composables/inputTypes'

const sizes: InputSize[] = ['sm', 'md', 'lg', 'xl']
const variants: InputVariant[] = ['subtle', 'outline', 'ghost']

const labelingValue = ref('')
const labelingError = ref('')
const labelingRequired = ref(true)
</script>

<template>
  <div class="grid grid-cols-2 gap-5">
    <Story title="Labeling contract" class="col-span-2">
      <div class="flex flex-col gap-3 max-w-sm">
        <Textarea
          v-model="labelingValue"
          label="Bio"
          description="Tell us a bit about yourself."
          :error="labelingError"
          :required="labelingRequired"
          placeholder="Write something..."
        />
        <div class="flex gap-2 items-center text-p-sm text-ink-gray-6">
          <label class="flex items-center gap-1">
            <input type="checkbox" v-model="labelingRequired" />
            required
          </label>
          <button
            class="underline"
            type="button"
            @click="labelingError = labelingError ? '' : 'Bio cannot be empty.'"
          >
            toggle error
          </button>
        </div>
      </div>
    </Story>

    <Story title="Slot label & description">
      <Textarea placeholder="Write something...">
        <template #label="{ required }">
          <span class="font-semibold">Notes</span>
          <span v-if="required" class="text-ink-red-3">*</span>
        </template>
        <template #description>
          <span class="italic">Custom description via slot.</span>
        </template>
      </Textarea>
    </Story>

    <Story title="Sizes" class="col-span-2" preview-css="grid grid-cols-2 gap-3">
      <Textarea
        v-for="size in sizes"
        :key="size"
        :size="size"
        :label="size"
        placeholder="Write something..."
      />
    </Story>

    <Story
      title="Variants"
      class="col-span-2"
      preview-css="grid grid-cols-3 gap-3"
    >
      <Textarea
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        :label="variant"
        placeholder="Write something..."
      />
    </Story>

    <Story title="Disabled">
      <Textarea label="Bio" placeholder="Write something..." disabled />
    </Story>

    <Story title="Required">
      <Textarea label="Required" required placeholder="Write something..." />
    </Story>
  </div>
</template>
