import { computed, onBeforeUnmount, ref } from 'vue';
import { fileSizeLimitMessage } from '#utils/fileSize';
import { resolveUploadOptions, uploadFile, } from '#molecules/editor/extensions/shared/media-upload-engine';
import { abortUpload, deleteUploadProgress, setUploadProgress, updateUploadProgress, } from '#molecules/editor/extensions/shared/media-upload-state';
import { existingItemId, fileItemId, filterImageFiles, } from './image-group-utils';
/** Build an `ImageItem` for a staged file (deterministic id). */
function makeFileItem(file) {
    return {
        type: 'file',
        file,
        id: fileItemId(file),
        status: 'idle',
    };
}
/** Build an `ImageItem` for an existing image (deterministic id). */
function makeExistingItem(existing) {
    return { type: 'existing', existing, id: existingItemId(existing) };
}
/**
 * State machine + upload orchestration for the image-group dialog.
 *
 * Owns the unified `images` array (files + existing), drag-reorder, caption
 * editing, the column count, and the parallel upload. Correctness contracts
 * (per PLAN cluster 4):
 *  - re-uploads the EDITED `images.value`, never the original `props.files`.
 *  - `try/finally` resets `uploading` even on throw.
 *  - partial failure preserves successful uploads (build from results), keeps
 *    the dialog open, and never silently drops files.
 *  - guards every editor touch with `isUnmounted` after the await.
 */
export function useImageGroupDialog(args) {
    const images = ref([]);
    const columns = ref(4);
    const uploading = ref(false);
    const uploadedCount = ref(0);
    const totalCount = ref(0);
    const uploadProgress = computed(() => totalCount.value > 0
        ? Math.round((uploadedCount.value / totalCount.value) * 100)
        : 0);
    const hasUploadError = ref(false);
    let isUnmounted = false;
    onBeforeUnmount(() => {
        isUnmounted = true;
    });
    function reset(opts) {
        const existingItems = (opts.existing ?? []).map(makeExistingItem);
        const fileItems = opts.files.map(makeFileItem);
        images.value =
            args.mode() === 'edit' ? [...existingItems, ...fileItems] : fileItems;
        uploadedCount.value = 0;
        totalCount.value = 0;
        hasUploadError.value = false;
    }
    function fileItems() {
        return images.value
            .filter((item) => item.type === 'file' && item.file)
            .map((item) => item.file);
    }
    /**
     * Whether `files` is the same SET (by deterministic id) the dialog already
     * holds. `update:files` is a two-way bind, so our own emits echo back through
     * `props.files`; the dialog uses this to skip re-syncing on an echo (which
     * would otherwise wipe typed captions / the chosen column count).
     */
    function matchesFileSet(files) {
        const incoming = new Set(files.map(fileItemId));
        const current = new Set(fileItems().map(fileItemId));
        if (incoming.size !== current.size)
            return false;
        for (const id of incoming)
            if (!current.has(id))
                return false;
        return true;
    }
    function addFiles(incoming) {
        const newItems = filterImageFiles(incoming).map(makeFileItem);
        const known = new Set(images.value.map((item) => item.id));
        const unique = newItems.filter((item) => !known.has(item.id));
        images.value.push(...unique);
        return fileItems();
    }
    function removeImage(index) {
        images.value.splice(index, 1);
        return fileItems();
    }
    function reorder(fromIndex, toIndex) {
        if (fromIndex === toIndex ||
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= images.value.length) {
            return fileItems();
        }
        const [moved] = images.value.splice(fromIndex, 1);
        images.value.splice(toIndex, 0, moved);
        return fileItems();
    }
    function setCaption(index, caption) {
        const item = images.value[index];
        if (!item)
            return;
        if (item.type === 'existing' && item.existing) {
            item.existing.alt = caption;
        }
        else {
            item.alt = caption;
        }
    }
    function resolveOptions() {
        const editor = args.editor();
        const extension = editor.extensionManager.extensions.find((ext) => ext.name === 'imageGroup');
        const uploadFunction = extension?.options?.uploadFunction;
        return resolveUploadOptions({ editor, uploadFunction });
    }
    /** Upload the staged files (in current UI order). Never throws. */
    async function uploadItem(item) {
        if (!item.file)
            return { success: false, error: new Error('No file selected') };
        if (item.uploaded)
            return { success: true, file: { file_url: item.uploaded.src } };
        const options = resolveOptions();
        const validationError = fileSizeLimitMessage(item.file);
        if (validationError) {
            item.status = 'failed';
            item.error = validationError;
            hasUploadError.value = true;
            return { success: false, error: new Error(validationError) };
        }
        const abortController = new AbortController();
        setUploadProgress(item.id, {
            loaded: 0,
            total: item.file.size,
            percent: 0,
            abort: () => abortController.abort(),
        });
        item.status = 'uploading';
        item.error = '';
        try {
            const result = await uploadFile(item.file, options, {
                signal: abortController.signal,
                onProgress: (progress) => {
                    updateUploadProgress(item.id, progress);
                },
            });
            item.status = 'uploaded';
            item.uploaded = {
                src: result.file_url,
                alt: item.alt || result.file_name || '',
            };
            return { success: true, file: result };
        }
        catch (error) {
            item.status = 'failed';
            item.error = abortController.signal.aborted
                ? 'Upload cancelled'
                : error?.message || 'Upload failed';
            hasUploadError.value = true;
            return { success: false, error: error };
        }
        finally {
            deleteUploadProgress(item.id);
        }
    }
    async function uploadStagedFiles(items) {
        if (items.length === 0)
            return [];
        uploading.value = true;
        hasUploadError.value = false;
        totalCount.value = items.length;
        uploadedCount.value = items.filter((item) => item.uploaded).length;
        try {
            return await Promise.all(items.map(async (item) => {
                const result = await uploadItem(item);
                uploadedCount.value += 1;
                return result;
            }));
        }
        finally {
            uploading.value = false;
        }
    }
    /**
     * Build the final ordered image list, uploading staged files and mapping each
     * file to its result. On partial failure the successful images are kept (in
     * UI order) and `hasUploadError` flags the failures so the dialog stays open.
     */
    async function buildFinalImages() {
        const stagedItems = images.value.filter((item) => item.type === 'file' && item.file && !item.uploaded);
        const staged = stagedItems.map((item) => item.file);
        const results = await uploadStagedFiles(stagedItems);
        const fileToImage = new Map();
        staged.forEach((file, index) => {
            const result = results[index];
            if (result?.success && result.file) {
                fileToImage.set(file, {
                    src: result.file.file_url,
                    alt: result.file.file_name ?? '',
                });
            }
            else if (result && !result.success) {
                hasUploadError.value = true;
            }
        });
        // Build the final list from successes only, in current UI order. Failed
        // staged files are intentionally LEFT in `images.value` so they stay in the
        // grid for retry (PLAN: never silently drop; keep dialog open).
        const final = [];
        for (const item of images.value) {
            if (item.type === 'existing' && item.existing) {
                final.push(item.existing);
            }
            else if (item.uploaded) {
                final.push({
                    src: item.uploaded.src,
                    alt: item.alt ?? item.uploaded.alt,
                });
            }
            else if (item.file) {
                const uploaded = fileToImage.get(item.file);
                if (uploaded) {
                    final.push({ src: uploaded.src, alt: item.alt ?? uploaded.alt });
                }
            }
        }
        return final;
    }
    async function retryImage(index) {
        const item = images.value[index];
        if (!item || item.type !== 'file')
            return;
        hasUploadError.value = false;
        uploading.value = true;
        totalCount.value = 1;
        uploadedCount.value = 0;
        try {
            await uploadItem(item);
        }
        finally {
            uploadedCount.value = 1;
            uploading.value = false;
        }
    }
    function abortAll() {
        images.value.forEach((item) => abortUpload(item.id));
    }
    return {
        images,
        columns,
        uploading,
        uploadProgress,
        uploadedCount,
        totalCount,
        hasUploadError,
        isUnmounted: () => isUnmounted,
        reset,
        addFiles,
        removeImage,
        reorder,
        setCaption,
        fileItems,
        matchesFileSet,
        buildFinalImages,
        retryImage,
        abortAll,
    };
}
