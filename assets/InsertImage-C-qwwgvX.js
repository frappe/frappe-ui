import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DWblPeGU.js";
import { I as ImageGroupUploadDialog } from "./ListRow-dVliWc3-.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-B_v-QdPC.js";
import "./Autocomplete-CGmf8jBT.js";
import "./Popover-CLoOwM_8.js";
import "./Button-Btuvf0WN.js";
import "./FeatherIcon-B9N7O20C.js";
import "./Avatar-gomMSx90.js";
import "./Badge-CvHHIvGN.js";
import "./Breadcrumbs-BDpXMQCT.js";
import "./Dropdown-w9NjG0an.js";
import "./Combobox-z3o4JMQR.js";
import "./chevron-down-DP1TT90a.js";
import "./DateRangePicker-DbqIwG5Z.js";
import "./TextInput-D_vHASbZ.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-8050xm1K.js";
import "./Calendar-DuFjxL7B.js";
import "./TabButtons-Dixlqw7B.js";
import "./Dialog-CPdp_Yqp.js";
import "./FormControl-CVgb2hvY.js";
import "./Select-CgE0btoJ.js";
import "./Textarea-DDsEWPyG.js";
import "./ErrorMessage-KcTCJY8T.js";
import "./FileUploader-BDrYRZ2l.js";
import "./Progress-7sEXhF8m.js";
import "./Rating-Dytcw_ob.js";
import "./Password-DYJH2qPS.js";
import "./Spinner-HwmTFitz.js";
import "./Switch-BEMKnf2s.js";
import "./Tabs-DzSMaNQN.js";
import "./CircularProgressBar-BUAnFrge.js";
import "./Tree-CqP7co3m.js";
import "./Sidebar-C3I5i99m.js";
import "./NumberChart-sdwAgdZG.js";
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
