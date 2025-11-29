import { createApp, h } from 'vue'
import Link from '@tiptap/extension-link'
import tippy, { type Instance as TippyInstance } from 'tippy.js'
import { getMarkRange, Range, Editor } from '@tiptap/core'
import { MarkType, Mark as ProseMirrorMark } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import LinkPopup from './LinkPopup.vue'
import { linkPasteHandler } from './linkPasteHandler'

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
      linkOnPaste: false,
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
          let mark: ProseMirrorMark | undefined = undefined
          let shouldDelayPopover = false

          // Check if cursor is within a link or if there's a selection
          if (from === to) {
            // Cursor is within a link
            const $pos = state.selection.$from
            const markRange = getMarkRange($pos, this.type)
            if (markRange) {
              range = markRange
              const node = doc.nodeAt($pos.pos)
              if(node) mark = node.marks.find((m) => m.type === this.type)

              // Select the link text
              editor
                .chain()
                .setTextSelection({ from: markRange.from, to: markRange.to })
                .run()
              shouldDelayPopover = true
            } else {
              // No selection and not within a link, and cursor not in link
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

          const showPopover = () => {
            openLinkEditor(existingHref, editor.view.dom)
              .then((href) => {
                if (href === null) {
                  return
                }

                let chain = editor
                  .chain()
                  .focus(null, { scrollIntoView: false })

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
                  .setTextSelection(selectionTo)
                  .command(({ tr }) => {
                    tr.setStoredMarks([])
                    return true
                  })

                chain.run()
              })
              .catch(() => {})
          }

          if (shouldDelayPopover) {
            requestAnimationFrame(showPopover)
          } else {
            showPopover()
          }

          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => this.editor.commands.openLinkEditor(),
    }
  },

  addProseMirrorPlugins() {
    let plugins = this.parent?.() || []
    plugins.push(
      linkPasteHandler({
        editor: this.editor,
        defaultProtocol: this.options.defaultProtocol,
        type: this.type,
      }),
    )

    plugins.push(
      clearLinkOnBoundaryPlugin({
        editor: this.editor,
        type: this.type,
      }),
    )
    plugins.push(
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            if (!this.editor.isEditable) return
            if (!this.editor.isActive('link')) return false
            event.preventDefault()
            if (event.metaKey) {
              const url = event.target?.getAttribute('href')
              if (url) window.open(url, '_blank')
            } else {
              this.editor.commands.openLinkEditor()
            }
          },
        },
      }),
    )
    return plugins
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
      const isCollapsed = range.collapsed

      virtualReference = {
        getBoundingClientRect: () => ({
          width: 0,
          height: rect.height,
          top: rect.top,
          right: isCollapsed ? rect.left : rect.right,
          bottom: rect.bottom,
          left: rect.left,
          x: rect.left,
          y: rect.top,
          toJSON: () => {},
        }),
      }
    } else {
      virtualReference = {
        getBoundingClientRect: () => anchor.getBoundingClientRect(),
      }
    }

    let app: ReturnType<typeof createApp> | null = null
    let tippyInstance: TippyInstance | null = null
    let isDestroyed = false
    let promiseSettled = false

    const settlePromise = (action: 'resolve' | 'reject', value?: any) => {
      if (promiseSettled) return
      promiseSettled = true
      if (action === 'resolve') {
        resolve(value)
      } else {
        reject(value)
      }
    }

    const destroy = () => {
      if (isDestroyed) return
      isDestroyed = true

      settlePromise('reject', 'Link editing cancelled or destroyed')

      requestAnimationFrame(() => {
        tippyInstance?.destroy()
        app?.unmount()
        container?.remove()
        app = null
        tippyInstance = null
      })
    }

    app = createApp({
      render() {
        return h(LinkPopup, {
          href,
          onClose: () => {
            settlePromise('reject', 'Link editing cancelled')
            destroy()
          },
          onUpdateHref: (newHref: string) => {
            settlePromise('resolve', newHref)
            destroy()
          },
        })
      },
    })

    app.mount(container)

    tippyInstance = tippy(anchor, {
      getReferenceClientRect: () => virtualReference.getBoundingClientRect(),
      content: container,
      trigger: 'manual',
      interactive: true,
      appendTo: () => anchor.closest('[role="dialog"]') || document.body,
      placement: 'top',
      arrow: false,
      theme: 'link-editor',
      maxWidth: 'none',
      onHidden() {
        destroy()
      },
      hideOnClick: true,
      interactiveDebounce: 75,
    })

    if (!tippyInstance) {
      container.remove()
      settlePromise('reject', 'Failed to initialize link editor tooltip')
      return
    }

    tippyInstance.show()
  })
}

function clearLinkOnBoundaryPlugin(options: {
  editor: Editor
  type: MarkType
}) {
  return new Plugin({
    key: new PluginKey('clearLinkMarkOnBoundary'),
    appendTransaction: (transactions, oldState, newState) => {
      if (!options.editor.isEditable) {
        return null
      }

      const { tr, doc, selection, storedMarks } = newState
      const { $from, empty } = selection

      if (!empty || !storedMarks || storedMarks.length === 0) {
        // Only apply for cursor selections and if there are stored marks
        return null
      }

      const linkMarkType = options.type
      const hasStoredLinkMark = storedMarks.some(
        (mark) => mark.type === linkMarkType,
      )

      if (!hasStoredLinkMark) {
        return null
      }

      // Check if the cursor position itself has an active link mark in the document
      const marksAtCursor = $from.marks()
      const activeLinkAtCursor = marksAtCursor.some(
        (mark) => mark.type === linkMarkType,
      )

      if (activeLinkAtCursor) {
        // If there's an actual link mark active in the document at the cursor,
        // then it's correct for the stored mark to be there.
        return null
      }

      // If we are here, it means:
      // 1. Selection is a cursor (empty).
      // 2. There's a stored link mark.
      // 3. There's no active link mark in the document at the cursor position.
      // This indicates the stored link mark should be cleared.
      return tr.setStoredMarks([])
    },
  })
}

export default LinkExtension
