import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DmART1uI.js";
import { I as ImageGroupUploadDialog } from "./ListRow-rAeDZBOF.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Dy3IIvLI.js";
import "./Autocomplete-QHOW6kQN.js";
import "./Popover-BjjR5m0W.js";
import "./Button-CKLaiXOF.js";
import "./FeatherIcon-DBwicNmi.js";
import "./Avatar-COdNISQl.js";
import "./Badge-D3gTnug4.js";
import "./Breadcrumbs-CJ68zw8a.js";
import "./Dropdown-Dl-Vfd1O.js";
import "./Combobox-D3g447Vv.js";
import "./chevron-down-Ccio0s7I.js";
import "./DateRangePicker-CpVAIyCB.js";
import "./TextInput-BG0yOC_r.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Cs9nVLjc.js";
import "./Calendar-Cl75cdX4.js";
import "./TabButtons-C45jNfYc.js";
import "./Dialog-D58TnYNP.js";
import "./FormControl-DDkxTYEr.js";
import "./Select-WiiFC7mB.js";
import "./Textarea-BG39mZdn.js";
import "./ErrorMessage-BcBD2OjQ.js";
import "./FileUploader-BPJrP9o6.js";
import "./Progress-0NInKKOy.js";
import "./Rating-cXusO5Tl.js";
import "./Password-BFPrkm_g.js";
import "./Spinner-BWMV5ey4.js";
import "./Switch-1XImWIO6.js";
import "./Tabs-BNWfIiLU.js";
import "./CircularProgressBar-B0-2exrl.js";
import "./Tree-zbju-iCP.js";
import "./Sidebar-B1R-dO7S.js";
import "./NumberChart-Igc5F7Vr.js";
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
