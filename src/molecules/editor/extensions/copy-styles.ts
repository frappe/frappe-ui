import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

interface StyleClipboardOptions {
  enabled: boolean
}

const COPIED_MARKS = [
  'textStyle',
  'underline',
  'strike',
  'bold',
  'italic',
  'namedHighlight',
  'namedColor',
]
const PARAGRAPH_ATTRS = ['lineHeight', 'spacingBefore', 'spacingAfter']

const StyleClipboardExtension = Extension.create<StyleClipboardOptions>({
  name: 'styleClipboard',

  addOptions() {
    return { enabled: true }
  },
  addCommands() {
    return {
      storeStyles:
        () =>
        ({ editor }) => {
          const { state } = editor
          const { from, to } = state.selection
          if (from === to) return false

          const marks: Record<string, any> = {}
          state.doc.nodesBetween(from, to, (node) => {
            node.marks.forEach((mark) => (marks[mark.type.name] = mark.attrs))
          })

          const storedNodeAttrs = state.doc.resolve(from).parent.attrs
          this.storage.styleClipboard = {
            marks,
            nodeAttrs: storedNodeAttrs,
          }
          return true
        },

      applyStyles:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor
          const { from, to } = state.selection
          const stored = this.storage?.styleClipboard
          if (!stored) return false

          COPIED_MARKS.forEach((markName) => {
            const markType = state.schema.marks[markName]
            if (markType) {
              tr.removeMark(from, to, markType)
            }
          })

          const { marks } = stored
          for (const [markName, attrs] of Object.entries(marks)) {
            const markType = state.schema.marks[markName]
            if (markType) {
              tr.addMark(from, to, markType.create(attrs))
            }
          }
          dispatch(tr)
          this.storage.styleClipboard = null
          return true
        },

      clearStyles:
        () =>
        ({ editor, tr, dispatch }) => {
          console.log('called!')
          const { state } = editor
          const { from, to } = state.selection
          COPIED_MARKS.forEach((markName) => {
            const markType = state.schema.marks[markName]
            if (markType) {
              tr.removeMark(from, to, markType)
            }
          })

          const paragraphType = state.schema.nodes.paragraph
          if (paragraphType) {
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (node.type === paragraphType) {
                // Reset paragraph attributes to null
                const clearedAttrs: Record<string, null> = {}
                PARAGRAPH_ATTRS.forEach((attr) => {
                  clearedAttrs[attr] = null
                })

                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  ...clearedAttrs,
                })
              }
            })
          }
          dispatch(tr)
        },
    }
  },
  addKeyboardShortcuts() {
    return {
      Escape: ({ tr, dispatch }) => {
        if (this.storage.styleClipboard) {
          console.log(this.storage.styleClipboard)
          this.storage.styleClipboard = null
          this.editor.commands.focus()
          return true
        }
      },
    }
  },
  addStorage() {
    return {
      styleClipboard: null as {
        marks: Record<string, any>
        nodeAttrs: Record<string, any>
      } | null,
    }
  },
  addProseMirrorPlugins() {
    const extension = this

    return [
      new Plugin({
        view(view) {
          const applyIfPainting = () => {
            const stored = extension.storage.styleClipboard
            if (!stored) return

            const { from, to } = view.state.selection
            if (from === to) return

            extension.editor.commands.applyStyles()
          }

          const handleMouseUp = () => applyIfPainting()

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
