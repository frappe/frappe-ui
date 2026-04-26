<script setup lang="ts">
import Story from '@/components/Story.vue'
import { Avatar, TextInput } from 'frappe-ui'
import { ref } from 'vue'
import type { InputSize, InputVariant } from '../../../composables/inputTypes'
import type { TextInputTypes } from '../../types/TextInput'

const inputTypes: TextInputTypes[] = [
  'text',
  'number',
  'email',
  'date',
  'datetime-local',
  'password',
  'search',
  'tel',
  'time',
  'url',
]
const sizes: InputSize[] = ['sm', 'md', 'lg', 'xl']
const variants: InputVariant[] = ['subtle', 'outline', 'ghost']

const labelingValue = ref('')
const labelingError = ref('')
const labelingRequired = ref(true)
const labelingDescription = ref(
  'We use this to send you product updates only.',
)
</script>

<template>
  <div class="grid grid-cols-2 gap-5">
    <Story title="Labeling contract" class="col-span-2">
      <div class="flex flex-col gap-3 max-w-sm">
        <TextInput
          v-model="labelingValue"
          label="Email"
          :description="labelingDescription"
          :error="labelingError"
          :required="labelingRequired"
          placeholder="you@example.com"
        />
        <div class="flex gap-2 items-center text-p-sm text-ink-gray-6">
          <label class="flex items-center gap-1">
            <input type="checkbox" v-model="labelingRequired" />
            required
          </label>
          <button
            class="underline"
            type="button"
            @click="labelingError = labelingError ? '' : 'Email is required.'"
          >
            toggle error
          </button>
        </div>
      </div>
    </Story>

    <Story title="Error from Error object">
      <TextInput
        label="Username"
        :error="
          Object.assign(new Error('exception text'), {
            messages: ['Username is taken.', 'Try a different one.'],
          })
        "
        placeholder="acme"
      />
    </Story>

    <Story title="Slot label & description">
      <TextInput placeholder="acme">
        <template #label="{ required }">
          <span class="font-semibold">Custom label</span>
          <span v-if="required" class="text-ink-red-3">*</span>
        </template>
        <template #description>
          <span class="italic">
            Custom description rendered via slot.
          </span>
        </template>
      </TextInput>
    </Story>

    <Story
      v-for="inputType in inputTypes"
      :key="inputType"
      :title="inputType"
    >
      <TextInput :type="inputType" placeholder="Enter input" />
    </Story>

    <Story title="prefix slot icon">
      <TextInput placeholder="Enter Input">
        <template #prefix>
          <span class="lucide-search size-4 text-ink-gray-6" />
        </template>
      </TextInput>
    </Story>

    <Story title="suffix slot icon">
      <TextInput placeholder="Enter Input">
        <template #suffix>
          <span class="lucide-search size-4 text-ink-gray-6" />
        </template>
      </TextInput>
    </Story>

    <Story title="prefix slot avatar">
      <TextInput placeholder="Enter Name">
        <template #prefix>
          <Avatar
            size="sm"
            image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
          />
        </template>
      </TextInput>
    </Story>

    <Story title="Sizes" class="col-span-2" preview-css="flex gap-3">
      <TextInput
        v-for="size in sizes"
        :key="size"
        :size="size"
        :label="size"
        placeholder="Enter input"
      />
    </Story>

    <Story title="Variants" class="col-span-2" preview-css="flex gap-3">
      <TextInput
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        :label="variant"
        placeholder="Enter input"
      />
    </Story>

    <Story title="Disabled" class="col-span-2" preview-css="flex gap-3">
      <TextInput
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        :label="variant"
        placeholder="Enter input"
        disabled
      />
    </Story>
  </div>
</template>
