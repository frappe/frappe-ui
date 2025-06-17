<template>
  <Button
    :label="props.label"
    @click="handleClick"
    class="!w-full"
    :class="isActive ? 'bg-surface-selected shadow-sm' : 'hover:bg-surface-gray-2'"
    variant="ghost"
    >
    <template #icon>
      <div
        class="flex w-full items-center justify-between transition-all ease-in-out px-2 py-1"
      >
        <div class="flex items-center truncate">
          <Tooltip :text="label" placement="right" :disabled="!isCollapsed">
            <span class="grid flex-shrink-0 place-items-center">
              <slot name="icon"></slot>
            </span>
          </Tooltip>
          <Tooltip
            :text="label"
            placement="right"
            :disabled="isCollapsed"
            :hoverDelay="1.5"
          >
            <span
              class="flex-1 flex-shrink-0 truncate text-sm transition-all ease-in-out"
              :class="
                isCollapsed
                  ? 'ml-0 w-0 overflow-hidden opacity-0'
                  : 'ml-2 w-auto opacity-100'
              "
            >
              {{ label }}
            </span>
          </Tooltip>
        </div>
        <div
          class="transition-all ease-in-out"
         :class="isCollapsed ? 'ml-0 w-0 overflow-hidden opacity-0' : 'ml-2 w-auto opacity-100'"
         >
          <slot name="suffix" />
        </div>
      </div>
    </template>
  </Button>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router';
import Button from '../Button/Button.vue'
import Tooltip from '../Tooltip/Tooltip.vue';

const props = defineProps<{
  label?: string
  to?: RouteLocationRaw
  onClick?: () => void
  isActive?: boolean
  isCollapsed?: boolean
}>()

const router = useRouter()
function handleClick() {
  if (props.onClick) {
    props.onClick()
  } else if (props.to) {
    router.push(props.to)
  }
}
</script>
