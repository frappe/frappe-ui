import { ay as defineComponent, c1 as useAttrs, aQ as computed, aB as openBlock, aG as createElementBlock, aW as normalizeClass, aM as createTextVNode, aN as toDisplayString, aH as createCommentVNode, aC as createBlock, c2 as createSlots, aD as withCtx, aT as renderSlot, aL as mergeProps, aU as normalizeProps, aV as guardReactiveProps } from "./vendor-60a37766.js";
import { C as Checkbox, u as useId } from "./Checkbox-be3bb121.js";
import { T as TextInput } from "./TextInput-da35d42e.js";
import { S as Select } from "./Select-016a8ee9.js";
import { T as Textarea } from "./Textarea-6f760da7.js";
import { A as Autocomplete } from "./Autocomplete-f5d7861e.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
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
    const labelClasses = computed(() => {
      return [
        {
          sm: "text-xs",
          md: "text-base"
        }[props.size],
        "text-gray-600"
      ];
    });
    const descriptionClasses = computed(() => {
      return [
        {
          sm: "text-xs",
          md: "text-base"
        }[props.size],
        "text-gray-600"
      ];
    });
    const __returned__ = { id, props, attrs, controlAttrs, labelClasses, descriptionClasses, TextInput, Select, Textarea, Checkbox, Autocomplete };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["for"];
const _hoisted_2 = {
  key: 0,
  class: "text-red-500"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.type != "checkbox" ? (openBlock(), createElementBlock(
    "div",
    {
      key: 0,
      class: normalizeClass(["space-y-1.5", $setup.attrs.class])
    },
    [
      $props.label ? (openBlock(), createElementBlock("label", {
        key: 0,
        class: normalizeClass(["block", $setup.labelClasses]),
        for: $setup.id
      }, [
        createTextVNode(
          toDisplayString($props.label) + " ",
          1
          /* TEXT */
        ),
        $props.required ? (openBlock(), createElementBlock("span", _hoisted_2, "*")) : createCommentVNode("v-if", true)
      ], 10, _hoisted_1)) : createCommentVNode("v-if", true),
      $props.type === "select" ? (openBlock(), createBlock($setup["Select"], mergeProps({
        key: 1,
        id: $setup.id
      }, { ...$setup.controlAttrs, size: $props.size }), createSlots({
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
      }, { ...$setup.controlAttrs, size: $props.size }), null, 16, ["id"])) : (openBlock(), createBlock($setup["TextInput"], mergeProps({
        key: 4,
        id: $setup.id
      }, { ...$setup.controlAttrs, type: $props.type, size: $props.size }), createSlots({
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
    2
    /* CLASS */
  )) : (openBlock(), createBlock($setup["Checkbox"], mergeProps({
    key: 1,
    id: $setup.id
  }, { ...$setup.controlAttrs, label: $props.label, size: $props.size, class: $setup.attrs.class }), null, 16, ["id"]));
}
_sfc_main.__file = "src/components/FormControl.vue";
const FormControl = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/FormControl.vue"]]);
export {
  FormControl as F
};
