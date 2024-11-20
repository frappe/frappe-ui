import { ay as defineComponent, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aM as createTextVNode, aN as toDisplayString } from "./vendor-60a37766.js";
import { F as FileUploader } from "./FileUploader-a9c528db.js";
import { B as Button } from "./Button-d9c1b2a6.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./FeatherIcon-b4f14d6f.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FileUploader.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const validateFileFunction = (fileObject) => {
    };
    const onSuccess = (file) => {
    };
    const __returned__ = { validateFileFunction, onSuccess, FileUploader, get Button() {
      return Button;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    layout: { width: 500, type: "grid" },
    autoPropsDisabled: ""
  }, {
    default: withCtx(() => [
      createVNode($setup["FileUploader"], {
        fileTypes: ["image/*"],
        validateFile: $setup.validateFileFunction,
        onSuccess: $setup.onSuccess
      }, {
        default: withCtx(({
          file,
          uploading,
          progress,
          uploaded,
          message,
          error,
          total,
          success,
          openFileSelector
        }) => [
          createVNode($setup["Button"], {
            onClick: openFileSelector,
            loading: uploading
          }, {
            default: withCtx(() => [
              createTextVNode(
                toDisplayString(uploading ? `Uploading ${progress}%` : "Upload Image"),
                1
                /* TEXT */
              )
            ]),
            _: 2
            /* DYNAMIC */
          }, 1032, ["onClick", "loading"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/FileUploader.story.vue";
const FileUploader_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/FileUploader.story.vue"]]);
export {
  FileUploader_story as default
};
