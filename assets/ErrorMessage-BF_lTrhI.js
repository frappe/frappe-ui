import { ay as defineComponent, aU as computed, aB as openBlock, aG as createElementBlock, aH as createCommentVNode } from "./vendor-Q7QJtZHR.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ErrorMessage",
  props: {
    message: { type: [String, Error], required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const errorMessage = computed(() => {
      if (!props.message) return "";
      if (props.message instanceof Error) {
        return props.message.messages || props.message.message;
      }
      return props.message;
    });
    const __returned__ = { props, errorMessage };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.message ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "whitespace-pre-line text-sm text-ink-red-4",
    role: "alert",
    innerHTML: $setup.errorMessage
  }, null, 8, _hoisted_1)) : createCommentVNode("v-if", true);
}
_sfc_main.__file = "src/components/ErrorMessage.vue";
const ErrorMessage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ErrorMessage.vue"]]);
export {
  ErrorMessage as E
};
