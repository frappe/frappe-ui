import { defineComponent, h } from 'vue';
import { useFloatingPopup } from '#molecules/editor/composables/useFloatingPopup';
import { useNamedColorState } from '#molecules/editor/composables/useNamedColorState';
import EditorPopover from '#molecules/editor/components/EditorPopover.vue';
import ColorSwatchGrid from './ColorSwatchGrid.vue';
import { highlightSwatches, textSwatches } from './swatches';
let activePopup = null;
const FontColorPanel = defineComponent({
    props: {
        editor: { type: Object, required: true },
        onClose: { type: Function, required: true },
    },
    setup(props) {
        const { activeTextColor, activeHighlightColor, setText, setHighlight } = useNamedColorState(props.editor);
        function selectText(value) {
            setText(value);
            props.onClose();
        }
        function selectHighlight(value) {
            setHighlight(value);
            props.onClose();
        }
        return () => h(EditorPopover, {
            dialogLabel: 'Text and background color',
            contentClass: 'rounded-md p-2.5',
        }, {
            default: () => [
                h('div', { 'data-slot': 'font-color-panel' }, [
                    h('div', { class: 'text-sm text-ink-gray-7' }, 'Text Color'),
                    h(ColorSwatchGrid, {
                        swatches: textSwatches,
                        active: activeTextColor.value,
                        variant: 'text',
                        onSelect: selectText,
                    }),
                    h('div', { class: 'mt-4 text-sm text-ink-gray-7' }, 'Background Color'),
                    h(ColorSwatchGrid, {
                        swatches: highlightSwatches,
                        active: activeHighlightColor.value,
                        variant: 'highlight',
                        onSelect: selectHighlight,
                    }),
                ]),
            ],
        });
    },
});
export function openFontColorPicker(args) {
    activePopup?.destroy();
    activePopup = useFloatingPopup({
        anchor: args.anchor,
        component: FontColorPanel,
        props: {
            editor: args.editor,
            onClose: () => activePopup?.destroy(),
        },
        floatingOptions: {
            placement: 'bottom-start',
        },
    });
}
