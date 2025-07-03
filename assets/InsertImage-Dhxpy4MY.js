import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BfShARhX.js";
import { I as ImageGroupUploadDialog } from "./ListRow-N-eA2H1w.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BDnmXMFL.js";
import "./Autocomplete-CJl2U7QP.js";
import "./Popover-SiEGjih_.js";
import "./Button-vcuJyWls.js";
import "./FeatherIcon-C76ylM-6.js";
import "./Avatar-SViQqnhn.js";
import "./Badge-CfLKzNwN.js";
import "./Breadcrumbs-C45Q__Bk.js";
import "./Dropdown-CZ3ULAFm.js";
import "./Combobox-BAL3Xv0u.js";
import "./chevron-down-ZtNlZS3p.js";
import "./DateRangePicker-CUY_3oeM.js";
import "./TextInput-QKK8sb6p.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Crtb_zCs.js";
import "./Dialog-Bayq931g.js";
import "./ErrorMessage-tZaaIbNs.js";
import "./FileUploader-B_KBAtFu.js";
import "./FormControl-_pkU1Ei7.js";
import "./Select-D74KoRuD.js";
import "./Textarea-a-DRWL3F.js";
import "./Progress-C-jrX_ee.js";
import "./Rating-Bdx3SeTI.js";
import "./Spinner-BnqBwcDA.js";
import "./Switch-gJjhinQw.js";
import "./TabButtons-CK6C_9Gv.js";
import "./Tabs-DPsFi3gv.js";
import "./Tooltip-BR9cCCku.js";
import "./Calendar-C78-WpiM.js";
import "./CircularProgressBar-DV6vRfG-.js";
import "./Tree-8gYltxC7.js";
import "./Sidebar-Cjv28vY_.js";
import "./NumberChart-MteV8Qqv.js";
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
