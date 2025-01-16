import { ay as defineComponent, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aM as createTextVNode, aF as createBaseVNode } from "./vendor-Dq1kXbt2.js";
import { P as Popover } from "./Popover-CYufSJhn.js";
import { B as Button } from "./Button-DOkL83PB.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FeatherIcon-DzZkdWa-.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Popover.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { Popover, get Button() {
      return Button;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid" } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "trigger: click" }, {
        default: withCtx(() => [
          createVNode($setup["Popover"], null, {
            target: withCtx(({ togglePopover }) => [
              createVNode($setup["Button"], {
                onClick: ($event) => togglePopover()
              }, {
                default: withCtx(() => _cache[0] || (_cache[0] = [
                  createTextVNode("Click me")
                ])),
                _: 2
                /* DYNAMIC */
              }, 1032, ["onClick"])
            ]),
            "body-main": withCtx(() => _cache[1] || (_cache[1] = [
              createBaseVNode(
                "div",
                { class: "p-2 text-ink-gray-9" },
                "Popover content",
                -1
                /* HOISTED */
              )
            ])),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "trigger: hover" }, {
        default: withCtx(() => [
          createVNode($setup["Popover"], {
            trigger: "hover",
            hoverDelay: "0.5"
          }, {
            target: withCtx(() => [
              createVNode($setup["Button"], null, {
                default: withCtx(() => _cache[2] || (_cache[2] = [
                  createTextVNode("Hover me")
                ])),
                _: 1
                /* STABLE */
              })
            ]),
            "body-main": withCtx(() => _cache[3] || (_cache[3] = [
              createBaseVNode(
                "div",
                { class: "p-2 text-ink-gray-9" },
                "Popover content",
                -1
                /* HOISTED */
              )
            ])),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Popover.story.vue";
const Popover_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Popover.story.vue"]]);
export {
  Popover_story as default
};
