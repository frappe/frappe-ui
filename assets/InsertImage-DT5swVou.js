import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DIKbPRDU.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CoXzXUt5.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-qbVrk01y.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-C257zYsJ.js";
import "./Popover-Q32UyAO8.js";
import "./Button-DNWagjwR.js";
import "./FeatherIcon-JFDjNu84.js";
import "./Avatar-YnTWDl1B.js";
import "./Badge-BzoFJlOw.js";
import "./Breadcrumbs-BaLiRG-g.js";
import "./Dropdown-DuNXQ0hx.js";
import "./Switch-CECHnTah.js";
import "./plus-CLX6a0Qh.js";
import "./chevron-down-C0MtqAGg.js";
import "./DatePicker-Dsbex_qw.js";
import "./TextInput-p1T1lPcz.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BV27HWbH.js";
import "./DateRangePicker-Df5r9Fgm.js";
import "./TimePicker-U6otbZpL.js";
import "./Calendar-CZEe2T8Y.js";
import "./TabButtons-C9LDioF0.js";
import "./Dialog-D-M-4Ueg.js";
import "./FormControl-ClI9KhY2.js";
import "./Select-CRlSqkH7.js";
import "./Textarea-CvJ_KoYT.js";
import "./ErrorMessage-fdFzNDHL.js";
import "./FileUploader-BMBOl8kS.js";
import "./Progress-w80r6WtD.js";
import "./Rating-CZjuGarR.js";
import "./Password-DKST568w.js";
import "./Spinner-BO4Qndde.js";
import "./Tabs-C5wp6cGL.js";
import "./CircularProgressBar-lx83GkfM.js";
import "./Tree-BD9OsC4K.js";
import "./Sidebar-rVG-pcEI.js";
import "./NumberChart-D4-wLrot.js";
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
