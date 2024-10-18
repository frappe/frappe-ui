import { B as Button } from "./Button-82883e94.js";
import { P as Popover } from "./Popover-fde287bf.js";
import { F as FeatherIcon } from "./FeatherIcon-2fe58b00.js";
import { T as TextInput } from "./TextInput-5a8bc4aa.js";
import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, aN as toDisplayString, aH as createCommentVNode, aF as createBaseVNode, aC as createBlock, aW as normalizeClass, aL as mergeProps, aK as Fragment, aJ as renderList, aD as withCtx, aE as createVNode } from "./vendor-8a63165b.js";
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
const _sfc_main$2 = {
  name: "DatePicker",
  props: {
    value: {
      type: String
    },
    modelValue: {
      type: String
    },
    placeholder: {
      type: String
    },
    formatter: {
      type: Function,
      default: null
    },
    readonly: {
      type: Boolean
    },
    inputClass: {
      type: [String, Array, Object]
    }
  },
  emits: ["update:modelValue", "change"],
  components: {
    Popover,
    Input,
    Button,
    FeatherIcon,
    TextInput
  },
  data() {
    return {
      currentYear: null,
      currentMonth: null
    };
  },
  created() {
    this.selectCurrentMonthYear();
  },
  computed: {
    today() {
      return this.getDate();
    },
    datesAsWeeks() {
      let datesAsWeeks = [];
      let dates = this.dates.slice();
      while (dates.length) {
        let week = dates.splice(0, 7);
        datesAsWeeks.push(week);
      }
      return datesAsWeeks;
    },
    dates() {
      if (!(this.currentYear && this.currentMonth)) {
        return [];
      }
      let monthIndex = this.currentMonth - 1;
      let year = this.currentYear;
      let firstDayOfMonth = this.getDate(year, monthIndex, 1);
      let lastDayOfMonth = this.getDate(year, monthIndex + 1, 0);
      let leftPaddingCount = firstDayOfMonth.getDay();
      let rightPaddingCount = 6 - lastDayOfMonth.getDay();
      let leftPadding = this.getDatesAfter(firstDayOfMonth, -leftPaddingCount);
      let rightPadding = this.getDatesAfter(lastDayOfMonth, rightPaddingCount);
      let daysInMonth = this.getDaysInMonth(monthIndex, year);
      let datesInMonth = this.getDatesAfter(firstDayOfMonth, daysInMonth - 1);
      let dates = [
        ...leftPadding,
        firstDayOfMonth,
        ...datesInMonth,
        ...rightPadding
      ];
      if (dates.length < 42) {
        const finalPadding = this.getDatesAfter(dates.at(-1), 42 - dates.length);
        dates = dates.concat(...finalPadding);
      }
      return dates;
    },
    formatMonth() {
      let date = this.getDate(this.currentYear, this.currentMonth - 1, 1);
      let month = date.toLocaleString("en-US", {
        month: "long"
      });
      return `${month}, ${date.getFullYear()}`;
    },
    dateValue() {
      return this.value ? this.value : this.modelValue;
    }
  },
  methods: {
    selectDate(date) {
      this.$emit("change", this.toValue(date));
      this.$emit("update:modelValue", this.toValue(date));
    },
    selectCurrentMonthYear() {
      let date = this.dateValue ? this.getDate(this.dateValue) : this.getDate();
      if (date === "Invalid Date") {
        date = this.getDate();
      }
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
    },
    prevMonth() {
      this.changeMonth(-1);
    },
    nextMonth() {
      this.changeMonth(1);
    },
    changeMonth(adder) {
      this.currentMonth = this.currentMonth + adder;
      if (this.currentMonth < 1) {
        this.currentMonth = 12;
        this.currentYear = this.currentYear - 1;
      }
      if (this.currentMonth > 12) {
        this.currentMonth = 1;
        this.currentYear = this.currentYear + 1;
      }
    },
    getDatesAfter(date, count) {
      let incrementer = 1;
      if (count < 0) {
        incrementer = -1;
        count = Math.abs(count);
      }
      let dates = [];
      while (count) {
        date = this.getDate(
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
    },
    getDaysInMonth(monthIndex, year) {
      let daysInMonthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let daysInMonth = daysInMonthMap[monthIndex];
      if (monthIndex === 1 && this.isLeapYear(year)) {
        return 29;
      }
      return daysInMonth;
    },
    isLeapYear(year) {
      if (year % 400 === 0)
        return true;
      if (year % 100 === 0)
        return false;
      if (year % 4 === 0)
        return true;
      return false;
    },
    toValue(date) {
      if (!date) {
        return "";
      }
      date.setHours(0, -date.getTimezoneOffset(), 0, 0);
      return date.toISOString().slice(0, 10);
    },
    getDate(...args) {
      let d = new Date(...args);
      return d;
    }
  }
};
const _hoisted_1$2 = { class: "mt-2 w-fit select-none divide-y rounded-lg bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" };
const _hoisted_2$2 = { class: "flex items-center p-1 text-gray-500" };
const _hoisted_3$2 = { class: "flex-1 text-center text-base font-medium text-gray-700" };
const _hoisted_4$2 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_5$2 = { class: "flex flex-col items-center justify-center p-1 text-gray-800" };
const _hoisted_6$2 = { class: "flex items-center text-xs uppercase" };
const _hoisted_7$2 = ["onClick"];
const _hoisted_8$2 = { class: "flex justify-end p-1" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Input = resolveComponent("Input");
  const _component_FeatherIcon = resolveComponent("FeatherIcon");
  const _component_Button = resolveComponent("Button");
  const _component_TextInput = resolveComponent("TextInput");
  const _component_Popover = resolveComponent("Popover");
  return openBlock(), createBlock(_component_Popover, {
    onOpen: $options.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full"
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode(_component_Input, mergeProps({
        readonly: "",
        type: "text",
        "icon-left": "calendar",
        placeholder: $props.placeholder,
        value: $options.dateValue && $props.formatter ? $props.formatter($options.dateValue) : $options.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), null, 16, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
          createVNode(_component_Button, {
            variant: "ghost",
            class: "h-7 w-7",
            onClick: $options.prevMonth
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
            _hoisted_3$2,
            toDisplayString($options.formatMonth),
            1
            /* TEXT */
          ),
          createVNode(_component_Button, {
            variant: "ghost",
            class: "h-7 w-7",
            onClick: $options.nextMonth
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
        createBaseVNode("div", _hoisted_4$2, [
          createVNode(_component_TextInput, {
            class: "text-sm",
            type: "text",
            value: $options.dateValue,
            onChange: ($event) => $options.selectDate($options.getDate($event.target.value)) || togglePopover()
          }, null, 8, ["value", "onChange"]),
          createVNode(_component_Button, {
            label: "Today",
            class: "text-sm",
            onClick: ($event) => $options.selectDate($options.getDate()) || togglePopover()
          }, null, 8, ["onClick"])
        ]),
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
            renderList($options.datesAsWeeks, (week, i) => {
              return openBlock(), createElementBlock("div", {
                class: "flex items-center",
                key: i
              }, [
                (openBlock(true), createElementBlock(
                  Fragment,
                  null,
                  renderList(week, (date) => {
                    return openBlock(), createElementBlock("div", {
                      key: $options.toValue(date),
                      class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50", {
                        "text-gray-400": date.getMonth() !== $data.currentMonth - 1,
                        "font-extrabold text-gray-900": $options.toValue(date) === $options.toValue($options.today),
                        "bg-gray-800 text-white hover:bg-gray-800": $options.toValue(date) === $options.dateValue
                      }]),
                      onClick: () => {
                        $options.selectDate(date);
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
        createBaseVNode("div", _hoisted_8$2, [
          createVNode(_component_Button, {
            label: "Clear",
            class: "text-sm",
            onClick: () => {
              $options.selectDate("");
              togglePopover();
            }
          }, null, 8, ["onClick"])
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["onOpen"]);
}
_sfc_main$2.__file = "src/components/DatePicker.vue";
const DatePicker = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DatePicker.vue"]]);
const DateTimePicker_vue_vue_type_style_index_0_scoped_8ea52a80_lang = "";
const _sfc_main$1 = {
  name: "DateTimePicker",
  props: {
    value: {
      type: String
    },
    modelValue: {
      type: String
    },
    placeholder: {
      type: String
    },
    formatter: {
      type: Function,
      default: null
    },
    readonly: {
      type: Boolean
    },
    inputClass: {
      type: [String, Array, Object]
    }
  },
  emits: ["update:modelValue", "change"],
  components: {
    Popover,
    Input,
    Button,
    FeatherIcon,
    TextInput
  },
  data() {
    return {
      currentYear: null,
      currentMonth: null,
      hour: 0,
      minute: 0,
      second: 0
    };
  },
  created() {
    this.selectCurrentMonthYear();
  },
  computed: {
    today() {
      return this.getDate();
    },
    datesAsWeeks() {
      let datesAsWeeks = [];
      let dates = this.dates.slice();
      while (dates.length) {
        let week = dates.splice(0, 7);
        datesAsWeeks.push(week);
      }
      return datesAsWeeks;
    },
    dates() {
      if (!(this.currentYear && this.currentMonth)) {
        return [];
      }
      let monthIndex = this.currentMonth - 1;
      let year = this.currentYear;
      let firstDayOfMonth = this.getDate(year, monthIndex, 1);
      let lastDayOfMonth = this.getDate(year, monthIndex + 1, 0);
      let leftPaddingCount = firstDayOfMonth.getDay();
      let rightPaddingCount = 6 - lastDayOfMonth.getDay();
      let leftPadding = this.getDatesAfter(firstDayOfMonth, -leftPaddingCount);
      let rightPadding = this.getDatesAfter(lastDayOfMonth, rightPaddingCount);
      let daysInMonth = this.getDaysInMonth(monthIndex, year);
      let datesInMonth = this.getDatesAfter(firstDayOfMonth, daysInMonth - 1);
      let dates = [
        ...leftPadding,
        firstDayOfMonth,
        ...datesInMonth,
        ...rightPadding
      ];
      if (dates.length < 42) {
        const finalPadding = this.getDatesAfter(dates.at(-1), 42 - dates.length);
        dates = dates.concat(...finalPadding);
      }
      return dates;
    },
    formatMonth() {
      let date = this.getDate(this.currentYear, this.currentMonth - 1, 1);
      let month = date.toLocaleString("en-US", {
        month: "long"
      });
      return `${month}, ${date.getFullYear()}`;
    },
    dateValue() {
      return this.value ? this.value : this.modelValue;
    }
  },
  methods: {
    changeTime() {
      let date = this.dateValue ? this.getDate(this.dateValue) : this.getDate();
      this.selectDate(date, true);
    },
    selectDate(date, isTimeChange = false, isNow = false) {
      if (!isTimeChange) {
        let currentDate = this.dateValue && !isNow ? this.getDate(this.dateValue) : this.getDate();
        this.hour = currentDate.getHours();
        this.minute = currentDate.getMinutes();
        this.second = currentDate.getSeconds();
      }
      this.$emit("change", this.toValue(date));
      this.$emit("update:modelValue", this.toValue(date));
    },
    selectCurrentMonthYear() {
      let date = this.dateValue ? this.getDate(this.dateValue) : this.getDate();
      if (date === "Invalid Date") {
        date = this.getDate();
      }
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
      this.hour = date.getHours();
      this.minute = date.getMinutes();
      this.second = date.getSeconds();
    },
    prevMonth() {
      this.changeMonth(-1);
    },
    nextMonth() {
      this.changeMonth(1);
    },
    changeMonth(adder) {
      this.currentMonth = this.currentMonth + adder;
      if (this.currentMonth < 1) {
        this.currentMonth = 12;
        this.currentYear = this.currentYear - 1;
      }
      if (this.currentMonth > 12) {
        this.currentMonth = 1;
        this.currentYear = this.currentYear + 1;
      }
    },
    getDatesAfter(date, count) {
      let incrementer = 1;
      if (count < 0) {
        incrementer = -1;
        count = Math.abs(count);
      }
      let dates = [];
      while (count) {
        date = this.getDate(
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
    },
    getDaysInMonth(monthIndex, year) {
      let daysInMonthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let daysInMonth = daysInMonthMap[monthIndex];
      if (monthIndex === 1 && this.isLeapYear(year)) {
        return 29;
      }
      return daysInMonth;
    },
    isLeapYear(year) {
      if (year % 400 === 0)
        return true;
      if (year % 100 === 0)
        return false;
      if (year % 4 === 0)
        return true;
      return false;
    },
    twoDigit(number) {
      return number.toString().padStart(2, "0");
    },
    toValue(date) {
      if (!date)
        return "";
      date.setHours(this.hour, this.minute, this.second, 0);
      return `${date.getFullYear()}-${this.twoDigit(
        date.getMonth() + 1
      )}-${this.twoDigit(date.getDate())} ${this.twoDigit(
        date.getHours()
      )}:${this.twoDigit(date.getMinutes())}:${this.twoDigit(
        date.getSeconds()
      )}`;
    },
    getDate(...args) {
      let d = new Date(...args);
      return d;
    },
    updateDate(date) {
      date = this.getDate(date);
      this.hour = date.getHours();
      this.minute = date.getMinutes();
      this.second = date.getSeconds();
      this.selectDate(date, true);
    }
  }
};
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
  const _component_Input = resolveComponent("Input");
  const _component_FeatherIcon = resolveComponent("FeatherIcon");
  const _component_Button = resolveComponent("Button");
  const _component_TextInput = resolveComponent("TextInput");
  const _component_Popover = resolveComponent("Popover");
  return openBlock(), createBlock(_component_Popover, {
    onOpen: $options.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full"
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode(_component_Input, mergeProps({
        readonly: "",
        type: "text",
        "icon-left": "calendar",
        placeholder: $props.placeholder,
        value: $options.dateValue && $props.formatter ? $props.formatter($options.dateValue) : $options.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), null, 16, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createVNode(_component_Button, {
            variant: "ghost",
            class: "h-7 w-7",
            onClick: $options.prevMonth
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
            _hoisted_3$1,
            toDisplayString($options.formatMonth),
            1
            /* TEXT */
          ),
          createVNode(_component_Button, {
            variant: "ghost",
            class: "h-7 w-7",
            onClick: $options.nextMonth
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
        createBaseVNode("div", _hoisted_4$1, [
          createVNode(_component_TextInput, {
            class: "text-sm",
            type: "text",
            value: $options.dateValue,
            onChange: ($event) => $options.updateDate($event.target.value) || togglePopover()
          }, null, 8, ["value", "onChange"]),
          createVNode(_component_Button, {
            label: "Now",
            class: "text-sm",
            onClick: ($event) => $options.selectDate($options.getDate(), false, true) || togglePopover()
          }, null, 8, ["onClick"])
        ]),
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
            renderList($options.datesAsWeeks, (week, i) => {
              return openBlock(), createElementBlock("div", {
                class: "flex items-center",
                key: i
              }, [
                (openBlock(true), createElementBlock(
                  Fragment,
                  null,
                  renderList(week, (date) => {
                    return openBlock(), createElementBlock("div", {
                      key: $options.toValue(date),
                      class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50", {
                        "text-gray-400": date.getMonth() !== $data.currentMonth - 1,
                        "font-extrabold text-gray-900": $options.toValue(date) === $options.toValue($options.today),
                        "bg-gray-800 text-white hover:bg-gray-800": $options.toValue(date) === $options.dateValue
                      }]),
                      onClick: () => {
                        $options.selectDate(date);
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
        createBaseVNode("div", _hoisted_8$1, [
          createBaseVNode(
            "div",
            null,
            toDisplayString($options.twoDigit($data.hour)) + " : " + toDisplayString($options.twoDigit($data.minute)) + " : " + toDisplayString($options.twoDigit($data.second)),
            1
            /* TEXT */
          ),
          createBaseVNode("div", _hoisted_9, [
            createBaseVNode("div", _hoisted_10, [
              createVNode(_component_TextInput, {
                modelValue: $data.hour,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.hour = $event),
                name: "hours",
                type: "range",
                min: "0",
                max: "23",
                step: "1",
                onChange: () => $options.changeTime() || togglePopover()
              }, null, 8, ["modelValue", "onChange"])
            ]),
            createBaseVNode("div", _hoisted_11, [
              createVNode(_component_TextInput, {
                modelValue: $data.minute,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.minute = $event),
                name: "minutes",
                type: "range",
                min: "0",
                max: "59",
                step: "1",
                onChange: () => $options.changeTime() || togglePopover()
              }, null, 8, ["modelValue", "onChange"])
            ]),
            createBaseVNode("div", _hoisted_12, [
              createVNode(_component_TextInput, {
                modelValue: $data.second,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.second = $event),
                name: "seconds",
                type: "range",
                min: "0",
                max: "59",
                step: "1",
                onChange: () => $options.changeTime() || togglePopover()
              }, null, 8, ["modelValue", "onChange"])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_13, [
          createVNode(_component_Button, {
            label: "Clear",
            class: "text-sm",
            onClick: () => {
              $options.selectDate("");
              togglePopover();
            }
          }, null, 8, ["onClick"])
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["onOpen"]);
}
_sfc_main$1.__file = "src/components/DateTimePicker.vue";
const DateTimePicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-8ea52a80"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DateTimePicker.vue"]]);
const _sfc_main = {
  name: "DateRangePicker",
  props: {
    value: {
      type: String
    },
    modelValue: {
      type: String
    },
    placeholder: {
      type: String
    },
    formatter: {
      type: Function,
      default: null
    },
    readonly: {
      type: Boolean
    },
    inputClass: {
      type: [String, Array, Object]
    }
  },
  emits: ["update:modelValue", "change"],
  components: {
    Popover,
    Input,
    Button,
    FeatherIcon,
    TextInput
  },
  data() {
    const fromDate = this.dateValue ? this.dateValue[0] : "";
    const toDate = this.dateValue ? this.dateValue[1] : "";
    return {
      currentYear: null,
      currentMonth: null,
      fromDate,
      toDate
    };
  },
  created() {
    this.selectCurrentMonthYear();
  },
  computed: {
    today() {
      return this.getDate();
    },
    datesAsWeeks() {
      let datesAsWeeks = [];
      let dates = this.dates.slice();
      while (dates.length) {
        let week = dates.splice(0, 7);
        datesAsWeeks.push(week);
      }
      return datesAsWeeks;
    },
    dates() {
      if (!(this.currentYear && this.currentMonth)) {
        return [];
      }
      let monthIndex = this.currentMonth - 1;
      let year = this.currentYear;
      let firstDayOfMonth = this.getDate(year, monthIndex, 1);
      let lastDayOfMonth = this.getDate(year, monthIndex + 1, 0);
      let leftPaddingCount = firstDayOfMonth.getDay();
      let rightPaddingCount = 6 - lastDayOfMonth.getDay();
      let leftPadding = this.getDatesAfter(firstDayOfMonth, -leftPaddingCount);
      let rightPadding = this.getDatesAfter(lastDayOfMonth, rightPaddingCount);
      let daysInMonth = this.getDaysInMonth(monthIndex, year);
      let datesInMonth = this.getDatesAfter(firstDayOfMonth, daysInMonth - 1);
      let dates = [
        ...leftPadding,
        firstDayOfMonth,
        ...datesInMonth,
        ...rightPadding
      ];
      if (dates.length < 42) {
        const finalPadding = this.getDatesAfter(dates.at(-1), 42 - dates.length);
        dates = dates.concat(...finalPadding);
      }
      return dates;
    },
    formatMonth() {
      let date = this.getDate(this.currentYear, this.currentMonth - 1, 1);
      let month = date.toLocaleString("en-US", {
        month: "long"
      });
      return `${month}, ${date.getFullYear()}`;
    },
    dateValue() {
      return this.value ? this.value : this.modelValue;
    }
  },
  methods: {
    handleDateClick(date) {
      if (this.fromDate && this.toDate) {
        this.fromDate = this.toValue(date);
        this.toDate = "";
      } else if (this.fromDate && !this.toDate) {
        this.toDate = this.toValue(date);
      } else {
        this.fromDate = this.toValue(date);
      }
      this.swapDatesIfNecessary();
    },
    selectDates() {
      let val = `${this.fromDate},${this.toDate}`;
      if (!this.fromDate && !this.toDate) {
        val = "";
      }
      this.$emit("change", val);
      this.$emit("update:modelValue", val);
    },
    swapDatesIfNecessary() {
      if (!this.fromDate || !this.toDate) {
        return;
      }
      let fromDate = this.getDate(this.fromDate);
      let toDate = this.getDate(this.toDate);
      if (fromDate > toDate) {
        let temp = fromDate;
        fromDate = toDate;
        toDate = temp;
      }
      this.fromDate = this.toValue(fromDate);
      this.toDate = this.toValue(toDate);
    },
    selectCurrentMonthYear() {
      let date = this.toDate ? this.getDate(this.toDate) : this.today;
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
    },
    prevMonth() {
      this.changeMonth(-1);
    },
    nextMonth() {
      this.changeMonth(1);
    },
    changeMonth(adder) {
      this.currentMonth = this.currentMonth + adder;
      if (this.currentMonth < 1) {
        this.currentMonth = 12;
        this.currentYear = this.currentYear - 1;
      }
      if (this.currentMonth > 12) {
        this.currentMonth = 1;
        this.currentYear = this.currentYear + 1;
      }
    },
    getDatesAfter(date, count) {
      let incrementer = 1;
      if (count < 0) {
        incrementer = -1;
        count = Math.abs(count);
      }
      let dates = [];
      while (count) {
        date = this.getDate(
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
    },
    getDaysInMonth(monthIndex, year) {
      let daysInMonthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let daysInMonth = daysInMonthMap[monthIndex];
      if (monthIndex === 1 && this.isLeapYear(year)) {
        return 29;
      }
      return daysInMonth;
    },
    isLeapYear(year) {
      if (year % 400 === 0)
        return true;
      if (year % 100 === 0)
        return false;
      if (year % 4 === 0)
        return true;
      return false;
    },
    toValue(date) {
      if (!date) {
        return "";
      }
      if (typeof date === "string") {
        return date;
      }
      date.setHours(0, -date.getTimezoneOffset(), 0, 0);
      return date.toISOString().slice(0, 10);
    },
    getDate(...args) {
      let d = new Date(...args);
      return d;
    },
    isInRange(date) {
      if (!this.fromDate || !this.toDate) {
        return false;
      }
      return date >= this.getDate(this.fromDate) && date <= this.getDate(this.toDate);
    },
    formatDates(value) {
      if (!value) {
        return "";
      }
      const values = value.split(",");
      return this.formatter(values[0]) + " to " + this.formatter(values[1]);
    },
    clearDates() {
      this.fromDate = "";
      this.toDate = "";
      this.selectDates();
    }
  }
};
const _hoisted_1 = { class: "mt-2 w-fit select-none divide-y rounded-lg bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" };
const _hoisted_2 = { class: "flex items-center p-1 text-gray-500" };
const _hoisted_3 = { class: "flex-1 text-center text-base font-medium text-gray-700" };
const _hoisted_4 = { class: "flex items-center justify-center gap-1 p-1" };
const _hoisted_5 = { class: "flex flex-col items-center justify-center p-1 text-gray-800" };
const _hoisted_6 = { class: "flex items-center text-xs uppercase" };
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { class: "flex justify-end space-x-1 p-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Input = resolveComponent("Input");
  const _component_FeatherIcon = resolveComponent("FeatherIcon");
  const _component_Button = resolveComponent("Button");
  const _component_TextInput = resolveComponent("TextInput");
  const _component_Popover = resolveComponent("Popover");
  return openBlock(), createBlock(_component_Popover, {
    onOpen: $options.selectCurrentMonthYear,
    class: "flex w-full [&>div:first-child]:w-full"
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode(_component_Input, mergeProps({
        readonly: "",
        type: "text",
        "icon-left": "calendar",
        placeholder: $props.placeholder,
        value: $options.dateValue && $props.formatter ? $options.formatDates($options.dateValue) : $options.dateValue,
        onFocus: ($event) => !$props.readonly ? togglePopover() : null,
        class: ["w-full", $props.inputClass]
      }, _ctx.$attrs), null, 16, ["placeholder", "value", "onFocus", "class"])
    ]),
    body: withCtx(({ togglePopover }) => [
      createBaseVNode("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createVNode(_component_Button, {
            variant: "ghost",
            class: "h-7 w-7",
            onClick: $options.prevMonth
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
            _hoisted_3,
            toDisplayString($options.formatMonth),
            1
            /* TEXT */
          ),
          createVNode(_component_Button, {
            variant: "ghost",
            class: "h-7 w-7",
            onClick: $options.nextMonth
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
        createBaseVNode("div", _hoisted_4, [
          createVNode(_component_TextInput, {
            class: "w-28 text-sm",
            type: "text",
            modelValue: $data.fromDate,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.fromDate = $event)
          }, null, 8, ["modelValue"]),
          createVNode(_component_TextInput, {
            class: "w-28 text-sm",
            type: "text",
            modelValue: $data.toDate,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.toDate = $event)
          }, null, 8, ["modelValue"])
        ]),
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
            renderList($options.datesAsWeeks, (week, i) => {
              return openBlock(), createElementBlock("div", {
                class: "flex items-center",
                key: i
              }, [
                (openBlock(true), createElementBlock(
                  Fragment,
                  null,
                  renderList(week, (date) => {
                    return openBlock(), createElementBlock("div", {
                      key: $options.toValue(date),
                      class: normalizeClass(["flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-gray-50", {
                        "text-gray-400": date.getMonth() !== $data.currentMonth - 1,
                        "text-gray-900": date.getMonth() === $data.currentMonth - 1,
                        "font-extrabold text-gray-900": $options.toValue(date) === $options.toValue($options.today),
                        "rounded-none bg-gray-100": $options.isInRange(date),
                        "rounded-l-md rounded-r-none bg-gray-800 text-white hover:bg-gray-800": $data.fromDate && $options.toValue(date) === $options.toValue($data.fromDate),
                        "rounded-r-md bg-gray-800 text-white hover:bg-gray-800": $data.toDate && $options.toValue(date) === $options.toValue($data.toDate)
                      }]),
                      onClick: () => $options.handleDateClick(date)
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
        createBaseVNode("div", _hoisted_8, [
          createVNode(_component_Button, {
            label: "Clear",
            onClick: () => $options.clearDates() | togglePopover(),
            disabled: !$data.fromDate || !$data.toDate
          }, null, 8, ["onClick", "disabled"]),
          createVNode(_component_Button, {
            variant: "solid",
            label: "Apply",
            disabled: !$data.fromDate || !$data.toDate,
            onClick: () => $options.selectDates() | togglePopover()
          }, null, 8, ["disabled", "onClick"])
        ])
      ])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["onOpen"]);
}
_sfc_main.__file = "src/components/DateRangePicker.vue";
const DateRangePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/DateRangePicker.vue"]]);
export {
  DatePicker as D,
  DateTimePicker as a,
  DateRangePicker as b
};
