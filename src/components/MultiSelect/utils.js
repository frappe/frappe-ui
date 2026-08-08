import { matchesByLabelOrValue, readGroupOptions, resolveItemSlots, } from '../shared/selection/utils';
export { inputFontSizeClasses, itemClasses, itemRootSizeClasses, toItemListSize, triggerSizeClasses, triggerVariantClasses, } from '../shared/selection/utils';
export { triggerBaseClassesFocusVisible as triggerBaseClasses } from '../shared/selection/utils';
/** Sentinel used to disambiguate options whose value is an empty string. */
export const EMPTY_VALUE_PREFIX = '__frappe_ui_multiselect_empty__:';
export function isGroupedOption(option) {
    return typeof option === 'object' && option !== null && 'group' in option;
}
export function normalizeOption(option) {
    if (!option)
        return null;
    if (option.value === undefined || option.value === null)
        return null;
    return {
        ...option,
        resolvedSlots: resolveItemSlots(option.slots, 'MultiSelect'),
    };
}
export function normalizeMultiSelectOptions(options) {
    const groups = [];
    let pendingUngrouped = [];
    const flushUngrouped = () => {
        if (!pendingUngrouped.length)
            return;
        groups.push({
            key: `__ungrouped__${groups.length}`,
            group: '',
            hideLabel: true,
            options: pendingUngrouped,
        });
        pendingUngrouped = [];
    };
    options.forEach((option, index) => {
        if (!option)
            return;
        if (isGroupedOption(option)) {
            flushUngrouped();
            const normalizedOptions = readGroupOptions(option, 'MultiSelect')
                .map(normalizeOption)
                .filter((item) => Boolean(item));
            if (!normalizedOptions.length)
                return;
            groups.push({
                key: option.key ?? `group-${index}`,
                group: option.group,
                hideLabel: option.hideLabel,
                options: normalizedOptions,
            });
            return;
        }
        const normalized = normalizeOption(option);
        if (normalized)
            pendingUngrouped.push(normalized);
    });
    flushUngrouped();
    return groups;
}
export function matchesOption(item, currentQuery) {
    return matchesByLabelOrValue(item, currentQuery);
}
