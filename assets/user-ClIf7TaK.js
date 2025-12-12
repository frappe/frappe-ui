import { ay as markRaw, az as openBlock, aA as createElementBlock, aB as createBaseVNode } from "./vendor-CJubmi1B.js";
const _hoisted_1 = {
  class: "lucide lucide-user",
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "12",
        cy: "7",
        r: "4"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const User = markRaw({ name: "lucide-user", render });
export {
  User as U
};
