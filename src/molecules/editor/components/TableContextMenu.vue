<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '../useEditor'
import type { CommandMenuItem, MenuItem } from '../menu'

/**
 * Vertical, labelled table actions for the right-click context menu. Renders the
 * same `tableToolbar` items the floating toolbar uses (icon + label here), and
 * runs them against the editor. Mounted imperatively by `EditorTableMenu` via
 * `useFloatingPopup`, which owns positioning and outside-click / Escape close.
 */
const props = defineProps<{
  editor: Editor
  items: MenuItem[]
  /** Called after an action runs, so the host can close the menu. */
  onRun?: () => void
}>()

function isSeparator(item: MenuItem): item is { type: 'separator' } {
  return 'type' in item && item.type === 'separator'
}
function isCommand(item: MenuItem): item is CommandMenuItem {
  return !('type' in item)
}
function isAvailable(item: CommandMenuItem): boolean {
  return item.isAvailable?.(props.editor) !== false
}

// Keep available commands; collapse separators so none ends up leading,
// trailing, or doubled after filtering.
const visible = computed<MenuItem[]>(() => {
  const out: MenuItem[] = []
  for (const item of props.items) {
    if (isSeparator(item)) {
      const last = out[out.length - 1]
      if (last && !isSeparator(last)) out.push(item)
    } else if (isCommand(item) && isAvailable(item)) {
      out.push(item)
    }
  }
  if (out.length && isSeparator(out[out.length - 1])) out.pop()
  return out
})

function disabled(item: CommandMenuItem): boolean {
  return item.isDisabled?.(props.editor) === true
}

function run(item: CommandMenuItem, event: MouseEvent): void {
  if (disabled(item)) return
  item.action(props.editor, {
    event,
    trigger: event.currentTarget as HTMLElement | undefined,
  })
  props.onRun?.()
}
</script>

<template>
  <div
    role="menu"
    class="min-w-[208px] rounded-lg border border-outline-gray-1 bg-surface-white p-1 text-base shadow-xl outline-none"
  >
    <template v-for="(item, index) in visible" :key="index">
      <div
        v-if="isSeparator(item)"
        class="my-1 h-px bg-surface-gray-2"
        aria-hidden="true"
      />
      <button
        v-else-if="isCommand(item)"
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-ink-gray-8 hover:bg-surface-gray-3 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disabled(item)"
        @click="run(item, $event)"
      >
        <span
          v-if="typeof item.icon === 'string'"
          :class="['size-4 shrink-0', item.icon]"
          aria-hidden="true"
        />
        <span>{{ item.label }}</span>
      </button>
    </template>
  </div>
</template>
