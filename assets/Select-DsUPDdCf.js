import { aC as defineComponent, aD as mergeModels, aE as useModel, aF as computed, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aI as normalizeClass, aG as renderSlot, aA as createElementBlock, aT as Fragment, aS as renderList, aQ as createTextVNode, aL as toDisplayString, cg as SelectContent_default, ch as SelectItem_default, ci as SelectItemText_default, cj as SelectPortal_default, ck as SelectRoot_default, cl as SelectTrigger_default, cm as SelectValue_default, cn as SelectViewport_default } from "./vendor-Bsn799PA.js";
import { L as LucideChevronDown } from "./chevron-down-CsgWZsbj.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
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
        "transition-colors w-full data-[state=open]:ring-2 ring-outline-gray-2 "
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
    }, get SelectContent() {
      return SelectContent_default;
    }, get SelectItem() {
      return SelectItem_default;
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
        class: normalizeClass(["inline-flex items-center gap-2 outline-none text-base data-[placeholder]:text-ink-gray-4 data-[disabled]:text-ink-gray-4", $setup.selectClasses]),
        "aria-label": "Customise options",
        disabled: $setup.props.disabled
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "prefix"),
          createVNode($setup["SelectValue"], {
            placeholder: $setup.props.placeholder
          }, null, 8, ["placeholder"]),
          createVNode($setup["LucideChevronDown"], { class: "size-4 text-ink-gray-4 ml-auto" })
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["class", "disabled"]),
      createVNode($setup["SelectPortal"], null, {
        default: withCtx(() => [
          createVNode($setup["SelectContent"], {
            class: "bg-surface-modal border rounded-lg shadow-lg will-change-[opacity,transform] z-[100] min-w-[--reka-select-trigger-width] max-h-[--reka-select-content-available-height] overflow-auto",
            "side-offset": 5,
            position: "popper"
          }, {
            default: withCtx(() => [
              createVNode($setup["SelectViewport"], { class: "p-1 flex flex-col" }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.selectOptions, (option, index) => {
                      return openBlock(), createBlock($setup["SelectItem"], {
                        disabled: option.disabled,
                        key: index,
                        value: option.value,
                        class: normalizeClass([[$setup.sizeClasses, $setup.paddingClasses, $setup.fontSizeClasses], "text-base text-ink-gray-9 flex items-center relative data-[highlighted]:bg-surface-gray-2 border-0 [data-state=checked]:bg-surface-gray-2 data-[disabled]:text-ink-gray-4"])
                      }, {
                        default: withCtx(() => [
                          createVNode(
                            $setup["SelectItemText"],
                            null,
                            {
                              default: withCtx(() => [
                                createTextVNode(
                                  toDisplayString(option.label),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              _: 2
                              /* DYNAMIC */
                            },
                            1024
                            /* DYNAMIC_SLOTS */
                          )
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["disabled", "value", "class"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["modelValue"]);
}
_sfc_main.__file = "src/components/Select/Select.vue";
const Select = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Select/Select.vue"]]);
export {
  Select as S
};
