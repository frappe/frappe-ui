import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-2CZqcq_N.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CriOlc5r.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CUeJzyf3.js";
import "./Autocomplete-CWW5Pa6U.js";
import "./Popover-TtdecaZK.js";
import "./Button-L9MLNqBl.js";
import "./FeatherIcon-5kA3siwp.js";
import "./Avatar-DjnOY7Rp.js";
import "./Badge-B0K7QUvD.js";
import "./Breadcrumbs-hoolxIO8.js";
import "./Dropdown-CPgKBUI4.js";
import "./Combobox-CKQBokTR.js";
import "./chevron-down-DJWHmpM2.js";
import "./DateRangePicker-DusaQpCT.js";
import "./TextInput-BwjewoKx.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Bgw3aVwt.js";
import "./Calendar-DjRbSRBG.js";
import "./TabButtons-E0mPD8Ck.js";
import "./Dialog-BGSaUxEs.js";
import "./FormControl-Y_IfBKpo.js";
import "./Select-C5WkLZhC.js";
import "./Textarea-CSpdKkXR.js";
import "./ErrorMessage-BA2VHuQZ.js";
import "./FileUploader-pxqljnJA.js";
import "./Progress-CVrxr8U7.js";
import "./Rating-i2bR4Ewh.js";
import "./Password-CEGKZp_y.js";
import "./Spinner-Xe4vnw45.js";
import "./Switch-CziIi1uS.js";
import "./Tabs-CA86iRRO.js";
import "./CircularProgressBar-q3OFvt_K.js";
import "./Tree-DqPhb8mV.js";
import "./Sidebar-CMwKQ5HM.js";
import "./NumberChart-BPXA5xb_.js";
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
