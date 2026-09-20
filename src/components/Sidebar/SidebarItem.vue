<template>
  <div
    data-slot="sidebar-item"
    :data-state="resolvedActive ? 'active' : 'inactive'"
    v-bind="rootAttrs"
    class="group/sidebar-item flex h-7 items-center rounded-4 transition"
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

      `controlAttrs` is spread before `linkAttrs` and before the component's own
      attributes, so a caller cannot overwrite `href` / `to`, `aria-current` or
      the classes. `aria-label` is the exception: `ariaLabel` returns the
      caller's value when there is one.
    -->
    <component
      :is="linkComponent"
      v-if="route || href"
      v-bind="{ ...controlAttrs, ...linkAttrs }"
      :accesskey="accessKey"
      :aria-label="ariaLabel"
      :aria-current="resolvedActive ? 'page' : undefined"
      class="flex h-full min-w-0 flex-1 items-center rounded-4 pl-2 focus-visible:ring-0 focus-visible:focus-ring"
      @click="handleClick"
    >
      <Tooltip
        :text="tooltipText"
        side="right"
        :disabled="!isCollapsed || !tooltipText"
      >
        <!-- Deliberately unchanged by `isCollapsed`: the row keeps its `pl-2`
             and the glyph its natural size, so the icon holds one position
             through the width animation instead of swinging to a centered
             square and back (the whole row is already the hit target). -->
        <span class="grid shrink-0 place-items-center">
          <slot name="prefix">
            <Icon :icon="icon" class="size-4 text-ink-gray-6" />
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
        <span ref="labelEl" class="flex min-w-0 items-center">
          <slot
            ><span class="truncate text-sm leading-tighter">{{
              label
            }}</span></slot
          >
        </span>
      </span>
    </component>

    <button
      v-else
      type="button"
      v-bind="controlAttrs"
      :accesskey="accessKey"
      :aria-label="ariaLabel"
      class="flex h-full text-left min-w-0 flex-1 items-center rounded-4 pl-2 focus-visible:ring-0 focus-visible:focus-ring"
      @click="handleClick"
    >
      <Tooltip
        :text="tooltipText"
        side="right"
        :disabled="!isCollapsed || !tooltipText"
      >
        <!-- Deliberately unchanged by `isCollapsed`: the row keeps its `pl-2`
             and the glyph its natural size, so the icon holds one position
             through the width animation instead of swinging to a centered
             square and back (the whole row is already the hit target). -->
        <span class="grid shrink-0 place-items-center">
          <slot name="prefix">
            <Icon :icon="icon" class="size-4 text-ink-gray-6" />
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
        <span ref="labelEl" class="flex min-w-0 items-center">
          <slot
            ><span class="truncate text-sm leading-tighter">{{
              label
            }}</span></slot
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
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  ref,
  useAttrs,
  useTemplateRef,
} from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { SidebarItemProps, sidebarCollapsedKey } from './types'

// The root <div> is a wrapper, not the control: the link/button and the
// #suffix zone are siblings inside it. Without this, every fallthrough
// attribute stopped at the wrapper, so `target`, `rel`, `data-*` and `aria-*`
// never reached the element they describe.
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

// The split. `class`, `style` and event listeners belong to the whole row, so
// they stay on the wrapper: a row background or a drag-and-drop ring has to
// cover the #suffix zone, and so does a listener. Mail and Drive make a folder
// row a drop target with `@dragover` / `@drop` while the suffix holds the
// unread count and the options menu. On the inner control those events would
// miss that strip. Everything else describes the control and goes there.
// `onClick` is a declared prop, so it is never in `attrs`; it stays bound to
// the control through `handleClick`.
const isRootAttr = (key: string) =>
  key === 'class' || key === 'style' || /^on[A-Z]/.test(key)

const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => isRootAttr(key))),
)

const controlAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => !isRootAttr(key))),
)

// `active` must default to `undefined`, not Vue's implicit boolean `false` —
// "not passed" and "passed false" are different states here: absence falls
// through to route inference.
const props = withDefaults(defineProps<SidebarItemProps>(), {
  active: undefined,
})

defineSlots<{
  /** Leading icon or avatar. Overrides the `icon` prop. */
  prefix?: () => any
  /** The label region. Overrides the `label` prop; put inline adornments here. */
  default?: () => any
  /** The trailing zone — a sibling of the link/button, not nested inside it. Overrides the `suffix` prop. */
  suffix?: () => any
}>()

const isCollapsed = inject(
  sidebarCollapsedKey,
  computed(() => false),
)

// Collapsed items show a tooltip with their name. Prefer the explicit `label`;
// otherwise fall back to the rendered default-slot text so slot-only items (the
// common composition path) still get a tooltip and an accessible name without
// the caller repeating the label as a prop.
const labelEl = useTemplateRef<HTMLElement>('labelEl')
const slotLabel = ref('')
onMounted(() => {
  slotLabel.value = labelEl.value?.textContent?.trim() ?? ''
})
const tooltipText = computed(() => props.label || slotLabel.value)

// A caller's `aria-label` wins over the derived one. It is the more specific
// name, and it is the only way to name a row whose visible text is not its
// full name (a folder row that also announces its unread count). Every other
// attribute the component computes is bound after `controlAttrs`, so a caller
// cannot overwrite it.
const ariaLabel = computed(
  () => (attrs['aria-label'] as string) || tooltipText.value || undefined,
)

// Read the router/route off global properties instead of useRouter()/useRoute()
// so this component works — without warnings or crashes — when mounted outside a
// vue-router app (docs, tests, embedded use). vue-router installs $router/$route
// here; the $route getter stays reactive when read inside a computed.
const globals = getCurrentInstance()?.appContext.config.globalProperties
const hasRouter = computed(() => Boolean(globals?.$router))

// With a router, render RouterLink; without one, degrade to a plain <a> (with an
// href only when `route` is a string — we can't resolve a route-location object).
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

// Explicit `active` wins; otherwise infer from the current route so
// router-driven items light up without extra wiring.
const resolvedActive = computed(() => {
  if (props.active !== undefined) return props.active

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
