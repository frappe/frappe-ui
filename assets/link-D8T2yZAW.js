import { aP as markRaw, aB as openBlock, aG as createElementBlock, aF as createBaseVNode } from "./vendor-n_Vmevn_.js";
const _hoisted_1 = {
  viewBox: "0 0 24 24",
  "data-lucide": "link",
  width: "1.2em",
  height: "1.2em"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "g",
      {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2"
      },
      [
        createBaseVNode("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
        createBaseVNode("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
      ],
      -1
      /* HOISTED */
    )
  ]));
}
const Link = markRaw({ name: "lucide-link", render });
export {
  Link as L
};
