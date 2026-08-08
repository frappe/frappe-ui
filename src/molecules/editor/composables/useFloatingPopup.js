import { createApp, h } from 'vue';
import { autoUpdate, computePosition, flip, offset, shift, } from '@floating-ui/dom';
export function useFloatingPopup(options) {
    const { anchor, component, props, virtualReference } = options;
    const floatingOptions = options.floatingOptions ?? {};
    const reference = virtualReference ?? anchor;
    const appendTo = anchor.closest('[role="dialog"]') || document.body;
    const floating = document.createElement('div');
    floating.style.position = floatingOptions.strategy ?? 'absolute';
    floating.style.left = '0';
    floating.style.top = '0';
    floating.style.zIndex = '100';
    appendTo.appendChild(floating);
    let app = createApp({
        render() {
            return h(component, props);
        },
    });
    app.mount(floating);
    let cleanupAutoUpdate = null;
    let destroyed = false;
    let animated = false;
    const update = () => {
        if (destroyed)
            return;
        void computePosition(reference, floating, {
            placement: floatingOptions.placement ?? 'top',
            strategy: floatingOptions.strategy ?? 'absolute',
            middleware: [
                offset(normalizeOffset(floatingOptions.offset)),
                flip(),
                shift({ padding: 8 }),
            ],
        }).then(({ x, y, strategy, placement }) => {
            if (destroyed)
                return;
            Object.assign(floating.style, {
                position: strategy,
                left: `${x}px`,
                top: `${y}px`,
            });
            // First positioned frame: set the origin from the resolved placement and
            // trigger the enter animation once (so it scales from the edge nearest the
            // anchor, not from 0,0 before positioning).
            if (options.animate && !animated) {
                animated = true;
                floating.style.transformOrigin = transformOriginFor(placement);
                floating.classList.add('editor-floating-pop');
            }
        });
    };
    const handle = {
        floating,
        update,
        destroy() {
            if (destroyed)
                return;
            destroyed = true;
            cleanupAutoUpdate?.();
            cleanupAutoUpdate = null;
            document.removeEventListener('pointerdown', onPointerDown, true);
            document.removeEventListener('keydown', onKeydown, true);
            app?.unmount();
            floating.remove();
            app = null;
            handle.floating = null;
        },
    };
    function onPointerDown(event) {
        const target = event.target;
        if (!target)
            return;
        if (floating.contains(target))
            return;
        if (!options.closeOnAnchorPointerDown && anchor.contains(target))
            return;
        handle.destroy();
    }
    function onKeydown(event) {
        if (event.key === 'Escape' && options.closeOnEscape !== false)
            handle.destroy();
    }
    cleanupAutoUpdate = autoUpdate(reference, floating, update);
    requestAnimationFrame(() => {
        if (destroyed)
            return;
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('keydown', onKeydown, true);
    });
    update();
    return handle;
}
function normalizeOffset(value) {
    if (Array.isArray(value))
        return { mainAxis: value[1], crossAxis: value[0] };
    return value ?? 4;
}
/**
 * CSS `transform-origin` for a popup at the given (resolved) placement: the
 * point on the floating box nearest the anchor. A menu placed `right-start`
 * grows from its `left top` corner; `top` grows from `center bottom`, etc.
 */
function transformOriginFor(placement) {
    const [side, align] = placement.split('-');
    const opposite = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
    };
    if (side === 'top' || side === 'bottom') {
        const x = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
        return `${x} ${opposite[side]}`;
    }
    const y = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
    return `${opposite[side]} ${y}`;
}
