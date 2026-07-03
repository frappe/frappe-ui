<template>
  <div
    data-slot="sidebar-item"
    :data-state="resolvedActive ? 'active' : 'inactive'"
    class="group/sidebar-item flex h-7 items-center rounded transition"
    :class="
      resolvedActive
        ? 'bg-surface-elevation-3 text-ink-gray-8 shadow-sm'
        : 'text-ink-gray-6 hover:bg-surface-gray-2'
    "
  >
    <!--
      Link vs. button are split with v-if/v-else. The link uses <component :is>
      because it swaps between vue-router's RouterLink (real app) and a plain
      <a> when no router is installed (docs, tests, embedded use) — passing the
      RouterLink component object or the 'a' string is safe; only a raw 'button'
      string collides with the globally-registered <Button>, so that stays a
      literal <button v-else>. The inner content is identical in both branches.
    -->
    <component
      :is="linkComponent"
      v-if="to"
      v-bind="linkAttrs"
      :accesskey="accessKey"
      :aria-label="label"
      :aria-current="resolvedActive ? 'page' : undefined"
      class="flex h-full min-w-0 flex-1 items-center pl-2 focus:outline-none focus-visible:ring-0"
      @click="handleClick"
    >
      <Tooltip :text="label ?? ''" placement="right" :disabled="!isCollapsed">
        <span class="grid shrink-0 place-items-center">
          <slot name="prefix">
            <SidebarItemIcon :icon="icon" />
          </slot>
        </span>
      </Tooltip>
      <span
        class="min-w-0 flex-1 transition-all ease-in-out"
        :class="
          isCollapsed
            ? 'ml-0 w-0 overflow-hidden opacity-0'
            : 'ml-2 w-auto opacity-100'
        "
      >
        <span class="flex min-w-0 items-center">
          <slot
            ><span class="truncate text-sm">{{ label }}</span></slot
          >
        </span>
      </span>
    </component>

    <button
      v-else
      type="button"
      :accesskey="accessKey"
      :aria-label="label"
      class="flex h-full min-w-0 flex-1 items-center pl-2 focus:outline-none focus-visible:ring-0"
      @click="handleClick"
    >
      <Tooltip :text="label ?? ''" placement="right" :disabled="!isCollapsed">
        <span class="grid shrink-0 place-items-center">
          <slot name="prefix">
            <SidebarItemIcon :icon="icon" />
          </slot>
        </span>
      </Tooltip>
      <span
        class="min-w-0 flex-1 transition-all ease-in-out"
        :class="
          isCollapsed
            ? 'ml-0 w-0 overflow-hidden opacity-0'
            : 'ml-2 w-auto opacity-100'
        "
      >
        <span class="flex min-w-0 items-center">
          <slot
            ><span class="truncate text-sm">{{ label }}</span></slot
          >
        </span>
      </span>
    </button>

    <!--
      Trailing zone is a SIBLING of the link/button — not nested inside it — so a
      consumer can place an interactive options menu here (you cannot nest a
      Dropdown/Button inside an anchor or button). Hidden when collapsed.
    -->
    <div
      data-slot="sidebar-item-suffix"
      class="flex shrink-0 items-center transition-all ease-in-out"
      :class="isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100'"
    >
      <slot name="suffix">
        <span v-if="suffix" class="mr-2 text-sm text-ink-gray-4">{{
          suffix
        }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject } from 'vue'
import { RouterLink } from 'vue-router'
import Tooltip from '../Tooltip/Tooltip.vue'
import SidebarItemIcon from './SidebarItemIcon.vue'
import { SidebarItemProps, sidebarCollapsedKey } from './types'

const props = defineProps<SidebarItemProps>()

const isCollapsed = inject(
  sidebarCollapsedKey,
  computed(() => false),
)

// Read the router/route off global properties instead of useRouter()/useRoute()
// so this component works — without warnings or crashes — when mounted outside a
// vue-router app (docs, tests, embedded use). vue-router installs $router/$route
// here; the $route getter stays reactive when read inside a computed.
const globals = getCurrentInstance()?.appContext.config.globalProperties
const hasRouter = computed(() => Boolean(globals?.$router))

// With a router, render RouterLink; without one, degrade to a plain <a> (with an
// href only when `to` is a string — we can't resolve a route-location object).
const linkComponent = computed(() => (hasRouter.value ? RouterLink : 'a'))
const linkAttrs = computed(() =>
  hasRouter.value
    ? { to: props.to }
    : { href: typeof props.to === 'string' ? props.to : undefined },
)

const resolvedRoute = computed(() =>
  props.to && globals?.$router ? globals.$router.resolve(props.to) : null,
)

// Explicit `active` (or the deprecated `isActive`) wins; otherwise infer from
// the current route so config-driven items light up without extra wiring.
const resolvedActive = computed(() => {
  if (props.active !== undefined) return props.active
  if (props.isActive !== undefined) return props.isActive

  const target = resolvedRoute.value
  const current = globals?.$route
  if (!target || !current) return false
  return target.name
    ? current.name === target.name
    : current.path === target.path
})

function handleClick(event: MouseEvent) {
  props.onClick?.(event)
}
</script>
