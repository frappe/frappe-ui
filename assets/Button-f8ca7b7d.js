import { aB as openBlock, aG as createElementBlock, aF as createBaseVNode, ay as defineComponent, bp as useSlots, bq as useRouter, br as computed, aC as createBlock, aQ as normalizeClass, bk as renderSlot, a$ as resolveDynamicComponent, aH as createCommentVNode, aK as Fragment, aM as createTextVNode, aN as toDisplayString, aL as mergeProps } from "./vendor-3b8d0bfc.js";
import { F as FeatherIcon } from "./FeatherIcon-dfb91a0c.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main$1 = {};
const _hoisted_1$1 = {
  class: "max-w-xs animate-spin",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
};
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "circle",
      {
        class: "opacity-25",
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        "stroke-width": "4"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        class: "opacity-75",
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$1.__file = "src/components/LoadingIndicator.vue";
const LoadingIndicator = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/LoadingIndicator.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Button",
  props: {
    theme: { type: String, required: false, default: "gray" },
    size: { type: String, required: false, default: "sm" },
    variant: { type: String, required: false, default: "subtle" },
    label: { type: String, required: false },
    icon: { type: null, required: false },
    iconLeft: { type: null, required: false },
    iconRight: { type: null, required: false },
    loading: { type: Boolean, required: false, default: false },
    loadingText: { type: String, required: false },
    disabled: { type: Boolean, required: false, default: false },
    route: { type: null, required: false },
    link: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const slots = useSlots();
    const router = useRouter();
    const buttonClasses = computed(() => {
      let solidClasses = {
        gray: "text-ink-white bg-surface-gray-7 hover:bg-surface-gray-6 active:bg-surface-gray-5",
        blue: "text-ink-white bg-blue-500 hover:bg-surface-blue-3 active:bg-blue-700",
        green: "text-ink-white bg-surface-green-3 hover:bg-green-700 active:bg-green-800",
        red: "text-ink-white bg-surface-red-5 hover:bg-surface-red-6 active:bg-surface-red-7"
      }[props.theme];
      let subtleClasses = {
        gray: "text-ink-gray-8 bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4",
        blue: "text-ink-blue-3 bg-surface-blue-2 hover:bg-blue-200 active:bg-blue-300",
        green: "text-green-800 bg-surface-green-2 hover:bg-green-200 active:bg-green-300",
        red: "text-red-700 bg-surface-red-2 hover:bg-surface-red-3 active:bg-surface-red-4"
      }[props.theme];
      let outlineClasses = {
        gray: "text-ink-gray-8 bg-surface-white bg-surface-white border border-outline-gray-2 hover:border-outline-gray-3 active:border-outline-gray-3 active:bg-surface-gray-4",
        blue: "text-ink-blue-3 bg-surface-white border border-outline-blue-1 hover:border-blue-400 active:border-blue-400 active:bg-blue-300",
        green: "text-green-800 bg-surface-white border border-outline-green-2 hover:border-green-500 active:border-green-500 active:bg-green-300",
        red: "text-red-700 bg-surface-white border border-outline-red-1 hover:border-outline-red-2 active:border-outline-red-2 active:bg-surface-red-3"
      }[props.theme];
      let ghostClasses = {
        gray: "text-ink-gray-8 bg-transparent hover:bg-surface-gray-3 active:bg-surface-gray-4",
        blue: "text-ink-blue-3 bg-transparent hover:bg-blue-200 active:bg-blue-300",
        green: "text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300",
        red: "text-red-700 bg-transparent hover:bg-surface-red-3 active:bg-surface-red-4"
      }[props.theme];
      let focusClasses = {
        gray: "focus-visible:ring focus-visible:ring-outline-gray-3",
        blue: "focus-visible:ring focus-visible:ring-blue-400",
        green: "focus-visible:ring focus-visible:ring-outline-green-2",
        red: "focus-visible:ring focus-visible:ring-outline-red-2"
      }[props.theme];
      let variantClasses = {
        subtle: subtleClasses,
        solid: solidClasses,
        outline: outlineClasses,
        ghost: ghostClasses
      }[props.variant];
      let themeVariant = `${props.theme}-${props.variant}`;
      let disabledClassesMap = {
        "gray-solid": "bg-surface-gray-2 text-ink-gray-4",
        "gray-subtle": "bg-surface-gray-2 text-ink-gray-4",
        "gray-outline": "bg-surface-gray-2 text-ink-gray-4 border border-outline-gray-2",
        "gray-ghost": "text-ink-gray-4",
        "blue-solid": "bg-blue-300 text-ink-white",
        "blue-subtle": "bg-surface-blue-2 text-ink-blue-link",
        "blue-outline": "bg-surface-blue-2 text-ink-blue-link border border-outline-blue-1",
        "blue-ghost": "text-ink-blue-link",
        "green-solid": "bg-surface-green-2 text-ink-green-2",
        "green-subtle": "bg-surface-green-2 text-ink-green-2",
        "green-outline": "bg-surface-green-2 text-ink-green-2 border border-outline-green-2",
        "green-ghost": "text-ink-green-2",
        "red-solid": "bg-surface-red-2 text-ink-red-2",
        "red-subtle": "bg-surface-red-2 text-ink-red-2",
        "red-outline": "bg-surface-red-2 text-ink-red-2 border border-outline-red-1",
        "red-ghost": "text-ink-red-2"
      };
      let disabledClasses = disabledClassesMap[themeVariant];
      let sizeClasses = {
        sm: "h-7 text-base px-2 rounded",
        md: "h-8 text-base font-medium px-2.5 rounded",
        lg: "h-10 text-lg font-medium px-3 rounded-md",
        xl: "h-11.5 text-xl font-medium px-3.5 rounded-lg",
        "2xl": "h-13 text-2xl font-medium px-3.5 rounded-xl"
      }[props.size];
      if (isIconButton.value) {
        sizeClasses = {
          sm: "h-7 w-7 rounded",
          md: "h-8 w-8 rounded",
          lg: "h-10 w-10 rounded-md",
          xl: "h-11.5 w-11.5 rounded-lg",
          "2xl": "h-13 w-13 rounded-xl"
        }[props.size];
      }
      return [
        "inline-flex items-center justify-center gap-2 transition-colors focus:outline-none",
        isDisabled.value ? disabledClasses : variantClasses,
        focusClasses,
        sizeClasses
      ];
    });
    const slotClasses = computed(() => {
      let classes = {
        sm: "h-4",
        md: "h-4.5",
        lg: "h-5",
        xl: "h-6",
        "2xl": "h-6"
      }[props.size];
      return classes;
    });
    const isDisabled = computed(() => {
      return props.disabled || props.loading;
    });
    const ariaLabel = computed(() => {
      return isIconButton.value ? props.label : null;
    });
    const isIconButton = computed(() => {
      return props.icon || slots.icon;
    });
    const handleClick = () => {
      if (props.route) {
        return router.push(props.route);
      } else if (props.link) {
        return window.open(props.link, "_blank");
      }
    };
    const __returned__ = { props, slots, router, buttonClasses, slotClasses, isDisabled, ariaLabel, isIconButton, handleClick, FeatherIcon, LoadingIndicator };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["disabled", "ariaLabel"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", mergeProps(_ctx.$attrs, {
    class: $setup.buttonClasses,
    onClick: $setup.handleClick,
    disabled: $setup.isDisabled,
    ariaLabel: $setup.ariaLabel
  }), [
    $props.loading ? (openBlock(), createBlock($setup["LoadingIndicator"], {
      key: 0,
      class: normalizeClass({
        "h-3 w-3": $props.size == "sm",
        "h-[13.5px] w-[13.5px]": $props.size == "md",
        "h-[15px] w-[15px]": $props.size == "lg",
        "h-4.5 w-4.5": $props.size == "xl" || $props.size == "2xl"
      })
    }, null, 8, ["class"])) : _ctx.$slots["prefix"] || $props.iconLeft ? renderSlot(_ctx.$slots, "prefix", { key: 1 }, () => [
      $props.iconLeft && typeof $props.iconLeft === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
        key: 0,
        name: $props.iconLeft,
        class: normalizeClass($setup.slotClasses),
        "aria-hidden": "true"
      }, null, 8, ["name", "class"])) : $props.iconLeft ? (openBlock(), createBlock(resolveDynamicComponent($props.iconLeft), {
        key: 1,
        class: normalizeClass($setup.slotClasses)
      }, null, 8, ["class"])) : createCommentVNode("v-if", true)
    ]) : createCommentVNode("v-if", true),
    $props.loading && $props.loadingText ? (openBlock(), createElementBlock(
      Fragment,
      { key: 2 },
      [
        createTextVNode(
          toDisplayString($props.loadingText),
          1
          /* TEXT */
        )
      ],
      64
      /* STABLE_FRAGMENT */
    )) : $setup.isIconButton && !$props.loading ? (openBlock(), createElementBlock(
      Fragment,
      { key: 3 },
      [
        $props.icon && typeof $props.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
          key: 0,
          name: $props.icon,
          class: normalizeClass($setup.slotClasses),
          "aria-label": $props.label
        }, null, 8, ["name", "class", "aria-label"])) : $props.icon ? (openBlock(), createBlock(resolveDynamicComponent($props.icon), {
          key: 1,
          class: normalizeClass($setup.slotClasses)
        }, null, 8, ["class"])) : _ctx.$slots.icon ? renderSlot(_ctx.$slots, "icon", { key: 2 }) : createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    )) : (openBlock(), createElementBlock(
      "span",
      {
        key: 4,
        class: normalizeClass({ "sr-only": $setup.isIconButton })
      },
      [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(
            toDisplayString($props.label),
            1
            /* TEXT */
          )
        ])
      ],
      2
      /* CLASS */
    )),
    renderSlot(_ctx.$slots, "suffix", {}, () => [
      $props.iconRight && typeof $props.iconRight === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
        key: 0,
        name: $props.iconRight,
        class: normalizeClass($setup.slotClasses),
        "aria-hidden": "true"
      }, null, 8, ["name", "class"])) : $props.iconRight ? (openBlock(), createBlock(resolveDynamicComponent($props.iconRight), {
        key: 1,
        class: normalizeClass($setup.slotClasses)
      }, null, 8, ["class"])) : createCommentVNode("v-if", true)
    ])
  ], 16, _hoisted_1);
}
_sfc_main.__file = "src/components/Button/Button.vue";
const Button = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Button/Button.vue"]]);
export {
  Button as B,
  LoadingIndicator as L
};