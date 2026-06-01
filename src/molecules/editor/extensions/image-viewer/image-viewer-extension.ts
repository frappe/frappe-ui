import { Extension } from '@tiptap/core'
import { collectViewableImages, indexOfSrc } from './collectImages'
import { openImageViewerModal } from './imageViewerController'
import {
  acquireImageViewerStyle,
  releaseImageViewerStyle,
} from './imageViewerStyle'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageViewer: {
      /** Open the image viewer starting at the image with the given `src`. */
      openImageViewer: (src: string) => ReturnType
    }
  }
}

export const ImageViewerExtension = Extension.create({
  name: 'imageViewer',

  onBeforeCreate() {
    acquireImageViewerStyle()
  },

  onDestroy() {
    releaseImageViewerStyle()
  },

  addCommands() {
    return {
      openImageViewer:
        (src: string) =>
        ({ editor }) => {
          const images = collectViewableImages(editor.state.doc)
          openImageViewerModal(images, indexOfSrc(images, src))
          return true
        },
    }
  },
})

export default ImageViewerExtension
