import { ay as defineComponent, c3 as useSlots, cU as useAttrs, aU as computed, az as ref, aB as openBlock, aG as createElementBlock, aQ as normalizeClass, aX as renderSlot, aH as createCommentVNode, aF as createBaseVNode, aL as mergeProps, aZ as normalizeStyle } from "./vendor-BNOKmoOQ.js";
import { d as debounce } from "./debounce-CRCtzhPg.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
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
    debounce: { type: Number, required: false },
    required: { type: Boolean, required: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const attrs = useAttrs();
    const attrsWithoutClassStyle = computed(() => {
      return Object.fromEntries(
        // class and style is passed to the root element
        Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")
      );
    });
    const inputRef = ref(null);
    __expose({ el: inputRef });
    const textColor = computed(() => {
      return props.disabled ? "text-ink-gray-5" : "text-ink-gray-8";
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
        textColor.value,
        "transition-colors w-full dark:[color-scheme:dark]"
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
    const __returned__ = { props, emit, slots, attrs, attrsWithoutClassStyle, inputRef, textColor, inputClasses, get prefixClasses() {
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
const _hoisted_1 = ["type", "placeholder", "disabled", "id", "value", "required"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["relative flex items-center", $setup.attrs.class]),
      style: normalizeStyle($setup.attrs.style)
    },
    [
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
        required: $props.required,
        onInput: _cache[0] || (_cache[0] = (...args) => $setup.handleChange && $setup.handleChange(...args)),
        onChange: _cache[1] || (_cache[1] = (...args) => $setup.handleChange && $setup.handleChange(...args))
      }, $setup.attrsWithoutClassStyle), null, 16, _hoisted_1),
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
    ],
    6
    /* CLASS, STYLE */
  );
}
_sfc_main.__file = "src/components/TextInput/TextInput.vue";
const TextInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextInput/TextInput.vue"]]);
export {
  TextInput as T
};
