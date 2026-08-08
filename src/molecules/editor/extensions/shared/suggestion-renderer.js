import { VueRenderer } from '@tiptap/vue-3';
import { computePosition, flip, offset, shift, } from '@floating-ui/dom';
/**
 * The imperative Floating UI + VueRenderer lifecycle for suggestion popups,
 * extracted from `createSuggestionExtension().render()`.
 *
 * Import path: `#molecules/editor/extensions/shared/suggestion-renderer`
 */
export function createSuggestionRenderer(component, floatingOptions) {
    let renderer = null;
    let floatingEl = null;
    let getReferenceClientRect = null;
    // Once exited/destroyed, late async updates must not resurrect anything.
    let isActive = false;
    // Monotonic token; a stale onUpdate from a superseded query bails.
    let renderToken = 0;
    function getListExpose() {
        const ref = renderer?.ref;
        if (ref && typeof ref.onKeyDown === 'function')
            return ref;
        return null;
    }
    function updatePosition() {
        if (!floatingEl || !getReferenceClientRect)
            return;
        const rect = getReferenceClientRect();
        if (!rect)
            return;
        const reference = { getBoundingClientRect: () => rect };
        void computePosition(reference, floatingEl, {
            placement: floatingOptions?.placement ?? 'bottom-start',
            middleware: [
                offset(normalizeOffset(floatingOptions?.offset)),
                flip(),
                shift({ padding: 8 }),
            ],
        }).then(({ x, y }) => {
            if (!floatingEl)
                return;
            Object.assign(floatingEl.style, {
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                zIndex: '100',
            });
        });
    }
    // Attach `renderer.el` (the wrapper VueRenderer always creates) rather than
    // `renderer.element` (its firstElementChild): the popup renders nothing until it
    // has items, so `element` is null at onStart and nothing would mount. `el` is a
    // public, typed field on VueRenderer, so a tiptap release that drops it fails the
    // build here instead of breaking silently; instanceof narrows Element ->
    // HTMLElement. Guarded by suggestion-renderer.test.ts.
    function getWrapper() {
        const el = renderer?.el;
        return el instanceof HTMLElement ? el : null;
    }
    // Attach the wrapper to the body and position it. Re-callable from a later
    // onUpdate if the initial attach couldn't complete.
    function attach(props, token) {
        if (!isActive || token !== renderToken || !renderer)
            return;
        if (floatingEl)
            return;
        const wrapper = getWrapper();
        if (!props.clientRect || !wrapper)
            return;
        floatingEl = wrapper;
        floatingEl.style.position = 'absolute';
        document.body.appendChild(floatingEl);
        getReferenceClientRect = props.clientRect;
        updatePosition();
    }
    return {
        onStart(props) {
            isActive = true;
            const token = ++renderToken;
            renderer = new VueRenderer(component, {
                editor: props.editor,
                props,
            });
            attach(props, token);
        },
        onUpdate(props) {
            if (!isActive || !renderer)
                return;
            const token = ++renderToken;
            // Skip the plugin's transient `loading` dispatch (empty items) so the
            // popover doesn't unmount/remount on every keystroke.
            const loading = props.loading;
            if (!loading)
                renderer.updateProps(props);
            if (!props.clientRect)
                return;
            if (token !== renderToken)
                return;
            getReferenceClientRect = props.clientRect;
            // Late-attach if the initial mount couldn't; otherwise just reposition.
            if (!floatingEl)
                attach(props, token);
            else
                updatePosition();
        },
        onKeyDown(props) {
            // Let the suggestion plugin handle Escape (it runs onExit).
            if (props.event.key === 'Escape')
                return false;
            const list = getListExpose();
            if (list)
                return list.onKeyDown(props);
            return false;
        },
        onExit() {
            isActive = false;
            renderToken++;
            floatingEl?.remove();
            renderer?.destroy();
            floatingEl = null;
            renderer = null;
            getReferenceClientRect = null;
        },
    };
}
function normalizeOffset(value) {
    if (Array.isArray(value))
        return { mainAxis: value[1], crossAxis: value[0] };
    return value ?? 4;
}
