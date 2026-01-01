import { ay as _export_sfc, az as defineComponent, aD as openBlock, aL as createElementBlock, aI as createBaseVNode, b2 as normalizeStyle, aO as computed, aP as renderSlot, aE as createBlock, aF as withCtx, aH as createVNode, aT as createTextVNode, aJ as toDisplayString, aQ as normalizeClass, aS as createCommentVNode, c4 as TooltipProvider_default, c5 as TooltipRoot_default, c6 as TooltipPortal_default, c7 as TooltipTrigger_default, c8 as TooltipContent_default, c9 as TooltipArrow_default, bB as useSlots, aY as useRouter, aA as ref, aW as mergeProps, aR as resolveDynamicComponent, aV as Fragment } from "./vendor-BhN5Rrss.js";
import { F as FeatherIcon } from "./FeatherIcon-BvT7dPuN.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "LoadingIndicator",
  props: { scale: { required: false, default: 100 } },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "svg",
    {
      class: "max-w-xs animate-spin",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      style: normalizeStyle(`scale: ${$props.scale}%;`),
      viewBox: "0 0 24 24"
    },
    _cache[0] || (_cache[0] = [
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
    ]),
    4
    /* STYLE */
  );
}
_sfc_main$2.__file = "src/components/LoadingIndicator.vue";
const LoadingIndicator = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/LoadingIndicator.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Tooltip",
  props: {
    text: { type: String, required: false, default: "" },
    hoverDelay: { type: Number, required: false, default: 0.5 },
    placement: { type: null, required: false, default: "top" },
    arrowClass: { type: null, required: false, default: "fill-surface-gray-7" },
    disabled: { type: Boolean, required: false, default: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delayDuration = computed(() => props.hoverDelay * 1e3);
    const __returned__ = { props, delayDuration, get TooltipProvider() {
      return TooltipProvider_default;
    }, get TooltipRoot() {
      return TooltipRoot_default;
    }, get TooltipPortal() {
      return TooltipPortal_default;
    }, get TooltipTrigger() {
      return TooltipTrigger_default;
    }, get TooltipContent() {
      return TooltipContent_default;
    }, get TooltipArrow() {
      return TooltipArrow_default;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "rounded bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-xl" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.disabled ? renderSlot(_ctx.$slots, "default", { key: 0 }) : (openBlock(), createBlock($setup["TooltipProvider"], {
    key: 1,
    delayDuration: $setup.delayDuration
  }, {
    default: withCtx(() => [
      createVNode($setup["TooltipRoot"], null, {
        default: withCtx(() => [
          createVNode($setup["TooltipTrigger"], { "as-child": "" }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
            /* FORWARDED */
          }),
          createVNode($setup["TooltipPortal"], null, {
            default: withCtx(() => [
              $setup.props.text || _ctx.$slots.body || _ctx.$slots.content ? (openBlock(), createBlock($setup["TooltipContent"], {
                key: 0,
                side: $setup.props.placement,
                "side-offset": 4,
                class: "z-[100]"
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "body", {}, () => [
                    createBaseVNode("div", _hoisted_1$1, [
                      renderSlot(_ctx.$slots, "content", {}, () => [
                        createTextVNode(
                          toDisplayString($setup.props.text),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ]),
                  createVNode($setup["TooltipArrow"], {
                    class: normalizeClass($setup.props.arrowClass),
                    width: 8,
                    height: 4
                  }, null, 8, ["class"])
                ]),
                _: 3
                /* FORWARDED */
              }, 8, ["side"])) : createCommentVNode("v-if", true)
            ]),
            _: 3
            /* FORWARDED */
          })
        ]),
        _: 3
        /* FORWARDED */
      })
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["delayDuration"]));
}
_sfc_main$1.__file = "src/components/Tooltip/Tooltip.vue";
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tooltip/Tooltip.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "Button",
  props: {
    theme: { type: String, required: false, default: "gray" },
    size: { type: String, required: false, default: "sm" },
    variant: { type: String, required: false, default: "subtle" },
    label: { type: String, required: false },
    icon: { type: null, required: false },
    iconLeft: { type: null, required: false },
    iconRight: { type: null, required: false },
    tooltip: { type: String, required: false },
    loading: { type: Boolean, required: false, default: false },
    loadingText: { type: String, required: false },
    disabled: { type: Boolean, required: false, default: false },
    route: { type: null, required: false },
    link: { type: String, required: false },
    type: { type: String, required: false, default: "button" }
  },
  setup(__props, { expose: __expose }) {
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
        "inline-flex items-center justify-center gap-2 transition-colors focus:outline-none shrink-0",
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
      return props.icon || slots.icon || hasLucideIconInDefaultSlot.value;
    });
    const hasLucideIconInDefaultSlot = computed(() => {
      var _a, _b, _c;
      if (!slots.default) return false;
      const slotContent = slots.default();
      if (!Array.isArray(slotContent)) return false;
      let firstVNode = slotContent[0];
      if (typeof ((_a = firstVNode.type) == null ? void 0 : _a.name) == "string" && ((_c = (_b = firstVNode.type) == null ? void 0 : _b.name) == null ? void 0 : _c.startsWith("lucide-"))) {
        return true;
      }
      return false;
    });
    const handleClick = () => {
      if (props.route) {
        return router.push(props.route);
      } else if (props.link) {
        return window.open(props.link, "_blank");
      }
    };
    const rootRef = ref();
    __expose({ rootRef });
    const __returned__ = { props, slots, router, buttonClasses, slotClasses, isDisabled, ariaLabel, isIconButton, hasLucideIconInDefaultSlot, handleClick, rootRef, FeatherIcon, LoadingIndicator, Tooltip: __unplugin_components_0 };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["disabled", "ariaLabel", "type"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return openBlock(), createBlock($setup["Tooltip"], {
    text: $props.tooltip,
    disabled: !((_a = $props.tooltip) == null ? void 0 : _a.length)
  }, {
    default: withCtx(() => [
      createBaseVNode("button", mergeProps(_ctx.$attrs, {
        class: $setup.buttonClasses,
        onClick: $setup.handleClick,
        disabled: $setup.isDisabled,
        ariaLabel: $setup.ariaLabel,
        type: $setup.props.type,
        ref: "rootRef"
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
            }, null, 8, ["class"])) : _ctx.$slots.icon ? renderSlot(_ctx.$slots, "icon", { key: 2 }) : $setup.hasLucideIconInDefaultSlot ? (openBlock(), createElementBlock(
              "div",
              {
                key: 3,
                class: normalizeClass($setup.slotClasses)
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
            )) : createCommentVNode("v-if", true)
          ],
          64
          /* STABLE_FRAGMENT */
        )) : (openBlock(), createElementBlock(
          "span",
          {
            key: 4,
            class: normalizeClass([{ "sr-only": $setup.isIconButton }, "truncate"])
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
      ], 16, _hoisted_1)
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["text", "disabled"]);
}
_sfc_main.__file = "src/components/Button/Button.vue";
const Button = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Button/Button.vue"]]);
export {
  Button as B,
  LoadingIndicator as L,
  __unplugin_components_0 as _
};
