import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DBifjAOG.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D2TDdaGT.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Cj0eIozS.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-DwtwZ628.js";
import "./Popover-CzA9YWcp.js";
import "./Button-D5TvV9Gh.js";
import "./FeatherIcon-Wmu1TLct.js";
import "./Avatar-Ckzq67LQ.js";
import "./Badge-DfZcHRt2.js";
import "./Breadcrumbs-y0y9cebq.js";
import "./Dropdown-BF_PcYRp.js";
import "./Switch-DtNnBdlD.js";
import "./plus-ChBqijgJ.js";
import "./chevron-down-C-UPl2b4.js";
import "./DatePicker-DyI-6_Zz.js";
import "./TextInput-BToXGlmY.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-PBW4btL-.js";
import "./DateRangePicker-DdVgsRkr.js";
import "./TimePicker-e-Ugj3rZ.js";
import "./Calendar-DwLAH31N.js";
import "./TabButtons-Df2mV-WA.js";
import "./Dialog-BZs9Q_RZ.js";
import "./FormControl-k2bBSPHV.js";
import "./Select-BoYEnLk5.js";
import "./Textarea-BnV_RuZB.js";
import "./ErrorMessage-D_JwCCeS.js";
import "./FileUploader-YjAiUbO2.js";
import "./Progress-D5BkK4sv.js";
import "./Rating-CBHgTMjR.js";
import "./Password-DHDEKiDK.js";
import "./Spinner-Cp-2IzUp.js";
import "./Tabs-C0dzdKFv.js";
import "./CircularProgressBar-BpYyfKsL.js";
import "./Tree-Ckrxfyax.js";
import "./Sidebar-B87Jfl-1.js";
import "./NumberChart-MmE6gOEj.js";
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
