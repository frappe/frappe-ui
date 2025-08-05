import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Iw87ajzH.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DvHM3FJe.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-C-30Rvva.js";
import "./Autocomplete-DfaJx4Vc.js";
import "./Popover-CU_b_9kP.js";
import "./Button-CxheGmHs.js";
import "./FeatherIcon-D5968CWr.js";
import "./Avatar-DjYec_uB.js";
import "./Badge-DZCx9yQq.js";
import "./Breadcrumbs-CphPHN1y.js";
import "./Dropdown-Ccu0ndY2.js";
import "./Combobox-CgCwLU7e.js";
import "./chevron-down-DhTBL3zN.js";
import "./DateRangePicker-G50yPnQ5.js";
import "./TextInput-CXoDhyZa.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DgIBmTSK.js";
import "./Calendar-zJCgxM9F.js";
import "./TabButtons-C82F1YZI.js";
import "./Dialog-jJ37r1Sp.js";
import "./FormControl-B7QCrGYm.js";
import "./Select-BJgPi216.js";
import "./Textarea-CChGXFdM.js";
import "./ErrorMessage-DSNvTkA7.js";
import "./FileUploader-DkhEhilB.js";
import "./Progress-v7TI5J_z.js";
import "./Rating-UrWH39uh.js";
import "./Password-41TQAqEg.js";
import "./Spinner-B6Z7SsiK.js";
import "./Switch-CgXmzwLI.js";
import "./Tabs-DDMoUKVt.js";
import "./CircularProgressBar-CPjXX5C3.js";
import "./Tree-qqg5RNfo.js";
import "./Sidebar-DTa6SE51.js";
import "./NumberChart-DvfWISnO.js";
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
