import { ay as defineComponent, br as useSlots, c1 as useAttrs, az as ref, aQ as computed, aB as openBlock, aG as createElementBlock, aW as normalizeClass, aT as renderSlot, aH as createCommentVNode, aF as createBaseVNode, aL as mergeProps } from "./vendor-510ec02f.js";
import { d as debounce } from "./debounce-d11286cd.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "TextInput",
  props: {
    type: { type: String, required: false, default: "text" },
    size: { type: String, required: false, default: "sm" },
    variant: { type: String, required: false, default: "subtle" },
    placeholder: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    modelValue: { type: [String, Number], required: false },
    debounce: { type: Number, required: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const attrs = useAttrs();
    const inputRef = ref(null);
    __expose({ el: inputRef });
    const textColor = computed(() => {
      return props.disabled ? "text-gray-600" : "text-gray-800";
    });
    const inputClasses = computed(() => {
      let sizeClasses = {
        sm: "text-base rounded h-7",
        md: "text-base rounded h-8",
        lg: "text-lg rounded-md h-10",
        xl: "text-xl rounded-md h-10"
      }[props.size];
      let paddingClasses = {
        sm: [
          "py-1.5",
          slots.prefix ? "pl-8" : "pl-2",
          slots.suffix ? "pr-8" : "pr-2"
        ],
        md: [
          "py-1.5",
          slots.prefix ? "pl-9" : "pl-2.5",
          slots.suffix ? "pr-9" : "pr-2.5"
        ],
        lg: [
          "py-1.5",
          slots.prefix ? "pl-10" : "pl-3",
          slots.suffix ? "pr-10" : "pr-3"
        ],
        xl: [
          "py-1.5",
          slots.prefix ? "pl-10" : "pl-3",
          slots.suffix ? "pr-10" : "pr-3"
        ]
      }[props.size];
      let variant = props.disabled ? "disabled" : props.variant;
      let variantClasses = {
        subtle: "border border-gray-100 bg-gray-100 placeholder-gray-500 hover:border-gray-200 hover:bg-gray-200 focus:bg-white focus:border-gray-500 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-400",
        outline: "border border-gray-300 bg-white placeholder-gray-500 hover:border-gray-400 hover:shadow-sm focus:bg-white focus:border-gray-500 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-400",
        disabled: [
          "border bg-gray-50 placeholder-gray-400",
          props.variant === "outline" ? "border-gray-300" : "border-transparent"
        ]
      }[variant];
      return [
        sizeClasses,
        paddingClasses,
        variantClasses,
        textColor.value,
        "transition-colors w-full"
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
    let suffixClasses = computed(() => {
      return {
        sm: "pr-2",
        md: "pr-2.5",
        lg: "pr-3",
        xl: "pr-3"
      }[props.size];
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
    const __returned__ = { props, emit, slots, attrs, inputRef, textColor, inputClasses, get prefixClasses() {
      return prefixClasses;
    }, set prefixClasses(v) {
      prefixClasses = v;
    }, get suffixClasses() {
      return suffixClasses;
    }, set suffixClasses(v) {
      suffixClasses = v;
    }, get emitChange() {
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
const _hoisted_1 = { class: "relative flex items-center" };
const _hoisted_2 = ["type", "placeholder", "disabled", "id", "value"];
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
    createBaseVNode("input", mergeProps({
      ref: "inputRef",
      type: $props.type,
      placeholder: $props.placeholder,
      class: $setup.inputClasses,
      disabled: $props.disabled,
      id: $props.id,
      value: $props.modelValue,
      onInput: _cache[0] || (_cache[0] = (...args) => $setup.handleChange && $setup.handleChange(...args)),
      onChange: _cache[1] || (_cache[1] = (...args) => $setup.handleChange && $setup.handleChange(...args))
    }, $setup.attrs), null, 16, _hoisted_2),
    _ctx.$slots.suffix ? (openBlock(), createElementBlock(
      "div",
      {
        key: 1,
        class: normalizeClass([
          "absolute inset-y-0 right-0 flex items-center",
          $setup.textColor,
          $setup.suffixClasses
        ])
      },
      [
        renderSlot(_ctx.$slots, "suffix")
      ],
      2
      /* CLASS */
    )) : createCommentVNode("v-if", true)
  ]);
}
_sfc_main.__file = "src/components/TextInput.vue";
const TextInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextInput.vue"]]);
export {
  TextInput as T
};
