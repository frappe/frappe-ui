import { Node, mergeAttributes, Editor } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { EditorView } from '@tiptap/pm/view'
import { UploadedFile } from '../../utils/useFileUpload'

export interface VideoOptions {
  uploadFunction: ((file: File) => Promise<UploadedFile>) | null
  HTMLAttributes: Record<string, any>
}

export interface SetVideoOptions {
  src: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: SetVideoOptions) => ReturnType
      uploadVideo: (file: File) => ReturnType
      selectAndUploadVideo: () => ReturnType
    }
  }
}

export default Node.create<VideoOptions>({
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
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
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

  addCommands() {
    return {
      setVideo:
        (options: SetVideoOptions) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },

      uploadVideo:
        (file: File) =>
        ({ editor }) => {
          const pos = editor.state.selection.from
          return uploadVideoInternal(file, editor.view, pos, this.options)
        },

      selectAndUploadVideo:
        () =>
        ({ editor }) => {
          if (!this.options.uploadFunction) {
            console.error('uploadFunction option is not provided for videos.')
            return false
          }

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
    }
  },

  addNodeView() {
    return ({ editor, node }: { editor: Editor; node: ProseMirrorNode }) => {
      const div = document.createElement('div')
      div.className =
        'relative aspect-w-16 aspect-h-9' +
        (editor.isEditable ? ' cursor-pointer' : '')

      const video = document.createElement('video')
      video.src = node.attrs.src
      video.setAttribute('controls', '')

      if (editor.isEditable) {
        let videoPill = document.createElement('div')
        videoPill.className =
          'absolute top-0 right-0 text-xs m-2 bg-surface-gray-6 text-ink-white px-2 py-1 rounded-md'
        videoPill.innerHTML = 'Video'
        div.append(videoPill)
      }
      div.append(video)
      return {
        dom: div,
      }
    }
  },
})

function uploadVideoInternal(
  file: File,
  view: EditorView,
  pos: number | null | undefined,
  options: Record<string, any>,
): boolean {
  if (!options.uploadFunction) {
    console.error('uploadFunction option is not provided for videos.')
    return false
  }

  options
    .uploadFunction(file)
    .then((uploadedVideo: UploadedFile) => {
      const { schema } = view.state
      const node = schema.nodes.video.create({ src: uploadedVideo.file_url })

      const transaction = view.state.tr
      if (pos != null) {
        transaction.insert(pos, node)
      } else {
        transaction.replaceSelectionWith(node)
      }
      view.dispatch(transaction)
    })
    .catch((error: Error) => {
      console.error('Video upload failed:', error)
    })

  return true
}
