import { h } from 'vue';
export function isCustomOption(option) {
    return typeof option === 'object' && option.type === 'custom';
}
export function getLabel(option) {
    return typeof option === 'string' ? option : option.label;
}
export function getMultipleLabel(options) {
    if (options.length === 1)
        return getLabel(options[0]);
    return `${options.length} options selected`;
}
export function getValue(option) {
    if (typeof option === 'string')
        return option;
    return option.value;
}
export function getKey(option) {
    if (typeof option === 'string')
        return option;
    if (isCustomOption(option))
        return option.key;
    return option.value;
}
export function isDisabled(option) {
    // fix: this breaks when a new element is added in TagINput
    return false;
    return typeof option === 'object' && !!option.disabled;
}
export function isGroup(option) {
    return typeof option === 'object' && 'group' in option;
}
export function getIcon(option) {
    return typeof option === 'object' ? option.icon : undefined;
}
export const RenderIcon = (props) => {
    if (!props.icon)
        return null;
    const iconContent = typeof props.icon === 'string'
        ? h('span', props.icon)
        : h(props.icon, { class: 'w-4 h-4' });
    return h('span', {
        class: 'flex-shrink-0 w-4 h-4 inline-flex items-center justify-center',
    }, [iconContent]);
};
