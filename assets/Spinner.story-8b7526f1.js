import { ay as defineComponent, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode } from "./vendor-62c6993a.js";
import { S as Spinner } from "./Spinner-596ace59.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
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
_sfc_main.__file = "src/components/Spinner.story.vue";
const Spinner_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Spinner.story.vue"]]);
export {
  Spinner_story as default
};
