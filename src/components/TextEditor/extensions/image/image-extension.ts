import {
  Node as NodeExtension,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNodeView from './ImageNodeView.vue'
import { Plugin, Selection, Transaction, EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Node } from '@tiptap/pm/model'
import { fileToBase64 } from '../../../../index'
import { UploadedFile } from '../../../../utils/useFileUpload'

export interface ImageExtensionOptions {
  /**
   * Function to handle image uploads
   * @default null
   */
  uploadFunction: ((file: File) => Promise<UploadedFile>) | null

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

      /**
       * Select an image file using the file picker and upload it
       */
      selectAndUploadImage: () => ReturnType

      /**
       * Set image alignment
       */
      setImageAlign: (align: 'left' | 'center' | 'right') => ReturnType
    }
  }
}

/**
 * Matches markdown image syntax: ![alt](src "title")
 */
const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const ImageExtension = NodeExtension.create<ImageExtensionOptions>({
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
      align: {
        default: 'left',
        parseHTML: (element) => {
          const align = (
            element.getAttribute('data-align') ||
            element.getAttribute('align') ||
            'left'
          ).toLowerCase()

          if (['left', 'center', 'right'].includes(align)) {
            return align as 'left' | 'center' | 'right'
          }
          return 'left'
        },
        renderHTML: (attributes) => {
          return {
            'data-align': attributes.align || 'left',
          }
        },
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
      setImageAlign:
        (align: 'left' | 'center' | 'right') =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align })
        },

      setImage:
        (attributes: SetImageOptions) =>
        ({ commands, editor }) => {
          const result = commands.insertContent({
            type: this.name,
            attrs: attributes,
          })

          if (result && attributes.src) {
            findImageNodeBySource(editor.view, attributes.src, (node, pos) => {
              updateNodeWithDimensions(attributes.src, editor.view, pos)
            })
          }

          return result
        },

      uploadImage:
        (file: File) =>
        ({ editor }) => {
          return uploadImage(file, editor.view, null, this.options)
        },

      selectAndUploadImage:
        () =>
        ({ editor }) => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.onchange = (event) => {
            const target = event.target as HTMLInputElement
            if (target.files && target.files.length) {
              const file = target.files[0]
              editor.commands.uploadImage(file)
            }
          }
          input.click()
          return true
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

              processMultipleImages(images, view, pos, extensionThis.options)
              return true
            },

            handlePaste: (view, event) => {
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
                if (
                  item.kind === 'file' &&
                  item.type.indexOf('image/') !== -1
                ) {
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
              processMultipleImages(images, view, null, extensionThis.options)
              return true
            },
          },
        },

        appendTransaction(
          transactions: readonly Transaction[],
          oldState: EditorState,
          newState: EditorState,
        ): Transaction | null {
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
              updateNodeWithDimensions(node.attrs.src, editor.view, pos)
            }
          })

          return null
        },
      }),
    ]
  },
})

function findInsertPosition(
  view: EditorView,
  lastNodeId: string | null,
): number | null {
  if (!lastNodeId) {
    return null
  }

  let insertPos = null

  view.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.uploadId === lastNodeId) {
      insertPos = pos + node.nodeSize
      return false
    }
  })

  return insertPos
}

// Base upload function shared by all image upload methods
function uploadImageBase(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
  insertMode: 'insert' | 'replace',
  onComplete?: (nodeId: string) => void,
  moveCursor = false,
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
        src: base64Result,
      })

      const tr = view.state.tr
      if (insertMode === 'replace') {
        if (pos === null) tr.replaceSelectionWith(node)
        else {
          const nodeAtPos = view.state.doc.nodeAt(pos)
          if (nodeAtPos) tr.replaceWith(pos, pos + nodeAtPos.nodeSize, node)
        }
      } else {
        if (pos != null) tr.insert(pos, node)
        else {
          const insertPos = view.state.selection.from
          tr.insert(insertPos, node)
        }
      }

      view.dispatch(tr)

      // Optionally move cursor after the node
      if (moveCursor) {
        const nodeSize = node.nodeSize || 1
        setTimeout(() => {
          try {
            let nodePos = null
            view.state.doc.descendants((n, p) => {
              if (n.type.name === 'image' && n.attrs.uploadId === uploadId) {
                nodePos = p
                return false
              }
            })

            if (nodePos !== null) {
              const posAfter = nodePos + nodeSize
              const transaction = view.state.tr.setSelection(
                Selection.near(view.state.doc.resolve(posAfter)),
              )
              view.dispatch(transaction)
            }
          } catch (e) {
            console.error('Error moving cursor:', e)
          }
        }, 10)
      }

      return options.uploadFunction(file)
    })
    .then((uploadedImage: UploadedFile) => {
      return getImageDimensions(uploadedImage.file_url)
        .then((dimensions) => {
          return {
            ...uploadedImage,
            width: dimensions.width,
            height: dimensions.height,
          } as UploadedFile & { width: number; height: number }
        })
        .catch(() => {
          return uploadedImage as UploadedFile & {
            width: number
            height: number
          }
        })
    })
    .then((uploadedImage) => {
      const transaction = view.state.tr

      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.uploadId === uploadId) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: uploadedImage.file_url,
            width: uploadedImage.width || node.attrs.width,
            height: uploadedImage.height || node.attrs.height,
            loading: false,
          })
          return false
        }
      })

      view.dispatch(transaction)

      if (onComplete) onComplete(uploadId)
    })
    .catch((error: Error) => {
      console.error('Image upload failed:', error)

      try {
        const transaction = view.state.tr

        view.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && node.attrs.uploadId === uploadId) {
            transaction.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              loading: false,
              error: error.message || 'Failed to upload image',
            })
            return false
          }
        })

        view.dispatch(transaction)
      } catch (e) {
        console.error('Error updating failed node:', e)
      }

      if (onComplete) onComplete(uploadId)
    })

  return true
}

function uploadImageWithTracking(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
  onComplete?: (nodeId: string) => void,
): boolean {
  return uploadImageBase(file, view, pos, options, 'insert', onComplete, true)
}

function uploadImage(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
): boolean {
  return uploadImageBase(file, view, pos, options, 'replace')
}

function findImageNodeBySource(
  view: EditorView,
  src: string,
  callback: (node: Node, pos: number) => void,
) {
  view.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.src === src) {
      callback(node, pos)
      return false
    }
  })
}

function updateNodeWithDimensions(
  src: string,
  view: EditorView,
  pos: number,
): void {
  getImageDimensions(src)
    .then((dimensions) => {
      const node = view.state.doc.nodeAt(pos)
      if (!node || node.type.name !== 'image') {
        return
      }
      const currentAttrs = node.attrs

      if (currentAttrs.width == null || currentAttrs.height == null) {
        const transaction = view.state.tr.setNodeMarkup(pos, undefined, {
          ...currentAttrs,
          width: currentAttrs.width ?? dimensions.width,
          height: currentAttrs.height ?? dimensions.height,
        })
        view.dispatch(transaction)
      }
    })
    .catch((error) => {
      // Don't log error if it's just about dimensions for an existing node
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

/**
 * Process multiple image uploads sequentially
 */
export function processMultipleImages(
  images: File[],
  view: EditorView,
  pos: number | null,
  options: Record<string, any>,
) {
  if (images.length === 1) {
    uploadImage(images[0], view, pos, options)
    return
  }

  let imageQueue = [...images]
  let lastInsertedNodeId: string | null = null

  const processNextImage = () => {
    if (imageQueue.length === 0) return

    const file = imageQueue.shift()
    if (!file) return

    const currentPos = lastInsertedNodeId
      ? findInsertPosition(view, lastInsertedNodeId)
      : pos

    uploadImageWithTracking(file, view, currentPos, options, (newNodeId) => {
      lastInsertedNodeId = newNodeId
      setTimeout(processNextImage, 100)
    })
  }

  processNextImage()
}
