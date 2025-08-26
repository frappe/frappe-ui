import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Dyu7YWmX.js";
import { I as ImageGroupUploadDialog } from "./ListRow-bn2xWv-d.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CSSr2Ny8.js";
import "./Autocomplete-eNn3Lq6Z.js";
import "./Popover-CkggqpCt.js";
import "./Button-D-Tuv453.js";
import "./FeatherIcon-DyF-0Mnq.js";
import "./Avatar-Dkj3k7Ku.js";
import "./Badge-BnwT9mqb.js";
import "./Breadcrumbs-CkMD4jNd.js";
import "./Dropdown-C8axbO1I.js";
import "./Combobox-DMBL5weN.js";
import "./chevron-down-QK0mL84r.js";
import "./DateRangePicker-kiS-9ETq.js";
import "./TextInput-xe8YyZHC.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Cf72CiFo.js";
import "./Calendar-ByKxyVH7.js";
import "./TabButtons-DRl4jISY.js";
import "./Dialog--KfTlQNt.js";
import "./FormControl-qHd6MR2E.js";
import "./Select-Bgz3gRTc.js";
import "./Textarea-DVRLwc9O.js";
import "./ErrorMessage-DnWLturI.js";
import "./FileUploader-CyYvk_F0.js";
import "./Progress-BfWgriwq.js";
import "./Rating-BF42NOjF.js";
import "./Password-BEIURq5y.js";
import "./Spinner-e8_dapvF.js";
import "./Switch-RhhbUUjT.js";
import "./Tabs-B7CNrNEa.js";
import "./CircularProgressBar-C50GUFPN.js";
import "./Tree-X9SkXNXi.js";
import "./Sidebar-Dj1HQo27.js";
import "./NumberChart-DrDhRXbu.js";
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
