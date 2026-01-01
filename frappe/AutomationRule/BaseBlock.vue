<template>
  <div
    class="w-full py-[7px] px-3 bg-surface-gray-1 flex flex-col gap-1 group"
    :class="[roundedClass, props.indent && '!w-[95%] ml-auto']"
  >
    <div class="flex justify-between">
      <!-- left side -->
      <div class="flex gap-2" :class="maximizeLeftSide && 'flex-1'">
        <div class="flex items-center gap-2">
          <component
            :is="iconComponent?.icon"
            class="size-4"
            :style="{ color: iconComponent?.color }"
            v-if="iconComponent"
          />
          <p class="text-p-sm text-ink-gray-5 text-[14px]" v-if="title">
            {{ title }}
          </p>
        </div>
        <slot name="meta" />
      </div>
      <!-- right side -->
      <slot name="action" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import ActionIcon from '../Icons/ActionIcon.vue'
import AlignIcon from '../Icons/AlignIcon.vue'
import BellIcon from '../Icons/BellIcon.vue'
import ConditionIcon from '../Icons/ConditionIcon.vue'
import EventIcon from '../Icons/EventIcon.vue'
import FilterIcon from '../Icons/FilterIcon.vue'
import FocusIcon from '../Icons/FocusIcon.vue'
import ScopeIcon from '../Icons/ScopeIcon.vue'
import TimerIcon from '../Icons/TimerIcon.vue'
import type { IconType, RoundedType } from './types'

const props = withDefaults(
  defineProps<{
    title?: string
    icon?: IconType
    rounded?: RoundedType
    indent?: boolean
    maximizeLeftSide?: boolean
  }>(),
  {
    rounded: 'all',
    indent: false,
    maximizeLeftSide: false,
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

interface IconConfig {
  icon: Component
  color: string
}

const iconMap: Record<string, IconConfig> = {
  scope: {
    icon: ScopeIcon,
    color: '#0289F7',
  },
  timer: {
    icon: TimerIcon,
    color: '#E79913',
  },
  event: {
    icon: EventIcon,
    color: '#E79913',
  },
  condition: {
    icon: ConditionIcon,
    color: '#7757EE',
  },
  action: {
    icon: ActionIcon,
    color: '#278F5E',
  },
  notification: {
    icon: BellIcon,
    color: '#318AD8',
  },
  filter: {
    icon: FilterIcon,
    color: '',
  },
  title: {
    icon: FocusIcon,
    color: '',
  },
  align: {
    icon: AlignIcon,
    color: '#0289F7',
  },
}

const iconComponent = computed<IconConfig | null>(() => {
  if (!props.icon) return null
  return iconMap[props.icon] || null
})
</script>

<style scoped></style>
