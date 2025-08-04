import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BSRqwcW1.js";
import { I as ImageGroupUploadDialog } from "./ListRow-C5BOiodU.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-B7lQaoSz.js";
import "./Autocomplete-C1KYRJ-K.js";
import "./Popover-ODiJWdkw.js";
import "./Button-CbAbrIzh.js";
import "./FeatherIcon-C1eoqRE9.js";
import "./Avatar-BWUYGP5H.js";
import "./Badge-BaKX4U8K.js";
import "./Breadcrumbs-DPMdTdPD.js";
import "./Dropdown-BicaWU32.js";
import "./Combobox-Cy66Q-hD.js";
import "./chevron-down-ry9KAGPz.js";
import "./DateRangePicker-BHgwwHsa.js";
import "./TextInput-BynrJmPx.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BBsjp98u.js";
import "./Calendar-D2T7raqV.js";
import "./TabButtons-DWAfKUmr.js";
import "./Dialog-Bqregv4y.js";
import "./FormControl-BHthB7G1.js";
import "./Select-BaEkAysl.js";
import "./Textarea-BF8Dk6si.js";
import "./ErrorMessage-DAjPRBRG.js";
import "./FileUploader-B83v2MxE.js";
import "./Progress-DgWvb6Ex.js";
import "./Rating-D9Eh9fpO.js";
import "./Password-CBZLcFcK.js";
import "./Spinner-DsMS2OA9.js";
import "./Switch-CR8G4m13.js";
import "./Tabs-CjF1aAep.js";
import "./CircularProgressBar-LxWR5eUz.js";
import "./Tree-CSRTtAf3.js";
import "./Sidebar-D4FbmqaW.js";
import "./NumberChart-CsVQYBVR.js";
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
