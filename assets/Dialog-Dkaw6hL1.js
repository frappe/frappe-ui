import { ay as defineComponent, aU as computed, aI as reactive, cJ as Ge, cK as Ve, cL as Ye, cM as he, cN as Se, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aQ as normalizeClass, aX as renderSlot, aG as createElementBlock, aH as createCommentVNode, aN as toDisplayString, aR as normalizeProps, aS as guardReactiveProps, aK as Fragment, aJ as renderList, aL as mergeProps, aM as createTextVNode } from "./vendor-CKIykXYp.js";
import { _ as __unplugin_components_0 } from "./Button-BPUix8Wb.js";
import { F as FeatherIcon } from "./FeatherIcon-Dj1BA9ir.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dialog",
  props: {
    modelValue: { type: Boolean, required: true },
    options: { type: Object, required: false, default: () => ({}) },
    disableOutsideClickToClose: { type: Boolean, required: false, default: false }
  },
  emits: ["update:modelValue", "close", "after-leave"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const actions = computed(() => {
      let actions2 = props.options.actions;
      if (!(actions2 == null ? void 0 : actions2.length)) return [];
      return actions2.map((action) => {
        let _action = reactive({
          ...action,
          loading: false,
          onClick: !action.onClick ? close : async () => {
            _action.loading = true;
            try {
              if (action.onClick) {
                let backwardsCompatibleContext = function() {
                  console.warn(
                    "Value passed to onClick is a context object. Please use context.close() instead of context() to close the dialog."
                  );
                  close();
                };
                backwardsCompatibleContext.close = close;
                await action.onClick(backwardsCompatibleContext);
              }
            } finally {
              _action.loading = false;
            }
          }
        });
        return _action;
      });
    });
    const isOpen = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        emit("update:modelValue", val);
        if (!val) {
          emit("close");
        }
      }
    });
    function close() {
      isOpen.value = false;
    }
    const icon = computed(() => {
      var _a;
      if (!((_a = props.options) == null ? void 0 : _a.icon)) return null;
      let icon2 = props.options.icon;
      if (typeof icon2 === "string") {
        icon2 = { name: icon2 };
      }
      return icon2;
    });
    const dialogPositionClasses = computed(() => {
      var _a;
      const position = ((_a = props.options) == null ? void 0 : _a.position) || "center";
      return {
        center: "justify-center",
        top: "pt-[20vh]"
      }[position];
    });
    const dialogIconBgClasses = computed(() => {
      var _a;
      const appearance = (_a = icon.value) == null ? void 0 : _a.appearance;
      if (!appearance) return "bg-surface-gray-2";
      return {
        warning: "bg-surface-amber-2",
        info: "bg-surface-blue-2",
        danger: "bg-surface-red-2",
        success: "bg-surface-green-2"
      }[appearance];
    });
    const dialogIconClasses = computed(() => {
      var _a;
      const appearance = (_a = icon.value) == null ? void 0 : _a.appearance;
      if (!appearance) return "text-ink-gray-5";
      return {
        warning: "text-ink-amber-3",
        info: "text-ink-blue-3",
        danger: "text-ink-red-4",
        success: "text-ink-green-3"
      }[appearance];
    });
    const __returned__ = { props, emit, actions, isOpen, close, icon, dialogPositionClasses, dialogIconBgClasses, dialogIconClasses, get DialogPanel() {
      return Ge;
    }, get DialogTitle() {
      return Ve;
    }, get HDialog() {
      return Ye;
    }, get TransitionChild() {
      return he;
    }, get TransitionRoot() {
      return Se;
    }, get Button() {
      return __unplugin_components_0;
    }, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["data-dialog"];
const _hoisted_2 = { class: "bg-surface-modal px-4 pb-6 pt-5 sm:px-6" };
const _hoisted_3 = { class: "flex" };
const _hoisted_4 = { class: "w-full flex-1" };
const _hoisted_5 = { class: "mb-6 flex items-center justify-between" };
const _hoisted_6 = { class: "flex items-center space-x-2" };
const _hoisted_7 = { class: "text-2xl font-semibold leading-6 text-ink-gray-9" };
const _hoisted_8 = {
  key: 0,
  class: "text-p-base text-ink-gray-7"
};
const _hoisted_9 = {
  key: 0,
  class: "px-4 pb-7 pt-4 sm:px-6"
};
const _hoisted_10 = { class: "space-y-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["TransitionRoot"], {
    as: "template",
    show: $setup.isOpen,
    onAfterLeave: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("after-leave"))
  }, {
    default: withCtx(() => [
      createVNode($setup["HDialog"], {
        as: "div",
        class: "fixed inset-0 z-10 overflow-y-auto",
        onClose: _cache[0] || (_cache[0] = ($event) => !$props.disableOutsideClickToClose && $setup.close())
      }, {
        default: withCtx(() => [
          createBaseVNode(
            "div",
            {
              class: normalizeClass(["flex min-h-screen flex-col items-center px-4 py-4 text-center", $setup.dialogPositionClasses])
            },
            [
              createVNode($setup["TransitionChild"], {
                as: "template",
                enter: "ease-out duration-150",
                "enter-from": "opacity-0",
                "enter-to": "opacity-100",
                leave: "ease-in duration-150",
                "leave-from": "opacity-100",
                "leave-to": "opacity-0"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", {
                    class: "fixed inset-0 bg-black-overlay-200 transition-opacity dark:backdrop-filter dark:backdrop-blur-[1px]",
                    "data-dialog": $props.options.title
                  }, null, 8, _hoisted_1)
                ]),
                _: 1
                /* STABLE */
              }),
              createVNode($setup["TransitionChild"], {
                as: "template",
                enter: "ease-out duration-150",
                "enter-from": "opacity-50 translate-y-2 scale-95",
                "enter-to": "opacity-100 translate-y-0 scale-100",
                leave: "ease-in duration-150",
                "leave-from": "opacity-100 translate-y-0 scale-100",
                "leave-to": "opacity-50 translate-y-4 translate-y-4 scale-95"
              }, {
                default: withCtx(() => [
                  createVNode($setup["DialogPanel"], {
                    class: normalizeClass(["my-8 inline-block w-full transform overflow-hidden rounded-xl bg-surface-modal text-left align-middle shadow-xl transition-all", {
                      "max-w-7xl": $props.options.size === "7xl",
                      "max-w-6xl": $props.options.size === "6xl",
                      "max-w-5xl": $props.options.size === "5xl",
                      "max-w-4xl": $props.options.size === "4xl",
                      "max-w-3xl": $props.options.size === "3xl",
                      "max-w-2xl": $props.options.size === "2xl",
                      "max-w-xl": $props.options.size === "xl",
                      "max-w-lg": $props.options.size === "lg" || !$props.options.size,
                      "max-w-md": $props.options.size === "md",
                      "max-w-sm": $props.options.size === "sm",
                      "max-w-xs": $props.options.size === "xs"
                    }])
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "body", {}, () => [
                        renderSlot(_ctx.$slots, "body-main", {}, () => [
                          createBaseVNode("div", _hoisted_2, [
                            createBaseVNode("div", _hoisted_3, [
                              createBaseVNode("div", _hoisted_4, [
                                renderSlot(_ctx.$slots, "body-header", {}, () => [
                                  createBaseVNode("div", _hoisted_5, [
                                    createBaseVNode("div", _hoisted_6, [
                                      $setup.icon ? (openBlock(), createElementBlock(
                                        "div",
                                        {
                                          key: 0,
                                          class: normalizeClass(["flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full", $setup.dialogIconBgClasses])
                                        },
                                        [
                                          createVNode($setup["FeatherIcon"], {
                                            name: $setup.icon.name,
                                            class: normalizeClass(["h-4 w-4", $setup.dialogIconClasses]),
                                            "aria-hidden": "true"
                                          }, null, 8, ["name", "class"])
                                        ],
                                        2
                                        /* CLASS */
                                      )) : createCommentVNode("v-if", true),
                                      createVNode($setup["DialogTitle"], { as: "header" }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "body-title", {}, () => [
                                            createBaseVNode(
                                              "h3",
                                              _hoisted_7,
                                              toDisplayString($props.options.title || "Untitled"),
                                              1
                                              /* TEXT */
                                            )
                                          ])
                                        ]),
                                        _: 3
                                        /* FORWARDED */
                                      })
                                    ]),
                                    createVNode($setup["Button"], {
                                      variant: "ghost",
                                      onClick: $setup.close
                                    }, {
                                      icon: withCtx(() => _cache[2] || (_cache[2] = [
                                        createBaseVNode(
                                          "svg",
                                          {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 16 16",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            class: "text-ink-gray-9"
                                          },
                                          [
                                            createBaseVNode("path", {
                                              "fill-rule": "evenodd",
                                              "clip-rule": "evenodd",
                                              d: "M12.8567 3.85355C13.052 3.65829 13.052 3.34171 12.8567 3.14645C12.6615 2.95118 12.3449 2.95118 12.1496 3.14645L8.00201 7.29405L3.85441 3.14645C3.65914 2.95118 3.34256 2.95118 3.1473 3.14645C2.95204 3.34171 2.95204 3.65829 3.1473 3.85355L7.29491 8.00116L3.14645 12.1496C2.95118 12.3449 2.95118 12.6615 3.14645 12.8567C3.34171 13.052 3.65829 13.052 3.85355 12.8567L8.00201 8.70827L12.1505 12.8567C12.3457 13.052 12.6623 13.052 12.8576 12.8567C13.0528 12.6615 13.0528 12.3449 12.8576 12.1496L8.70912 8.00116L12.8567 3.85355Z",
                                              fill: "currentColor"
                                            })
                                          ],
                                          -1
                                          /* HOISTED */
                                        )
                                      ])),
                                      _: 1
                                      /* STABLE */
                                    })
                                  ])
                                ]),
                                renderSlot(_ctx.$slots, "body-content", {}, () => [
                                  $props.options.message ? (openBlock(), createElementBlock(
                                    "p",
                                    _hoisted_8,
                                    toDisplayString($props.options.message),
                                    1
                                    /* TEXT */
                                  )) : createCommentVNode("v-if", true)
                                ])
                              ])
                            ])
                          ])
                        ]),
                        $setup.actions.length || _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_9, [
                          renderSlot(_ctx.$slots, "actions", normalizeProps(guardReactiveProps({ close: $setup.close })), () => [
                            createBaseVNode("div", _hoisted_10, [
                              (openBlock(true), createElementBlock(
                                Fragment,
                                null,
                                renderList($setup.actions, (action) => {
                                  return openBlock(), createBlock($setup["Button"], mergeProps({
                                    class: "w-full",
                                    key: action.label,
                                    disabled: action.disabled,
                                    ref_for: true
                                  }, action), {
                                    default: withCtx(() => [
                                      createTextVNode(
                                        toDisplayString(action.label),
                                        1
                                        /* TEXT */
                                      )
                                    ]),
                                    _: 2
                                    /* DYNAMIC */
                                  }, 1040, ["disabled"]);
                                }),
                                128
                                /* KEYED_FRAGMENT */
                              ))
                            ])
                          ])
                        ])) : createCommentVNode("v-if", true)
                      ])
                    ]),
                    _: 3
                    /* FORWARDED */
                  }, 8, ["class"])
                ]),
                _: 3
                /* FORWARDED */
              })
            ],
            2
            /* CLASS */
          )
        ]),
        _: 3
        /* FORWARDED */
      })
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["show"]);
}
_sfc_main.__file = "src/components/Dialog/Dialog.vue";
const __unplugin_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dialog/Dialog.vue"]]);
export {
  __unplugin_components_2 as _
};
