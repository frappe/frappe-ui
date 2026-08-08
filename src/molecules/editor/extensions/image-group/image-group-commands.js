import { safeGetPos } from '#molecules/editor/extensions/shared/node-view';
import { clampColumns } from './image-group-utils';
const IMAGE_GROUP = 'imageGroup';
/** Build the node-spec content for a list of images. */
function imageContent(images) {
    return images.map((img) => ({
        type: 'image',
        attrs: { src: img.src, alt: img.alt },
    }));
}
/** `setImageGroup(attrs)` — insert a gallery node at the selection. */
export function buildSetImageGroup(nodeName) {
    return (attrs) => ({ commands }) => commands.insertContent({
        type: nodeName,
        attrs: { columns: clampColumns(attrs.columns) },
        content: attrs.images.map((img) => ({
            type: 'image',
            attrs: { src: img.src, alt: img.alt ?? '' },
        })),
    });
}
/**
 * `groupSelectedImages()` — collect the images in the current selection and
 * replace them with one gallery node.
 *
 * Images are inline nodes, so the group block must be inserted via the
 * slice-based `insertContentAt` (which splits the surrounding paragraph) rather
 * than a raw `tr.insert` at an inline position. Deletions run in descending
 * position order so an earlier delete never shifts a later one, then the insert
 * position is mapped through the chain's accumulated mapping. Returns the
 * command's actual boolean result (the legacy version discarded it).
 */
export function buildGroupSelectedImages(nodeName) {
    return () => ({ state, chain }) => {
        const { from, to } = state.selection;
        const collected = [];
        state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === 'image') {
                collected.push({
                    src: node.attrs.src,
                    alt: node.attrs.alt ?? '',
                    pos,
                });
            }
        });
        if (collected.length < 2)
            return false;
        const insertAnchor = Math.min(...collected.map((img) => img.pos));
        const descending = [...collected].sort((a, b) => b.pos - a.pos);
        let cmd = chain();
        for (const img of descending) {
            const node = state.doc.nodeAt(img.pos);
            if (node && node.type.name === 'image') {
                cmd = cmd.deleteRange({ from: img.pos, to: img.pos + node.nodeSize });
            }
        }
        return cmd
            .insertContentAt(insertAnchor, {
            type: nodeName,
            attrs: { columns: clampColumns(collected.length) },
            content: imageContent(collected.map((img) => ({ src: img.src, alt: img.alt }))),
        })
            .run();
    };
}
/**
 * Replace a gallery node's children + columns (edit-save path). Returns whether
 * the command ran. Used from the node view after the edit dialog resolves.
 */
export function replaceImageGroup(editor, getPos, data) {
    if (editor.isDestroyed)
        return false;
    return editor.commands.command(({ tr, state, dispatch }) => {
        const pos = safeGetPos(getPos);
        if (pos === null)
            return false;
        const node = state.doc.nodeAt(pos);
        if (!node || node.type.name !== IMAGE_GROUP)
            return false;
        const newNode = node.type.create({ ...node.attrs, columns: clampColumns(data.columns) }, data.images.map((img) => state.schema.nodes.image.create({ src: img.src, alt: img.alt })));
        tr.replaceWith(pos, pos + node.nodeSize, newNode);
        if (dispatch)
            dispatch(tr);
        return true;
    });
}
/**
 * Remove the image at `index` from the gallery. Deletes the whole gallery node
 * when it would otherwise be left empty. Returns whether the command ran.
 */
export function removeImageAt(editor, getPos, index) {
    if (editor.isDestroyed)
        return false;
    return editor.commands.command(({ tr, state, dispatch }) => {
        const pos = safeGetPos(getPos);
        if (pos === null)
            return false;
        const node = state.doc.nodeAt(pos);
        if (!node || node.type.name !== IMAGE_GROUP)
            return false;
        if (index < 0 || index >= node.childCount)
            return false;
        if (node.childCount <= 1) {
            tr.delete(pos, pos + node.nodeSize);
            if (dispatch)
                dispatch(tr);
            return true;
        }
        const kept = [];
        node.forEach((child, _offset, i) => {
            if (i !== index)
                kept.push(child);
        });
        tr.replaceWith(pos + 1, pos + node.nodeSize - 1, kept);
        if (dispatch)
            dispatch(tr);
        return true;
    });
}
/** Update the column count on the gallery node at `getPos`. */
export function setImageGroupColumns(editor, getPos, columns) {
    if (editor.isDestroyed)
        return false;
    return editor.commands.command(({ tr, state, dispatch }) => {
        const pos = safeGetPos(getPos);
        if (pos === null)
            return false;
        const node = state.doc.nodeAt(pos);
        if (!node || node.type.name !== IMAGE_GROUP)
            return false;
        tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            columns: clampColumns(columns),
        });
        if (dispatch)
            dispatch(tr);
        return true;
    });
}
/** Build the `addCommands` record for the extension. */
export function buildImageGroupCommands(nodeName) {
    return {
        setImageGroup: buildSetImageGroup(nodeName),
        groupSelectedImages: buildGroupSelectedImages(nodeName),
    };
}
