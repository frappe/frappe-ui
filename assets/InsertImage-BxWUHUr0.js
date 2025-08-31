import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BzIG1w1O.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BS4O1NXT.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CimMYmXC.js";
import "./Autocomplete-BZ-HUG6A.js";
import "./Popover-C9tDbKMo.js";
import "./Button-Dmgnyn9Z.js";
import "./FeatherIcon-DS2HKE4p.js";
import "./Avatar-DXajXZb-.js";
import "./Badge-Y3edfuUH.js";
import "./Breadcrumbs-hlaJ9qUs.js";
import "./Dropdown-BMSd6LN_.js";
import "./Combobox-DW0e7wiM.js";
import "./chevron-down-D_DYn18H.js";
import "./DateRangePicker-DSGnFkiT.js";
import "./TextInput-BKThIHFb.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-CZzIaK9l.js";
import "./Calendar-1TugPp-P.js";
import "./TabButtons-Cn5aSpXJ.js";
import "./Dialog-JjhQGYPW.js";
import "./FormControl-B-zn_WMB.js";
import "./Select-ClQlggWc.js";
import "./Textarea-Z5yehNaE.js";
import "./ErrorMessage-Ixs8X2At.js";
import "./FileUploader-BoZbfkgD.js";
import "./Progress-eZfnXTGR.js";
import "./Rating-u2dpIaOH.js";
import "./Password-B48K26n7.js";
import "./Spinner-DQugs_JI.js";
import "./Switch-Bc-Y-CSO.js";
import "./Tabs-BH-NFfG6.js";
import "./CircularProgressBar-B5_1clZI.js";
import "./Tree-8XtnvkRd.js";
import "./Sidebar-BVoYyKqB.js";
import "./NumberChart-4WdLPA6t.js";
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
