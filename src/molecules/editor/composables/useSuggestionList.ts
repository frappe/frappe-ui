import { ref, watch, type Ref } from 'vue'
import type { SuggestionListExpose } from '#molecules/editor/extensions/shared/suggestion-types'

/**
 * Selection + keyboard state machine shared by `SuggestionList.vue`.
 *
 * Canonical import path:
 *   `#molecules/editor/composables/useSuggestionList`
 *
 * Owns the empty-list guard: ArrowUp/ArrowDown short-circuit when there are no
 * items, so the wrap-around index math never evaluates `% 0` (which would yield
 * `NaN`). Enter/Arrow keys are consumed (`return true`) only when there is a
 * list to act on; everything else falls through (`return false`).
 */
export function useSuggestionList<T>(
  items: Ref<T[]>,
  onSelect: (item: T) => void,
): {
  selectedIndex: Ref<number>
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
} {
  const selectedIndex = ref(0)

  function select(index: number): void {
    const item = items.value[index]
    if (item !== undefined) onSelect(item)
  }

  function onKeyDown({ event }: { event: KeyboardEvent }): boolean {
    const count = items.value.length
    // Empty-list guard: never run `% 0`.
    if (!count) return false

    if (event.key === 'ArrowUp') {
      selectedIndex.value = (selectedIndex.value + count - 1) % count
      return true
    }
    if (event.key === 'ArrowDown') {
      selectedIndex.value = (selectedIndex.value + 1) % count
      return true
    }
    if (event.key === 'Enter') {
      select(selectedIndex.value)
      return true
    }
    return false
  }

  // Reset selection whenever the result set changes.
  watch(items, () => {
    selectedIndex.value = 0
  })

  return { selectedIndex, onKeyDown }
}

/**
 * Thin forwarder so wrapper list components (EmojiList / SlashCommandsList)
 * don't duplicate the `ref?.onKeyDown(...) ?? false` boilerplate.
 */
export function forwardKeyDown(
  listRef: Ref<SuggestionListExpose | null>,
): (props: { event: KeyboardEvent }) => boolean {
  return (props: { event: KeyboardEvent }) =>
    listRef.value?.onKeyDown(props) ?? false
}
