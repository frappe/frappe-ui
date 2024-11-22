import { d as defineComponent, o as openBlock, b as createElementBlock, e as createVNode, g as unref, I as Icon, f as createBaseVNode, t as toDisplayString, c as computed, y as histoireConfig, z as customLogos } from "./vendor-62c6993a.js";
import { u as useStoryStore } from "./story-d0c31b51.js";
import "./GenericMountStory.vue2-6d01b4e7.js";
const HistoireLogo = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='512'%20height='512'%20viewBox='0%200%20512%20512'%20version='1.1'%20id='svg5'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3cdefs%20id='defs2'%20/%3e%3cg%20id='layer1'%3e%3crect%20style='opacity:0.5;fill:%2334d399;fill-opacity:1;stroke-width:1.00375'%20id='rect1372'%20width='314.30923'%20height='406.60901'%20x='-26.565063'%20y='134.75079'%20transform='rotate(-23.821262)'%20ry='8'%20/%3e%3crect%20style='fill:%2334d399;fill-opacity:1;stroke-width:1.00375'%20id='rect850'%20width='314.30923'%20height='406.60901'%20x='77.571838'%20y='72.808708'%20ry='8'%20transform='rotate(-4.5744534)'%20/%3e%3c/g%3e%3cg%20id='layer3'%3e%3cpath%20id='path1657-3'%20style='display:inline;fill:%23b4fae2;fill-opacity:1;stroke:%23b4fae2;stroke-width:8.34923;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1'%20d='M%20359.38947,355.95134%20320.72935,176.52942%20238.34613,238.94118%20Z%20M%20273.64124,273.06608%20152.59788,156.05591%20191.25804,335.47786%20Z'%20/%3e%3c/g%3e%3cg%20id='layer2'%20style='display:none'%3e%3cpath%20id='path1657'%20style='fill:%23b4fae2;fill-opacity:1;stroke:%23b4fae2;stroke-width:8;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1'%20d='m%20296,103.98242%20-135.53125,177.9668%20h%2088.70117%20z%20M%20262.83008,230.05078%20216,408.01758%20351.53125,230.05078%20Z'%20transform='rotate(-4.156553,256,256.00691)'%20/%3e%3c/g%3e%3c/svg%3e";
const _hoisted_1$1 = { class: "htw-p-2 htw-flex htw-items-center htw-gap-x-2" };
const _hoisted_2$1 = { class: "htw-flex htw-flex-col htw-leading-none" };
const _hoisted_3$1 = { class: "htw-text-primary-500 htw-min-w-[80px] htw-font-bold" };
const _hoisted_4 = { class: "htw-text-sm htw-text-gray-900 dark:htw-text-gray-100" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HomeCounter",
  props: {
    icon: {
      type: String,
      default: "carbon:cube"
    },
    title: {
      type: String,
      default: ""
    },
    count: {
      type: Number,
      default: 0
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createVNode(unref(Icon), {
          icon: props.icon,
          class: "htw-text-2xl htw-text-gray-700 dark:htw-text-gray-300 htw-flex-none"
        }, null, 8, ["icon"]),
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("span", _hoisted_3$1, toDisplayString(__props.count), 1),
          createBaseVNode("span", _hoisted_4, toDisplayString(__props.title), 1)
        ])
      ]);
    };
  }
});
const _hoisted_1 = { class: "histoire-home-view htw-flex md:htw-flex-col htw-gap-12 htw-items-center htw-justify-center htw-h-full" };
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "htw-flex !md:htw-flex-col htw-flex-wrap htw-justify-evenly htw-gap-2 htw-px-4 htw-py-2 htw-bg-gray-100 dark:htw-bg-gray-750 htw-rounded htw-border htw-border-gray-500/30" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HomeView",
  setup(__props) {
    const logoUrl = computed(() => {
      var _a, _b;
      return ((_b = (_a = histoireConfig.theme) == null ? void 0 : _a.logo) == null ? void 0 : _b.square) ? customLogos.square : HistoireLogo;
    });
    const storyStore = useStoryStore();
    const stats = computed(() => {
      let storyCount = 0;
      let variantCount = 0;
      let docsCount = 0;
      (storyStore.stories || []).forEach((story) => {
        if (story.docsOnly) {
          docsCount++;
        } else {
          storyCount++;
          if (story.variants) {
            variantCount += story.variants.length;
          }
        }
      });
      return {
        storyCount,
        variantCount,
        docsCount
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("img", {
          src: logoUrl.value,
          alt: "Logo",
          class: "htw-w-64 htw-h-64 htw-opacity-25 htw-mb-8 htw-hidden md:htw-block"
        }, null, 8, _hoisted_2),
        createBaseVNode("div", _hoisted_3, [
          createVNode(_sfc_main$1, {
            title: "Stories",
            icon: "carbon:cube",
            count: stats.value.storyCount
          }, null, 8, ["count"]),
          createVNode(_sfc_main$1, {
            title: "Variants",
            icon: "carbon:cube-view",
            count: stats.value.variantCount
          }, null, 8, ["count"]),
          createVNode(_sfc_main$1, {
            title: "Documents",
            icon: "carbon:document-blank",
            count: stats.value.docsCount
          }, null, 8, ["count"])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
