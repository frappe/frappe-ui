<template>
  <!--
    <Tooltip> reuses Rail's surrounding TooltipProvider when present (instant
    hover between neighbours) and falls back to its own when a RailItem is used
    standalone.
  -->
  <Tooltip side="right">
    <!--
      Link vs. button are split with v-if/v-else rather than a dynamic
      <component :is>: a raw 'button' string there resolves to a
      globally-registered <Button> in consumer apps, and reka's trigger can't
      forward its element ref through a functional wrapper. The inner content is
      identical in both branches.
    -->
    <RouterLink
      v-if="to"
      :to="to"
      data-slot="rail-item"
      :data-variant="variant"
      :data-state="active ? 'active' : 'inactive'"
      :aria-label="ariaLabel"
      :aria-current="active ? 'page' : undefined"
      :class="cellClasses"
      @click="emit('click', $event)"
    >
      <span
        v-if="showIndicator"
        data-slot="rail-item-indicator"
        aria-hidden="true"
        class="absolute -left-[11px] top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-4 bg-surface-gray-8"
      />
      <slot>
        <span
          v-if="typeof icon === 'string'"
          :class="[icon, 'size-4']"
          aria-hidden="true"
        />
        <component
          v-else-if="icon"
          :is="icon"
          class="size-4"
          aria-hidden="true"
        />
      </slot>
      <RailItemBadge :count="badge" :variant="badgeStyle" />
    </RouterLink>

    <button
      v-else
      type="button"
      data-slot="rail-item"
      :data-variant="variant"
      :data-state="active ? 'active' : 'inactive'"
      :aria-label="ariaLabel"
      :aria-current="active ? 'page' : undefined"
      :class="cellClasses"
      @click="emit('click', $event)"
    >
      <span
        v-if="showIndicator"
        data-slot="rail-item-indicator"
        aria-hidden="true"
        class="absolute -left-[11px] top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-4 bg-surface-gray-8"
      />
      <slot>
        <span
          v-if="typeof icon === 'string'"
          :class="[icon, 'size-4']"
          aria-hidden="true"
        />
        <component
          v-else-if="icon"
          :is="icon"
          class="size-4"
          aria-hidden="true"
        />
      </slot>
      <RailItemBadge :count="badge" :variant="badgeStyle" />
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
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Tooltip from '../Tooltip/Tooltip.vue'
import RailItemBadge from './RailItemBadge.vue'
import type { RailItemProps } from './types'

const props = withDefaults(defineProps<RailItemProps>(), {
  variant: 'tile',
  badgeStyle: 'count',
  badge: 0,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

defineSlots<{
  /** Custom content in place of the default icon — an image, avatar, or initials. */
  default?: () => any
}>()

// The left indicator bar is the `tile` variant's active affordance; `ghost`
// items signal active state through their raised background instead.
const showIndicator = computed(() => props.variant === 'tile' && props.active)

const cellClasses = computed(() => [
  'relative flex size-7 shrink-0 items-center justify-center text-base transition focus-visible:ring-0 focus-visible:focus-ring',
  // `tile` uses the community-tile radius; `ghost` mirrors frappe-ui's icon
  // button (rounded-4 = 8px).
  props.variant === 'tile' ? 'rounded-[7px]' : 'rounded-4',
  props.variant === 'tile'
    ? props.active
      ? 'bg-surface-gray-4'
      : 'bg-surface-gray-3'
    : props.active
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
