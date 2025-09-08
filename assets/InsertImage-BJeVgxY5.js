import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-YOH0Ssd3.js";
import { I as ImageGroupUploadDialog } from "./ListRow-VgknvDFh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Cwx0aFeV.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-liBtS-ij.js";
import "./Popover-D1ykTmvk.js";
import "./Button-CgJQWS1A.js";
import "./FeatherIcon-Dy_wld2O.js";
import "./Avatar-S7y3GsMx.js";
import "./Badge-ClXobOrW.js";
import "./Breadcrumbs-DRCwF8je.js";
import "./Dropdown-DZlezBsL.js";
import "./Switch-BA4D8QTG.js";
import "./plus-VOZNFiZd.js";
import "./chevron-down-snVS8xfD.js";
import "./DatePicker-CtKIv3kp.js";
import "./TextInput-VXfdA3g8.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BHFHT_9v.js";
import "./DateRangePicker-mhQPjMIK.js";
import "./TimePicker-VXmARaWO.js";
import "./Calendar-Ci9DEcKT.js";
import "./TabButtons-BRhKF8CA.js";
import "./Dialog-CBs2biwG.js";
import "./FormControl-C4_6MRbn.js";
import "./Select-LVrM5amm.js";
import "./Textarea-CGNAuTVf.js";
import "./ErrorMessage-BcM8hGbD.js";
import "./FileUploader-BL4EtPnU.js";
import "./Progress-BWW05av7.js";
import "./Rating-Dhq5F95i.js";
import "./Password-Dk5sXmff.js";
import "./Spinner-Dv33cyQk.js";
import "./Tabs-BYCXaimP.js";
import "./CircularProgressBar-HiAnfmGy.js";
import "./Tree-fnbaZuEF.js";
import "./Sidebar-CJKCF_0k.js";
import "./NumberChart-BVKM746V.js";
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
