/**
 * Style-clipboard ("format painter") extension. Name PRESERVED: `styleClipboard`.
 *
 * `storeStyles` captures the inline marks AND block/node attributes of the
 * current selection and arms the painter. While armed, releasing the mouse over
 * a new selection applies those styles (one-shot, then disarms). `applyStyles`
 * does the write; `clearStyles` strips the copyable styles; `Escape` cancels the
 * painter. The format painter carries BOTH marks and block attributes (locked
 * decision) — see `style-clipboard-utils.applyMarksAndAttrs`.
 *
 * Fixes (PLAN cluster 11): no `console.log`; `clearStyles`/`Escape` return an
 * explicit boolean; empty-selection guard (`from === to` → `false`); `mouseup`
 * painting gated on an explicit `painting` flag set only by `storeStyles`.
 */
import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import {
  applyMarksAndAttrs,
  clearMarksAndAttrs,
  collectBlockAttrs,
  collectMarks,
  type StyleClipboardState,
} from './style-clipboard-utils'

export interface StyleClipboardOptions {
  enabled: boolean
}

export interface StyleClipboardStorage {
  /** Captured styles, or `null` when the painter is unarmed. */
  data: StyleClipboardState | null
  /** Whether the painter is armed (set by `storeStyles`, cleared on apply/cancel). */
  painting: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    styleClipboard: {
      /** Capture the selection's styles and arm the format painter. */
      storeStyles: () => ReturnType
      /** Apply the captured styles to the current selection, then disarm. */
      applyStyles: () => ReturnType
      /** Strip the copyable marks/attributes from the current selection. */
      clearStyles: () => ReturnType
    }
  }
}

const StyleClipboardExtension = Extension.create<
  StyleClipboardOptions,
  StyleClipboardStorage
>({
  name: 'styleClipboard',

  addOptions() {
    return { enabled: true }
  },

  addStorage() {
    return { data: null, painting: false }
  },

  addCommands() {
    return {
      storeStyles:
        () =>
        ({ editor }) => {
          const { state } = editor
          const { from, to } = state.selection
          if (from === to) return false

          this.storage.data = {
            marks: collectMarks(state, from, to),
            nodeAttrs: collectBlockAttrs(state, from),
          }
          this.storage.painting = true
          return true
        },

      applyStyles:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor
          const { from, to } = state.selection
          if (from === to) return false

          const stored = this.storage.data
          if (!stored) return false

          applyMarksAndAttrs(state, tr, from, to, stored)
          dispatch?.(tr)
          this.storage.data = null
          this.storage.painting = false
          return true
        },

      clearStyles:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor
          const { from, to } = state.selection
          if (from === to) return false

          clearMarksAndAttrs(state, tr, from, to)
          dispatch?.(tr)
          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Escape: () => {
        if (!this.storage.data && !this.storage.painting) return false
        this.storage.data = null
        this.storage.painting = false
        this.editor.commands.focus()
        return true
      },
    }
  },

  addProseMirrorPlugins() {
    const extension = this
    return [
      new Plugin({
        view(view) {
          const handleMouseUp = () => {
            if (!extension.storage.painting || !extension.storage.data) return
            const { from, to } = view.state.selection
            if (from === to) return
            extension.editor.commands.applyStyles()
          }
          view.dom.addEventListener('mouseup', handleMouseUp)
          return {
            destroy() {
              view.dom.removeEventListener('mouseup', handleMouseUp)
            },
          }
        },
      }),
    ]
  },
})

export default StyleClipboardExtension
