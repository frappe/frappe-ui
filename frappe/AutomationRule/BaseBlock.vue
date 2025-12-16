<template>
  <div
    class="w-full py-[7px] px-3 bg-surface-gray-1 flex items-center justify-between"
    :class="[roundedClass, props.indent && 'w-[95%] ml-auto']"
  >
    <!-- left side -->
    <div class="flex gap-2">
      <div class="flex items-center gap-2">
        <component :is="iconComponent" class="size-4" v-if="iconComponent" />
        <div v-else class="size-4 abcd"></div>
        <p class="text-p-sm text-ink-gray-5 text-[14px] w-[40px]">
          {{ title }}
        </p>
      </div>
      <slot name="meta" />
    </div>
    <!-- right side -->
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import ActionIcon from '../Icons/ActionIcon.vue'
import BellIcon from '../Icons/BellIcon.vue'
import ConditionIcon from '../Icons/ConditionIcon.vue'
import EventIcon from '../Icons/EventIcon.vue'
import FilterIcon from '../Icons/FilterIcon.vue'
import ScopeIcon from '../Icons/ScopeIcon.vue'
import TimerIcon from '../Icons/TimerIcon.vue'

const props = withDefaults(
  defineProps<{
    title: string
    icon:
      | 'scope'
      | 'timer'
      | 'event'
      | 'condition'
      | 'action'
      | 'notification'
      | 'filter'
      | ''
    rounded?: 'all' | 'top' | 'bottom' | 'none'
    indent?: boolean
  }>(),
  {
    rounded: 'all',
    indent: false,
  },
)

const roundedClassMap: Record<string, string> = {
  all: 'rounded-md',
  top: 'rounded-t-md',
  bottom: 'rounded-b-md',
  none: '',
}
const roundedClass = computed(() => {
  return roundedClassMap[props.rounded || 'all']
})

const iconMap: Record<string, Component> = {
  scope: ScopeIcon,
  timer: TimerIcon,
  event: EventIcon,
  condition: ConditionIcon,
  action: ActionIcon,
  notification: BellIcon,
  filter: FilterIcon,
}

const iconComponent = computed<Component | null>(() => {
  return iconMap[props.icon] || null
})
</script>

<style scoped></style>
