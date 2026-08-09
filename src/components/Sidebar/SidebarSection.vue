<template>
  <!--
    Collapsible group: a label row plus a body that shows/hides. Compose
    SidebarItem (or anything else) as children in the default slot — this
    component owns only the label + collapse chrome, not the rows inside it.
  -->
  <div
    data-slot="sidebar-section"
    :data-state="isSectionCollapsed ? 'collapsed' : 'expanded'"
    class="mt-2 flex flex-col"
  >
    <div v-if="label" class="relative flex items-center gap-1 px-2 py-1.5">
      <!--
        ARIA accordion pattern: the heading wraps the button, not the other
        way around — a <button> only accepts phrasing content, so nesting an
        <h3> inside it strips the heading from the accessibility tree.
      -->
      <h3
        class="h-4 text-sm text-ink-gray-5 transition-all duration-300 ease-in-out"
        :class="
          isSidebarCollapsed
            ? 'w-0 overflow-hidden opacity-0'
            : 'w-auto opacity-100'
        "
      >
        <button
          v-if="collapsible"
          :id="triggerId"
          type="button"
          class="flex items-center gap-1 rounded-4 focus-visible:ring-0 focus-visible:focus-ring"
          :aria-expanded="!isSectionCollapsed"
          :aria-controls="bodyId"
          :aria-hidden="isSidebarCollapsed || undefined"
          :tabindex="isSidebarCollapsed ? -1 : undefined"
          @click="isSectionCollapsed = !isSectionCollapsed"
        >
          {{ label }}
          <span
            class="lucide-chevron-right size-4 text-ink-gray-5 transition-all duration-300 ease-in-out"
            :class="{ 'rotate-90': !isSectionCollapsed }"
          />
        </button>
        <template v-else>{{ label }}</template>
      </h3>
      <div
        v-if="isSidebarCollapsed"
        aria-hidden="true"
        class="absolute inset-0 flex items-center"
      >
        <hr class="w-full border-t border-ink-gray-3" />
      </div>
    </div>

    <transition
      enter-active-class="duration-300 ease-in"
      leave-active-class="duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
      enter-to-class="max-h-[200px] overflow-hidden"
      leave-from-class="max-h-[200px] overflow-hidden"
      enter-from-class="max-h-0 overflow-hidden"
      leave-to-class="max-h-0 overflow-hidden"
    >
      <!--
        v-show, not v-if: `aria-controls="bodyId"` on the trigger button must
        resolve to a real element at all times, including the instant
        aria-expanded flips to "false" — an id that only exists while
        expanded breaks the reference exactly when it's read.
      -->
      <nav
        v-show="!isSectionCollapsed"
        :id="bodyId"
        :aria-labelledby="collapsible && label ? triggerId : undefined"
        class="flex flex-col gap-0.5"
      >
        <slot />
      </nav>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { SidebarSectionProps, sidebarCollapsedKey } from './types'
import { useId } from '../../utils/useId'

defineProps<SidebarSectionProps>()

defineSlots<{
  /** The group's rows — compose `SidebarItem` (or anything else) here. */
  default?: () => any
}>()

const isSidebarCollapsed = inject(
  sidebarCollapsedKey,
  computed(() => false),
)

// `defineModel` already declares this event, but it carries no place to write
// the event's own description. Redeclaring it here is what puts the sentence
// in the generated API table.
defineEmits<{
  /** Fired when the section is collapsed or expanded. */
  'update:collapsed': [value: boolean]
}>()

// Per-section open/closed state for `collapsible` sections — distinct from the
// whole-sidebar collapse above. The JSDoc below stays on one line: the
// generator copies it into the API table verbatim, and the table renders its
// line breaks.
/** v-model. Whether the section is collapsed. Bind it to own the state (start a section collapsed, persist the choice); left unbound the section manages it internally, starting expanded. */
const isSectionCollapsed = defineModel<boolean>('collapsed', { default: false })

const triggerId = useId()
const bodyId = useId()
</script>
