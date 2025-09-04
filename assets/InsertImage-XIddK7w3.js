import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BV3M7NtT.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BxfWtelN.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Crg0bHoU.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-Bf3ryciI.js";
import "./Popover-Bgs5pvKv.js";
import "./Button-dDpoWu7r.js";
import "./FeatherIcon--7PqYfXQ.js";
import "./Avatar-DaEUHUNx.js";
import "./Badge-DnHZMb89.js";
import "./Breadcrumbs-CjcAQnlU.js";
import "./Dropdown-Dl4aB5r-.js";
import "./Switch-DcgE_6LX.js";
import "./plus-BBFcn_fT.js";
import "./chevron-down-CvburRXK.js";
import "./DatePicker-Rlr74_a-.js";
import "./TextInput-DOaeDi4_.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-CbKUFPQk.js";
import "./DateRangePicker-DVE21BdU.js";
import "./TimePicker-C7DxGXK2.js";
import "./Calendar-LpI5kT7F.js";
import "./TabButtons-DdcqqI1i.js";
import "./Dialog-DN20p4n8.js";
import "./FormControl-B7ikb3R4.js";
import "./Select-9Zr18Ala.js";
import "./Textarea-Bx-hEkm4.js";
import "./ErrorMessage-B7Ltsczy.js";
import "./FileUploader-DWRR5MIg.js";
import "./Progress-WzdKmkcv.js";
import "./Rating-D_5axkeI.js";
import "./Password-OW9lanlV.js";
import "./Spinner-DRENsVyg.js";
import "./Tabs-Xkno2ImA.js";
import "./CircularProgressBar-UgGmoUYv.js";
import "./Tree-CHeyj2xb.js";
import "./Sidebar-BPl1iQWA.js";
import "./NumberChart-BR6Qo6Aq.js";
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
