<template>
  <!--
    <Tooltip> reuses SidebarRail's surrounding TooltipProvider when present
    (instant hover between neighbours) and falls back to its own when a
    SidebarRailItem is used standalone.
  -->
  <Tooltip side="right">
    <!--
      Router and plain links share a dynamic component. The button stays a
      literal v-else because a raw 'button' string can resolve to the globally
      registered <Button> in consumer apps. The inner content is identical in
      both branches.
    -->
    <component
      :is="linkComponent"
      v-if="route || href"
      v-bind="linkAttrs"
      data-slot="sidebar-rail-item"
      :data-variant="variant"
      :data-state="resolvedActive ? 'active' : 'inactive'"
      :aria-label="ariaLabel"
      :aria-current="resolvedActive ? 'page' : undefined"
      :class="cellClasses"
      @click="emit('click', $event)"
    >
      <span
        v-if="showIndicator"
        data-slot="sidebar-rail-item-indicator"
        aria-hidden="true"
        class="absolute -left-[11px] top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-4 bg-surface-gray-8"
      />
      <slot><Icon :icon="icon" class="size-4" /></slot>
      <SidebarRailItemBadge :count="badge" :variant="badgeStyle" />
    </component>

    <button
      v-else
      type="button"
      data-slot="sidebar-rail-item"
      :data-variant="variant"
      :data-state="resolvedActive ? 'active' : 'inactive'"
      :aria-label="ariaLabel"
      :aria-current="resolvedActive ? 'page' : undefined"
      :class="cellClasses"
      @click="emit('click', $event)"
    >
      <span
        v-if="showIndicator"
        data-slot="sidebar-rail-item-indicator"
        aria-hidden="true"
        class="absolute -left-[11px] top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-4 bg-surface-gray-8"
      />
      <slot><Icon :icon="icon" class="size-4" /></slot>
      <SidebarRailItemBadge :count="badge" :variant="badgeStyle" />
    </button>

    <template #content>
      <div class="leading-relaxed">
        <div>{{ label }}</div>
        <div v-if="tooltipDescription" class="text-p-sm text-ink-gray-5">
          {{ tooltipDescription }}
        </div>
      </div>
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import SidebarRailItemBadge from './SidebarRailItemBadge.vue'
import type { SidebarRailItemProps } from './types'

const props = withDefaults(defineProps<SidebarRailItemProps>(), {
  variant: 'subtle',
  active: undefined,
  badgeStyle: 'count',
  badge: 0,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

defineSlots<{
  /** Custom content in place of the default icon — an image, avatar, or initials. */
  default?: () => any
}>()

const globals = getCurrentInstance()?.appContext.config.globalProperties
const hasRouter = computed(() => Boolean(globals?.$router))
const linkComponent = computed(() =>
  props.route && hasRouter.value ? RouterLink : 'a',
)
const linkAttrs = computed(() =>
  props.route
    ? hasRouter.value
      ? { to: props.route }
      : { href: typeof props.route === 'string' ? props.route : undefined }
    : { href: props.href },
)
const resolvedRoute = computed(() =>
  props.route && globals?.$router ? globals.$router.resolve(props.route) : null,
)
const resolvedActive = computed(() => {
  if (props.active !== undefined) return props.active
  const target = resolvedRoute.value
  const current = globals?.$route
  if (!target || !current) return false
  return target.name
    ? current.name === target.name
    : current.path === target.path
})

// The left indicator bar is the `subtle` variant's active affordance; `ghost`
// items signal active state through their raised background instead.
const showIndicator = computed(
  () => props.variant === 'subtle' && resolvedActive.value,
)

const cellClasses = computed(() => [
  'relative flex size-7 shrink-0 items-center justify-center text-base transition focus-visible:ring-0 focus-visible:focus-ring',
  // `subtle` uses the community-tile radius; `ghost` mirrors frappe-ui's icon
  // button (rounded-4 = 8px).
  props.variant === 'subtle' ? 'rounded-[7px]' : 'rounded-4',
  props.variant === 'subtle'
    ? resolvedActive.value
      ? 'bg-surface-gray-4'
      : 'bg-surface-gray-3'
    : resolvedActive.value
      ? 'text-ink-gray-8 !bg-surface-elevation-3 shadow-sm'
      : 'text-ink-gray-8 bg-transparent hover:bg-surface-gray-3',
])

/** Folds the unread count into the accessible name, e.g. "Notifications, 3 unread". */
const ariaLabel = computed(() =>
  props.badge > 0 ? `${props.label}, ${props.badge} unread` : props.label,
)

// The dot badge hides the number, so spell it out in the tooltip instead — unless the
// caller supplied its own second line, which is the more specific thing to say.
const tooltipDescription = computed(() => {
  if (props.description !== undefined) return props.description
  if (props.badgeStyle === 'dot' && props.badge > 0)
    return `${props.badge} unread`
  return null
})
</script>
