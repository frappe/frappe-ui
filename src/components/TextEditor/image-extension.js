// Plugin adapted from the following examples:
// - https://github.com/ueberdosis/tiptap/blob/main/packages/extension-image/src/image.ts
// - https://gist.github.com/slava-vishnyakov/16076dff1a77ddaca93c4bccd4ec4521

import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import fileToBase64 from '../../utils/file-to-base64'

export const inputRegex =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export default Node.create({
  name: 'image',
  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    }
  },
  inline() {
    return this.options.inline
  },
  group() {
    return this.options.inline ? 'inline' : 'block'
  },
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match

          return { src, alt, title }
        },
      }),
    ]
  },

  addProseMirrorPlugins() {
    return [dropImagePlugin()]
  },
})

const dropImagePlugin = () => {
  return new Plugin({
    props: {
      handlePaste(view, event, slice) {
        const items = Array.from(event.clipboardData?.items || [])
        const { schema } = view.state

        items.forEach((item) => {
          const image = item.getAsFile()
          if (!image) return

          if (item.type.indexOf('image') === 0) {
            event.preventDefault()

            fileToBase64(image).then((base64) => {
              const node = schema.nodes.image.create({
                src: base64,
              })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)
            })
          }
        })

        return false
      },
      handleDOMEvents: {
        drop: (view, event) => {
          const hasFiles =
            event.dataTransfer &&
            event.dataTransfer.files &&
            event.dataTransfer.files.length

          if (!hasFiles) {
            return false
          }

          const images = Array.from(event.dataTransfer?.files ?? []).filter(
            (file) => /image/i.test(file.type)
          )

          if (images.length === 0) {
            return false
          }

          event.preventDefault()

          const { schema } = view.state
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })
          if (!coordinates) return false

          images.forEach(async (image) => {
            fileToBase64(image).then((base64) => {
              const node = schema.nodes.image.create({
                src: base64,
              })
              const transaction = view.state.tr.insert(coordinates.pos, node)
              view.dispatch(transaction)
            })
          })

          return true
        },
      },
    },
  })
}
