import { onBeforeUnmount, onMounted, ref } from 'vue';
import { CellSelection, isInTable, selectionCell } from '@tiptap/pm/tables';
import { PALETTE_NAMES } from '#molecules/editor/extensions/shared/color-palette';
/**
 * Reactive active-color state + setters for the table cell-color picker. Mirrors
 * `useNamedColorState`'s leak-free subscription pattern (attach in `onMounted`,
 * detach in `onBeforeUnmount`) and guards every read/write against a destroyed
 * editor.
 */
export function useTableCellColorState(editor) {
    const activeBackground = ref(null);
    const activeTextColor = ref(null);
    const readBackground = () => {
        const { state } = editor;
        if (!isInTable(state))
            return null;
        const { selection } = state;
        // The anchor cell's value: for a uniform selection it's the shared color,
        // otherwise just the anchor's — enough to drive the active swatch.
        const $cell = selection instanceof CellSelection
            ? selection.$anchorCell
            : selectionCell(state);
        const value = $cell?.nodeAfter?.attrs?.backgroundColor;
        return typeof value === 'string' ? value : null;
    };
    const readTextColor = () => {
        for (const name of PALETTE_NAMES) {
            if (editor.isActive('textStyle', { color: name }))
                return name;
        }
        return null;
    };
    const sync = () => {
        if (!editor || editor.isDestroyed)
            return;
        activeBackground.value = readBackground();
        activeTextColor.value = readTextColor();
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
    const setBackground = (name) => {
        if (!editor || editor.isDestroyed)
            return;
        editor.chain().focus().setCellBackground(name).run();
    };
    const setTextColor = (name) => {
        if (!editor || editor.isDestroyed)
            return;
        editor.chain().focus().setCellTextColor(name).run();
    };
    return { activeBackground, activeTextColor, setBackground, setTextColor };
}
