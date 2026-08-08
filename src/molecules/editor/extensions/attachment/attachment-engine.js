import { fileSizeLimitMessage } from '#utils/fileSize';
import { isSafeUrl } from '#molecules/editor/extensions/shared/url-safety';
import { findNodeByUploadId } from '#molecules/editor/extensions/shared/node-view';
import { applyUploadError, applyUploadSuccess, insertPlaceholder, removeNodeByUploadId, } from '#molecules/editor/extensions/shared/media-node-ops';
import { createUploadId } from '#molecules/editor/extensions/shared/upload-id';
import { deleteLocalFile, deleteUploadProgress, getLocalFile, setLocalFile, setUploadProgress, updateUploadProgress, } from '#molecules/editor/extensions/shared/media-upload-state';
/** Schema node name this engine inserts/updates. */
export const ATTACHMENT_NODE_NAME = 'attachment';
/** Attachments have no intrinsic dimensions; the shared ops want a value. */
const NO_DIMENSIONS = { width: null, height: null };
/** The node attrs derived from a `File` before upload (filename/size/type). */
function attachmentAttrsFromFile(file) {
    return {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
    };
}
/**
 * Core upload run: stage file -> placeholder -> upload -> write-back. Returns
 * the uploadId so multi-upload sequencing can anchor the next insert.
 */
async function run(file, editor, pos, mode, options, placeholderAttrs = attachmentAttrsFromFile(file)) {
    if (!options.uploadFunction) {
        console.error('uploadFunction option is not provided');
        return null;
    }
    // Yield one microtask before mutating the doc. These engine entry points run
    // from a command callback that returns `true`, after which ProseMirror's
    // CommandManager dispatches its own transaction for that tick. Inserting the
    // placeholder synchronously here would dispatch a second transaction built on
    // the pre-command state, which ProseMirror rejects with "Applying a mismatched
    // transaction". The image/video engines get this yield implicitly from their
    // `await probeOrNull(...)`; an attachment has no dimensions to probe.
    await Promise.resolve();
    const uploadId = createUploadId();
    const abortController = new AbortController();
    setUploadProgress(uploadId, {
        loaded: 0,
        total: file.size,
        percent: 0,
        abort: () => abortController.abort(),
    });
    try {
        // Reject over-limit files before staging: insert an error placeholder with
        // the file kept so "Try again" / "Choose another" still work.
        const validationError = fileSizeLimitMessage(file);
        if (validationError) {
            setLocalFile(uploadId, { file });
            if (editor.isDestroyed) {
                deleteLocalFile(uploadId);
                deleteUploadProgress(uploadId);
                return uploadId;
            }
            insertPlaceholder(editor.view, ATTACHMENT_NODE_NAME, pos, mode, uploadId, NO_DIMENSIONS, placeholderAttrs);
            applyUploadError(editor.view, ATTACHMENT_NODE_NAME, uploadId, validationError);
            return uploadId;
        }
        setLocalFile(uploadId, { file });
        if (editor.isDestroyed) {
            deleteLocalFile(uploadId);
            deleteUploadProgress(uploadId);
            return uploadId;
        }
        insertPlaceholder(editor.view, ATTACHMENT_NODE_NAME, pos, mode, uploadId, NO_DIMENSIONS, placeholderAttrs);
        const uploaded = await options.uploadFunction(file, {
            signal: abortController.signal,
            onProgress: (progress) => {
                updateUploadProgress(uploadId, {
                    ...progress,
                    abort: () => abortController.abort(),
                });
            },
        });
        if (editor.isDestroyed) {
            deleteLocalFile(uploadId);
            deleteUploadProgress(uploadId);
            return uploadId;
        }
        if (!uploaded?.file_url ||
            !isSafeUrl(uploaded.file_url, { base: window.location.origin })) {
            applyUploadError(editor.view, ATTACHMENT_NODE_NAME, uploadId, 'Upload returned no file URL');
            return uploadId;
        }
        // applyUploadSuccess preserves the existing attrs (fileName/fileSize/…) and
        // only sets `src`, clears `loading`/`error`.
        applyUploadSuccess(editor.view, ATTACHMENT_NODE_NAME, uploadId, uploaded);
        deleteLocalFile(uploadId);
    }
    catch (error) {
        if (abortController.signal.aborted) {
            if (!editor.isDestroyed) {
                removeNodeByUploadId(editor.view, ATTACHMENT_NODE_NAME, uploadId);
            }
            deleteLocalFile(uploadId);
            deleteUploadProgress(uploadId);
            return uploadId;
        }
        const message = error?.message || 'Failed to upload attachment';
        if (!editor.isDestroyed) {
            applyUploadError(editor.view, ATTACHMENT_NODE_NAME, uploadId, message);
        }
    }
    finally {
        if (!abortController.signal.aborted) {
            deleteUploadProgress(uploadId);
        }
    }
    return uploadId;
}
/** Upload a single file, replacing the current selection with the chip. */
export async function uploadAttachment(file, editor, options) {
    await run(file, editor, null, 'replace', options);
}
/**
 * Doc-mutating multi-upload for drop/paste. Uploads sequentially, anchoring each
 * insert immediately after the previous placeholder via its uploadId. Reads
 * `editor.view` fresh each iteration (the host may swap it mid-flight).
 */
export async function uploadAttachmentFiles(files, editor, pos, options) {
    if (files.length === 0)
        return;
    if (files.length === 1) {
        await run(files[0], editor, pos, 'replace', options);
        return;
    }
    let lastUploadId = null;
    for (const file of files) {
        let insertPos = pos;
        if (lastUploadId) {
            const prevPos = findNodeByUploadId(editor.view, ATTACHMENT_NODE_NAME, lastUploadId);
            if (prevPos !== null) {
                const prevNode = editor.view.state.doc.nodeAt(prevPos);
                insertPos = prevPos + (prevNode?.nodeSize ?? 1);
            }
        }
        lastUploadId = await run(file, editor, insertPos, 'insert', options);
    }
}
/** Re-run a failed upload for the node at `pos` using its staged file. */
export async function reuploadAttachment(editor, pos, options) {
    const node = editor.view.state.doc.nodeAt(pos);
    const uploadId = node?.attrs.uploadId;
    const entry = uploadId ? getLocalFile(uploadId) : undefined;
    if (!uploadId || !entry) {
        console.error(`reuploadAttachment: no staged file for node at ${pos}`);
        return;
    }
    const replacementUploadId = await run(entry.file, editor, pos, 'replace', options, node?.attrs ?? attachmentAttrsFromFile(entry.file));
    if (replacementUploadId) {
        deleteLocalFile(uploadId);
    }
}
