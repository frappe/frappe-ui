/**
 * The image node: schema, attributes, parse/render, node view, input rule, and a
 * thin command map that delegates all upload/queue/find/dimension work to the
 * shared media upload engine (`imageEngine`).
 *
 * Everything imperative (staging files, placeholder insertion, dimension probe,
 * write-back, drop/paste, async-safe dispatch) lives in
 * `#molecules/editor/extensions/shared/*` and is shared with video. This file is
 * the TipTap shell only.
 */
import {
  Node as NodeExtension,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MediaNodeView from '#molecules/editor/components/MediaNodeView.vue'
import { createMediaPlugin } from '#molecules/editor/extensions/shared/media-plugin'
import { captionAttribute } from '#molecules/editor/extensions/shared/media-attributes'
import { pickFiles } from '#molecules/editor/extensions/shared/file-picker'
import { openImageGroupUploadDialog } from '#molecules/editor/extensions/image-group/imageGroupDialogController'
import {
  resolveUploadOptions as resolveUploadOptionsBase,
  type MediaUploadOptions,
  type UploadFunction,
} from '#molecules/editor/extensions/shared/media-upload-engine'
import { imageEngine, imageUploadConfig } from './image-engine'

export interface ImageExtensionOptions {
  /**
   * Function to handle image uploads. Receives optional request options
   * (abort signal + progress callback) as the second argument.
   * @default null
   */
  uploadFunction: UploadFunction | null

  /**
   * HTML attributes to add to the image element
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>
}

export interface SetImageOptions {
  src: string
  /** Screen-reader description. Not shown on screen. */
  alt?: string
  /** Visible caption rendered under the image. */
  caption?: string
  title?: string
  width?: string | number | null
  height?: string | number | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /** Insert an image */
      setImage: (options: SetImageOptions) => ReturnType
      /** Upload and insert an image */
      uploadImage: (file: File) => ReturnType
      /** Select an image file using the file picker and upload it */
      selectAndUploadImage: () => ReturnType
      /** Set image alignment */
      setImageAlign: (align: 'left' | 'center' | 'right') => ReturnType
      /** Set image float for text wrapping */
      setImageFloat: (float: 'left' | 'right' | null) => ReturnType
      /** Re-upload a failed image using the file stored in localFileMap */
      reuploadImage: (uploadId: string) => ReturnType
    }
  }
}

/**
 * Matches markdown image syntax: ![alt](src "title").
 * `alt` is `[^\]]*` (any chars except the closing bracket) — the legacy
 * `(.+|:?)` alternation could match malformed input.
 */
const inputRegex = /(?:^|\s)(!\[([^\]]*)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const ImageExtension = NodeExtension.create<ImageExtensionOptions>({
  name: 'image',

  group: 'inline',
  inline: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      /**
       * Screen-reader description. Never rendered as visible text, and never
       * touched by the caption UI, so an existing `alt` round-trips as it is.
       */
      alt: { default: null },
      caption: captionAttribute,
      /**
       * Native `title` tooltip. Filled by the markdown input rule
       * (`![alt](src "title")`) and round-tripped, but it has no UI of its own.
       */
      title: { default: null },
      width: { default: null },
      height: { default: null },
      loading: {
        default: false,
        parseHTML: () => false,
      },
      align: {
        default: 'center',
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
      float: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute('data-float') || null
        },
        renderHTML: (attributes) => {
          if (!attributes.float) return {}
          return {
            'data-float': attributes.float,
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

  // Every attribute is read by its own `parseHTML` (TipTap injects those into
  // the rule and they take precedence), so the rule itself only has to match.
  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes || {}, HTMLAttributes),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(MediaNodeView)
  },

  addOptions() {
    return {
      uploadFunction: null,
      HTMLAttributes: {},
    }
  },

  addCommands() {
    const resolve = (editor: Editor): MediaUploadOptions =>
      resolveUploadOptionsBase({ ...this.options, editor })

    return {
      setImageAlign:
        (align: 'left' | 'center' | 'right') =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { align }),

      setImageFloat:
        (float: 'left' | 'right' | null) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { float }),

      setImage:
        (attributes: SetImageOptions) =>
        ({ commands, editor }) => {
          const result = commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
          if (result && attributes.src) {
            const pos = imageEngine.findNodeBySource(editor, attributes.src)
            if (pos !== null) backfillFromSrc(editor, pos, attributes.src)
          }
          return result
        },

      uploadImage:
        (file: File) =>
        ({ editor }) => {
          void imageEngine.uploadOne(file, editor, resolve(editor))
          return true
        },

      selectAndUploadImage:
        () =>
        ({ editor }) => {
          void pickFiles({ accept: 'image/*', multiple: true }).then(
            (files) => {
              if (editor.isDestroyed || files.length === 0) return
              if (files.length === 1) {
                editor.commands.uploadImage(files[0])
              } else {
                openImageGroupUploadDialog({ editor, files })
              }
            },
          )
          return true
        },

      reuploadImage:
        (uploadId: string) =>
        ({ editor }) => {
          const pos = imageEngine.findNodeBySource(editor, '', uploadId)
          if (pos === null) {
            console.error(
              'reuploadImage: could not find node with uploadId',
              uploadId,
            )
            return false
          }
          void imageEngine.reupload(editor, pos, resolve(editor))
          return true
        },

      replaceImage:
        (pos: number, file: File) =>
        ({ editor }: { editor: Editor }) => {
          const node = editor.view.state.doc.nodeAt(pos)
          if (!node || node.type.name !== this.name) return false
          void imageEngine.uploadReplace(
            file,
            editor,
            pos,
            resolve(editor),
            node.attrs,
          )
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
    return [
      createMediaPlugin(imageEngine, imageUploadConfig, {
        editor: this.editor,
        options: { ...this.options },
      }),
    ]
  },
})

/** Probe an already-inserted image at `pos` and back-fill its dimensions. */
function backfillFromSrc(editor: Editor, pos: number, src: string): void {
  void imageUploadConfig
    .probeDimensions(src)
    .then((dims) => {
      const live = editor.view.state.doc.nodeAt(pos)
      if (!live || live.type.name !== 'image') return
      imageEngine.updateNodeWithDimensions(editor, pos, dims)
    })
    .catch(() => {
      /* best-effort dimension back-fill */
    })
}
