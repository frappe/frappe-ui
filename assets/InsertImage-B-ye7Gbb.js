import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DF52ah5Y.js";
import { I as ImageGroupUploadDialog } from "./ListRow-B1Ks6Ak4.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-33olAXiq.js";
import "./Autocomplete-CsO59wBN.js";
import "./Popover-BYIOrzpx.js";
import "./Button-CQSFOwwl.js";
import "./FeatherIcon-DZMCMSo9.js";
import "./Avatar-D7eN05qn.js";
import "./Badge-COd-ShVn.js";
import "./Breadcrumbs-DWPhOp0N.js";
import "./Dropdown-BmWTDulh.js";
import "./Combobox-fAcS2Ep6.js";
import "./chevron-down-DaQpogN6.js";
import "./DateRangePicker-CntsWNBD.js";
import "./TextInput-Di7llAp9.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-P6I7AwJ0.js";
import "./Calendar-Di4TO7sR.js";
import "./TabButtons-C581Antj.js";
import "./Dialog-CQq2ai_E.js";
import "./FormControl-DKSXXCxr.js";
import "./Select-BILPudrD.js";
import "./Textarea-ByCuQLoi.js";
import "./ErrorMessage-fYXl1VTz.js";
import "./FileUploader-BDPWP76j.js";
import "./Progress-DEr7hO95.js";
import "./Rating-BK31iWS4.js";
import "./Password-dztUxXbp.js";
import "./Spinner-PTZZr1Or.js";
import "./Switch-DH1VQPrw.js";
import "./Tabs-CyjcsLiN.js";
import "./CircularProgressBar-Zb_lqfjG.js";
import "./Tree-FSbL_FNM.js";
import "./Sidebar-CzR0YWM6.js";
import "./NumberChart-D8sNXTtE.js";
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
