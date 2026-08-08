/**
 * The shared ProseMirror plugin for media (image/video) drop + paste handling
 * and intrinsic-dimension back-fill.
 *
 * Both image and video extensions register this from `addProseMirrorPlugins`,
 * differing only via the injected {@link MediaUploadConfig} (node name, MIME
 * filter, dimension probe). Drop is handled under `handleDOMEvents.drop`; paste
 * is handled under `props.handlePaste` (NOT `handleDOMEvents.paste`), per the
 * conventions §1.6 contract.
 */
import { Plugin } from '@tiptap/pm/state';
import { dispatchIfAlive } from '#molecules/editor/extensions/shared/node-view';
import { resolveUploadOptions } from '#molecules/editor/extensions/shared/media-upload-engine';
/** Pull matching `File`s out of a clipboard/drag `DataTransfer`. */
function collectFiles(dataTransfer, accept) {
    const items = dataTransfer?.items;
    if (!items || items.length === 0)
        return [];
    const files = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && accept.test(item.type)) {
            const file = item.getAsFile();
            if (file)
                files.push(file);
        }
    }
    return files;
}
/**
 * Build the drop + paste + dimension-back-fill plugin for one media node type.
 *
 * @param engine The media upload engine for this node type.
 * @param config The per-node config (node name, accept filter, probe).
 * @param host Live accessor for the extension's `editor`/`options`.
 */
export function createMediaPlugin(engine, config, host) {
    const resolve = () => resolveUploadOptions({ ...host.options, editor: host.editor });
    return new Plugin({
        props: {
            // NOTE: drop is NOT handled here. The single drop pipeline lives in the
            // `MediaDrop` extension (`media-drop-extension.ts`), which routes a whole
            // drop by type/count. This per-node plugin owns only paste + the
            // intrinsic-dimension back-fill below.
            handlePaste: (_view, event) => {
                const editor = host.editor;
                const options = resolve();
                if (!editor || !options.uploadFunction)
                    return false;
                const files = collectFiles(event.clipboardData, config.accept);
                if (files.length === 0)
                    return false;
                event.preventDefault();
                void engine.processMultiple(files, editor, null, options);
                return true;
            },
        },
        /**
         * After any doc-changing transaction, back-fill width/height onto freshly
         * inserted nodes that have a `src` but no dimensions and are not loading.
         */
        appendTransaction(transactions, _oldState, newState) {
            if (!transactions.some((tr) => tr.docChanged))
                return null;
            const pending = [];
            newState.doc.descendants((node, pos) => {
                if (node.type.name === config.nodeName &&
                    node.attrs.src &&
                    (!node.attrs.width || !node.attrs.height) &&
                    !node.attrs.loading) {
                    pending.push(pos);
                }
            });
            if (pending.length === 0)
                return null;
            const editor = host.editor;
            if (!editor)
                return null;
            pending.forEach((pos) => {
                const node = newState.doc.nodeAt(pos);
                const src = node?.attrs.src;
                if (!src)
                    return;
                void config
                    .probeDimensions(src)
                    .then((dims) => {
                    const view = editor.view;
                    const live = view.state.doc.nodeAt(pos);
                    if (!live || live.type.name !== config.nodeName)
                        return;
                    if (live.attrs.src !== src)
                        return;
                    if (live.attrs.width != null && live.attrs.height != null)
                        return;
                    dispatchIfAlive(view, view.state.tr.setNodeMarkup(pos, undefined, {
                        ...live.attrs,
                        width: live.attrs.width ?? dims.width,
                        height: live.attrs.height ?? dims.height,
                    }));
                })
                    .catch(() => {
                    /* best-effort dimension back-fill */
                });
            });
            return null;
        },
    });
}
