import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CpPVfT5v.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DAG8MLn4.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-janqEKK-.js";
import "./Autocomplete-DTWG8YEU.js";
import "./Popover-CMvoRVuj.js";
import "./Button-Kw6GA5-U.js";
import "./FeatherIcon-a_9sBKon.js";
import "./Avatar-DxF72WFD.js";
import "./Badge-CshlvcFI.js";
import "./Breadcrumbs-BjDqW_hR.js";
import "./Dropdown-B14XZBQZ.js";
import "./Combobox-CImwF6cH.js";
import "./chevron-down-B1gVL85t.js";
import "./DateRangePicker-Ca2TjX2s.js";
import "./TextInput-DvQABhEV.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BN4nC-lL.js";
import "./Calendar-C_hmcdyb.js";
import "./TabButtons-C2G9qedd.js";
import "./Dialog-DEHy3qxN.js";
import "./FormControl-pYDnfWlZ.js";
import "./Select-C3T6z1E3.js";
import "./Textarea-idKzYmFg.js";
import "./ErrorMessage-DgTeH2t5.js";
import "./FileUploader-BVp0DfaX.js";
import "./Progress-B9b9wi5g.js";
import "./Rating-B5LZkPJO.js";
import "./Password-DmSXh9v6.js";
import "./Spinner-B3ZyDUjY.js";
import "./Switch-DmJhPmWt.js";
import "./Tabs-DFX9rtgo.js";
import "./CircularProgressBar-BJcIYkxI.js";
import "./Tree-cjJvpVSV.js";
import "./Sidebar-DaGcfOef.js";
import "./NumberChart-Dm3_rCl-.js";
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
