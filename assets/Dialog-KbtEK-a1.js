import { aC as defineComponent, aF as computed, aR as reactive, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aB as createBaseVNode, aI as normalizeClass, b0 as normalizeStyle, aG as renderSlot, aA as createElementBlock, aK as createCommentVNode, aL as toDisplayString, bc as normalizeProps, bd as guardReactiveProps, aT as Fragment, aS as renderList, aU as mergeProps, aQ as createTextVNode, cq as DialogRoot_default, cr as DialogPortal_default, cs as DialogOverlay_default, ct as DialogContent_default, co as DialogTitle_default, cp as DialogDescription_default, cu as DialogClose_default } from "./vendor-B3LauSTG.js";
import { F as FeatherIcon } from "./FeatherIcon-Chmu_NhA.js";
import { L as LucideX } from "./x-Fa9zRqIE.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { B as Button } from "./Button-CZeyY7cx.js";
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
                let backwardsCompatibleContext = () => {
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
    function handleOpenChange(open) {
      isOpen.value = open;
    }
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
      var _a, _b;
      if ((_a = props.options) == null ? void 0 : _a.paddingTop) return "";
      const position = ((_b = props.options) == null ? void 0 : _b.position) || "center";
      const classMap = {
        center: "justify-center",
        top: "pt-[20vh]"
      };
      return classMap[position];
    });
    const dialogPositionStyles = computed(() => {
      var _a;
      if ((_a = props.options) == null ? void 0 : _a.paddingTop) {
        return { paddingTop: props.options.paddingTop };
      }
      return {};
    });
    const dialogIconBgClasses = computed(() => {
      var _a;
      const appearance = (_a = icon.value) == null ? void 0 : _a.appearance;
      if (!appearance) return "bg-surface-gray-2";
      const classMap = {
        warning: "bg-surface-amber-2",
        info: "bg-surface-blue-2",
        danger: "bg-surface-red-2",
        success: "bg-surface-green-2"
      };
      return classMap[appearance];
    });
    const dialogIconClasses = computed(() => {
      var _a;
      const appearance = (_a = icon.value) == null ? void 0 : _a.appearance;
      if (!appearance) return "text-ink-gray-5";
      const classMap = {
        warning: "text-ink-amber-3",
        info: "text-ink-blue-3",
        danger: "text-ink-red-4",
        success: "text-ink-green-3"
      };
      return classMap[appearance];
    });
    const __returned__ = { props, emit, actions, isOpen, handleOpenChange, close, icon, dialogPositionClasses, dialogPositionStyles, dialogIconBgClasses, dialogIconClasses, get DialogRoot() {
      return DialogRoot_default;
    }, get DialogPortal() {
      return DialogPortal_default;
    }, get DialogOverlay() {
      return DialogOverlay_default;
    }, get DialogContent() {
      return DialogContent_default;
    }, get DialogTitle() {
      return DialogTitle_default;
    }, get DialogDescription() {
      return DialogDescription_default;
    }, get DialogClose() {
      return DialogClose_default;
    }, get Button() {
      return Button;
    }, FeatherIcon, get LucideX() {
      return LucideX;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "bg-surface-modal px-4 pb-6 pt-5 sm:px-6" };
const _hoisted_2 = { class: "flex" };
const _hoisted_3 = { class: "w-full flex-1" };
const _hoisted_4 = { class: "mb-6 flex items-center justify-between" };
const _hoisted_5 = { class: "flex items-center space-x-2" };
const _hoisted_6 = { class: "text-2xl font-semibold leading-6 text-ink-gray-9" };
const _hoisted_7 = { class: "text-p-base text-ink-gray-7" };
const _hoisted_8 = {
  key: 0,
  class: "px-4 pb-7 pt-4 sm:px-6"
};
const _hoisted_9 = { class: "space-y-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["DialogRoot"], {
    open: $setup.isOpen,
    "onUpdate:open": [
      _cache[3] || (_cache[3] = ($event) => $setup.isOpen = $event),
      $setup.handleOpenChange
    ]
  }, {
    default: withCtx(() => [
      createVNode($setup["DialogPortal"], null, {
        default: withCtx(() => [
          createVNode($setup["DialogOverlay"], {
            class: "fixed inset-0 bg-black-overlay-200 backdrop-filter backdrop-blur-[12px] overflow-y-auto dialog-overlay outline-none",
            "data-dialog": $props.options.title,
            onAfterLeave: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("after-leave"))
          }, {
            default: withCtx(() => [
              createBaseVNode(
                "div",
                {
                  class: normalizeClass(["flex min-h-screen flex-col items-center px-4 py-4 text-center", $setup.dialogPositionClasses]),
                  style: normalizeStyle($setup.dialogPositionStyles)
                },
                [
                  createVNode($setup["DialogContent"], {
                    class: normalizeClass(["my-8 inline-block w-full transform overflow-hidden rounded-xl bg-surface-modal text-left align-middle shadow-xl dialog-content focus-visible:outline-none", {
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
                    }]),
                    onEscapeKeyDown: _cache[0] || (_cache[0] = ($event) => $setup.close()),
                    onInteractOutside: _cache[1] || (_cache[1] = (e) => {
                      if ($setup.props.disableOutsideClickToClose) {
                        e.preventDefault();
                      }
                    })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "body", {}, () => [
                        renderSlot(_ctx.$slots, "body-main", {}, () => [
                          createBaseVNode("div", _hoisted_1, [
                            createBaseVNode("div", _hoisted_2, [
                              createBaseVNode("div", _hoisted_3, [
                                renderSlot(_ctx.$slots, "body-header", {}, () => [
                                  createBaseVNode("div", _hoisted_4, [
                                    createBaseVNode("div", _hoisted_5, [
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
                                              _hoisted_6,
                                              toDisplayString($props.options.title || "Untitled"),
                                              1
                                              /* TEXT */
                                            )
                                          ], true)
                                        ]),
                                        _: 3
                                        /* FORWARDED */
                                      })
                                    ]),
                                    createVNode($setup["DialogClose"], { "as-child": "" }, {
                                      default: withCtx(() => [
                                        createVNode($setup["Button"], {
                                          variant: "ghost",
                                          onClick: $setup.close
                                        }, {
                                          icon: withCtx(() => [
                                            createVNode($setup["LucideX"], { class: "h-4 w-4 text-ink-gray-9" })
                                          ]),
                                          _: 1
                                          /* STABLE */
                                        })
                                      ]),
                                      _: 1
                                      /* STABLE */
                                    })
                                  ])
                                ], true),
                                renderSlot(_ctx.$slots, "body-content", {}, () => [
                                  $props.options.message ? (openBlock(), createBlock($setup["DialogDescription"], {
                                    key: 0,
                                    "as-child": ""
                                  }, {
                                    default: withCtx(() => [
                                      createBaseVNode(
                                        "p",
                                        _hoisted_7,
                                        toDisplayString($props.options.message),
                                        1
                                        /* TEXT */
                                      )
                                    ]),
                                    _: 1
                                    /* STABLE */
                                  })) : createCommentVNode("v-if", true)
                                ], true)
                              ])
                            ])
                          ])
                        ], true),
                        $setup.actions.length || _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_8, [
                          renderSlot(_ctx.$slots, "actions", normalizeProps(guardReactiveProps({ close: $setup.close })), () => [
                            createBaseVNode("div", _hoisted_9, [
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
                          ], true)
                        ])) : createCommentVNode("v-if", true)
                      ], true)
                    ]),
                    _: 3
                    /* FORWARDED */
                  }, 8, ["class"])
                ],
                6
                /* CLASS, STYLE */
              )
            ]),
            _: 3
            /* FORWARDED */
          }, 8, ["data-dialog"])
        ]),
        _: 3
        /* FORWARDED */
      })
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["open"]);
}
_sfc_main.__file = "src/components/Dialog/Dialog.vue";
const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9f0eda9f"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dialog/Dialog.vue"]]);
export {
  __unplugin_components_1 as _
};
