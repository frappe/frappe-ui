import { Node, mergeAttributes } from '@tiptap/core'
// Inspired by this blog: https://www.codemzy.com/blog/tiptap-video-embed-extension

const Video = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

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
    return ['video', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ({ editor, node }) => {
      const div = document.createElement('div')
      div.className =
        'relative aspect-w-16 aspect-h-9' +
        (editor.isEditable ? ' cursor-pointer' : '')

      const video = document.createElement('video')
      if (editor.isEditable) {
        video.className = 'pointer-events-none'
      }
      video.src = node.attrs.src
      if (!editor.isEditable) {
        video.setAttribute('controls', '')
      } else {
        let videoPill = document.createElement('div')
        videoPill.className =
          'absolute top-0 right-0 text-xs m-2 bg-gray-800 text-white px-2 py-1 rounded-md'
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

export default Video
