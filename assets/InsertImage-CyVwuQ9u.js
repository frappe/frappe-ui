import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CfojqLIx.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D4rTQIzM.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-e_vVKei8.js";
import "./Autocomplete-Bp0_5tqF.js";
import "./Popover-MRd66YDS.js";
import "./Button-CKdwWjwa.js";
import "./FeatherIcon-Bq64TMf1.js";
import "./Avatar-BOwRlOAd.js";
import "./Badge-DHs8i0o3.js";
import "./Breadcrumbs-BN9yori_.js";
import "./Dropdown-CflzhKC1.js";
import "./Combobox-C0lebWQe.js";
import "./chevron-down-DxgiSWqg.js";
import "./DateRangePicker-DGMjntQ1.js";
import "./TextInput-E-5uX87P.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Bu9fRZ8G.js";
import "./Calendar-C_tOaIg4.js";
import "./TabButtons-CrKQaS2Y.js";
import "./Dialog-BeZSL3PO.js";
import "./FormControl-CtLJ7NWm.js";
import "./Select-DcohErkm.js";
import "./Textarea-7yh_6JXJ.js";
import "./ErrorMessage-CFrjFVM8.js";
import "./FileUploader-CacSexyw.js";
import "./Progress-vYK39MyC.js";
import "./Rating-CLWCGqkj.js";
import "./Password-CUrQvf1S.js";
import "./Spinner-BPUjor-p.js";
import "./Switch-rOg4DDnK.js";
import "./Tabs-Brx8rzzu.js";
import "./CircularProgressBar-9gBPUmqX.js";
import "./Tree-Cm-Liao6.js";
import "./Sidebar-CS9yLg6p.js";
import "./NumberChart-OMilhbWG.js";
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
