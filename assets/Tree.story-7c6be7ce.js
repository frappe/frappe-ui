import { ay as defineComponent, aI as reactive, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode } from "./vendor-b3b01892.js";
import { T as Tree } from "./Tree-ab493201.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./FeatherIcon-e059ca64.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Tree.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      showIndentationGuides: true,
      rowHeight: "25px",
      indentWidth: "15px",
      node: {
        name: "guest",
        label: "Guest",
        children: [
          {
            name: "downloads",
            label: "Downloads",
            children: [
              {
                name: "download.zip",
                label: "download.zip",
                children: [
                  {
                    name: "image.png",
                    label: "image.png",
                    children: []
                  }
                ]
              }
            ]
          },
          {
            name: "documents",
            label: "Documents",
            children: [
              {
                name: "somefile.txt",
                label: "somefile.txt",
                children: []
              },
              {
                name: "somefile.pdf",
                label: "somefile.pdf",
                children: []
              }
            ]
          }
        ]
      }
    });
    const __returned__ = { state, Tree };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_HstText = resolveComponent("HstText");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.showIndentationGuides,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.showIndentationGuides = $event),
        title: "Show Indentation Guides"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.rowHeight,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.rowHeight = $event),
        title: "Row Height"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.indentWidth,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.indentWidth = $event),
        title: "Indent Width"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "default" }, {
        default: withCtx(() => [
          createVNode($setup["Tree"], {
            options: {
              showIndentationGuides: $setup.state.showIndentationGuides,
              rowHeight: $setup.state.rowHeight,
              indentWidth: $setup.state.indentWidth
            },
            nodeKey: "name",
            node: $setup.state.node
          }, null, 8, ["options", "node"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Tree/Tree.story.vue";
const Tree_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tree/Tree.story.vue"]]);
export {
  Tree_story as default
};
