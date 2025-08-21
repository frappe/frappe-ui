import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DISWWsWY.js";
import { I as ImageGroupUploadDialog } from "./ListRow-B_--6c-H.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Cx-ufmnm.js";
import "./Autocomplete-C6Z2DgFE.js";
import "./Popover-j_4EZZA0.js";
import "./Button-DtJxsHYT.js";
import "./FeatherIcon-DoJ4_BW-.js";
import "./Avatar-BYqwOImh.js";
import "./Badge-Bs_IowRB.js";
import "./Breadcrumbs-dgXR4ACg.js";
import "./Dropdown-DGNrRokw.js";
import "./Combobox-EvdQQJVf.js";
import "./chevron-down-D-_-s-uA.js";
import "./DateRangePicker-B8a7nL-J.js";
import "./TextInput-RRdMaOfn.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Dz88kFmc.js";
import "./Calendar-GwnWLlmo.js";
import "./TabButtons-CSrboPtB.js";
import "./Dialog-DgOoy62u.js";
import "./FormControl-DNVwDfSo.js";
import "./Select-yGeIZf0U.js";
import "./Textarea-D9auMIWm.js";
import "./ErrorMessage-C1nOrr37.js";
import "./FileUploader-DyyR3aAm.js";
import "./Progress-B1glHhZf.js";
import "./Rating-1puaL20x.js";
import "./Password-UeXIA5ha.js";
import "./Spinner-ButuIzi1.js";
import "./Switch-Brgnsdcd.js";
import "./Tabs-CttshQCn.js";
import "./CircularProgressBar-Dtu8iT2S.js";
import "./Tree-BOVVWbfK.js";
import "./Sidebar-BIKKPsYd.js";
import "./NumberChart-BCoigaG5.js";
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
