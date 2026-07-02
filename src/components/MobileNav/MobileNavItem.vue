<template>
  <!--
    A real link when navigating somewhere new; a plain button when this item is
    already the current route (tap = scroll to top) or has no target. Switching
    the element on `isCurrent` — rather than preventing RouterLink's default —
    keeps the scroll-vs-navigate decision unambiguous. The 'button' string can't
    go through <component :is> (it collides with the global <Button>), so the
    button stays a literal v-else; the inner content is shared.
  -->
  <component
    :is="linkComponent"
    v-if="to && !isCurrent"
    v-bind="linkAttrs"
    data-slot="mobile-nav-item"
    :data-state="resolvedActive ? 'active' : 'inactive'"
    :aria-label="label"
    :aria-current="isCurrent ? 'page' : undefined"
    class="flex min-h-14 flex-col items-center justify-center gap-1 py-2 transition active:scale-95"
    @click="emit('click', $event)"
  >
    <slot :active="resolvedActive">
      <span
        :class="[icon, resolvedActive ? 'text-ink-gray-8' : 'text-ink-gray-5']"
        class="size-6"
        aria-hidden="true"
      />
    </slot>
    <span
      class="text-xs-medium"
      :class="resolvedActive ? 'text-ink-gray-8' : 'text-ink-gray-5'"
    >
      {{ label }}
    </span>
  </component>

  <button
    v-else
    type="button"
    data-slot="mobile-nav-item"
    :data-state="resolvedActive ? 'active' : 'inactive'"
    :aria-label="label"
    :aria-current="isCurrent ? 'page' : undefined"
    class="flex min-h-14 flex-col items-center justify-center gap-1 py-2 transition active:scale-95"
    @click="onButtonClick"
  >
    <slot :active="resolvedActive">
      <span
        :class="[icon, resolvedActive ? 'text-ink-gray-8' : 'text-ink-gray-5']"
        class="size-6"
        aria-hidden="true"
      />
    </slot>
    <span
      class="text-xs-medium"
      :class="resolvedActive ? 'text-ink-gray-8' : 'text-ink-gray-5'"
    >
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { RouterLink } from 'vue-router'
import { scrollToTop } from '../../composables/useScrollContainer'
import type { MobileNavItemProps } from './types'

const props = defineProps<MobileNavItemProps>()
const emit = defineEmits<{ click: [event: MouseEvent] }>()

// Read router/route off global properties (not useRouter/useRoute) so the item
// works without warnings when mounted outside a vue-router app — docs, tests,
// embedded use. Same approach as SidebarItem.
const globals = getCurrentInstance()?.appContext.config.globalProperties
const hasRouter = computed(() => Boolean(globals?.$router))

const linkComponent = computed(() => (hasRouter.value ? RouterLink : 'a'))
const linkAttrs = computed(() =>
  hasRouter.value
    ? { to: props.to }
    : { href: typeof props.to === 'string' ? props.to : undefined },
)

const resolvedRoute = computed(() =>
  props.to && globals?.$router ? globals.$router.resolve(props.to) : null,
)

// Is this item's target the exact current route? Drives scroll-vs-navigate and
// aria-current — distinct from `active`, which may span a whole section.
const isCurrent = computed(() => {
  const target = resolvedRoute.value
  const current = globals?.$route
  if (!target || !current) return false
  return target.name
    ? current.name === target.name
    : current.path === target.path
})

// Explicit `active` wins (broad section highlight); otherwise fall back to the
// current-route match so simple navs light up the current item automatically.
const resolvedActive = computed(() => props.active ?? isCurrent.value)

function onButtonClick(event: MouseEvent) {
  // Reached only when this item is already current (or has no target): a tap
  // scrolls the shell's scroll container to the top.
  if (isCurrent.value) scrollToTop()
  emit('click', event)
}
</script>
