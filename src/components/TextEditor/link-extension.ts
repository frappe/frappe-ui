import Link from '@tiptap/extension-link'
import { createApp, h } from 'vue'
import EditLink from './EditLink.vue'
import tippy from 'tippy.js'

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

        openLinkEditor(existingHref, editor.view.dom)
          .then((href) => {
            if (href === null) {
              return
            }

            if (href === '') {
              editor
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
              return
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
            const charAfter =
              posAfterLink < doc.content.size
                ? doc.textBetween(posAfterLink, posAfterLink + 1)
                : null

            if (charAfter === null || charAfter !== ' ') {
              chain = chain.insertContent(' ')
            }

            chain.run()
          })
          .catch(() => {})

        return true
      },
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
