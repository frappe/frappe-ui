import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-B2lWDha5.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CZOvnaqt.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-D0Bt6Gvh.js";
import "./Autocomplete-B0n15T_D.js";
import "./Popover-CLstTk6Q.js";
import "./Button-BGUm8khL.js";
import "./FeatherIcon-C9dmtlpw.js";
import "./Avatar-DdsQ1KGi.js";
import "./Badge-Br2-Uagf.js";
import "./Breadcrumbs-B2FzDVUF.js";
import "./Dropdown-YaQ6tnY0.js";
import "./Combobox-DqPagv31.js";
import "./chevron-down-B1_c6m65.js";
import "./DateRangePicker-COjV_5hh.js";
import "./TextInput-DNZmOmdi.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-B5nTK4uw.js";
import "./Calendar-DSimKaEl.js";
import "./TabButtons-DRG2nLIj.js";
import "./Dialog-C1QuC1r5.js";
import "./FormControl-LR00xMk9.js";
import "./Select-BBsRjg7j.js";
import "./Textarea-J14YSVJA.js";
import "./ErrorMessage-7j6rD32r.js";
import "./FileUploader-CuIm9l-D.js";
import "./Progress-BvfnfMwU.js";
import "./Rating-DqLoZnbI.js";
import "./Password-Bwyv99c6.js";
import "./Spinner-BwzMb6Jt.js";
import "./Switch-CEZVH8ZZ.js";
import "./Tabs-DYdWkkPw.js";
import "./CircularProgressBar-BuiiNE9C.js";
import "./Tree-XXer5Hab.js";
import "./Sidebar-Zq9Us3rm.js";
import "./NumberChart-wfLG6FF-.js";
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
