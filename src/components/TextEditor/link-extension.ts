import Link from '@tiptap/extension-link'

export const LinkExtension = Link.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        const editor = this.editor
        const { state } = editor
        const { from, to } = state.selection
        const { doc } = state

        if (from === to) {
          return false
        }

        const existingHref = editor.getAttributes('link').href || ''

        const href = window.prompt('Enter URL', existingHref)

        if (href === null) {
          return true
        }

        if (href === '') {
          return editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .setTextSelection(to)
            .command(({ tr }) => {
              tr.setStoredMarks([])
              return true
            })
            .run()
        }

        let chain = editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href })
          .setTextSelection(to)
          .command(({ tr }) => {
            tr.setStoredMarks([])
            return true
          })

        const posAfterLink = to
        const nodeAfter = doc.nodeAt(posAfterLink)
        const charAfter =
          posAfterLink < doc.content.size
            ? doc.textBetween(posAfterLink, posAfterLink + 1)
            : null

        if (charAfter === null || charAfter !== ' ') {
          chain = chain.insertContent(' ')
        }

        return chain.run()
      },
    }
  },
})

export default LinkExtension
