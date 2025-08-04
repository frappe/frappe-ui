import { ay as defineComponent, bG as useAttrs, aW as computed, aB as openBlock, aG as createElementBlock, aF as createBaseVNode, aL as mergeProps, aR as normalizeClass, aN as toDisplayString, aH as createCommentVNode } from "./vendor-BSRqwcW1.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
let id = 0;
function generateId() {
  return ++id;
}
function useId() {
  return "frappe-ui-" + generateId();
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Checkbox",
  props: {
    size: { type: String, required: false, default: "sm" },
    label: { type: String, required: false },
    checked: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    padding: { type: Boolean, required: false, default: false },
    modelValue: { type: [Boolean, Number], required: false },
    id: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const attrs = useAttrs();
    const htmlId = props.id ?? useId();
    const labelClasses = computed(() => {
      return [
        {
          sm: "text-base font-medium",
          md: "text-lg font-medium"
        }[props.size],
        props.disabled ? "text-ink-gray-4" : "text-ink-gray-8",
        "select-none"
      ];
    });
    const inputClasses = computed(() => {
      let baseClasses = props.disabled ? "border-outline-gray-2 bg-surface-menu-bar text-ink-gray-3" : "border-outline-gray-4 text-ink-gray-9 hover:border-gray-600 focus:ring-offset-0 focus:border-gray-900 active:border-gray-700 transition";
      let interactionClasses = props.disabled ? "" : props.padding ? "focus:ring-0" : "hover:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3 active:bg-surface-gray-2";
      let sizeClasses = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4"
      }[props.size];
      return [baseClasses, interactionClasses, sizeClasses];
    });
    const __returned__ = { props, attrs, htmlId, labelClasses, inputClasses };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["disabled", "id", "checked"];
const _hoisted_2 = ["for"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["inline-flex space-x-2 rounded transition", {
        "px-2.5 py-1.5": $props.padding && $props.size === "sm",
        "px-3 py-2": $props.padding && $props.size === "md",
        "focus-within:bg-surface-gray-2 focus-within:ring-2 focus-within:ring-outline-gray-3 hover:bg-surface-gray-3 active:bg-surface-gray-4": $props.padding && !$props.disabled
      }])
    },
    [
      createBaseVNode("input", mergeProps({
        class: ["rounded-sm mt-[1px]", $setup.inputClasses],
        type: "checkbox",
        disabled: $props.disabled,
        id: $setup.htmlId,
        checked: Boolean($props.modelValue),
        onChange: _cache[0] || (_cache[0] = (e) => _ctx.$emit("update:modelValue", e.target.checked))
      }, $setup.attrs), null, 16, _hoisted_1),
      $props.label ? (openBlock(), createElementBlock("label", {
        key: 0,
        class: normalizeClass(["block", $setup.labelClasses]),
        for: $setup.htmlId
      }, toDisplayString($props.label), 11, _hoisted_2)) : createCommentVNode("v-if", true)
    ],
    2
    /* CLASS */
  );
}
_sfc_main.__file = "src/components/Checkbox/Checkbox.vue";
const Checkbox = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Checkbox/Checkbox.vue"]]);
export {
  Checkbox as C,
  useId as u
};
