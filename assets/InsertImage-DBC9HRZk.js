import { ay as defineComponent, bd as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aX as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Bp27nGZy.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D4kWPlmG.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-B9EoYKHb.js";
import "./Autocomplete-MfVTAODs.js";
import "./Popover-CkTBhiFo.js";
import "./Button-ChnItE51.js";
import "./FeatherIcon-B8S54-17.js";
import "./Avatar-CMCUuHOk.js";
import "./Badge-CH9hezh8.js";
import "./Breadcrumbs-CTPvZAns.js";
import "./Dropdown-De26NPXB.js";
import "./Combobox-CVFWcVw8.js";
import "./DateRangePicker-COhkNcWn.js";
import "./TextInput-BHqGkgye.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DwOLYGCP.js";
import "./Dialog-CRtP_747.js";
import "./ErrorMessage-B6eYCJwB.js";
import "./FileUploader-BmmTAjTr.js";
import "./FormControl--z1y_T3x.js";
import "./Select-r0JfZkex.js";
import "./Textarea-CA0HsMNj.js";
import "./Progress-C_9TWUf6.js";
import "./Rating-CKM_y_sn.js";
import "./Spinner-CGD1Xvs_.js";
import "./Switch-DqM0IYjC.js";
import "./TabButtons-CNI0WYVW.js";
import "./Tabs-JynOTat7.js";
import "./Tooltip-EWh_pbxI.js";
import "./Calendar-DCmyM2M4.js";
import "./CircularProgressBar-D3b8hEc3.js";
import "./Tree-B2DspSCo.js";
import "./NumberChart-C1FZ7LXe.js";
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
