import { matchesByLabelOrValue, readGroupOptions, resolveItemSlots, } from '../shared/selection/utils';
export { inputFontSizeClasses, itemClasses, itemRootSizeClasses, toItemListSize, triggerSizeClasses, triggerVariantClasses, } from '../shared/selection/utils';
export { triggerBaseClassesFocusWithin as triggerBaseClasses } from '../shared/selection/utils';
/** Sentinel value used internally — never exposed to consumers. */
export const EMPTY_SELECTABLE_VALUE_PREFIX = '__frappe_ui_combobox_empty__:';
export function isGroupedOption(option) {
    return typeof option === 'object' && option !== null && 'group' in option;
}
export function isCustomOption(item) {
    return item.type === 'custom';
}
export function isSelectableOption(item) {
    return item.type === 'option';
}
export function normalizeSimpleOption(option) {
    if (!option)
        return null;
    if (typeof option === 'string') {
        return {
            type: 'option',
            label: option,
            value: option,
            resolvedSlots: {},
        };
    }
    if (option.type === 'custom') {
        return {
            ...option,
            type: 'custom',
            resolvedSlots: resolveItemSlots(option.slots, 'Combobox'),
        };
    }
    if (option.value === undefined || option.value === null) {
        return null;
    }
    return {
        ...option,
        type: 'option',
        resolvedSlots: resolveItemSlots(option.slots, 'Combobox'),
    };
}
export function normalizeComboboxOptions(options) {
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
        if (isGroupedOption(option)) {
            flushUngrouped();
            const normalizedOptions = readGroupOptions(option, 'Combobox')
                .map(normalizeSimpleOption)
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
        const normalizedOption = normalizeSimpleOption(option);
        if (normalizedOption) {
            pendingUngrouped.push(normalizedOption);
        }
    });
    flushUngrouped();
    return groups;
}
export function matchesSelectableOption(item, currentQuery) {
    return matchesByLabelOrValue(item, currentQuery);
}
/**
 * Consumer-declared visibility for a `type: 'custom'` row.
 *
 * `condition` is authoritative and runs even before the user has typed, so a
 * custom row can gate itself on selection state. It is NOT client filtering,
 * which is why `filterable: false` does not switch it off.
 */
export function customOptionIsVisible(item, currentQuery) {
    if (!item.condition)
        return true;
    return item.condition(buildCustomOptionContext(currentQuery));
}
/**
 * Client-side query filter for custom rows that declare no `condition`.
 *
 * This is ordinary substring filtering, so it runs on the same path as
 * selectable rows and is disabled by `filterable: false` — otherwise a
 * server-search combobox would silently lose its condition-less action rows.
 * Rows that declare a `condition` opt out entirely: `condition` already
 * decided, and filtering again would override it.
 */
export function matchesCustomOption(item, currentQuery) {
    if (item.condition)
        return true;
    if (!currentQuery)
        return true;
    return item.label.toLowerCase().includes(currentQuery.toLowerCase());
}
export function buildCustomOptionContext(query) {
    return { query };
}
export const inputClasses = 'min-w-0 flex-1 border-0 bg-transparent p-0 text-ink-gray-8 outline-none ring-0 placeholder:text-ink-gray-4 focus:border-0 focus:outline-none focus:ring-0';
