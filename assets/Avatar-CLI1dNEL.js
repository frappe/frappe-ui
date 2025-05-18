import { ay as defineComponent, az as ref, aU as computed, aB as openBlock, aG as createElementBlock, aQ as normalizeClass, aX as renderSlot, aK as Fragment, aM as createTextVNode, aN as toDisplayString, aF as createBaseVNode, aH as createCommentVNode } from "./vendor-Q7QJtZHR.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Avatar",
  props: {
    image: { type: String, required: false },
    label: { type: String, required: false },
    size: { type: String, required: false, default: "md" },
    shape: { type: String, required: false, default: "circle" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const imgFetchError = ref(false);
    const props = __props;
    const shapeClasses = computed(() => {
      return {
        circle: "rounded-full",
        square: {
          xs: "rounded-[4px]",
          sm: "rounded-[5px]",
          md: "rounded-[5px]",
          lg: "rounded-[6px]",
          xl: "rounded-[6px]",
          "2xl": "rounded-[8px]",
          "3xl": "rounded-[10px]"
        }[props.size]
      }[props.shape];
    });
    const sizeClasses = computed(() => {
      return {
        xs: "w-4 h-4",
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-7 h-7",
        xl: "w-8 h-8",
        "2xl": "w-10 h-10",
        "3xl": "w-11.5 h-11.5"
      }[props.size];
    });
    const labelClasses = computed(() => {
      let sizeClass = {
        xs: "text-2xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-base",
        xl: "text-lg",
        "2xl": "text-xl",
        "3xl": "text-2xl"
      }[props.size];
      return ["font-medium", sizeClass];
    });
    const indicatorContainerClasses = computed(() => {
      return {
        xs: "-mr-[.1rem] -mb-[.1rem] h-2 w-2",
        sm: "-mr-[.1rem] -mb-[.1rem] h-[9px] w-[9px]",
        md: "-mr-[.1rem] -mb-[.1rem] h-2.5 w-2.5",
        lg: "-mr-[.1rem] -mb-[.1rem] h-3 w-3",
        xl: "-mr-[.1rem] -mb-[.1rem] h-3 w-3",
        "2xl": "-mr-[.1rem] -mb-[.1rem] h-3.5 w-3.5",
        "3xl": "-mr-[.2rem] -mb-[.2rem] h-4 w-4"
      }[props.size];
    });
    const indicatorClasses = computed(() => {
      return {
        xs: "h-1 w-1",
        sm: "h-[5px] w-[5px]",
        md: "h-1.5 w-1.5",
        lg: "h-2 w-2",
        xl: "h-2 w-2",
        "2xl": "h-2.5 w-2.5",
        "3xl": "h-3 w-3"
      }[props.size];
    });
    const iconClasses = computed(() => {
      return {
        xs: "h-2.5 w-2.5",
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-4 w-4",
        xl: "h-4 w-4",
        "2xl": "h-5 w-5",
        "3xl": "h-5 w-5"
      }[props.size];
    });
    function handleImageError(err) {
      if (err.type) {
        imgFetchError.value = true;
      }
    }
    const __returned__ = { imgFetchError, props, shapeClasses, sizeClasses, labelClasses, indicatorContainerClasses, indicatorClasses, iconClasses, handleImageError };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["src", "alt"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["relative inline-block shrink-0", [$setup.sizeClasses, $setup.shapeClasses]])
    },
    [
      $props.image && !$setup.imgFetchError ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: $props.image,
        alt: $props.label,
        class: normalizeClass([$setup.shapeClasses, "h-full w-full object-cover"]),
        onError: _cache[0] || (_cache[0] = (err) => $setup.handleImageError(err))
      }, null, 42, _hoisted_1)) : (openBlock(), createElementBlock(
        "div",
        {
          key: 1,
          class: normalizeClass(["flex h-full w-full items-center justify-center bg-surface-gray-2 uppercase text-ink-gray-5 select-none", [$setup.labelClasses, $setup.shapeClasses]])
        },
        [
          _ctx.$slots.default ? (openBlock(), createElementBlock(
            "div",
            {
              key: 0,
              class: normalizeClass($setup.iconClasses)
            },
            [
              renderSlot(_ctx.$slots, "default")
            ],
            2
            /* CLASS */
          )) : (openBlock(), createElementBlock(
            Fragment,
            { key: 1 },
            [
              createTextVNode(
                toDisplayString($props.label && $props.label[0]),
                1
                /* TEXT */
              )
            ],
            64
            /* STABLE_FRAGMENT */
          ))
        ],
        2
        /* CLASS */
      )),
      _ctx.$slots.indicator ? (openBlock(), createElementBlock(
        "div",
        {
          key: 2,
          class: normalizeClass([
            "absolute bottom-0 right-0 grid place-items-center rounded-full bg-surface-white",
            $setup.indicatorContainerClasses
          ])
        },
        [
          createBaseVNode(
            "div",
            {
              class: normalizeClass($setup.indicatorClasses)
            },
            [
              renderSlot(_ctx.$slots, "indicator")
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )) : createCommentVNode("v-if", true)
    ],
    2
    /* CLASS */
  );
}
_sfc_main.__file = "src/components/Avatar.vue";
const Avatar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Avatar.vue"]]);
export {
  Avatar as A
};
