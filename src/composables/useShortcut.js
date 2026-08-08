import { computed, onActivated, onBeforeUnmount, onDeactivated, reactive, readonly, } from 'vue';
// ---------------------------------------------------------------------------
// Module-level state (global singleton)
// ---------------------------------------------------------------------------
const activeShortcuts = reactive([]);
const shortcutHandlers = new Map();
const heldShortcuts = new Set();
let listenerAttached = false;
// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
function isCtrlOrCmd(e) {
    return e.ctrlKey || e.metaKey;
}
function isTargetEditable(e) {
    const target = e.target;
    return (target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA');
}
/** Returns true when the keypress originated inside an open dialog (focus-trap owned). */
function isInsideDialog(e) {
    const target = e.target;
    if (!(target instanceof Element))
        return false;
    return !!target.closest('[role="dialog"]');
}
/** @internal Exported for unit tests only. */
export function matchesShortcut(e, config) {
    if (e.key.toLowerCase() !== config.key.toLowerCase()) {
        return false;
    }
    const wantsCtrl = config.ctrl ?? false;
    const wantsShift = config.shift ?? false;
    const wantsAlt = config.alt ?? false;
    if (wantsCtrl && !isCtrlOrCmd(e))
        return false;
    if (!wantsCtrl && isCtrlOrCmd(e))
        return false;
    if (wantsAlt && !e.altKey)
        return false;
    if (!wantsAlt && e.altKey)
        return false;
    // For keys whose character is itself produced by Shift (e.g. "?" = Shift+/)
    // only enforce the Shift check when explicitly requested in the config.
    const isShiftProducedKey = config.key !== config.key.toLowerCase() ||
        /^[?!@#$%^&*()_+{}|:"<>~]$/.test(config.key);
    if (wantsShift && !e.shiftKey)
        return false;
    if (!wantsShift && e.shiftKey && !isShiftProducedKey)
        return false;
    return true;
}
// Intentionally simpler than matchesShortcut:
// • Only checks required modifiers in one direction (still held?) — releasing a non-required
//   modifier (e.g. Ctrl) while holding the main key should not fire onRelease.
// • Skips isShiftProducedKey — we are tracking physical key state, not re-identifying the combo.
// • Skips allowInInput / allowInDialog / condition — those are keydown entry-point guards;
//   once a hold shortcut has started firing, release is tracked unconditionally.
function isShortcutStillPressed(e, config) {
    // The main key being released means the shortcut is no longer held.
    if (e.key.toLowerCase() === config.key.toLowerCase())
        return false;
    const wantsCtrl = config.ctrl ?? false;
    const wantsShift = config.shift ?? false;
    const wantsAlt = config.alt ?? false;
    if (wantsCtrl && !isCtrlOrCmd(e))
        return false;
    if (wantsShift && !e.shiftKey)
        return false;
    if (wantsAlt && !e.altKey)
        return false;
    return true;
}
function globalKeydownHandler(e) {
    for (const [id, config] of shortcutHandlers) {
        if (!matchesShortcut(e, config))
            continue;
        if (config.condition && !config.condition())
            continue;
        if (!config.allowInInput && isTargetEditable(e))
            continue;
        if (!config.allowInDialog && isInsideDialog(e))
            continue;
        if (config.preventDefault !== false)
            e.preventDefault();
        config.handler?.(e);
        if (config.triggeredOn === 'hold' && !heldShortcuts.has(id)) {
            heldShortcuts.add(id);
            config.onHold?.(e);
        }
        return; // fire first match only
    }
}
function globalKeyupHandler(e) {
    const toRelease = [];
    for (const id of heldShortcuts) {
        const config = shortcutHandlers.get(id);
        if (!config || config.triggeredOn !== 'hold')
            continue;
        if (!isShortcutStillPressed(e, config))
            toRelease.push(id);
    }
    for (const id of toRelease) {
        const config = shortcutHandlers.get(id);
        config?.onRelease?.(e);
        heldShortcuts.delete(id);
    }
}
function attachGlobalListener() {
    // No-op during SSR — registration still works, listeners attach on the
    // first client-side useShortcut call.
    if (typeof document === 'undefined')
        return;
    if (listenerAttached)
        return;
    listenerAttached = true;
    document.addEventListener('keydown', globalKeydownHandler);
    document.addEventListener('keyup', globalKeyupHandler);
}
// ---------------------------------------------------------------------------
// Identity helper for merging duplicate shortcuts in the modal
// ---------------------------------------------------------------------------
function getShortcutMergeIdentity(shortcut) {
    return [
        shortcut.group,
        shortcut.description,
        Boolean(shortcut.ctrl),
        Boolean(shortcut.shift),
        Boolean(shortcut.alt),
    ].join('|');
}
// ---------------------------------------------------------------------------
// formatShortcutLabel — convenience helper for inline display
// ---------------------------------------------------------------------------
const isMacPlatform = typeof navigator !== 'undefined' &&
    (/Mac|iPod|iPhone|iPad/i.test(navigator
        .userAgentData?.platform ?? '') ||
        /Mac OS X|Macintosh/i.test(navigator.userAgent));
/**
 * Returns a short human-readable string for a shortcut, e.g. `"⌘ K"` or
 * `"Ctrl + K"`.
 */
export function formatShortcutLabel(config) {
    const parts = [];
    if (config.ctrl)
        parts.push(isMacPlatform ? '⌘' : 'Ctrl');
    if (config.shift)
        parts.push(isMacPlatform ? '⇧' : 'Shift');
    if (config.alt)
        parts.push(isMacPlatform ? '⌥' : 'Alt');
    const keyMap = {
        arrowup: '↑',
        arrowdown: '↓',
        arrowleft: '←',
        arrowright: '→',
        escape: 'Esc',
        backspace: '⌫',
        delete: 'Del',
        enter: '↵',
        ' ': 'Space',
        '\\': '\\',
        '=': '+',
        '-': '−',
    };
    const displayKey = keyMap[config.key.toLowerCase()] ?? config.key.toUpperCase();
    parts.push(displayKey);
    return parts.join(isMacPlatform ? ' ' : ' + ');
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Register one or more keyboard shortcuts that are automatically cleaned up
 * when the component unmounts (or is deactivated in a `<KeepAlive>` tree).
 *
 * @example
 * ```ts
 * useShortcut([
 *   {
 *     key: 's',
 *     ctrl: true,
 *     description: 'Save',
 *     group: 'General',
 *     handler: () => save(),
 *   },
 *   {
 *     key: 'z',
 *     ctrl: true,
 *     description: 'Undo',
 *     group: 'Edit',
 *     handler: () => undo(),
 *   },
 * ])
 * ```
 */
export function useShortcut(shortcuts) {
    attachGlobalListener();
    const configs = Array.isArray(shortcuts) ? shortcuts : [shortcuts];
    const registeredIds = [];
    for (const config of configs) {
        const id = Symbol(config.description);
        const registered = {
            key: config.key,
            ctrl: config.ctrl ?? false,
            shift: config.shift ?? false,
            alt: config.alt ?? false,
            description: config.description,
            group: config.group ?? 'General',
            id,
            condition: config.condition,
        };
        shortcutHandlers.set(id, config);
        activeShortcuts.push(registered);
        registeredIds.push(id);
    }
    const removeShortcuts = () => {
        for (const id of registeredIds) {
            shortcutHandlers.delete(id);
            heldShortcuts.delete(id);
            const idx = activeShortcuts.findIndex((s) => s.id === id);
            if (idx !== -1)
                activeShortcuts.splice(idx, 1);
        }
    };
    const addShortcuts = () => {
        for (let i = 0; i < configs.length; i++) {
            const id = registeredIds[i];
            if (!shortcutHandlers.has(id)) {
                shortcutHandlers.set(id, configs[i]);
                activeShortcuts.push({
                    key: configs[i].key,
                    ctrl: configs[i].ctrl ?? false,
                    shift: configs[i].shift ?? false,
                    alt: configs[i].alt ?? false,
                    description: configs[i].description,
                    group: configs[i].group ?? 'General',
                    id,
                    condition: configs[i].condition,
                });
            }
        }
    };
    onBeforeUnmount(removeShortcuts);
    onDeactivated(removeShortcuts);
    onActivated(addShortcuts);
    return {
        activeShortcuts: readonly(activeShortcuts),
        formatShortcutLabel,
    };
}
/**
 * Returns a computed ref of all currently active shortcuts whose conditions
 * are met. Duplicate entries (same group + description + modifiers) are merged
 * into a single `ActiveShortcut` with multiple `keys`.
 *
 * Typically consumed by `<KeyboardShortcutsModal>`.
 */
export function getActiveShortcuts() {
    return computed(() => {
        const visible = activeShortcuts.filter((s) => !s.condition || s.condition());
        const merged = new Map();
        for (const shortcut of visible) {
            const identity = getShortcutMergeIdentity(shortcut);
            const existing = merged.get(identity);
            if (!existing) {
                merged.set(identity, { ...shortcut, keys: [shortcut.key] });
                continue;
            }
            if (!existing.keys.some((k) => k.toLowerCase() === shortcut.key.toLowerCase())) {
                existing.keys.push(shortcut.key);
            }
        }
        return [...merged.values()];
    });
}
