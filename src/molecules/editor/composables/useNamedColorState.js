import { onBeforeUnmount, onMounted, ref } from 'vue';
import { PALETTE_NAMES } from '#molecules/editor/extensions/shared/color-palette';
/**
 * Reactive active-color state + setters for the font-color picker.
 *
 * Reads the active named text/highlight color off the editor using the same
 * leak-free subscription pattern as `useNodeViewEditable` — listeners attach in
 * `onMounted` and detach in `onBeforeUnmount`. Every editor read/write is
 * guarded against a destroyed editor.
 */
export function useNamedColorState(editor) {
    const activeTextColor = ref(null);
    const activeHighlightColor = ref(null);
    /** First palette name for which the given mark/attr is active, else null. */
    const firstActive = (probe) => {
        for (const name of PALETTE_NAMES) {
            if (probe(name))
                return name;
        }
        return null;
    };
    const sync = () => {
        if (!editor || editor.isDestroyed)
            return;
        activeTextColor.value = firstActive((name) => editor.isActive('textStyle', { color: name }));
        activeHighlightColor.value = firstActive((name) => editor.isActive('namedHighlight', { color: name }));
    };
    onMounted(() => {
        sync();
        if (!editor || editor.isDestroyed)
            return;
        editor.on('transaction', sync);
        editor.on('selectionUpdate', sync);
    });
    onBeforeUnmount(() => {
        if (!editor)
            return;
        editor.off('transaction', sync);
        editor.off('selectionUpdate', sync);
    });
    const setText = (name) => {
        if (!editor || editor.isDestroyed)
            return;
        if (name)
            editor.chain().focus().setColorByName(name).run();
        else
            editor.chain().focus().unsetColor().run();
    };
    const setHighlight = (name) => {
        if (!editor || editor.isDestroyed)
            return;
        if (name)
            editor.chain().focus().toggleHighlightByName(name).run();
        else
            editor.chain().focus().unsetHighlight().run();
    };
    return { activeTextColor, activeHighlightColor, setText, setHighlight };
}
