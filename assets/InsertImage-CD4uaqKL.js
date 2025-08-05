import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-COj216il.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D-huAcSl.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DVt76iBr.js";
import "./Autocomplete-BSzUP1er.js";
import "./Popover-DTzmu2Q_.js";
import "./Button-C9giKl6E.js";
import "./FeatherIcon-CmAKrbuO.js";
import "./Avatar-GPtWQVE0.js";
import "./Badge-B1DALKCF.js";
import "./Breadcrumbs-Bvr2WFMS.js";
import "./Dropdown-CviFIrOY.js";
import "./Combobox-Cxk2-RPA.js";
import "./chevron-down-Bmdt8jt1.js";
import "./DateRangePicker-DCHDC5lp.js";
import "./TextInput-DCt3EkUI.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-CIbmrp_K.js";
import "./Calendar-IjP3hJMK.js";
import "./TabButtons-Dm6_DyfB.js";
import "./Dialog-BCJhrfxZ.js";
import "./FormControl-v3Hcacay.js";
import "./Select-C77il1Ah.js";
import "./Textarea-D89wH0dC.js";
import "./ErrorMessage-Dr_WPRSu.js";
import "./FileUploader-D3w4paw9.js";
import "./Progress-OoTRKNX3.js";
import "./Rating-PHAfpE0s.js";
import "./Password-Bq8r9v3L.js";
import "./Spinner-Ddxm6lfd.js";
import "./Switch-Bq8sL9Oq.js";
import "./Tabs-C__j6hzt.js";
import "./CircularProgressBar-DLyBAF-6.js";
import "./Tree-f3IJVeUu.js";
import "./Sidebar-B1VaLnwT.js";
import "./NumberChart-DVjScIgq.js";
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
