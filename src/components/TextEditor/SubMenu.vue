<template>
  <Popover>
    <template #target="{ togglePopover }">
      <button
        class="rounded px-2 py-1 text-base font-medium text-ink-gray-8 transition-colors"
        :class="[
          actions.find((o) => o.isActive(editor))
            ? 'bg-surface-gray-3'
            : 'hover:bg-surface-gray-2',
          activeAction.class,
        ]"
        @click="togglePopover"
        :set="activeAction"
      >
        <component
          v-if="activeAction.icon"
          :is="activeAction.icon"
          class="h-4 w-4"
        />
        <span v-else>
          {{ activeAction.label }}
        </span>
      </button>
    </template>
    <template #body="{ close }">
      <div class="rounded bg-surface-white p-1 my-1 shadow-xl">
        <ul>
          <li
            class="w-full"
            v-for="option in actions"
            v-show="option.isDisabled ? !option.isDisabled(editor) : true"
          >
            <button
              class="w-full flex gap-1 rounded-sm p-1 text-ink-gray-8 transition-colors text-sm h-7 items-center"
              :class="[
                option.isActive(editor)
                  ? 'bg-surface-gray-3'
                  : 'hover:bg-surface-gray-2',
                option.class,
              ]"
              @click="
                () => {
                  $emit('click', option)
                  close()
                }
              "
            >
              <component v-if="option.icon" :is="option.icon" class="size-4" />
              <template v-if="option.label">{{ option.label }}</template>
            </button>
          </li>
        </ul>
      </div>
    </template>
  </Popover>
</template>
<script setup>
import Popover from '../Popover/Popover.vue'
import { computed } from 'vue'

const props = defineProps({
  editor: Object,
  button: [Object, Array],
})

defineEmits('click')
// Handle both array-based and object-based actions
const actions = computed(() =>
  props.button.group ? props.button.actions : props.button
)
const activeAction = computed(
  () =>
    actions.value.find((b) => b.isActive(props.editor)) ||
    actions.value.find((k) => k.default) ||
    actions.value[0]
)
</script>
