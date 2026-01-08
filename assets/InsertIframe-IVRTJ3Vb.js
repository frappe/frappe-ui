import { ay as _export_sfc, az as defineComponent, aA as ref, aO as computed, b3 as onMounted, bc as onUnmounted, aD as openBlock, aL as createElementBlock, aP as renderSlot, be as normalizeProps, bf as guardReactiveProps, aS as createCommentVNode, aH as createVNode, aF as withCtx, aI as createBaseVNode, bm as withKeys, aJ as toDisplayString, aT as createTextVNode, a_ as nextTick } from "./vendor-CFK-kaVA.js";
import { v as validateURL, A as ALLOWED_DOMAINS, p as processURL, d as detectPlatform, c as calculateAspectRatio, g as getOptimalDimensions } from "./TextEditor.story-0TWNGF9K.js";
import { D as Dialog } from "./index-fko5lbnw.js";
import { T as Textarea } from "./Textarea-Cq4euHpu.js";
import { B as Button } from "./Button-D8MFAUoo.js";
import "./chevron-left-18j2Glu0.js";
import "./chevron-right-BJQ4e65A.js";
import "./plus-C28yCeJh.js";
import "./x-Bb7fjZI1.js";
import "./TextInput-D_b9suoH.js";
import "./debounce-CRCtzhPg.js";
import "./check-FLfFDzwf.js";
import "./Popover-C_Gn8v1y.js";
import "./link-BrykjAk2.js";
import "./ErrorMessage-rgu2V8yn.js";
import "./Select-rF-Ftj4X.js";
import "./chevron-down-BV6t2-Qu.js";
import "./Dialog-Ch6gkeBC.js";
import "./FeatherIcon-D8QEU4xT.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InsertIframe",
  props: {
    editor: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const showDialog = ref(false);
    const embedUrl = ref("");
    const urlError = ref("");
    const title = ref("");
    const alignment = ref("center");
    const customWidth = ref(640);
    const customHeight = ref(360);
    const urlInput = ref();
    const isValidUrl = computed(() => {
      if (!embedUrl.value) return false;
      try {
        if (embedUrl.value.trim().startsWith("<iframe")) {
          const srcMatch = embedUrl.value.match(/src=["']([^"']+)["']/);
          if (srcMatch == null ? void 0 : srcMatch[1]) {
            return validateURL(srcMatch[1], {
              allowedDomains: ALLOWED_DOMAINS,
              HTMLAttributes: {}
            });
          }
          return false;
        }
        return validateURL(embedUrl.value, {
          allowedDomains: ALLOWED_DOMAINS,
          HTMLAttributes: {}
        });
      } catch {
        return false;
      }
    });
    const processedUrl = computed(() => {
      if (!embedUrl.value) return "";
      if (embedUrl.value.trim().startsWith("<iframe")) {
        const srcMatch = embedUrl.value.match(/src=["']([^"']+)["']/);
        if (srcMatch == null ? void 0 : srcMatch[1]) {
          return processURL(srcMatch[1]);
        }
        return embedUrl.value;
      }
      return processURL(embedUrl.value);
    });
    const platformInfo = computed(() => {
      if (!embedUrl.value || !isValidUrl.value) return { platform: "Generic", aspectRatio: 9 / 16 };
      const platform = detectPlatform(processedUrl.value);
      const aspectInfo = calculateAspectRatio(processedUrl.value);
      return {
        platform: (platform == null ? void 0 : platform.name) || "Generic",
        aspectRatio: aspectInfo.ratio
      };
    });
    const optimalDimensions = computed(() => {
      if (!embedUrl.value || !isValidUrl.value) return { width: 640, height: 360 };
      return getOptimalDimensions(processedUrl.value, 800);
    });
    function validateUrl() {
      urlError.value = "";
      if (!embedUrl.value) return;
      if (!isValidUrl.value) {
        urlError.value = "Please enter a supported URL or iframe embed code";
      }
    }
    function openIframeDialog() {
      showDialog.value = true;
      embedUrl.value = "";
      urlError.value = "";
      title.value = "";
      alignment.value = "center";
      customWidth.value = 640;
      customHeight.value = 360;
      nextTick(() => {
        var _a, _b;
        (_b = (_a = urlInput.value) == null ? void 0 : _a.el) == null ? void 0 : _b.focus();
      });
    }
    computed(() => {
      if (embedUrl.value && isValidUrl.value) {
        const dimensions = optimalDimensions.value;
        customWidth.value = dimensions.width;
        customHeight.value = dimensions.height;
      }
    });
    function insertIframe() {
      if (!embedUrl.value || !isValidUrl.value) return;
      const success = props.editor.commands.setIframe({
        src: processedUrl.value,
        width: customWidth.value,
        height: customHeight.value,
        title: title.value,
        align: alignment.value
      });
      if (success) {
        showDialog.value = false;
        props.editor.commands.focus();
      } else {
        urlError.value = "Failed to insert embed. Please check the URL and try again.";
      }
    }
    function handleSlashCommandInsert(event) {
      var _a;
      if (((_a = event.detail) == null ? void 0 : _a.editor) === props.editor) {
        openIframeDialog();
      }
    }
    onMounted(() => {
      props.editor.view.dom.addEventListener("iframe:open-dialog", handleSlashCommandInsert);
    });
    onUnmounted(() => {
      props.editor.view.dom.removeEventListener("iframe:open-dialog", handleSlashCommandInsert);
    });
    const __returned__ = { props, showDialog, embedUrl, urlError, title, alignment, customWidth, customHeight, urlInput, isValidUrl, processedUrl, platformInfo, optimalDimensions, validateUrl, openIframeDialog, insertIframe, handleSlashCommandInsert, get Dialog() {
      return Dialog;
    }, get Button() {
      return Button;
    }, get Textarea() {
      return Textarea;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = {
  key: 0,
  class: "text-red-500 text-sm mt-1"
};
const _hoisted_3 = {
  key: 1,
  class: "text-ink-green-3 text-sm mt-1"
};
const _hoisted_4 = { class: "flex justify-end space-x-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $setup.openIframeDialog }))),
    createCommentVNode(" Iframe URL Input Dialog "),
    createVNode($setup["Dialog"], {
      modelValue: $setup.showDialog,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.showDialog = $event),
      options: { title: "Insert Embed", size: "md" }
    }, {
      "body-content": withCtx(() => [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("div", null, [
            _cache[3] || (_cache[3] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium text-ink-gray-7 mb-2" },
              " URL or Embed Code ",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Textarea"], {
              ref: "urlInput",
              modelValue: $setup.embedUrl,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.embedUrl = $event),
              placeholder: "https://youtube.com/watch?v=... or <iframe src=...>",
              onKeydown: withKeys($setup.insertIframe, ["enter"]),
              onInput: $setup.validateUrl
            }, null, 8, ["modelValue"]),
            $setup.urlError ? (openBlock(), createElementBlock(
              "p",
              _hoisted_2,
              toDisplayString($setup.urlError),
              1
              /* TEXT */
            )) : $setup.embedUrl && $setup.isValidUrl ? (openBlock(), createElementBlock(
              "p",
              _hoisted_3,
              " ✓ Valid " + toDisplayString($setup.platformInfo.platform) + " URL ",
              1
              /* TEXT */
            )) : createCommentVNode("v-if", true)
          ])
        ])
      ]),
      actions: withCtx(() => [
        createBaseVNode("div", _hoisted_4, [
          createVNode($setup["Button"], {
            variant: "subtle",
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.showDialog = false)
          }, {
            default: withCtx(() => _cache[4] || (_cache[4] = [
              createTextVNode("Cancel")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode($setup["Button"], {
            variant: "solid",
            disabled: !$setup.embedUrl || !$setup.isValidUrl,
            onClick: $setup.insertIframe
          }, {
            default: withCtx(() => _cache[5] || (_cache[5] = [
              createTextVNode(" Insert Embed ")
            ])),
            _: 1
            /* STABLE */
          }, 8, ["disabled"])
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["modelValue"])
  ]);
}
_sfc_main.__file = "src/components/TextEditor/extensions/iframe/InsertIframe.vue";
const InsertIframe = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/extensions/iframe/InsertIframe.vue"]]);
export {
  InsertIframe as default
};
