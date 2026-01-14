import { ay as _export_sfc, az as defineComponent, aM as mergeModels, aN as useModel, aO as computed, aD as openBlock, aE as createBlock, aF as withCtx, aH as createVNode, aQ as normalizeClass, aP as renderSlot, aL as createElementBlock, aV as Fragment, aU as renderList, aW as mergeProps, aT as createTextVNode, aJ as toDisplayString, ch as SelectContent_default, ci as SelectItem_default, cj as SelectItemIndicator_default, bU as SelectItemText_default, ck as SelectPortal_default, cl as SelectRoot_default, cm as SelectTrigger_default, cn as SelectValue_default, co as SelectViewport_default } from "./vendor-By8Zq8JN.js";
import { L as LucideChevronDown } from "./chevron-down-CZk0UBd7.js";
import { L as LucideCheck } from "./check-DDri_vXv.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Select",
  props: /* @__PURE__ */ mergeModels({
    size: { type: String, required: false, default: "sm" },
    variant: { type: String, required: false, default: "subtle" },
    placeholder: { type: String, required: false, default: "Select option" },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    modelValue: { type: [String, Number], required: false },
    options: { type: Array, required: false }
  }, {
    "modelValue": { type: null },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const model = useModel(__props, "modelValue");
    const props = __props;
    const fontSizeClasses = computed(() => {
      return {
        sm: "text-base",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      }[props.size];
    });
    const paddingClasses = computed(() => {
      return {
        sm: "px-2",
        md: "px-2.5 ",
        lg: "px-3",
        xl: "px-3"
      }[props.size];
    });
    let sizeClasses = {
      sm: "rounded min-h-7",
      md: "rounded min-h-8",
      lg: "rounded-md min-h-10",
      xl: "rounded-md min-h-10"
    }[props.size];
    const selectClasses = computed(() => {
      let variant = props.disabled ? "disabled" : props.variant;
      let variantClasses = {
        subtle: "border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3",
        outline: "border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3",
        ghost: "bg-transparent border-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3",
        disabled: [
          "border",
          props.variant !== "ghost" ? "bg-surface-gray-1" : "",
          props.variant === "outline" ? "border-outline-gray-2" : "border-transparent"
        ]
      }[variant];
      return [
        sizeClasses,
        fontSizeClasses.value,
        paddingClasses.value,
        variantClasses,
        "transition-colors w-full focus:ring-2 data-[state=open]:ring-2 ring-outline-gray-3 "
      ];
    });
    const selectOptions = computed(() => {
      var _a, _b, _c;
      const str = typeof ((_a = props.options) == null ? void 0 : _a[0]) == "string";
      const tmp = (_b = props.options) == null ? void 0 : _b.map((x) => ({ label: x, value: x }));
      return ((_c = str ? tmp : props.options) == null ? void 0 : _c.filter((x) => x && String(x.value))) || [];
    });
    const __returned__ = { model, props, fontSizeClasses, paddingClasses, get sizeClasses() {
      return sizeClasses;
    }, set sizeClasses(v) {
      sizeClasses = v;
    }, selectClasses, selectOptions, get LucideChevronDown() {
      return LucideChevronDown;
    }, get LucideCheck() {
      return LucideCheck;
    }, get SelectContent() {
      return SelectContent_default;
    }, get SelectItem() {
      return SelectItem_default;
    }, get SelectItemIndicator() {
      return SelectItemIndicator_default;
    }, get SelectItemText() {
      return SelectItemText_default;
    }, get SelectPortal() {
      return SelectPortal_default;
    }, get SelectRoot() {
      return SelectRoot_default;
    }, get SelectTrigger() {
      return SelectTrigger_default;
    }, get SelectValue() {
      return SelectValue_default;
    }, get SelectViewport() {
      return SelectViewport_default;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["SelectRoot"], {
    modelValue: $setup.model,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.model = $event)
  }, {
    default: withCtx(() => [
      createVNode($setup["SelectTrigger"], {
        class: normalizeClass(["inline-flex items-center gap-2 outline-none text-base text-ink-gray-7 data-[placeholder]:text-ink-gray-4 data-[disabled]:text-ink-gray-4", [$setup.selectClasses, _ctx.$attrs.class]]),
        "aria-label": "Customise options",
        disabled: $props.disabled
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "prefix", {}, void 0, true),
          createVNode($setup["SelectValue"], {
            placeholder: $props.placeholder,
            class: "truncate"
          }, null, 8, ["placeholder"]),
          renderSlot(_ctx.$slots, "suffix", {}, () => [
            createVNode($setup["LucideChevronDown"], { class: "size-4 text-ink-gray-4 ml-auto shrink-0" })
          ], true)
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["class", "disabled"]),
      createVNode($setup["SelectPortal"], null, {
        default: withCtx(() => [
          createVNode($setup["SelectContent"], { class: "bg-surface-modal border rounded-lg shadow-lg will-change-[opacity,transform] z-[100] overflow-hidden origin-center data-[state=open]:animate-[fadeInScale_150ms] data-[state=closed]:animate-[fadeOutScale_150ms]" }, {
            default: withCtx(() => [
              createVNode($setup["SelectViewport"], { class: "p-1 flex flex-col" }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.selectOptions, (option) => {
                      return openBlock(), createBlock($setup["SelectItem"], {
                        disabled: option.disabled,
                        key: option.value,
                        value: option.value,
                        class: normalizeClass([[$setup.sizeClasses, $setup.paddingClasses, $setup.fontSizeClasses], "text-base text-ink-gray-9 flex items-center data-[highlighted]:bg-surface-gray-2 border-0 data-[state=checked]:bg-surface-gray-2 data-[disabled]:text-ink-gray-4 select-none"])
                      }, {
                        default: withCtx(() => [
                          createVNode(
                            $setup["SelectItemText"],
                            null,
                            {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "option", mergeProps({ ref_for: true }, { option }), () => [
                                  createTextVNode(
                                    toDisplayString(option.label),
                                    1
                                    /* TEXT */
                                  )
                                ], true)
                              ]),
                              _: 2
                              /* DYNAMIC */
                            },
                            1024
                            /* DYNAMIC_SLOTS */
                          ),
                          createVNode($setup["SelectItemIndicator"], {
                            as: $setup.LucideCheck,
                            class: "size-4 ml-auto"
                          }, null, 8, ["as"])
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["disabled", "value", "class"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  renderSlot(_ctx.$slots, "footer", {}, void 0, true)
                ]),
                _: 3
                /* FORWARDED */
              })
            ]),
            _: 3
            /* FORWARDED */
          })
        ]),
        _: 3
        /* FORWARDED */
      })
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["modelValue"]);
}
_sfc_main.__file = "src/components/Select/Select.vue";
const Select = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2ab49dc3"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Select/Select.vue"]]);
export {
  Select as S
};
