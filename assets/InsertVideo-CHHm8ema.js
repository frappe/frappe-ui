import { ay as defineComponent, aY as renderSlot, aS as normalizeProps, aT as guardReactiveProps } from "./vendor-n_Vmevn_.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InsertVideo",
  props: {
    editor: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    function selectAndUploadVideo() {
      props.editor.chain().focus().selectAndUploadVideo().run();
    }
    const __returned__ = { props, selectAndUploadVideo };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $setup.selectAndUploadVideo })));
}
_sfc_main.__file = "src/components/TextEditor/InsertVideo.vue";
const InsertVideo = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/InsertVideo.vue"]]);
export {
  InsertVideo as default
};
