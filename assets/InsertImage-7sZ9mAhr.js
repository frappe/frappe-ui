import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BOKTOuAJ.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BhFKuQYn.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DPPJwk7X.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-B0hgIiRu.js";
import "./Popover-BM8UmCxZ.js";
import "./Button-BsYBNJjV.js";
import "./FeatherIcon-Chml5uuf.js";
import "./Avatar-BQC06g79.js";
import "./Badge-QLc_9KbV.js";
import "./Breadcrumbs-cVZDzE8v.js";
import "./Dropdown-DtD6zQHq.js";
import "./Switch-Btv3Cr2C.js";
import "./plus-D_eCPKCy.js";
import "./chevron-down-m0gFIKGd.js";
import "./DatePicker-DAXXAjP9.js";
import "./TextInput-CDYaf84A.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-B7qldPHT.js";
import "./DateRangePicker-DlgKInjC.js";
import "./TimePicker-jj7ctWdx.js";
import "./Calendar-Cxmg-Uzb.js";
import "./TabButtons-DWBSug6V.js";
import "./Dialog-zqCoi7i6.js";
import "./FormControl-rEtno24c.js";
import "./Select-DEb4PLsb.js";
import "./Textarea-8YFnSxO4.js";
import "./ErrorMessage-C6BEyrHr.js";
import "./FileUploader-B_jSXiMw.js";
import "./Progress-CrQHsqIr.js";
import "./Rating-BkIbBGon.js";
import "./Password-BpVftyNc.js";
import "./Spinner-mvwiXsqH.js";
import "./Tabs-Dp2I7VtG.js";
import "./CircularProgressBar-UV6Wdfd9.js";
import "./Tree-SYpC0uN6.js";
import "./Sidebar-DYCZ9BwR.js";
import "./NumberChart-B5xibxhk.js";
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
