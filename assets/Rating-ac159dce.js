import { ay as defineComponent, az as ref, bs as watch, aB as openBlock, aG as createElementBlock, aN as toDisplayString, aH as createCommentVNode, aF as createBaseVNode, aK as Fragment, aJ as renderList, aE as createVNode, aW as normalizeClass } from "./vendor-6fc73789.js";
import { F as FeatherIcon } from "./FeatherIcon-512d35aa.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Rating",
  props: {
    modelValue: { type: Number, required: false, default: 0 },
    rating_from: { type: Number, required: false, default: 5 },
    label: { type: String, required: false },
    readonly: { type: Boolean, required: false, default: false },
    size: { type: String, required: false, default: "md" }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const rating = ref(props.modelValue);
    const hoveredRating = ref(0);
    const iconClasses = (index) => {
      let classes = [
        {
          sm: "size-4",
          md: "size-5",
          lg: "size-6",
          xl: "size-7"
        }[props.size]
      ];
      if (index <= hoveredRating.value && index > rating.value) {
        classes.push("fill-yellow-200");
      } else if (index <= rating.value) {
        classes.push("fill-yellow-500");
      }
      if (!props.readonly) {
        classes.push("cursor-pointer");
      }
      return classes.join(" ");
    };
    const emitChange = (value) => {
      emit("update:modelValue", value);
    };
    const markRating = (index) => {
      if (props.readonly)
        return;
      emitChange(index);
      rating.value = index;
    };
    watch(
      () => props.modelValue,
      (newVal) => {
        rating.value = newVal;
      }
    );
    const __returned__ = { props, emit, rating, hoveredRating, iconClasses, emitChange, markRating, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "space-y-1" };
const _hoisted_2 = {
  key: 0,
  class: "block text-xs text-ink-gray-5"
};
const _hoisted_3 = { class: "flex text-center" };
const _hoisted_4 = ["onMouseover"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.label ? (openBlock(), createElementBlock(
      "label",
      _hoisted_2,
      toDisplayString($props.label),
      1
      /* TEXT */
    )) : createCommentVNode("v-if", true),
    createBaseVNode("div", _hoisted_3, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.rating_from, (index) => {
          return openBlock(), createElementBlock("div", {
            key: index,
            onMouseover: () => !$props.readonly && ($setup.hoveredRating = index),
            onMouseleave: _cache[0] || (_cache[0] = () => !$props.readonly && ($setup.hoveredRating = 0))
          }, [
            createVNode($setup["FeatherIcon"], {
              name: "star",
              class: normalizeClass(["fill-gray-400 text-ink-gray-1 stroke-1 mr-1", $setup.iconClasses(index)]),
              onClick: ($event) => $setup.markRating(index)
            }, null, 8, ["class", "onClick"])
          ], 40, _hoisted_4);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}
_sfc_main.__file = "src/components/Rating/Rating.vue";
const Rating = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Rating/Rating.vue"]]);
export {
  Rating as R
};
