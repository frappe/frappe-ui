import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-uK6N0wnM.js";
import { I as ImageGroupUploadDialog } from "./ListRow-kYGg3wFI.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DkuXCNpC.js";
import "./Autocomplete-CH0VW8RT.js";
import "./Popover-CRpLiRTS.js";
import "./Button-CcM5oPQc.js";
import "./FeatherIcon-UgcFzfKq.js";
import "./Avatar-DsxS5l7D.js";
import "./Badge-AT0_Qldw.js";
import "./Breadcrumbs-XY_AC2sD.js";
import "./Dropdown-DT9V14R2.js";
import "./Combobox-GMRR65Jd.js";
import "./chevron-down-t3pi3egE.js";
import "./DateRangePicker-COexXzL9.js";
import "./TextInput-Dv9YWu2L.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-uTxKJWlJ.js";
import "./Dialog-Coj4dfX7.js";
import "./ErrorMessage-CaOhmErD.js";
import "./FileUploader-DYfy993H.js";
import "./FormControl-DiQESIIF.js";
import "./Select-DMfKlNTA.js";
import "./Textarea-t20zU5s9.js";
import "./Progress-CYXjqNn3.js";
import "./Rating-BHF4kC-l.js";
import "./Password-Cm6kG0pO.js";
import "./Tooltip-yTBBrj6d.js";
import "./Spinner-Bn_6M8UI.js";
import "./Switch-B0aUIbV0.js";
import "./TabButtons-D_LVt3dF.js";
import "./Tabs-D9hu8RQf.js";
import "./Calendar-DbYmAHrL.js";
import "./CircularProgressBar-Bva_x4I4.js";
import "./Tree-DWo8TxFu.js";
import "./Sidebar-DfAJAqsK.js";
import "./NumberChart-BFl2Icbh.js";
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
