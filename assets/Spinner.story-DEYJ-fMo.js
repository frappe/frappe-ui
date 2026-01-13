import { ay as _export_sfc, aD as openBlock, aL as createElementBlock, aI as createBaseVNode, az as defineComponent, aC as resolveComponent, aE as createBlock, aF as withCtx, aH as createVNode } from "./vendor-DDczFkrz.js";
const _sfc_main$1 = {};
const _hoisted_1 = {
  class: "spinner",
  viewBox: "0 0 50 50"
};
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "defs",
      null,
      [
        createBaseVNode("linearGradient", {
          id: "gradient",
          x1: "0%",
          y1: "0%",
          x2: "0%",
          y2: "100%"
        }, [
          createBaseVNode("stop", {
            offset: "0%",
            "stop-color": "rgba(0,110,219,1)"
          }),
          createBaseVNode("stop", {
            offset: "100%",
            "stop-color": "rgba(255,255,255,0)"
          })
        ])
      ],
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        stroke: "url(#gradient)",
        class: "spinner-path",
        cx: "25",
        cy: "25",
        r: "20",
        fill: "none",
        "stroke-width": "5"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$1.__file = "src/components/Spinner/Spinner.vue";
const Spinner = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-bc6d31ca"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Spinner/Spinner.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Spinner.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { Spinner };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "class='w-4'" }, {
        default: withCtx(() => [
          createVNode($setup["Spinner"], { class: "w-4" })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "class='w-8'" }, {
        default: withCtx(() => [
          createVNode($setup["Spinner"], { class: "w-8" })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Spinner/Spinner.story.vue";
const Spinner_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Spinner/Spinner.story.vue"]]);
export {
  Spinner_story as default
};
