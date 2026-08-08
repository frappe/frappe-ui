import { validateIframeUrl } from './iframe-allowlist';
import { processEmbedUrl, getOptimalDimensions } from './iframe-embed-utils';
import { openIframeInsertDialog } from './iframeInsertDialogController';
/** Build the iframe command map for the extension's `addCommands`. */
export function buildIframeCommands(nodeName, allowlist) {
    const setIframeAlign = (align) => ({ commands }) => commands.updateAttributes(nodeName, { align });
    const setIframe = (options) => ({ commands, editor }) => {
        const processedSrc = processEmbedUrl(options.src);
        if (!validateIframeUrl(processedSrc, { allowlist }))
            return false;
        const editorWidth = editor.view.dom.clientWidth || 800;
        const optimal = getOptimalDimensions(processedSrc, editorWidth);
        const width = options.width ?? optimal.width;
        const height = options.height ?? optimal.height;
        return commands.insertContent({
            type: nodeName,
            attrs: {
                src: processedSrc,
                width,
                height,
                title: options.title ?? null,
                align: options.align ?? 'center',
                aspectRatio: height / width,
                interactive: options.interactive ?? false,
            },
        });
    };
    const insertIframeURL = (url) => ({ commands }) => commands.setIframe({ src: url });
    const openIframeDialog = (platform) => ({ editor }) => {
        openIframeInsertDialog({ editor, platform });
        return true;
    };
    const updateIframeAt = (pos, url) => ({ editor, tr, dispatch }) => {
        const node = editor.state.doc.nodeAt(pos);
        if (!node || node.type.name !== nodeName)
            return false;
        const processedSrc = processEmbedUrl(url);
        if (!validateIframeUrl(processedSrc, { allowlist }))
            return false;
        // Same src → keep the user's sizing; new src → re-derive platform dims.
        let { width, height } = node.attrs;
        if (processedSrc !== node.attrs.src || !width || !height) {
            const editorWidth = editor.view.dom.clientWidth || 800;
            ({ width, height } = getOptimalDimensions(processedSrc, editorWidth));
        }
        if (dispatch) {
            tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                src: processedSrc,
                width,
                height,
                aspectRatio: height / width,
            });
        }
        return true;
    };
    return {
        setIframeAlign,
        setIframe,
        insertIframeURL,
        openIframeDialog,
        updateIframeAt,
    };
}
