import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-9M_qsbLi.js";
import { I as ImageGroupUploadDialog } from "./ListRow-IoxJILey.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BrTPjQMp.js";
import "./Autocomplete-BRp-iiv8.js";
import "./Popover-Dewl5kV4.js";
import "./Button-BbBZy2NF.js";
import "./FeatherIcon-V_e5AWH1.js";
import "./Avatar-CLt_B7pp.js";
import "./Badge-DumPX8Cn.js";
import "./Breadcrumbs-C5xNGYFo.js";
import "./Dropdown-Bs8Cfq3R.js";
import "./Combobox-DFVr1uNC.js";
import "./chevron-down-BAFusnYz.js";
import "./DateRangePicker-Bb3OOjJS.js";
import "./TextInput-BWox2gZE.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DYxwI4AQ.js";
import "./Dialog-CAQEu8sE.js";
import "./ErrorMessage-C7365yoe.js";
import "./FileUploader-BcsQX9Dx.js";
import "./FormControl-DSq3yyfL.js";
import "./Select-Bd8SQuLg.js";
import "./Textarea-DmOMsD14.js";
import "./Progress-Dqo6mtIr.js";
import "./Rating-zKkD8xKs.js";
import "./Spinner-DxZQNF5r.js";
import "./Switch-BYCoPvH4.js";
import "./TabButtons-I7Wj1Vib.js";
import "./Tabs-VfWIqwI8.js";
import "./Tooltip-CYZQx0QL.js";
import "./Calendar-DB_fx-Wf.js";
import "./CircularProgressBar-CM3D3FRH.js";
import "./Tree-Co9zhQuM.js";
import "./Sidebar-DO84xLmL.js";
import "./NumberChart-C3f-Bw1k.js";
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
