import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BgKFYHTC.js";
import { I as ImageGroupUploadDialog } from "./ListRow-f3mJTZ33.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-AtJ9RBN0.js";
import "./Autocomplete-ClzIW3Lf.js";
import "./Popover-CuIgk1-q.js";
import "./Button-CdLNyleR.js";
import "./FeatherIcon-B8hnHiBJ.js";
import "./Avatar-BoqQ46NB.js";
import "./Badge-CjZXjZDA.js";
import "./Breadcrumbs-DOGPs3Q8.js";
import "./Dropdown-C0K9pd54.js";
import "./Combobox-CyoWE9kl.js";
import "./chevron-down-CfkRT-9c.js";
import "./DateRangePicker-BaEbMc6h.js";
import "./TextInput-B59L9RLH.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Dm0AqIaW.js";
import "./Calendar-BYp8mQsM.js";
import "./TabButtons-EfaWReRv.js";
import "./Dialog-DI5gRf10.js";
import "./FormControl-DybNRYlz.js";
import "./Select-DZiIPsAO.js";
import "./Textarea-RMHsEH5Q.js";
import "./ErrorMessage-BTqZvdJM.js";
import "./FileUploader-3q_1nCbu.js";
import "./Progress-DMKzwtVs.js";
import "./Rating-K6cRsjm7.js";
import "./Password-CN6JuTg8.js";
import "./Spinner-CIVF9a8B.js";
import "./Switch-UCOGhhDm.js";
import "./Tabs-DdTUM4Ts.js";
import "./CircularProgressBar-ByPp03fn.js";
import "./Tree-CfpJdP5e.js";
import "./Sidebar-9bBM9ohA.js";
import "./NumberChart-Dp9aIkTg.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InsertImage",
  props: {
    editor: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const fileInput = useTemplateRef("fileInput");
    const showModal = ref(false);
    const selectedFiles = ref([]);
    function openFileSelector() {
      var _a;
      (_a = fileInput.value) == null ? void 0 : _a.click();
    }
    function onImageSelect(e) {
      const target = e.target;
      const files = target.files;
      if (files && files.length > 0) {
        if (files.length === 1) {
          props.editor.chain().focus().uploadImage(files[0]).run();
        } else {
          selectedFiles.value = Array.from(files);
          showModal.value = true;
        }
      }
    }
    function handleCancel() {
      showModal.value = false;
      selectedFiles.value = [];
    }
    const __returned__ = { props, fileInput, showModal, selectedFiles, openFileSelector, onImageSelect, handleCancel, ImageGroupUploadDialog };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $setup.openFileSelector }))),
      createBaseVNode(
        "input",
        {
          ref: "fileInput",
          type: "file",
          class: "hidden",
          onChange: $setup.onImageSelect,
          accept: "image/*",
          multiple: ""
        },
        null,
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ),
      $setup.showModal ? (openBlock(), createBlock($setup["ImageGroupUploadDialog"], {
        key: 0,
        mode: "new",
        modelValue: $setup.showModal,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showModal = $event),
        files: $setup.selectedFiles,
        "onUpdate:files": _cache[1] || (_cache[1] = ($event) => $setup.selectedFiles = $event),
        editor: $props.editor,
        onClose: $setup.handleCancel
      }, null, 8, ["modelValue", "files", "editor"])) : createCommentVNode("v-if", true)
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main.__file = "src/components/TextEditor/InsertImage.vue";
const InsertImage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/InsertImage.vue"]]);
export {
  InsertImage as default
};
