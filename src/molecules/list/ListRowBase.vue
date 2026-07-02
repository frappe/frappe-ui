<template>
  <component
    :is="tag"
    data-slot="list-row"
    :role="context?.hasHeader.value ? 'row' : 'listitem'"
    :data-interactive="interactive || undefined"
    :data-state="selected ? 'selected' : undefined"
    :type="tag === 'button' ? 'button' : undefined"
    :class="
      interactive &&
      'w-full cursor-pointer select-none active:bg-surface-gray-2 sm:rounded-[10px] sm:hover:bg-surface-gray-1'
    "
  >
    <slot />
    <Transition
      enter-active-class="transition-transform duration-75 ease-out"
      leave-active-class="transition-transform duration-75 ease-out"
      enter-from-class="scale-0"
      leave-to-class="scale-0"
    >
      <div
        v-if="selectable"
        data-slot="list-row-checkbox"
        role="checkbox"
        :aria-checked="selected"
        tabindex="0"
        @click.stop.prevent="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
      >
        <Checkbox :modelValue="selected" tabindex="-1" />
      </div>
    </Transition>
    <div
      v-if="divider !== 'none'"
      data-slot="list-divider"
      aria-hidden="true"
      class="border-t border-outline-gray-1 transition-opacity"
      :style="{ gridColumn: divider === 'inset' ? '2 / -1' : '1 / -1' }"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Checkbox from '../../components/Checkbox/Checkbox.vue'
import { useListContext } from './list-context'

const props = defineProps<{
  tag: 'a' | 'button' | 'div'
  value?: string
}>()

const context = useListContext()

const divider = computed(() => context?.divider.value ?? 'inset')
const selectable = computed(
  () => !!context?.selectable.value && props.value !== undefined,
)
const selected = computed(
  () => selectable.value && !!context?.isSelected(props.value!),
)
const interactive = computed(() => props.tag !== 'div' || selectable.value)

function toggle() {
  if (props.value !== undefined) context?.toggleSelection(props.value)
}
</script>
