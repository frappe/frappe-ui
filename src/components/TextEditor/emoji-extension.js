import { Extension } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import { Suggestion } from '@tiptap/suggestion'
import EmojiList from './EmojiList.vue'
import emojis from './emojis.json'

export default Extension.create({
  name: 'emoji',

  addOptions() {
    return {
      suggestion: {
        char: ':',
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(props.emoji)
            .run()
        },
        items: ({ query }) => {
          return emojis
            .filter((item) =>
              item.name.toLowerCase().includes(query.toLowerCase()),
            )
            .sort((a, b) => {
              const aName = a.name.toLowerCase()
              const bName = b.name.toLowerCase()
              const queryLower = query.toLowerCase()

              // Exact matches first
              if (aName === queryLower && bName !== queryLower) return -1
              if (bName === queryLower && aName !== queryLower) return 1

              // Then names starting with the query
              if (aName.startsWith(queryLower) && !bName.startsWith(queryLower))
                return -1
              if (bName.startsWith(queryLower) && !aName.startsWith(queryLower))
                return 1

              // Then sort by name length (shorter first)
              return aName.length - bName.length
            })
            .slice(0, 5)
        },
        render: () => {
          let component
          let popup

          return {
            onStart: (props) => {
              component = new VueRenderer(EmojiList, {
                props,
                editor: props.editor,
              })

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },
            onUpdate(props) {
              component?.updateProps(props)
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },
            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }
              return component?.ref?.onKeyDown(props)
            },
            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
