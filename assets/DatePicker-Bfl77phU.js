import { aC as defineComponent, bv as toRefs, aN as ref, b3 as watch, aF as computed, az as openBlock, aH as createBlock, aP as withCtx, aG as renderSlot, bc as normalizeProps, bd as guardReactiveProps, aM as createVNode, aI as normalizeClass, bw as withKeys, a_ as withModifiers, bx as createSlots, aB as createBaseVNode, aA as createElementBlock, aL as toDisplayString, aK as createCommentVNode, aT as Fragment, aS as renderList } from "./vendor-Bsn799PA.js";
import { F as FeatherIcon } from "./FeatherIcon-BZHoZURy.js";
import { d as dayjs, a as dayjsLocal } from "./dayjs-Cb96TImg.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { _ as __unplugin_components_1 } from "./Popover-YWXxRqet.js";
import { B as Button } from "./Button-MiITH10Z.js";
import { T as TextInput } from "./TextInput-BqCaNH_E.js";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function monthStart(year, monthIndex) {
  return dayjs(`${year}-${monthIndex + 1}-01`);
}
function generateWeeks(year, monthIndex, selected) {
  const start = monthStart(year, monthIndex).startOf("week");
  const end = monthStart(year, monthIndex).endOf("month").endOf("week");
  const days = [];
  let d = start;
  while (d.isBefore(end) || d.isSame(end)) {
    const inMonth = d.month() === monthIndex;
    const sel = dayjs(selected);
    days.push({
      date: d,
      key: d.format("YYYY-MM-DD"),
      inMonth,
      isToday: d.isSame(dayjsLocal().format("YYYY-MM-DD"), "day"),
      isSelected: sel.isValid() && d.isSame(sel, "day")
    });
    d = d.add(1, "day");
  }
  const chunked = [];
  for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7));
  return chunked;
}
function getDateValue(date) {
  if (!date || date.toString() === "Invalid Date") return "";
  return dayjs(date).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0).format("YYYY-MM-DD");
}
const DATE_FORMAT = "YYYY-MM-DD";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DatePicker",
  props: {
    value: { type: String, required: false, default: "" },
    modelValue: { type: String, required: false, default: "" },
    placement: { type: String, required: false, default: "bottom-start" },
    format: { type: String, required: false },
    variant: { type: String, required: false, default: "subtle" },
    readonly: { type: Boolean, required: false, default: false },
    placeholder: { type: String, required: false, default: "Select date" },
    inputClass: { type: [String, Array, Object], required: false },
    allowCustom: { type: Boolean, required: false, default: true },
    autoClose: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false, default: false },
    label: { type: String, required: false },
    clearable: { type: Boolean, required: false, default: true }
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
    const selected = ref("");
    const initialValue = ref(props.modelValue || props.value || "");
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
    function syncFromValue(val) {
      if (!val) {
        if (!props.clearable) {
          const today = dayjsLocal();
          currentYear.value = today.year();
          currentMonth.value = today.month();
          selected.value = today.format(DATE_FORMAT);
        } else {
          selected.value = "";
        }
        return;
      }
      const d = coerceToDayjs(val);
      if (!d) {
        selected.value = "";
        return;
      }
      currentYear.value = d.year();
      currentMonth.value = d.month();
      selected.value = d.format(DATE_FORMAT);
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
    const displayLabel = computed(
      () => props.format ? formatter(selected.value, props.format) : selected.value
    );
    function formatter(dateStr, format) {
      const d = dayjs(dateStr);
      if (!d.isValid()) return dateStr;
      return d.format(format);
    }
    const inputValue = ref(displayLabel.value);
    const isTyping = ref(false);
    watch(displayLabel, (val) => {
      if (!isTyping.value) inputValue.value = val;
    });
    function maybeClose(togglePopover, condition = true) {
      if (condition && autoClose.value && togglePopover) togglePopover();
    }
    function clearSelection() {
      if (!selected.value) return;
      selected.value = "";
      emit("update:modelValue", "");
      emit("change", "");
      initialValue.value = "";
      inputValue.value = "";
    }
    function commitInput(close = false, togglePopover) {
      const raw = inputValue.value.trim();
      if (!raw) {
        if (!props.clearable) {
          selectDate(dayjsLocal());
          maybeClose(togglePopover, close);
        } else {
          clearSelection();
          maybeClose(togglePopover, close);
        }
        return;
      }
      const d = coerceToDayjs(raw);
      if (d) {
        selectDate(d);
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
    const weeks = computed(
      () => generateWeeks(currentYear.value, currentMonth.value, selected.value)
    );
    function selectDate(date) {
      const d = dayjs(date);
      if (!d.isValid()) return;
      const prev2 = selected.value;
      selected.value = d.format(DATE_FORMAT);
      currentYear.value = d.year();
      currentMonth.value = d.month();
      if (selected.value !== initialValue.value) {
        emit("update:modelValue", selected.value);
        if (selected.value !== prev2) emit("change", selected.value);
        initialValue.value = selected.value;
      }
      if (!isTyping.value) {
        inputValue.value = props.format ? formatter(selected.value, props.format) : selected.value;
      }
      view.value = "date";
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
    function handleDateCellClick(date, togglePopover) {
      selectDate(date);
      if (autoClose.value) togglePopover();
      isTyping.value = false;
    }
    function selectOffset(days = 0, togglePopover) {
      handleDateCellClick(dayjsLocal().add(days, "day"), togglePopover);
    }
    function handleTodayClick(togglePopover) {
      selectOffset(0, togglePopover);
    }
    function handleTomorrowClick(togglePopover) {
      selectOffset(1, togglePopover);
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
    const __returned__ = { props, emit, autoClose, view, currentYear, currentMonth, DATE_FORMAT, selected, initialValue, coerceToDayjs, syncFromValue, initFromValue, displayLabel, formatter, inputValue, isTyping, maybeClose, clearSelection, commitInput, popoverContentRef, onBlur, onEnter, activateInput, weeks, selectDate, selectMonth, selectYear, prev, next, handleDateCellClick, selectOffset, handleTodayClick, handleTomorrowClick, handleClearClick, cycleView, handleClose, yearRangeStart, yearRange, get Popover() {
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
const _hoisted_1 = {
  ref: "popoverContentRef",
  class: "w-fit min-w-60 select-none text-base text-ink-gray-9 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 mt-2"
};
const _hoisted_2 = { class: "flex items-center justify-between p-2 pb-0 gap-1" };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = { key: 2 };
const _hoisted_6 = { class: "flex items-center" };
const _hoisted_7 = { class: "p-2" };
const _hoisted_8 = {
  key: 0,
  role: "grid",
  "aria-label": "Calendar dates"
};
const _hoisted_9 = { class: "flex items-center text-xs font-medium uppercase text-ink-gray-4 mb-1" };
const _hoisted_10 = ["aria-selected", "aria-label", "onClick"];
const _hoisted_11 = {
  key: 1,
  class: "grid grid-cols-3 gap-1",
  role: "grid",
  "aria-label": "Select month"
};
const _hoisted_12 = ["aria-selected", "onClick"];
const _hoisted_13 = {
  key: 2,
  class: "grid grid-cols-3 gap-1",
  role: "grid",
  "aria-label": "Select year"
};
const _hoisted_14 = ["aria-selected", "onClick"];
const _hoisted_15 = {
  key: 0,
  class: "flex items-center justify-between gap-1 p-2 border-t"
};
const _hoisted_16 = { class: "flex gap-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
        _hoisted_1,
        [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["Button"], {
              variant: "ghost",
              size: "sm",
              class: "text-sm font-medium text-ink-gray-7",
              onClick: $setup.cycleView
            }, {
              default: withCtx(() => [
                $setup.view === "date" ? (openBlock(), createElementBlock(
                  "span",
                  _hoisted_3,
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
              !$props.clearable ? (openBlock(), createBlock($setup["Button"], {
                key: 0,
                variant: "ghost",
                class: "text-xs",
                label: "Today",
                onClick: () => $setup.handleTodayClick(togglePopover)
              }, null, 8, ["onClick"])) : createCommentVNode("v-if", true),
              createVNode($setup["Button"], {
                variant: "ghost",
                icon: "chevron-right",
                class: "size-7",
                onClick: $setup.next
              })
            ])
          ]),
          createBaseVNode("div", _hoisted_7, [
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
                            dateObj.isSelected ? "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6" : "hover:bg-surface-gray-2"
                          ]]),
                          role: "gridcell",
                          "aria-selected": dateObj.isSelected ? "true" : "false",
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
            ])) : $setup.view === "month" ? (openBlock(), createElementBlock("div", _hoisted_11, [
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
            ])) : (openBlock(), createElementBlock("div", _hoisted_13, [
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
            ]))
          ]),
          $setup.props.clearable ? (openBlock(), createElementBlock("div", _hoisted_15, [
            createBaseVNode("div", _hoisted_16, [
              createVNode($setup["Button"], {
                variant: "outline",
                label: "Today",
                onClick: () => $setup.handleTodayClick(togglePopover)
              }, null, 8, ["onClick"]),
              createVNode($setup["Button"], {
                variant: "outline",
                label: "Tomorrow",
                onClick: () => $setup.handleTomorrowClick(togglePopover)
              }, null, 8, ["onClick"])
            ]),
            $setup.selected ? (openBlock(), createBlock($setup["Button"], {
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
_sfc_main.__file = "src/components/DatePicker/DatePicker.vue";
const DatePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker/DatePicker.vue"]]);
export {
  DatePicker as D,
  getDateValue as a,
  monthStart as b,
  generateWeeks as g,
  months as m
};
