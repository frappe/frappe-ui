/**
 * The attachment node: an inline chip/link for non-image, non-video files
 * (pdf, docx, zip, csv, …).
 *
 * Mirrors the image node's thin-shell shape: schema, attributes, parse/render
 * and a small command map that delegates all upload/queue/find work to the
 * dedicated `attachment-engine`. The chip renders via `AttachmentNodeView`, and
 * uploads run through the same shared upload function as image/video — resolved
 * at use-time via `resolveUploadOptions` (a per-extension `uploadFunction`
 * config wins, else `editor.storage.upload.uploadFunction`).
 *
 * Drop/paste routing is owned by the shared `media-drop` extension: it sends
 * non-image, non-video files here via `uploadAttachmentFiles`.
 */
import {
  Node as NodeExtension,
  mergeAttributes,
  type Editor,
} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import AttachmentNodeView from '#molecules/editor/components/AttachmentNodeView.vue'
import { pickFiles } from '#molecules/editor/extensions/shared/file-picker'
import {
  resolveUploadOptions,
  type MediaUploadOptions,
  type UploadFunction,
} from '#molecules/editor/extensions/shared/media-upload-engine'
import { findNodeByUploadId } from '#molecules/editor/extensions/shared/node-view'
import {
  uploadAttachment,
  uploadAttachmentFiles,
  reuploadAttachment,
  ATTACHMENT_NODE_NAME,
} from './attachment-engine'

export interface AttachmentExtensionOptions {
  /**
   * Function to handle file uploads. Receives optional request options
   * (abort signal + progress callback) as the second argument.
   * @default null
   */
  uploadFunction: UploadFunction | null

  /**
   * HTML attributes to add to the attachment anchor element.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>
}

export interface SetAttachmentOptions {
  src: string
  fileName?: string
  fileSize?: number | null
  mimeType?: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachment: {
      /** Insert an already-uploaded attachment chip. */
      setAttachment: (options: SetAttachmentOptions) => ReturnType
      /** Upload and insert a single file as an attachment. */
      uploadAttachment: (file: File) => ReturnType
      /** Upload and insert already-provided files (e.g. from a drop/paste). */
      uploadAttachmentFiles: (files: File[], pos?: number | null) => ReturnType
      /** Select file(s) using the file picker and upload them as attachments. */
      selectAndUploadFile: () => ReturnType
      /** Re-upload a failed attachment using the file stored in localFileMap. */
      reuploadAttachment: (uploadId: string) => ReturnType
    }
  }
}

export const AttachmentExtension =
  NodeExtension.create<AttachmentExtensionOptions>({
    name: ATTACHMENT_NODE_NAME,

    group: 'inline',
    inline: true,
    draggable: true,
    selectable: true,
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
        fileName: {
          default: null,
          parseHTML: (element) =>
            element.getAttribute('data-file-name') ||
            element.getAttribute('download') ||
            null,
          renderHTML: (attributes) =>
            attributes.fileName
              ? { 'data-file-name': attributes.fileName }
              : {},
        },
        fileSize: {
          default: null,
          parseHTML: (element) => {
            const raw = element.getAttribute('data-file-size')
            const size = raw == null ? NaN : Number(raw)
            return Number.isFinite(size) ? size : null
          },
          renderHTML: (attributes) =>
            attributes.fileSize != null
              ? { 'data-file-size': String(attributes.fileSize) }
              : {},
        },
        mimeType: {
          default: null,
          parseHTML: (element) =>
            element.getAttribute('data-mime-type') ||
            element.getAttribute('type') ||
            null,
          renderHTML: (attributes) =>
            attributes.mimeType
              ? { 'data-mime-type': attributes.mimeType }
              : {},
        },
        uploadId: {
          default: null,
          parseHTML: () => null,
        },
        loading: {
          default: false,
          parseHTML: () => false,
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
          tag: 'a[data-attachment]',
          getAttrs: (node) => {
            if (typeof node === 'string') return {}
            const element = node as HTMLElement
            return { src: element.getAttribute('href') }
          },
        },
      ]
    },

    renderHTML({ node, HTMLAttributes }) {
      return [
        'a',
        mergeAttributes(this.options.HTMLAttributes || {}, HTMLAttributes, {
          'data-attachment': '',
          href: node.attrs.src,
          download: node.attrs.fileName || null,
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
        node.attrs.fileName || 'Attachment',
      ]
    },

    addNodeView() {
      return VueNodeViewRenderer(AttachmentNodeView)
    },

    addCommands() {
      const resolve = (editor: Editor): MediaUploadOptions =>
        resolveUploadOptions({ ...this.options, editor })

      return {
        setAttachment:
          (attributes: SetAttachmentOptions) =>
          ({ commands }) => {
            if (
              typeof attributes.src !== 'string' ||
              attributes.src.trim() === ''
            ) {
              return false
            }
            return commands.insertContent({
              type: this.name,
              attrs: attributes,
            })
          },

        uploadAttachment:
          (file: File) =>
          ({ editor }) => {
            void uploadAttachment(file, editor, resolve(editor))
            return true
          },

        uploadAttachmentFiles:
          (files: File[], pos?: number | null) =>
          ({ editor }) => {
            if (files.length === 0) return false
            void uploadAttachmentFiles(
              files,
              editor,
              pos ?? null,
              resolve(editor),
            )
            return true
          },

        selectAndUploadFile:
          () =>
          ({ editor }) => {
            void pickFiles({ multiple: true }).then((files) => {
              if (editor.isDestroyed || files.length === 0) return
              editor.commands.uploadAttachmentFiles(files)
            })
            return true
          },

        reuploadAttachment:
          (uploadId: string) =>
          ({ editor }) => {
            const pos = findNodeByUploadId(editor.view, this.name, uploadId)
            if (pos === null) {
              console.error(
                'reuploadAttachment: could not find node with uploadId',
                uploadId,
              )
              return false
            }
            void reuploadAttachment(editor, pos, resolve(editor))
            return true
          },
      }
    },
  })

export default AttachmentExtension
