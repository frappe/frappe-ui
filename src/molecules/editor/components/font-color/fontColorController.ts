import { defineComponent, h } from 'vue'
import type { Editor } from '@tiptap/core'
import { useFloatingPopup } from '@molecules/editor/composables/useFloatingPopup'
import { useNamedColorState } from '@molecules/editor/composables/useNamedColorState'
import ColorSwatchGrid from './ColorSwatchGrid.vue'
import { highlightSwatches, textSwatches } from './swatches'

let activePopup: ReturnType<typeof useFloatingPopup> | null = null

const FontColorPanel = defineComponent({
  props: {
    editor: { type: Object, required: true },
    onClose: { type: Function, required: true },
  },
  setup(props) {
    const { activeTextColor, activeHighlightColor, setText, setHighlight } =
      useNamedColorState(props.editor as Editor)

    function selectText(value: string | null) {
      setText(value)
      props.onClose()
    }

    function selectHighlight(value: string | null) {
      setHighlight(value)
      props.onClose()
    }

    return () =>
      h(
        'div',
        {
          'data-slot': 'font-color-panel',
          class: 'rounded-lg bg-surface-white p-2 shadow-2xl',
        },
        [
          h('div', { class: 'text-sm text-ink-gray-7' }, 'Text Color'),
          h(ColorSwatchGrid, {
            swatches: textSwatches,
            active: activeTextColor.value,
            variant: 'text',
            onSelect: selectText,
          }),
          h(
            'div',
            { class: 'mt-2 text-sm text-ink-gray-7' },
            'Background Color',
          ),
          h(ColorSwatchGrid, {
            swatches: highlightSwatches,
            active: activeHighlightColor.value,
            variant: 'highlight',
            onSelect: selectHighlight,
          }),
        ],
      )
  },
})

export function openFontColorPicker(args: {
  editor: Editor
  anchor: HTMLElement
}): void {
  activePopup?.destroy()
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
  })
}
