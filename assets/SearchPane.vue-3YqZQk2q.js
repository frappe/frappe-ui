const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/search-docs-data-BvImgbcF.js","assets/vendor-CrekBpjO.js"])))=>i.map(i=>d[i]);
import { r as ref, k as watch, c as computed, d as defineComponent, o as openBlock, b as createElementBlock, a6 as renderSlot, n as normalizeClass, m as withKeys, q as createBlock, g as unref, I as Icon, e as createVNode, f as createBaseVNode, D as createTextVNode, t as toDisplayString, F as Fragment, p as renderList, h as createCommentVNode, u as useCssVars, aj as toRefs, ak as useRouter, w as withCtx, a2 as markRaw, d6 as useFocus, d7 as refDebounced, B as withDirectives, ad as vModelText, ac as withModifiers, _ as __vitePreload, d8 as flexsearch_bundleExports } from "./vendor-CrekBpjO.js";
import { u as useStoryStore } from "./story-Ce3cknc1.js";
import { B as BaseEmpty } from "./BaseEmpty.vue-B19vN1cG.js";
import "./GenericMountStory.vue2-8sGP2GFM.js";
import { o as onKeyboardShortcut, u as useCommandStore } from "./bundle-main-B_EeLqNP.js";
import { _ as _export_sfc, u as useScrollOnActive, B as BaseListItemLink } from "./MobileOverlay.vue2-CYxiG2SL.js";
function pipeline(a, b, c, d) {
  if (a && (b && (a = replace(a, b)), this.matcher && (a = replace(a, this.matcher)), this.stemmer && 1 < a.length && (a = replace(a, this.stemmer)), d && 1 < a.length && (a = collapse(a)), c || "" === c)) {
    const b2 = a.split(c);
    return this.filter ? filter$1(b2, this.filter) : b2;
  }
  return a;
}
const regex_whitespace = /[\p{Z}\p{S}\p{P}\p{C}]+/u;
const regex_normalize = /[\u0300-\u036f]/g;
function normalize(a) {
  return a.normalize && (a = a.normalize("NFD").replace(regex_normalize, "")), a;
}
function replace(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), !!a); c += 2)
    ;
  return a;
}
function regex(a) {
  return new RegExp(a, "g");
}
function collapse(a) {
  let b = "", c = "";
  for (let d, e = 0, f = a.length; e < f; e++)
    (d = a[e]) !== c && (b += c = d);
  return b;
}
function filter$1(a, b) {
  const c = a.length, d = [];
  for (let e = 0, f = 0; e < c; e++) {
    const c2 = a[e];
    c2 && !b[c2] && (d[f++] = c2);
  }
  return d;
}
const regex_a = regex("[àáâãäå]"), regex_e = regex("[èéêë]"), regex_i = regex("[ìíîï]"), regex_o = regex("[òóôõöő]"), regex_u = regex("[ùúûüű]"), regex_y = regex("[ýŷÿ]"), regex_n = regex("ñ"), regex_c = regex("[çc]"), regex_s = regex("ß"), regex_and = regex(" & "), pairs$1 = [regex_a, "a", regex_e, "e", regex_i, "i", regex_o, "o", regex_u, "u", regex_y, "y", regex_n, "n", regex_c, "k", regex_s, "s", regex_and, " and "];
function encode$2(a) {
  return a = "" + a, pipeline.call(this, normalize(a).toLowerCase(), !a.normalize && pairs$1, regex_whitespace, false);
}
const regex_strip = /[^a-z0-9]+/, soundex = { b: "p", v: "f", w: "f", z: "s", x: "s", ß: "s", d: "t", n: "m", c: "k", g: "k", j: "k", q: "k", i: "e", y: "e", u: "o" };
function encode$1(a) {
  a = encode$2.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(regex_strip), d = c.length;
    for (let e, f = 0, g = 0; f < d; f++)
      if ((a = c[f]) && (!this.filter || !this.filter[a])) {
        e = a[0];
        let c2 = soundex[e] || e, d2 = c2;
        for (let b2 = 1; b2 < a.length; b2++) {
          e = a[b2];
          const f2 = soundex[e] || e;
          f2 && f2 !== d2 && (c2 += f2, d2 = f2);
        }
        b[g++] = c2;
      }
  }
  return b;
}
const charset = { encode, rtl: false, tokenize: "" };
const regex_ae = regex("ae"), regex_oe = regex("oe"), regex_sh = regex("sh"), regex_th = regex("th"), regex_ph = regex("ph"), regex_pf = regex("pf"), pairs = [regex_ae, "a", regex_oe, "o", regex_sh, "s", regex_th, "t", regex_ph, "f", regex_pf, "f", regex("(?![aeo])h(?![aeo])"), "", regex("(?!^[aeo])h(?!^[aeo])"), ""];
function encode(a, b) {
  return a && (a = encode$1.call(this, a).join(" "), 2 < a.length && (a = replace(a, pairs)), !b && (1 < a.length && (a = collapse(a)), a && (a = a.split(" ")))), a;
}
const filter = ["a", "about", "above", "after", "again", "against", "all", "also", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "both", "but", "by", "can", "cannot", "can't", "come", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "dont", "down", "during", "each", "even", "few", "first", "for", "from", "further", "get", "go", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "hed", "her", "here", "here's", "hers", "herself", "hes", "him", "himself", "his", "how", "how's", "i", "id", "if", "ill", "im", "in", "into", "is", "isn't", "it", "it's", "itself", "i've", "just", "know", "let's", "like", "make", "me", "more", "most", "mustn't", "my", "myself", "new", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "our's", "ourselves", "out", "over", "own", "same", "say", "see", "shan't", "she", "she'd", "shell", "shes", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "time", "to", "too", "until", "up", "us", "very", "want", "was", "wasn't", "way", "we", "wed", "well", "were", "weren't", "we've", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "whom", "who's", "why", "why's", "will", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "your", "you're", "your's", "yourself", "yourselves", "you've"];
const stemmer = { ational: "ate", iveness: "ive", fulness: "ful", ousness: "ous", ization: "ize", tional: "tion", biliti: "ble", icate: "ic", ative: "", alize: "al", iciti: "ic", entli: "ent", ousli: "ous", alism: "al", ation: "ate", aliti: "al", iviti: "ive", ement: "", enci: "ence", anci: "ance", izer: "ize", alli: "al", ator: "ate", logi: "log", ical: "ic", ance: "", ence: "", ness: "", able: "", ible: "", ment: "", eli: "e", bli: "ble", ful: "", ant: "", ent: "", ism: "", ate: "", iti: "", ous: "", ive: "", ize: "", al: "", ou: "", er: "", ic: "" };
const matcher = {};
const language = { filter, stemmer, matcher };
function useSelection(list) {
  const selectedIndex = ref(0);
  watch(list, () => {
    selectedIndex.value = 0;
  });
  function selectNext() {
    selectedIndex.value++;
    if (selectedIndex.value > list.value.length - 1) {
      selectedIndex.value = 0;
    }
  }
  function selectPrevious() {
    selectedIndex.value--;
    if (selectedIndex.value < 0) {
      selectedIndex.value = list.value.length - 1;
    }
  }
  return {
    selectedIndex: computed(() => selectedIndex.value),
    selectNext,
    selectPrevious
  };
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "BaseListItem",
  props: {
    isActive: { type: Boolean }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function handleNavigate() {
      emit("navigate");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: normalizeClass(["istoire-base-list-ite htw-flex htw-items-center htw-gap-2 htw-text-gray-900 dark:htw-text-gray-100", [
          _ctx.$attrs.class,
          _ctx.isActive ? "active htw-bg-primary-500 hover:htw-bg-primary-600 htw-text-white dark:htw-text-black" : "hover:htw-bg-primary-100 dark:hover:htw-bg-primary-900"
        ]]),
        onClick: _cache[0] || (_cache[0] = ($event) => handleNavigate()),
        onKeyup: [
          _cache[1] || (_cache[1] = withKeys(($event) => handleNavigate(), ["enter"])),
          _cache[2] || (_cache[2] = withKeys(($event) => handleNavigate(), ["space"]))
        ]
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
const _hoisted_1$3 = ["src", "alt"];
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BaseIcon",
  props: {
    icon: {}
  },
  setup(__props) {
    const props = __props;
    const isUrl = computed(() => props.icon.startsWith("http") || props.icon.startsWith("data:image") || props.icon.startsWith(".") || props.icon.startsWith("/"));
    return (_ctx, _cache) => {
      return isUrl.value ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: _ctx.icon,
        alt: _ctx.icon,
        class: "histoire-base-icon"
      }, null, 8, _hoisted_1$3)) : (openBlock(), createBlock(unref(Icon), {
        key: 1,
        icon: _ctx.icon,
        class: "histoire-base-icon"
      }, null, 8, ["icon"]));
    };
  }
});
const BaseIcon = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-2114f510"]]);
const _hoisted_1$2 = { class: "htw-flex-1" };
const _hoisted_2 = { class: "htw-flex" };
const _hoisted_3 = { class: "htw-ml-auto htw-opacity-40" };
const _hoisted_4 = {
  key: 0,
  class: "htw-flex htw-items-center htw-gap-0.5 htw-opacity-60"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SearchItemContent",
  props: {
    result: {},
    selected: { type: Boolean }
  },
  setup(__props) {
    const defaultIcons = {
      story: "carbon:cube",
      variant: "carbon:cube"
    };
    const kindLabels = {
      story: "Story",
      variant: "Variant",
      command: "Command"
    };
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(BaseIcon, {
          icon: _ctx.result.icon ?? defaultIcons[_ctx.result.kind],
          class: normalizeClass(["htw-w-4 htw-h-4", [
            !_ctx.selected ? [
              _ctx.result.iconColor ? "bind-icon-color" : {
                "htw-text-primary-500": _ctx.result.kind === "story",
                "htw-text-gray-500": _ctx.result.kind === "variant"
              }
            ] : [],
            {
              "colorize-black": _ctx.selected
            }
          ]])
        }, null, 8, ["icon", "class"]),
        createBaseVNode("div", _hoisted_1$2, [
          createBaseVNode("div", _hoisted_2, [
            createTextVNode(toDisplayString(_ctx.result.title) + " ", 1),
            createBaseVNode("span", _hoisted_3, toDisplayString(kindLabels[_ctx.result.kind]), 1)
          ]),
          ((_a = _ctx.result.path) == null ? void 0 : _a.length) ? (openBlock(), createElementBlock("div", _hoisted_4, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.result.path, (p, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: "htw-flex htw-items-center htw-gap-0.5"
              }, [
                index > 0 ? (openBlock(), createBlock(unref(Icon), {
                  key: 0,
                  icon: "carbon:chevron-right",
                  class: "htw-w-4 htw-h-4 htw-mt-0.5 htw-opacity-50"
                })) : createCommentVNode("", true),
                createBaseVNode("span", null, toDisplayString(p), 1)
              ]);
            }), 128))
          ])) : createCommentVNode("", true)
        ])
      ], 64);
    };
  }
});
const _hoisted_1$1 = ["data-selected"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SearchItem",
  props: {
    result: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: () => true
  },
  setup(__props, { emit: __emit }) {
    useCssVars((_ctx) => ({
      "ddaae392": __props.result.iconColor
    }));
    const props = __props;
    const emit = __emit;
    const el = ref();
    const { selected } = toRefs(props);
    useScrollOnActive(selected, el);
    const router = useRouter();
    onKeyboardShortcut(["enter"], () => {
      if (!props.selected)
        return;
      action();
    });
    function action(fromClick = false) {
      if ("route" in props.result && !fromClick) {
        router.push(props.result.route);
      }
      if ("onActivate" in props.result) {
        props.result.onActivate();
      }
      emit("close");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el,
        class: "histoire-search-item",
        "data-test-id": "search-item",
        "data-selected": unref(selected) ? "" : void 0
      }, [
        "route" in __props.result ? (openBlock(), createBlock(BaseListItemLink, {
          key: 0,
          to: __props.result.route,
          "is-active": unref(selected),
          class: "htw-px-6 htw-py-4 htw-gap-4",
          onNavigate: _cache[0] || (_cache[0] = ($event) => action(true))
        }, {
          default: withCtx(() => [
            createVNode(_sfc_main$2, {
              result: __props.result,
              selected: unref(selected)
            }, null, 8, ["result", "selected"])
          ]),
          _: 1
        }, 8, ["to", "is-active"])) : createCommentVNode("", true),
        "onActivate" in __props.result ? (openBlock(), createBlock(_sfc_main$4, {
          key: 1,
          "is-active": unref(selected),
          class: "htw-px-6 htw-py-4 htw-gap-4",
          onNavigate: _cache[1] || (_cache[1] = ($event) => action(true))
        }, {
          default: withCtx(() => [
            createVNode(_sfc_main$2, {
              result: __props.result,
              selected: unref(selected)
            }, null, 8, ["result", "selected"])
          ]),
          _: 1
        }, 8, ["is-active"])) : createCommentVNode("", true)
      ], 8, _hoisted_1$1);
    };
  }
});
const SearchItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d75a2748"]]);
let searchData$1 = { "index": { "reg": '{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":1,"16":1,"17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":1,"25":1,"26":1,"27":1,"28":1,"29":1,"30":1,"31":1,"32":1,"33":1,"34":1,"35":1,"36":1,"37":1,"38":1,"39":1,"40":1,"41":1,"42":1,"43":1,"44":1,"45":1,"46":1,"47":1,"48":1,"49":1,"50":1,"51":1,"52":1,"53":1,"54":1,"55":1,"56":1,"57":1,"58":1,"59":1,"60":1,"61":1,"62":1,"63":1,"64":1,"65":1,"66":1,"67":1,"68":1,"69":1,"70":1,"71":1,"72":1,"73":1,"74":1,"75":1,"76":1,"77":1,"78":1,"79":1,"80":1,"81":1,"82":1,"83":1,"84":1,"85":1,"86":1,"87":1,"88":1,"89":1,"90":1,"91":1,"92":1,"93":1,"94":1,"95":1,"96":1,"97":1,"98":1,"99":1,"100":1,"101":1,"102":1,"103":1,"104":1,"105":1,"106":1,"107":1,"108":1,"109":1,"110":1,"111":1,"112":1,"113":1,"114":1,"115":1,"116":1,"117":1,"118":1,"119":1,"120":1,"121":1,"122":1,"123":1,"124":1,"125":1,"126":1,"127":1,"128":1,"129":1,"130":1,"131":1,"132":1,"133":1,"134":1,"135":1,"136":1,"137":1,"138":1,"139":1,"140":1,"141":1,"142":1,"143":1,"144":1,"145":1,"146":1,"147":1,"148":1,"149":1,"150":1,"151":1,"152":1,"153":1,"154":1,"155":1,"156":1}', "text.cfg": '{"doc":0,"opt":1}', "text.map": '[{"a":[0,1,2,3,4,5,6,7,8,9,10],"ao":[0,1,2,3,4,5],"aot":[0,1,2,3,4,5],"aoto":[0,1,2,3,4,5],"aotok":[0,1,2,3,4,5],"aotoko":[0,1,2,3,4,5],"aotokom":[0,1,2,3,4,5],"aotokomp":[0,1,2,3,4,5],"aotokompl":[0,1,2,3,4,5],"aotokomple":[0,1,2,3,4,5],"aotokomplet":[0,1,2,3,4,5],"aotokomplete":[0,1,2,3,4,5],"af":[6,7,8,9,10],"afa":[6,7,8,9,10],"afat":[6,7,8,9,10],"afata":[6,7,8,9,10],"afatar":[6,7,8,9,10],"p":[11,12,13,14,15,16,17,18,19,60,61,62,63,64,65,66,94,95,96,97,98],"pa":[11,12,13,14,15],"pat":[11,12,13,14,15],"patk":[11,12,13,14,15],"patke":[11,12,13,14,15],"pr":[16,17,18,19,63,64,65,66],"pre":[16,17,18,19],"prea":[16,17,18,19],"preat":[16,17,18,19],"preatk":[16,17,18,19],"preatkr":[16,17,18,19],"preatkro":[16,17,18,19],"preatkrom":[16,17,18,19],"preatkromp":[16,17,18,19],"preatkromps":[16,17,18,19],"k":[20,21,22,23,24,25,26,27,28,29,30,31,32,99,100,101,102,103,104,105,106,107,133],"ka":[20,21,22,23,99,100,101,102,103,104,105,106,107],"kal":[20,21,22,23],"kale":[20,21,22,23],"kalem":[20,21,22,23],"kalemt":[20,21,22,23],"kalemta":[20,21,22,23],"kalemtar":[20,21,22,23],"ke":[24,25,26,27,28,29,30,31,32,133],"kek":[24,25],"kekp":[24,25],"kekpo":[24,25],"kekpos":[24,25],"ker":[26,27,28,29,30,31,32],"kerk":[26,27,28,29,30,31,32],"kerko":[26,27,28,29,30,31,32],"kerkol":[26,27,28,29,30,31,32],"kerkola":[26,27,28,29,30,31,32],"kerkolar":[26,27,28,29,30,31,32],"t":[33,34,35,36,37,38,39,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,108,109,110,111,120,121,122,123,124,125,126,127,128,129,130,131,132,135,137,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156],"te":[33,34,35,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,124,125,126,135],"tea":[33,34,35],"teal":[33,34,35],"tealo":[33,34,35],"tealok":[33,34,35],"tr":[36,37,38,39,131,132],"tro":[36,37,38,39],"trop":[36,37,38,39],"tropt":[36,37,38,39],"tropto":[36,37,38,39],"troptof":[36,37,38,39],"troptofm":[36,37,38,39],"e":[40,41,42,43,134],"er":[40,41,42,43],"ero":[40,41,42,43],"eror":[40,41,42,43],"f":[44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],"fe":[44,45],"fel":[44,45],"fele":[44,45],"fo":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"for":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"form":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"po":[60,61,62,94,95,96,97,98],"pop":[60,61,62],"popo":[60,61,62],"popof":[60,61,62],"popofe":[60,61,62],"popofer":[60,61,62],"pro":[63,64,65,66],"prok":[63,64,65,66],"prokr":[63,64,65,66],"prokre":[63,64,65,66],"prokres":[63,64,65,66],"s":[67,68,69,70,71,72,73,74],"se":[67,68],"sel":[67,68],"sele":[67,68],"selek":[67,68],"selekt":[67,68],"sp":[69,70,71],"spe":[69,70,71],"spem":[69,70,71],"speme":[69,70,71],"spemer":[69,70,71],"sf":[72,73,74],"sfe":[72,73,74],"sfet":[72,73,74],"sfetk":[72,73,74],"ta":[75,76,108,109,110,111,120,121,122,123,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156],"tap":[75,76,120,121,122,123],"tes":[77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,124,125,126],"test":[77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,124,125,126],"testa":[91,92,93],"testar":[91,92,93],"testare":[91,92,93],"testarea":[91,92,93],"pot":[94,95,96,97,98],"poto":[94,95,96,97,98],"potom":[94,95,96,97,98],"kar":[99,100,101,102,103,104,105,106,107],"kart":[99,100,101,102,103,104,105,106,107],"karts":[99,100,101,102,103,104,105,106,107],"tat":[108,109,110,111],"tate":[108,109,110,111],"l":[112,113,114,115,116,117,138],"le":[112,113,114,115,116,117,138],"les":[112,113,114,115,116,117,138],"lest":[112,113,114,115,116,117,138],"r":[118,119,139],"ra":[118,119],"rat":[118,119],"rate":[118,119],"ratem":[118,119],"ratemk":[118,119],"taps":[120,121,122,123],"to":[127,128,129,130,137],"tol":[127,128,129,130],"tolt":[127,128,129,130],"tolte":[127,128,129,130],"toltep":[127,128,129,130],"tre":[131,132],"ket":[133],"kete":[133],"ketem":[133],"ketemk":[133],"em":[134],"emt":[134],"emtr":[134],"emtro":[134],"emtrot":[134],"emtroto":[134],"emtrotok":[134],"emtrotokt":[134],"emtrotokte":[134],"emtrotokteo":[134],"emtrotokteom":[134],"ter":[135],"tere":[135],"terek":[135],"terekt":[135],"terekte":[135],"terektef":[135],"terektefe":[135],"terektefes":[135],"o":[136],"ot":[136],"ote":[136],"otel":[136],"otele":[136],"otelet":[136],"otelete":[136],"oteletes":[136],"tok":[137],"toko":[137],"tokom":[137],"tokome":[137],"tokomem":[137],"tokomemt":[137],"re":[139],"res":[139],"reso":[139],"resor":[139],"resork":[139],"resorke":[139],"tal":[140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156],"talf":[140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156],"talfe":[140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156],"talfem":[140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156],"talfemt":[140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156]},{"s":[1,2,3,8,10,12,13,92,95,96,101,102,133],"se":[1,2,3,101],"sem":[1,2,3,101],"semk":[1,2,3],"semkl":[1,2,3],"semkle":[1,2,3],"m":[4,5,40,41,42,43,100,145],"mo":[4,5,100],"mol":[4,5],"molt":[4,5],"molte":[4,5],"moltep":[4,5],"moltepl":[4,5],"molteple":[4,5],"k":[7,9,15,39,46,47,48,49,50,51,52,53,54,55,56,57,58,59,70,71,98],"ke":[7,9],"ker":[7,9],"kerk":[7,9],"kerkl":[7,9],"kerkle":[7,9],"sk":[8,10],"sko":[8,10],"skoa":[8,10],"skoar":[8,10],"skoare":[8,10],"so":[12,13,92,95,96],"sol":[12,95],"sole":[12,95],"solet":[12,95],"sop":[13,92,96],"sopt":[13,92,96],"soptl":[13,92,96],"soptle":[13,92,96],"o":[14,44,45,93,97,104],"ot":[14,93,97],"otl":[14,93,97],"otle":[14,93,97],"otlem":[14,93,97],"otleme":[14,93,97],"ko":[15,22,23,39,46,47,48,49,50,51,52,53,54,55,56,57,58,59,98],"kos":[15,22,23,39,98],"kost":[15,22,23,39,98],"f":[17,18,19,34,35,107,112,113,114,115,116,117,121,122,123,128,130,146,147,148,154,156],"fe":[17,18,19,34,35,112,113,114,115,116,117,121,122,123,128,130,154],"fet":[17,18,19,34,35,121,122,128,130,154],"t":[21,25,61,62,68,106,119],"te":[21,25,68,119,129,132,142],"tef":[21,25,68,119,132],"tefa":[21,25,68,119,132],"tefao":[21,25,68,119,132],"tefaol":[21,25,68,119,132],"tefaolt":[21,25,68,119,132],"kosto":[22,23,39],"kostom":[22,23,39],"p":[26,27,28,29,30,31,32,37,38,75,76,103,108,109,110,111,141,143,144,152,153],"pr":[26,27,28,29,30,31,32],"pro":[26,27,28,29,30,31,32],"prok":[26,27,28,29,30,31,32],"prokr":[26,27,28,29,30,31,32],"prokre":[26,27,28,29,30,31,32],"prokres":[26,27,28,29,30,31,32],"pa":[37,103,141,144],"pas":[37],"pase":[37],"pasek":[37],"po":[38,75,76,143,152,153],"pot":[38,75,76],"poto":[38,75,76],"potom":[38,75,76],"me":[40,41,42,43],"mes":[40,41,42,43],"mesa":[40,41,42,43],"mesak":[40,41,42,43],"mesake":[40,41,42,43],"op":[44,45],"opl":[44,45],"oplo":[44,45],"oploa":[44,45],"oploat":[44,45],"oploate":[44,45],"oploater":[44,45],"kom":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"komt":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"komtr":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"komtro":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"komtrol":[46,47,48,49,50,51,52,53,54,55,56,57,58,59],"tr":[61,62,151],"tre":[61,62],"trek":[61,62],"treke":[61,62],"treker":[61,62],"l":[64,73,74,149,150],"la":[64,73,74],"lap":[64,73,74],"lape":[64,73,74],"lapel":[64,73,74],"e":[65,66,77,78,79,80,81,82,83,84,85,86,87,88,89,90,124,125,126,155],"em":[65,66,77,78,79,80,81,82,83,84,85,86,87,88,89,90],"emt":[65,66],"emte":[66],"emter":[66],"emterf":[66],"emterfa":[66],"emterfal":[66],"emterfals":[66],"kl":[70,71],"kla":[70,71],"klas":[70,71],"potoms":[75,76],"emp":[77,78,79,80,81,82,83,84,85,86,87,88,89,90],"empo":[77,78,79,80,81,82,83,84,85,86,87,88,89,90],"empot":[77,78,79,80,81,82,83,84,85,86,87,88,89,90],"mom":[100],"momp":[100],"mompe":[100],"momper":[100],"semp":[101],"sempl":[101],"semple":[101],"st":[102,133],"sta":[102,133],"stak":[102],"stake":[102],"staket":[102],"par":[103],"or":[104],"ore":[104],"ores":[104],"oreso":[104],"oresom":[104],"oresomt":[104],"oresomta":[104],"oresomtal":[104],"a":[105],"ar":[105],"are":[105],"area":[105],"to":[106],"tom":[106],"tomo":[106],"tomot":[106],"fo":[107,146,147,148,156],"fom":[107,146,147,148],"fome":[107],"fomel":[107],"pe":[108,109,110,111],"pek":[108,109,110,111],"peke":[108,109,110,111],"peker":[108,109,110,111],"fef":[112,113,114,115,116,117],"feto":[121],"fetot":[121],"fer":[123],"fert":[123],"ferte":[123],"fertek":[123],"ferteka":[123],"fertekal":[123],"et":[124,125,126],"ete":[124,125,126],"etet":[124,125,126],"eteto":[124,125,126],"etetor":[124,125,126],"tes":[129,142],"tesa":[129],"tesap":[129],"tesapl":[129],"tesaple":[129],"tesaplet":[129],"star":[133],"start":[133],"starte":[133],"startet":[133],"r":[137,138],"re":[137,138],"res":[137,138],"reso":[137,138],"resor":[137,138],"resork":[137,138],"resorke":[137,138],"pak":[141],"pakr":[141],"pakro":[141],"pakrom":[141],"pakromt":[141],"test":[142],"por":[143,152,153],"port":[143,152,153],"porte":[143,152,153],"porter":[143,152,153],"pat":[144],"pate":[144],"patem":[144],"patemk":[144],"ma":[145],"mar":[145],"mark":[145],"marke":[145],"markem":[145],"fomt":[146,147,148],"le":[149,150],"let":[149],"lete":[149],"leter":[149],"lem":[150],"leme":[150],"tro":[151],"trop":[151],"ek":[155],"ekt":[155],"fol":[156]},{"o":[1,2,3,4,5,18,34,62,87],"op":[1,2,3,4,5,34],"opt":[1,2,3,4,5,34],"opte":[1,2,3,4,5,34],"opteo":[1,2,3,4,5,34],"opteom":[1,2,3,4,5,34],"opteoms":[4,5,34],"r":[17,152],"ro":[17],"rot":[17],"rote":[17],"om":[18],"pref":[19,57,59,88,90],"prefe":[19,57,59,88,90],"prefes":[19,57,59,88,90],"e":[22,49,117,121,122,150],"ea":[22],"eat":[22],"eate":[22],"eater":[22],"kl":[23,61],"kle":[23,61],"klek":[23,61],"pa":[26,27,28,29,30,31,32,51,83,101,102,104,125],"par":[26,27,28,29,30,31,32,101,102,104],"s":[35,41,52,54,58,84,89,113,130,146,149,151],"sl":[35,130],"slo":[35,130],"slot":[35,130],"slots":[35],"pr":[38,57,59,88,90],"pro":[38],"prop":[38],"p":[39,51,57,59,83,88,90,101,102,104,125],"po":[39],"pot":[39],"poto":[39],"potom":[39],"st":[41],"str":[41],"stre":[41],"strem":[41],"stremk":[41],"f":[43,70,71,92,93,153],"fa":[43,92,93,148],"fal":[43],"fals":[43],"false":[43],"t":[45,47,50,53],"te":[45,47,53,128],"tef":[45],"tefa":[45],"tefao":[45],"tefaol":[45],"tefaolt":[45],"tes":[47,53,128],"test":[47,53,128],"m":[48,79],"mo":[48,79],"mom":[48,79],"momp":[48,79],"mompe":[48,79],"momper":[48,79],"em":[49,117],"ema":[49,80],"emal":[49,80],"ta":[50,81,82],"tat":[50,81,82],"tate":[50,81,82],"pas":[51,83,125],"pasf":[51,83],"pasfo":[51,83],"pasfor":[51,83],"pasfort":[51,83],"se":[52,54,84,113,146],"sea":[52,84],"sear":[52,84],"seark":[52,84],"testa":[53],"testar":[53],"testare":[53],"testarea":[53],"sel":[54],"sele":[54],"selek":[54],"selekt":[54],"a":[55,74,103],"ao":[55],"aot":[55],"aoto":[55],"aotok":[55],"aotoko":[55],"aotokom":[55],"aotokomp":[55],"aotokompl":[55],"aotokomple":[55],"aotokomplet":[55],"aotokomplete":[55],"ke":[56,116],"kek":[56],"kekp":[56],"kekpo":[56],"kekpos":[56],"pre":[57,59,88,90],"so":[58,89],"sof":[58,89],"sofe":[58,89],"sofes":[58,89],"k":[61,114,115,116,126,141,142,143,156],"of":[62],"ofe":[62],"ofer":[62],"am":[74,103],"amt":[74,103],"tatet":[82],"tatete":[82],"tatetem":[82],"tateteme":[82],"tel":[85],"tem":[86],"teme":[86],"or":[87],"orl":[87],"far":[92,93],"fare":[92,93],"farea":[92,93],"faream":[92,93],"fareamt":[92,93],"sem":[113],"semp":[113],"sempl":[113],"semple":[113],"ko":[114,126,141,142,143,156],"kos":[114],"kost":[114],"kosto":[114],"kostom":[114],"kr":[115],"kro":[115],"krop":[115],"krope":[115],"kropet":[115],"kel":[116],"emp":[117],"empt":[117],"empte":[117],"ek":[121,122,150],"eko":[121,122],"ekom":[121,122],"pase":[125],"pasek":[125],"kom":[126,156],"kome":[126],"komem":[126],"komemt":[126],"kol":[141,142,143],"kolo":[141,142,143],"kolor":[141,142,143],"ses":[146],"sese":[146],"fe":[147,153],"fek":[147],"fekt":[147],"fam":[148],"fame":[148],"famel":[148],"famele":[148],"sp":[149],"spa":[149],"spak":[149],"spake":[149],"spakem":[149],"spakemk":[149],"ekt":[150],"sa":[151],"sat":[151],"sato":[151],"satof":[151],"ra":[152],"rat":[152],"rate":[152],"rateo":[152],"rateos":[152],"fet":[153],"komf":[156],"komfe":[156],"komfek":[156]},{"4":[70],"8":[71],"f":[2,3,5],"fe":[2,3,5],"fet":[2,3,5],"feto":[3,5],"fetot":[3,5],"o":[17,32,42],"op":[17,42],"opt":[17],"opte":[17],"opteo":[17],"opteom":[17],"k":[18],"kl":[18],"kle":[18],"klek":[18],"s":[19,28,31,57,59,88,90,116],"sl":[19,57,58,59,88,89,90,116],"slo":[19,57,58,59,88,89,90,116],"slot":[19,57,58,59,88,89,90,116],"e":[23],"ef":[23],"efe":[23],"efem":[23],"efemt":[23],"efemts":[23],"t":[27,29,74],"te":[27,29,74,110],"tef":[27],"tefa":[27],"tefao":[27],"tefaol":[27],"tefaolt":[27],"se":[28],"ses":[28],"sese":[28],"tem":[29,110],"teme":[29,110],"ko":[30],"kos":[30],"kost":[30],"kosto":[30],"kostom":[30],"so":[31],"sol":[31],"sole":[31],"solet":[31],"ot":[32],"otl":[32],"otle":[32],"otlem":[32],"otleme":[32],"a":[39],"am":[39],"amt":[39],"opk":[42],"opke":[42],"opkek":[42],"opkekt":[42],"falo":[43],"tes":[74],"tesk":[74],"teskr":[74],"teskre":[74],"teskrep":[74],"teskrept":[74],"teskrepte":[74],"teskrepteo":[74],"teskrepteom":[74],"l":[82,103],"lo":[82],"lok":[82],"loka":[82],"lokal":[82],"le":[103],"lem":[103],"leme":[103],"r":[111,115],"ra":[111],"ram":[111],"ramk":[111],"ramke":[111],"ro":[115],"rof":[115],"rofs":[115],"p":[128],"pr":[128],"pro":[128],"prop":[128]},{"p":[2],"pr":[2],"pre":[2],"pref":[2],"prefe":[2],"prefes":[2],"sea":[3,5],"sear":[3,5],"seark":[3,5],"s":[5],"se":[5],"op":[18],"opt":[18],"opte":[18],"opteo":[18],"opteom":[18],"t":[30],"te":[30],"tem":[30],"teme":[30],"f":[31,32],"fa":[31,32],"far":[31,32],"fare":[31,32],"farea":[31,32],"faream":[31,32],"fareamt":[31,32],"kr":[39],"kro":[39],"krop":[39],"krops":[39],"e":[57,58],"ek":[57,58,88,89],"eko":[57,58,88,89],"ekom":[57,58,88,89],"a":[59,90],"af":[59,90],"afa":[59,90],"afat":[59,90],"afata":[59,90],"afatar":[59,90],"ko":[103],"kom":[103],"komp":[103],"kompo":[103]},{"sl":[2],"slo":[2],"slot":[2],"slots":[2]},{},{},{}]', "text.ctx": "[{}]" }, "idMap": { "0": { "id": "src-components-autocomplete-story-vue", "kind": "story" }, "1": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-0", "kind": "variant" }, "2": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-1", "kind": "variant" }, "3": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-2", "kind": "variant" }, "4": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-3", "kind": "variant" }, "5": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-4", "kind": "variant" }, "6": { "id": "src-components-avatar-story-vue", "kind": "story" }, "7": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-0", "kind": "variant" }, "8": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-1", "kind": "variant" }, "9": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-2", "kind": "variant" }, "10": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-3", "kind": "variant" }, "11": { "id": "src-components-badge-story-vue", "kind": "story" }, "12": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-0", "kind": "variant" }, "13": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-1", "kind": "variant" }, "14": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-2", "kind": "variant" }, "15": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-3", "kind": "variant" }, "16": { "id": "src-components-breadcrumbs-story-vue", "kind": "story" }, "17": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-0", "kind": "variant" }, "18": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-1", "kind": "variant" }, "19": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-2", "kind": "variant" }, "20": { "id": "src-components-calendar-story-vue", "kind": "story" }, "21": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-0", "kind": "variant" }, "22": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-1", "kind": "variant" }, "23": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-2", "kind": "variant" }, "24": { "id": "src-components-checkbox-story-vue", "kind": "story" }, "25": { "id": "src-components-checkbox-story-vue:_default", "kind": "variant" }, "26": { "id": "src-components-circularprogressbar-story-vue", "kind": "story" }, "27": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-0", "kind": "variant" }, "28": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-1", "kind": "variant" }, "29": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-2", "kind": "variant" }, "30": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-3", "kind": "variant" }, "31": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-4", "kind": "variant" }, "32": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-5", "kind": "variant" }, "33": { "id": "src-components-dialog-story-vue", "kind": "story" }, "34": { "id": "src-components-dialog-story-vue:src-components-dialog-story-vue-0", "kind": "variant" }, "35": { "id": "src-components-dialog-story-vue:src-components-dialog-story-vue-1", "kind": "variant" }, "36": { "id": "src-components-dropdown-story-vue", "kind": "story" }, "37": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-0", "kind": "variant" }, "38": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-1", "kind": "variant" }, "39": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-2", "kind": "variant" }, "40": { "id": "src-components-errormessage-story-vue", "kind": "story" }, "41": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-0", "kind": "variant" }, "42": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-1", "kind": "variant" }, "43": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-2", "kind": "variant" }, "44": { "id": "src-components-fileuploader-story-vue", "kind": "story" }, "45": { "id": "src-components-fileuploader-story-vue:_default", "kind": "variant" }, "46": { "id": "src-components-formcontrol-story-vue", "kind": "story" }, "47": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-0", "kind": "variant" }, "48": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-1", "kind": "variant" }, "49": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-2", "kind": "variant" }, "50": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-3", "kind": "variant" }, "51": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-4", "kind": "variant" }, "52": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-5", "kind": "variant" }, "53": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-6", "kind": "variant" }, "54": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-7", "kind": "variant" }, "55": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-8", "kind": "variant" }, "56": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-9", "kind": "variant" }, "57": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-10", "kind": "variant" }, "58": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-11", "kind": "variant" }, "59": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-12", "kind": "variant" }, "60": { "id": "src-components-popover-story-vue", "kind": "story" }, "61": { "id": "src-components-popover-story-vue:src-components-popover-story-vue-0", "kind": "variant" }, "62": { "id": "src-components-popover-story-vue:src-components-popover-story-vue-1", "kind": "variant" }, "63": { "id": "src-components-progress-story-vue", "kind": "story" }, "64": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-0", "kind": "variant" }, "65": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-1", "kind": "variant" }, "66": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-2", "kind": "variant" }, "67": { "id": "src-components-select-story-vue", "kind": "story" }, "68": { "id": "src-components-select-story-vue:_default", "kind": "variant" }, "69": { "id": "src-components-spinner-story-vue", "kind": "story" }, "70": { "id": "src-components-spinner-story-vue:src-components-spinner-story-vue-0", "kind": "variant" }, "71": { "id": "src-components-spinner-story-vue:src-components-spinner-story-vue-1", "kind": "variant" }, "72": { "id": "src-components-switch-story-vue", "kind": "story" }, "73": { "id": "src-components-switch-story-vue:src-components-switch-story-vue-0", "kind": "variant" }, "74": { "id": "src-components-switch-story-vue:src-components-switch-story-vue-1", "kind": "variant" }, "75": { "id": "src-components-tabbuttons-story-vue", "kind": "story" }, "76": { "id": "src-components-tabbuttons-story-vue:src-components-tabbuttons-story-vue-0", "kind": "variant" }, "77": { "id": "src-components-textinput-story-vue", "kind": "story" }, "78": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-0", "kind": "variant" }, "79": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-1", "kind": "variant" }, "80": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-2", "kind": "variant" }, "81": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-3", "kind": "variant" }, "82": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-4", "kind": "variant" }, "83": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-5", "kind": "variant" }, "84": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-6", "kind": "variant" }, "85": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-7", "kind": "variant" }, "86": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-8", "kind": "variant" }, "87": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-9", "kind": "variant" }, "88": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-10", "kind": "variant" }, "89": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-11", "kind": "variant" }, "90": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-12", "kind": "variant" }, "91": { "id": "src-components-textarea-story-vue", "kind": "story" }, "92": { "id": "src-components-textarea-story-vue:src-components-textarea-story-vue-0", "kind": "variant" }, "93": { "id": "src-components-textarea-story-vue:src-components-textarea-story-vue-1", "kind": "variant" }, "94": { "id": "src-components-button-button-story-vue", "kind": "story" }, "95": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-0", "kind": "variant" }, "96": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-1", "kind": "variant" }, "97": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-2", "kind": "variant" }, "98": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-3", "kind": "variant" }, "99": { "id": "src-components-charts-charts-story-vue", "kind": "story" }, "100": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-0", "kind": "variant" }, "101": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-1", "kind": "variant" }, "102": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-2", "kind": "variant" }, "103": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-3", "kind": "variant" }, "104": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-4", "kind": "variant" }, "105": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-5", "kind": "variant" }, "106": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-6", "kind": "variant" }, "107": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-7", "kind": "variant" }, "108": { "id": "src-components-datepicker-datepicker-story-vue", "kind": "story" }, "109": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-0", "kind": "variant" }, "110": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-1", "kind": "variant" }, "111": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-2", "kind": "variant" }, "112": { "id": "src-components-listview-listview-story-vue", "kind": "story" }, "113": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-0", "kind": "variant" }, "114": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-1", "kind": "variant" }, "115": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-2", "kind": "variant" }, "116": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-3", "kind": "variant" }, "117": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-4", "kind": "variant" }, "118": { "id": "src-components-rating-rating-story-vue", "kind": "story" }, "119": { "id": "src-components-rating-rating-story-vue:src-components-rating-rating-story-vue-0", "kind": "variant" }, "120": { "id": "src-components-tabs-tabs-story-vue", "kind": "story" }, "121": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-0", "kind": "variant" }, "122": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-1", "kind": "variant" }, "123": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-2", "kind": "variant" }, "124": { "id": "src-components-texteditor-texteditor-story-vue", "kind": "story" }, "125": { "id": "src-components-texteditor-texteditor-story-vue:src-components-texteditor-texteditor-story-vue-0", "kind": "variant" }, "126": { "id": "src-components-texteditor-texteditor-story-vue:src-components-texteditor-texteditor-story-vue-1", "kind": "variant" }, "127": { "id": "src-components-tooltip-tooltip-story-vue", "kind": "story" }, "128": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-0", "kind": "variant" }, "129": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-1", "kind": "variant" }, "130": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-2", "kind": "variant" }, "131": { "id": "src-components-tree-tree-story-vue", "kind": "story" }, "132": { "id": "src-components-tree-tree-story-vue:src-components-tree-tree-story-vue-0", "kind": "variant" }, "133": { "id": "docs-getting-started-story-js", "kind": "story" }, "134": { "id": "docs-introduction-story-js", "kind": "story" }, "135": { "id": "docs-other-directives-story-js", "kind": "story" }, "136": { "id": "docs-other-utilities-story-js", "kind": "story" }, "137": { "id": "docs-resources-document-resource-story-js", "kind": "story" }, "138": { "id": "docs-resources-list-resource-story-js", "kind": "story" }, "139": { "id": "docs-resources-resource-story-js", "kind": "story" }, "140": { "id": "tailwind", "kind": "story" }, "141": { "id": "tailwind:background-color", "kind": "variant" }, "142": { "id": "tailwind:text-color", "kind": "variant" }, "143": { "id": "tailwind:border-color", "kind": "variant" }, "144": { "id": "tailwind:padding", "kind": "variant" }, "145": { "id": "tailwind:margin", "kind": "variant" }, "146": { "id": "tailwind:font-size", "kind": "variant" }, "147": { "id": "tailwind:font-weight", "kind": "variant" }, "148": { "id": "tailwind:font-family", "kind": "variant" }, "149": { "id": "tailwind:letter-spacing", "kind": "variant" }, "150": { "id": "tailwind:line-height", "kind": "variant" }, "151": { "id": "tailwind:drop-shadow", "kind": "variant" }, "152": { "id": "tailwind:border-radius", "kind": "variant" }, "153": { "id": "tailwind:border-width", "kind": "variant" }, "154": { "id": "tailwind:width", "kind": "variant" }, "155": { "id": "tailwind:height", "kind": "variant" }, "156": { "id": "tailwind:full-config", "kind": "variant" } } };
const searchData = markRaw(searchData$1);
const _hoisted_1 = {
  key: 1,
  class: "htw-max-h-[400px] htw-overflow-y-auto htw-rounded-b-lg"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchPane",
  props: {
    shown: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: () => true
  },
  setup(__props, { emit: __emit }) {
    const DocSearchData = () => __vitePreload(() => import("./search-docs-data-BvImgbcF.js"), true ? __vite__mapDeps([0,1]) : void 0);
    const props = __props;
    const emit = __emit;
    function close() {
      emit("close");
    }
    const input = ref();
    const { focused } = useFocus(input, {
      initialValue: true
    });
    watch(() => props.shown, (value) => {
      if (value) {
        requestAnimationFrame(() => {
          focused.value = true;
          input.value.select();
        });
      }
    });
    const searchInputText = ref("");
    const rateLimitedSearch = refDebounced(searchInputText, 50);
    const storyStore = useStoryStore();
    let titleSearchIndex;
    let titleIdMap;
    function createIndex() {
      return new flexsearch_bundleExports.Document({
        preset: "match",
        document: {
          id: "id",
          index: [
            "text"
          ]
        },
        worker: true,
        charset,
        language,
        tokenize: "forward"
      });
    }
    async function loadSearchIndex(data) {
      titleSearchIndex = createIndex();
      for (const key of Object.keys(data.index)) {
        await titleSearchIndex.import(key, data.index[key]);
      }
      titleIdMap = data.idMap;
    }
    loadSearchIndex(searchData);
    let docSearchIndex;
    let docIdMap;
    async function loadDocSearchIndex() {
      async function load(data) {
        docSearchIndex = createIndex();
        for (const key of Object.keys(data.index)) {
          await docSearchIndex.import(key, data.index[key]);
        }
        docIdMap = data.idMap;
        if (rateLimitedSearch.value) {
          searchOnDocField(rateLimitedSearch.value);
        }
      }
      const searchDataModule = await DocSearchData();
      load(searchDataModule.searchData);
      searchDataModule.onUpdate((searchData2) => {
        load(searchData2);
      });
    }
    loadDocSearchIndex();
    const titleResults = ref([]);
    watch(rateLimitedSearch, async (value) => {
      const list = [];
      const raw = await titleSearchIndex.search(value);
      let rank = 0;
      for (const field of raw) {
        for (const id of field.result) {
          const idMapData = titleIdMap[id];
          if (!idMapData)
            continue;
          switch (idMapData.kind) {
            case "story": {
              list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank));
              rank++;
              break;
            }
            case "variant": {
              const [storyId] = idMapData.id.split(":");
              const story = storyStore.getStoryById(storyId);
              const variant = storyStore.getVariantById(idMapData.id);
              list.push(variantResultFactory(story, variant, rank));
              rank++;
              break;
            }
          }
        }
      }
      titleResults.value = list;
    });
    const docsResults = ref([]);
    async function searchOnDocField(query) {
      if (docSearchIndex) {
        const list = [];
        const raw = await docSearchIndex.search(query);
        let rank = 0;
        for (const field of raw) {
          for (const id of field.result) {
            const idMapData = docIdMap[id];
            if (!idMapData)
              continue;
            switch (idMapData.kind) {
              case "story": {
                list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank, "docs"));
                rank++;
                break;
              }
            }
          }
        }
        docsResults.value = list;
      }
    }
    watch(rateLimitedSearch, searchOnDocField);
    function storyResultFactory(story, rank, type = "title") {
      return {
        kind: "story",
        rank,
        id: `story:${story.id}`,
        title: story.title,
        route: {
          name: "story",
          params: {
            storyId: story.id
          },
          query: {
            ...type === "docs" ? { tab: "docs" } : {}
          }
        },
        path: story.file.path.slice(0, -1),
        icon: story.icon,
        iconColor: story.iconColor
      };
    }
    function variantResultFactory(story, variant, rank, type = "title") {
      return {
        kind: "variant",
        rank,
        id: `variant:${story.id}:${variant.id}`,
        title: variant.title,
        route: {
          name: "story",
          params: {
            storyId: story.id
          },
          query: {
            variantId: variant.id,
            ...type === "docs" ? { tab: "docs" } : {}
          }
        },
        path: [...story.file.path ?? [], story.title],
        icon: variant.icon,
        iconColor: variant.iconColor
      };
    }
    const commandResults = computed(() => {
      return [];
    });
    useCommandStore();
    const results = computed(() => {
      const list = [
        ...commandResults.value,
        ...titleResults.value
      ];
      const seen = {};
      for (const r of titleResults.value) {
        seen[r.id] = true;
      }
      for (const r of docsResults.value) {
        if (!seen[r.id]) {
          list.push(r);
        }
      }
      return list;
    });
    const {
      selectedIndex,
      selectNext,
      selectPrevious
    } = useSelection(results);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          class: "histoire-search-pane htw-flex htw-items-center htw-gap-4 htw-pl-6 htw-border htw-border-transparent focus-visible:htw-border-primary-500",
          onClick: _cache[4] || (_cache[4] = ($event) => focused.value = true)
        }, [
          createVNode(unref(Icon), {
            icon: "carbon:search",
            class: "flex-none htw-w-4 htw-h-4"
          }),
          withDirectives(createBaseVNode("input", {
            ref_key: "input",
            ref: input,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchInputText.value = $event),
            placeholder: "Search for stories, variants...",
            class: "htw-bg-transparent htw-w-full htw-flex-1 htw-pl-0 htw-pr-6 htw-py-4 htw-outline-none",
            onKeydown: [
              _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => unref(selectNext)(), ["prevent"]), ["down"])),
              _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => unref(selectPrevious)(), ["prevent"]), ["up"])),
              _cache[3] || (_cache[3] = withKeys(($event) => close(), ["escape"]))
            ]
          }, null, 544), [
            [vModelText, searchInputText.value]
          ])
        ]),
        unref(rateLimitedSearch) && !results.value.length ? (openBlock(), createBlock(BaseEmpty, {
          key: 0,
          class: "no-animation"
        }, {
          default: withCtx(() => [
            createTextVNode(" No results ")
          ]),
          _: 1
        })) : results.value.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(results.value, (result, index) => {
            return openBlock(), createBlock(SearchItem, {
              key: result.id,
              result,
              selected: index === unref(selectedIndex),
              onClose: _cache[5] || (_cache[5] = ($event) => close())
            }, null, 8, ["result", "selected"]);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
