<script setup lang="ts">
import { computed, h, type Component } from 'vue'
import type { CommandMenuItem, MenuGroupItem, MenuItem } from './menu'
import type { Editor } from './useEditor'

const props = defineProps<{
  editor: Editor | null
  items: MenuItem[]
}>()

// Renders an item's glyph: a `lucide-*` (or any) string becomes a masked icon
// span (sized here so item definitions stay terse); a component renders as-is;
// with no icon we fall back to the label text.
function ItemContent(p: { item: CommandMenuItem }) {
  const { icon, label } = p.item
  if (!icon) return h('span', label)
  if (typeof icon === 'string')
    return h('span', { class: ['size-4', icon], 'aria-hidden': 'true' })
  return h(icon as Component)
}

/** A command item that ships its own interactive component (e.g. color picker). */
function isComponentItem(
  item: MenuItem,
): item is CommandMenuItem & { component: Component } {
  return !('type' in item) && !!(item as CommandMenuItem).component
}

function isGroup(item: MenuItem): item is MenuGroupItem {
  return 'type' in item && item.type === 'group'
}

function isSeparator(item: MenuItem): item is { type: 'separator' } {
  return 'type' in item && item.type === 'separator'
}

/** An item is shown unless its `isAvailable` returns false (extension absent). */
function isAvailable(item: CommandMenuItem): boolean {
  if (!props.editor) return true
  return item.isAvailable?.(props.editor) !== false
}

// Self-pruning: drop unavailable command items and group sub-items, and any
// group left empty. Separators are pruned to match: a separator only survives
// if it follows a kept (non-separator) item, so pruning a bracketed group never
// leaves a leading, doubled, or trailing divider behind.
const visibleItems = computed<MenuItem[]>(() => {
  const result: MenuItem[] = []
  for (const item of props.items) {
    if (isSeparator(item)) {
      const last = result[result.length - 1]
      if (last && !isSeparator(last)) result.push(item)
    } else if (isGroup(item)) {
      const items = item.items.filter(isAvailable)
      if (items.length) result.push({ ...item, items })
    } else if (isAvailable(item)) {
      result.push(item)
    }
  }
  if (result.length && isSeparator(result[result.length - 1])) result.pop()
  return result
})

function run(item: CommandMenuItem, event?: MouseEvent) {
  if (props.editor && !item.isDisabled?.(props.editor)) {
    item.action(props.editor, {
      event,
      trigger: event?.currentTarget as HTMLElement | undefined,
    })
  }
}
</script>

<template>
  <template
    v-for="(item, index) in visibleItems"
    :key="`${'label' in item ? item.label : item.type}-${index}`"
  >
    <span
      v-if="isSeparator(item)"
      data-slot="menu-separator"
      class="mx-1 h-5 w-px bg-surface-gray-3"
      aria-hidden="true"
    />
    <component
      :is="item.component"
      v-else-if="isComponentItem(item) && editor"
      :editor="editor"
    >
      <template #default="trigger">
        <button
          type="button"
          class="inline-flex size-6 items-center justify-center rounded text-sm text-ink-gray-7 hover:bg-surface-gray-3 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-surface-gray-3"
          :aria-label="item.label"
          :aria-pressed="
            trigger.isActive === true || item.isActive?.(editor) === true
          "
          :disabled="item.isDisabled?.(editor) === true"
          @click="
            item.isDisabled?.(editor) === true ? undefined : trigger.onClick()
          "
        >
          <ItemContent :item="item" />
        </button>
      </template>
    </component>
    <div
      v-else-if="isGroup(item)"
      data-slot="menu-group"
      class="flex items-center gap-1"
    >
      <span class="px-2 text-sm font-medium text-ink-gray-7">{{
        item.label
      }}</span>
      <button
        v-for="groupItem in item.items"
        :key="groupItem.label"
        type="button"
        class="inline-flex size-6 items-center justify-center rounded text-sm text-ink-gray-7 hover:bg-surface-gray-3 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-surface-gray-3"
        :aria-label="groupItem.label"
        :aria-pressed="editor ? groupItem.isActive?.(editor) === true : false"
        :disabled="!editor || groupItem.isDisabled?.(editor) === true"
        @click="run(groupItem, $event)"
      >
        <ItemContent :item="groupItem" />
      </button>
    </div>
    <button
      v-else
      type="button"
      class="inline-flex size-6 items-center justify-center rounded text-sm text-ink-gray-7 hover:bg-surface-gray-3 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-surface-gray-3"
      :aria-label="item.label"
      :aria-pressed="editor ? item.isActive?.(editor) === true : false"
      :disabled="!editor || item.isDisabled?.(editor) === true"
      @click="run(item, $event)"
    >
      <ItemContent :item="item" />
    </button>
  </template>
</template>
