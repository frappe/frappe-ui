import { ay as _export_sfc, az as defineComponent, aM as mergeModels, aN as useModel, b5 as watch, aO as computed, aD as openBlock, aL as createElementBlock, aI as createBaseVNode, aE as createBlock, aQ as normalizeClass, aR as resolveDynamicComponent, aS as createCommentVNode, aJ as toDisplayString, aH as createVNode, aF as withCtx, bm as withKeys, b0 as withModifiers, cf as SwitchRoot_default, cg as SwitchThumb_default } from "./vendor-Dk9TTFVx.js";
import { u as useId } from "./useId-DJabvbK8.js";
import { F as FeatherIcon } from "./FeatherIcon-CrfXch0X.js";
const iconClasses = "mr-2 h-4 w-4 flex-shrink-0 text-ink-gray-6";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Switch",
  props: /* @__PURE__ */ mergeModels({
    size: { type: String, required: false, default: "sm" },
    label: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    disabled: { type: Boolean, required: false, default: false },
    icon: { type: null, required: false },
    labelClasses: { type: String, required: false, default: "" }
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["change"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const model = useModel(__props, "modelValue");
    const emit = __emit;
    watch(model, (val) => {
      emit("change", val);
    });
    const id = useId();
    const switchClasses = computed(() => {
      return [
        "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-100 ease-in-out items-center",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3",
        "disabled:cursor-not-allowed disabled:bg-surface-gray-3",
        model.value ? "bg-surface-gray-7 enabled:hover:bg-surface-gray-6 active:bg-surface-gray-5 group-hover:enabled:bg-surface-gray-6" : "bg-surface-gray-4 enabled:hover:bg-gray-400 active:bg-gray-500 group-hover:enabled:bg-gray-400",
        props.size === "md" ? "h-5 w-8 border-[3px]" : "h-4 w-[26px] border-2"
      ];
    });
    const switchCircleClasses = computed(() => {
      return [
        "pointer-events-none inline-block transform rounded-full bg-surface-white shadow ring-0 transition duration-100 ease-in-out",
        props.size === "md" ? "h-3.5 w-3.5" : "h-3 w-3",
        props.size === "md" ? model.value ? "translate-x-3 rtl:-translate-x-3" : "translate-x-0" : model.value ? "translate-x-2.5 rtl:-translate-x-2.5" : "translate-x-0"
      ];
    });
    const switchLabelClasses = computed(() => {
      return [
        "font-medium leading-normal",
        props.disabled && !props.description ? "text-ink-gray-4" : "text-ink-gray-8",
        props.size === "md" ? "text-lg" : "text-base",
        props.labelClasses
      ];
    });
    const switchGroupClasses = computed(() => {
      if (!props.label) return;
      const classes = ["flex justify-between"];
      if (!props.description) {
        classes.push(
          "group items-center space-x-3 cursor-pointer rounded focus-visible:bg-surface-gray-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3"
        );
        classes.push(
          props.disabled ? "cursor-not-allowed" : "hover:bg-surface-gray-3 active:bg-surface-gray-4"
        );
        classes.push(props.size === "md" ? "px-3 py-1.5" : "px-2.5 py-1.5");
      } else {
        classes.push("items-start");
        classes.push(
          props.size === "md" ? "px-3 space-x-3.5" : "px-2.5 space-x-2.5"
        );
      }
      return classes;
    });
    const __returned__ = { props, model, emit, id, switchClasses, switchCircleClasses, iconClasses, switchLabelClasses, switchGroupClasses, FeatherIcon, get SwitchRoot() {
      return SwitchRoot_default;
    }, get SwitchThumb() {
      return SwitchThumb_default;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex flex-col gap-1" };
const _hoisted_2 = { class: "flex items-center" };
const _hoisted_3 = ["for"];
const _hoisted_4 = {
  key: 0,
  class: "max-w-xs text-p-sm text-ink-gray-7"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass($setup.switchGroupClasses)
    },
    [
      createBaseVNode("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          $setup.props.icon && typeof $setup.props.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
            key: 0,
            name: $setup.props.icon,
            class: normalizeClass($setup.iconClasses),
            "aria-hidden": "true"
          }, null, 8, ["name"])) : $setup.props.icon ? (openBlock(), createBlock(resolveDynamicComponent($setup.props.icon), {
            key: 1,
            class: normalizeClass($setup.iconClasses)
          })) : createCommentVNode("v-if", true),
          createBaseVNode("label", {
            class: normalizeClass($setup.switchLabelClasses),
            for: $setup.id
          }, toDisplayString($setup.props.label), 11, _hoisted_3)
        ]),
        $setup.props.description ? (openBlock(), createElementBlock(
          "span",
          _hoisted_4,
          toDisplayString($setup.props.description),
          1
          /* TEXT */
        )) : createCommentVNode("v-if", true)
      ]),
      createVNode($setup["SwitchRoot"], {
        id: $setup.id,
        modelValue: $setup.model,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.model = $event),
        onKeyup: _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => $setup.model = !$setup.model, ["self"]), ["space"])),
        class: normalizeClass($setup.switchClasses),
        disabled: $setup.props.disabled
      }, {
        default: withCtx(() => [
          createVNode($setup["SwitchThumb"], {
            class: normalizeClass($setup.switchCircleClasses)
          }, null, 8, ["class"])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["id", "modelValue", "class", "disabled"])
    ],
    2
    /* CLASS */
  );
}
_sfc_main.__file = "src/components/Switch/Switch.vue";
const Switch = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Switch/Switch.vue"]]);
export {
  Switch as S
};
