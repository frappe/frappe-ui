import { dataUrlOrBlobToFile, } from '#molecules/editor/extensions/shared/media-upload-engine';
import { collectImageNodes, parseHtmlToSlice } from './paste-html-utils';
/**
 * Insert pasted HTML containing images and re-upload its embedded
 * `data:`/`blob:` images. Returns after every embedded image has been processed
 * (or the editor was destroyed).
 */
export async function processHTMLImages(html, editor, engine, options) {
    const view = editor.view;
    const slice = parseHtmlToSlice(html, view.state.schema);
    // Capture the insertion range so we only scan the freshly-pasted region.
    const { from } = view.state.selection;
    view.dispatch(view.state.tr.replaceSelection(slice));
    const insertedFrom = from;
    const insertedTo = Math.min(view.state.selection.to, view.state.doc.content.size);
    const pasted = collectImageNodes(view.state.doc, Math.min(insertedFrom, insertedTo), insertedTo);
    if (pasted.length === 0)
        return;
    // Fetch every embedded src into a File in parallel; drop ones that fail.
    const fetched = await Promise.all(pasted.map(async ({ src }) => {
        try {
            const file = await dataUrlOrBlobToFile(src, 'pasted-image.png');
            return { src, file };
        }
        catch (error) {
            console.error('Failed to fetch pasted image:', error);
            return null;
        }
    }));
    if (editor.isDestroyed)
        return;
    // Replace each placeholder sequentially at its CURRENT position, relocated by
    // its data:/blob: src against the live doc.
    for (const entry of fetched) {
        if (entry === null)
            continue;
        if (editor.isDestroyed)
            return;
        const pos = engine.findNodeBySource(editor, entry.src);
        if (pos === null)
            continue;
        await engine.processMultiple([entry.file], editor, pos, options);
    }
}
