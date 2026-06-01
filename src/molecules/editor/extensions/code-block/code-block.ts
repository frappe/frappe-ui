import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Code from '@tiptap/extension-code'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { markInputRule } from '@tiptap/core'
import { toggleCodeOnBacktick } from '@molecules/editor/extensions/shared/toggle-code-shortcut'
import {
  INDENT,
  getCodeBlockCtx,
  lineStartsBetween,
} from './code-block-indent'
import CodeBlockComponent from './CodeBlockComponent.vue'

export const inputRegex = /(?<=^|[^`])`([^`]+)`(?!`)$/

const lowlight = createLowlight(common)

export const ExtendedCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(CodeBlockComponent)
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        const { state, dispatch } = this.editor.view
        const ctx = getCodeBlockCtx(state)
        if (!ctx) return false

        const { start, text, fromOffset, toOffset } = ctx
        const multiline = text.slice(fromOffset, toOffset).includes('\n')
        const tr = state.tr
        if (multiline) {
          for (const off of lineStartsBetween(text, fromOffset, toOffset)) {
            const pos = tr.mapping.map(start + off)
            tr.insertText(INDENT, pos)
          }
        } else {
          tr.insertText(INDENT, state.selection.from)
        }
        dispatch(tr)
        return true
      },
      'Shift-Tab': () => {
        const { state, dispatch } = this.editor.view
        const ctx = getCodeBlockCtx(state)
        if (!ctx) return false

        const { start, text, fromOffset, toOffset } = ctx
        const tr = state.tr
        for (const off of lineStartsBetween(text, fromOffset, toOffset)) {
          let len = 0
          if (text.slice(off, off + 4) === INDENT) len = 4
          else if (text[off] === '\t') len = 1

          if (len > 0) {
            const s = tr.mapping.map(start + off)
            const e = tr.mapping.map(start + off + len)
            tr.delete(s, e)
          }
        }

        dispatch(tr)
        return true
      },
      '`': () => toggleCodeOnBacktick(this.editor),
    }
  },
}).configure({ lowlight })

export const ExtendedCode = Code.extend({
  addKeyboardShortcuts() {
    return {
      '`': () => toggleCodeOnBacktick(this.editor),
    }
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ]
  },
})
