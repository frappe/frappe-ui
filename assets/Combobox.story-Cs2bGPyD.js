import { ay as defineComponent, az as ref, aI as reactive, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aN as toDisplayString } from "./vendor-DISWWsWY.js";
import { C as Combobox } from "./Combobox-EvdQQJVf.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./chevron-down-D-_-s-uA.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Combobox.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const simpleValue = ref("");
    const objectValue = ref("");
    const iconValue = ref("");
    const groupedValue = ref("");
    const disabledValue = ref("");
    const preselectedValue = ref("john-doe");
    const multipleSimpleValue = ref([]);
    const multipleObjectValue = ref([]);
    const multipleGroupedValue = ref(["apple", "carrot"]);
    const complexObjectValue = ref(null);
    const selectedOption = ref(null);
    const complexObjects = [
      {
        label: "John Doe (Admin)",
        value: "john-doe",
        email: "john@example.com",
        role: "Admin"
      },
      {
        label: "Jane Smith (User)",
        value: "jane-smith",
        email: "jane@example.com",
        role: "User"
      },
      {
        label: "Bob Johnson (Manager)",
        value: "bob-johnson",
        email: "bob@example.com",
        role: "Manager"
      },
      {
        label: "Alice Brown (User)",
        value: "alice-brown",
        email: "alice@example.com",
        role: "User"
      }
    ];
    const simpleOptions = [
      "John Doe",
      "Jane Doe",
      "John Smith",
      "Jane Smith",
      "John Wayne",
      "Jane Wayne",
      "Alice Johnson",
      "Bob Wilson",
      "Charlie Brown",
      "Diana Prince"
    ];
    const objectOptions = [
      { label: "John Doe", value: "john-doe" },
      { label: "Jane Doe", value: "jane-doe" },
      { label: "John Smith", value: "john-smith" },
      { label: "Jane Smith", value: "jane-smith", disabled: true },
      { label: "John Wayne", value: "john-wayne" },
      { label: "Jane Wayne", value: "jane-wayne" },
      { label: "Alice Johnson", value: "alice-johnson" },
      { label: "Bob Wilson", value: "bob-wilson" }
    ];
    const optionsWithIcons = [
      { label: "Dashboard", value: "dashboard", icon: "📊" },
      { label: "Projects", value: "projects", icon: "📁" },
      { label: "Tasks", value: "tasks", icon: "✅" },
      { label: "Calendar", value: "calendar", icon: "📅" },
      { label: "Reports", value: "reports", icon: "📈" },
      { label: "Settings", value: "settings", icon: "⚙️" }
    ];
    const groupedOptions = [
      {
        group: "Fruits",
        options: [
          { label: "Apple", value: "apple", icon: "🍎" },
          { label: "Banana", value: "banana", icon: "🍌" },
          { label: "Orange", value: "orange", icon: "🍊" },
          { label: "Grape", value: "grape", icon: "🍇" }
        ]
      },
      {
        group: "Vegetables",
        options: [
          { label: "Carrot", value: "carrot", icon: "🥕" },
          { label: "Broccoli", value: "broccoli", icon: "🥦" },
          { label: "Tomato", value: "tomato", icon: "🍅" },
          { label: "Lettuce", value: "lettuce", icon: "🥬" }
        ]
      },
      {
        group: "Proteins",
        options: [
          { label: "Chicken", value: "chicken", icon: "🍗" },
          { label: "Fish", value: "fish", icon: "🐟" },
          { label: "Beef", value: "beef", icon: "🥩" },
          { label: "Tofu", value: "tofu", icon: "🪤", disabled: true }
        ]
      }
    ];
    const state = reactive({
      disabled: false,
      placeholder: "Select an option...",
      showCancel: true
    });
    const __returned__ = { simpleValue, objectValue, iconValue, groupedValue, disabledValue, preselectedValue, multipleSimpleValue, multipleObjectValue, multipleGroupedValue, complexObjectValue, selectedOption, complexObjects, simpleOptions, objectOptions, optionsWithIcons, groupedOptions, state, Combobox };
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
const _hoisted_10 = { class: "p-4" };
const _hoisted_11 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_12 = { class: "p-4" };
const _hoisted_13 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_14 = { class: "p-4" };
const _hoisted_15 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_16 = { class: "p-4" };
const _hoisted_17 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_18 = { class: "p-4" };
const _hoisted_19 = { class: "mt-2 text-sm text-gray-600" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstText = resolveComponent("HstText");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "Combobox",
    layout: { type: "grid", width: 400 }
  }, {
    controls: withCtx(() => [
      createVNode(_component_HstText, {
        modelValue: $setup.state.placeholder,
        "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.state.placeholder = $event),
        title: "Placeholder"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.disabled,
        "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $setup.state.disabled = $event),
        title: "Disabled"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.showCancel,
        "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $setup.state.showCancel = $event),
        title: "Show Cancel Button"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Simple String Options" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            _cache[14] || (_cache[14] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Simple Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.simpleOptions,
              modelValue: $setup.simpleValue,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.simpleValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel,
              "onUpdate:selectedOption": _cache[1] || (_cache[1] = ($event) => $setup.selectedOption = $event)
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_2,
              " Selected: " + toDisplayString($setup.simpleValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Object Options" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            _cache[15] || (_cache[15] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Object Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.objectOptions,
              modelValue: $setup.objectValue,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.objectValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_4,
              " Selected: " + toDisplayString($setup.objectValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Options with Icons" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            _cache[16] || (_cache[16] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Options with Icons",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.optionsWithIcons,
              modelValue: $setup.iconValue,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.iconValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_6,
              " Selected: " + toDisplayString($setup.iconValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Grouped Options" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            _cache[17] || (_cache[17] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Grouped Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.groupedOptions,
              modelValue: $setup.groupedValue,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.groupedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_8,
              " Selected: " + toDisplayString($setup.groupedValue || "None"),
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
          createBaseVNode("div", _hoisted_9, [
            _cache[18] || (_cache[18] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Disabled Combobox",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.simpleOptions,
              modelValue: $setup.disabledValue,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.disabledValue = $event),
              placeholder: "This is disabled",
              disabled: true
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Pre-selected Value" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_10, [
            _cache[19] || (_cache[19] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Pre-selected Value",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.objectOptions,
              modelValue: $setup.preselectedValue,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.preselectedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_11,
              " Selected: " + toDisplayString($setup.preselectedValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Multiple Selection - Simple" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_12, [
            _cache[20] || (_cache[20] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Multiple Simple Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.simpleOptions,
              modelValue: $setup.multipleSimpleValue,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.multipleSimpleValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel,
              multiple: true
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_13,
              " Selected: " + toDisplayString($setup.multipleSimpleValue.length > 0 ? $setup.multipleSimpleValue.join(", ") : "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Multiple Selection - Objects" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_14, [
            _cache[21] || (_cache[21] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Multiple Object Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.objectOptions,
              modelValue: $setup.multipleObjectValue,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.multipleObjectValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              multiple: true
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_15,
              " Selected: " + toDisplayString($setup.multipleObjectValue.length > 0 ? $setup.multipleObjectValue.join(", ") : "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Multiple Selection - Grouped" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_16, [
            _cache[22] || (_cache[22] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Multiple Grouped Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.groupedOptions,
              modelValue: $setup.multipleGroupedValue,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.multipleGroupedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              multiple: true
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_17,
              " Selected: " + toDisplayString($setup.multipleGroupedValue.length > 0 ? $setup.multipleGroupedValue.join(", ") : "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Complex Objects with Display Value" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_18, [
            _cache[23] || (_cache[23] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Complex Objects",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.complexObjects,
              modelValue: $setup.complexObjectValue,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.complexObjectValue = $event),
              "display-value": (obj) => obj ? `${obj.label} - ${obj.email}` : "",
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel
            }, null, 8, ["modelValue", "display-value", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_19,
              " Selected: " + toDisplayString($setup.complexObjectValue || "None"),
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
_sfc_main.__file = "src/components/Combobox/Combobox.story.vue";
const Combobox_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Combobox/Combobox.story.vue"]]);
export {
  Combobox_story as default
};
