<template>
  <FormControl
    :type="show ? 'text' : 'password'"
    :value="modelValue || value"
    v-bind="$attrs"
    @keydown.meta.i.prevent="show = !show"
    @keydown.ctrl.i.prevent="show = !show"
  >
    <template #prefix v-if="$slots.prefix">
      <slot name="prefix" />
    </template>
    <template #suffix>
      <Tooltip>
        <template #body>
          <div class="rounded bg-surface-gray-7 px-2 py-1.5 text-xs text-ink-white shadow-xl">
            <span class="flex items-center gap-1">
              {{ show ? 'Hide Password' : 'Show Password' }}
              <KeyboardShortcut bg combo="Mod+I" class="!bg-surface-gray-5 px-1 !text-ink-gray-2" />
            </span>
          </div>
        </template>
        <div>
          <component
            v-show="showEye"
            :is="show ? LucideEyeOff : LucideEye"
            class="mr-1 h-3 cursor-pointer"
            @click="show = !show"
          />
        </div>
      </Tooltip>
    </template>
  </FormControl>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import LucideEye from '~icons/lucide/eye'
import LucideEyeOff from '~icons/lucide/eye-off'

import FormControl from '../FormControl/FormControl.vue'
import KeyboardShortcut from '../KeyboardShortcut.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { PasswordProps } from './types'

const props = defineProps<PasswordProps>()

const show = ref(false)
const showEye = computed(() => {
  let v = props.modelValue || props.value
  return !v?.includes('*')
})

defineSlots<{
  /** Content shown before the input field (left icon / custom content) */
  prefix?: () => any
}>()
</script>
