import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CU133Dqh.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BYh5Ulx8.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-B6q7ZAOb.js";
import "./Autocomplete-C_NKszCH.js";
import "./Popover-BEzuFl5P.js";
import "./Button-BIRlPcxA.js";
import "./FeatherIcon-CxbubfFC.js";
import "./Avatar-BQ3EHT18.js";
import "./Badge-D7H9CGDL.js";
import "./Breadcrumbs-DBavEXps.js";
import "./Dropdown-0DUAmWzS.js";
import "./Combobox-oqu6lBIN.js";
import "./chevron-down-tn4CGsm4.js";
import "./DateRangePicker-C_wySwJC.js";
import "./TextInput-XclTwZ9c.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Baa3Ni7U.js";
import "./Dialog-Rgr7kSND.js";
import "./ErrorMessage-D3LE8oqB.js";
import "./FileUploader-BMy-t3gP.js";
import "./FormControl-wuBD3Sj4.js";
import "./Select-CRz6QwQH.js";
import "./Textarea-D00HGtTb.js";
import "./Progress-2PKnaGPz.js";
import "./Rating-DU40TsJ4.js";
import "./Spinner-CHmgXFPi.js";
import "./Switch-Bro-CqE5.js";
import "./TabButtons-CbvN_19b.js";
import "./Tabs-Dt_d_qXP.js";
import "./Tooltip-DhsQ_Exd.js";
import "./Calendar-DXBt43h7.js";
import "./CircularProgressBar-CKElmaHX.js";
import "./Tree-WkgoNPrC.js";
import "./Sidebar-i39IuV_S.js";
import "./NumberChart-DYYqLAge.js";
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
