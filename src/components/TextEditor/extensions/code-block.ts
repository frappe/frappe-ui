import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Code from '@tiptap/extension-code'
import CodeBlockComponent from '../CodeBlockComponent.vue'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { markInputRule } from '@tiptap/core'

const INDENT = ' '.repeat(4)
export const inputRegex = /(?<=^|[^`])`([^`]+)`(?!`)$/

function getCodeBlockCtx(state: any) {
  const { $from, from, to } = state.selection
  let d = $from.depth
  while (d > 0 && $from.node(d).type.name !== 'codeBlock') d--
  if (d === 0) return null

  const node = $from.node(d)
  const start = $from.start(d)
  const text: string = node.textContent
  const fromOffset = from - start
  const toOffset = to - start
  return { start, text, fromOffset, toOffset }
}

function lineStartsBetween(text: string, fromOffset: number, toOffset: number) {
  let startOff = text.lastIndexOf('\n', Math.max(0, fromOffset - 1)) + 1
  let endOff = toOffset
  if (endOff > 0 && text[endOff - 1] === '\n') endOff--

  const starts: number[] = [startOff]
  let i = startOff
  while (true) {
    const nl = text.indexOf('\n', i)
    if (nl === -1 || nl >= endOff) break
    starts.push(nl + 1)
    i = nl + 1
  }
  return starts
}

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
          if (text.substr(off, 4) === INDENT) len = 4
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
      '`': () => {
        const { from, to } = this.editor.state.selection
        if (from === to) return false
        return this.editor.commands.toggleCode()
      },
    }
  },
}).configure({ lowlight })

export const ExtendedCode = Code.extend({
  addKeyboardShortcuts() {
    return {
      '`': () => {
        const { from, to } = this.editor.state.selection
        if (from === to) return false
        return this.editor.commands.toggleCode()
      },
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
