import { aC as defineComponent, aN as ref, aR as reactive, aO as resolveComponent, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aB as createBaseVNode, aU as mergeProps, aL as toDisplayString } from "./vendor-Cd6ZNPB1.js";
import { T as TimePicker } from "./TimePicker-Bu1S0MVM.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Popover-DhBKkOpE.js";
import "./TextInput-CBszWxpI.js";
import "./debounce-CRCtzhPg.js";
import "./FeatherIcon-DftAZm8z.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TimePicker.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const valueBasic = ref("");
    const value24 = ref("13:30");
    const valueCustomOpts = ref("09:00");
    const valueRange = ref("08:00");
    const valueEvents = ref("");
    const eventsLog = ref([]);
    function log(e, payload) {
      const ts = (/* @__PURE__ */ new Date()).toLocaleTimeString();
      eventsLog.value.unshift(
        `${ts} ${e}${payload !== void 0 ? ": " + payload : ""}`
      );
      if (eventsLog.value.length > 8) eventsLog.value.pop();
    }
    const customOptions = [
      { value: "08:00" },
      { value: "09:00" },
      { value: "09:30" },
      { value: "10:00" },
      { value: "11:15" },
      { value: "13:45" }
    ];
    const placements = [
      "bottom-start",
      "bottom-end",
      "top-start",
      "top-end",
      "right-start",
      "right-end",
      "left-start",
      "left-end"
    ];
    const scrollModes = ["center", "start", "nearest"];
    const state = reactive({
      variant: "subtle",
      interval: 15,
      allowCustom: true,
      autoClose: true,
      use12Hour: true,
      placement: "bottom-start",
      placeholder: "Select time",
      disabled: false,
      minTime: "",
      maxTime: "",
      scrollMode: "center"
    });
    const __returned__ = { valueBasic, value24, valueCustomOpts, valueRange, valueEvents, eventsLog, log, customOptions, placements, scrollModes, state, TimePicker };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2 space-y-2" };
const _hoisted_2 = { class: "text-xs text-ink-gray-6" };
const _hoisted_3 = { class: "p-2 space-y-2" };
const _hoisted_4 = { class: "text-xs text-ink-gray-6" };
const _hoisted_5 = { class: "p-2 space-y-2" };
const _hoisted_6 = { class: "text-xs text-ink-gray-6" };
const _hoisted_7 = { class: "p-2 space-y-2" };
const _hoisted_8 = { class: "text-xs text-ink-gray-6" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_HstNumber = resolveComponent("HstNumber");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_HstText = resolveComponent("HstText");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    layout: { type: "grid", width: 300 },
    autoPropsDisabled: ""
  }, {
    controls: withCtx(() => [
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.variant,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.state.variant = $event),
        options: ["outline", "subtle", "ghost"],
        title: "Variant"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstNumber, {
        modelValue: $setup.state.interval,
        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.state.interval = $event),
        title: "Interval (min)"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.allowCustom,
        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.state.allowCustom = $event),
        title: "Allow Custom"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.autoClose,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.state.autoClose = $event),
        title: "Auto Close"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.use12Hour,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.state.use12Hour = $event),
        title: "12 Hour"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.disabled,
        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.state.disabled = $event),
        title: "Disabled"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.placement,
        "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.state.placement = $event),
        options: $setup.placements,
        title: "Placement"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.scrollMode,
        "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.state.scrollMode = $event),
        options: $setup.scrollModes,
        title: "Scroll Mode"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.minTime,
        "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $setup.state.minTime = $event),
        title: "Min Time (HH:MM)"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.maxTime,
        "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $setup.state.maxTime = $event),
        title: "Max Time (HH:MM)"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.placeholder,
        "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $setup.state.placeholder = $event),
        title: "Placeholder"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Basic" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["TimePicker"], mergeProps({
              modelValue: $setup.valueBasic,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.valueBasic = $event)
            }, $setup.state), null, 16, ["modelValue"]),
            createBaseVNode(
              "div",
              _hoisted_2,
              " Value: " + toDisplayString($setup.valueBasic || "—"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "24 Hour Format" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["TimePicker"], mergeProps({
              modelValue: $setup.value24,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.value24 = $event)
            }, { ...$setup.state, use12Hour: false }), null, 16, ["modelValue"]),
            createBaseVNode(
              "div",
              _hoisted_4,
              "Value: " + toDisplayString($setup.value24),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Options (no interval generation)" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            createVNode($setup["TimePicker"], mergeProps({
              modelValue: $setup.valueCustomOpts,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.valueCustomOpts = $event)
            }, $setup.state, {
              options: $setup.customOptions,
              allowCustom: false
            }), null, 16, ["modelValue"]),
            createBaseVNode(
              "div",
              _hoisted_6,
              "Value: " + toDisplayString($setup.valueCustomOpts),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Min / Max Range" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            createVNode($setup["TimePicker"], mergeProps({
              modelValue: $setup.valueRange,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.valueRange = $event)
            }, { ...$setup.state, minTime: "08:00", maxTime: "12:00" }), null, 16, ["modelValue"]),
            createBaseVNode(
              "div",
              _hoisted_8,
              "Value: " + toDisplayString($setup.valueRange),
              1
              /* TEXT */
            )
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
_sfc_main.__file = "src/components/TimePicker/TimePicker.story.vue";
const TimePicker_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TimePicker/TimePicker.story.vue"]]);
export {
  TimePicker_story as default
};
