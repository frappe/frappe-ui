import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

interface StyleClipboardOptions {
  enabled: boolean
}

const StyleClipboardExtension = Extension.create<StyleClipboardOptions>({
  name: 'styleClipboard',

  addOptions() {
    return { enabled: true }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.storeStyles(),
      'Mod-Shift-v': () =>this.editor.commands.applyStyles()
    }
  },
  addCommands() {
    return {
      storeStyles:
        () =>
        ({ editor }) => {
          console.log('in')
          const { state } = editor
          const { from, to } = state.selection
          if (from === to) return false

          const marks: Record<string, any> = {}
          state.doc.nodesBetween(from, to, (node) => {
            node.marks.forEach((mark) => (marks[mark.type.name] = mark.attrs))
          })

          // You could also store node attributes like font size, color, etc.
          const storedNodeAttrs = state.doc.resolve(from).parent.attrs
          editor.storage.styleClipboard = {
            marks,
            nodeAttrs: storedNodeAttrs,
          }
          console.log('Stored styles:', this.editor.storage.styleClipboard)
          return true
        },

      applyStyles:
        () =>
        ({ editor, tr, dispatch }) => {
          const { view, state } = editor
          const { from, to } = state.selection
          const stored = editor.storage?.styleClipboard
          if (!stored) return false

          const { marks, nodeAttrs } = stored
          for (const [markName, attrs] of Object.entries(marks)) {
            const markType = state.schema.marks[markName]
            const mark = markType.create(attrs)
            console.log(markType, mark)
            if (mark) tr.addMark(from, to, mark)
          }

          //   // Optionally apply node attributes (like font size)
          //   if (nodeAttrs) {
          //     chain().updateAttributes(
          //       state.selection.$from.parent.type.name,
          //       nodeAttrs,
          //     )
          //   }

          dispatch(tr)
          return true
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
  //   addProseMirrorPlugins() {
  //     const extensionThis = this

  //     return [
  //       new Plugin({
  //         key: new PluginKey('styleClipboardKey'),
  //         props: {
  //           handleDOMEvents: {
  //             paste: (view, event: KeyboardEvent) => {
  //                 console.log(event)
  //               if (event.shiftKey) event.preventDefault()
  //             },
  //           },
  //         },
  //       }),
  //     ]
  //   },
})

export default StyleClipboardExtension
