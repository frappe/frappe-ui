<script setup lang="ts">
import Story from '@/components/Story.vue'
import { Password } from 'frappe-ui'
import { ref } from 'vue'
import type { InputSize, InputVariant } from '../../../composables/inputTypes'

const sizes: InputSize[] = ['sm', 'md', 'lg', 'xl']
const variants: InputVariant[] = ['subtle', 'outline', 'ghost']

const value = ref('')
const labelingError = ref('')
const labelingRequired = ref(true)

const deprecatedValue = ref('hunter2')
</script>

<template>
  <div class="grid grid-cols-2 gap-5">
    <Story title="Default">
      <Password v-model="value" placeholder="Enter password" />
    </Story>

    <Story title="Labeling contract">
      <div class="flex flex-col gap-3 max-w-sm">
        <Password
          v-model="value"
          label="Password"
          description="At least 8 characters."
          :error="labelingError"
          :required="labelingRequired"
          placeholder="Enter password"
        />
        <div class="flex gap-2 items-center text-p-sm text-ink-gray-6">
          <label class="flex items-center gap-1">
            <input type="checkbox" v-model="labelingRequired" />
            required
          </label>
          <button
            class="underline"
            type="button"
            @click="
              labelingError = labelingError ? '' : 'Password is too short.'
            "
          >
            toggle error
          </button>
        </div>
      </div>
    </Story>

    <Story title="Sizes" class="col-span-2" preview-css="flex gap-3">
      <Password
        v-for="size in sizes"
        :key="size"
        :size="size"
        :label="size"
        placeholder="Enter password"
      />
    </Story>

    <Story title="Variants" class="col-span-2" preview-css="flex gap-3">
      <Password
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        :label="variant"
        placeholder="Enter password"
      />
    </Story>

    <Story title="Disabled">
      <Password label="Password" placeholder="Enter password" disabled />
    </Story>

    <Story title="Deprecated `value` prop (check console for warning)">
      <Password
        :value="deprecatedValue"
        label="Legacy field"
        placeholder="Enter password"
      />
    </Story>
  </div>
</template>
