/**
 * Roving-focus keyboard navigation for the tree, following the WAI-ARIA
 * Tree View pattern (P12). Operates on the flattened list of visible rows.
 */
export function useTreeKeyboard(options) {
    const { flat, focusedKey, focus, expand, collapse, toggle } = options;
    let typeahead = '';
    let typeaheadTimer = null;
    const indexOfFocused = () => flat.value.findIndex((f) => f.key === focusedKey.value);
    function focusAt(index) {
        const item = flat.value[index];
        if (item)
            focus(item.key);
    }
    function moveToParent(current) {
        if (current.parentKey == null)
            return;
        focus(current.parentKey);
    }
    function typeaheadSearch(char) {
        if (typeaheadTimer)
            clearTimeout(typeaheadTimer);
        typeahead += char.toLowerCase();
        typeaheadTimer = setTimeout(() => (typeahead = ''), 500);
        const start = Math.max(indexOfFocused(), 0);
        const ordered = [
            ...flat.value.slice(start + 1),
            ...flat.value.slice(0, start + 1),
        ];
        const match = ordered.find((f) => options.labelOf(f.node).toLowerCase().startsWith(typeahead));
        if (match)
            focus(match.key);
    }
    function onKeydown(e) {
        const index = indexOfFocused();
        const current = flat.value[index];
        if (!current && !['Home', 'End'].includes(e.key))
            return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                focusAt(Math.min(index + 1, flat.value.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusAt(Math.max(index - 1, 0));
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (current.hasChildren && !current.expanded)
                    expand(current.node);
                else if (current.hasChildren && current.expanded)
                    focusAt(index + 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (current.hasChildren && current.expanded)
                    collapse(current.node);
                else
                    moveToParent(current);
                break;
            case 'Home':
                e.preventDefault();
                focusAt(0);
                break;
            case 'End':
                e.preventDefault();
                focusAt(flat.value.length - 1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                toggle(current.node);
                break;
            default:
                if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
                    typeaheadSearch(e.key);
                }
        }
    }
    return { onKeydown };
}
