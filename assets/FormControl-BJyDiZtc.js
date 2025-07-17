import { ay as defineComponent, aW as computed, aB as openBlock, aG as createElementBlock, aM as createTextVNode, aN as toDisplayString, aK as Fragment, aF as createBaseVNode, aH as createCommentVNode, aQ as normalizeClass, bH as useAttrs, aC as createBlock, cI as createSlots, aD as withCtx, aZ as renderSlot, aL as mergeProps, aR as normalizeProps, aS as guardReactiveProps, a$ as normalizeStyle } from "./vendor-BPP-lk0W.js";
import { C as Checkbox, u as useId } from "./Checkbox-CRiBRL9k.js";
import { T as TextInput } from "./TextInput-3BQEZW-0.js";
import { S as Select } from "./Select-vuuM3nam.js";
import { T as Textarea } from "./Textarea-uiarkyGZ.js";
import { A as Autocomplete } from "./Autocomplete-8wmp0fUp.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FormLabel",
  props: {
    label: { type: String, required: true },
    size: { type: String, required: false, default: "sm" },
    id: { type: String, required: false },
    required: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const labelClasses = computed(() => {
      return [
        {
          sm: "text-xs",
          md: "text-base"
        }[props.size],
        "text-ink-gray-5"
      ];
    });
    const __returned__ = { props, labelClasses };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["for"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", {
    class: normalizeClass(["block", $setup.labelClasses]),
    for: $props.id
  }, [
    createTextVNode(
      toDisplayString($props.label) + " ",
      1
      /* TEXT */
    ),
    $props.required ? (openBlock(), createElementBlock(
      Fragment,
      { key: 0 },
      [
        _cache[0] || (_cache[0] = createBaseVNode(
          "span",
          {
            class: "text-ink-red-3 select-none",
            "aria-hidden": "true"
          },
          "*",
          -1
          /* HOISTED */
        )),
        _cache[1] || (_cache[1] = createBaseVNode(
          "span",
          { class: "sr-only" },
          "(required)",
          -1
          /* HOISTED */
        ))
      ],
      64
      /* STABLE_FRAGMENT */
    )) : createCommentVNode("v-if", true)
  ], 10, _hoisted_1);
}
_sfc_main$1.__file = "src/components/FormLabel.vue";
const FormLabel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/FormLabel.vue"]]);
const __default__ = {
  inheritAttrs: false
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "FormControl",
  props: {
    label: { type: String, required: false },
    description: { type: String, required: false },
    type: { type: String, required: false, default: "text" },
    size: { type: String, required: false, default: "sm" },
    variant: { type: String, required: false, default: "subtle" },
    required: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const id = useId();
    const props = __props;
    const attrs = useAttrs();
    const controlAttrs = computed(() => {
      let _attrs = {};
      for (let key in attrs) {
        if (key !== "class" && key !== "style") {
          _attrs[key] = attrs[key];
        }
      }
      return _attrs;
    });
    const descriptionClasses = computed(() => {
      return [
        {
          sm: "text-xs",
          md: "text-base"
        }[props.size],
        "text-ink-gray-5"
      ];
    });
    const __returned__ = { id, props, attrs, controlAttrs, descriptionClasses, get TextInput() {
      return TextInput;
    }, get Select() {
      return Select;
    }, get Textarea() {
      return Textarea;
    }, get Checkbox() {
      return Checkbox;
    }, get Autocomplete() {
      return Autocomplete;
    }, FormLabel };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.type != "checkbox" ? (openBlock(), createElementBlock(
    "div",
    {
      key: 0,
      class: normalizeClass(["space-y-1.5", $setup.attrs.class]),
      style: normalizeStyle($setup.attrs.style)
    },
    [
      $props.label ? (openBlock(), createBlock($setup["FormLabel"], {
        key: 0,
        label: $props.label,
        size: $props.size,
        id: $setup.id,
        required: $props.required
      }, null, 8, ["label", "size", "id", "required"])) : createCommentVNode("v-if", true),
      $props.type === "select" ? (openBlock(), createBlock($setup["Select"], mergeProps({
        key: 1,
        id: $setup.id
      }, { ...$setup.controlAttrs, size: $props.size, variant: $props.variant }), createSlots({
        _: 2
        /* DYNAMIC */
      }, [
        _ctx.$slots.prefix ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["id"])) : $props.type === "autocomplete" ? (openBlock(), createBlock(
        $setup["Autocomplete"],
        normalizeProps(mergeProps({ key: 2 }, { ...$setup.controlAttrs })),
        createSlots({
          _: 2
          /* DYNAMIC */
        }, [
          _ctx.$slots.prefix ? {
            name: "prefix",
            fn: withCtx(() => [
              renderSlot(_ctx.$slots, "prefix")
            ]),
            key: "0"
          } : void 0,
          _ctx.$slots["item-prefix"] ? {
            name: "item-prefix",
            fn: withCtx((itemPrefixProps) => [
              renderSlot(_ctx.$slots, "item-prefix", normalizeProps(guardReactiveProps(itemPrefixProps)))
            ]),
            key: "1"
          } : void 0
        ]),
        1040
        /* FULL_PROPS, DYNAMIC_SLOTS */
      )) : $props.type === "textarea" ? (openBlock(), createBlock($setup["Textarea"], mergeProps({
        key: 3,
        id: $setup.id
      }, { ...$setup.controlAttrs, size: $props.size, variant: $props.variant }), null, 16, ["id"])) : (openBlock(), createBlock($setup["TextInput"], mergeProps({
        key: 4,
        id: $setup.id
      }, { ...$setup.controlAttrs, type: $props.type, size: $props.size, variant: $props.variant, required: $props.required }), createSlots({
        _: 2
        /* DYNAMIC */
      }, [
        _ctx.$slots.prefix ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix")
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots.suffix ? {
          name: "suffix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "suffix")
          ]),
          key: "1"
        } : void 0
      ]), 1040, ["id"])),
      renderSlot(_ctx.$slots, "description", {}, () => [
        $props.description ? (openBlock(), createElementBlock(
          "p",
          {
            key: 0,
            class: normalizeClass($setup.descriptionClasses)
          },
          toDisplayString($props.description),
          3
          /* TEXT, CLASS */
        )) : createCommentVNode("v-if", true)
      ])
    ],
    6
    /* CLASS, STYLE */
  )) : (openBlock(), createBlock($setup["Checkbox"], mergeProps({
    key: 1,
    id: $setup.id
  }, { ...$setup.controlAttrs, label: $props.label, size: $props.size, class: $setup.attrs.class }), null, 16, ["id"]));
}
_sfc_main.__file = "src/components/FormControl/FormControl.vue";
const FormControl = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/FormControl/FormControl.vue"]]);
export {
  FormControl as F
};
