import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { createApp, h } from 'vue'
import ImageViewerModal from './ImageViewerModal.vue'

interface ImageInfo {
  src: string
  alt: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageViewer: {
      /**
       * Open the image viewer
       */
      openImageViewer: (src: string) => ReturnType
    }
  }
}

export default Extension.create({
  name: 'imageViewer',

  onBeforeCreate() {
    // Only add the style if it doesn't already exist
    if (!document.querySelector('style[data-image-viewer-style]')) {
      // Add a CSS rule to make images clickable when the editor is not editable
      const style = document.createElement('style')
      style.textContent = `
          .ProseMirror:not(.ProseMirror-focused) img {
            cursor: pointer;
          }
        `
      style.setAttribute('data-image-viewer-style', 'true')
      document.head.appendChild(style)
    }
  },

  onDestroy() {
    // Clean up the style element when the editor instance is destroyed
    const style = document.querySelector('style[data-image-viewer-style]')
    if (style) {
      document.head.removeChild(style)
    }
  },

  addCommands() {
    return {
      openImageViewer:
        (src: string) =>
        ({ editor }) => {
          // Find all images in the document to populate the viewer
          const images: ImageInfo[] = []
          editor.state.doc.descendants((node) => {
            if (node.type.name === 'image') {
              images.push({
                src: node.attrs.src,
                alt: node.attrs.alt || null,
              })
            }
            return true
          })

          // Find the index of the clicked image to start the viewer at the correct position
          const currentIndex = images.findIndex((image) => image.src === src)

          // Create and open the image viewer modal
          openImageViewerModal(images, currentIndex)

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const extension = this

    return [
      new Plugin({
        key: new PluginKey('imageViewer'),
        props: {
          handleClick(view, pos, event) {
            // Only allow opening the viewer when the editor is not editable
            if (extension.editor.isEditable) {
              return false
            }

            const { state } = view
            const clickedNode = state.doc.nodeAt(pos)

            // Check if the click was directly on an image node
            if (clickedNode?.type.name === 'image') {
              event.preventDefault()
              const src = clickedNode.attrs.src
              extension.editor.commands.openImageViewer(src)
              return true // Indicate that the event was handled
            }

            // If the click target was an <img> element, but not directly the node at pos
            // (e.g., clicking near the edge, handled by browser event bubbling)
            if (event.target instanceof HTMLImageElement) {
              let foundImageNode = false
              // Traverse the document to find the ProseMirror node corresponding to the clicked <img>
              state.doc.descendants((node, nodePos) => {
                if (node.type.name === 'image' && !foundImageNode) {
                  const domNode = view.nodeDOM(nodePos)
                  // Check if the event target is the DOM representation of this node or inside it
                  if (
                    domNode &&
                    (domNode === event.target || domNode.contains(event.target))
                  ) {
                    event.preventDefault()
                    extension.editor.commands.openImageViewer(node.attrs.src)
                    foundImageNode = true
                    return false // Stop traversal once found
                  }
                }
                return true // Continue traversal
              })

              if (foundImageNode) return true // Indicate that the event was handled
            }

            return false // Event not handled by this plugin
          },
        },
      }),
    ]
  },
})

function openImageViewerModal(images: ImageInfo[], initialIndex: number) {
  // Create a temporary container div for the Vue modal instance
  const container = document.createElement('div')
  document.body.appendChild(container)

  // Create the Vue app instance for the modal
  const app = createApp({
    render() {
      return h(ImageViewerModal, {
        show: true,
        images, // Pass the collected image data
        initialIndex, // Pass the starting index
        'onUpdate:show': (value: boolean) => {
          // Handle the modal closing
          if (!value) {
            // Delay unmounting and removal to allow for closing animations
            setTimeout(() => {
              app.unmount()
              container.remove()
            }, 0) // Timeout 0 ensures it runs after the current execution context
          }
        },
      })
    },
  })

  // Mount the Vue app to the container div
  app.mount(container)
}
