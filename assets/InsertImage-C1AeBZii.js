import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-YPVfCc2u.js";
import { I as ImageGroupUploadDialog } from "./ListRow-C9ebwm4y.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-D0ALPXgI.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-DZ66W3yQ.js";
import "./Popover-BZ5ZXSl-.js";
import "./Button-D1tNK2Zw.js";
import "./FeatherIcon-BL3rDx2a.js";
import "./Avatar-Cwg_O0kc.js";
import "./Badge-CAl_tOYE.js";
import "./Breadcrumbs-8qvJFtGZ.js";
import "./Dropdown-CeRw02KF.js";
import "./Switch-BfY62A3j.js";
import "./plus-DSCl2UCf.js";
import "./chevron-down-DHZRTQsv.js";
import "./DatePicker-DX-6Gt0-.js";
import "./TextInput-C-StiM-w.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BES6pJGH.js";
import "./DateRangePicker-DzgElQNO.js";
import "./TimePicker-C4_3n04z.js";
import "./Calendar-DmGnIx3k.js";
import "./TabButtons-Dgpv1JwW.js";
import "./Dialog-DZYepdU8.js";
import "./FormControl-BYbR_i_K.js";
import "./Select-B43n4LRU.js";
import "./Textarea-n53LA-zi.js";
import "./ErrorMessage-J2Plxq3J.js";
import "./FileUploader-ahUKCou3.js";
import "./Progress-C9WAnkJO.js";
import "./Rating-BEjw6FdL.js";
import "./Password-bWvcyr9G.js";
import "./Spinner-D73OBGVY.js";
import "./Tabs-DssmEy1R.js";
import "./CircularProgressBar-BTNY8Cxt.js";
import "./Tree-7FqZ10dd.js";
import "./Sidebar-CaEjzAnH.js";
import "./NumberChart-GwlzTZHP.js";
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
