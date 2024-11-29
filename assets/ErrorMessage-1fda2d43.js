import { aB as openBlock, aG as createElementBlock, aH as createCommentVNode } from "./vendor-62757db6.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = {
  name: "ErrorMessage",
  props: ["message"],
  computed: {
    errorMessage() {
      if (!this.message)
        return "";
      if (this.message instanceof Error) {
        return this.message.messages || this.message.message;
      }
      return this.message;
    }
  }
};
const _hoisted_1 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.message ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "whitespace-pre-line text-sm text-ink-red-4",
    role: "alert",
    innerHTML: $options.errorMessage
  }, null, 8, _hoisted_1)) : createCommentVNode("v-if", true);
}
_sfc_main.__file = "src/components/ErrorMessage.vue";
const ErrorMessage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ErrorMessage.vue"]]);
export {
  ErrorMessage as E
};
