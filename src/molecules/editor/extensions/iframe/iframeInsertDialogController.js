import { createApp, h, ref } from 'vue';
import IframeInsertDialog from './IframeInsertDialog.vue';
/**
 * Imperatively mount the "Insert Embed" dialog (mirrors
 * `imageGroupDialogController`). The `openIframeDialog` command calls this, so
 * the dialog needs no consumer-rendered slot component — it self-tears-down on
 * close.
 */
let app = null;
let container = null;
function teardown() {
    app?.unmount();
    app = null;
    container?.parentNode?.removeChild(container);
    container = null;
}
export function openIframeInsertDialog(args) {
    teardown();
    const open = ref(true);
    container = document.createElement('div');
    document.body.appendChild(container);
    app = createApp({
        render() {
            return h(IframeInsertDialog, {
                modelValue: open.value,
                'onUpdate:modelValue': (value) => {
                    open.value = value;
                    if (!value)
                        setTimeout(teardown, 0);
                },
                editor: args.editor,
                getReplacePos: args.getReplacePos,
                initialUrl: args.initialUrl,
                platform: args.platform,
                onClose: () => setTimeout(teardown, 0),
            });
        },
    });
    app.mount(container);
}
