<template>
  <TextInput
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
        <template #body>
          <div
            class="rounded bg-surface-gray-7 py-1.5 px-2 text-xs text-ink-white shadow-xl"
          >
            <span class="flex items-center gap-1">
              {{ show ? 'Hide Password' : 'Show Password' }}
              <KeyboardShortcut
                bg
                combo="Mod+I"
                class="!bg-surface-gray-5 !text-ink-gray-2 px-1"
              />
            </span>
          </div>
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
import KeyboardShortcut from '../KeyboardShortcut.vue'
import TextInput from '../TextInput/TextInput.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { warnDeprecated } from '../../utils/warnDeprecated'
import type { PasswordProps } from './types'
import { computed, ref, watchEffect } from 'vue'

const props = withDefaults(defineProps<PasswordProps>(), {
  size: 'sm',
  variant: 'subtle',
})

const model = defineModel<string>()

watchEffect(() => {
  if (props.value != null) {
    warnDeprecated('Password.value', 'v-model / modelValue')
    if (model.value == null || model.value === '') {
      model.value = props.value ?? ''
    }
  }
})

const show = ref(false)
const showEye = computed(() => {
  let v = model.value || props.value
  return !v?.includes('*')
})

defineSlots<{
  /** Content shown before the input field (left icon / custom content) */
  prefix?: () => any
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()
</script>
