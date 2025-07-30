import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aT as normalizeProps, aU as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CnLTNpHj.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BW-k4KK7.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DgqVYTlG.js";
import "./Autocomplete-Ddb-5Oda.js";
import "./Popover-C_ZymHxg.js";
import "./Button-kEDvkrXC.js";
import "./FeatherIcon-DaHL769k.js";
import "./Avatar-Dc_UGi5x.js";
import "./Badge-BKGFqmCo.js";
import "./Breadcrumbs-HH1BDJ3b.js";
import "./Dropdown-BwEvqVYV.js";
import "./Combobox-BzG8ZFRr.js";
import "./chevron-down-DeQKo3yH.js";
import "./DateRangePicker-BLRLTPYP.js";
import "./TextInput-CNdJ6Lsk.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-2yDBkHWS.js";
import "./Calendar-D3e38pGv.js";
import "./TabButtons-BTq65lWn.js";
import "./Dialog-IjiiNU6G.js";
import "./FormControl-DRhhXZ81.js";
import "./Select-BNy4ubtH.js";
import "./Textarea-CVRupHcc.js";
import "./ErrorMessage--u9xS7AM.js";
import "./FileUploader-DgArO3no.js";
import "./Progress-CZ6bT3ck.js";
import "./Rating-E988sFRP.js";
import "./Password-DBpaucGG.js";
import "./Tooltip-DxYWf611.js";
import "./Spinner-BrKwxZbD.js";
import "./Switch-CK0jcvQn.js";
import "./Tabs-ChEyQoxp.js";
import "./CircularProgressBar-CaUdxWbt.js";
import "./Tree-J550VSxL.js";
import "./Sidebar-5_79YEjK.js";
import "./NumberChart-Cy7vOR3z.js";
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
