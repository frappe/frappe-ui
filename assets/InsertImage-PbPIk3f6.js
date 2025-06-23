import { ay as defineComponent, bt as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aX as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CvN3FFjz.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CzNhFhbu.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-ATe7bt10.js";
import "./Autocomplete-BSrW5nSe.js";
import "./Popover-8ih0ZLVs.js";
import "./Button-Bo_COTcg.js";
import "./FeatherIcon-Bj1BMSNv.js";
import "./Avatar-DUuIPgJk.js";
import "./Badge-CNZ255Mk.js";
import "./Breadcrumbs-c5lUJGuS.js";
import "./Dropdown-BE9vQjnX.js";
import "./DateRangePicker-DhmaJZ6D.js";
import "./TextInput-C7dhbp3p.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-D6X-WVZq.js";
import "./Dialog-BeNfzZpx.js";
import "./ErrorMessage-BntSRpxi.js";
import "./FileUploader-DDR93Bly.js";
import "./FormControl-BrX2uwbF.js";
import "./Select-DdT7UxvM.js";
import "./Textarea-YLZdA5z8.js";
import "./Progress-Dj79893c.js";
import "./Rating-CaImsup1.js";
import "./Spinner-Baa0S7TR.js";
import "./Switch-BnK5cpGB.js";
import "./TabButtons-hE9z7z39.js";
import "./Tabs-CQF5YTE2.js";
import "./Tooltip-lL9FKZ3c.js";
import "./Calendar-DWmxcqjK.js";
import "./CircularProgressBar-CMD3AWZi.js";
import "./Tree-Ws02BiXa.js";
import "./NumberChart-Cpkc4M3i.js";
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
