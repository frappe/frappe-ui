import { Extension } from '@tiptap/core';
import { collectViewableImages, indexOfSrc } from './collectImages';
import { openImageViewerModal } from './imageViewerController';
import { acquireImageViewerStyle, releaseImageViewerStyle, } from './imageViewerStyle';
export const ImageViewerExtension = Extension.create({
    name: 'imageViewer',
    onBeforeCreate() {
        acquireImageViewerStyle();
    },
    onDestroy() {
        releaseImageViewerStyle();
    },
    addCommands() {
        return {
            openImageViewer: (src) => ({ editor }) => {
                const images = collectViewableImages(editor.state.doc);
                openImageViewerModal(images, indexOfSrc(images, src));
                return true;
            },
        };
    },
});
export default ImageViewerExtension;
