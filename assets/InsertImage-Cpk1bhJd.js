import { ay as defineComponent, bt as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aX as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BG1Ka7Q5.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BkW_Hvq7.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BzOcNxwV.js";
import "./Autocomplete-EoCOuowK.js";
import "./Popover-Ca3Dkdn8.js";
import "./Button-WqRnpywD.js";
import "./FeatherIcon-B_6dTWlp.js";
import "./Avatar-BM4MOUGS.js";
import "./Badge-Cwa5CTCa.js";
import "./Breadcrumbs-DL9ctGs6.js";
import "./Dropdown-7IGyqkEP.js";
import "./DateRangePicker-D6EL9yRy.js";
import "./TextInput-tdXjePAA.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BUWpmRhn.js";
import "./Dialog-DfaK_LxG.js";
import "./ErrorMessage-Bpmqe0xZ.js";
import "./FileUploader-Dq1XbKo_.js";
import "./FormControl-DIKCz_vb.js";
import "./Select-CXA8cP-z.js";
import "./Textarea-DtqbIWN8.js";
import "./Progress-D7Ua3q3B.js";
import "./Rating-CduQfrrt.js";
import "./Spinner-1I_OG2yF.js";
import "./Switch-CThC4fcN.js";
import "./TabButtons-CL9_emWQ.js";
import "./Tabs-C30dUIQV.js";
import "./Tooltip-MdCYmakr.js";
import "./Calendar-Czw8uDXH.js";
import "./CircularProgressBar-B4ipwpRY.js";
import "./Tree-Clrl7rRP.js";
import "./NumberChart-DF5MqhYK.js";
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
