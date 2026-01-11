import { ay as _export_sfc, az as defineComponent, aP as renderSlot, be as normalizeProps, bf as guardReactiveProps } from "./vendor-DFWYVX6c.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InsertLink",
  props: {
    editor: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    function openLinkEditor() {
      props.editor.commands.openLinkEditor();
    }
    const __returned__ = { props, openLinkEditor };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $setup.openLinkEditor })));
}
_sfc_main.__file = "src/components/TextEditor/InsertLink.vue";
const InsertLink = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/InsertLink.vue"]]);
export {
  InsertLink as default
};
