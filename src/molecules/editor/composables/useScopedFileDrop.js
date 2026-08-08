import { onBeforeUnmount, ref, watch } from 'vue';
/**
 * Scoped file-drag/drop tracking for a single root element.
 *
 * Replaces the old document-hijacking `window` `dragover`/`drop`/`dragleave`
 * listeners (which intercepted drops anywhere on the page) with listeners bound
 * to a specific root element. `isFileDragging` is only true while a file drag is
 * over that root, and `onFiles` fires only for drops that land inside it.
 *
 * Listeners are (re)bound whenever the root ref changes and are always removed
 * on unmount.
 *
 * @param root Ref to the scoping element (e.g. the dialog body). May be null
 *   until mounted.
 * @param onFiles Called with the dropped `File[]` when files are dropped inside
 *   the root. Reordering/non-file drops are left to the caller's own handlers.
 */
export function useScopedFileDrop(root, onFiles) {
    const isFileDragging = ref(false);
    let depth = 0;
    const hasFiles = (event) => !!event.dataTransfer &&
        Array.from(event.dataTransfer.types).includes('Files');
    const onDragEnter = (event) => {
        if (!hasFiles(event))
            return;
        depth += 1;
        isFileDragging.value = true;
    };
    const onDragOver = (event) => {
        if (!hasFiles(event))
            return;
        event.preventDefault();
    };
    const onDragLeave = () => {
        depth = Math.max(0, depth - 1);
        if (depth === 0)
            isFileDragging.value = false;
    };
    const onDrop = (event) => {
        depth = 0;
        isFileDragging.value = false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length === 0)
            return;
        event.preventDefault();
        event.stopPropagation();
        onFiles(files);
    };
    const bind = (el) => {
        el.addEventListener('dragenter', onDragEnter);
        el.addEventListener('dragover', onDragOver);
        el.addEventListener('dragleave', onDragLeave);
        el.addEventListener('drop', onDrop);
    };
    const unbind = (el) => {
        el.removeEventListener('dragenter', onDragEnter);
        el.removeEventListener('dragover', onDragOver);
        el.removeEventListener('dragleave', onDragLeave);
        el.removeEventListener('drop', onDrop);
    };
    watch(root, (el, prev) => {
        if (prev)
            unbind(prev);
        depth = 0;
        isFileDragging.value = false;
        if (el)
            bind(el);
    }, { immediate: true });
    onBeforeUnmount(() => {
        if (root.value)
            unbind(root.value);
    });
    return { isFileDragging };
}
