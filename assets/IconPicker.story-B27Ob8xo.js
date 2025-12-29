import { ay as _export_sfc, az as defineComponent, aA as ref, aB as reactive, aC as resolveComponent, aD as openBlock, aE as createBlock, aF as withCtx, aG as IconPicker, aH as createVNode, aI as createBaseVNode, aJ as toDisplayString } from "./vendor-BSc69dYN.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "IconPicker.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const basicValue = ref(null);
    const preselectedValue = ref("star");
    const disabledValue = ref("");
    const state = reactive({
      disabled: false,
      placeholder: "Select an icon...",
      openOnClick: true,
      openOnFocus: true,
      placement: "start"
    });
    const __returned__ = { basicValue, preselectedValue, disabledValue, state, IconPicker };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-4" };
const _hoisted_2 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_3 = { class: "p-4" };
const _hoisted_4 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_5 = { class: "p-4" };
const _hoisted_6 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_7 = { class: "p-4" };
const _hoisted_8 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_9 = { class: "p-4" };
const _hoisted_10 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_11 = { class: "p-4" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstText = resolveComponent("HstText");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "IconPicker",
    layout: { type: "grid", width: 400 }
  }, {
    controls: withCtx(() => [
      createVNode(_component_HstText, {
        modelValue: $setup.state.placeholder,
        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.state.placeholder = $event),
        title: "Placeholder"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.disabled,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.state.disabled = $event),
        title: "Disabled"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.openOnClick,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.state.openOnClick = $event),
        title: "Open on Click"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.openOnFocus,
        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.state.openOnFocus = $event),
        title: "Open on Focus"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.placement,
        "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.state.placement = $event),
        title: "Placement",
        options: [
          { value: "start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "end", label: "End" }
        ]
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Basic Usage" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            _cache[11] || (_cache[11] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Basic Icon Picker",
              -1
              /* HOISTED */
            )),
            createVNode($setup["IconPicker"], {
              modelValue: $setup.basicValue,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.basicValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "open-on-click": $setup.state.openOnClick,
              "open-on-focus": $setup.state.openOnFocus,
              placement: $setup.state.placement
            }, null, 8, ["modelValue", "placeholder", "disabled", "open-on-click", "open-on-focus", "placement"]),
            createBaseVNode(
              "div",
              _hoisted_2,
              " Selected: " + toDisplayString($setup.basicValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Subtle Variant (Default)" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            _cache[12] || (_cache[12] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Subtle Variant",
              -1
              /* HOISTED */
            )),
            createVNode($setup["IconPicker"], {
              variant: "subtle",
              modelValue: $setup.basicValue,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.basicValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_4,
              " Selected: " + toDisplayString($setup.basicValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Outline Variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            _cache[13] || (_cache[13] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Outline Variant",
              -1
              /* HOISTED */
            )),
            createVNode($setup["IconPicker"], {
              variant: "outline",
              modelValue: $setup.basicValue,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.basicValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_6,
              " Selected: " + toDisplayString($setup.basicValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Ghost Variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            _cache[14] || (_cache[14] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Ghost Variant",
              -1
              /* HOISTED */
            )),
            createVNode($setup["IconPicker"], {
              variant: "ghost",
              modelValue: $setup.basicValue,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.basicValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_8,
              " Selected: " + toDisplayString($setup.basicValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Pre-selected Icon" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_9, [
            _cache[15] || (_cache[15] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Pre-selected Icon",
              -1
              /* HOISTED */
            )),
            createVNode($setup["IconPicker"], {
              modelValue: $setup.preselectedValue,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.preselectedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_10,
              " Selected: " + toDisplayString($setup.preselectedValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Disabled State" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_11, [
            _cache[16] || (_cache[16] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Disabled Icon Picker",
              -1
              /* HOISTED */
            )),
            createVNode($setup["IconPicker"], {
              modelValue: $setup.disabledValue,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.disabledValue = $event),
              placeholder: "This is disabled",
              disabled: true
            }, null, 8, ["modelValue"]),
            _cache[17] || (_cache[17] = createBaseVNode(
              "div",
              { class: "mt-2 text-sm text-gray-600" },
              " Icon picker is disabled ",
              -1
              /* HOISTED */
            ))
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
_sfc_main.__file = "icons/IconPicker.story.vue";
const IconPicker_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/icons/IconPicker.story.vue"]]);
export {
  IconPicker_story as default
};
