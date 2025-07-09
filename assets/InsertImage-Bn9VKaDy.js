import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CaL5uAJY.js";
import { I as ImageGroupUploadDialog } from "./ListRow-B4s1AROR.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-wJxBjFWJ.js";
import "./Autocomplete-BtjTIBOI.js";
import "./Popover-CagCjr9-.js";
import "./Button-CSUzIAOa.js";
import "./FeatherIcon-CEFar4cN.js";
import "./Avatar-CPa_XZme.js";
import "./Badge-CGu1My8R.js";
import "./Breadcrumbs-jWvcm_uB.js";
import "./Dropdown-DO--iZ2V.js";
import "./Combobox-B186-GX4.js";
import "./chevron-down-xSeQR-eJ.js";
import "./DateRangePicker-Wvu3AWdF.js";
import "./TextInput-DpNCk_tb.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-USgm-LjO.js";
import "./Dialog-bVXRQV4w.js";
import "./ErrorMessage-CP1zUa17.js";
import "./FileUploader-DHzI8mAv.js";
import "./FormControl-NydIgwkz.js";
import "./Select-BadGfV6h.js";
import "./Textarea-DRIaWfiQ.js";
import "./Progress-CHxCGxB-.js";
import "./Rating-sEWICf1Q.js";
import "./Spinner-CGF1YEAp.js";
import "./Switch-CBQVerQz.js";
import "./TabButtons-ZcRSr2pt.js";
import "./Tabs-CmK8iSDW.js";
import "./Tooltip-421N3LVu.js";
import "./Calendar-CLJZJ_4A.js";
import "./CircularProgressBar-B05pBUbx.js";
import "./Tree-BZqKhTzI.js";
import "./Sidebar-EwHhbmEA.js";
import "./NumberChart-R-sMagrX.js";
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
