<template>
  <!-- Disclosure section header: the chevron points down while open and
       turns to point right when the rows beneath are folded away. -->
  <button
    v-if="row.type === 'section' && row.chevron"
    type="button"
    class="flex h-7 w-full items-center gap-2 rounded-4 px-2 text-left outline-none focus-visible:focus-ring"
    :aria-expanded="row.expanded !== false"
    @click="row.onToggle?.()"
  >
    <EIcon
      name="small-down"
      class="size-4 text-ink-gray-5 transition-transform duration-200 ease-in-out"
      :class="row.expanded === false && '-rotate-90'"
    />
    <span class="min-w-0 flex-1 truncate text-base text-ink-gray-5">
      {{ row.label }}
    </span>
    <span v-if="row.hint" class="shrink-0 text-base text-ink-gray-5">
      {{ row.hint }}
    </span>
  </button>

  <!-- Section header: muted label and optional count. -->
  <div
    v-else-if="row.type === 'section'"
    class="flex h-7 items-center gap-2 px-2"
  >
    <span class="min-w-0 flex-1 truncate text-base text-ink-gray-5">
      {{ row.label }}
    </span>
    <span v-if="row.hint" class="shrink-0 text-base text-ink-gray-5">
      {{ row.hint }}
    </span>
  </div>

  <div v-else-if="row.type === 'divider'" class="py-1.5">
    <div class="border-t border-outline-gray-1" />
  </div>

  <div v-else-if="row.type === 'group'" class="flex flex-col gap-0.5">
    <SidebarRow
      v-for="(child, i) in row.rows"
      :key="i"
      :row="child"
      :collapsed="collapsed"
    />
  </div>

  <div
    v-else
    class="flex"
    :style="row.indent ? { paddingLeft: `${row.indent}px` } : undefined"
  >
    <!-- The ::before stretches the hit area over half the gap to each
         neighbour (`--row-hit-gap`, 1px for the 2px menu gap), so moving
         down a list never lands between rows: the cursor and the hover
         fill don't blink off at every row boundary. -->
    <button
      type="button"
      :data-state="row.active ? 'active' : 'inactive'"
      :aria-label="collapsed ? row.label : undefined"
      :aria-current="row.active ? 'page' : undefined"
      @click="row.onClick?.()"
      class="relative flex h-7 min-w-0 items-center rounded-4 text-left outline-none transition-colors before:absolute before:inset-x-0 before:bottom-[calc(-1*var(--row-hit-gap,1px))] before:top-[calc(-1*var(--row-hit-gap,1px))] before:content-[''] focus-visible:bg-surface-gray-1 focus-visible:shadow-[0_0_0_2px_var(--outline-gray-3)]"
      :class="[
        collapsed ? 'justify-start p-1.5' : 'flex-1 gap-2 px-2 py-1.5',
        row.active
          ? 'bg-surface-elevation-3 text-ink-gray-8 shadow-sm'
          : row.white
            ? 'bg-surface-elevation-1 text-ink-gray-6'
            : row.hovered
              ? 'bg-surface-gray-2 text-ink-gray-6'
              : 'text-ink-gray-6 hover:bg-surface-gray-2',
      ]"
      :style="collapsed ? { width: `${row.width ?? 28}px` } : undefined"
    >
      <span
        v-if="(row.chevron || row.prefix) && !collapsed"
        class="flex shrink-0 items-center gap-0.5"
      >
        <EIcon v-if="row.chevron" :name="row.chevron" class="size-4" />
        <RowPrefixView v-if="row.prefix" :prefix="row.prefix" :row="row" />
      </span>
      <RowPrefixView v-else-if="row.prefix" :prefix="row.prefix" :row="row" />

      <span
        v-if="!collapsed && row.label"
        class="flex min-w-0 flex-1 items-baseline gap-1"
      >
        <span class="min-w-0 flex-1 truncate text-base">{{ row.label }}</span>
        <span v-if="row.hint" class="shrink-0 text-xs text-ink-gray-5">
          {{ row.hint }}
        </span>
      </span>
      <EIcon
        v-if="!collapsed && row.suffixIcon"
        :name="row.suffixIcon"
        class="size-4 text-ink-gray-7"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Avatar } from '../../src'
import EIcon from './EIcon.vue'
import type { ItemRow, Row, RowPrefix } from './types'

defineOptions({ name: 'SidebarRow' })

defineProps<{ row: Row; collapsed?: boolean }>()

const avatars = import.meta.glob<string>('./avatars/*.png', {
  import: 'default',
  eager: true,
})

// The leading 16px slot of a row: a glyph, an emoji, a person, a calendar
// checkbox, or an event's colour marker.
const RowPrefixView = defineComponent({
  props: {
    prefix: { type: Object as PropType<RowPrefix>, required: true },
    row: { type: Object as PropType<ItemRow>, required: true },
  },
  setup(props) {
    return () => {
      const p = props.prefix
      if ('icon' in p)
        return h(EIcon, {
          name: p.icon,
          class: ['size-4', props.row.iconColor],
        })
      if ('emoji' in p)
        return h(
          'span',
          {
            class:
              'flex size-4 shrink-0 items-center justify-center text-base leading-none',
          },
          p.emoji,
        )
      if ('avatar' in p)
        return h(Avatar, {
          image: avatars[`./avatars/${p.avatar}.png`],
          size: 'xs',
          shape: 'circle',
          label: props.row.label,
        })
      if ('checkbox' in p)
        return h(EIcon, { name: `checkbox-${p.checkbox}`, class: 'size-3.5' })
      return h('span', {
        class: 'mx-[7px] block h-4 w-0.5 rounded-4',
        style: { backgroundColor: p.marker },
      })
    }
  },
})
</script>
