<template>
  <TextInput
    ref="textInputRef"
    v-model="model"
    :type="show ? 'text' : 'password'"
    :label="label"
    :description="description"
    :error="error"
    :required="required"
    :size="size"
    :variant="variant"
    :disabled="disabled"
    :placeholder="placeholder"
    :id="id"
    @keydown.meta.i.prevent="show = !show"
    @keydown.ctrl.i.prevent="show = !show"
  >
    <template v-if="$slots.label" #label="slotProps">
      <slot name="label" v-bind="slotProps" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <template #prefix v-if="$slots.prefix">
      <slot name="prefix" />
    </template>
    <template #suffix>
      <Tooltip>
        <template #content>
          <span class="flex items-center gap-1">
            {{ show ? 'Hide Password' : 'Show Password' }}
            <KeyboardShortcut
              bg
              combo="Mod+I"
              class="!bg-surface-gray-8 !text-ink-gray-2 px-1"
            />
          </span>
        </template>
        <div>
          <span
            v-show="showEye"
            :class="show ? 'lucide-eye-off' : 'lucide-eye'"
            class="size-3 cursor-pointer mr-1"
            @click="show = !show"
          />
        </div>
      </Tooltip>
    </template>
  </TextInput>
</template>

<script setup lang="ts">
import KeyboardShortcut from '../KeyboardShortcut/KeyboardShortcut.vue'
import TextInput from '../TextInput/TextInput.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { PasswordProps } from './types'
import type { TextInputExposed } from '../TextInput/types'
import { computed, ref } from 'vue'

withDefaults(defineProps<PasswordProps>(), {
  size: 'sm',
  variant: 'subtle',
})

/** The current password value (controlled). */
const model = defineModel<string>()

const show = ref(false)
const showEye = computed(() => !model.value?.includes('*'))

defineSlots<{
  /** Content shown before the input field (left icon / custom content) */
  prefix?: () => any
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

const textInputRef = ref<InstanceType<typeof TextInput> | null>(null)

function focus(options?: FocusOptions) {
  textInputRef.value?.focus(options)
}

// A getter rather than `computed(...)`: see TextInput.vue's defineExpose for
// why — a ComputedRef doesn't structurally match the type's plain element.
defineExpose<TextInputExposed>({
  focus,
  get inputElement() {
    return textInputRef.value?.inputElement ?? null
  },
})
</script>
