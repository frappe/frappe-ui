import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-F9XTPQRg.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DfvTBq5W.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BtBWwFAW.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-7sOdD76Y.js";
import "./Popover-Bs0Pogkd.js";
import "./Button-GjzHrKSv.js";
import "./FeatherIcon-h0SskxNS.js";
import "./Avatar-LKqtC39S.js";
import "./Badge-Tg_eRqI5.js";
import "./Breadcrumbs-lOAbOAty.js";
import "./Dropdown-B8_nBIVm.js";
import "./Switch-BwHSXENy.js";
import "./plus-Da38_kld.js";
import "./chevron-down-Bh6GK6vo.js";
import "./DatePicker-C5388BVX.js";
import "./TextInput-CA1Kotrm.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DGPTM7NE.js";
import "./DateRangePicker-DtYkmO8o.js";
import "./TimePicker-BsjH1hkb.js";
import "./Calendar-frA3a_Rn.js";
import "./TabButtons-VL2F7btg.js";
import "./Dialog-BeINfykO.js";
import "./FormControl-CJW9xXjG.js";
import "./Select-BKb9-1Ml.js";
import "./Textarea-CKSv9wz-.js";
import "./ErrorMessage-CxZFFd6D.js";
import "./FileUploader-CZQ_qTAN.js";
import "./Progress-DkJPlQdE.js";
import "./Rating-C2S2x0sc.js";
import "./Password-DXatPghX.js";
import "./Spinner-gmeQ7WGT.js";
import "./Tabs-Dn3Zi860.js";
import "./CircularProgressBar-lBqxZpYc.js";
import "./Tree-p0utLMbT.js";
import "./Sidebar-Bf-aVrGy.js";
import "./NumberChart-D5Zpo1Vp.js";
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
