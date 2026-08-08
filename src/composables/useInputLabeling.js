import { computed } from 'vue';
import { useId } from '../utils/useId';
export function useInputLabeling(props, options = {}) {
    const fallbackId = useId();
    const inputId = computed(() => props.id ?? fallbackId);
    const labelId = computed(() => `${inputId.value}-label`);
    const descriptionId = computed(() => `${inputId.value}-description`);
    const errorMessageId = computed(() => `${inputId.value}-error`);
    const hasError = computed(() => {
        const e = props.error;
        if (e == null)
            return false;
        if (typeof e === 'string')
            return e.length > 0;
        return Boolean(e.message || (e.messages && e.messages.length));
    });
    const errorLines = computed(() => {
        const e = props.error;
        if (!e)
            return [];
        if (typeof e === 'string')
            return [e];
        if (e.messages && e.messages.length)
            return e.messages.slice();
        return e.message ? [e.message] : [];
    });
    const showDescription = computed(() => {
        return Boolean(props.description) && !hasError.value;
    });
    const describedBy = computed(() => {
        const ids = [];
        if (showDescription.value)
            ids.push(descriptionId.value);
        if (hasError.value)
            ids.push(errorMessageId.value);
        return ids.length ? ids.join(' ') : undefined;
    });
    const labelledBy = computed(() => {
        return props.label ? labelId.value : undefined;
    });
    const dataAttrs = computed(() => {
        const size = options.size?.();
        const variant = options.variant?.();
        const disabled = options.disabled?.();
        const explicitState = options.state?.();
        const state = hasError.value ? 'invalid' : (explicitState ?? 'valid');
        const attrs = {
            'data-state': state,
        };
        if (size)
            attrs['data-size'] = size;
        if (variant)
            attrs['data-variant'] = variant;
        if (disabled)
            attrs['data-disabled'] = 'true';
        if (props.required)
            attrs['data-required'] = 'true';
        return attrs;
    });
    return {
        inputId,
        labelId,
        descriptionId,
        errorMessageId,
        labelledBy,
        describedBy,
        hasError,
        errorLines,
        showDescription,
        dataAttrs,
    };
}
