<template>
  <div
    class="w-full py-[7px] px-3 bg-surface-gray-1 flex items-center justify-between"
    :class="[roundedClass, props.indent && 'w-[95%] ml-auto']"
  >
    <!-- left side -->
    <div class="flex gap-2">
      <div class="flex items-center gap-2">
        <component :is="icon" class="w-4 h-4" />
        <p class="text-p-sm text-ink-gray-5">
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
import { computed, h, type Component } from 'vue'
import EventIcon from '../Icons/EventIcon.vue'
import ScopeIcon from '../Icons/ScopeIcon.vue'
import TimerIcon from '../Icons/TimerIcon.vue'

const props = withDefaults(
  defineProps<{
    title: string
    icon: string
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
  // "new": () => import('../../assets/icons/new.vue'),
  // "update": () => import('../../assets/icons/update.vue'),
  // "filter": () => import('../../assets/icons/filter.vue'),
  // "condition": () => import('../../assets/icons/condition.vue'),
  // "action": () => import('../../assets/icons/action.vue'),
  // "notification": () => import('../../assets/icons/notification.vue'),
}

const icon = (): Component => {
  return h(iconMap[props.icon] || ScopeIcon)
}
</script>

<style scoped></style>
