import {
  Node as NodeExtension,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MediaNodeView from '../components/MediaNodeView.vue'
import { Plugin, Selection, Transaction, EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Node } from '@tiptap/pm/model'
import { fileToBase64 } from '../../../index'
import { UploadedFile } from '../../../utils/useFileUpload'
import { localFileMap } from './image/image-extension'

export interface VideoExtensionOptions {
  /**
   * Function to handle video uploads
   * @default null
   */
  uploadFunction: ((file: File) => Promise<UploadedFile>) | null

  /**
   * HTML attributes to add to the video element
   * @default {}
   */
  HTMLAttributes: Record<string, any>
}

export interface SetVideoOptions {
  src: string
  alt?: string
  title?: string
  width?: string | number | null
  height?: string | number | null
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * Insert a video
       */
      setVideo: (options: SetVideoOptions) => ReturnType

      /**
       * Upload and insert a video
       */
      uploadVideo: (file: File) => ReturnType

      /**
       * Select a video file using the file picker and upload it
       */
      selectAndUploadVideo: () => ReturnType

      /**
       * Set video floating
       */
      setVideoFloat: (float: 'left' | 'right' | null) => ReturnType

      /**
       * Re-upload a failed video using the file stored in localFileMap
       */
      reuploadVideo: (uploadId: string) => ReturnType
    }
  }
}

/**
 * Matches markdown-style video syntax (custom): !video[alt](src "title")
 */
const inputRegex =
  /(?:^|\s)(!video\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const VideoExtension = NodeExtension.create<VideoExtensionOptions>({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addOptions() {
    return {
      uploadFunction: null,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      autoplay: { default: false },
      loop: { default: false },
      muted: { default: false },
      loading: {
        default: false,
        parseHTML: () => false,
      },
      float: {
        default: null,
        parseHTML: (element) => {
          const float =
            element.getAttribute('data-float') || element.getAttribute('float')

          if (['left', 'right', null].includes(float)) {
            return float as 'left' | 'right' | null
          }
          return null
        },
        renderHTML: (attributes) => {
          return {
            'data-float': attributes.float || null,
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
        tag: 'video',
        getAttrs: (node) => {
          if (typeof node === 'string') return {}
          const element = node as HTMLElement
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
            autoplay: element.hasAttribute('autoplay'),
            loop: element.hasAttribute('loop'),
            muted: element.hasAttribute('muted'),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: '',
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(MediaNodeView)
  },

  addCommands() {
    return {
      setVideoFloat:
        (float: 'left' | 'right' | null) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { float })
        },

      setVideo:
        (attributes: SetVideoOptions) =>
        ({ commands, editor }) => {
          const result = commands.insertContent({
            type: this.name,
            attrs: attributes,
          })

          if (result && attributes.src) {
            findVideoNodeBySource(editor.view, attributes.src, (node, pos) => {
              updateNodeWithDimensions(attributes.src, editor.view, pos)
            })
          }

          return result
        },

      uploadVideo:
        (file: File) =>
        ({ editor }) => {
          return uploadVideo(file, editor.view, null, this.options)
        },

      selectAndUploadVideo:
        () =>
        ({ editor }) => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'video/*'
          input.onchange = (event) => {
            const target = event.target as HTMLInputElement
            if (target.files && target.files.length) {
              const file = target.files[0]
              editor.commands.uploadVideo(file)
            }
          }
          input.click()
          return true
        },

      reuploadVideo:
        (uploadId: string) =>
        ({ editor }) => {
          const fileData = localFileMap.get(uploadId)
          if (!fileData) {
            console.error(
              'reuploadVideo: no file found in localFileMap for uploadId',
              uploadId,
            )
            return false
          }

          // Find the node position
          let nodePos: number | null = null
          editor.view.state.doc.descendants((node, pos) => {
            if (
              node.type.name === 'video' &&
              node.attrs.uploadId === uploadId
            ) {
              nodePos = pos
              return false
            }
          })

          if (nodePos === null) {
            console.error(
              'reuploadVideo: could not find node with uploadId',
              uploadId,
            )
            return false
          }

          // Re-run the upload using the stored file, replacing the node at its position
          return uploadVideoBase(
            fileData.file,
            editor.view,
            nodePos,
            this.options,
            'replace',
          )
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

              const videos = Array.from(event.dataTransfer.files).filter(
                (file) => /video/i.test(file.type),
              )

              if (videos.length === 0) {
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

              processMultipleVideos(videos, view, pos, extensionThis.options)
              return true
            },

            paste: (view, event) => {
              if (!extensionThis.options.uploadFunction) {
                return false
              }

              const clipboardItems = event.clipboardData?.items
              if (!clipboardItems || clipboardItems.length === 0) {
                return false
              }

              const videos: File[] = []

              for (let i = 0; i < clipboardItems.length; i++) {
                const item = clipboardItems[i]
                if (
                  item.kind === 'file' &&
                  item.type.indexOf('video/') !== -1
                ) {
                  const file = item.getAsFile()
                  if (file) videos.push(file)
                }
              }

              if (videos.length === 0) return false

              event.preventDefault()
              processMultipleVideos(videos, view, null, extensionThis.options)
              return true
            },
          },
        },

        appendTransaction(
          transactions: readonly Transaction[],
          oldState: EditorState,
          newState: EditorState,
        ): Transaction | null {
          const newVideoNodes: { node: Node; pos: number }[] = []

          if (transactions.some((tr) => tr.docChanged)) {
            newState.doc.descendants((node, pos) => {
              if (
                node.type.name === 'video' &&
                node.attrs.src &&
                (!node.attrs.width || !node.attrs.height) &&
                !node.attrs.loading
              ) {
                newVideoNodes.push({ node, pos })
              }
            })
          }

          if (newVideoNodes.length === 0) return null

          newVideoNodes.forEach(({ node, pos }) => {
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
    if (node.type.name === 'video' && node.attrs.uploadId === lastNodeId) {
      insertPos = pos + node.nodeSize
      return false
    }
  })

  return insertPos
}

// Base upload function shared by all video upload methods
type VideoDimensions = { width: number | null; height: number | null }

function uploadVideoBase(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
  insertMode: 'insert' | 'replace',
  onComplete?: (nodeId: string) => void,
  moveCursor = false,
): boolean {
  if (!options.uploadFunction) {
    console.error('uploadFunction option is not provided for videos.')
    return false
  }

  const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  fileToBase64(file)
    .then((base64Result: string) => {
      localFileMap.set(uploadId, { b64: base64Result, file })

      const objectUrl = URL.createObjectURL(file)
      return getVideoDimensions(objectUrl)
        .catch((): VideoDimensions => ({ width: null, height: null }))
        .then((dimensions: VideoDimensions) => {
          URL.revokeObjectURL(objectUrl)
          return dimensions
        })
    })
    .then((dimensions: VideoDimensions) => {
      const node = view.state.schema.nodes.video.create({
        loading: true,
        uploadId,
        src: null,
        width: dimensions.width,
        height: dimensions.height,
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
              if (n.type.name === 'video' && n.attrs.uploadId === uploadId) {
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
    .then((uploadedVideo) => {
      const transaction = view.state.tr

      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'video' && node.attrs.uploadId === uploadId) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: uploadedVideo.file_url,
            width: uploadedVideo.width || node.attrs.width,
            height: uploadedVideo.height || node.attrs.height,
            loading: false,
          })
          localFileMap.delete(node.attrs.uploadId)
          return false
        }
      })

      view.dispatch(transaction)

      if (onComplete) onComplete(uploadId)
    })
    .catch((error: Error) => {
      console.error('Video upload failed:', error)

      try {
        const transaction = view.state.tr

        view.state.doc.descendants((node, pos) => {
          if (node.type.name === 'video' && node.attrs.uploadId === uploadId) {
            // width/height are preserved from ...node.attrs (pre-fetched from local file)
            transaction.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              loading: false,
              error: error.message || 'Failed to upload video',
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

function uploadVideoWithTracking(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
  onComplete?: (nodeId: string) => void,
): boolean {
  return uploadVideoBase(file, view, pos, options, 'insert', onComplete, true)
}

function uploadVideo(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
): boolean {
  return uploadVideoBase(file, view, pos, options, 'replace')
}

function findVideoNodeBySource(
  view: EditorView,
  src: string,
  callback: (node: Node, pos: number) => void,
) {
  view.state.doc.descendants((node, pos) => {
    if (node.type.name === 'video' && node.attrs.src === src) {
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
  getVideoDimensions(src)
    .then((dimensions) => {
      const node = view.state.doc.nodeAt(pos)
      if (!node || node.type.name !== 'video') {
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
      console.error('Could not get video dimensions', error)
    })
}

function getVideoDimensions(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
      })
      // Clean up
      video.src = ''
    }

    video.onerror = reject
    video.src = src
  })
}

/**
 * Process multiple video uploads sequentially
 */
export function processMultipleVideos(
  videos: File[],
  view: EditorView,
  pos: number | null,
  options: Record<string, any>,
) {
  if (videos.length === 1) {
    uploadVideo(videos[0], view, pos, options)
    return
  }

  let videoQueue = [...videos]
  let lastInsertedNodeId: string | null = null

  const processNextVideo = () => {
    if (videoQueue.length === 0) return

    const file = videoQueue.shift()
    if (!file) return

    const currentPos = lastInsertedNodeId
      ? findInsertPosition(view, lastInsertedNodeId)
      : pos

    uploadVideoWithTracking(file, view, currentPos, options, (newNodeId) => {
      lastInsertedNodeId = newNodeId
      setTimeout(processNextVideo, 100)
    })
  }

  processNextVideo()
}
