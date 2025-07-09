import { ay as defineComponent, bW as useSlots, bH as useAttrs, aW as computed, aB as openBlock, aG as createElementBlock, aQ as normalizeClass, aZ as renderSlot, aH as createCommentVNode, b3 as withDirectives, bw as vShow, aN as toDisplayString, aF as createBaseVNode, aK as Fragment, aJ as renderList, aL as mergeProps } from "./vendor-ChvkOL3F.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Select",
  props: {
    size: { type: String, required: false, default: "sm" },
    variant: { type: String, required: false, default: "subtle" },
    placeholder: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    modelValue: { type: [String, Number], required: false },
    options: { type: Array, required: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const attrs = useAttrs();
    function handleChange(e) {
      emit("update:modelValue", e.target.value);
    }
    const selectOptions = computed(() => {
      var _a;
      return ((_a = props.options) == null ? void 0 : _a.map((option) => {
        if (typeof option === "string") {
          return {
            label: option,
            value: option
          };
        }
        return option;
      }).filter(Boolean)) || [];
    });
    const textColor = computed(() => {
      return props.disabled ? "text-ink-gray-4" : "text-ink-gray-8";
    });
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
        sm: "pl-2 pr-5",
        md: "pl-2.5 pr-5.5",
        lg: "pl-3 pr-6",
        xl: "pl-3 pr-6"
      }[props.size];
    });
    const selectClasses = computed(() => {
      let sizeClasses = {
        sm: "rounded h-7",
        md: "rounded h-8",
        lg: "rounded-md h-10",
        xl: "rounded-md h-10"
      }[props.size];
      let variant = props.disabled ? "disabled" : props.variant;
      let variantClasses = {
        subtle: "border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:border-outline-gray-4 focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3",
        outline: "border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3 focus:border-outline-gray-4 focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3",
        ghost: "bg-transparent border-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3 focus:border-outline-gray-4 focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3",
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
        textColor.value,
        "transition-colors w-full py-0 truncate"
      ];
    });
    let prefixClasses = computed(() => {
      return {
        sm: "pl-2",
        md: "pl-2.5",
        lg: "pl-3",
        xl: "pl-3"
      }[props.size];
    });
    const __returned__ = { props, emit, slots, attrs, handleChange, selectOptions, textColor, fontSizeClasses, paddingClasses, selectClasses, get prefixClasses() {
      return prefixClasses;
    }, set prefixClasses(v) {
      prefixClasses = v;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "relative flex items-center" };
const _hoisted_2 = ["disabled", "id", "value"];
const _hoisted_3 = ["value", "disabled", "selected"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    _ctx.$slots.prefix ? (openBlock(), createElementBlock(
      "div",
      {
        key: 0,
        class: normalizeClass([
          "absolute inset-y-0 left-0 flex items-center",
          $setup.textColor,
          $setup.prefixClasses
        ])
      },
      [
        renderSlot(_ctx.$slots, "prefix")
      ],
      2
      /* CLASS */
    )) : createCommentVNode("v-if", true),
    $props.placeholder ? withDirectives((openBlock(), createElementBlock(
      "div",
      {
        key: 1,
        class: normalizeClass(["pointer-events-none absolute text-ink-gray-4 truncate w-full", [$setup.fontSizeClasses, $setup.paddingClasses]])
      },
      toDisplayString($props.placeholder),
      3
      /* TEXT, CLASS */
    )), [
      [vShow, !$props.modelValue]
    ]) : createCommentVNode("v-if", true),
    createBaseVNode("select", mergeProps({
      class: $setup.selectClasses,
      disabled: $props.disabled,
      id: $props.id,
      value: $props.modelValue,
      onChange: $setup.handleChange
    }, $setup.attrs), [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.selectOptions, (option) => {
          return openBlock(), createElementBlock("option", {
            key: option.value,
            value: option.value,
            disabled: option.disabled || false,
            selected: $props.modelValue === option.value
          }, toDisplayString(option.label), 9, _hoisted_3);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ], 16, _hoisted_2)
  ]);
}
_sfc_main.__file = "src/components/Select/Select.vue";
const Select = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Select/Select.vue"]]);
export {
  Select as S
};
