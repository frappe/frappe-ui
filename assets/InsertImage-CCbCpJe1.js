import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Bl03b6Ug.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CGws149c.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CHc6vxRH.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-C4SiJcFS.js";
import "./Popover-BTZNnokt.js";
import "./Button-B1RMzLe_.js";
import "./FeatherIcon-AFEphUOt.js";
import "./Avatar-DCGCdV-p.js";
import "./Badge-Bm7o0TJ5.js";
import "./Breadcrumbs-D4tGJTjB.js";
import "./Dropdown-BVQRhP8f.js";
import "./Switch-B8mp5t9I.js";
import "./plus-BZ7kdLB2.js";
import "./chevron-down-B-t2Y6zA.js";
import "./DatePicker-C1mAjGnr.js";
import "./TextInput-CzZmznE8.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Df4eqbps.js";
import "./DateRangePicker-L9WHEcsV.js";
import "./TimePicker-L7YkNBCb.js";
import "./Calendar-DNXC4HaT.js";
import "./TabButtons-DeIHaaKP.js";
import "./Dialog-DDgCfEXh.js";
import "./FormControl-BaQyCB1K.js";
import "./Select-Do1KTOPz.js";
import "./Textarea-Do2zsEzJ.js";
import "./ErrorMessage-B05O_oVX.js";
import "./FileUploader-CigYR0DV.js";
import "./Progress-BsLCdNNx.js";
import "./Rating-_w8dOAF0.js";
import "./Password-4JUUjLkw.js";
import "./Spinner-DDNvZ2KX.js";
import "./Tabs-ESlWiUvk.js";
import "./CircularProgressBar-CriC0XHu.js";
import "./Tree-CD-GlT05.js";
import "./Sidebar-bsSDgEG_.js";
import "./NumberChart-xYRRTaOx.js";
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
