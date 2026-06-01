/**
 * Video node — a thin TipTap shell over the shared media upload engine.
 *
 * Schema, attributes, `parseHTML`/`renderHTML` and the markdown-style input rule
 * live here; all upload/queue/find/dimension logic is delegated to the shared
 * `media-upload-engine` (consumed via {@link videoEngine}) and the shared
 * `media-plugin` (drop/paste + dimension back-fill). The node view is the shared
 * `MediaNodeView`, kept neutral across image and video.
 *
 * Fixes (see PLAN cluster 2): F1 dimension-probe leak + DOM-Event reject are
 * solved in `media-dimensions.probeVideoDimensions`; F2 whole-video base64 is
 * avoided via `storeBase64: false` in `video-config.ts`; F3 paste is registered
 * under `props.handlePaste` (not `handleDOMEvents.paste`) in `media-plugin.ts`;
 * F4 `setVideo` rejects an empty `src` here.
 */
import {
  Node as NodeExtension,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MediaNodeView from '@molecules/editor/components/MediaNodeView.vue'
import type { UploadedFile } from '@utils/useFileUpload'
import {
  resolveUploadOptions,
  type MediaUploadOptions,
} from '@molecules/editor/extensions/shared/media-upload-engine'
import { createMediaPlugin } from '@molecules/editor/extensions/shared/media-plugin'
import { findNodeByUploadId } from '@molecules/editor/extensions/shared/node-view'
import { pickFiles } from '@molecules/editor/extensions/shared/file-picker'
import { videoConfig, videoEngine } from './video-config'

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
  HTMLAttributes: Record<string, unknown>
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
      /** Insert a video */
      setVideo: (options: SetVideoOptions) => ReturnType
      /** Upload and insert a video */
      uploadVideo: (file: File) => ReturnType
      /** Select a video file using the file picker and upload it */
      selectAndUploadVideo: () => ReturnType
      /** Set video floating */
      setVideoFloat: (float: 'left' | 'right' | null) => ReturnType
      /** Re-upload a failed video using the file stored in localFileMap */
      reuploadVideo: (uploadId: string) => ReturnType
    }
  }
}

/** Matches markdown-style video syntax (custom): `!video[alt](src "title")`. */
const inputRegex =
  /(?:^|\s)(!video\[([^\]]*)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

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
          if (float === 'left' || float === 'right') return float
          return null
        },
        renderHTML: (attributes) => {
          return { 'data-float': attributes.float || null }
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
    const resolve = (): MediaUploadOptions =>
      resolveUploadOptions({ ...this.options, editor: this.editor })

    return {
      setVideoFloat:
        (float: 'left' | 'right' | null) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { float })
        },

      setVideo:
        (attributes: SetVideoOptions) =>
        ({ commands }) => {
          // F4: reject an empty/blank src instead of inserting a broken node.
          if (typeof attributes.src !== 'string' || attributes.src.trim() === '') {
            return false
          }
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },

      uploadVideo:
        (file: File) =>
        ({ editor }) => {
          void videoEngine.uploadOne(file, editor, resolve())
          return true
        },

      selectAndUploadVideo:
        () =>
        ({ editor }) => {
          void pickFiles({ accept: 'video/*' }).then((files) => {
            if (!editor.isDestroyed && files[0]) editor.commands.uploadVideo(files[0])
          })
          return true
        },

      reuploadVideo:
        (uploadId: string) =>
        ({ editor }) => {
          const pos = findNodeByUploadId(editor.view, this.name, uploadId)
          if (pos === null) {
            console.error('reuploadVideo: no node with uploadId', uploadId)
            return false
          }
          void videoEngine.reupload(editor, pos, resolve())
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
      createMediaPlugin(videoEngine, videoConfig, {
        editor: this.editor,
        options: { ...this.options },
      }),
    ]
  },
})
