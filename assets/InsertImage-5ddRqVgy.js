import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BPP-lk0W.js";
import { I as ImageGroupUploadDialog } from "./ListRow-Dlxz8bsV.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CRiBRL9k.js";
import "./Autocomplete-8wmp0fUp.js";
import "./Popover-DC-4WYHc.js";
import "./Button-Cn2N-fcr.js";
import "./FeatherIcon-BIXMqUd3.js";
import "./Avatar-BEO43hWJ.js";
import "./Badge-BK6iw_nv.js";
import "./Breadcrumbs-vKUIh2Y0.js";
import "./Dropdown-C__ixTf7.js";
import "./Combobox-xORwxFoq.js";
import "./chevron-down-Bz5DnOnB.js";
import "./DateRangePicker-CKm1ZmLC.js";
import "./TextInput-3BQEZW-0.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-D8xlsAK7.js";
import "./Dialog-D64YRYZw.js";
import "./ErrorMessage-D4NTNWLx.js";
import "./FileUploader-ih9pFE2k.js";
import "./FormControl-BJyDiZtc.js";
import "./Select-vuuM3nam.js";
import "./Textarea-uiarkyGZ.js";
import "./Progress-DCmUDRw2.js";
import "./Rating-DqLWLM2A.js";
import "./Spinner-CTfM0RK6.js";
import "./Switch-DZCoQ5Zj.js";
import "./TabButtons-BQEoggQf.js";
import "./Tabs-Ri8Ts5OP.js";
import "./Tooltip-DY3-RAwP.js";
import "./Calendar-NvM695OY.js";
import "./CircularProgressBar-BSWE9R4A.js";
import "./Tree-CMdnDRjh.js";
import "./Sidebar-CGuRhUIk.js";
import "./NumberChart-BCjLk8Rm.js";
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
