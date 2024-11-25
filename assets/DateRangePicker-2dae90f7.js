import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, aN as toDisplayString, aH as createCommentVNode, aF as createBaseVNode, aC as createBlock, aW as normalizeClass, aL as mergeProps, aK as Fragment, aJ as renderList, az as ref, aQ as computed, ay as defineComponent, bu as onMounted, aD as withCtx, aE as createVNode } from "./vendor-5a4062d3.js";
import { B as Button } from "./Button-3db9f7c1.js";
import { P as Popover } from "./Popover-e67461fb.js";
import { F as FeatherIcon } from "./FeatherIcon-3a4d72e4.js";
import { T as TextInput } from "./TextInput-b6fe3efa.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import { d as debounce } from "./debounce-d11286cd.js";
const Input_vue_vue_type_style_index_0_lang = "";
const _sfc_main$3 = {
  name: "Input",
  inheritAttrs: false,
  expose: ["getInputValue"],
  components: { FeatherIcon },
  props: {
    label: {
      type: String
    },
    type: {
      type: String,
      default: "text",
      validator(value) {
        let isValid = [
          "text",
          "number",
          "checkbox",
          "textarea",
          "select",
          "email",
          "password",
          "date"
        ].includes(value);
        if (!isValid) {
          console.warn(`Invalid value "${value}" for "type" prop for Input`);
        }
        return isValid;
      }
    },
    modelValue: {
      type: [String, Number, Boolean, Object, Array]
    },
    inputClass: {
      type: [String, Array, Object]
    },
    debounce: {
      type: Number
    },
    options: {
      type: Array
    },
    disabled: {
      type: Boolean
    },
    rows: {
      type: Number,
      default: 3
    },
    placeholder: {
      type: String
    },
    iconLeft: {
      type: String
    }
  },
  emits: ["input", "change", "update:modelValue"],
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    getInputValue(e) {
      let $input = e ? e.target : this.$refs.input;
      let value = $input.value;
      if (this.type == "checkbox") {
        value = $input.checked;
      }
      return value;
    }
  },
  computed: {
    passedInputValue() {
      if ("value" in this.$attrs) {
        return this.$attrs.value;
      }
      return this.modelValue || null;
    },
    inputAttributes() {
      let attrs = {};
      let onInput = (e) => {
        this.$emit("input", this.getInputValue(e));
      };
      if (this.debounce) {
        onInput = debounce(onInput, this.debounce);
      }
      if (this.type == "checkbox") {
        attrs.checked = this.passedInputValue;
      }
      return Object.assign(attrs, this.$attrs, {
        onInput,
        onChange: (e) => {
          this.$emit("change", this.getInputValue(e));
          this.$emit("update:modelValue", this.getInputValue(e));
        }
      });
    },
    selectOptions() {
      return this.options.map((option) => {
        if (typeof option === "string") {
          return {
            label: option,
            value: option
          };
        }
        return option;
      }).filter(Boolean);
    },
    isNormalInput() {
      return [
        "text",
        "number",
        "checkbox",
        "email",
        "password",
        "date"
      ].includes(this.type);
    }
  }
};
const _hoisted_1$3 = {
  key: 0,
  class: "mb-2 block text-sm leading-4 text-gray-700"
};
const _hoisted_2$3 = ["type", "disabled", "placeholder", "value"];
const _hoisted_3$3 = ["placeholder", "value", "disabled", "rows"];
const _hoisted_4$3 = ["disabled"];
const _hoisted_5$3 = ["value", "disabled", "selected"];
const _hoisted_6$3 = {
  key: 1,
  class: "ml-2 inline-block text-base leading-4"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FeatherIcon = resolveComponent("FeatherIcon");
  return openBlock(), createElementBlock(
    "label",
    {
      class: normalizeClass([$props.type == "checkbox" ? "flex" : "block", _ctx.$attrs.class])
    },
    [
      $props.label && $props.type != "checkbox" ? (openBlock(), createElementBlock(
        "span",
        _hoisted_1$3,
        toDisplayString($props.label),
        1
        /* TEXT */
      )) : createCommentVNode("v-if", true),
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["relative flex", { "items-center": $options.isNormalInput || $props.type == "select" }])
        },
        [
          $props.iconLeft && $props.type != "checkbox" ? (openBlock(), createBlock(_component_FeatherIcon, {
            key: 0,
            name: $props.iconLeft,
            class: normalizeClass(["absolute mx-2 h-4 w-4 text-gray-600", { "mt-2": $props.type == "textarea" }])
          }, null, 8, ["name", "class"])) : createCommentVNode("v-if", true),
          $options.isNormalInput ? (openBlock(), createElementBlock("input", mergeProps({ key: 1 }, $options.inputAttributes, {
            class: ["border-gray-400 placeholder-gray-500", [
              {
                "form-input block w-full": $props.type != "checkbox",
                "form-checkbox": $props.type == "checkbox",
                "pl-8": $props.iconLeft && $props.type != "checkbox"
              },
              $props.inputClass
            ]],
            ref: "input",
            type: $props.type || "text",
            disabled: $props.disabled,
            placeholder: $props.placeholder,
            value: $options.passedInputValue
          }), null, 16, _hoisted_2$3)) : createCommentVNode("v-if", true),
          $props.type === "textarea" ? (openBlock(), createElementBlock("textarea", mergeProps({ key: 2 }, $options.inputAttributes, {
            placeholder: $props.placeholder,
            class: ["placeholder-gray-500", [
              "form-textarea block w-full resize-none",
              $props.inputClass,
              {
                "pl-8": $props.iconLeft
              }
            ]],
            ref: "input",
            value: $options.passedInputValue,
            disabled: $props.disabled,
            rows: $props.rows
          }), null, 16, _hoisted_3$3)) : createCommentVNode("v-if", true),
          $props.type === "select" ? (openBlock(), createElementBlock("select", mergeProps({ key: 3 }, $options.inputAttributes, {
            class: ["form-select block w-full", { "pl-8": $props.iconLeft }],
            ref: "input",
            disabled: $props.disabled
          }), [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($options.selectOptions, (option) => {
                return openBlock(), createElementBlock("option", {
                  key: option.value,
                  value: option.value,
                  disabled: option.disabled || false,
                  selected: $options.passedInputValue === option.value
                }, toDisplayString(option.label), 9, _hoisted_5$3);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ], 16, _hoisted_4$3)) : createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      $props.label && $props.type == "checkbox" ? (openBlock(), createElementBlock(
        "span",
        _hoisted_6$3,
        toDisplayString($props.label),
        1
        /* TEXT */
      )) : createCommentVNode("v-if", true)
    ],
    2
    /* CLASS */
  );
}
_sfc_main$3.__file = "src/components/Input.vue";
const Input = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Input.vue"]]);
function getDate(...args) {
  return new Date(...args);
}
function getDateValue(date) {
  if (!date || date.toString() === "Invalid Date")
    return "";
  if (typeof date === "string") {
    date = new Date(date);
  }
  date.setHours(0, -date.getTimezoneOffset(), 0, 0);
  return date.toISOString().slice(0, 10);
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
  if (year % 400 === 0)
    return true;
  if (year % 100 === 0)
    return false;
  if (year % 4 === 0)
    return true;
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
    value: { type: String, required: false },
    modelValue: { type: String, required: false },
    placeholder: { type: String, required: false },
    formatter: { type: Function, required: false },
    readonly: { type: Boolean, required: false },
    inputClass: { type: [String, Array, Object], required: false }
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
    const dateValue = computed(() => {
      return props.value ? props.value : props.modelValue;
    });
    function selectDate(date) {
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
    const __returned__ = { props, emit, currentYear, currentMonth, today, datesAsWeeks, formattedMonth, prevMonth, nextMonth, dateValue, selectDate, selectCurrentMonthYear, Input, get Button() {
      return Button;
    }, Popover, FeatherIcon, TextInput, get getDate() {
      return getDate;
    }, get getDateValue() {
      return getDateValue;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = { class: "mt-2 w-fit select-none divide-y rounded-lg bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" };
const _hoisted_2$2 = { class: "flex items-center p-1 text-gray-500" };
const _hoisted_3$2 = { class: "flex-1 text-center text-base font-medium text-gray-700" };
const _hoisted_4$2 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_5$2 = { class: "flex flex-col items-center justify-center p-1 text-gray-800" };
const _hoisted_6$2 = { class: "flex items-center text-xs uppercase" };
const _hoisted_7$2 = ["onClick"];
const _hoisted_8$2 = { class: "flex justify-end p-1" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    onOpen: $setup.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full"
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode($setup["Input"], mergeProps({
        readonly: "",
        type: "text",
        "icon-left": "calendar",
        placeholder: $props.placeholder,
        value: $setup.dateValue && $props.formatter ? $props.formatter($setup.dateValue) : $setup.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), null, 16, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createCommentVNode(" Month Switcher "),
      createBaseVNode("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
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
            _hoisted_3$2,
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
        createBaseVNode("div", _hoisted_4$2, [
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
              $setup.selectDate($setup.getDate());
              togglePopover();
            }
          }, null, 8, ["onClick"])
        ]),
        createCommentVNode(" Calendar "),
        createBaseVNode("div", _hoisted_5$2, [
          createBaseVNode("div", _hoisted_6$2, [
            (openBlock(), createElementBlock(
              Fragment,
              null,
              renderList(["su", "mo", "tu", "we", "th", "fr", "sa"], (d, i) => {
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
                      class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50", {
                        "text-gray-400": date.getMonth() !== $setup.currentMonth - 1,
                        "font-extrabold text-gray-900": $setup.getDateValue(date) === $setup.getDateValue($setup.today),
                        "bg-gray-800 text-white hover:bg-gray-800": $setup.getDateValue(date) === $setup.dateValue
                      }]),
                      onClick: () => {
                        $setup.selectDate(date);
                        togglePopover();
                      }
                    }, toDisplayString(date.getDate()), 11, _hoisted_7$2);
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
        createBaseVNode("div", _hoisted_8$2, [
          createVNode($setup["Button"], {
            label: "Clear",
            class: "text-sm",
            onClick: () => {
              $setup.selectDate("");
              togglePopover();
            }
          }, null, 8, ["onClick"])
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main$2.__file = "src/components/DatePicker.vue";
const DatePicker = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker.vue"]]);
const DateTimePicker_vue_vue_type_style_index_0_scoped_8ea52a80_lang = "";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DateTimePicker",
  props: {
    value: { type: String, required: false },
    modelValue: { type: String, required: false },
    placeholder: { type: String, required: false },
    formatter: { type: Function, required: false },
    readonly: { type: Boolean, required: false },
    inputClass: { type: [String, Array, Object], required: false }
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
    const hour = ref(0);
    const minute = ref(0);
    const second = ref(0);
    const dateValue = computed(() => {
      return props.value ? props.value : props.modelValue;
    });
    function changeTime() {
      let date = dateValue.value ? getDate(dateValue.value) : getDate();
      selectDate(date, true);
    }
    function selectDate(date, isTimeChange = false, isNow = false) {
      if (!isTimeChange) {
        let currentDate = dateValue.value && !isNow ? getDate(dateValue.value) : getDate();
        hour.value = currentDate.getHours();
        minute.value = currentDate.getMinutes();
        second.value = currentDate.getSeconds();
      }
      emit("change", toValue(date));
      emit("update:modelValue", toValue(date));
    }
    function toValue(date) {
      if (!date || date.toString() === "Invalid Date")
        return "";
      if (typeof date === "string") {
        date = new Date(date);
      }
      date.setHours(hour.value, minute.value, second.value, 0);
      return `${date.getFullYear()}-${twoDigit(
        date.getMonth() + 1
      )}-${twoDigit(date.getDate())} ${twoDigit(
        date.getHours()
      )}:${twoDigit(date.getMinutes())}:${twoDigit(date.getSeconds())}`;
    }
    function twoDigit(number) {
      return number.toString().padStart(2, "0");
    }
    function updateDate(date) {
      date = getDate(date);
      hour.value = date.getHours();
      minute.value = date.getMinutes();
      second.value = date.getSeconds();
      selectDate(date, true);
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
    const __returned__ = { props, emit, currentYear, currentMonth, today, datesAsWeeks, formattedMonth, prevMonth, nextMonth, hour, minute, second, dateValue, changeTime, selectDate, toValue, twoDigit, updateDate, selectCurrentMonthYear, Input, get Button() {
      return Button;
    }, Popover, FeatherIcon, TextInput, get getDate() {
      return getDate;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "mt-2 w-fit select-none divide-y rounded-lg bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" };
const _hoisted_2$1 = { class: "flex items-center p-1 text-gray-500" };
const _hoisted_3$1 = { class: "flex-1 text-center text-base font-medium text-gray-700" };
const _hoisted_4$1 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_5$1 = { class: "flex flex-col items-center justify-center p-1 text-gray-800" };
const _hoisted_6$1 = { class: "flex items-center text-xs uppercase" };
const _hoisted_7$1 = ["onClick"];
const _hoisted_8$1 = { class: "flex items-center justify-around gap-2 p-1" };
const _hoisted_9 = { class: "flex flex-col items-center justify-center" };
const _hoisted_10 = { class: "slider flex min-h-4 items-center justify-center" };
const _hoisted_11 = { class: "slider flex min-h-4 items-center justify-center" };
const _hoisted_12 = { class: "slider flex min-h-4 items-center justify-center" };
const _hoisted_13 = { class: "flex justify-end p-1" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    onOpen: $setup.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full"
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode($setup["Input"], mergeProps({
        readonly: "",
        type: "text",
        "icon-left": "calendar",
        placeholder: $props.placeholder,
        value: $setup.dateValue && $props.formatter ? $props.formatter($setup.dateValue) : $setup.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), null, 16, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createCommentVNode(" Month Switcher "),
      createBaseVNode("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
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
            _hoisted_3$1,
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
        createBaseVNode("div", _hoisted_4$1, [
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
              $setup.selectDate($setup.getDate(), false, true);
              togglePopover();
            }
          }, null, 8, ["onClick"])
        ]),
        createCommentVNode(" Date Picker "),
        createBaseVNode("div", _hoisted_5$1, [
          createBaseVNode("div", _hoisted_6$1, [
            (openBlock(), createElementBlock(
              Fragment,
              null,
              renderList(["su", "mo", "tu", "we", "th", "fr", "sa"], (d, i) => {
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
                      class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50", {
                        "text-gray-400": date.getMonth() !== $setup.currentMonth - 1,
                        "font-extrabold text-gray-900": $setup.toValue(date) === $setup.toValue($setup.today),
                        "bg-gray-800 text-white hover:bg-gray-800": $setup.toValue(date) === $setup.dateValue
                      }]),
                      onClick: () => {
                        $setup.selectDate(date);
                        togglePopover();
                      }
                    }, toDisplayString(date.getDate()), 11, _hoisted_7$1);
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
        createBaseVNode("div", _hoisted_8$1, [
          createBaseVNode(
            "div",
            null,
            toDisplayString($setup.twoDigit($setup.hour)) + " : " + toDisplayString($setup.twoDigit($setup.minute)) + " : " + toDisplayString($setup.twoDigit($setup.second)),
            1
            /* TEXT */
          ),
          createBaseVNode("div", _hoisted_9, [
            createBaseVNode("div", _hoisted_10, [
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
            createBaseVNode("div", _hoisted_11, [
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
            createBaseVNode("div", _hoisted_12, [
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
        createBaseVNode("div", _hoisted_13, [
          createVNode($setup["Button"], {
            label: "Clear",
            class: "text-sm",
            onClick: () => {
              $setup.selectDate("");
              togglePopover();
            }
          }, null, 8, ["onClick"])
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main$1.__file = "src/components/DateTimePicker.vue";
const DateTimePicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-8ea52a80"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DateTimePicker.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DateRangePicker",
  props: {
    value: { type: String, required: false },
    modelValue: { type: String, required: false },
    placeholder: { type: String, required: false },
    formatter: { type: Function, required: false },
    readonly: { type: Boolean, required: false },
    inputClass: { type: [String, Array, Object], required: false }
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
    const dateValue = computed(() => {
      return props.value ? props.value : props.modelValue;
    });
    const fromDate = ref(dateValue.value ? dateValue.value[0] : "");
    const toDate = ref(dateValue.value ? dateValue.value[1] : "");
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
      if (!value) {
        return "";
      }
      const values = value.split(",");
      return props.formatter ? props.formatter(values[0]) + " to " + props.formatter(values[1]) : value;
    }
    function clearDates() {
      fromDate.value = "";
      toDate.value = "";
      selectDates();
    }
    onMounted(() => selectCurrentMonthYear());
    const __returned__ = { props, emit, currentYear, currentMonth, today, datesAsWeeks, formattedMonth, prevMonth, nextMonth, dateValue, fromDate, toDate, handleDateClick, swapDatesIfNecessary, selectDates, selectCurrentMonthYear, isInRange, formatDates, clearDates, Input, get Button() {
      return Button;
    }, Popover, FeatherIcon, TextInput, get getDateValue() {
      return getDateValue;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "mt-2 w-fit select-none divide-y rounded-lg bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" };
const _hoisted_2 = { class: "flex items-center p-1 text-gray-500" };
const _hoisted_3 = { class: "flex-1 text-center text-base font-medium text-gray-700" };
const _hoisted_4 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_5 = { class: "flex flex-col items-center justify-center p-1 text-gray-800" };
const _hoisted_6 = { class: "flex items-center text-xs uppercase" };
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { class: "flex justify-end space-x-1 p-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    onOpen: $setup.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full"
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode($setup["Input"], mergeProps({
        readonly: "",
        type: "text",
        "icon-left": "calendar",
        placeholder: $props.placeholder,
        value: $setup.dateValue && $props.formatter ? $setup.formatDates($setup.dateValue) : $setup.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), null, 16, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createCommentVNode(" Month Switcher "),
      createBaseVNode("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
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
            _hoisted_3,
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
        createCommentVNode(" Date Range Inputs "),
        createBaseVNode("div", _hoisted_4, [
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
        createBaseVNode("div", _hoisted_5, [
          createBaseVNode("div", _hoisted_6, [
            (openBlock(), createElementBlock(
              Fragment,
              null,
              renderList(["su", "mo", "tu", "we", "th", "fr", "sa"], (d, i) => {
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
                      class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50", {
                        "text-gray-400": date.getMonth() !== $setup.currentMonth - 1,
                        "text-gray-900": date.getMonth() === $setup.currentMonth - 1,
                        "font-extrabold text-gray-900": $setup.getDateValue(date) === $setup.getDateValue($setup.today),
                        "rounded-none bg-gray-100": $setup.isInRange(date),
                        "rounded-l-md rounded-r-none bg-gray-800 text-white hover:bg-gray-800": $setup.fromDate && $setup.getDateValue(date) === $setup.getDateValue($setup.fromDate),
                        "rounded-r-md bg-gray-800 text-white hover:bg-gray-800": $setup.toDate && $setup.getDateValue(date) === $setup.getDateValue($setup.toDate)
                      }]),
                      onClick: () => $setup.handleDateClick(date)
                    }, toDisplayString(date.getDate()), 11, _hoisted_7);
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
        createBaseVNode("div", _hoisted_8, [
          createVNode($setup["Button"], {
            label: "Clear",
            onClick: () => {
              $setup.clearDates();
              togglePopover();
            },
            disabled: !$setup.fromDate || !$setup.toDate
          }, null, 8, ["onClick", "disabled"]),
          createVNode($setup["Button"], {
            variant: "solid",
            label: "Apply",
            disabled: !$setup.fromDate || !$setup.toDate,
            onClick: () => {
              $setup.selectDates();
              togglePopover();
            }
          }, null, 8, ["disabled", "onClick"])
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/DateRangePicker.vue";
const DateRangePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DateRangePicker.vue"]]);
export {
  DatePicker as D,
  DateTimePicker as a,
  DateRangePicker as b
};
