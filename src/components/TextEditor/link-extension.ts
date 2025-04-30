import Link from '@tiptap/extension-link'
import { createApp, h } from 'vue'
import EditLink from './EditLink.vue'
import tippy from 'tippy.js'
import { getMarkRange, Mark, Range, Editor } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      /**
       * Opens the link editor bubble menu.
       */
      openLinkEditor: () => ReturnType
    }
  }
}

export const LinkExtension = Link.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      openLinkEditor:
        () =>
        ({ editor }: { editor: Editor }): boolean => {
          const { state } = editor
          const { from, to } = state.selection
          const { doc } = state

          let range: Range | undefined = undefined
          let mark: Mark | undefined = undefined

          // Check if cursor is within a link or if there's a selection
          if (from === to) {
            // Cursor is within a link
            const $pos = state.selection.$from
            const markRange = getMarkRange($pos, this.type)
            if (markRange) {
              range = markRange
              mark = doc
                .resolve(markRange.from)
                .marks()
                .find((m) => m.type === this.type)
            } else {
              // No selection and not within a link
              return false
            }
          } else {
            // There is a selection
            range = { from, to }
            // Check if the selection is already a link
            mark = doc
              .resolve(from)
              .marks()
              .find((m) => m.type === this.type)
          }

          if (!range) return false

          const existingHref = mark?.attrs.href || ''
          const selectionFrom = range.from
          const selectionTo = range.to

          openLinkEditor(existingHref, editor.view.dom)
            .then((href) => {
              if (href === null) {
                return
              }

              let chain = editor.chain().focus(null, { scrollIntoView: false })

              if (href === '') {
                chain
                  .setTextSelection({ from: selectionFrom, to: selectionTo })
                  .unsetLink()
                  .command(({ tr }) => {
                    tr.setStoredMarks([])
                    return true
                  })
                  .run()
                return
              }

              chain = chain
                .setTextSelection({ from: selectionFrom, to: selectionTo })
                .setLink({ href })
                .setTextSelection(selectionTo) // Move cursor to the end of the link
                .command(({ tr }) => {
                  tr.setStoredMarks([]) // Clear stored marks to avoid applying link to next typed char
                  return true
                })

              const posAfterLink = selectionTo
              const charAfter =
                posAfterLink < doc.content.size
                  ? doc.textBetween(posAfterLink, posAfterLink + 1)
                  : null

              // Insert a space after the link if needed
              if (charAfter === null || charAfter !== ' ') {
                chain = chain.insertContent(' ')
              }

              chain.run()
            })
            .catch(() => {}) // Ignore cancellation

          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => this.editor.commands.openLinkEditor(),
    }
  },
})

function openLinkEditor(href: string, anchor: HTMLElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    let virtualReference: {
      getBoundingClientRect: () => DOMRect | { [key: string]: any }
    }

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      virtualReference = {
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          top: rect.top,
          right: rect.left + rect.width / 2,
          bottom: rect.top,
          left: rect.left + rect.width / 2,
          x: rect.left + rect.width / 2,
          y: rect.top,
          toJSON: () => {},
        }),
      }
    } else {
      virtualReference = {
        getBoundingClientRect: () => anchor.getBoundingClientRect(),
      }
    }

    const app = createApp({
      render() {
        return h(EditLink, {
          show: true,
          href,
          onClose: () => {
            destroy()
            reject('Link editing cancelled')
          },
          onUpdateHref: (newHref: string) => {
            destroy()
            resolve(newHref)
          },
        })
      },
    })

    app.mount(container)

    const tippyInstance = tippy(anchor, {
      getReferenceClientRect: () => virtualReference.getBoundingClientRect(),
      content: container,
      trigger: 'manual',
      interactive: true,
      appendTo: document.body,
      placement: 'top',
      arrow: false,
      theme: 'link-editor',
      maxWidth: 'none',
      onHidden() {
        destroy()
        reject('Link editing cancelled')
      },
    })

    function destroy() {
      setTimeout(() => {
        tippyInstance.destroy()
        app.unmount()
        container.remove()
      }, 0)
    }

    tippyInstance.show()
  })
}

export default LinkExtension
