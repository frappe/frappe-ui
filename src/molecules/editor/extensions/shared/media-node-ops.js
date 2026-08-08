import { dispatchIfAlive, findNodeByUploadId, } from '#molecules/editor/extensions/shared/node-view';
/**
 * Find a node of `nodeName` by `src` (or by `uploadId` when provided). Returns
 * the position of the first match, else `null`.
 */
export function findNodeBySource(view, nodeName, src, uploadId) {
    if (uploadId)
        return findNodeByUploadId(view, nodeName, uploadId);
    let found = null;
    view.state.doc.descendants((node, pos) => {
        if (found !== null)
            return false;
        if (node.type.name === nodeName && node.attrs.src === src) {
            found = pos;
            return false;
        }
        return true;
    });
    return found;
}
/** Back-fill width/height on the node at `pos` (no-op if already sized). */
export function backfillDimensions(view, nodeName, pos, dims) {
    const node = view.state.doc.nodeAt(pos);
    if (!node || node.type.name !== nodeName)
        return;
    const attrs = node.attrs;
    if (attrs.width != null && attrs.height != null)
        return;
    dispatchIfAlive(view, view.state.tr.setNodeMarkup(pos, undefined, {
        ...attrs,
        width: attrs.width ?? dims.width,
        height: attrs.height ?? dims.height,
    }));
}
/** Insert the loading placeholder node for an in-flight upload. */
export function insertPlaceholder(view, nodeName, pos, mode, uploadId, dims, attrs = {}) {
    const node = view.state.schema.nodes[nodeName].create({
        ...attrs,
        loading: true,
        uploadId,
        src: null,
        width: dims.width,
        height: dims.height,
    });
    const tr = view.state.tr;
    if (mode === 'replace') {
        if (pos == null)
            tr.replaceSelectionWith(node);
        else {
            const nodeAtPos = view.state.doc.nodeAt(pos);
            if (nodeAtPos)
                tr.replaceWith(pos, pos + nodeAtPos.nodeSize, node);
        }
    }
    else if (pos != null) {
        tr.insert(pos, node);
    }
    else {
        tr.insert(view.state.selection.from, node);
    }
    dispatchIfAlive(view, tr);
}
/** Remove a loading placeholder after user cancellation. */
export function removeNodeByUploadId(view, nodeName, uploadId) {
    const pos = findNodeByUploadId(view, nodeName, uploadId);
    if (pos === null)
        return;
    const node = view.state.doc.nodeAt(pos);
    if (!node)
        return;
    dispatchIfAlive(view, view.state.tr.delete(pos, pos + node.nodeSize));
}
/** Write the uploaded src/dimensions back onto the placeholder node. */
export function applyUploadSuccess(view, nodeName, uploadId, uploaded) {
    const pos = findNodeByUploadId(view, nodeName, uploadId);
    if (pos === null)
        return;
    const node = view.state.doc.nodeAt(pos);
    if (!node)
        return;
    dispatchIfAlive(view, view.state.tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        src: uploaded.file_url,
        width: uploaded.width || node.attrs.width,
        height: uploaded.height || node.attrs.height,
        loading: false,
        error: null,
    }));
}
/** Mark the placeholder node as failed with an error message. */
export function applyUploadError(view, nodeName, uploadId, message) {
    const pos = findNodeByUploadId(view, nodeName, uploadId);
    if (pos === null)
        return;
    const node = view.state.doc.nodeAt(pos);
    if (!node)
        return;
    dispatchIfAlive(view, view.state.tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        loading: false,
        error: message,
    }));
}
