import { useFloatingPopup } from '#molecules/editor/composables/useFloatingPopup';
import TableSizePicker from './TableSizePicker.vue';
let activePopup = null;
/**
 * Open the insert-table size picker, anchored to a trigger button (toolbar) or
 * an arbitrary rect (the caret, for the slash command). The anchor rect is
 * snapshotted into a virtual reference — the trigger may leave the DOM while
 * the picker is open (e.g. a closing menu), and the slash command's caret
 * coordinates aren't an element at all.
 */
export function openTableSizePicker(args) {
    activePopup?.destroy();
    const anchor = args.anchor ?? args.editor.view.dom;
    const rect = args.reference ?? anchor.getBoundingClientRect();
    activePopup = useFloatingPopup({
        anchor,
        component: TableSizePicker,
        props: {
            onPick: ({ rows, cols }) => {
                const editor = args.editor;
                activePopup?.destroy();
                activePopup = null;
                editor
                    .chain()
                    .focus()
                    .insertTable({ rows, cols, withHeaderRow: true })
                    .run();
            },
        },
        virtualReference: { getBoundingClientRect: () => rect },
        floatingOptions: { placement: 'bottom-start' },
    });
}
