<template>
  <Button
    :label="props.label"
    @click="handleClick"
    class="!w-full"
    :class="props.isActive ? '!bg-surface-selected shadow-sm' : 'hover:bg-surface-gray-2'"
    variant="ghost"
    >
    <template #icon>
      <div
        class="flex w-full items-center justify-between transition-all ease-in-out px-2 py-1"
      >
        <div class="flex items-center truncate">
          <Tooltip :text="props.label" placement="right" :disabled="!isCollapsed">
            <span class="grid flex-shrink-0 place-items-center">
              <slot name="icon"></slot>
            </span>
          </Tooltip>
          <Tooltip
            :text="props.label"
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
              {{ props.label }}
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
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../Button/Button.vue';
import Tooltip from '../Tooltip/Tooltip.vue';
import { SidebarItemProps } from './types';

const props = defineProps<SidebarItemProps>()
const isCollapsed = inject('isSidebarCollapsed', false)

const router = useRouter()
function handleClick() {
  if (props.onClick) {
    props.onClick()
  } else if (props.to) {
    router.push(props.to)
  }
}
</script>
