import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Dk0c65vB.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DBFupTW-.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Dlnwj1Dc.js";
import "./Autocomplete-3pb3DAv6.js";
import "./Popover-BMBT1KJZ.js";
import "./Button-CLC7qZNJ.js";
import "./FeatherIcon-DBjVIOGs.js";
import "./Avatar-BLq1b0hD.js";
import "./Badge-Prgokwfk.js";
import "./Breadcrumbs-CDbpOEhF.js";
import "./Dropdown-BPPjmtMW.js";
import "./Combobox-265Uv9d4.js";
import "./chevron-down-DipQxlpS.js";
import "./DateRangePicker-BtaBkVBV.js";
import "./TextInput-B7BOT4fb.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-CcJYGp7u.js";
import "./Calendar-CTMwfaNG.js";
import "./TabButtons-Bd5Ho3RO.js";
import "./Dialog-BExLj_74.js";
import "./FormControl-BJFHM5NO.js";
import "./Select-DdaP9TXq.js";
import "./Textarea-DgNRQxgR.js";
import "./ErrorMessage-By7PG3gO.js";
import "./FileUploader-1h1WwG0B.js";
import "./Progress-C8BWU8sl.js";
import "./Rating-C7-eBoqf.js";
import "./Password-DiANMr9x.js";
import "./Spinner-Is5Yz4tb.js";
import "./Switch-o5Mm_j_X.js";
import "./Tabs-DZF9dvpe.js";
import "./CircularProgressBar-i5fixgB6.js";
import "./Tree-CFF_9ooL.js";
import "./Sidebar-BztMxUM8.js";
import "./NumberChart-mCLiodus.js";
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
