import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-C3m4T00i.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BfIxz5-U.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DAoYz3B3.js";
import "./Autocomplete-CDW3Q7RT.js";
import "./Popover-BUxDEsPv.js";
import "./Button-CkA2kzPh.js";
import "./FeatherIcon-xJSm9ULj.js";
import "./Avatar-C9eyQ4jZ.js";
import "./Badge-C-ozDBKO.js";
import "./Breadcrumbs-BQTL9p_K.js";
import "./Dropdown-DWE9fBa_.js";
import "./Combobox-WBQttAa-.js";
import "./chevron-down-D81YQTrP.js";
import "./DateRangePicker-mIkMC8ag.js";
import "./TextInput-3Kwpu1Qx.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Xp2cFkEK.js";
import "./Calendar-C2lFn7Jn.js";
import "./TabButtons-3Rch8E8G.js";
import "./Dialog-DFf5VNMk.js";
import "./FormControl-D1YqfrCj.js";
import "./Select-DpoCUfko.js";
import "./Textarea-CzTUOqmm.js";
import "./ErrorMessage-CaPCW1nZ.js";
import "./FileUploader-CARnDxuo.js";
import "./Progress-kTE4Wv7a.js";
import "./Rating-a3b7iceU.js";
import "./Password-D63HfA5A.js";
import "./Spinner-Cyopse32.js";
import "./Switch-Cz6CjVMf.js";
import "./Tabs-rLm3xGZO.js";
import "./CircularProgressBar-l0ZWUvfr.js";
import "./Tree-Bektk9VX.js";
import "./Sidebar-B-JoXjm9.js";
import "./NumberChart-DjsSmZ2d.js";
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
