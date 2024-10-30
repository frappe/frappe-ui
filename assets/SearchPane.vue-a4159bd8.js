import { r as ref, k as watch, c as computed, d as defineComponent, o as openBlock, b as createElementBlock, a6 as renderSlot, n as normalizeClass, m as withKeys, q as createBlock, g as unref, I as Icon, e as createVNode, f as createBaseVNode, D as createTextVNode, t as toDisplayString, F as Fragment, p as renderList, h as createCommentVNode, u as useCssVars, aj as toRefs, ak as useRouter, w as withCtx, a2 as markRaw, cm as useFocus, cn as refDebounced, B as withDirectives, ad as vModelText, ac as withModifiers, _ as __vitePreload, co as flexsearch_bundleExports } from "./vendor-16a9e5ef.js";
import { u as useStoryStore } from "./story-7df30859.js";
import { B as BaseEmpty } from "./BaseEmpty.vue-a59f1553.js";
import "./GenericMountStory.vue2-393f4736.js";
import { o as onKeyboardShortcut, u as useCommandStore } from "./bundle-main-e7e8cf96.js";
import { _ as _export_sfc, u as useScrollOnActive, B as BaseListItemLink } from "./MobileOverlay.vue2-596f1d45.js";
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
let searchData$1 = { "index": { "reg": '{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":1,"16":1,"17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":1,"25":1,"26":1,"27":1,"28":1,"29":1,"30":1,"31":1,"32":1,"33":1,"34":1,"35":1,"36":1,"37":1,"38":1,"39":1,"40":1,"41":1,"42":1,"43":1,"44":1,"45":1,"46":1,"47":1,"48":1,"49":1,"50":1,"51":1,"52":1,"53":1,"54":1,"55":1,"56":1,"57":1,"58":1,"59":1,"60":1,"61":1,"62":1,"63":1,"64":1,"65":1,"66":1,"67":1,"68":1,"69":1,"70":1,"71":1,"72":1,"73":1,"74":1,"75":1,"76":1,"77":1,"78":1,"79":1,"80":1,"81":1,"82":1,"83":1,"84":1,"85":1,"86":1,"87":1,"88":1,"89":1,"90":1,"91":1,"92":1,"93":1,"94":1,"95":1,"96":1,"97":1,"98":1,"99":1,"100":1,"101":1,"102":1,"103":1,"104":1,"105":1,"106":1,"107":1,"108":1,"109":1,"110":1,"111":1,"112":1,"113":1,"114":1,"115":1,"116":1,"117":1,"118":1,"119":1,"120":1,"121":1,"122":1,"123":1,"124":1,"125":1,"126":1,"127":1,"128":1,"129":1,"130":1,"131":1,"132":1,"133":1,"134":1,"135":1,"136":1,"137":1,"138":1,"139":1,"140":1,"141":1}', "text.cfg": '{"doc":0,"opt":1}', "text.map": '[{"a":[0,1,2,3,4,5,6,7,8,9,10],"ao":[0,1,2,3,4,5],"aot":[0,1,2,3,4,5],"aoto":[0,1,2,3,4,5],"aotok":[0,1,2,3,4,5],"aotoko":[0,1,2,3,4,5],"aotokom":[0,1,2,3,4,5],"aotokomp":[0,1,2,3,4,5],"aotokompl":[0,1,2,3,4,5],"aotokomple":[0,1,2,3,4,5],"aotokomplet":[0,1,2,3,4,5],"aotokomplete":[0,1,2,3,4,5],"af":[6,7,8,9,10],"afa":[6,7,8,9,10],"afat":[6,7,8,9,10],"afata":[6,7,8,9,10],"afatar":[6,7,8,9,10],"p":[11,12,13,14,15,16,17,18,19,20,21,22,23,24,75,76,77,78,79,80,81],"pa":[11,12,13,14,15],"pat":[11,12,13,14,15],"patk":[11,12,13,14,15],"patke":[11,12,13,14,15],"pr":[16,17,18,19,78,79,80,81],"pre":[16,17,18,19],"prea":[16,17,18,19],"preat":[16,17,18,19],"preatk":[16,17,18,19],"preatkr":[16,17,18,19],"preatkro":[16,17,18,19],"preatkrom":[16,17,18,19],"preatkromp":[16,17,18,19],"preatkromps":[16,17,18,19],"po":[20,21,22,23,24,75,76,77],"pot":[20,21,22,23,24],"poto":[20,21,22,23,24],"potom":[20,21,22,23,24],"k":[25,26,27,28,29,30,31,32,33,34,35,36,37,118],"ka":[25,26,27,28],"kal":[25,26,27,28],"kale":[25,26,27,28],"kalem":[25,26,27,28],"kalemt":[25,26,27,28],"kalemta":[25,26,27,28],"kalemtar":[25,26,27,28],"ke":[29,30,31,32,33,34,35,36,37,118],"kek":[29,30],"kekp":[29,30],"kekpo":[29,30],"kekpos":[29,30],"ker":[31,32,33,34,35,36,37],"kerk":[31,32,33,34,35,36,37],"kerko":[31,32,33,34,35,36,37],"kerkol":[31,32,33,34,35,36,37],"kerkola":[31,32,33,34,35,36,37],"kerkolar":[31,32,33,34,35,36,37],"t":[38,39,40,41,42,43,44,45,46,47,48,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,112,113,114,115,116,117,120,122,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141],"ta":[38,39,40,41,90,91,92,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141],"tat":[38,39,40,41],"tate":[38,39,40,41],"te":[42,43,44,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,120],"tea":[42,43,44],"teal":[42,43,44],"tealo":[42,43,44],"tealok":[42,43,44],"tr":[45,46,47,48,116,117],"tro":[45,46,47,48],"trop":[45,46,47,48],"tropt":[45,46,47,48],"tropto":[45,46,47,48],"troptof":[45,46,47,48],"troptofm":[45,46,47,48],"e":[49,50,51,52,119],"er":[49,50,51,52],"ero":[49,50,51,52],"eror":[49,50,51,52],"f":[53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68],"fe":[53,54],"fel":[53,54],"fele":[53,54],"fo":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"for":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"form":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"l":[69,70,71,72,73,74,123],"le":[69,70,71,72,73,74,123],"les":[69,70,71,72,73,74,123],"lest":[69,70,71,72,73,74,123],"pop":[75,76,77],"popo":[75,76,77],"popof":[75,76,77],"popofe":[75,76,77],"popofer":[75,76,77],"pro":[78,79,80,81],"prok":[78,79,80,81],"prokr":[78,79,80,81],"prokre":[78,79,80,81],"prokres":[78,79,80,81],"s":[82,83,84,85,86,87,88,89],"se":[82,83],"sel":[82,83],"sele":[82,83],"selek":[82,83],"selekt":[82,83],"sp":[84,85,86],"spe":[84,85,86],"spem":[84,85,86],"speme":[84,85,86],"spemer":[84,85,86],"sf":[87,88,89],"sfe":[87,88,89],"sfet":[87,88,89],"sfetk":[87,88,89],"tap":[90,91,92],"taps":[90,91,92],"tes":[93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109],"test":[93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109],"testa":[107,108,109],"testar":[107,108,109],"testare":[107,108,109],"testarea":[107,108,109],"r":[110,111,124],"ra":[110,111],"rat":[110,111],"rate":[110,111],"ratem":[110,111],"ratemk":[110,111],"to":[112,113,114,115,122],"tol":[112,113,114,115],"tolt":[112,113,114,115],"tolte":[112,113,114,115],"toltep":[112,113,114,115],"tre":[116,117],"ket":[118],"kete":[118],"ketem":[118],"ketemk":[118],"em":[119],"emt":[119],"emtr":[119],"emtro":[119],"emtrot":[119],"emtroto":[119],"emtrotok":[119],"emtrotokt":[119],"emtrotokte":[119],"emtrotokteo":[119],"emtrotokteom":[119],"ter":[120],"tere":[120],"terek":[120],"terekt":[120],"terekte":[120],"terektef":[120],"terektefe":[120],"terektefes":[120],"o":[121],"ot":[121],"ote":[121],"otel":[121],"otele":[121],"otelet":[121],"otelete":[121],"oteletes":[121],"tok":[122],"toko":[122],"tokom":[122],"tokome":[122],"tokomem":[122],"tokomemt":[122],"re":[124],"res":[124],"reso":[124],"resor":[124],"resork":[124],"resorke":[124],"tal":[125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141],"talf":[125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141],"talfe":[125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141],"talfem":[125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141],"talfemt":[125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141]},{"s":[1,2,3,8,10,12,13,21,22,108,118],"se":[1,2,3],"sem":[1,2,3],"semk":[1,2,3],"semkl":[1,2,3],"semkle":[1,2,3],"m":[4,5,49,50,51,52,130],"mo":[4,5],"mol":[4,5],"molt":[4,5],"molte":[4,5],"moltep":[4,5],"moltepl":[4,5],"molteple":[4,5],"k":[7,9,15,24,48,55,56,57,58,59,60,61,62,63,64,65,66,67,68,85,86],"ke":[7,9],"ker":[7,9],"kerk":[7,9],"kerkl":[7,9],"kerkle":[7,9],"sk":[8,10],"sko":[8,10],"skoa":[8,10],"skoar":[8,10],"skoare":[8,10],"so":[12,13,21,22,108],"sol":[12,21],"sole":[12,21],"solet":[12,21],"sop":[13,22,108],"sopt":[13,22,108],"soptl":[13,22,108],"soptle":[13,22,108],"o":[14,23,53,54,109],"ot":[14,23,109],"otl":[14,23,109],"otle":[14,23,109],"otlem":[14,23,109],"otleme":[14,23,109],"ko":[15,24,27,28,48,55,56,57,58,59,60,61,62,63,64,65,66,67,68],"kos":[15,24,27,28,48],"kost":[15,24,27,28,48],"f":[17,18,19,43,44,69,70,71,72,73,74,91,92,113,115,131,132,133,139,141],"fe":[17,18,19,43,44,69,70,71,72,73,74,91,92,113,115,139],"fet":[17,18,19,43,44,91,92,113,115,139],"t":[26,30,76,77,83,111],"te":[26,30,83,111,114,117,127],"tef":[26,30,83,111,117],"tefa":[26,30,83,111,117],"tefao":[26,30,83,111,117],"tefaol":[26,30,83,111,117],"tefaolt":[26,30,83,111,117],"kosto":[27,28,48],"kostom":[27,28,48],"p":[31,32,33,34,35,36,37,38,39,40,41,46,47,126,128,129,137,138],"pr":[31,32,33,34,35,36,37],"pro":[31,32,33,34,35,36,37],"prok":[31,32,33,34,35,36,37],"prokr":[31,32,33,34,35,36,37],"prokre":[31,32,33,34,35,36,37],"prokres":[31,32,33,34,35,36,37],"pe":[38,39,40,41],"pek":[38,39,40,41],"peke":[38,39,40,41],"peker":[38,39,40,41],"pa":[46,126,129],"pas":[46],"pase":[46],"pasek":[46],"po":[47,128,137,138],"pot":[47],"poto":[47],"potom":[47],"me":[49,50,51,52],"mes":[49,50,51,52],"mesa":[49,50,51,52],"mesak":[49,50,51,52],"mesake":[49,50,51,52],"op":[53,54],"opl":[53,54],"oplo":[53,54],"oploa":[53,54],"oploat":[53,54],"oploate":[53,54],"oploater":[53,54],"kom":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"komt":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"komtr":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"komtro":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"komtrol":[55,56,57,58,59,60,61,62,63,64,65,66,67,68],"fef":[69,70,71,72,73,74],"tr":[76,77,136],"tre":[76,77],"trek":[76,77],"treke":[76,77],"treker":[76,77],"l":[79,88,89,134,135],"la":[79,88,89],"lap":[79,88,89],"lape":[79,88,89],"lapel":[79,88,89],"e":[80,81,93,94,95,96,97,98,99,100,101,102,103,104,105,106,140],"em":[80,81,93,94,95,96,97,98,99,100,101,102,103,104,105,106],"emt":[80,81],"emte":[81],"emter":[81],"emterf":[81],"emterfa":[81],"emterfal":[81],"emterfals":[81],"kl":[85,86],"kla":[85,86],"klas":[85,86],"feto":[91],"fetot":[91],"emp":[93,94,95,96,97,98,99,100,101,102,103,104,105,106],"empo":[93,94,95,96,97,98,99,100,101,102,103,104,105,106],"empot":[93,94,95,96,97,98,99,100,101,102,103,104,105,106],"tes":[114,127],"tesa":[114],"tesap":[114],"tesapl":[114],"tesaple":[114],"tesaplet":[114],"st":[118],"sta":[118],"star":[118],"start":[118],"starte":[118],"startet":[118],"r":[122,123],"re":[122,123],"res":[122,123],"reso":[122,123],"resor":[122,123],"resork":[122,123],"resorke":[122,123],"pak":[126],"pakr":[126],"pakro":[126],"pakrom":[126],"pakromt":[126],"test":[127],"por":[128,137,138],"port":[128,137,138],"porte":[128,137,138],"porter":[128,137,138],"pat":[129],"pate":[129],"patem":[129],"patemk":[129],"ma":[130],"mar":[130],"mark":[130],"marke":[130],"markem":[130],"fo":[131,132,133,141],"fom":[131,132,133],"fomt":[131,132,133],"le":[134,135],"let":[134],"lete":[134],"leter":[134],"lem":[135],"leme":[135],"tro":[136],"trop":[136],"ek":[140],"ekt":[140],"fol":[141]},{"o":[1,2,3,4,5,18,43,77,103],"op":[1,2,3,4,5,43],"opt":[1,2,3,4,5,43],"opte":[1,2,3,4,5,43],"opteo":[1,2,3,4,5,43],"opteom":[1,2,3,4,5,43],"opteoms":[4,5,43],"r":[17,137],"ro":[17],"rot":[17],"rote":[17],"om":[18],"pref":[19,66,68,104,106],"prefe":[19,66,68,104,106],"prefes":[19,66,68,104,106],"e":[27,58,74,91,92,135],"ea":[27],"eat":[27],"eate":[27],"eater":[27],"kl":[28,76],"kle":[28,76],"klek":[28,76],"pa":[31,32,33,34,35,36,37,60,99],"par":[31,32,33,34,35,36,37],"s":[44,50,61,63,67,70,100,105,115,131,134,136],"sl":[44,115],"slo":[44,115],"slot":[44,115],"slots":[44],"pr":[47,66,68,104,106],"pro":[47],"prop":[47],"p":[48,60,66,68,99,104,106],"po":[48],"pot":[48],"poto":[48],"potom":[48],"st":[50],"str":[50],"stre":[50],"strem":[50],"stremk":[50],"f":[52,85,86,108,109,138],"fa":[52,108,109,133],"fal":[52],"fals":[52],"false":[52],"t":[54,56,59,62],"te":[54,56,62,113],"tef":[54],"tefa":[54],"tefao":[54],"tefaol":[54],"tefaolt":[54],"tes":[56,62,113],"test":[56,62,113],"m":[57,95],"mo":[57,95],"mom":[57,95],"momp":[57,95],"mompe":[57,95],"momper":[57,95],"em":[58,74],"ema":[58,96],"emal":[58,96],"ta":[59,97,98],"tat":[59,97,98],"tate":[59,97,98],"pas":[60,99],"pasf":[60,99],"pasfo":[60,99],"pasfor":[60,99],"pasfort":[60,99],"se":[61,63,70,100,131],"sea":[61,100],"sear":[61,100],"seark":[61,100],"testa":[62],"testar":[62],"testare":[62],"testarea":[62],"sel":[63],"sele":[63],"selek":[63],"selekt":[63],"a":[64,89],"ao":[64],"aot":[64],"aoto":[64],"aotok":[64],"aotoko":[64],"aotokom":[64],"aotokomp":[64],"aotokompl":[64],"aotokomple":[64],"aotokomplet":[64],"aotokomplete":[64],"ke":[65,73],"kek":[65],"kekp":[65],"kekpo":[65],"kekpos":[65],"pre":[66,68,104,106],"so":[67,105],"sof":[67,105],"sofe":[67,105],"sofes":[67,105],"sem":[70],"semp":[70],"sempl":[70],"semple":[70],"k":[71,72,73,76,126,127,128,141],"ko":[71,126,127,128,141],"kos":[71],"kost":[71],"kosto":[71],"kostom":[71],"kr":[72],"kro":[72],"krop":[72],"krope":[72],"kropet":[72],"kel":[73],"emp":[74],"empt":[74],"empte":[74],"of":[77],"ofe":[77],"ofer":[77],"am":[89],"amt":[89],"ek":[91,92,135],"eko":[91,92],"ekom":[91,92],"tatet":[98],"tatete":[98],"tatetem":[98],"tateteme":[98],"tel":[101],"tem":[102],"teme":[102],"or":[103],"orl":[103],"far":[108,109],"fare":[108,109],"farea":[108,109],"faream":[108,109],"fareamt":[108,109],"kol":[126,127,128],"kolo":[126,127,128],"kolor":[126,127,128],"ses":[131],"sese":[131],"fe":[132,138],"fek":[132],"fekt":[132],"fam":[133],"fame":[133],"famel":[133],"famele":[133],"sp":[134],"spa":[134],"spak":[134],"spake":[134],"spakem":[134],"spakemk":[134],"ekt":[135],"sa":[136],"sat":[136],"sato":[136],"satof":[136],"ra":[137],"rat":[137],"rate":[137],"rateo":[137],"rateos":[137],"fet":[138],"kom":[141],"komf":[141],"komfe":[141],"komfek":[141]},{"4":[85],"8":[86],"f":[2,3,5],"fe":[2,3,5],"fet":[2,3,5],"feto":[3,5],"fetot":[3,5],"o":[17,37,51],"op":[17,51],"opt":[17],"opte":[17],"opteo":[17],"opteom":[17],"k":[18],"kl":[18],"kle":[18],"klek":[18],"s":[19,33,36,66,68,73,104,106],"sl":[19,66,67,68,73,104,105,106],"slo":[19,66,67,68,73,104,105,106],"slot":[19,66,67,68,73,104,105,106],"e":[28],"ef":[28],"efe":[28],"efem":[28],"efemt":[28],"efemts":[28],"t":[32,34,89],"te":[32,34,40,89],"tef":[32],"tefa":[32],"tefao":[32],"tefaol":[32],"tefaolt":[32],"se":[33],"ses":[33],"sese":[33],"tem":[34,40],"teme":[34,40],"ko":[35],"kos":[35],"kost":[35],"kosto":[35],"kostom":[35],"so":[36],"sol":[36],"sole":[36],"solet":[36],"ot":[37],"otl":[37],"otle":[37],"otlem":[37],"otleme":[37],"r":[41,72],"ra":[41],"ram":[41],"ramk":[41],"ramke":[41],"a":[48],"am":[48],"amt":[48],"opk":[51],"opke":[51],"opkek":[51],"opkekt":[51],"falo":[52],"ro":[72],"rof":[72],"rofs":[72],"tes":[89],"tesk":[89],"teskr":[89],"teskre":[89],"teskrep":[89],"teskrept":[89],"teskrepte":[89],"teskrepteo":[89],"teskrepteom":[89],"l":[98],"lo":[98],"lok":[98],"loka":[98],"lokal":[98],"p":[113],"pr":[113],"pro":[113],"prop":[113]},{"p":[2],"pr":[2],"pre":[2],"pref":[2],"prefe":[2],"prefes":[2],"sea":[3,5],"sear":[3,5],"seark":[3,5],"s":[5],"se":[5],"op":[18],"opt":[18],"opte":[18],"opteo":[18],"opteom":[18],"t":[35],"te":[35],"tem":[35],"teme":[35],"f":[36,37],"fa":[36,37],"far":[36,37],"fare":[36,37],"farea":[36,37],"faream":[36,37],"fareamt":[36,37],"kr":[48],"kro":[48],"krop":[48],"krops":[48],"e":[66,67],"ek":[66,67,104,105],"eko":[66,67,104,105],"ekom":[66,67,104,105],"a":[68,106],"af":[68,106],"afa":[68,106],"afat":[68,106],"afata":[68,106],"afatar":[68,106]},{"sl":[2],"slo":[2],"slot":[2],"slots":[2]},{},{},{}]', "text.ctx": "[{}]" }, "idMap": { "0": { "id": "src-components-autocomplete-story-vue", "kind": "story" }, "1": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-0", "kind": "variant" }, "2": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-1", "kind": "variant" }, "3": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-2", "kind": "variant" }, "4": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-3", "kind": "variant" }, "5": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-4", "kind": "variant" }, "6": { "id": "src-components-avatar-story-vue", "kind": "story" }, "7": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-0", "kind": "variant" }, "8": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-1", "kind": "variant" }, "9": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-2", "kind": "variant" }, "10": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-3", "kind": "variant" }, "11": { "id": "src-components-badge-story-vue", "kind": "story" }, "12": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-0", "kind": "variant" }, "13": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-1", "kind": "variant" }, "14": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-2", "kind": "variant" }, "15": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-3", "kind": "variant" }, "16": { "id": "src-components-breadcrumbs-story-vue", "kind": "story" }, "17": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-0", "kind": "variant" }, "18": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-1", "kind": "variant" }, "19": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-2", "kind": "variant" }, "20": { "id": "src-components-button-story-vue", "kind": "story" }, "21": { "id": "src-components-button-story-vue:src-components-button-story-vue-0", "kind": "variant" }, "22": { "id": "src-components-button-story-vue:src-components-button-story-vue-1", "kind": "variant" }, "23": { "id": "src-components-button-story-vue:src-components-button-story-vue-2", "kind": "variant" }, "24": { "id": "src-components-button-story-vue:src-components-button-story-vue-3", "kind": "variant" }, "25": { "id": "src-components-calendar-story-vue", "kind": "story" }, "26": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-0", "kind": "variant" }, "27": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-1", "kind": "variant" }, "28": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-2", "kind": "variant" }, "29": { "id": "src-components-checkbox-story-vue", "kind": "story" }, "30": { "id": "src-components-checkbox-story-vue:_default", "kind": "variant" }, "31": { "id": "src-components-circularprogressbar-story-vue", "kind": "story" }, "32": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-0", "kind": "variant" }, "33": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-1", "kind": "variant" }, "34": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-2", "kind": "variant" }, "35": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-3", "kind": "variant" }, "36": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-4", "kind": "variant" }, "37": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-5", "kind": "variant" }, "38": { "id": "src-components-datepicker-story-vue", "kind": "story" }, "39": { "id": "src-components-datepicker-story-vue:src-components-datepicker-story-vue-0", "kind": "variant" }, "40": { "id": "src-components-datepicker-story-vue:src-components-datepicker-story-vue-1", "kind": "variant" }, "41": { "id": "src-components-datepicker-story-vue:src-components-datepicker-story-vue-2", "kind": "variant" }, "42": { "id": "src-components-dialog-story-vue", "kind": "story" }, "43": { "id": "src-components-dialog-story-vue:src-components-dialog-story-vue-0", "kind": "variant" }, "44": { "id": "src-components-dialog-story-vue:src-components-dialog-story-vue-1", "kind": "variant" }, "45": { "id": "src-components-dropdown-story-vue", "kind": "story" }, "46": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-0", "kind": "variant" }, "47": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-1", "kind": "variant" }, "48": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-2", "kind": "variant" }, "49": { "id": "src-components-errormessage-story-vue", "kind": "story" }, "50": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-0", "kind": "variant" }, "51": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-1", "kind": "variant" }, "52": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-2", "kind": "variant" }, "53": { "id": "src-components-fileuploader-story-vue", "kind": "story" }, "54": { "id": "src-components-fileuploader-story-vue:_default", "kind": "variant" }, "55": { "id": "src-components-formcontrol-story-vue", "kind": "story" }, "56": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-0", "kind": "variant" }, "57": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-1", "kind": "variant" }, "58": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-2", "kind": "variant" }, "59": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-3", "kind": "variant" }, "60": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-4", "kind": "variant" }, "61": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-5", "kind": "variant" }, "62": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-6", "kind": "variant" }, "63": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-7", "kind": "variant" }, "64": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-8", "kind": "variant" }, "65": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-9", "kind": "variant" }, "66": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-10", "kind": "variant" }, "67": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-11", "kind": "variant" }, "68": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-12", "kind": "variant" }, "69": { "id": "src-components-listview-story-vue", "kind": "story" }, "70": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-0", "kind": "variant" }, "71": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-1", "kind": "variant" }, "72": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-2", "kind": "variant" }, "73": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-3", "kind": "variant" }, "74": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-4", "kind": "variant" }, "75": { "id": "src-components-popover-story-vue", "kind": "story" }, "76": { "id": "src-components-popover-story-vue:src-components-popover-story-vue-0", "kind": "variant" }, "77": { "id": "src-components-popover-story-vue:src-components-popover-story-vue-1", "kind": "variant" }, "78": { "id": "src-components-progress-story-vue", "kind": "story" }, "79": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-0", "kind": "variant" }, "80": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-1", "kind": "variant" }, "81": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-2", "kind": "variant" }, "82": { "id": "src-components-select-story-vue", "kind": "story" }, "83": { "id": "src-components-select-story-vue:_default", "kind": "variant" }, "84": { "id": "src-components-spinner-story-vue", "kind": "story" }, "85": { "id": "src-components-spinner-story-vue:src-components-spinner-story-vue-0", "kind": "variant" }, "86": { "id": "src-components-spinner-story-vue:src-components-spinner-story-vue-1", "kind": "variant" }, "87": { "id": "src-components-switch-story-vue", "kind": "story" }, "88": { "id": "src-components-switch-story-vue:src-components-switch-story-vue-0", "kind": "variant" }, "89": { "id": "src-components-switch-story-vue:src-components-switch-story-vue-1", "kind": "variant" }, "90": { "id": "src-components-tabs-story-vue", "kind": "story" }, "91": { "id": "src-components-tabs-story-vue:src-components-tabs-story-vue-0", "kind": "variant" }, "92": { "id": "src-components-tabs-story-vue:src-components-tabs-story-vue-1", "kind": "variant" }, "93": { "id": "src-components-textinput-story-vue", "kind": "story" }, "94": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-0", "kind": "variant" }, "95": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-1", "kind": "variant" }, "96": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-2", "kind": "variant" }, "97": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-3", "kind": "variant" }, "98": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-4", "kind": "variant" }, "99": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-5", "kind": "variant" }, "100": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-6", "kind": "variant" }, "101": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-7", "kind": "variant" }, "102": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-8", "kind": "variant" }, "103": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-9", "kind": "variant" }, "104": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-10", "kind": "variant" }, "105": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-11", "kind": "variant" }, "106": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-12", "kind": "variant" }, "107": { "id": "src-components-textarea-story-vue", "kind": "story" }, "108": { "id": "src-components-textarea-story-vue:src-components-textarea-story-vue-0", "kind": "variant" }, "109": { "id": "src-components-textarea-story-vue:src-components-textarea-story-vue-1", "kind": "variant" }, "110": { "id": "src-components-rating-rating-story-vue", "kind": "story" }, "111": { "id": "src-components-rating-rating-story-vue:src-components-rating-rating-story-vue-0", "kind": "variant" }, "112": { "id": "src-components-tooltip-tooltip-story-vue", "kind": "story" }, "113": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-0", "kind": "variant" }, "114": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-1", "kind": "variant" }, "115": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-2", "kind": "variant" }, "116": { "id": "src-components-tree-tree-story-vue", "kind": "story" }, "117": { "id": "src-components-tree-tree-story-vue:src-components-tree-tree-story-vue-0", "kind": "variant" }, "118": { "id": "docs-getting-started-story-js", "kind": "story" }, "119": { "id": "docs-introduction-story-js", "kind": "story" }, "120": { "id": "docs-other-directives-story-js", "kind": "story" }, "121": { "id": "docs-other-utilities-story-js", "kind": "story" }, "122": { "id": "docs-resources-document-resource-story-js", "kind": "story" }, "123": { "id": "docs-resources-list-resource-story-js", "kind": "story" }, "124": { "id": "docs-resources-resource-story-js", "kind": "story" }, "125": { "id": "tailwind", "kind": "story" }, "126": { "id": "tailwind:background-color", "kind": "variant" }, "127": { "id": "tailwind:text-color", "kind": "variant" }, "128": { "id": "tailwind:border-color", "kind": "variant" }, "129": { "id": "tailwind:padding", "kind": "variant" }, "130": { "id": "tailwind:margin", "kind": "variant" }, "131": { "id": "tailwind:font-size", "kind": "variant" }, "132": { "id": "tailwind:font-weight", "kind": "variant" }, "133": { "id": "tailwind:font-family", "kind": "variant" }, "134": { "id": "tailwind:letter-spacing", "kind": "variant" }, "135": { "id": "tailwind:line-height", "kind": "variant" }, "136": { "id": "tailwind:drop-shadow", "kind": "variant" }, "137": { "id": "tailwind:border-radius", "kind": "variant" }, "138": { "id": "tailwind:border-width", "kind": "variant" }, "139": { "id": "tailwind:width", "kind": "variant" }, "140": { "id": "tailwind:height", "kind": "variant" }, "141": { "id": "tailwind:full-config", "kind": "variant" } } };
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
    const DocSearchData = () => __vitePreload(() => import("./search-docs-data-b4b9a057.js"), true ? ["assets/search-docs-data-b4b9a057.js","assets/vendor-16a9e5ef.js"] : void 0);
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
