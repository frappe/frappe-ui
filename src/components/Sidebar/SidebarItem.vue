<template>
  <Button
    :label="props.label"
    :route="buttonRoute"
    @click="handleClick"
    class="!w-full focus-visible:ring-0 focus:outline-none"
    :class="
      isActive
        ? '!bg-surface-selected shadow-sm'
        : 'hover:bg-surface-gray-2'
    "
    variant="ghost"
    :accesskey="props.accessKey"
  >
    <template #icon>
      <div
        class="flex w-full items-center justify-between transition-all ease-in-out px-2 py-1"
      >
        <div class="flex items-center truncate">
          <Tooltip
            :text="props.label"
            placement="right"
            :disabled="!isCollapsed"
          >
            <span class="grid flex-shrink-0 place-items-center">
              <slot name="icon">
                <span
                  v-if="props.icon && typeof props.icon === 'string' && props.icon.startsWith('lucide-')"
                  class="size-4 text-ink-gray-6"
                  :class="props.icon"
                />
                <span
                  v-else-if="props.icon && typeof props.icon === 'string'"
                  class="size-4 text-ink-gray-6"
                >
                  {{ props.icon }}
                </span>
                <component
                  v-else
                  :is="props.icon"
                  class="size-4 text-ink-gray-6"
                />
              </slot>
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
          :class="
            isCollapsed
              ? 'ml-0 w-0 overflow-hidden opacity-0'
              : 'ml-auto w-auto opacity-100'
          "
        >
          <slot name="suffix">
            <span v-if="props.suffix" class="text-sm text-ink-gray-4">
              {{ props.suffix }}
            </span>
          </slot>
        </div>
      </div>
    </template>
  </Button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import Button from '../Button/Button.vue'
import { useRoute, useRouter } from 'vue-router'
import { SidebarItemProps, sidebarCollapsedKey } from './types'

const props = defineProps<SidebarItemProps>()
const isCollapsed = inject(sidebarCollapsedKey, computed(() => false))

const route = useRoute()
const router = useRouter()

const buttonRoute = computed(() => (props.onClick ? undefined : props.to))

const resolvedRoute = computed(() => {
  if (!props.to) return null
  return router.resolve(props.to)
})

const isActive = computed(() => {
  if (props.isActive !== undefined) return props.isActive

  const targetRoute = resolvedRoute.value
  if (!targetRoute) return false

  if (targetRoute.name) {
    return route.name === targetRoute.name
  }

  return route.path === targetRoute.path
})

function handleClick() {
  if (props.onClick) {
    props.onClick()
  }
}
</script>
