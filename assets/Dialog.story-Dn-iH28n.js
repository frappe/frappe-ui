import { aK as markRaw, aD as openBlock, aL as createElementBlock, aI as createBaseVNode, ay as _export_sfc, az as defineComponent, aA as ref, aC as resolveComponent, aE as createBlock, aF as withCtx, aS as createCommentVNode, aH as createVNode, aT as createTextVNode, aJ as toDisplayString } from "./vendor-D15NXqv8.js";
import { _ as __unplugin_components_1 } from "./Dialog-2T6qKaET.js";
import { S as Settings } from "./settings-C0QiuuN4.js";
import { L as LucideChevronDown } from "./chevron-down-ZI0U1cEJ.js";
import { B as Button } from "./Button-BTxOUt9T.js";
import { D as Dropdown } from "./Dropdown-D6o2gLMv.js";
import { A as Autocomplete } from "./Autocomplete-q8NJj9ue.js";
import "./FeatherIcon-DF8XYuFv.js";
import "./x-CVxppBAL.js";
import "./Switch-DQNsMz7Q.js";
import "./useId-DJabvbK8.js";
import "./Popover-BxyFyI5n.js";
const _hoisted_1$1 = {
  class: "lucide lucide-star",
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
      { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideStar = markRaw({ name: "lucide-star", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dialog.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const dialog1 = ref(false);
    const dialog2 = ref(false);
    const dialog3 = ref(false);
    const dialog4 = ref(false);
    const dialog5 = ref(false);
    const dialog6 = ref(false);
    const selectedOption = ref("Option 1");
    const autocompleteValue = ref({ label: "", value: "" });
    const dropdownOptions = [
      {
        label: "Option 1",
        onClick: () => {
          selectedOption.value = "Option 1";
        }
      },
      {
        label: "Option 2",
        onClick: () => {
          selectedOption.value = "Option 2";
        }
      },
      {
        label: "Option 3",
        onClick: () => {
          selectedOption.value = "Option 3";
        }
      },
      {
        group: "Advanced Options",
        items: [
          {
            label: "Advanced Option A",
            icon: Settings,
            onClick: () => {
              selectedOption.value = "Advanced Option A";
            }
          },
          {
            label: "Advanced Option B",
            icon: LucideStar,
            onClick: () => {
              selectedOption.value = "Advanced Option B";
            }
          }
        ]
      }
    ];
    const createPromise = () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 2e3);
      });
    };
    const __returned__ = { dialog1, dialog2, dialog3, dialog4, dialog5, dialog6, selectedOption, autocompleteValue, dropdownOptions, createPromise, Dialog: __unplugin_components_1, get Button() {
      return Button;
    }, get Dropdown() {
      return Dropdown;
    }, get LucideChevronDown() {
      return LucideChevronDown;
    }, get Autocomplete() {
      return Autocomplete;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex justify-start flex-row-reverse gap-2" };
const _hoisted_2 = { class: "space-x-2" };
const _hoisted_3 = { class: "space-y-6 text-base" };
const _hoisted_4 = { class: "space-y-3" };
const _hoisted_5 = { class: "bg-gray-50 text-p-sm p-4 text-ink-gray-6 rounded-lg" };
const _hoisted_6 = { class: "flex space-x-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { width: 500, type: "grid" } }, {
    default: withCtx(() => [
      createCommentVNode(" 1. Basic Dialog with Actions "),
      createVNode(_component_Variant, {
        title: "Basic Dialog with Actions",
        autoPropsDisabled: ""
      }, {
        default: withCtx(() => [
          createVNode($setup["Button"], {
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.dialog1 = true)
          }, {
            default: withCtx(() => _cache[13] || (_cache[13] = [
              createTextVNode("Show Confirmation Dialog")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode($setup["Dialog"], {
            options: {
              title: "Confirm Action",
              message: "Are you sure you want to proceed with this action?",
              size: "lg",
              icon: {
                name: "alert-triangle",
                appearance: "warning"
              },
              actions: [
                {
                  label: "Confirm",
                  variant: "solid",
                  onClick: () => $setup.createPromise()
                }
              ]
            },
            modelValue: $setup.dialog1,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.dialog1 = $event)
          }, null, 8, ["options", "modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createCommentVNode(" 2. Custom Content with Slots "),
      createVNode(_component_Variant, {
        title: "Custom Content with Slots",
        autoPropsDisabled: ""
      }, {
        default: withCtx(() => [
          createVNode($setup["Button"], {
            onClick: _cache[2] || (_cache[2] = ($event) => $setup.dialog2 = true)
          }, {
            default: withCtx(() => _cache[14] || (_cache[14] = [
              createTextVNode("Show Custom Dialog")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode($setup["Dialog"], {
            modelValue: $setup.dialog2,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.dialog2 = $event)
          }, {
            "body-title": withCtx(() => _cache[15] || (_cache[15] = [
              createBaseVNode(
                "h3",
                { class: "text-2xl font-semibold text-blue-600" },
                " Custom Title with Styling ",
                -1
                /* HOISTED */
              )
            ])),
            "body-content": withCtx(() => _cache[16] || (_cache[16] = [
              createBaseVNode(
                "div",
                { class: "space-y-4" },
                [
                  createBaseVNode("p", { class: "text-gray-700" }, " This dialog uses custom slots for flexible content layout. "),
                  createBaseVNode("div", { class: "bg-blue-50 p-4 rounded-lg" }, [
                    createBaseVNode("p", { class: "text-blue-800" }, " You can put any content here including forms, lists, or other components. ")
                  ])
                ],
                -1
                /* HOISTED */
              )
            ])),
            actions: withCtx(({ close }) => [
              createBaseVNode("div", _hoisted_1, [
                createVNode($setup["Button"], {
                  variant: "solid",
                  onClick: close
                }, {
                  default: withCtx(() => _cache[17] || (_cache[17] = [
                    createTextVNode("Save Changes")
                  ])),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"]),
                createVNode($setup["Button"], {
                  variant: "outline",
                  onClick: close
                }, {
                  default: withCtx(() => _cache[18] || (_cache[18] = [
                    createTextVNode("Cancel")
                  ])),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"])
              ])
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createCommentVNode(" 3. Different Sizes "),
      createVNode(_component_Variant, {
        title: "Different Sizes",
        autoPropsDisabled: ""
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["Button"], {
              onClick: _cache[4] || (_cache[4] = ($event) => $setup.dialog3 = true)
            }, {
              default: withCtx(() => _cache[19] || (_cache[19] = [
                createTextVNode("Small Dialog")
              ])),
              _: 1
              /* STABLE */
            }),
            createVNode($setup["Button"], {
              onClick: _cache[5] || (_cache[5] = ($event) => $setup.dialog4 = true)
            }, {
              default: withCtx(() => _cache[20] || (_cache[20] = [
                createTextVNode("Large Dialog")
              ])),
              _: 1
              /* STABLE */
            })
          ]),
          createCommentVNode(" Small Dialog "),
          createVNode($setup["Dialog"], {
            options: {
              title: "Small Dialog",
              message: "This is a small dialog.",
              size: "sm",
              actions: [{ label: "OK", variant: "solid" }]
            },
            modelValue: $setup.dialog3,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.dialog3 = $event)
          }, null, 8, ["modelValue"]),
          createCommentVNode(" Large Dialog "),
          createVNode($setup["Dialog"], {
            options: {
              title: "Large Dialog",
              message: "This is a large dialog with more space for content.",
              size: "4xl",
              actions: [{ label: "OK", variant: "solid" }]
            },
            modelValue: $setup.dialog4,
            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.dialog4 = $event)
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createCommentVNode(" 4. Disable Outside Click "),
      createVNode(_component_Variant, {
        title: "Disable Outside Click to Close",
        autoPropsDisabled: ""
      }, {
        default: withCtx(() => [
          createVNode($setup["Button"], {
            onClick: _cache[8] || (_cache[8] = ($event) => $setup.dialog5 = true)
          }, {
            default: withCtx(() => _cache[21] || (_cache[21] = [
              createTextVNode("Show Modal Dialog")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode($setup["Dialog"], {
            options: {
              title: "Modal Dialog",
              message: "This dialog cannot be closed by clicking outside. Use the buttons or ESC key.",
              actions: [{ label: "Close", variant: "solid" }]
            },
            "disable-outside-click-to-close": true,
            modelValue: $setup.dialog5,
            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.dialog5 = $event)
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createCommentVNode(" 5. Dialog with Interactive Components "),
      createVNode(_component_Variant, {
        title: "Dialog with Interactive Components",
        autoPropsDisabled: ""
      }, {
        default: withCtx(() => [
          createVNode($setup["Button"], {
            onClick: _cache[10] || (_cache[10] = ($event) => $setup.dialog6 = true)
          }, {
            default: withCtx(() => _cache[22] || (_cache[22] = [
              createTextVNode("Show Settings Dialog")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode($setup["Dialog"], {
            modelValue: $setup.dialog6,
            "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $setup.dialog6 = $event)
          }, {
            "body-title": withCtx(() => _cache[23] || (_cache[23] = [
              createBaseVNode(
                "h3",
                { class: "text-2xl font-semibold text-ink-gray-9" },
                " Settings Dialog ",
                -1
                /* HOISTED */
              )
            ])),
            "body-content": withCtx(() => [
              createBaseVNode("div", _hoisted_3, [
                _cache[27] || (_cache[27] = createBaseVNode(
                  "p",
                  { class: "text-gray-700" },
                  " This dialog contains interactive elements to test proper layering. ",
                  -1
                  /* HOISTED */
                )),
                createVNode($setup["Autocomplete"], {
                  options: [
                    { label: "Option A", value: "A" },
                    { label: "Option B", value: "B" },
                    { label: "Option C", value: "C" }
                  ],
                  placeholder: "Type to search...",
                  modelValue: $setup.autocompleteValue,
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.autocompleteValue = $event)
                }, null, 8, ["modelValue"]),
                createBaseVNode("div", _hoisted_4, [
                  _cache[24] || (_cache[24] = createBaseVNode(
                    "label",
                    { class: "block text-sm font-medium text-gray-700" },
                    " Select an option: ",
                    -1
                    /* HOISTED */
                  )),
                  createVNode($setup["Dropdown"], {
                    options: $setup.dropdownOptions,
                    placement: "left"
                  }, {
                    default: withCtx(() => [
                      createVNode($setup["Button"], { variant: "outline" }, {
                        suffix: withCtx(() => [
                          createVNode($setup["LucideChevronDown"], { class: "h-4 w-4 text-gray-500" })
                        ]),
                        default: withCtx(() => [
                          createTextVNode(
                            toDisplayString($setup.selectedOption) + " ",
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ]),
                createBaseVNode("div", _hoisted_5, [
                  createBaseVNode("p", null, [
                    _cache[25] || (_cache[25] = createBaseVNode(
                      "strong",
                      null,
                      "Selected value:",
                      -1
                      /* HOISTED */
                    )),
                    createTextVNode(
                      " " + toDisplayString($setup.selectedOption),
                      1
                      /* TEXT */
                    )
                  ]),
                  _cache[26] || (_cache[26] = createBaseVNode(
                    "p",
                    { class: "mt-1" },
                    " Interactive components should work properly within dialogs. ",
                    -1
                    /* HOISTED */
                  ))
                ])
              ])
            ]),
            actions: withCtx(({ close }) => [
              createBaseVNode("div", _hoisted_6, [
                createVNode($setup["Button"], {
                  variant: "solid",
                  onClick: close
                }, {
                  default: withCtx(() => _cache[28] || (_cache[28] = [
                    createTextVNode("Save Settings")
                  ])),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"]),
                createVNode($setup["Button"], {
                  variant: "outline",
                  onClick: close
                }, {
                  default: withCtx(() => _cache[29] || (_cache[29] = [
                    createTextVNode("Cancel")
                  ])),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"])
              ])
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Dialog/Dialog.story.vue";
const Dialog_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dialog/Dialog.story.vue"]]);
export {
  Dialog_story as default
};
