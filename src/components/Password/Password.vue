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
          <div
            class="rounded bg-surface-gray-7 py-1.5 px-2 text-xs text-ink-white shadow-xl"
          >
            <span class="flex items-center gap-1">
              {{ show ? 'Hide Password' : 'Show Password' }}
              <KeyboardShortcut
                bg
                ctrl
                class="!bg-surface-gray-5 !text-ink-gray-2 px-1"
              >
                <span class="font-mono leading-none tracking-widest">+I</span>
              </KeyboardShortcut>
            </span>
          </div>
        </template>
        <div>
          <component
            v-show="showEye"
            :is="show ? LucideEyeOff : LucideEye"
            class="h-3 cursor-pointer mr-1"
            @click="show = !show"
          />
        </div>
      </Tooltip>
    </template>
  </FormControl>
</template>
<script setup lang="ts">
import LucideEye from '~icons/lucide/eye'
import LucideEyeOff from '~icons/lucide/eye-off'
import KeyboardShortcut from '../KeyboardShortcut.vue'
import FormControl from '../FormControl/FormControl.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { PasswordProps } from './types'
import { ref, computed } from 'vue'

const props = defineProps<PasswordProps>()

const show = ref(false)
const showEye = computed(() => {
  let v = props.modelValue || props.value
  return !v?.includes('*')
})
</script>
