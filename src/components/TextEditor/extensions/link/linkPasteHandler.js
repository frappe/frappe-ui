import { Plugin, PluginKey } from '@tiptap/pm/state';
import { isValidUrl } from '../../../../utils/url-validation';
export function linkPasteHandler(options) {
    return new Plugin({
        key: new PluginKey('handlePasteLink'),
        props: {
            handlePaste: (view, event, slice) => {
                const { state } = view;
                const { selection } = state;
                const { empty } = selection;
                if (empty) {
                    return false;
                }
                let textContent = '';
                slice.content.forEach((node) => {
                    textContent += node.textContent;
                });
                if (!textContent) {
                    return false;
                }
                let link = isValidUrl(textContent) ? textContent : null;
                if (!link) {
                    return false;
                }
                return options.editor
                    .chain()
                    .setTextSelection({ from: selection.from, to: selection.to })
                    .setLink({ href: link })
                    .setTextSelection(selection.to)
                    .command(({ tr }) => {
                    tr.setStoredMarks([]);
                    return true;
                })
                    .run();
            },
        },
    });
}
