import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CdUPyejy.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DSzn451N.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CiDbBD6O.js";
import "./Autocomplete-CtP8gC9a.js";
import "./Popover-CJ3rnLfE.js";
import "./Button-BbDlMOFj.js";
import "./FeatherIcon-D5-xZ-ZX.js";
import "./Avatar-CNJlpI2E.js";
import "./Badge-BkHXMkT6.js";
import "./Breadcrumbs-ut4ci-Lv.js";
import "./Dropdown-BRb2__A2.js";
import "./Combobox-Cy3bfxFL.js";
import "./chevron-down-COpbPQxw.js";
import "./DateRangePicker-DoOKCCLx.js";
import "./TextInput-BsxImz12.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-C_14MqxR.js";
import "./Calendar-CB3CDVhv.js";
import "./TabButtons-BW850lWM.js";
import "./Dialog-64J0kuBR.js";
import "./FormControl-DBKWEuQi.js";
import "./Select-CfBIThkB.js";
import "./Textarea-DKRiHfRw.js";
import "./ErrorMessage-C4q87fvF.js";
import "./FileUploader-AeCmzuiB.js";
import "./Progress-uuszIJR9.js";
import "./Rating-DXspW8U8.js";
import "./Password-C8vPpSa7.js";
import "./Spinner-eZnFQ9qR.js";
import "./Switch-B2z1JAiA.js";
import "./Tabs-Bs0ou3R7.js";
import "./CircularProgressBar-DR8UUnUB.js";
import "./Tree-C44J0loW.js";
import "./Sidebar-oRfAADMq.js";
import "./NumberChart-DMRVq13d.js";
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
