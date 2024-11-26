import { ay as defineComponent, aQ as computed, cf as Og, cg as kg, ch as Lg, ci as Mg, cj as Vg, ck as Fg, aT as renderSlot, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aN as toDisplayString, aW as normalizeClass, aH as createCommentVNode } from "./vendor-7864af31.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
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
      return Og;
    }, get TooltipRoot() {
      return kg;
    }, get TooltipPortal() {
      return Lg;
    }, get TooltipTrigger() {
      return Mg;
    }, get TooltipContent() {
      return Vg;
    }, get TooltipArrow() {
      return Fg;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "rounded bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-xl" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
              $setup.props.text || _ctx.$slots.body ? (openBlock(), createBlock($setup["TooltipContent"], {
                key: 0,
                side: $setup.props.placement,
                "side-offset": 4,
                class: "z-[100]"
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "body", {}, () => [
                    createBaseVNode("div", _hoisted_1, [
                      createBaseVNode(
                        "div",
                        null,
                        toDisplayString($setup.props.text),
                        1
                        /* TEXT */
                      )
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
_sfc_main.__file = "src/components/Tooltip/Tooltip.vue";
const Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tooltip/Tooltip.vue"]]);
export {
  Tooltip as T
};
