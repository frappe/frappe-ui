import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-B-dtWnil.js";
import { I as ImageGroupUploadDialog } from "./ListRow-dzQRl5Az.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-UJP1L3ge.js";
import "./Autocomplete-H7UMkZPC.js";
import "./Popover-QZlDj51Z.js";
import "./Button-Bk-f01jo.js";
import "./FeatherIcon-CNxkKovQ.js";
import "./Avatar-DkIf96Pb.js";
import "./Badge-2h8B_26c.js";
import "./Breadcrumbs-CduSba5h.js";
import "./Dropdown-oSlUndKU.js";
import "./Combobox-DmlCvli_.js";
import "./chevron-down-CQWlwcWJ.js";
import "./DateRangePicker-BN1G4MYd.js";
import "./TextInput-90pJt4iN.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BWkqU7DC.js";
import "./Calendar-Coq-26Gm.js";
import "./TabButtons-CRvjeXYb.js";
import "./Dialog-BFlfJo0i.js";
import "./FormControl-B8MhPPPN.js";
import "./Select-DKeNDigA.js";
import "./Textarea-BxFhy24L.js";
import "./ErrorMessage-CmS0EOkc.js";
import "./FileUploader-DXh2kufH.js";
import "./Progress-CH6-t42R.js";
import "./Rating-D_JvMdzU.js";
import "./Password-BmXh93X6.js";
import "./Spinner-7qysx3me.js";
import "./Switch-LQzTEY-6.js";
import "./Tabs-CZkMiuR3.js";
import "./CircularProgressBar-CT2ydXQm.js";
import "./Tree-n2zL_j0P.js";
import "./Sidebar-3Acmkghc.js";
import "./NumberChart-CRmPeWeb.js";
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
