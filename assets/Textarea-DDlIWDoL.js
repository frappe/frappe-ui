import { ay as defineComponent, b_ as useAttrs, az as ref, bt as computed, aB as openBlock, aG as createElementBlock, aQ as normalizeClass, aN as toDisplayString, aH as createCommentVNode, aF as createBaseVNode, aL as mergeProps } from "./vendor-C2GbpdxB.js";
import { d as debounce } from "./debounce-CRCtzhPg.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Textarea",
  props: {
    size: { type: String, required: false, default: "sm" },
    variant: { type: String, required: false, default: "subtle" },
    placeholder: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    modelValue: { type: String, required: false },
    debounce: { type: Number, required: false },
    rows: { type: Number, required: false, default: 3 },
    label: { type: String, required: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const attrs = useAttrs();
    const textareaRef = ref(null);
    const inputClasses = computed(() => {
      let sizeClasses = {
        sm: "text-base rounded",
        md: "text-base rounded",
        lg: "text-lg rounded-md",
        xl: "text-xl rounded-md"
      }[props.size];
      let paddingClasses = {
        sm: ["py-1.5 px-2"],
        md: ["py-1.5 px-2.5"],
        lg: ["py-1.5 px-3"],
        xl: ["py-1.5 px-3"]
      }[props.size];
      let variant = props.disabled ? "disabled" : props.variant;
      let variantClasses = {
        subtle: "border border-[--surface-gray-2] bg-surface-gray-2 placeholder-ink-gray-4 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3",
        outline: "border border-outline-gray-2 bg-surface-white placeholder-ink-gray-4 hover:border-outline-gray-3 hover:shadow-sm focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3",
        disabled: [
          "border bg-surface-gray-1 placeholder-ink-gray-3",
          props.variant === "outline" ? "border-outline-gray-2" : "border-transparent"
        ]
      }[variant];
      return [
        sizeClasses,
        paddingClasses,
        variantClasses,
        props.disabled ? "text-ink-gray-5" : "text-ink-gray-8",
        "transition-colors w-full block"
      ];
    });
    const labelClasses = computed(() => {
      return [
        {
          sm: "text-xs",
          md: "text-base",
          lg: "text-lg",
          xl: "text-xl"
        }[props.size],
        "text-ink-gray-5"
      ];
    });
    let emitChange = (value) => {
      emit("update:modelValue", value);
    };
    if (props.debounce) {
      emitChange = debounce(emitChange, props.debounce);
    }
    let handleChange = (e) => {
      emitChange(e.target.value);
    };
    __expose({ el: textareaRef });
    const __returned__ = { props, emit, attrs, textareaRef, inputClasses, labelClasses, get emitChange() {
      return emitChange;
    }, set emitChange(v) {
      emitChange = v;
    }, get handleChange() {
      return handleChange;
    }, set handleChange(v) {
      handleChange = v;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "space-y-1.5" };
const _hoisted_2 = ["for"];
const _hoisted_3 = ["placeholder", "disabled", "id", "value", "rows"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.label ? (openBlock(), createElementBlock("label", {
      key: 0,
      class: normalizeClass(["block", $setup.labelClasses]),
      for: $props.id
    }, toDisplayString($props.label), 11, _hoisted_2)) : createCommentVNode("v-if", true),
    createBaseVNode("textarea", mergeProps({
      ref: "textareaRef",
      placeholder: $props.placeholder,
      class: $setup.inputClasses,
      disabled: $props.disabled,
      id: $props.id,
      value: $props.modelValue,
      rows: $props.rows,
      onInput: _cache[0] || (_cache[0] = (...args) => $setup.handleChange && $setup.handleChange(...args)),
      onChange: _cache[1] || (_cache[1] = (...args) => $setup.handleChange && $setup.handleChange(...args))
    }, $setup.attrs), null, 16, _hoisted_3)
  ]);
}
_sfc_main.__file = "src/components/Textarea.vue";
const Textarea = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Textarea.vue"]]);
export {
  Textarea as T
};
