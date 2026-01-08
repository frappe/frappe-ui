import { ay as _export_sfc, az as defineComponent, aO as computed, aD as openBlock, aL as createElementBlock, aJ as toDisplayString, aV as Fragment, aS as createCommentVNode, aI as createBaseVNode, aP as renderSlot, b2 as normalizeStyle, aU as renderList, aQ as normalizeClass, aB as reactive, aC as resolveComponent, aE as createBlock, aF as withCtx, aH as createVNode, aW as mergeProps } from "./vendor-BPVYRHQ8.js";
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main$1.__file = "src/components/Progress/Progress.vue";
const Progress = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Progress/Progress.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Progress.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      value: 50
    });
    const sizes = ["sm", "md", "lg", "xl"];
    const __returned__ = { state, sizes, Progress };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSlider = resolveComponent("HstSlider");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSlider, {
        modelValue: $setup.state.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.value = $event),
        min: 0,
        max: 100,
        title: "Value"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Label" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Progress"],
            mergeProps($setup.state, { label: "Progress" }),
            null,
            16
            /* FULL_PROPS */
          )
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Hint" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Progress"],
            mergeProps($setup.state, {
              label: "Progress",
              hint: true
            }),
            null,
            16
            /* FULL_PROPS */
          )
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Intervals" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Progress"],
            mergeProps($setup.state, {
              label: "Progress",
              intervals: true,
              "interval-count": 5
            }),
            null,
            16
            /* FULL_PROPS */
          )
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Progress/Progress.story.vue";
const Progress_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Progress/Progress.story.vue"]]);
export {
  Progress_story as default
};
