import { B as Button, L as LoadingIndicator } from "./Button-Cb52-Idw.js";
import { ay as _export_sfc, az as defineComponent, aM as mergeModels, aN as useModel, aO as computed, aD as openBlock, aE as createBlock, aF as withCtx, aH as createVNode, aQ as normalizeClass, aT as createTextVNode, aJ as toDisplayString, aL as createElementBlock, aI as createBaseVNode, aS as createCommentVNode, aV as Fragment, aU as renderList, aP as renderSlot, aW as mergeProps, be as normalizeProps, bf as guardReactiveProps, bC as ComboboxContent_default, bD as ComboboxEmpty_default, bE as ComboboxInput_default, bF as ComboboxItem_default, bG as ComboboxItemIndicator_default, bH as ComboboxRoot_default, bI as ComboboxViewport_default, aK as markRaw, bJ as createStaticVNode, aA as ref, aC as resolveComponent } from "./vendor-CZBDvwVw.js";
import { L as LucideX } from "./x-CEj2btw4.js";
import { _ as __unplugin_components_1 } from "./Popover-CF2GVqEI.js";
import { L as LucideCheck$1 } from "./check-Ccg9Rf4u.js";
import { L as LucideChevronDown } from "./chevron-down-DCv18cUX.js";
import { A as Avatar } from "./Avatar-DzsigKAH.js";
import "./FeatherIcon-Dysg5cKh.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MultiSelect",
  props: /* @__PURE__ */ mergeModels({
    placeholder: { type: String, required: false, default: "Select option" },
    options: { type: Array, required: true },
    hideSearch: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    compareFn: { type: Function, required: false }
  }, {
    "modelValue": { type: Array, ...{ default: [] } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const model = useModel(__props, "modelValue");
    const getValues = (arr) => arr.map((x) => {
      var _a;
      return (_a = props.options.find((y) => y.value === x)) == null ? void 0 : _a.label;
    });
    const optionToStr = (options) => options.map((x) => x.value);
    const selectedOptions = computed(() => {
      const values = getValues(model.value).join(", ");
      return model.value.length > 0 ? values : props.placeholder;
    });
    const clearAll = () => model.value = [];
    const selectAll = () => model.value = optionToStr(props.options);
    const __returned__ = { props, model, getValues, optionToStr, selectedOptions, clearAll, selectAll, get ComboboxContent() {
      return ComboboxContent_default;
    }, get ComboboxEmpty() {
      return ComboboxEmpty_default;
    }, get ComboboxInput() {
      return ComboboxInput_default;
    }, get ComboboxItem() {
      return ComboboxItem_default;
    }, get ComboboxItemIndicator() {
      return ComboboxItemIndicator_default;
    }, get ComboboxRoot() {
      return ComboboxRoot_default;
    }, get ComboboxViewport() {
      return ComboboxViewport_default;
    }, get LucideX() {
      return LucideX;
    }, Button, Popover: __unplugin_components_1, get LucideCheck() {
      return LucideCheck$1;
    }, LoadingIndicator, get LucideChevronDown() {
      return LucideChevronDown;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$3 = {
  key: 0,
  class: "flex w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 ring-2 ring-outline-gray-2 transition-colors hover:bg-surface-gray-3 boder borer-transparent"
};
const _hoisted_2 = { class: "inline-flex gap-1" };
const _hoisted_3 = { class: "flex justify-between my-2" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    "popover-class": "mt-2 shadow-xl rounded-lg border bg-surface-modal",
    matchTargetWidth: true
  }, {
    target: withCtx(({ togglePopover }) => [
      createVNode($setup["Button"], {
        onClick: togglePopover,
        class: normalizeClass(["w-full justify-between", { "!text-ink-gray-4": $setup.model.length == 0 }])
      }, {
        suffix: withCtx(() => [
          createVNode($setup["LucideChevronDown"], { class: "size-4 text-ink-gray-5" })
        ]),
        default: withCtx(() => [
          createTextVNode(
            toDisplayString($setup.selectedOptions) + " ",
            1
            /* TEXT */
          )
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["onClick", "class"])
    ]),
    body: withCtx(() => [
      createVNode($setup["ComboboxRoot"], {
        open: true,
        class: "relative p-2 pb-0",
        modelValue: $setup.model,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.model = $event),
        multiple: ""
      }, {
        default: withCtx(() => [
          !$setup.props.hideSearch ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
            createVNode($setup["ComboboxInput"], {
              placeholder: "Search for...",
              class: "bg-transparent p-0 focus:outline-0 border-0 focus:border-0 focus:ring-0 text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4 w-full"
            }),
            createBaseVNode("div", _hoisted_2, [
              $setup.props.loading ? (openBlock(), createBlock($setup["LoadingIndicator"], {
                key: 0,
                class: "size-4 text-ink-gray-5"
              })) : createCommentVNode("v-if", true),
              createVNode($setup["LucideX"], { class: "size-4 text-ink-gray-9" })
            ])
          ])) : createCommentVNode("v-if", true),
          createVNode($setup["ComboboxContent"], { class: "z-10 overflow-hidden mt-2" }, {
            default: withCtx(() => [
              createVNode($setup["ComboboxViewport"], { class: "max-h-60 overflow-auto pb-1.5" }, {
                default: withCtx(() => [
                  createVNode($setup["ComboboxEmpty"], { class: "text-ink-gray-5 text-base text-center py-1.5 px-2.5" }, {
                    default: withCtx(() => _cache[1] || (_cache[1] = [
                      createTextVNode(" No results found ")
                    ])),
                    _: 1
                    /* STABLE */
                  }),
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.props.options, (item) => {
                      return openBlock(), createBlock($setup["ComboboxItem"], {
                        key: item.value,
                        value: item.value,
                        disabled: item.disabled,
                        class: "text-base leading-none text-ink-gray-7 rounded flex items-center h-7 p-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "option", mergeProps({ ref_for: true }, { item }), () => [
                            createTextVNode(
                              toDisplayString(item.label),
                              1
                              /* TEXT */
                            )
                          ]),
                          createVNode($setup["ComboboxItemIndicator"], { class: "absolute right-2 inline-flex items-center justify-center" }, {
                            default: withCtx(() => [
                              createVNode($setup["LucideCheck"], { class: "size-4" })
                            ]),
                            _: 1
                            /* STABLE */
                          })
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["value", "disabled"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                _: 3
                /* FORWARDED */
              }),
              _cache[4] || (_cache[4] = createBaseVNode(
                "hr",
                { class: "border-outline-gray-3" },
                null,
                -1
                /* HOISTED */
              )),
              createCommentVNode(" footer btns "),
              renderSlot(_ctx.$slots, "footer", normalizeProps(guardReactiveProps({ clearAll: $setup.clearAll, selectAll: $setup.selectAll })), () => [
                createBaseVNode("div", _hoisted_3, [
                  createVNode($setup["Button"], {
                    variant: "ghost",
                    onClick: $setup.clearAll
                  }, {
                    default: withCtx(() => _cache[2] || (_cache[2] = [
                      createTextVNode(" Clear All")
                    ])),
                    _: 1
                    /* STABLE */
                  }),
                  createVNode($setup["Button"], {
                    variant: "ghost",
                    onClick: $setup.selectAll
                  }, {
                    default: withCtx(() => _cache[3] || (_cache[3] = [
                      createTextVNode(" Select All")
                    ])),
                    _: 1
                    /* STABLE */
                  })
                ])
              ])
            ]),
            _: 3
            /* FORWARDED */
          })
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["modelValue"])
    ]),
    _: 3
    /* FORWARDED */
  });
}
_sfc_main$1.__file = "src/components/MultiSelect/MultiSelect.vue";
const MultiSelect = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/MultiSelect/MultiSelect.vue"]]);
const _hoisted_1$2 = {
  class: "lucide lucide-check-check",
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
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M18 6 7 17l-5-5" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "m22 10-7.5 7.5L13 16" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideCheck = markRaw({ name: "lucide-check-check", render: render$1 });
const _hoisted_1$1 = {
  class: "lucide lucide-trash-2",
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
    createStaticVNode('<path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>', 5)
  ]));
}
const LucideTrash = markRaw({ name: "lucide-trash-2", render });
const img = "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=100&h=100&fit=crop";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MultiSelect.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = ref();
    const options = [
      { value: "red-apple", label: "Red Apple", img },
      { value: "blueberry-burst", label: "Blueberry Burst", img },
      { value: "orange-grove", label: "Orange Grove", img },
      { value: "banana-split", label: "Banana Split", img },
      { value: "grapes-cluster", label: "Grapes Cluster", img },
      { value: "kiwi-slice", label: "Kiwi Slice", img },
      { value: "mango-fusion", label: "Mango Fusion", img }
    ];
    const __returned__ = { state, img, options, MultiSelect, get LucideCheck() {
      return LucideCheck;
    }, get LucideTrash() {
      return LucideTrash;
    }, Avatar };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex justify-between my-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Button = Button;
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { width: 500, type: "grid" } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default" }, {
        default: withCtx(() => [
          createVNode($setup["MultiSelect"], {
            options: $setup.options,
            modelValue: $setup.state,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state = $event),
            placeholder: "Select fruit"
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Option slot" }, {
        default: withCtx(() => [
          createVNode($setup["MultiSelect"], {
            options: $setup.options,
            modelValue: $setup.state,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state = $event),
            placeholder: "Select fruit"
          }, {
            option: withCtx(({ item }) => [
              createVNode($setup["Avatar"], {
                image: item.img,
                size: "sm",
                class: "mr-2"
              }, null, 8, ["image"]),
              createTextVNode(
                " " + toDisplayString(item.label),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Footer slot" }, {
        default: withCtx(() => [
          createVNode($setup["MultiSelect"], {
            options: $setup.options,
            modelValue: $setup.state,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state = $event)
          }, {
            footer: withCtx(({ clearAll, selectAll }) => [
              createBaseVNode("div", _hoisted_1, [
                createVNode(_component_Button, {
                  theme: "red",
                  onClick: clearAll
                }, {
                  prefix: withCtx(() => [
                    createVNode($setup["LucideTrash"], { class: "size-4" })
                  ]),
                  default: withCtx(() => [
                    _cache[3] || (_cache[3] = createTextVNode(" Clear All "))
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"]),
                createVNode(_component_Button, { onClick: selectAll }, {
                  prefix: withCtx(() => [
                    createVNode($setup["LucideCheck"], { class: "size-4" })
                  ]),
                  default: withCtx(() => [
                    _cache[4] || (_cache[4] = createTextVNode(" Select All "))
                  ]),
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
_sfc_main.__file = "src/components/MultiSelect/MultiSelect.story.vue";
const MultiSelect_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/MultiSelect/MultiSelect.story.vue"]]);
export {
  MultiSelect_story as default
};
