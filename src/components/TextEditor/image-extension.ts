import {
  Node as NodeExtension,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNodeView from './ImageNodeView.vue'
import { Plugin, Selection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Node } from '@tiptap/pm/model'
import fileToBase64 from '../../utils/file-to-base64'

export interface ImageOptions {
  /**
   * Function to handle image uploads
   * @default null
   */
  uploadFunction:
    | ((file: File) => Promise<{ src: string; [key: string]: any }>)
    | null

  /**
   * HTML attributes to add to the image element
   * @default {}
   */
  HTMLAttributes: Record<string, any>
}

export interface SetImageOptions {
  src: string
  alt?: string
  title?: string
  width?: string | number | null
  height?: string | number | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Insert an image
       */
      setImage: (options: SetImageOptions) => ReturnType

      /**
       * Upload and insert an image
       */
      uploadImage: (file: File) => ReturnType
    }
  }
}

/**
 * Matches markdown image syntax: ![alt](src "title")
 */
export const inputRegex =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export default NodeExtension.create<ImageOptions>({
  name: 'image',

  group: 'block',
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      loading: {
        default: false,
        parseHTML: () => false,
      },
      uploadId: {
        default: null,
        parseHTML: () => null,
      },
      error: {
        default: null,
        parseHTML: () => null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (node) => {
          if (typeof node === 'string') return {}
          const element = node as HTMLElement
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes || {}, HTMLAttributes),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageNodeView)
  },

  addOptions() {
    return {
      uploadFunction: null,
      HTMLAttributes: {},
    }
  },

  addCommands() {
    return {
      setImage:
        (attributes: SetImageOptions) =>
        ({ commands, editor }) => {
          const result = commands.insertContent({
            type: this.name,
            attrs: attributes,
          })

          // Calculate and update dimensions if successful
          if (result && attributes.src) {
            // Find the newly inserted node
            findImageNodeBySource(editor.view, attributes.src, (node, pos) => {
              updateNodeWithDimensions(
                attributes.src,
                editor.view,
                pos,
                node.attrs,
              )
            })
          }

          return result
        },

      uploadImage:
        (file: File) =>
        ({ editor }) => {
          return uploadImage(file, editor.view, null, this.options)
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
    const extensionThis = this

    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              const hasFiles = event.dataTransfer?.files?.length

              if (!hasFiles || !extensionThis.options.uploadFunction) {
                return false
              }

              const images = Array.from(event.dataTransfer.files).filter(
                (file) => /image/i.test(file.type),
              )

              if (images.length === 0) {
                return false
              }

              event.preventDefault()

              // Set selection to drop position
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })

              let pos: number | null = null
              if (coordinates) {
                pos = coordinates.pos
                const transaction = view.state.tr.setSelection(
                  Selection.near(view.state.doc.resolve(pos)),
                )
                view.dispatch(transaction)
              }

              images.forEach((file) => {
                uploadImage(file, view, pos, extensionThis.options)
              })

              return true
            },
          },

          handlePaste: (view, event, slice) => {
            if (!extensionThis.options.uploadFunction) {
              return false
            }

            const clipboardItems = event.clipboardData?.items
            if (!clipboardItems || clipboardItems.length === 0) {
              return false
            }

            const images: File[] = []

            for (let i = 0; i < clipboardItems.length; i++) {
              const item = clipboardItems[i]
              if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                const file = item.getAsFile()
                if (file) {
                  images.push(file)
                }
              }
            }

            if (images.length === 0) {
              return false
            }

            event.preventDefault()

            images.forEach((file) => {
              uploadImage(file, view, null, extensionThis.options)
            })

            return true
          },
        },

        appendTransaction(transactions, oldState, newState) {
          const newImageNodes: { node: Node; pos: number }[] = []

          if (transactions.some((tr) => tr.docChanged)) {
            newState.doc.descendants((node, pos) => {
              if (
                node.type.name === 'image' &&
                node.attrs.src &&
                (!node.attrs.width || !node.attrs.height) &&
                !node.attrs.loading
              ) {
                newImageNodes.push({ node, pos })
              }
            })
          }

          if (newImageNodes.length === 0) return null

          newImageNodes.forEach(({ node, pos }) => {
            const editor = extensionThis.editor
            if (editor) {
              updateNodeWithDimensions(
                node.attrs.src,
                editor.view,
                pos,
                node.attrs,
              )
            }
          })

          return null
        },
      }),
    ]
  },
})

function uploadImage(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
): boolean {
  if (!options.uploadFunction) {
    console.error('uploadFunction option is not provided')
    return false
  }

  const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  fileToBase64(file)
    .then((base64Result: string) => {
      const node = view.state.schema.nodes.image.create({
        loading: true,
        uploadId,
        src: base64Result, // Base64 preview while uploading
      })

      const tr = view.state.tr

      if (pos != null) {
        tr.insert(pos, node)
      } else {
        tr.replaceSelectionWith(node)
      }

      view.dispatch(tr)

      return options.uploadFunction(file)
    })
    .then((uploadedImage: any) => {
      return getImageDimensions(uploadedImage.src)
        .then((dimensions) => {
          return {
            ...uploadedImage,
            width: dimensions.width,
            height: dimensions.height,
          }
        })
        .catch(() => {
          return uploadedImage
        })
    })
    .then((uploadedImage: any) => {
      const transaction = view.state.tr

      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.uploadId === uploadId) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: uploadedImage.src,
            width: uploadedImage.width || node.attrs.width,
            height: uploadedImage.height || node.attrs.height,
            loading: false,
          })
          return false // Stop traversal after finding our node
        }
      })

      view.dispatch(transaction)
    })
    .catch((error: Error) => {
      console.error('Image upload failed:', error)

      const transaction = view.state.tr

      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.uploadId === uploadId) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            loading: false,
            error: error.message || 'Failed to upload image',
          })
          return false // Stop traversal after finding our node
        }
      })

      view.dispatch(transaction)
    })

  return true
}

function findImageNodeBySource(
  view: EditorView,
  src: string,
  callback: (node: Node, pos: number) => void,
) {
  view.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.src === src) {
      callback(node, pos)
      return false // Stop traversal after finding our node
    }
  })
}

function updateNodeWithDimensions(
  src: string,
  view: EditorView,
  pos: number,
  attrs: any,
) {
  getImageDimensions(src)
    .then((dimensions) => {
      const transaction = view.state.tr.setNodeMarkup(pos, undefined, {
        ...attrs,
        width: dimensions.width,
        height: dimensions.height,
      })
      view.dispatch(transaction)
    })
    .catch((error) => {
      console.error('Failed to get image dimensions:', error)
    })
}

function getImageDimensions(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () =>
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    img.onerror = reject
    img.src = src
  })
}
