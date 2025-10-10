import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-F5kC6_Yf.js";
import { I as ImageGroupUploadDialog } from "./ListRow-L1vj-i6i.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BgbR_pgF.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-D6GxQneX.js";
import "./Popover-BS26BFYS.js";
import "./Button-SEBbO4PF.js";
import "./FeatherIcon-ciI4L3s3.js";
import "./Avatar-CDTCJv3h.js";
import "./Badge-BZV6ixzw.js";
import "./Breadcrumbs-BYqGOqmS.js";
import "./Dropdown-oroOSPVV.js";
import "./Switch-ueT0CgDn.js";
import "./plus-BU_FATu0.js";
import "./chevron-down-DznbTi-U.js";
import "./DatePicker-Duq87NRR.js";
import "./TextInput-vvdoEige.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-OGQbwKaK.js";
import "./DateRangePicker-slf38lQ8.js";
import "./TimePicker-DaXDVn6l.js";
import "./Calendar-CWopJ3Cn.js";
import "./TabButtons-DYC-Wls-.js";
import "./Dialog-Bfu3ckaj.js";
import "./FormControl-DLjSckCx.js";
import "./Select-CalA9Bn6.js";
import "./Textarea-BRRqh7xz.js";
import "./ErrorMessage-DdzfMFGD.js";
import "./FileUploader-W5RfHrq1.js";
import "./Progress-DjSTw4Bz.js";
import "./Rating-Bh1vxr7H.js";
import "./Password-BaF7dx46.js";
import "./Spinner-CEEEHjBE.js";
import "./Tabs-BN3c5A4h.js";
import "./CircularProgressBar-C9VCQ9RC.js";
import "./Tree-C6RNCm7C.js";
import "./Sidebar-XH2rw4yN.js";
import "./NumberChart-DcfHeMYP.js";
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
