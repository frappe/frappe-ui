import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-ChKKKszV.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BCPIKwt9.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DTCN1KDz.js";
import "./Autocomplete-rU7bcV1y.js";
import "./Popover-COmkL3VE.js";
import "./Button-Dy2DgMgb.js";
import "./FeatherIcon-qFFc4MqJ.js";
import "./Avatar-BQ-i6OgE.js";
import "./Badge-BGz0KBEQ.js";
import "./Breadcrumbs-DlGABKfq.js";
import "./Dropdown-D7gppseh.js";
import "./Combobox-BFT6Nqj7.js";
import "./chevron-down-Dj6Yn6fA.js";
import "./DateRangePicker-CEjmtvLj.js";
import "./TextInput-DQyjdQAz.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BGcB0k8t.js";
import "./Dialog-ZwlUr7Hd.js";
import "./ErrorMessage-8Vir2Hvx.js";
import "./FileUploader-BJlq5Tgi.js";
import "./FormControl-BY_AZ6Kd.js";
import "./Select-BuB8XE6R.js";
import "./Textarea-BoNdGwNH.js";
import "./Progress-BLhHu1Y7.js";
import "./Rating-DvXMnGJJ.js";
import "./Spinner-DhVTyGx3.js";
import "./Switch-BnOIfNYf.js";
import "./TabButtons-BYO5RfjS.js";
import "./Tabs-BUbCJ2T4.js";
import "./Tooltip-iDjKfPdM.js";
import "./Calendar-D4QhNK3M.js";
import "./CircularProgressBar-BpgjxdxH.js";
import "./Tree-C72ZzSor.js";
import "./Sidebar-BNbU1h99.js";
import "./NumberChart-CVz8Wczm.js";
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
