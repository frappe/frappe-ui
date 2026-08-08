import { computed, reactive } from 'vue';
/**
 * Owns the live drag state and resolves + validates drops for the tree.
 * Pure logic — it never mutates `nodes`; it hands the caller a `DropInfo` via
 * `drag-end` and lets them persist and update the model.
 */
export function useTreeDragDrop(options) {
    const { keyOf, childrenOf, siblingsOf, disabled, move } = options;
    const state = reactive({
        source: null,
        sourceParent: null,
        target: null,
        position: null,
        x: 0,
        y: 0,
    });
    // Resolved on a valid drop, emitted on the following `dragend`.
    let pending = null;
    function isDescendant(node, key) {
        const stack = [...childrenOf(node)];
        while (stack.length) {
            const current = stack.pop();
            if (keyOf(current) === key)
                return true;
            stack.push(...childrenOf(current));
        }
        return false;
    }
    /** Resolve where the cursor sits within a row into a drop position. */
    function resolvePosition(e) {
        const row = e.currentTarget;
        const rect = row.getBoundingClientRect();
        const offset = e.clientY - rect.top;
        if (offset < rect.height * 0.25)
            return 'before';
        if (offset > rect.height * 0.75)
            return 'after';
        return 'inside';
    }
    /** Whether a drop of `source` onto `target` at `position` is permitted. */
    function isValidDrop(source, target, position) {
        const sourceKey = keyOf(source);
        const targetKey = keyOf(target);
        if (sourceKey === targetKey)
            return false;
        if (isDescendant(source, targetKey))
            return false;
        // Re-parenting onto the node's current parent is a no-op.
        if (position === 'inside' &&
            state.sourceParent &&
            keyOf(state.sourceParent) === targetKey)
            return false;
        if (move && !move({ node: source, target, position }))
            return false;
        return true;
    }
    function onDragStart(e, node, parent) {
        if (disabled.value)
            return;
        state.source = node;
        state.sourceParent = parent;
        pending = null;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(keyOf(node)));
        }
        options.emitDragStart(node);
        options.announce(`Picked up ${options.labelOf(node)}`);
    }
    function onDragOver(e, node) {
        if (!state.source || disabled.value)
            return;
        const position = resolvePosition(e);
        state.x = e.clientX;
        state.y = e.clientY;
        if (isValidDrop(state.source, node, position)) {
            state.target = node;
            state.position = position;
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = 'move';
        }
        else {
            state.target = null;
            state.position = null;
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = 'none';
        }
    }
    function onDragLeave(node) {
        if (state.target && keyOf(state.target) === keyOf(node)) {
            state.target = null;
            state.position = null;
        }
    }
    function onDrop(target, targetParent) {
        const source = state.source;
        const position = state.position;
        if (!source || !position || !state.target)
            return;
        if (keyOf(state.target) !== keyOf(target))
            return;
        const from = state.sourceParent ? keyOf(state.sourceParent) : null;
        const oldSiblings = siblingsOf(state.sourceParent);
        const oldIndex = oldSiblings.findIndex((n) => keyOf(n) === keyOf(source));
        let to;
        let newIndex;
        if (position === 'inside') {
            to = keyOf(target);
            newIndex = childrenOf(target).length;
        }
        else {
            to = targetParent ? keyOf(targetParent) : null;
            const siblings = siblingsOf(targetParent);
            const targetIndex = siblings.findIndex((n) => keyOf(n) === keyOf(target));
            let insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
            // When reordering within the same parent, the source still occupies a
            // slot in `siblings`. Removing it first shifts later positions down by
            // one, so the reported `newIndex` is the final post-removal position.
            if (from === to && oldIndex > -1 && oldIndex < insertIndex)
                insertIndex -= 1;
            newIndex = insertIndex;
        }
        pending = { node: source, from, to, position, oldIndex, newIndex };
        options.announce(`Moved ${options.labelOf(source)}`);
    }
    function reset() {
        state.source = null;
        state.sourceParent = null;
        state.target = null;
        state.position = null;
    }
    function onDragEnd() {
        if (!pending && state.source)
            options.announce('Cancelled move');
        options.emitDragEnd(pending);
        pending = null;
        reset();
    }
    const dragSourceKey = computed(() => state.source ? keyOf(state.source) : null);
    const dropTargetKey = computed(() => state.target ? keyOf(state.target) : null);
    const dropPosition = computed(() => state.position);
    return {
        state,
        dragSourceKey,
        dropTargetKey,
        dropPosition,
        onDragStart,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
    };
}
