import { az as ref, aW as computed, ay as defineComponent, b1 as onMounted, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aL as mergeProps, cC as createSlots, aZ as renderSlot, aF as createBaseVNode, aQ as normalizeClass, aH as createCommentVNode, aN as toDisplayString, aG as createElementBlock, aK as Fragment, aJ as renderList } from "./vendor-BvyPapf4.js";
import { B as Button } from "./Button-DuHrgKMY.js";
import { F as FeatherIcon } from "./FeatherIcon-C9moqs4Q.js";
import { _ as __unplugin_components_1 } from "./Popover-B4u7jK85.js";
import { T as TextInput } from "./TextInput-Dgm4SOK-.js";
import { d as dayjs, a as dayjsLocal, b as dayjsSystem } from "./dayjs-BsGYEVDs.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
function getDate(...args) {
  return new Date(...args);
}
function getDateValue(date) {
  if (!date || date.toString() === "Invalid Date") return "";
  return dayjs(date).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0).format("YYYY-MM-DD");
}
function getDatesAfter(date, count) {
  let incrementer = 1;
  if (count < 0) {
    incrementer = -1;
    count = Math.abs(count);
  }
  const dates = [];
  while (count) {
    date = getDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + incrementer
    );
    dates.push(date);
    count--;
  }
  if (incrementer === -1) {
    return dates.reverse();
  }
  return dates;
}
function getDaysInMonth(monthIndex, year) {
  const daysInMonthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const daysInMonth = daysInMonthMap[monthIndex];
  if (monthIndex === 1 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth;
}
function isLeapYear(year) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
}
function useDatePicker() {
  const currentYear = ref(0);
  const currentMonth = ref(0);
  const today = computed(() => getDate());
  const dates = computed(() => {
    if (!(currentYear.value && currentMonth.value)) {
      return [];
    }
    const monthIndex = currentMonth.value - 1;
    const year = currentYear.value;
    const firstDayOfMonth = getDate(year, monthIndex, 1);
    const lastDayOfMonth = getDate(year, monthIndex + 1, 0);
    const leftPaddingCount = firstDayOfMonth.getDay();
    const rightPaddingCount = 6 - lastDayOfMonth.getDay();
    const leftPadding = getDatesAfter(firstDayOfMonth, -leftPaddingCount);
    const rightPadding = getDatesAfter(lastDayOfMonth, rightPaddingCount);
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const datesInMonth = getDatesAfter(firstDayOfMonth, daysInMonth - 1);
    let dates2 = [
      ...leftPadding,
      firstDayOfMonth,
      ...datesInMonth,
      ...rightPadding
    ];
    if (dates2.length < 42) {
      const lastDate = dates2.at(-1);
      if (lastDate) {
        const finalPadding = getDatesAfter(lastDate, 42 - dates2.length);
        dates2 = dates2.concat(...finalPadding);
      }
    }
    return dates2;
  });
  const datesAsWeeks = computed(() => {
    const datesAsWeeks2 = [];
    const computedDates = dates.value.slice();
    while (computedDates.length) {
      const week = computedDates.splice(0, 7);
      datesAsWeeks2.push(week);
    }
    return datesAsWeeks2;
  });
  const formattedMonth = computed(() => {
    if (!(currentYear.value && currentMonth.value)) {
      return "";
    }
    const date = getDate(currentYear.value, currentMonth.value - 1, 1);
    const month = date.toLocaleString("en-US", {
      month: "long"
    });
    return `${month}, ${date.getFullYear()}`;
  });
  function prevMonth() {
    changeMonth(-1);
  }
  function nextMonth() {
    changeMonth(1);
  }
  function changeMonth(adder) {
    currentMonth.value = currentMonth.value + adder;
    if (currentMonth.value < 1) {
      currentMonth.value = 12;
      currentYear.value = currentYear.value - 1;
    }
    if (currentMonth.value > 12) {
      currentMonth.value = 1;
      currentYear.value = currentYear.value + 1;
    }
  }
  return {
    currentYear,
    currentMonth,
    today,
    dates,
    datesAsWeeks,
    formattedMonth,
    prevMonth,
    nextMonth,
    changeMonth
  };
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DatePicker",
  props: {
    value: { type: [String, Array], required: false },
    modelValue: { type: [String, Array], required: false },
    placeholder: { type: String, required: false },
    formatter: { type: Function, required: false },
    readonly: { type: Boolean, required: false },
    inputClass: { type: [String, Array, Object], required: false },
    placement: { type: String, required: false }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const {
      currentYear,
      currentMonth,
      today,
      datesAsWeeks,
      formattedMonth,
      prevMonth,
      nextMonth
    } = useDatePicker();
    const marginClass = computed(() => {
      var _a, _b, _c;
      let _marginClass = "mt-2";
      if ((_a = props.placement) == null ? void 0 : _a.startsWith("top")) {
        _marginClass = "mb-2";
      } else if ((_b = props.placement) == null ? void 0 : _b.startsWith("left")) {
        _marginClass = "mr-2";
      } else if ((_c = props.placement) == null ? void 0 : _c.startsWith("right")) {
        _marginClass = "ml-2";
      }
      return _marginClass;
    });
    const dateValue = computed(() => {
      return props.value ? props.value : props.modelValue;
    });
    function selectDate(date, isNow = false) {
      date = isNow ? dayjsLocal(date) : date;
      emit("change", getDateValue(date));
      emit("update:modelValue", getDateValue(date));
    }
    function selectCurrentMonthYear() {
      let date = dateValue.value ? getDate(dateValue.value) : getDate();
      if (date.toString() === "Invalid Date") {
        date = getDate();
      }
      currentYear.value = date.getFullYear();
      currentMonth.value = date.getMonth() + 1;
    }
    onMounted(() => selectCurrentMonthYear());
    const __returned__ = { props, emit, currentYear, currentMonth, today, datesAsWeeks, formattedMonth, prevMonth, nextMonth, marginClass, dateValue, selectDate, selectCurrentMonthYear, get Button() {
      return Button;
    }, FeatherIcon, get Popover() {
      return __unplugin_components_1;
    }, get TextInput() {
      return TextInput;
    }, get getDate() {
      return getDate;
    }, get getDateValue() {
      return getDateValue;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = { class: "flex items-center p-1 text-ink-gray-4" };
const _hoisted_2$2 = { class: "flex-1 text-center text-base font-medium text-ink-gray-6" };
const _hoisted_3$2 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_4$2 = { class: "flex flex-col items-center justify-center p-1 text-ink-gray-8" };
const _hoisted_5$2 = { class: "flex items-center text-xs uppercase" };
const _hoisted_6$2 = ["onClick"];
const _hoisted_7$2 = { class: "flex justify-end p-1" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    onOpen: $setup.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full",
    placement: $props.placement
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode($setup["TextInput"], mergeProps({
        readonly: "",
        type: "text",
        placeholder: $props.placeholder,
        value: $setup.dateValue && $props.formatter ? $props.formatter($setup.dateValue) : $setup.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), createSlots({
        _: 2
        /* DYNAMIC */
      }, [
        _ctx.$slots.prefix ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["w-fit select-none text-base text-ink-gray-9 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none", $setup.marginClass])
        },
        [
          createCommentVNode(" Month Switcher "),
          createBaseVNode("div", _hoisted_1$2, [
            createVNode($setup["Button"], {
              variant: "ghost",
              class: "h-7 w-7",
              onClick: $setup.prevMonth
            }, {
              default: withCtx(() => [
                createVNode($setup["FeatherIcon"], {
                  "stroke-width": 2,
                  name: "chevron-left",
                  class: "h-4 w-4"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["onClick"]),
            createBaseVNode(
              "div",
              _hoisted_2$2,
              toDisplayString($setup.formattedMonth),
              1
              /* TEXT */
            ),
            createVNode($setup["Button"], {
              variant: "ghost",
              class: "h-7 w-7",
              onClick: $setup.nextMonth
            }, {
              default: withCtx(() => [
                createVNode($setup["FeatherIcon"], {
                  "stroke-width": 2,
                  name: "chevron-right",
                  class: "h-4 w-4"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["onClick"])
          ]),
          createCommentVNode(" Date Input "),
          createBaseVNode("div", _hoisted_3$2, [
            createVNode($setup["TextInput"], {
              class: "text-sm",
              type: "text",
              value: $setup.dateValue,
              onChange: _cache[0] || (_cache[0] = ($event) => $setup.selectDate($setup.getDate($event.target.value)))
            }, null, 8, ["value"]),
            createVNode($setup["Button"], {
              label: "Today",
              class: "text-sm",
              onClick: () => {
                $setup.selectDate($setup.getDate(), true);
                togglePopover();
              }
            }, null, 8, ["onClick"])
          ]),
          createCommentVNode(" Calendar "),
          createBaseVNode("div", _hoisted_4$2, [
            createBaseVNode("div", _hoisted_5$2, [
              (openBlock(), createElementBlock(
                Fragment,
                null,
                renderList(["s", "m", "t", "w", "t", "f", "s"], (d, i) => {
                  return createBaseVNode(
                    "div",
                    {
                      class: "flex h-6 w-8 items-center justify-center text-center",
                      key: i
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
              renderList($setup.datesAsWeeks, (week, i) => {
                return openBlock(), createElementBlock("div", {
                  class: "flex items-center",
                  key: i
                }, [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList(week, (date) => {
                      return openBlock(), createElementBlock("div", {
                        key: $setup.getDateValue(date),
                        class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-surface-gray-2", {
                          "text-ink-gray-3": date.getMonth() !== $setup.currentMonth - 1,
                          "font-extrabold text-ink-gray-9": $setup.getDateValue(date) === $setup.getDateValue($setup.today),
                          "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": $setup.getDateValue(date) === $setup.dateValue
                        }]),
                        onClick: () => {
                          $setup.selectDate(date);
                          togglePopover();
                        }
                      }, toDisplayString(date.getDate()), 11, _hoisted_6$2);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          createCommentVNode(" Actions "),
          createBaseVNode("div", _hoisted_7$2, [
            createVNode($setup["Button"], {
              label: "Clear",
              class: "text-sm",
              onClick: () => {
                $setup.selectDate("");
                togglePopover();
              }
            }, null, 8, ["onClick"])
          ])
        ],
        2
        /* CLASS */
      )
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["placement"]);
}
_sfc_main$2.__file = "src/components/DatePicker/DatePicker.vue";
const DatePicker = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker/DatePicker.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DateTimePicker",
  props: {
    value: { type: [String, Array], required: false },
    modelValue: { type: [String, Array], required: false },
    placeholder: { type: String, required: false },
    formatter: { type: Function, required: false },
    readonly: { type: Boolean, required: false },
    inputClass: { type: [String, Array, Object], required: false },
    placement: { type: String, required: false }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const {
      currentYear,
      currentMonth,
      today,
      datesAsWeeks,
      formattedMonth,
      prevMonth,
      nextMonth
    } = useDatePicker();
    const marginClass = computed(() => {
      var _a, _b, _c;
      let _marginClass = "mt-2";
      if ((_a = props.placement) == null ? void 0 : _a.startsWith("top")) {
        _marginClass = "mb-2";
      } else if ((_b = props.placement) == null ? void 0 : _b.startsWith("left")) {
        _marginClass = "mr-2";
      } else if ((_c = props.placement) == null ? void 0 : _c.startsWith("right")) {
        _marginClass = "ml-2";
      }
      return _marginClass;
    });
    const hour = ref(0);
    const minute = ref(0);
    const second = ref(0);
    const dateValue = computed(() => {
      let date = props.value ? props.value : props.modelValue;
      return date ? dayjsLocal(date).format("YYYY-MM-DD HH:mm:ss") : "";
    });
    function changeTime() {
      let date = dateValue.value ? getDate(dateValue.value) : getDate();
      selectDate(date);
    }
    function selectDate(date, isNow = false) {
      if (isNow) {
        date = dayjsLocal(date);
        hour.value = date.hour();
        minute.value = date.minute();
        second.value = date.second();
      }
      let systemParsedDate = date ? dayjsSystem(toValue(date)).format("YYYY-MM-DD HH:mm:ss") : "";
      emit("change", systemParsedDate);
      emit("update:modelValue", systemParsedDate);
    }
    function toValue(date) {
      if (!date || date.toString() === "Invalid Date") return "";
      return dayjs(date).set("hour", hour.value).set("minute", minute.value).set("second", second.value).format("YYYY-MM-DD HH:mm:ss");
    }
    function twoDigit(number) {
      return number.toString().padStart(2, "0");
    }
    function updateDate(date) {
      date = getDate(date);
      hour.value = date.getHours();
      minute.value = date.getMinutes();
      second.value = date.getSeconds();
      selectDate(date);
    }
    function selectCurrentMonthYear() {
      let date = dateValue.value ? getDate(dateValue.value) : getDate();
      if (date.toString() === "Invalid Date") {
        date = getDate();
      }
      currentYear.value = date.getFullYear();
      currentMonth.value = date.getMonth() + 1;
      hour.value = date.getHours();
      minute.value = date.getMinutes();
      second.value = date.getSeconds();
    }
    onMounted(() => selectCurrentMonthYear());
    const __returned__ = { props, emit, currentYear, currentMonth, today, datesAsWeeks, formattedMonth, prevMonth, nextMonth, marginClass, hour, minute, second, dateValue, changeTime, selectDate, toValue, twoDigit, updateDate, selectCurrentMonthYear, get Button() {
      return Button;
    }, FeatherIcon, get Popover() {
      return __unplugin_components_1;
    }, get TextInput() {
      return TextInput;
    }, get getDate() {
      return getDate;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "flex items-center p-1 text-ink-gray-4" };
const _hoisted_2$1 = { class: "flex-1 text-center text-base font-medium text-ink-gray-6" };
const _hoisted_3$1 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_4$1 = { class: "flex flex-col items-center justify-center p-1 text-ink-gray-8" };
const _hoisted_5$1 = { class: "flex items-center text-xs uppercase" };
const _hoisted_6$1 = ["onClick"];
const _hoisted_7$1 = { class: "flex items-center justify-around gap-2 p-1" };
const _hoisted_8 = { class: "flex flex-col items-center justify-center" };
const _hoisted_9 = { class: "slider flex min-h-4 items-center justify-center" };
const _hoisted_10 = { class: "slider flex min-h-4 items-center justify-center" };
const _hoisted_11 = { class: "slider flex min-h-4 items-center justify-center" };
const _hoisted_12 = { class: "flex justify-end p-1" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    onOpen: $setup.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full",
    placement: $props.placement
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode($setup["TextInput"], mergeProps({
        readonly: "",
        type: "text",
        placeholder: $props.placeholder,
        value: $setup.dateValue && $props.formatter ? $props.formatter($setup.dateValue) : $setup.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), createSlots({
        _: 2
        /* DYNAMIC */
      }, [
        _ctx.$slots.prefix ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix", {}, void 0, true)
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["w-fit select-none text-base text-ink-gray-9 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none", $setup.marginClass])
        },
        [
          createCommentVNode(" Month Switcher "),
          createBaseVNode("div", _hoisted_1$1, [
            createVNode($setup["Button"], {
              variant: "ghost",
              class: "h-7 w-7",
              onClick: $setup.prevMonth
            }, {
              default: withCtx(() => [
                createVNode($setup["FeatherIcon"], {
                  "stroke-width": 2,
                  name: "chevron-left",
                  class: "h-4 w-4"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["onClick"]),
            createBaseVNode(
              "div",
              _hoisted_2$1,
              toDisplayString($setup.formattedMonth),
              1
              /* TEXT */
            ),
            createVNode($setup["Button"], {
              variant: "ghost",
              class: "h-7 w-7",
              onClick: $setup.nextMonth
            }, {
              default: withCtx(() => [
                createVNode($setup["FeatherIcon"], {
                  "stroke-width": 2,
                  name: "chevron-right",
                  class: "h-4 w-4"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["onClick"])
          ]),
          createCommentVNode(" Date Time Input "),
          createBaseVNode("div", _hoisted_3$1, [
            createVNode($setup["TextInput"], {
              class: "text-sm",
              type: "text",
              value: $setup.dateValue,
              onChange: (e) => {
                $setup.updateDate(e.target.value);
                togglePopover();
              }
            }, null, 8, ["value", "onChange"]),
            createVNode($setup["Button"], {
              label: "Now",
              class: "text-sm",
              onClick: () => {
                $setup.selectDate($setup.getDate(), true);
                togglePopover();
              }
            }, null, 8, ["onClick"])
          ]),
          createCommentVNode(" Date Picker "),
          createBaseVNode("div", _hoisted_4$1, [
            createBaseVNode("div", _hoisted_5$1, [
              (openBlock(), createElementBlock(
                Fragment,
                null,
                renderList(["s", "m", "t", "w", "t", "f", "s"], (d, i) => {
                  return createBaseVNode(
                    "div",
                    {
                      class: "flex h-6 w-8 items-center justify-center text-center",
                      key: i
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
              renderList($setup.datesAsWeeks, (week, i) => {
                return openBlock(), createElementBlock("div", {
                  class: "flex items-center",
                  key: i
                }, [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList(week, (date) => {
                      return openBlock(), createElementBlock("div", {
                        key: $setup.toValue(date),
                        class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-surface-gray-2", {
                          "text-ink-gray-3": date.getMonth() !== $setup.currentMonth - 1,
                          "font-extrabold text-ink-gray-9": $setup.toValue(date) === $setup.toValue($setup.today),
                          "bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": $setup.toValue(date) === $setup.dateValue
                        }]),
                        onClick: () => {
                          $setup.selectDate(date);
                          togglePopover();
                        }
                      }, toDisplayString(date.getDate()), 11, _hoisted_6$1);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          createCommentVNode(" Time Picker "),
          createBaseVNode("div", _hoisted_7$1, [
            createBaseVNode(
              "div",
              null,
              toDisplayString($setup.twoDigit($setup.hour)) + " : " + toDisplayString($setup.twoDigit($setup.minute)) + " : " + toDisplayString($setup.twoDigit($setup.second)),
              1
              /* TEXT */
            ),
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("div", _hoisted_9, [
                createVNode($setup["TextInput"], {
                  modelValue: $setup.hour,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.hour = $event),
                  name: "hours",
                  type: "range",
                  min: "0",
                  max: "23",
                  step: "1",
                  onChange: () => {
                    $setup.changeTime();
                    togglePopover();
                  }
                }, null, 8, ["modelValue", "onChange"])
              ]),
              createBaseVNode("div", _hoisted_10, [
                createVNode($setup["TextInput"], {
                  modelValue: $setup.minute,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.minute = $event),
                  name: "minutes",
                  type: "range",
                  min: "0",
                  max: "59",
                  step: "1",
                  onChange: () => {
                    $setup.changeTime();
                    togglePopover();
                  }
                }, null, 8, ["modelValue", "onChange"])
              ]),
              createBaseVNode("div", _hoisted_11, [
                createVNode($setup["TextInput"], {
                  modelValue: $setup.second,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.second = $event),
                  name: "seconds",
                  type: "range",
                  min: "0",
                  max: "59",
                  step: "1",
                  onChange: () => {
                    $setup.changeTime();
                    togglePopover();
                  }
                }, null, 8, ["modelValue", "onChange"])
              ])
            ])
          ]),
          createCommentVNode(" Actions "),
          createBaseVNode("div", _hoisted_12, [
            createVNode($setup["Button"], {
              label: "Clear",
              class: "text-sm",
              onClick: () => {
                $setup.selectDate("");
                togglePopover();
              }
            }, null, 8, ["onClick"])
          ])
        ],
        2
        /* CLASS */
      )
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["placement"]);
}
_sfc_main$1.__file = "src/components/DatePicker/DateTimePicker.vue";
const DateTimePicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-6b0e7566"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker/DateTimePicker.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DateRangePicker",
  props: {
    value: { type: [String, Array], required: false },
    modelValue: { type: [String, Array], required: false },
    placeholder: { type: String, required: false },
    formatter: { type: Function, required: false },
    readonly: { type: Boolean, required: false },
    inputClass: { type: [String, Array, Object], required: false },
    placement: { type: String, required: false }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      currentYear,
      currentMonth,
      today,
      datesAsWeeks,
      formattedMonth,
      prevMonth,
      nextMonth
    } = useDatePicker();
    const marginClass = computed(() => {
      var _a, _b, _c;
      let _marginClass = "mt-2";
      if ((_a = props.placement) == null ? void 0 : _a.startsWith("top")) {
        _marginClass = "mb-2";
      } else if ((_b = props.placement) == null ? void 0 : _b.startsWith("left")) {
        _marginClass = "mr-2";
      } else if ((_c = props.placement) == null ? void 0 : _c.startsWith("right")) {
        _marginClass = "ml-2";
      }
      return _marginClass;
    });
    const dateValue = computed(() => {
      return props.value ? props.value : props.modelValue;
    });
    const fromDate = ref("");
    const toDate = ref("");
    function handleDateClick(date) {
      if (fromDate.value && toDate.value) {
        fromDate.value = getDateValue(date);
        toDate.value = "";
      } else if (fromDate.value && !toDate.value) {
        toDate.value = getDateValue(date);
      } else {
        fromDate.value = getDateValue(date);
      }
      swapDatesIfNecessary();
    }
    function swapDatesIfNecessary() {
      if (!fromDate.value || !toDate.value) {
        return;
      }
      let from = getDate(fromDate.value);
      let to = getDate(toDate.value);
      if (from > to) {
        let temp = from;
        from = to;
        to = temp;
      }
      fromDate.value = getDateValue(from);
      toDate.value = getDateValue(to);
    }
    function selectDates() {
      let val = `${fromDate.value},${toDate.value}`;
      if (!fromDate.value && !toDate.value) {
        val = "";
      }
      emit("change", val);
      emit("update:modelValue", val);
    }
    function selectCurrentMonthYear() {
      let date = toDate.value ? getDate(toDate.value) : today.value;
      currentYear.value = date.getFullYear();
      currentMonth.value = date.getMonth() + 1;
    }
    function isInRange(date) {
      if (!fromDate.value || !toDate.value) {
        return false;
      }
      return date >= getDate(fromDate.value) && date <= getDate(toDate.value);
    }
    function formatDates(value) {
      if (!value) return "";
      if (typeof value === "string") {
        value = value.split(",");
      }
      return props.formatter ? props.formatter(value[0]) + " to " + props.formatter(value[1]) : value;
    }
    function clearDates() {
      fromDate.value = "";
      toDate.value = "";
      selectDates();
    }
    const popoverRef = ref();
    onMounted(() => {
      let dates = typeof (dateValue == null ? void 0 : dateValue.value) === "string" ? dateValue.value.split(",") : dateValue.value;
      fromDate.value = (dates == null ? void 0 : dates[0]) || "";
      toDate.value = (dates == null ? void 0 : dates[1]) || "";
      selectCurrentMonthYear();
    });
    __expose({
      open: () => {
        var _a;
        (_a = popoverRef.value) == null ? void 0 : _a.open();
      }
    });
    const __returned__ = { props, emit, currentYear, currentMonth, today, datesAsWeeks, formattedMonth, prevMonth, nextMonth, marginClass, dateValue, fromDate, toDate, handleDateClick, swapDatesIfNecessary, selectDates, selectCurrentMonthYear, isInRange, formatDates, clearDates, popoverRef, get Popover() {
      return __unplugin_components_1;
    }, get TextInput() {
      return TextInput;
    }, get getDateValue() {
      return getDateValue;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex items-center p-1 text-ink-gray-4" };
const _hoisted_2 = { class: "flex-1 text-center text-base font-medium text-ink-gray-6" };
const _hoisted_3 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_4 = { class: "flex flex-col items-center justify-center p-1 text-ink-gray-8" };
const _hoisted_5 = { class: "flex items-center text-xs uppercase" };
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { class: "flex justify-end space-x-1 p-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FeatherIcon = FeatherIcon;
  const _component_Button = Button;
  return openBlock(), createBlock($setup["Popover"], {
    ref: "popoverRef",
    onOpen: $setup.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full",
    placement: $props.placement
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode($setup["TextInput"], mergeProps({
        readonly: "",
        type: "text",
        placeholder: $props.placeholder,
        value: $setup.dateValue && $props.formatter ? $setup.formatDates($setup.dateValue) : $setup.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), createSlots({
        _: 2
        /* DYNAMIC */
      }, [
        _ctx.$slots.prefix ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["w-fit select-none text-base text-ink-gray-9 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none", $setup.marginClass])
        },
        [
          createCommentVNode(" Month Switcher "),
          createBaseVNode("div", _hoisted_1, [
            createVNode(_component_Button, {
              variant: "ghost",
              class: "h-7 w-7",
              onClick: $setup.prevMonth
            }, {
              default: withCtx(() => [
                createVNode(_component_FeatherIcon, {
                  "stroke-width": 2,
                  name: "chevron-left",
                  class: "h-4 w-4"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["onClick"]),
            createBaseVNode(
              "div",
              _hoisted_2,
              toDisplayString($setup.formattedMonth),
              1
              /* TEXT */
            ),
            createVNode(_component_Button, {
              variant: "ghost",
              class: "h-7 w-7",
              onClick: $setup.nextMonth
            }, {
              default: withCtx(() => [
                createVNode(_component_FeatherIcon, {
                  "stroke-width": 2,
                  name: "chevron-right",
                  class: "h-4 w-4"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["onClick"])
          ]),
          createCommentVNode(" Date Range Inputs "),
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["TextInput"], {
              class: "w-28 text-sm",
              type: "text",
              modelValue: $setup.fromDate,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.fromDate = $event)
            }, null, 8, ["modelValue"]),
            createVNode($setup["TextInput"], {
              class: "w-28 text-sm",
              type: "text",
              modelValue: $setup.toDate,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.toDate = $event)
            }, null, 8, ["modelValue"])
          ]),
          createCommentVNode(" Calendar "),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("div", _hoisted_5, [
              (openBlock(), createElementBlock(
                Fragment,
                null,
                renderList(["s", "m", "t", "w", "t", "f", "s"], (d, i) => {
                  return createBaseVNode(
                    "div",
                    {
                      class: "flex h-6 w-8 items-center justify-center text-center",
                      key: i
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
              renderList($setup.datesAsWeeks, (week, i) => {
                return openBlock(), createElementBlock("div", {
                  class: "flex items-center",
                  key: i
                }, [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList(week, (date) => {
                      return openBlock(), createElementBlock("div", {
                        key: $setup.getDateValue(date),
                        class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-surface-gray-2", {
                          "text-ink-gray-3": date.getMonth() !== $setup.currentMonth - 1,
                          "text-ink-gray-9": date.getMonth() === $setup.currentMonth - 1,
                          "font-extrabold text-ink-gray-9": $setup.getDateValue(date) === $setup.getDateValue($setup.today),
                          "rounded-none bg-surface-gray-3": $setup.isInRange(date),
                          "rounded-l-md rounded-r-none bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": $setup.fromDate && $setup.getDateValue(date) === $setup.getDateValue($setup.fromDate),
                          "rounded-r-md bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6": $setup.toDate && $setup.getDateValue(date) === $setup.getDateValue($setup.toDate)
                        }]),
                        onClick: () => $setup.handleDateClick(date)
                      }, toDisplayString(date.getDate()), 11, _hoisted_6);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          createCommentVNode(" Actions "),
          createBaseVNode("div", _hoisted_7, [
            createVNode(_component_Button, {
              label: "Clear",
              onClick: () => {
                $setup.clearDates();
                togglePopover();
              },
              disabled: !$setup.fromDate || !$setup.toDate
            }, null, 8, ["onClick", "disabled"]),
            createVNode(_component_Button, {
              variant: "solid",
              label: "Apply",
              disabled: !$setup.fromDate || !$setup.toDate,
              onClick: () => {
                $setup.selectDates();
                togglePopover();
              }
            }, null, 8, ["disabled", "onClick"])
          ])
        ],
        2
        /* CLASS */
      )
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["placement"]);
}
_sfc_main.__file = "src/components/DatePicker/DateRangePicker.vue";
const DateRangePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker/DateRangePicker.vue"]]);
export {
  DatePicker as D,
  DateTimePicker as a,
  DateRangePicker as b
};
