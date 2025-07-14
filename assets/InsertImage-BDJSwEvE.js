import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Dkyn9swe.js";
import { I as ImageGroupUploadDialog } from "./ListRow-B0NnzY1x.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CH_edTZq.js";
import "./Autocomplete-DlLMqfRq.js";
import "./Popover--8u7UAvL.js";
import "./Button-DsA9Q022.js";
import "./FeatherIcon-DqIfDx_l.js";
import "./Avatar-C2D9d2WF.js";
import "./Badge-DkstDuZR.js";
import "./Breadcrumbs-a5BHkrg8.js";
import "./Dropdown-DsQcYvbp.js";
import "./Combobox-B6cVPOBJ.js";
import "./chevron-down-hsmspkNo.js";
import "./DateRangePicker-DdHYO_Z1.js";
import "./TextInput-C2ksAbiL.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DKbRp2fd.js";
import "./Dialog-CI4hZ-xl.js";
import "./ErrorMessage-28BSWUt2.js";
import "./FileUploader-BSjafJpz.js";
import "./FormControl-3DH1WdI9.js";
import "./Select-DZCRfo1e.js";
import "./Textarea-BWaE66vC.js";
import "./Progress-YUxt_R6B.js";
import "./Rating-KjECi7DU.js";
import "./Spinner-CaSFN2Ld.js";
import "./Switch-B2aAkFYO.js";
import "./TabButtons-BMmtdI6w.js";
import "./Tabs-ewNQ9MlC.js";
import "./Tooltip-D3_dQY79.js";
import "./Calendar-C7WwGuc2.js";
import "./CircularProgressBar-BBox04gu.js";
import "./Tree-CqfBJWf7.js";
import "./Sidebar-Cn2OY79J.js";
import "./NumberChart-DWXVlibh.js";
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
