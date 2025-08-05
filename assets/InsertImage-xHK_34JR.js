import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-2tqXdiRY.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D7w3AJhs.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BCU51fq4.js";
import "./Autocomplete-BWhxEHUq.js";
import "./Popover-D6S5dxQ6.js";
import "./Button-CPxxJvDS.js";
import "./FeatherIcon-Dge0R5nM.js";
import "./Avatar-BtPNL3cw.js";
import "./Badge-zJ1p4Ysf.js";
import "./Breadcrumbs-DOklWTLN.js";
import "./Dropdown-iDIe9EhU.js";
import "./Combobox-DOQZUW6q.js";
import "./chevron-down-DvnFDKVh.js";
import "./DateRangePicker-Bqv-WA_w.js";
import "./TextInput-Dylyx4Nq.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BqsOQvX0.js";
import "./Calendar-De78tYzD.js";
import "./TabButtons-17onXvkf.js";
import "./Dialog-DivjaYzY.js";
import "./FormControl-X4PuX_0M.js";
import "./Select-C-r4cxse.js";
import "./Textarea-nLsmt4Qx.js";
import "./ErrorMessage-MzBsIpuG.js";
import "./FileUploader-CmLNnT-C.js";
import "./Progress-C3g3boIv.js";
import "./Rating-BYabHtWC.js";
import "./Password-CWg9qutk.js";
import "./Spinner-DIuAq7We.js";
import "./Switch-BNAwFg96.js";
import "./Tabs-CvARQFXY.js";
import "./CircularProgressBar-CuIbDhLZ.js";
import "./Tree-C5ESE94N.js";
import "./Sidebar-DZ2Ii5hr.js";
import "./NumberChart-CRjqUL8P.js";
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
