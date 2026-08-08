import { defineComponent, h, reactive, ref, } from 'vue';
import Dialog from '../components/Dialog/Dialog.vue';
import { Button } from '../components/Button';
import FormControl from '../components/FormControl/FormControl.vue';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage.vue';
export const dialogs = ref([]);
let nextId = 0;
function add(component) {
    const id = nextId++;
    dialogs.value = [...dialogs.value, { id, component }];
    return id;
}
function remove(id) {
    dialogs.value = dialogs.value.filter((d) => d.id !== id);
}
// -- Theme helpers -------------------------------------------------------
const THEME_DEFAULT_ICON = {
    red: 'lucide-alert-triangle',
    yellow: 'lucide-alert-triangle',
    blue: 'lucide-info',
    green: 'lucide-check-circle',
};
function themeToButtonTheme(theme) {
    if (!theme)
        return undefined;
    // Button doesn't have `yellow`; fall back to default solid (no theme).
    if (theme === 'yellow')
        return undefined;
    return theme;
}
function resolveIcon(theme, icon) {
    if (icon) {
        if (typeof icon === 'string')
            return { name: icon, theme };
        return { ...icon, theme: icon.theme ?? theme };
    }
    if (theme)
        return { name: THEME_DEFAULT_ICON[theme], theme };
    return undefined;
}
// Flips the dialog's `open` flag (idempotent). The instance is removed from
// the active list by the Dialog overlay's `after-leave` callback.
function makeClose(state) {
    let closed = false;
    return () => {
        if (closed)
            return;
        closed = true;
        state.open = false;
        state.loading = false;
    };
}
// Returns a stable callback that updates the dialog's inline error message
// and clears the loading state so action buttons re-enable.
function makeSetError(state) {
    return (message) => {
        state.error = message || '';
        state.loading = false;
    };
}
// Best-effort extraction of a user-facing error message. Frappe errors
// typically expose a `messages: string[]` array; fall back to `.message`
// and finally a generic string so we never crash on a bad reject value.
function extractErrorMessage(err) {
    if (err == null)
        return 'Something went wrong';
    if (typeof err === 'string')
        return err;
    const e = err;
    if (Array.isArray(e.messages) && typeof e.messages[0] === 'string') {
        return e.messages[0];
    }
    if (typeof e.message === 'string' && e.message)
        return e.message;
    return 'Something went wrong';
}
// -- confirm -------------------------------------------------------------
// Wraps a `DialogAction.onClick` so each button tracks its own loading state.
// Awaits the user-supplied handler, auto-closes on success, and surfaces
// thrown errors inline via the shared `setError` channel (which also resets
// every button's loading flag).
function makeActionRunner(action, state, actionStates, index, close, setError, isAnyLoading) {
    return async () => {
        if (isAnyLoading())
            return;
        if (!action.onClick) {
            close();
            return;
        }
        actionStates[index].loading = true;
        state.error = '';
        try {
            await action.onClick({ close, setError });
            close();
        }
        catch (err) {
            setError(extractErrorMessage(err));
        }
        finally {
            actionStates[index].loading = false;
        }
    };
}
export function confirm(args) {
    const state = reactive({
        open: true,
        loading: false,
        error: '',
    });
    let assignedId = -1;
    const close = makeClose(state);
    const setError = makeSetError(state);
    // Per-action loading state — only used when `args.actions` is set. Kept in
    // a parallel array so we can mutate without cloning the user's action defs.
    const actionStates = reactive((args.actions ?? []).map(() => ({ loading: false })));
    const isAnyLoading = () => state.loading || actionStates.some((s) => s.loading);
    const onConfirm = async () => {
        if (state.loading)
            return;
        if (!args.onConfirm) {
            close();
            return;
        }
        state.loading = true;
        state.error = '';
        try {
            await args.onConfirm({ close, setError });
            close();
        }
        catch (err) {
            setError(extractErrorMessage(err));
        }
    };
    const onCancel = () => {
        if (isAnyLoading())
            return;
        close();
        args.onCancel?.();
    };
    const dismissible = args.dismissible !== false;
    const resolvedIcon = resolveIcon(args.theme, args.icon);
    const buttonTheme = themeToButtonTheme(args.theme);
    const renderActions = () => {
        if (args.actions && args.actions.length > 0) {
            // Custom actions: render in author-supplied order. Each button locks
            // out the others while its own onClick is pending.
            return h('div', { class: 'flex justify-end gap-2' }, args.actions.map((action, index) => {
                const { onClick: _omit, ...buttonProps } = action;
                return h(Button, {
                    ...buttonProps,
                    key: action.label ?? index,
                    loading: actionStates[index].loading,
                    disabled: isAnyLoading() && !actionStates[index].loading,
                    onClick: makeActionRunner(action, state, actionStates, index, close, setError, isAnyLoading),
                });
            }));
        }
        return h('div', { class: 'flex flex-row-reverse gap-2' }, [
            h(Button, {
                label: args.confirmLabel || 'Confirm',
                variant: 'solid',
                theme: buttonTheme,
                loading: state.loading,
                onClick: onConfirm,
            }),
            h(Button, {
                label: args.cancelLabel || 'Cancel',
                variant: 'outline',
                disabled: state.loading,
                onClick: onCancel,
            }),
        ]);
    };
    const component = defineComponent({
        name: 'ImperativeConfirmDialog',
        setup() {
            return () => h(Dialog, {
                open: state.open,
                'onUpdate:open': (val) => {
                    if (!val)
                        onCancel();
                },
                title: args.title,
                icon: resolvedIcon,
                size: args.size || 'md',
                dismissible,
                showCloseButton: dismissible,
                onAfterLeave: () => remove(assignedId),
            }, {
                default: () => h('div', { class: 'space-y-2' }, [
                    args.message
                        ? h('p', { class: 'text-p-base text-ink-gray-7' }, args.message)
                        : null,
                    state.error ? h(ErrorMessage, { message: state.error }) : null,
                ]),
                actions: renderActions,
            });
        },
    });
    assignedId = add(component);
    return { close };
}
// -- prompt --------------------------------------------------------------
// Initial value for a prompt field. Checkbox defaults to false; everything
// else (text/textarea/select/combobox) defaults to an empty string so the
// `required` check has something concrete to compare against.
function initialFieldValue(field) {
    if (field.defaultValue !== undefined)
        return field.defaultValue;
    return field.type === 'checkbox' ? false : '';
}
// Labels a query could already match, flattened across grouped and flat
// options. Custom rows are skipped — they are affordances, not values.
function selectableLabels(options = []) {
    return options.flatMap((option) => {
        if (typeof option === 'string')
            return [option];
        if (!option || typeof option !== 'object')
            return [];
        if ('group' in option)
            return selectableLabels(option.options);
        if (option.type === 'custom')
            return [];
        return [String(option.label ?? option.value ?? '')];
    });
}
// `allowCreate` is a create-new custom row, the same shape any consumer would
// write by hand. `condition` hides it once the query matches an existing
// option, and `onClick` commits the typed text as the field's value.
function createNewOption(options, commit) {
    const existing = selectableLabels(options).map((label) => label.toLowerCase());
    return {
        type: 'custom',
        key: '__create__',
        label: 'Create',
        slot: 'create',
        condition: ({ query }) => {
            const trimmed = query.trim();
            return Boolean(trimmed) && !existing.includes(trimmed.toLowerCase());
        },
        onClick: ({ query }) => {
            const trimmed = query.trim();
            if (trimmed)
                commit(trimmed);
        },
    };
}
export function prompt(args) {
    const state = reactive({
        open: true,
        loading: false,
        error: '',
    });
    let assignedId = -1;
    const close = makeClose(state);
    const setError = makeSetError(state);
    const values = reactive(Object.fromEntries(args.fields.map((f) => [f.name, initialFieldValue(f)])));
    // Per-field error messages, keyed by field name. Populated by `validate`
    // hooks; cleared whenever the user edits the corresponding field.
    const fieldErrors = reactive({});
    // Required-field check. Returns the first failing field name so we can
    // highlight it inline rather than throwing a generic error.
    const checkRequired = () => {
        for (const f of args.fields) {
            if (!f.required)
                continue;
            if (f.type === 'checkbox')
                continue;
            const v = values[f.name];
            if (v == null || v === '')
                return f.name;
        }
        return null;
    };
    // Runs every field's `validate` in parallel. Mutates `fieldErrors` and
    // returns true when every validator passed.
    const runValidators = async () => {
        const snapshot = { ...values };
        const results = await Promise.all(args.fields.map(async (f) => {
            if (!f.validate)
                return { name: f.name, error: null };
            try {
                const result = await f.validate(values[f.name], snapshot);
                return { name: f.name, error: result || null };
            }
            catch (err) {
                return { name: f.name, error: extractErrorMessage(err) };
            }
        }));
        let ok = true;
        for (const { name, error } of results) {
            if (error) {
                fieldErrors[name] = error;
                ok = false;
            }
            else {
                delete fieldErrors[name];
            }
        }
        return ok;
    };
    const onSubmit = async () => {
        if (state.loading)
            return;
        const missing = checkRequired();
        if (missing) {
            // Match the previous behavior — silently no-op so HTML5 required UI
            // can take over via the underlying FormControl.
            return;
        }
        state.loading = true;
        state.error = '';
        try {
            const valid = await runValidators();
            if (!valid) {
                state.loading = false;
                return;
            }
            await args.onConfirm({ values: { ...values }, close, setError });
            close();
        }
        catch (err) {
            setError(extractErrorMessage(err));
        }
    };
    const onCancel = () => {
        close();
        args.onCancel?.();
    };
    const dismissible = args.dismissible !== false;
    const resolvedIcon = resolveIcon(args.theme, args.icon);
    const buttonTheme = themeToButtonTheme(args.theme);
    const renderField = (field) => {
        const onUpdate = (val) => {
            values[field.name] = val;
            // Clear the stale error the moment the user edits the field.
            if (fieldErrors[field.name])
                delete fieldErrors[field.name];
        };
        // Combobox-only knobs are forwarded as fallthrough attrs; FormControl
        // re-emits them onto the underlying <Combobox> via `controlAttrs`.
        const comboboxAttrs = field.type === 'combobox' ? { openOnClick: true } : null;
        const allowCreate = field.type === 'combobox' && field.allowCreate;
        const options = allowCreate
            ? [...field.options, createNewOption(field.options, onUpdate)]
            : field.options;
        const modelValue = field.type === 'combobox'
            ? values[field.name] || null
            : values[field.name];
        const fieldNode = h(FormControl, {
            label: field.label,
            description: field.description,
            type: field.type || 'text',
            required: field.required,
            placeholder: field.placeholder,
            options,
            modelValue,
            'onUpdate:modelValue': onUpdate,
            ...comboboxAttrs,
        }, 
        // FormControl forwards every slot to the control, so this reaches the
        // create row and lets it echo what the user typed.
        allowCreate
            ? {
                'item-create': ({ query }) => h('span', { class: 'truncate' }, `Create "${query}"`),
            }
            : undefined);
        return h('div', { key: field.name, class: 'space-y-1' }, [
            fieldNode,
            fieldErrors[field.name]
                ? h(ErrorMessage, { message: fieldErrors[field.name] })
                : null,
        ]);
    };
    const component = defineComponent({
        name: 'ImperativePromptDialog',
        setup() {
            return () => h(Dialog, {
                open: state.open,
                'onUpdate:open': (val) => {
                    if (!val)
                        onCancel();
                },
                title: args.title,
                icon: resolvedIcon,
                size: args.size || 'md',
                dismissible,
                showCloseButton: dismissible,
                onAfterLeave: () => remove(assignedId),
            }, {
                default: () => h('div', { class: 'space-y-3' }, [
                    args.message
                        ? h('p', { class: 'text-p-base text-ink-gray-7' }, args.message)
                        : null,
                    ...args.fields.map(renderField),
                    state.error ? h(ErrorMessage, { message: state.error }) : null,
                ]),
                actions: () => h('div', { class: 'flex flex-row-reverse gap-2' }, [
                    h(Button, {
                        label: args.confirmLabel || 'Submit',
                        variant: 'solid',
                        theme: buttonTheme,
                        loading: state.loading,
                        onClick: onSubmit,
                    }),
                    h(Button, {
                        label: args.cancelLabel || 'Cancel',
                        variant: 'outline',
                        disabled: state.loading,
                        onClick: onCancel,
                    }),
                ]),
            });
        },
    });
    assignedId = add(component);
    return { close };
}
/**
 * Destructive confirm preset. Forces `theme: 'red'`, defaults the icon to
 * `lucide-alert-triangle`, and defaults `confirmLabel` to `'Delete'`. Use
 * for irreversible actions like deleting, revoking, or discarding data.
 *
 * Everything else (actions[], dismissible, onCancel, …) works identically
 * to `confirm`.
 */
export function danger(args) {
    return confirm({
        ...args,
        theme: 'red',
        confirmLabel: args.confirmLabel ?? 'Delete',
    });
}
// -- namespace -----------------------------------------------------------
export const dialog = {
    confirm,
    prompt,
    danger,
};
