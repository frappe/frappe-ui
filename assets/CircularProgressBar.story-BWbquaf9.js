import { aC as defineComponent, bh as useCssVars, aF as computed, az as openBlock, aA as createElementBlock, aL as toDisplayString, aH as createBlock, aI as normalizeClass, aO as resolveComponent, aP as withCtx, aM as createVNode, aB as createBaseVNode } from "./vendor-XmnqeunI.js";
import { F as FeatherIcon } from "./FeatherIcon-DsVR9pXy.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CircularProgressBar",
  props: {
    step: { type: Number, required: true, default: 1 },
    totalSteps: { type: Number, required: true, default: 4 },
    showPercentage: { type: Boolean, required: false, default: false },
    variant: { type: String, required: false, default: "solid" },
    theme: { type: [String, Object], required: false, default: "black" },
    size: { type: String, required: false, default: "md" },
    themeComplete: { type: String, required: false, default: "lightgreen" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    useCssVars((_ctx) => ({
      "974a8d42-size.ringSize": size.value.ringSize,
      "974a8d42-size.ringBarWidth": size.value.ringBarWidth,
      "974a8d42-size.innerTextFontSize": size.value.innerTextFontSize,
      "974a8d42-size.checkIconSize": size.value.checkIconSize,
      "974a8d42-theme.primary": theme.value.primary,
      "974a8d42-theme.secondary": theme.value.secondary,
      "974a8d42-$props.themeComplete": _ctx.$props.themeComplete,
      "974a8d42-progress + '%'": progress.value + "%"
    }));
    const props = __props;
    const sizeMap = {
      xs: {
        ringSize: "30px",
        ringBarWidth: "6px",
        innerTextFontSize: props.showPercentage ? "8px" : "12px",
        checkIconSize: "16px"
      },
      sm: {
        ringSize: "42px",
        ringBarWidth: "10px",
        innerTextFontSize: props.showPercentage ? "12px" : "16px",
        checkIconSize: "20px"
      },
      md: {
        ringSize: "60px",
        ringBarWidth: "14px",
        innerTextFontSize: props.showPercentage ? "16px" : "20px",
        checkIconSize: "24px"
      },
      lg: {
        ringSize: "84px",
        ringBarWidth: "18px",
        innerTextFontSize: props.showPercentage ? "20px" : "24px",
        checkIconSize: "40px"
      },
      xl: {
        ringSize: "108px",
        ringBarWidth: "22px",
        innerTextFontSize: props.showPercentage ? "24px" : "28px",
        checkIconSize: "48px"
      }
    };
    const size = computed(() => sizeMap[props.size] || sizeMap["md"]);
    const themeMap = {
      black: {
        primary: "#333",
        secondary: "#888"
      },
      red: {
        primary: "#FF0000",
        secondary: "#FFD7D7"
      },
      green: {
        primary: "#22C55E",
        secondary: "#b1ffda"
      },
      blue: {
        primary: "#2376f5",
        secondary: "#D7D7FF"
      },
      orange: {
        primary: "#FFA500",
        secondary: "#FFE5CC"
      }
    };
    const theme = computed(() => {
      if (typeof props.theme === "string") {
        return themeMap[props.theme] || themeMap["black"];
      }
      return props.theme;
    });
    const progress = computed(() => props.step / props.totalSteps * 100);
    const isCompleted = computed(() => props.step === props.totalSteps);
    const __returned__ = { props, sizeMap, size, themeMap, theme, progress, isCompleted, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { key: 0 };
const _hoisted_2$1 = { key: 0 };
const _hoisted_3$1 = { key: 1 };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["progressbar", {
        completed: $setup.isCompleted,
        fillOuter: $props.variant === "outline"
      }]),
      role: "progressbar"
    },
    [
      !$setup.isCompleted ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
        !$props.showPercentage ? (openBlock(), createElementBlock(
          "p",
          _hoisted_2$1,
          toDisplayString($props.step),
          1
          /* TEXT */
        )) : (openBlock(), createElementBlock(
          "p",
          _hoisted_3$1,
          toDisplayString($setup.progress.toFixed(0)) + "%",
          1
          /* TEXT */
        ))
      ])) : (openBlock(), createBlock($setup["FeatherIcon"], {
        key: 1,
        name: "check",
        class: "check-icon"
      }))
    ],
    2
    /* CLASS */
  );
}
_sfc_main$1.__file = "src/components/CircularProgressBar/CircularProgressBar.vue";
const CircularProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-974a8d42"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/CircularProgressBar/CircularProgressBar.vue"]]);
const _sfc_main = {
  __name: "CircularProgressBar.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { CircularProgressBar };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1 = { class: "p-2 w-full h-full" };
const _hoisted_2 = { class: "p-2 w-full h-full" };
const _hoisted_3 = { class: "p-2 w-full h-full" };
const _hoisted_4 = { class: "p-2 w-full h-full" };
const _hoisted_5 = { class: "p-2 w-full h-full" };
const _hoisted_6 = { class: "p-2 w-full h-full" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500, heigt: 500 } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["CircularProgressBar"], {
              step: 1,
              totalSteps: 4
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Size" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["CircularProgressBar"], {
              step: 1,
              totalSteps: 4,
              size: "lg",
              showPercentage: true
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Theme" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["CircularProgressBar"], {
              step: 3,
              totalSteps: 4,
              theme: "orange"
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Theme" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_4, [
            createVNode($setup["CircularProgressBar"], {
              step: 2,
              totalSteps: 6,
              theme: {
                primary: "#2376f5",
                secondary: "#ddd5d5"
              }
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Solid Variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            createVNode($setup["CircularProgressBar"], {
              step: 9,
              totalSteps: 9,
              variant: "solid",
              themeComplete: "lightgreen"
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Outline Variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_6, [
            createVNode($setup["CircularProgressBar"], {
              step: 9,
              totalSteps: 9,
              variant: "outline",
              themeComplete: "lightgreen"
            })
          ])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/CircularProgressBar/CircularProgressBar.story.vue";
const CircularProgressBar_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/CircularProgressBar/CircularProgressBar.story.vue"]]);
export {
  CircularProgressBar_story as default
};
