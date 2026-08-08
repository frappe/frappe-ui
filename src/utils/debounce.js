export default function debounce(func, wait, immediate) {
    let timeout;
    const debounced = function (...args) {
        const context = this;
        const later = function () {
            timeout = undefined;
            if (!immediate)
                func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
    debounced.cancel = () => {
        clearTimeout(timeout);
        timeout = undefined;
    };
    return debounced;
}
