import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import Mention from '@tiptap/extension-mention'
import MentionList from './MentionList.vue'

export default function configureMention(options) {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: getSuggestionOptions(options),
  })
}

function getSuggestionOptions(options) {
  return {
    items: ({ query }) => {
      return options
        .filter((item) =>
          item.label.toLowerCase().startsWith(query.toLowerCase())
        )
        .slice(0, 5)
    },

    render: () => {
      let component
      let popup
      let handleMentions = true

      return {
        onStart: (props) => {
          handleMentions = props.items && props.items.length
          if (!handleMentions) return
          component = new VueRenderer(MentionList, {
            props,
            editor: props.editor,
          })
          if (!props.clientRect) {
            return
          }
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
          if (!handleMentions) return
          component.updateProps(props)
          if (!props.clientRect) {
            return
          }
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },
        onKeyDown(props) {
          if (!handleMentions) return
          if (props.event.key === 'Escape') {
            popup[0].hide()

            return true
          }
          return component.ref?.onKeyDown(props)
        },
        onExit() {
          if (!handleMentions) return
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  }
}
