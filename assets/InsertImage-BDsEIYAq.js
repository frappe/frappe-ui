import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DTTVCZo1.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DZPm9wCM.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-ITIJdDdH.js";
import "./Autocomplete-BhFRBU99.js";
import "./Popover-DslZZ8G2.js";
import "./Button-ByWWysM0.js";
import "./FeatherIcon-CU7vfcwU.js";
import "./Avatar-D203yQcj.js";
import "./Badge-YMoknYOw.js";
import "./Breadcrumbs-C0ZNWrNj.js";
import "./Dropdown-CItneSEU.js";
import "./Combobox-KbK-lnRS.js";
import "./chevron-down-CDRphtDZ.js";
import "./DateRangePicker-DV3WuJEg.js";
import "./TextInput-DrvG8vud.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-C51oFeJD.js";
import "./Dialog-MYni6kTa.js";
import "./ErrorMessage-CCGV_Ll4.js";
import "./FileUploader-DF_rfxbm.js";
import "./FormControl-BtVsg4mv.js";
import "./Select-BkrrLxwE.js";
import "./Textarea-Bi_PZ464.js";
import "./Progress-rGfhgI_2.js";
import "./Rating-DkjRf_UN.js";
import "./Spinner-C0xFcVs0.js";
import "./Switch-BtBs8-Tn.js";
import "./TabButtons-SHO6h6Y-.js";
import "./Tabs-BtrPgZ9f.js";
import "./Tooltip-vB8oEEp2.js";
import "./Calendar-CapW6NXP.js";
import "./CircularProgressBar-BylLU53I.js";
import "./Tree-CdqP3pv-.js";
import "./Sidebar-BJtj7joZ.js";
import "./NumberChart-CI0y9Djv.js";
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
