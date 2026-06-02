<script setup lang="ts">
import { computed, h, ref, watch, type Component } from 'vue'
import type { CommandMenuItem, MenuGroupItem, MenuItem } from './menu'
import type { Editor } from './useEditor'
import Tooltip from '#components/Tooltip/Tooltip.vue'
import TooltipProvider from '#components/Tooltip/TooltipProvider.vue'

const props = defineProps<{
  editor: Editor | null
  items: MenuItem[]
}>()

// The editor from `useEditor` is built on `@tiptap/core` (not `@tiptap/vue-3`),
// so it isn't a reactive ref — `isActive`/`isDisabled` reads of `editor.state`
// won't re-render on their own. Bump a version on every transaction and touch it
// from each state read so toolbar buttons track the selection. Scoped per
// MenuItems instance, so it works with or without `<Editor>` (Primitives recipe).
const version = ref(0)
watch(
  () => props.editor,
  (editor, _old, onCleanup) => {
    if (typeof editor?.on !== 'function') return
    const bump = () => {
      version.value++
    }
    editor.on('transaction', bump)
    onCleanup(() => editor.off('transaction', bump))
  },
  { immediate: true },
)

/** Active ("pressed") state for an item, re-evaluated on each transaction. */
function isPressed(item: CommandMenuItem): boolean {
  void version.value
  return !!props.editor && item.isActive?.(props.editor) === true
}

/** Disabled state for an item, re-evaluated on each transaction. */
function isItemDisabled(item: CommandMenuItem): boolean {
  void version.value
  return !props.editor || item.isDisabled?.(props.editor) === true
}

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
  <!-- One shared provider so once any button's tooltip opens, neighbouring
       buttons show theirs instantly (skip-delay) — toolbar-friendly. Renderless,
       so the parent's flex layout is unaffected. -->
  <TooltipProvider>
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
            :aria-pressed="trigger.isActive === true || isPressed(item)"
            :disabled="isItemDisabled(item)"
            @click="isItemDisabled(item) ? undefined : trigger.onClick()"
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
        <Tooltip
          v-for="groupItem in item.items"
          :key="groupItem.label"
          :text="groupItem.label"
        >
          <button
            type="button"
            class="inline-flex size-6 items-center justify-center rounded text-sm text-ink-gray-7 hover:bg-surface-gray-3 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-surface-gray-3"
            :aria-label="groupItem.label"
            :aria-pressed="isPressed(groupItem)"
            :disabled="isItemDisabled(groupItem)"
            @click="run(groupItem, $event)"
          >
            <ItemContent :item="groupItem" />
          </button>
        </Tooltip>
      </div>
      <Tooltip v-else :text="item.label">
        <button
          type="button"
          class="inline-flex size-6 items-center justify-center rounded text-sm text-ink-gray-7 hover:bg-surface-gray-3 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:bg-surface-gray-3"
          :aria-label="item.label"
          :aria-pressed="isPressed(item)"
          :disabled="isItemDisabled(item)"
          @click="run(item, $event)"
        >
          <ItemContent :item="item" />
        </button>
      </Tooltip>
    </template>
  </TooltipProvider>
</template>
