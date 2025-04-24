import { ay as defineComponent, bA as computed, aB as openBlock, aG as createElementBlock, aN as toDisplayString, aK as Fragment, aH as createCommentVNode, aF as createBaseVNode, bu as renderSlot, be as normalizeStyle, aJ as renderList, aQ as normalizeClass } from "./vendor-CR9WeEaB.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Progress",
  props: {
    value: { type: Number, required: true },
    size: { type: String, required: false, default: "sm" },
    label: { type: String, required: false, default: "" },
    hint: { type: Boolean, required: false, default: false },
    intervals: { type: Boolean, required: false, default: false },
    intervalCount: { type: Number, required: false, default: 6 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const indicatorContainerClasses = computed(() => {
      const heightClass = {
        sm: "h-[2px]",
        md: "h-1",
        lg: "h-2",
        xl: "h-3"
      }[props.size];
      const layoutClasses = props.intervals ? "flex space-x-1" : "relative bg-surface-gray-2";
      return [heightClass, layoutClasses];
    });
    const filledIntervalCount = computed(() => {
      if (props.value > MAX_VALUE) {
        return props.intervalCount;
      }
      return Math.round(props.value / MAX_VALUE * props.intervalCount);
    });
    const __returned__ = { MIN_VALUE, MAX_VALUE, props, indicatorContainerClasses, filledIntervalCount };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "w-full space-y-[10px]" };
const _hoisted_2 = {
  key: 0,
  class: "flex items-baseline justify-between"
};
const _hoisted_3 = {
  key: 0,
  class: "text-base font-medium text-ink-gray-8"
};
const _hoisted_4 = {
  key: 2,
  class: "self-end"
};
const _hoisted_5 = { class: "text-base font-medium text-ink-gray-4" };
const _hoisted_6 = ["aria-valuenow"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $setup.props.label || $setup.props.hint ? (openBlock(), createElementBlock("div", _hoisted_2, [
      $setup.props.label ? (openBlock(), createElementBlock(
        "span",
        _hoisted_3,
        toDisplayString($setup.props.label),
        1
        /* TEXT */
      )) : (openBlock(), createElementBlock(
        Fragment,
        { key: 1 },
        [
          createCommentVNode(" Empty for alignment "),
          _cache[0] || (_cache[0] = createBaseVNode(
            "span",
            null,
            null,
            -1
            /* HOISTED */
          ))
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      $setup.props.hint || _ctx.$slots.hint ? (openBlock(), createElementBlock("span", _hoisted_4, [
        renderSlot(_ctx.$slots, "hint", {}, () => [
          createBaseVNode(
            "span",
            _hoisted_5,
            toDisplayString($setup.props.value) + "% ",
            1
            /* TEXT */
          )
        ])
      ])) : createCommentVNode("v-if", true)
    ])) : createCommentVNode("v-if", true),
    createBaseVNode("div", {
      class: normalizeClass(["overflow-hidden rounded-xl", $setup.indicatorContainerClasses]),
      "aria-valuemax": $setup.MAX_VALUE,
      "aria-valuemin": $setup.MIN_VALUE,
      "aria-valuenow": $setup.props.value,
      role: "progressbar"
    }, [
      createCommentVNode(" Continuous Progress Bar "),
      !$setup.props.intervals ? (openBlock(), createElementBlock(
        "div",
        {
          key: 0,
          class: "h-full bg-surface-gray-7",
          style: normalizeStyle(`width: ${$setup.props.value}%`)
        },
        null,
        4
        /* STYLE */
      )) : (openBlock(), createElementBlock(
        Fragment,
        { key: 1 },
        [
          createCommentVNode(" Interval Progress Bar "),
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($props.intervalCount, (index) => {
              return openBlock(), createElementBlock(
                "div",
                {
                  class: normalizeClass([
                    "h-full w-full",
                    index <= $setup.filledIntervalCount ? "bg-surface-gray-7" : "bg-surface-gray-2"
                  ])
                },
                null,
                2
                /* CLASS */
              );
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      ))
    ], 10, _hoisted_6)
  ]);
}
_sfc_main.__file = "src/components/Progress.vue";
const Progress = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Progress.vue"]]);
export {
  Progress as P
};
