import { ay as markRaw, az as openBlock, aA as createElementBlock, aB as createBaseVNode, aC as defineComponent, aN as ref, bi as h, aR as reactive, aO as resolveComponent, aH as createBlock, aP as withCtx, aM as createVNode, aL as toDisplayString } from "./vendor-BWyAe9Al.js";
import { C as Combobox } from "./Combobox-DdsCD-fn.js";
import { L as LucidePlus } from "./plus-A2anlhGm.js";
import { S as Settings } from "./settings-HRS4xzmx.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { A as Avatar } from "./Avatar-CaRUUt80.js";
import "./check-DWsaXrdU.js";
import "./chevron-down-veD0-dfF.js";
const _hoisted_1$1 = {
  class: "lucide lucide-search",
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "m21 21-4.34-4.34" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "11",
        cy: "11",
        r: "8"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideSearch = markRaw({ name: "lucide-search", render });
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
    const customOptionValue = ref("");
    const customWithRenderValue = ref("");
    const customWithSlotValue = ref("");
    const selectedOption = ref(null);
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
    const customOptions = [
      ...objectOptions,
      {
        type: "custom",
        key: "create-new",
        label: "Create New Item",
        icon: LucidePlus,
        condition: (context) => context.searchTerm.toLowerCase().includes("new") || context.searchTerm.toLowerCase().includes("create"),
        onClick: (context) => {
          alert(`Creating new item: "${context.searchTerm}"`);
        }
      },
      {
        type: "custom",
        key: "advanced-search",
        label: "Advanced Search",
        icon: LucideSearch,
        condition: (context) => context.searchTerm.length > 3,
        onClick: (context) => {
          alert(`Opening advanced search for: "${context.searchTerm}"`);
        },
        keepOpen: true
      }
    ];
    const customRenderOptions = [
      ...objectOptions.slice(0, 3),
      {
        type: "custom",
        key: "help-option",
        label: "Need Help?",
        render: () => [
          h(Settings, { class: "size-4" }),
          h("span", { class: "font-medium ml-2" }, "Need Help?")
        ],
        onClick: () => {
          alert("Opening help documentation...");
        }
      }
    ];
    const customSlotOptions = [
      ...objectOptions.slice(0, 2),
      {
        type: "custom",
        key: "user-profile",
        label: "View User Profile",
        slotName: "user-profile",
        onClick: () => {
          alert("Opening user profile...");
        }
      },
      {
        type: "custom",
        key: "settings",
        label: "Open Settings",
        slotName: "settings",
        condition: (context) => context.searchTerm.toLowerCase().includes("setting") || context.searchTerm.toLowerCase().includes("config"),
        onClick: () => {
          alert("Opening settings...");
        }
      }
    ];
    const state = reactive({
      disabled: false,
      placeholder: "Select an option...",
      showCancel: true
    });
    const __returned__ = { simpleValue, objectValue, iconValue, groupedValue, disabledValue, preselectedValue, customOptionValue, customWithRenderValue, customWithSlotValue, selectedOption, simpleOptions, objectOptions, optionsWithIcons, groupedOptions, customOptions, customRenderOptions, customSlotOptions, state, Combobox, get LucideSettings() {
      return Settings;
    }, get Avatar() {
      return Avatar;
    } };
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
const _hoisted_12 = { class: "p-4" };
const _hoisted_13 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_14 = { class: "p-4" };
const _hoisted_15 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_16 = { class: "p-4" };
const _hoisted_17 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_18 = { class: "p-4" };
const _hoisted_19 = { class: "flex items-center gap-2" };
const _hoisted_20 = { class: "mt-2 text-sm text-gray-600" };
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
        "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $setup.state.placeholder = $event),
        title: "Placeholder"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.disabled,
        "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $setup.state.disabled = $event),
        title: "Disabled"
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
      createVNode(_component_Variant, { title: "Outline variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            _cache[15] || (_cache[15] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Simple Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              variant: "outline",
              options: $setup.simpleOptions,
              modelValue: $setup.simpleValue,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.simpleValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel,
              "onUpdate:selectedOption": _cache[3] || (_cache[3] = ($event) => $setup.selectedOption = $event)
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_4,
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
          createBaseVNode("div", _hoisted_5, [
            _cache[16] || (_cache[16] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Object Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.objectOptions,
              modelValue: $setup.objectValue,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.objectValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_6,
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
          createBaseVNode("div", _hoisted_7, [
            _cache[17] || (_cache[17] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Options with Icons",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.optionsWithIcons,
              modelValue: $setup.iconValue,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.iconValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_8,
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
          createBaseVNode("div", _hoisted_9, [
            _cache[18] || (_cache[18] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Grouped Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.groupedOptions,
              modelValue: $setup.groupedValue,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.groupedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_10,
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
          createBaseVNode("div", _hoisted_11, [
            _cache[19] || (_cache[19] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Disabled Combobox",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.simpleOptions,
              modelValue: $setup.disabledValue,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.disabledValue = $event),
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
          createBaseVNode("div", _hoisted_12, [
            _cache[20] || (_cache[20] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Pre-selected Value",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.objectOptions,
              modelValue: $setup.preselectedValue,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.preselectedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_13,
              " Selected: " + toDisplayString($setup.preselectedValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Options with onClick" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_14, [
            _cache[21] || (_cache[21] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Custom Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.customOptions,
              modelValue: $setup.customOptionValue,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.customOptionValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_15,
              " Selected: " + toDisplayString($setup.customOptionValue || "None"),
              1
              /* TEXT */
            ),
            _cache[22] || (_cache[22] = createBaseVNode(
              "div",
              { class: "mt-2 text-xs text-gray-500" },
              " Try typing 'new' or 'create' to see custom options ",
              -1
              /* HOISTED */
            ))
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Options with Render Function" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_16, [
            _cache[23] || (_cache[23] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              " Custom Render Options ",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.customRenderOptions,
              modelValue: $setup.customWithRenderValue,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.customWithRenderValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_17,
              " Selected: " + toDisplayString($setup.customWithRenderValue || "None"),
              1
              /* TEXT */
            ),
            _cache[24] || (_cache[24] = createBaseVNode(
              "div",
              { class: "mt-2 text-xs text-gray-500" },
              " Custom options with render functions and conditional display ",
              -1
              /* HOISTED */
            ))
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Options with Slots" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_18, [
            _cache[27] || (_cache[27] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              " Custom Slot Options ",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.customSlotOptions,
              modelValue: $setup.customWithSlotValue,
              "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.customWithSlotValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, {
              "user-profile": withCtx(({ option }) => [
                createVNode($setup["Avatar"], {
                  label: "F",
                  size: "sm"
                }),
                _cache[25] || (_cache[25] = createBaseVNode(
                  "span",
                  { class: "ml-2" },
                  " View User Profile → ",
                  -1
                  /* HOISTED */
                ))
              ]),
              settings: withCtx(({ option }) => [
                createBaseVNode("div", _hoisted_19, [
                  createVNode($setup["LucideSettings"], { class: "w-4 h-4 text-gray-600" }),
                  _cache[26] || (_cache[26] = createBaseVNode(
                    "div",
                    { class: "font-medium text-sm" },
                    "Open Settings",
                    -1
                    /* HOISTED */
                  ))
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_20,
              " Selected: " + toDisplayString($setup.customWithSlotValue || "None"),
              1
              /* TEXT */
            ),
            _cache[28] || (_cache[28] = createBaseVNode(
              "div",
              { class: "mt-2 text-xs text-gray-500" },
              " Try typing 'setting' to see the settings option. Slots allow full template control. ",
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
_sfc_main.__file = "src/components/Combobox/Combobox.story.vue";
const Combobox_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Combobox/Combobox.story.vue"]]);
export {
  Combobox_story as default
};
