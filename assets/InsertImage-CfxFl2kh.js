import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BpCOKTbo.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DLCBZki8.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Zv6PdAB7.js";
import "./Autocomplete-B413tcvt.js";
import "./Popover-BYdpcAoF.js";
import "./Button-DHp0wGiF.js";
import "./FeatherIcon-Dl_vmGgG.js";
import "./Avatar-DkelKrW-.js";
import "./Badge-Cf4x3mep.js";
import "./Breadcrumbs-4gzaHWK6.js";
import "./Dropdown-asKyNZyW.js";
import "./Combobox-CalHu07i.js";
import "./chevron-down-Dde2xnFy.js";
import "./DateRangePicker-B4m4cFvT.js";
import "./TextInput-CorY9GWu.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DyfmUP2-.js";
import "./Dialog-DDqH6JGR.js";
import "./ErrorMessage-DMGcg1jp.js";
import "./FileUploader-QfMIdTHB.js";
import "./FormControl-C8ZDrIUI.js";
import "./Select-ZJKAo3gC.js";
import "./Textarea-BVOiZQ_z.js";
import "./Progress-C00R8gl3.js";
import "./Rating-CmosRLeE.js";
import "./Spinner-DOLMmAMq.js";
import "./Switch-BpiLDTMr.js";
import "./TabButtons-n3IQDp7E.js";
import "./Tabs-DynRjUnc.js";
import "./Tooltip-C4-OcUT4.js";
import "./Calendar-D8oCewlt.js";
import "./CircularProgressBar-DPBms28s.js";
import "./Tree-C9Iyvl-T.js";
import "./Sidebar-DSeQ4k8h.js";
import "./NumberChart-Bw9-r72_.js";
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
