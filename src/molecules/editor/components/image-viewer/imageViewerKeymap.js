/**
 * Build a `keydown` handler for the image viewer.
 *
 * Pure factory: takes callbacks, returns a handler. The handler no-ops when the
 * viewer is closed, reports activity (to keep controls visible) on any key, and
 * routes navigation / zoom / fullscreen / close. Returns `true` when it handled
 * the event (caller may call `preventDefault`); the handler itself also calls
 * `preventDefault` for handled keys.
 */
export function createImageViewerKeydown(actions) {
    return (event) => {
        if (!actions.isOpen())
            return;
        actions.onActivity();
        switch (event.key) {
            case 'ArrowLeft':
                if (!actions.isPanning())
                    actions.previous();
                event.preventDefault();
                break;
            case 'ArrowRight':
                if (!actions.isPanning())
                    actions.next();
                event.preventDefault();
                break;
            case '+':
            case '=':
                actions.zoomIn();
                event.preventDefault();
                break;
            case '-':
                actions.zoomOut();
                event.preventDefault();
                break;
            case 'Escape':
                actions.close();
                event.preventDefault();
                break;
            case 'f':
            case 'F':
                actions.toggleFullscreen();
                event.preventDefault();
                break;
        }
    };
}
