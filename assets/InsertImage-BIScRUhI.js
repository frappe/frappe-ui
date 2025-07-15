import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-B0gcEfye.js";
import { I as ImageGroupUploadDialog } from "./ListRow-lOkXLaPi.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CUl5N7ZU.js";
import "./Autocomplete-O4EwE2fL.js";
import "./Popover-DSg_0_Ha.js";
import "./Button-jpol_Q2q.js";
import "./FeatherIcon-zab7nM0A.js";
import "./Avatar-38jsh7o0.js";
import "./Badge-C49IDOh4.js";
import "./Breadcrumbs-ChqQ3eqL.js";
import "./Dropdown-Cm8Jv2aM.js";
import "./Combobox-CF3fq8I_.js";
import "./chevron-down-CymZecTc.js";
import "./DateRangePicker-IC6e6AQT.js";
import "./TextInput-CSWxrqkh.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-23b0dScZ.js";
import "./Dialog-bA-XkFiR.js";
import "./ErrorMessage-CPt7ywZP.js";
import "./FileUploader-MYrOrh-U.js";
import "./FormControl-DW3yyJ5C.js";
import "./Select-BiPsTt4t.js";
import "./Textarea-DoXnegsn.js";
import "./Progress-B3TbtM1u.js";
import "./Rating-CBSCWGEU.js";
import "./Spinner-CDtXJ50E.js";
import "./Switch-COY7zUfR.js";
import "./TabButtons-CHKJckz9.js";
import "./Tabs-eC4dGShD.js";
import "./Tooltip-H8KvrL0_.js";
import "./Calendar-Bd4cl54J.js";
import "./CircularProgressBar-Degyjztg.js";
import "./Tree-C-9VDgNc.js";
import "./Sidebar-D75FSZ7e.js";
import "./NumberChart-YBcU_jvI.js";
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
