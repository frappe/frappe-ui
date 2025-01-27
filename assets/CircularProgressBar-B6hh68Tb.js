import { ay as defineComponent, b_ as useCssVars, br as computed, aB as openBlock, aG as createElementBlock, aN as toDisplayString, aC as createBlock, aQ as normalizeClass } from "./vendor-CX2PJFrf.js";
import { F as FeatherIcon } from "./FeatherIcon-tfdPs37f.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
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
      "41408d09-size.ringSize": size.value.ringSize,
      "41408d09-size.ringBarWidth": size.value.ringBarWidth,
      "41408d09-size.innerTextFontSize": size.value.innerTextFontSize,
      "41408d09-size.checkIconSize": size.value.checkIconSize,
      "41408d09-theme.primary": theme.value.primary,
      "41408d09-theme.secondary": theme.value.secondary,
      "41408d09-$props.themeComplete": _ctx.$props.themeComplete,
      "41408d09-progress + '%'": progress.value + "%"
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
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
      !$setup.isCompleted ? (openBlock(), createElementBlock("div", _hoisted_1, [
        !$props.showPercentage ? (openBlock(), createElementBlock(
          "p",
          _hoisted_2,
          toDisplayString($props.step),
          1
          /* TEXT */
        )) : (openBlock(), createElementBlock(
          "p",
          _hoisted_3,
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
_sfc_main.__file = "src/components/CircularProgressBar.vue";
const CircularProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-41408d09"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/CircularProgressBar.vue"]]);
export {
  CircularProgressBar as C
};
