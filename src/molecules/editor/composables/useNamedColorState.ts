import type { Editor } from '@tiptap/core'
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { PALETTE_NAMES } from '#molecules/editor/extensions/shared/color-palette'

export interface NamedColorState {
  /** The active named text color, or `null` when none / mixed / unset. */
  activeTextColor: Ref<string | null>
  /** The active named highlight color, or `null` when none / mixed / unset. */
  activeHighlightColor: Ref<string | null>
  /** Set the text color by name; `null` unsets it. */
  setText: (name: string | null) => void
  /** Set the highlight color by name; `null` unsets it. */
  setHighlight: (name: string | null) => void
}

/**
 * Reactive active-color state + setters for the font-color picker.
 *
 * Reads the active named text/highlight color off the editor using the same
 * leak-free subscription pattern as `useNodeViewEditable` — listeners attach in
 * `onMounted` and detach in `onBeforeUnmount`. Every editor read/write is
 * guarded against a destroyed editor.
 */
export function useNamedColorState(editor: Editor): NamedColorState {
  const activeTextColor = ref<string | null>(null)
  const activeHighlightColor = ref<string | null>(null)

  /** First palette name for which the given mark/attr is active, else null. */
  const firstActive = (
    probe: (name: string) => boolean,
  ): string | null => {
    for (const name of PALETTE_NAMES) {
      if (probe(name)) return name
    }
    return null
  }

  const sync = () => {
    if (!editor || editor.isDestroyed) return
    activeTextColor.value = firstActive((name) =>
      editor.isActive('textStyle', { color: name }),
    )
    activeHighlightColor.value = firstActive((name) =>
      editor.isActive('namedHighlight', { color: name }),
    )
  }

  onMounted(() => {
    sync()
    if (!editor || editor.isDestroyed) return
    editor.on('transaction', sync)
    editor.on('selectionUpdate', sync)
  })

  onBeforeUnmount(() => {
    if (!editor) return
    editor.off('transaction', sync)
    editor.off('selectionUpdate', sync)
  })

  const setText = (name: string | null) => {
    if (!editor || editor.isDestroyed) return
    if (name) editor.chain().focus().setColorByName(name).run()
    else editor.chain().focus().unsetColor().run()
  }

  const setHighlight = (name: string | null) => {
    if (!editor || editor.isDestroyed) return
    if (name) editor.chain().focus().toggleHighlightByName(name).run()
    else editor.chain().focus().unsetHighlight().run()
  }

  return { activeTextColor, activeHighlightColor, setText, setHighlight }
}
