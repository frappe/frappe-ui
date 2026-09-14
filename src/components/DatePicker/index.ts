export { default as DatePicker } from './DatePicker.vue'
export { default as DateRangePicker } from './DateRangePicker.vue'
export { default as DateTimePicker } from './DateTimePicker.vue'

/**
 * Named one by one, not `export *`: the wildcard published every type
 * `types.ts` happened to export, including `DatePickerViewMode` and
 * `DatePickerDateObj`, which describe the calendar's internals
 * (PHILOSOPHY.md, P15). Both stay internal.
 */
export type {
  PopoverAlign,
  PopoverSide,
  CommonDatePickerProps,
  DatePickerProps,
  DatePickerEmits,
  DatePickerSlots,
  DatePickerTriggerSlotProps,
  DatePickerActionsSlotProps,
  DateRangePickerProps,
  DateRangePickerEmits,
  DateRangePickerSlots,
  DateRangePickerActionsSlotProps,
  DateRangeValue,
  DateTimePickerProps,
  DateTimePickerEmits,
  DateTimePickerSlots,
  DateTimePickerActionsSlotProps,
} from './types'
