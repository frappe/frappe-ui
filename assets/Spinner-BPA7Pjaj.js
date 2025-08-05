import { aB as openBlock, aG as createElementBlock, aF as createBaseVNode } from "./vendor-BkoGa0PW.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {};
const _hoisted_1 = {
  class: "spinner",
  viewBox: "0 0 50 50"
};
function _sfc_render(_ctx, _cache) {
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
_sfc_main.__file = "src/components/Spinner/Spinner.vue";
const Spinner = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bc6d31ca"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Spinner/Spinner.vue"]]);
export {
  Spinner as S
};
