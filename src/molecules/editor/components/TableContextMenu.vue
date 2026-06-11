<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import type { Editor } from '../useEditor'
import type { CommandMenuItem, MenuItem } from '../menu'

/**
 * Vertical, labelled table actions for the right-click context menu. Renders the
 * same `tableToolbar` items the floating toolbar uses (icon + label here, plus a
 * check for toggle items), and runs them against the editor. Mounted
 * imperatively by `EditorTableMenu` via `useFloatingPopup`, which owns
 * positioning and outside-click / Escape close; arrow-key focus is handled
 * here, menu-style.
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

function labelOf(item: CommandMenuItem): string {
  return item.getLabel?.(props.editor) ?? item.label
}

function disabled(item: CommandMenuItem): boolean {
  return item.isDisabled?.(props.editor) === true
}

function isChecked(item: CommandMenuItem): boolean {
  return item.isActive?.(props.editor) === true
}

function run(item: CommandMenuItem, event: MouseEvent): void {
  if (disabled(item)) return
  item.action(props.editor, {
    event,
    trigger: event.currentTarget as HTMLElement | undefined,
  })
  props.onRun?.()
}

// --- Menu-style keyboard support -------------------------------------------
const menuEl = useTemplateRef<HTMLElement>('menu')

function focusables(): HTMLButtonElement[] {
  return Array.from(
    menuEl.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ??
      [],
  )
}

onMounted(() => focusables()[0]?.focus())

// The popup host removes the menu without restoring focus; hand it back to the
// editor so keyboard users don't land on <body>.
onBeforeUnmount(() => {
  if (menuEl.value?.contains(document.activeElement)) {
    try {
      props.editor.view.focus()
    } catch {
      // view already destroyed
    }
  }
})

function onKeydown(event: KeyboardEvent) {
  const list = focusables()
  if (!list.length) return
  const index = list.indexOf(document.activeElement as HTMLButtonElement)
  let next = -1
  if (event.key === 'ArrowDown') next = (index + 1) % list.length
  else if (event.key === 'ArrowUp')
    next = index <= 0 ? list.length - 1 : index - 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = list.length - 1
  else return
  event.preventDefault()
  list[next]?.focus()
}
</script>

<template>
  <div
    ref="menu"
    role="menu"
    class="min-w-[208px] rounded-lg border border-outline-gray-1 bg-surface-elevation-2 p-1 text-base shadow-xl outline-none"
    @keydown="onKeydown"
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
        :role="item.isActive ? 'menuitemcheckbox' : 'menuitem'"
        :aria-checked="item.isActive ? isChecked(item) : undefined"
        class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-ink-gray-8 hover:bg-surface-gray-3 focus-visible:bg-surface-gray-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disabled(item)"
        @click="run(item, $event)"
      >
        <span
          v-if="typeof item.icon === 'string'"
          :class="['size-4 shrink-0', item.icon]"
          aria-hidden="true"
        />
        <span>{{ labelOf(item) }}</span>
        <span
          v-if="isChecked(item)"
          class="lucide-check ml-auto size-4 shrink-0"
          aria-hidden="true"
        />
      </button>
    </template>
  </div>
</template>
