import { toValue } from 'vue';
/**
 * Maps options whose value is the empty string to a synthetic internal value.
 *
 * Reka's Select / Combobox primitives forbid `""` as an item value (it's
 * reserved for "no selection"). To support consumer options with
 * `value: ""`, we generate a stable internal value of the form
 * `${prefix}${indexInList}` and translate back when the value crosses the
 * boundary between Reka and the consumer.
 *
 * Disambiguation is internal only: every empty-string option gets a unique
 * synthetic value (so Reka sees distinct items), but `toExternal` always
 * resolves a synthetic back to `""`. Consumers cannot distinguish multiple
 * empty-string options from each other — and never could.
 */
export function useEmptyValueMapping(allOptions, prefix) {
    function toInternal(option) {
        if (option.value !== '')
            return option.value;
        return `${prefix}${toValue(allOptions).indexOf(option)}`;
    }
    function toExternal(internalValue) {
        return (toValue(allOptions).find((opt) => toInternal(opt) === internalValue)
            ?.value ?? internalValue);
    }
    return { toInternal, toExternal };
}
