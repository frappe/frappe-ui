import { ay as _export_sfc, az as defineComponent, bl as toRefs, aA as ref, b5 as watch, aO as computed, aD as openBlock, aE as createBlock, aF as withCtx, aP as renderSlot, be as normalizeProps, bf as guardReactiveProps, aH as createVNode, aQ as normalizeClass, bm as withKeys, b0 as withModifiers, bn as createSlots, aI as createBaseVNode, aS as createCommentVNode, aL as createElementBlock, aJ as toDisplayString, aV as Fragment, aU as renderList, aB as reactive, aC as resolveComponent, aW as mergeProps } from "./vendor-Dk9TTFVx.js";
import { g as generateWeeks, a as getDateValue, m as months, b as monthStart, D as DatePicker } from "./DatePicker-El9My7pc.js";
import { F as FeatherIcon } from "./FeatherIcon-CrfXch0X.js";
import { T as TimePicker } from "./TimePicker-KC3ucFnk.js";
import { d as dayjs, a as dayjsLocal, b as dayjsSystem } from "./dayjs-c4IbIG22.js";
import { _ as __unplugin_components_1 } from "./Popover-7Q5QnbUw.js";
import { B as Button } from "./Button-BH7iXttv.js";
import { T as TextInput } from "./TextInput-Bb6lzC96.js";
import "./debounce-CRCtzhPg.js";
const DATE_FORMAT$1 = "YYYY-MM-DD";
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DateTimePicker",
  props: {
    value: { type: String, required: false, default: "" },
    modelValue: { type: String, required: false, default: "" },
    placement: { type: String, required: false, default: "bottom-start" },
    format: { type: String, required: false },
    variant: { type: String, required: false, default: "subtle" },
    readonly: { type: Boolean, required: false, default: false },
    placeholder: { type: String, required: false, default: "Select date & time" },
    inputClass: { type: [String, Array, Object], required: false },
    allowCustom: { type: Boolean, required: false, default: true },
    autoClose: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false, default: false },
    label: { type: String, required: false },
    clearable: { type: Boolean, required: false, default: true },
    minDateTime: { type: String, required: false },
    maxDateTime: { type: String, required: false },
    allowCustomTime: { type: Boolean, required: false, default: true }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { autoClose } = toRefs(props);
    const view = ref("date");
    const currentYear = ref(dayjs().year());
    const currentMonth = ref(dayjs().month());
    const selectedDate = ref("");
    const timeValue = ref("");
    const initialValue = ref(props.modelValue || props.value || "");
    function coerceDateTime(val) {
      if (!val) return null;
      const raw = String(val).trim();
      if (!raw) return null;
      if (props.format) {
        const dStrict = dayjs(raw, props.format, true);
        if (dStrict.isValid()) return dStrict;
      }
      const dLoose = dayjsLocal(raw);
      if (dLoose.isValid()) return dLoose;
      const normalized = getDateValue(raw);
      if (normalized) {
        const dNorm = dayjsLocal(normalized);
        if (dNorm.isValid()) return dNorm;
      }
      return null;
    }
    function syncFromValue(val) {
      if (!val) {
        if (!props.clearable) {
          const now = dayjsLocal();
          currentYear.value = now.year();
          currentMonth.value = now.month();
          selectedDate.value = now.format(DATE_FORMAT$1);
          timeValue.value = now.format("HH:mm:ss");
        } else {
          selectedDate.value = "";
          timeValue.value = "";
        }
        return;
      }
      const d = coerceDateTime(val);
      if (!d) {
        selectedDate.value = "";
        timeValue.value = "";
        return;
      }
      currentYear.value = d.year();
      currentMonth.value = d.month();
      selectedDate.value = d.format(DATE_FORMAT$1);
      timeValue.value = d.format("HH:mm:ss");
    }
    syncFromValue(initialValue.value);
    function initFromValue() {
      syncFromValue(props.modelValue || props.value);
    }
    watch(
      () => [props.modelValue, props.value],
      ([m, v]) => {
        const val = m || v;
        syncFromValue(val);
      }
    );
    const combinedValue = computed(() => {
      if (!selectedDate.value) return "";
      const base = `${selectedDate.value} ${timeValue.value || "00:00:00"}`;
      const local = dayjs(base);
      if (!local.isValid()) return "";
      return local.format(DATE_TIME_FORMAT);
    });
    const displayLabel = computed(() => {
      if (!combinedValue.value) return "";
      if (props.format) return dayjs(combinedValue.value).format(props.format);
      return combinedValue.value;
    });
    const inputValue = ref(displayLabel.value);
    const isTyping = ref(false);
    watch(displayLabel, (val) => {
      if (!isTyping.value) inputValue.value = val;
    });
    function maybeClose(togglePopover, condition = true) {
      if (condition && autoClose.value && togglePopover) togglePopover();
    }
    function clearSelection() {
      if (!selectedDate.value && !timeValue.value) return;
      selectedDate.value = "";
      timeValue.value = "";
      emit("update:modelValue", "");
      emit("change", "");
      initialValue.value = "";
      inputValue.value = "";
    }
    function commitInput(close = false, togglePopover) {
      const raw = inputValue.value.trim();
      if (!raw) {
        if (!props.clearable) {
          const now = dayjsLocal();
          selectDate(now);
          timeValue.value = now.format("HH:mm:ss");
          emitChange();
          maybeClose(togglePopover, close);
        } else {
          clearSelection();
          maybeClose(togglePopover, close);
        }
        return;
      }
      const parsed = coerceDateTime(raw);
      if (parsed) {
        selectDate(parsed);
        timeValue.value = parsed.format("HH:mm:ss");
        emitChange();
        maybeClose(togglePopover, close);
      }
    }
    const popoverContentRef = ref(null);
    function onBlur(e) {
      var _a;
      const next2 = e.relatedTarget;
      if (next2 && ((_a = popoverContentRef.value) == null ? void 0 : _a.contains(next2))) return;
      commitInput();
      isTyping.value = false;
    }
    function onEnter(togglePopover) {
      commitInput(true, togglePopover);
      isTyping.value = false;
    }
    function activateInput(isOpen, togglePopover) {
      isTyping.value = true;
      if (!isOpen) togglePopover();
    }
    const minDT = computed(
      () => props.minDateTime ? coerceDateTime(props.minDateTime) : null
    );
    const maxDT = computed(
      () => props.maxDateTime ? coerceDateTime(props.maxDateTime) : null
    );
    function dateDisabled(d) {
      if (minDT.value && d.endOf("day").isBefore(minDT.value)) return true;
      if (maxDT.value && d.startOf("day").isAfter(maxDT.value)) return true;
      return false;
    }
    const weeks = computed(() => {
      const base = generateWeeks(
        currentYear.value,
        currentMonth.value,
        selectedDate.value
      );
      return base.map(
        (week) => week.map((obj) => ({ ...obj, disabled: dateDisabled(obj.date) }))
      );
    });
    const computedMinTime = computed(() => {
      if (!minDT.value || !selectedDate.value) return "";
      if (dayjs(selectedDate.value).isSame(minDT.value, "day"))
        return minDT.value.format("HH:mm:ss");
      return "";
    });
    const computedMaxTime = computed(() => {
      if (!maxDT.value || !selectedDate.value) return "";
      if (dayjs(selectedDate.value).isSame(maxDT.value, "day"))
        return maxDT.value.format("HH:mm:ss");
      return "";
    });
    watch([computedMinTime, computedMaxTime, timeValue, selectedDate], () => {
      if (!selectedDate.value || !timeValue.value) return;
      const cur = dayjs(`${selectedDate.value} ${timeValue.value}`);
      if (minDT.value && cur.isBefore(minDT.value))
        timeValue.value = computedMinTime.value || timeValue.value;
      if (maxDT.value && cur.isAfter(maxDT.value))
        timeValue.value = computedMaxTime.value || timeValue.value;
    });
    function selectDate(date) {
      const d = dayjs(date);
      if (!d.isValid()) return;
      if (dateDisabled(d)) return;
      selectedDate.value = d.format(DATE_FORMAT$1);
      currentYear.value = d.year();
      currentMonth.value = d.month();
    }
    function selectMonth(i) {
      currentMonth.value = i;
      view.value = "date";
    }
    function selectYear(y) {
      currentYear.value = y;
      view.value = "month";
    }
    function prev() {
      if (view.value === "date") {
        const m = monthStart(currentYear.value, currentMonth.value).subtract(
          1,
          "month"
        );
        currentYear.value = m.year();
        currentMonth.value = m.month();
      } else if (view.value === "month") currentYear.value -= 1;
      else currentYear.value -= 12;
    }
    function next() {
      if (view.value === "date") {
        const m = monthStart(currentYear.value, currentMonth.value).add(1, "month");
        currentYear.value = m.year();
        currentMonth.value = m.month();
      } else if (view.value === "month") currentYear.value += 1;
      else currentYear.value += 12;
    }
    function handleDateCellClick(date, togglePopover) {
      selectDate(date);
      emitChange(true, togglePopover);
      isTyping.value = false;
      view.value = "date";
    }
    function onTimeChange(val) {
      timeValue.value = val;
      isTyping.value = false;
      if (selectedDate.value) emitChange();
    }
    function emitChange(close = false, togglePopover) {
      if (!selectedDate.value) {
        clearSelection();
        return;
      }
      const localDateTime = combinedValue.value;
      const systemDateTime = dayjsSystem(localDateTime).format(DATE_TIME_FORMAT);
      if (systemDateTime !== initialValue.value) {
        emit("update:modelValue", systemDateTime);
        emit("change", systemDateTime);
        initialValue.value = systemDateTime;
      }
      if (!isTyping.value) inputValue.value = displayLabel.value;
      maybeClose(togglePopover, close);
    }
    function handleNowClick(togglePopover) {
      const now = dayjsLocal();
      selectDate(now);
      timeValue.value = now.format("HH:mm:ss");
      emitChange(true, togglePopover);
      isTyping.value = false;
    }
    function handleTomorrowClick() {
      const tomorrow = dayjsLocal().add(1, "day");
      selectDate(tomorrow);
      if (!timeValue.value) timeValue.value = dayjsLocal().format("HH:mm:ss");
      emitChange();
      isTyping.value = false;
    }
    function handleClearClick(togglePopover) {
      clearSelection();
      maybeClose(togglePopover);
      isTyping.value = false;
      view.value = "date";
    }
    function cycleView() {
      if (view.value === "date") view.value = "month";
      else if (view.value === "month") view.value = "year";
      else view.value = "date";
    }
    function handleClose() {
      view.value = "date";
      if (isTyping.value) {
        commitInput();
        isTyping.value = false;
      }
    }
    const yearRangeStart = computed(
      () => currentYear.value - currentYear.value % 12
    );
    const yearRange = computed(
      () => Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i)
    );
    const __returned__ = { props, emit, autoClose, view, currentYear, currentMonth, DATE_FORMAT: DATE_FORMAT$1, DATE_TIME_FORMAT, selectedDate, timeValue, initialValue, coerceDateTime, syncFromValue, initFromValue, combinedValue, displayLabel, inputValue, isTyping, maybeClose, clearSelection, commitInput, popoverContentRef, onBlur, onEnter, activateInput, minDT, maxDT, dateDisabled, weeks, computedMinTime, computedMaxTime, selectDate, selectMonth, selectYear, prev, next, handleDateCellClick, onTimeChange, emitChange, handleNowClick, handleTomorrowClick, handleClearClick, cycleView, handleClose, yearRangeStart, yearRange, get Popover() {
      return __unplugin_components_1;
    }, get Button() {
      return Button;
    }, get TextInput() {
      return TextInput;
    }, FeatherIcon, TimePicker, get months() {
      return months;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = {
  ref: "popoverContentRef",
  class: "w-fit min-w-60 select-none text-base text-ink-gray-9 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 mt-2"
};
const _hoisted_2$2 = { class: "flex items-center justify-between p-2 pb-0 gap-1" };
const _hoisted_3$2 = { key: 0 };
const _hoisted_4$1 = { key: 1 };
const _hoisted_5$1 = { key: 2 };
const _hoisted_6$1 = { class: "flex items-center" };
const _hoisted_7$1 = { class: "p-2" };
const _hoisted_8$1 = {
  key: 0,
  role: "grid",
  "aria-label": "Calendar dates"
};
const _hoisted_9$1 = { class: "flex items-center text-xs font-medium uppercase text-ink-gray-4 mb-1" };
const _hoisted_10$1 = ["aria-selected", "aria-label", "disabled", "onClick"];
const _hoisted_11$1 = {
  key: 1,
  class: "grid grid-cols-3 gap-1",
  role: "grid",
  "aria-label": "Select month"
};
const _hoisted_12$1 = ["aria-selected", "onClick"];
const _hoisted_13$1 = {
  key: 2,
  class: "grid grid-cols-3 gap-1",
  role: "grid",
  "aria-label": "Select year"
};
const _hoisted_14$1 = ["aria-selected", "onClick"];
const _hoisted_15$1 = { class: "flex flex-col gap-2 p-2 pt-0" };
const _hoisted_16 = {
  key: 0,
  class: "flex items-center justify-between gap-1 p-2 border-t"
};
const _hoisted_17 = { class: "flex gap-1" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    class: "inline-block",
    placement: $props.placement,
    onOpen: $setup.initFromValue,
    onClose: $setup.handleClose
  }, {
    target: withCtx(({ togglePopover, isOpen }) => [
      renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({ togglePopover, isOpen, displayLabel: $setup.displayLabel, inputValue: $setup.inputValue })), () => [
        createVNode($setup["TextInput"], {
          modelValue: $setup.inputValue,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
          type: "text",
          class: normalizeClass(["cursor-text w-full", $setup.props.inputClass]),
          label: $setup.props.label,
          variant: $setup.props.variant,
          placeholder: $setup.props.placeholder || "Select date & time",
          disabled: $setup.props.disabled,
          readonly: $setup.props.readonly || !$setup.props.allowCustom,
          onFocus: ($event) => $setup.activateInput(isOpen, togglePopover),
          onClick: ($event) => $setup.activateInput(isOpen, togglePopover),
          onBlur: $setup.onBlur,
          onKeydown: withKeys(withModifiers(($event) => $setup.onEnter(togglePopover), ["prevent"]), ["enter"])
        }, createSlots({
          suffix: withCtx(() => [
            renderSlot(_ctx.$slots, "suffix", normalizeProps(guardReactiveProps({ togglePopover, isOpen, displayLabel: $setup.displayLabel, inputValue: $setup.inputValue })), () => [
              createVNode($setup["FeatherIcon"], {
                name: "chevron-down",
                class: "h-4 w-4 cursor-pointer",
                onMousedown: withModifiers(togglePopover, ["prevent"])
              }, null, 8, ["onMousedown"])
            ])
          ]),
          _: 2
          /* DYNAMIC */
        }, [
          _ctx.$slots.prefix ? {
            name: "prefix",
            fn: withCtx(() => [
              renderSlot(_ctx.$slots, "prefix", normalizeProps(guardReactiveProps({ togglePopover, isOpen, displayLabel: $setup.displayLabel, inputValue: $setup.inputValue })))
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["modelValue", "class", "label", "variant", "placeholder", "disabled", "readonly", "onFocus", "onClick", "onKeydown"])
      ])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode(
        "div",
        _hoisted_1$2,
        [
          createCommentVNode(" Header (Month/Year navigation) "),
          createBaseVNode("div", _hoisted_2$2, [
            createVNode($setup["Button"], {
              variant: "ghost",
              size: "sm",
              class: "text-sm font-medium text-ink-gray-7",
              onClick: $setup.cycleView
            }, {
              default: withCtx(() => [
                $setup.view === "date" ? (openBlock(), createElementBlock(
                  "span",
                  _hoisted_3$2,
                  toDisplayString($setup.months[$setup.currentMonth]) + " " + toDisplayString($setup.currentYear),
                  1
                  /* TEXT */
                )) : $setup.view === "month" ? (openBlock(), createElementBlock(
                  "span",
                  _hoisted_4$1,
                  toDisplayString($setup.currentYear),
                  1
                  /* TEXT */
                )) : (openBlock(), createElementBlock(
                  "span",
                  _hoisted_5$1,
                  toDisplayString($setup.yearRangeStart) + " - " + toDisplayString($setup.yearRangeStart + 11),
                  1
                  /* TEXT */
                ))
              ]),
              _: 1
              /* STABLE */
            }),
            createBaseVNode("div", _hoisted_6$1, [
              createVNode($setup["Button"], {
                variant: "ghost",
                icon: "chevron-left",
                class: "size-7",
                onClick: $setup.prev
              }),
              !$props.clearable ? (openBlock(), createBlock($setup["Button"], {
                key: 0,
                variant: "ghost",
                class: "text-xs",
                label: "Now",
                onClick: () => $setup.handleNowClick(togglePopover)
              }, null, 8, ["onClick"])) : createCommentVNode("v-if", true),
              createVNode($setup["Button"], {
                variant: "ghost",
                icon: "chevron-right",
                class: "size-7",
                onClick: $setup.next
              })
            ])
          ]),
          createCommentVNode(" Calendar "),
          createBaseVNode("div", _hoisted_7$1, [
            $setup.view === "date" ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
              createBaseVNode("div", _hoisted_9$1, [
                (openBlock(), createElementBlock(
                  Fragment,
                  null,
                  renderList(["S", "M", "T", "W", "T", "F", "S"], (d) => {
                    return createBaseVNode(
                      "div",
                      {
                        key: d,
                        class: "flex h-6 w-8 items-center justify-center"
                      },
                      toDisplayString(d),
                      1
                      /* TEXT */
                    );
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ]),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.weeks, (week, wi) => {
                  return openBlock(), createElementBlock("div", {
                    key: wi,
                    class: "flex",
                    role: "row"
                  }, [
                    (openBlock(true), createElementBlock(
                      Fragment,
                      null,
                      renderList(week, (dateObj) => {
                        return openBlock(), createElementBlock("button", {
                          type: "button",
                          key: dateObj.key,
                          class: normalizeClass(["flex h-8 w-8 items-center justify-center rounded cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-outline-gray-2", [
                            dateObj.inMonth ? "text-ink-gray-8" : "text-ink-gray-3",
                            dateObj.isToday ? "font-extrabold text-ink-gray-9" : "",
                            dateObj.disabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : dateObj.isSelected ? "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6" : "hover:bg-surface-gray-2"
                          ]]),
                          role: "gridcell",
                          "aria-selected": dateObj.isSelected ? "true" : "false",
                          "aria-label": dateObj.date.format("YYYY-MM-DD") + (dateObj.isToday ? " (Today)" : ""),
                          disabled: dateObj.disabled,
                          onClick: ($event) => !dateObj.disabled && $setup.handleDateCellClick(dateObj.date, togglePopover)
                        }, toDisplayString(dateObj.date.date()), 11, _hoisted_10$1);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : $setup.view === "month" ? (openBlock(), createElementBlock("div", _hoisted_11$1, [
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.months, (m, i) => {
                  return openBlock(), createElementBlock("button", {
                    type: "button",
                    key: m,
                    class: normalizeClass(["py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6", {
                      "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": i === $setup.currentMonth
                    }]),
                    "aria-selected": i === $setup.currentMonth ? "true" : "false",
                    onClick: ($event) => $setup.selectMonth(i)
                  }, toDisplayString(m.slice(0, 3)), 11, _hoisted_12$1);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (openBlock(), createElementBlock("div", _hoisted_13$1, [
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.yearRange, (y) => {
                  return openBlock(), createElementBlock("button", {
                    type: "button",
                    key: y,
                    class: normalizeClass(["py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6", {
                      "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": y === $setup.currentYear
                    }]),
                    "aria-selected": y === $setup.currentYear ? "true" : "false",
                    onClick: ($event) => $setup.selectYear(y)
                  }, toDisplayString(y), 11, _hoisted_14$1);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]))
          ]),
          createCommentVNode(" Time Picker Section "),
          createBaseVNode("div", _hoisted_15$1, [
            createVNode($setup["TimePicker"], {
              value: $setup.timeValue,
              allowCustom: $setup.props.allowCustomTime,
              placement: "bottom-start",
              placeholder: "Select time",
              minTime: $setup.computedMinTime,
              maxTime: $setup.computedMaxTime,
              onChange: $setup.onTimeChange
            }, null, 8, ["value", "allowCustom", "minTime", "maxTime"])
          ]),
          createCommentVNode(" Footer Actions (clearable variant) "),
          $setup.props.clearable ? (openBlock(), createElementBlock("div", _hoisted_16, [
            createBaseVNode("div", _hoisted_17, [
              createVNode($setup["Button"], {
                variant: "outline",
                label: "Now",
                onClick: () => $setup.handleNowClick(togglePopover)
              }, null, 8, ["onClick"]),
              createVNode($setup["Button"], {
                variant: "outline",
                label: "Tomorrow",
                onClick: _cache[1] || (_cache[1] = () => $setup.handleTomorrowClick())
              })
            ]),
            $setup.selectedDate ? (openBlock(), createBlock($setup["Button"], {
              key: 0,
              size: "sm",
              variant: "outline",
              label: "Clear",
              onClick: () => $setup.handleClearClick(togglePopover)
            }, null, 8, ["onClick"])) : createCommentVNode("v-if", true)
          ])) : createCommentVNode("v-if", true)
        ],
        512
        /* NEED_PATCH */
      )
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["placement"]);
}
_sfc_main$2.__file = "src/components/DatePicker/DateTimePicker.vue";
const DateTimePicker = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker/DateTimePicker.vue"]]);
const DATE_FORMAT = "YYYY-MM-DD";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DateRangePicker",
  props: {
    value: { type: [String, Array], required: false, default: "" },
    modelValue: { type: [String, Array], required: false, default: "" },
    placement: { type: String, required: false, default: "bottom-start" },
    format: { type: String, required: false },
    variant: { type: String, required: false, default: "subtle" },
    readonly: { type: Boolean, required: false, default: false },
    placeholder: { type: String, required: false, default: "Select range" },
    inputClass: { type: [String, Array, Object], required: false },
    allowCustom: { type: Boolean, required: false, default: true },
    autoClose: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false, default: false },
    label: { type: String, required: false },
    clearable: { type: Boolean, required: false }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { autoClose } = toRefs(props);
    const view = ref("date");
    const currentYear = ref(dayjs().year());
    const currentMonth = ref(dayjs().month());
    const fromDate = ref("");
    const toDate = ref("");
    const isTyping = ref(false);
    const inputValue = ref("");
    function formatDisplay(from, to) {
      if (!from && !to) return "";
      if (from && !to) return formatOne(from);
      return `${formatOne(from)} to ${formatOne(to)}`;
    }
    function formatOne(dateStr) {
      if (!dateStr) return "";
      const d = dayjs(dateStr);
      if (!d.isValid()) return dateStr;
      return props.format ? d.format(props.format) : dateStr;
    }
    const displayLabel = computed(
      () => formatDisplay(fromDate.value, toDate.value)
    );
    function coerceToDayjs(val) {
      if (!val) return null;
      const raw = String(val).trim();
      if (!raw) return null;
      if (props.format) {
        const dStrict = dayjs(raw, props.format, true);
        if (dStrict.isValid()) return dStrict;
      }
      const dLoose = dayjs(raw);
      if (dLoose.isValid()) return dLoose;
      const normalized = getDateValue(raw);
      if (normalized) {
        const dNorm = dayjs(normalized);
        if (dNorm.isValid()) return dNorm;
      }
      return null;
    }
    function normalizeIncoming(val) {
      if (!val) return ["", ""];
      let parts = [];
      if (Array.isArray(val)) parts = val;
      else if (typeof val === "string") {
        const cleaned = val.replace(/ to /i, ",").replace(/ - /g, ",");
        parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);
      }
      const from = coerceToDayjs(parts[0] || "");
      const to = coerceToDayjs(parts[1] || "");
      return [(from == null ? void 0 : from.format(DATE_FORMAT)) || "", (to == null ? void 0 : to.format(DATE_FORMAT)) || ""];
    }
    function syncFromValue(val) {
      const [f, t] = normalizeIncoming(val);
      fromDate.value = f;
      toDate.value = t;
      if (f) {
        const d = dayjs(f);
        currentYear.value = d.year();
        currentMonth.value = d.month();
      }
      if (!isTyping.value) updateInputValue();
    }
    const initialValue = props.modelValue || props.value || "";
    syncFromValue(initialValue);
    function initFromValue() {
      syncFromValue(props.modelValue || props.value || "");
    }
    watch(
      () => [props.modelValue, props.value],
      ([m, v]) => {
        const val = m || v;
        syncFromValue(val);
      }
    );
    function updateInputValue() {
      inputValue.value = displayLabel.value;
    }
    updateInputValue();
    watch(displayLabel, (val) => {
      if (!isTyping.value) inputValue.value = val;
    });
    function parseRangeInput(raw) {
      if (!raw.trim()) return [null, null];
      let normalized = raw.replace(/\s+to\s+/i, ",").replace(/\s+-\s+/g, ",");
      const parts = normalized.split(",").map((p) => p.trim()).filter(Boolean);
      if (!parts.length) return [null, null];
      const first = coerceToDayjs(parts[0]);
      const second = coerceToDayjs(parts[1]);
      return [first, second];
    }
    function maybeClose(togglePopover, condition = true) {
      if (condition && autoClose.value && togglePopover) togglePopover();
    }
    function commitInput(close = false, togglePopover) {
      const raw = inputValue.value.trim();
      if (!raw) {
        clearSelection();
        maybeClose(togglePopover, close);
        return;
      }
      const [f, t] = parseRangeInput(raw);
      if (f) fromDate.value = f.format(DATE_FORMAT);
      if (t) toDate.value = t.format(DATE_FORMAT);
      if (!t) toDate.value = "";
      ensureOrder();
      emitIfComplete();
      updateInputValue();
      maybeClose(togglePopover, close && !!fromDate.value && !!toDate.value);
    }
    const popoverContentRef = ref(null);
    function onBlur(e) {
      var _a;
      const next2 = e.relatedTarget;
      if (next2 && ((_a = popoverContentRef.value) == null ? void 0 : _a.contains(next2))) return;
      commitInput();
      isTyping.value = false;
    }
    function onEnter(togglePopover) {
      commitInput(true, togglePopover);
      isTyping.value = false;
    }
    function activateInput(isOpen, togglePopover) {
      isTyping.value = true;
      if (!isOpen) togglePopover();
    }
    const weeks = computed(() => {
      const raw = generateWeeks(currentYear.value, currentMonth.value, "");
      const f = dayjs(fromDate.value);
      const t = dayjs(toDate.value);
      return raw.map(
        (week) => week.map((d) => {
          const isRangeStart = f.isValid() && d.date.isSame(f, "day");
          const isRangeEnd = t.isValid() && d.date.isSame(t, "day");
          const inRange = f.isValid() && t.isValid() && d.date.isAfter(f, "day") && d.date.isBefore(t, "day");
          return {
            date: d.date,
            key: d.key,
            inMonth: d.inMonth,
            isToday: d.isToday,
            isRangeStart,
            isRangeEnd,
            inRange
          };
        })
      );
    });
    function selectDate(date) {
      const d = dayjs(date);
      if (!d.isValid()) return;
      if (fromDate.value && toDate.value) {
        fromDate.value = d.format(DATE_FORMAT);
        toDate.value = "";
      } else if (fromDate.value && !toDate.value) {
        toDate.value = d.format(DATE_FORMAT);
      } else {
        fromDate.value = d.format(DATE_FORMAT);
      }
      ensureOrder();
      updateInputValue();
    }
    function ensureOrder() {
      if (fromDate.value && toDate.value) {
        if (dayjs(fromDate.value).isAfter(dayjs(toDate.value))) {
          const tmp = fromDate.value;
          fromDate.value = toDate.value;
          toDate.value = tmp;
        }
      }
    }
    function handleDateCellClick(date, togglePopover) {
      selectDate(date);
      if (autoClose.value && fromDate.value && toDate.value) {
        emitIfComplete();
        maybeClose(togglePopover, true);
      }
      isTyping.value = false;
    }
    function emitIfComplete() {
      if (fromDate.value && toDate.value) {
        const val = `${fromDate.value},${toDate.value}`;
        emit("update:modelValue", val);
        emit("change", val);
      }
      if (!fromDate.value && !toDate.value) {
        emit("update:modelValue", "");
        emit("change", "");
      }
    }
    function clearSelection() {
      fromDate.value = "";
      toDate.value = "";
      emitIfComplete();
      updateInputValue();
    }
    function handleClearClick(togglePopover) {
      clearSelection();
      maybeClose(togglePopover);
      isTyping.value = false;
      view.value = "date";
    }
    function handleTodayClick(togglePopover) {
      const now = dayjsLocal().startOf("day");
      fromDate.value = now.format(DATE_FORMAT);
      toDate.value = now.format(DATE_FORMAT);
      emitIfComplete();
      updateInputValue();
      if (autoClose.value && togglePopover) togglePopover();
      view.value = "date";
      isTyping.value = false;
    }
    function selectMonth(i) {
      currentMonth.value = i;
      view.value = "date";
    }
    function selectYear(y) {
      currentYear.value = y;
      view.value = "month";
    }
    function prev() {
      if (view.value === "date") {
        const m = monthStart(currentYear.value, currentMonth.value).subtract(
          1,
          "month"
        );
        currentYear.value = m.year();
        currentMonth.value = m.month();
      } else if (view.value === "month") {
        currentYear.value -= 1;
      } else {
        currentYear.value -= 12;
      }
    }
    function next() {
      if (view.value === "date") {
        const m = monthStart(currentYear.value, currentMonth.value).add(1, "month");
        currentYear.value = m.year();
        currentMonth.value = m.month();
      } else if (view.value === "month") {
        currentYear.value += 1;
      } else {
        currentYear.value += 12;
      }
    }
    function cycleView() {
      if (view.value === "date") view.value = "month";
      else if (view.value === "month") view.value = "year";
      else view.value = "date";
    }
    function handleClose() {
      view.value = "date";
      if (isTyping.value) {
        commitInput();
        isTyping.value = false;
      }
    }
    const yearRangeStart = computed(
      () => currentYear.value - currentYear.value % 12
    );
    const yearRange = computed(
      () => Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i)
    );
    __expose({
      open: () => {
        var _a;
        return (_a = popoverRef.value) == null ? void 0 : _a.open();
      }
    });
    const popoverRef = ref(null);
    const __returned__ = { props, emit, autoClose, view, currentYear, currentMonth, DATE_FORMAT, fromDate, toDate, isTyping, inputValue, formatDisplay, formatOne, displayLabel, coerceToDayjs, normalizeIncoming, syncFromValue, initialValue, initFromValue, updateInputValue, parseRangeInput, maybeClose, commitInput, popoverContentRef, onBlur, onEnter, activateInput, weeks, selectDate, ensureOrder, handleDateCellClick, emitIfComplete, clearSelection, handleClearClick, handleTodayClick, selectMonth, selectYear, prev, next, cycleView, handleClose, yearRangeStart, yearRange, popoverRef, get Popover() {
      return __unplugin_components_1;
    }, get Button() {
      return Button;
    }, get TextInput() {
      return TextInput;
    }, FeatherIcon, get months() {
      return months;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = {
  ref: "popoverContentRef",
  class: "w-fit min-w-60 select-none text-base text-ink-gray-9 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 mt-2"
};
const _hoisted_2$1 = { class: "flex items-center justify-between p-2 pb-0 gap-1" };
const _hoisted_3$1 = { key: 0 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = { key: 2 };
const _hoisted_6 = { class: "flex items-center" };
const _hoisted_7 = { class: "p-2" };
const _hoisted_8 = { key: 0 };
const _hoisted_9 = { class: "flex items-center text-xs font-medium uppercase text-ink-gray-4 mb-1" };
const _hoisted_10 = ["aria-selected", "aria-label", "onClick"];
const _hoisted_11 = {
  class: "grid grid-cols-3 gap-1",
  role: "grid",
  "aria-label": "Select month"
};
const _hoisted_12 = ["aria-selected", "onClick"];
const _hoisted_13 = {
  class: "grid grid-cols-3 gap-1",
  role: "grid",
  "aria-label": "Select year"
};
const _hoisted_14 = ["aria-selected", "onClick"];
const _hoisted_15 = {
  key: 0,
  class: "flex justify-end gap-1 p-2 border-t"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    class: "inline-block",
    placement: $props.placement,
    onOpen: $setup.initFromValue,
    onClose: $setup.handleClose,
    ref: "popoverRef"
  }, {
    target: withCtx(({ togglePopover, isOpen }) => [
      renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({ togglePopover, isOpen, displayLabel: $setup.displayLabel, inputValue: $setup.inputValue })), () => [
        createVNode($setup["TextInput"], {
          modelValue: $setup.inputValue,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
          type: "text",
          class: normalizeClass(["cursor-text w-full", $setup.props.inputClass]),
          label: $setup.props.label,
          variant: $setup.props.variant,
          placeholder: $setup.props.placeholder,
          disabled: $setup.props.disabled,
          readonly: $setup.props.readonly || !$setup.props.allowCustom,
          onFocus: ($event) => $setup.activateInput(isOpen, togglePopover),
          onClick: ($event) => $setup.activateInput(isOpen, togglePopover),
          onBlur: $setup.onBlur,
          onKeydown: withKeys(withModifiers(($event) => $setup.onEnter(togglePopover), ["prevent"]), ["enter"])
        }, createSlots({
          suffix: withCtx(() => [
            renderSlot(_ctx.$slots, "suffix", normalizeProps(guardReactiveProps({ togglePopover, isOpen, displayLabel: $setup.displayLabel, inputValue: $setup.inputValue })), () => [
              createVNode($setup["FeatherIcon"], {
                name: "chevron-down",
                class: "h-4 w-4 cursor-pointer",
                onMousedown: withModifiers(togglePopover, ["prevent"])
              }, null, 8, ["onMousedown"])
            ])
          ]),
          _: 2
          /* DYNAMIC */
        }, [
          _ctx.$slots.prefix ? {
            name: "prefix",
            fn: withCtx(() => [
              renderSlot(_ctx.$slots, "prefix", normalizeProps(guardReactiveProps({ togglePopover, isOpen, displayLabel: $setup.displayLabel, inputValue: $setup.inputValue })))
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["modelValue", "class", "label", "variant", "placeholder", "disabled", "readonly", "onFocus", "onClick", "onKeydown"])
      ])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode(
        "div",
        _hoisted_1$1,
        [
          createCommentVNode(" Header / Navigation "),
          createBaseVNode("div", _hoisted_2$1, [
            createVNode($setup["Button"], {
              variant: "ghost",
              size: "sm",
              class: "text-sm font-medium text-ink-gray-7",
              onClick: $setup.cycleView
            }, {
              default: withCtx(() => [
                $setup.view === "date" ? (openBlock(), createElementBlock(
                  "span",
                  _hoisted_3$1,
                  toDisplayString($setup.months[$setup.currentMonth]) + " " + toDisplayString($setup.currentYear),
                  1
                  /* TEXT */
                )) : $setup.view === "month" ? (openBlock(), createElementBlock(
                  "span",
                  _hoisted_4,
                  toDisplayString($setup.currentYear),
                  1
                  /* TEXT */
                )) : (openBlock(), createElementBlock(
                  "span",
                  _hoisted_5,
                  toDisplayString($setup.yearRangeStart) + " - " + toDisplayString($setup.yearRangeStart + 11),
                  1
                  /* TEXT */
                ))
              ]),
              _: 1
              /* STABLE */
            }),
            createBaseVNode("div", _hoisted_6, [
              createVNode($setup["Button"], {
                variant: "ghost",
                icon: "chevron-left",
                class: "size-7",
                onClick: $setup.prev
              }),
              createVNode($setup["Button"], {
                variant: "ghost",
                class: "text-xs",
                label: "Today",
                onClick: () => $setup.handleTodayClick(togglePopover)
              }, null, 8, ["onClick"]),
              createVNode($setup["Button"], {
                variant: "ghost",
                icon: "chevron-right",
                class: "size-7",
                onClick: $setup.next
              })
            ])
          ]),
          createCommentVNode(" Content "),
          createBaseVNode("div", _hoisted_7, [
            createCommentVNode(" Date Grid "),
            $setup.view === "date" ? (openBlock(), createElementBlock("div", _hoisted_8, [
              createBaseVNode("div", _hoisted_9, [
                (openBlock(), createElementBlock(
                  Fragment,
                  null,
                  renderList(["S", "M", "T", "W", "T", "F", "S"], (d) => {
                    return createBaseVNode(
                      "div",
                      {
                        key: d,
                        class: "flex h-6 w-8 items-center justify-center"
                      },
                      toDisplayString(d),
                      1
                      /* TEXT */
                    );
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ]),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.weeks, (week, wi) => {
                  return openBlock(), createElementBlock("div", {
                    key: wi,
                    class: "flex",
                    role: "row"
                  }, [
                    (openBlock(true), createElementBlock(
                      Fragment,
                      null,
                      renderList(week, (dateObj) => {
                        return openBlock(), createElementBlock("button", {
                          type: "button",
                          key: dateObj.key,
                          class: normalizeClass(["flex h-8 w-8 items-center justify-center rounded cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-outline-gray-2", [
                            dateObj.inMonth ? "text-ink-gray-8" : "text-ink-gray-3",
                            dateObj.isToday ? "font-extrabold text-ink-gray-9" : "",
                            dateObj.isRangeStart || dateObj.isRangeEnd ? "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6" : dateObj.inRange ? "bg-surface-gray-3 rounded-none" : "hover:bg-surface-gray-2",
                            dateObj.isRangeStart && !dateObj.isRangeEnd ? "rounded-l-md rounded-r-none" : "",
                            dateObj.isRangeEnd && !dateObj.isRangeStart ? "rounded-r-md rounded-l-none" : "",
                            dateObj.isRangeStart && dateObj.isRangeEnd ? "rounded-md" : ""
                          ]]),
                          role: "gridcell",
                          "aria-selected": dateObj.isRangeStart || dateObj.isRangeEnd ? "true" : "false",
                          "aria-label": dateObj.date.format("YYYY-MM-DD") + (dateObj.isToday ? " (Today)" : ""),
                          onClick: ($event) => $setup.handleDateCellClick(dateObj.date, togglePopover)
                        }, toDisplayString(dateObj.date.date()), 11, _hoisted_10);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : $setup.view === "month" ? (openBlock(), createElementBlock(
              Fragment,
              { key: 1 },
              [
                createCommentVNode(" Month Grid "),
                createBaseVNode("div", _hoisted_11, [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.months, (m, i) => {
                      return openBlock(), createElementBlock("button", {
                        type: "button",
                        key: m,
                        class: normalizeClass(["py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6", {
                          "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": i === $setup.currentMonth
                        }]),
                        "aria-selected": i === $setup.currentMonth ? "true" : "false",
                        onClick: ($event) => $setup.selectMonth(i)
                      }, toDisplayString(m.slice(0, 3)), 11, _hoisted_12);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ],
              2112
              /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
            )) : (openBlock(), createElementBlock(
              Fragment,
              { key: 2 },
              [
                createCommentVNode(" Year Grid "),
                createBaseVNode("div", _hoisted_13, [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.yearRange, (y) => {
                      return openBlock(), createElementBlock("button", {
                        type: "button",
                        key: y,
                        class: normalizeClass(["py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6", {
                          "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": y === $setup.currentYear
                        }]),
                        "aria-selected": y === $setup.currentYear ? "true" : "false",
                        onClick: ($event) => $setup.selectYear(y)
                      }, toDisplayString(y), 11, _hoisted_14);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ],
              2112
              /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
            ))
          ]),
          $setup.fromDate && $setup.toDate ? (openBlock(), createElementBlock("div", _hoisted_15, [
            createVNode($setup["Button"], {
              size: "sm",
              variant: "outline",
              label: "Clear",
              onClick: () => $setup.handleClearClick(togglePopover)
            }, null, 8, ["onClick"])
          ])) : createCommentVNode("v-if", true)
        ],
        512
        /* NEED_PATCH */
      )
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["placement"]);
}
_sfc_main$1.__file = "src/components/DatePicker/DateRangePicker.vue";
const DateRangePicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker/DateRangePicker.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DatePicker.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      variant: "subtle",
      placeholder: "Placeholder",
      disabled: false,
      label: "Label"
    });
    const dateValue = ref("");
    const dateTimeValue = ref("");
    const dateRangeValue = ref("");
    const __returned__ = { state, dateValue, dateTimeValue, dateRangeValue, DatePicker, DateTimePicker, DateRangePicker };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "p-2" };
const _hoisted_3 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500 } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Date" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["DatePicker"], mergeProps({
              modelValue: $setup.dateValue,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.dateValue = $event)
            }, $setup.state), null, 16, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Date Time" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["DateTimePicker"], mergeProps({
              modelValue: $setup.dateTimeValue,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.dateTimeValue = $event)
            }, $setup.state), null, 16, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Date Range" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["DateRangePicker"], mergeProps({
              modelValue: $setup.dateRangeValue,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.dateRangeValue = $event)
            }, $setup.state), null, 16, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/DatePicker/DatePicker.story.vue";
const DatePicker_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker/DatePicker.story.vue"]]);
export {
  DatePicker_story as default
};
