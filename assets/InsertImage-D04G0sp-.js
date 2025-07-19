import { ay as defineComponent, bd as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aY as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-n_Vmevn_.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CQTJw2KH.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-R_zBP9Pw.js";
import "./Autocomplete-pfiSrdWq.js";
import "./Popover-CYOaI6ua.js";
import "./Button-C5TdRJAF.js";
import "./FeatherIcon-DuGjnzqZ.js";
import "./Avatar-ByZVMAJi.js";
import "./Badge-DqH7DlhB.js";
import "./Breadcrumbs-DPJ7tFfr.js";
import "./Dropdown-CtEiiokX.js";
import "./Combobox-DbWzGCrC.js";
import "./chevron-down-Dq797dxm.js";
import "./DateRangePicker-SLzMPR70.js";
import "./TextInput-_gzOshie.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-C2rTpYVv.js";
import "./Dialog-BFBBXrpI.js";
import "./ErrorMessage-zXGMu_uH.js";
import "./FileUploader-tyQf77Xi.js";
import "./FormControl-eXsQvW79.js";
import "./Select-CbnLm6ih.js";
import "./Textarea-BQLIwf4J.js";
import "./Progress-CrfDzsGS.js";
import "./Rating-DHQSdRET.js";
import "./Spinner-uxwxKN3_.js";
import "./Switch-DAEJ39nq.js";
import "./TabButtons-5sVdWIhJ.js";
import "./Tabs-C8N7nCIi.js";
import "./Tooltip-CWJ_rsJd.js";
import "./Calendar-BV2hIwYp.js";
import "./CircularProgressBar-uDR_kC4R.js";
import "./Tree-Dmn2T3Nf.js";
import "./Sidebar-C73JgYPS.js";
import "./NumberChart-PpDwqwFq.js";
import "./plus-DUsVQE2s.js";
import "./link-D8T2yZAW.js";
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
