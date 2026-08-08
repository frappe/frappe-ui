import DOMPurify from 'dompurify';
import { h, isVNode } from 'vue';
import { toast as sonnerToast } from 'vue-sonner';
import { warnDeprecated } from '../../utils/warnDeprecated';
// Tags that are safe to render inside a toast message. Anything outside this set is stripped by DOMPurify.
const ALLOWED_TAGS = ['a', 'em', 'strong', 'i', 'b', 'u'];
// Sonner renders a string message as plain text and a VNode via
// `<component :is>`. To render safe HTML we sanitize the string and return a
// render function; non-string values (already VNodes/components) pass through.
function renderSafeHTML(message) {
    if (typeof message !== 'string')
        return message;
    const html = DOMPurify.sanitize(message, { ALLOWED_TAGS });
    return () => h('span', { innerHTML: html });
}
const TOAST_DOCS = 'https://ui.frappe.io/docs/components/toast';
function toMs(seconds) {
    if (seconds == null)
        return undefined;
    // Legacy "no timeout" idiom: duration/timeout: 0 meant persistent in
    // reka-ui's Toast.vue (`:duration="closable ? duration : 0"`). Sonner
    // treats 0 as "close immediately", so map it to Infinity.
    if (seconds === 0)
        return Infinity;
    return seconds * 1000;
}
function resolveIcon(icon, iconClasses) {
    if (icon == null)
        return undefined;
    if (typeof icon === 'string') {
        const className = ['lucide-' + icon, 'size-4', iconClasses]
            .filter(Boolean)
            .join(' ');
        return () => h('span', { class: className });
    }
    if (isVNode(icon)) {
        return () => icon;
    }
    return icon;
}
function isLegacyObject(arg) {
    if (!arg || typeof arg !== 'object')
        return false;
    const o = arg;
    return 'title' in o || 'text' in o || 'message' in o;
}
function dispatch(type, message, data) {
    const safeMessage = renderSafeHTML(message);
    switch (type) {
        case 'success':
            return sonnerToast.success(safeMessage, data);
        case 'error':
            return sonnerToast.error(safeMessage, data);
        case 'warning':
            return sonnerToast.warning(safeMessage, data);
        case 'info':
            return sonnerToast.info(safeMessage, data);
        default:
            return sonnerToast(safeMessage, data);
    }
}
function callLegacyObject(o) {
    warnDeprecated(`toast({ title, text })`, `toast(title, { description: text })`, TOAST_DOCS);
    if (o.position) {
        warnDeprecated(`toast({ position })`, `<ToastProvider /> (position is set globally, not per-toast)`, TOAST_DOCS);
    }
    const title = o.title ?? o.message ?? '';
    return dispatch(o.type, title, {
        description: o.text,
        icon: resolveIcon(o.icon, o.iconClasses),
        duration: toMs(o.timeout ?? o.duration),
    });
}
function toastFn(message, options) {
    if (isLegacyObject(message)) {
        return callLegacyObject(message);
    }
    return sonnerToast(renderSafeHTML(message), options);
}
function create(options) {
    warnDeprecated(`toast.create({ message, type })`, `toast.success(message) / toast.error(message) / toast(message)`, TOAST_DOCS);
    const { message, type, icon, duration, action, closable, id } = options;
    // closable: false in reka-ui meant fully locked: no × button, no
    // auto-dismiss, no user interaction. Sonner splits those into three
    // separate flags — preserve all three so the helpdesk loading-indicator
    // pattern can't be swiped away or click-dismissed.
    return dispatch(type, message, {
        id,
        duration: closable === false ? Infinity : toMs(duration),
        action,
        icon: resolveIcon(icon),
        closeButton: closable,
        dismissible: closable !== false,
    });
}
function remove(id) {
    warnDeprecated(`toast.remove(id)`, `toast.dismiss(id)`, TOAST_DOCS);
    return sonnerToast.dismiss(id);
}
function removeAll() {
    warnDeprecated(`toast.removeAll()`, `toast.dismiss()`, TOAST_DOCS);
    return sonnerToast.dismiss();
}
export const toast = Object.assign(toastFn, sonnerToast, {
    success: (message, data) => dispatch('success', message, data),
    error: (message, data) => dispatch('error', message, data),
    warning: (message, data) => dispatch('warning', message, data),
    info: (message, data) => dispatch('info', message, data),
    create,
    remove,
    removeAll,
});
