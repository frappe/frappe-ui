import { defineComponent, h } from 'vue';
import { useFloatingPopup } from '#molecules/editor/composables/useFloatingPopup';
import { useTableCellColorState } from '#molecules/editor/composables/useTableCellColorState';
import EditorPopover from '#molecules/editor/components/EditorPopover.vue';
import ColorSwatchGrid from '../font-color/ColorSwatchGrid.vue';
import { highlightSwatches, textSwatches } from '../font-color/swatches';
let activePopup = null;
const TableCellColorPanel = defineComponent({
    props: {
        editor: { type: Object, required: true },
        onClose: { type: Function, required: true },
    },
    setup(props) {
        const { activeBackground, activeTextColor, setBackground, setTextColor } = useTableCellColorState(props.editor);
        const pickBackground = (value) => {
            setBackground(value);
            props.onClose();
        };
        const pickText = (value) => {
            setTextColor(value);
            props.onClose();
        };
        return () => h(EditorPopover, { dialogLabel: 'Cell color', contentClass: 'rounded-md p-2.5' }, {
            default: () => [
                h('div', { 'data-slot': 'table-cell-color-panel' }, [
                    h('div', { class: 'text-sm text-ink-gray-7' }, 'Cell color'),
                    h(ColorSwatchGrid, {
                        swatches: highlightSwatches,
                        active: activeBackground.value,
                        variant: 'highlight',
                        onSelect: pickBackground,
                    }),
                    h('div', { class: 'mt-4 text-sm text-ink-gray-7' }, 'Text color'),
                    h(ColorSwatchGrid, {
                        swatches: textSwatches,
                        active: activeTextColor.value,
                        variant: 'text',
                        onSelect: pickText,
                    }),
                ]),
            ],
        });
    },
});
/**
 * Open the cell color picker anchored to a trigger button.
 *
 * The trigger rect is snapshotted into a virtual reference because the table
 * context-menu button is removed from the DOM when the menu closes on run —
 * anchoring to the live element would leave Floating UI tracking a detached node.
 */
export function openTableCellColorPicker(args) {
    activePopup?.destroy();
    const rect = args.anchor.getBoundingClientRect();
    activePopup = useFloatingPopup({
        anchor: args.anchor,
        component: TableCellColorPanel,
        props: {
            editor: args.editor,
            onClose: () => activePopup?.destroy(),
        },
        virtualReference: { getBoundingClientRect: () => rect },
        floatingOptions: { placement: 'bottom-start' },
    });
}
