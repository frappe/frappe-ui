const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/search-docs-data-DPb9JnoU.js","assets/vendor-By8Zq8JN.js"])))=>i.map(i=>d[i]);
import { r as ref, k as watch, c as computed, d as defineComponent, o as openBlock, b as createElementBlock, a6 as renderSlot, n as normalizeClass, m as withKeys, q as createBlock, g as unref, I as Icon, e as createVNode, f as createBaseVNode, D as createTextVNode, t as toDisplayString, F as Fragment, p as renderList, h as createCommentVNode, u as useCssVars, aj as toRefs, ak as useRouter, w as withCtx, a2 as markRaw, dq as useFocus, dr as refDebounced, B as withDirectives, ad as vModelText, ac as withModifiers, _ as __vitePreload, ds as flexsearch_bundleExports } from "./vendor-By8Zq8JN.js";
import { u as useStoryStore } from "./story-BBMeg6LQ.js";
import { B as BaseEmpty } from "./BaseEmpty.vue-CYAmyTdP.js";
import "./GenericMountStory.vue2-FKvM6NWH.js";
import { o as onKeyboardShortcut, u as useCommandStore } from "./bundle-main-BCS_Nfen.js";
import { _ as _export_sfc, u as useScrollOnActive, B as BaseListItemLink } from "./MobileOverlay.vue2-DK_e5DD7.js";
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
let searchData$1 = { "index": { "reg": '{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":1,"16":1,"17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":1,"25":1,"26":1,"27":1,"28":1,"29":1,"30":1,"31":1,"32":1,"33":1,"34":1,"35":1,"36":1,"37":1,"38":1,"39":1,"40":1,"41":1,"42":1,"43":1,"44":1,"45":1,"46":1,"47":1,"48":1,"49":1,"50":1,"51":1,"52":1,"53":1,"54":1,"55":1,"56":1,"57":1,"58":1,"59":1,"60":1,"61":1,"62":1,"63":1,"64":1,"65":1,"66":1,"67":1,"68":1,"69":1,"70":1,"71":1,"72":1,"73":1,"74":1,"75":1,"76":1,"77":1,"78":1,"79":1,"80":1,"81":1,"82":1,"83":1,"84":1,"85":1,"86":1,"87":1,"88":1,"89":1,"90":1,"91":1,"92":1,"93":1,"94":1,"95":1,"96":1,"97":1,"98":1,"99":1,"100":1,"101":1,"102":1,"103":1,"104":1,"105":1,"106":1,"107":1,"108":1,"109":1,"110":1,"111":1,"112":1,"113":1,"114":1,"115":1,"116":1,"117":1,"118":1,"119":1,"120":1,"121":1,"122":1,"123":1,"124":1,"125":1,"126":1,"127":1,"128":1,"129":1,"130":1,"131":1,"132":1,"133":1,"134":1,"135":1,"136":1,"137":1,"138":1,"139":1,"140":1,"141":1,"142":1,"143":1,"144":1,"145":1,"146":1,"147":1,"148":1,"149":1,"150":1,"151":1,"152":1,"153":1,"154":1,"155":1,"156":1,"157":1,"158":1,"159":1,"160":1,"161":1,"162":1,"163":1,"164":1,"165":1,"166":1,"167":1,"168":1,"169":1,"170":1,"171":1,"172":1,"173":1,"174":1,"175":1,"176":1,"177":1,"178":1,"179":1,"180":1,"181":1,"182":1,"183":1,"184":1,"185":1,"186":1,"187":1,"188":1,"189":1,"190":1,"191":1,"192":1,"193":1,"194":1,"195":1,"196":1,"197":1,"198":1,"199":1,"200":1,"201":1,"202":1,"203":1,"204":1,"205":1,"206":1,"207":1,"208":1,"209":1,"210":1,"211":1,"212":1,"213":1}', "text.cfg": '{"doc":0,"opt":1}', "text.map": '[{"e":[0,1,2,3,4,5,6,91,92,93,94,191],"ek":[0,1,2,3,4,5,6],"eko":[0,1,2,3,4,5,6],"ekom":[0,1,2,3,4,5,6],"a":[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"al":[7,8,9,10,11,12,13],"ale":[7,8,9,10,11,12,13],"aler":[7,8,9,10,11,12,13],"alert":[7,8,9,10,11,12,13],"ao":[14,15,16,17,18,19],"aot":[14,15,16,17,18,19],"aoto":[14,15,16,17,18,19],"aotok":[14,15,16,17,18,19],"aotoko":[14,15,16,17,18,19],"aotokom":[14,15,16,17,18,19],"aotokomp":[14,15,16,17,18,19],"aotokompl":[14,15,16,17,18,19],"aotokomple":[14,15,16,17,18,19],"aotokomplet":[14,15,16,17,18,19],"aotokomplete":[14,15,16,17,18,19],"af":[20,21,22,23,24],"afa":[20,21,22,23,24],"afat":[20,21,22,23,24],"afata":[20,21,22,23,24],"afatar":[20,21,22,23,24],"p":[25,26,27,28,29,30,31,32,33,34,35,36,37,38,124,125,126,127,128,129,130,131,132],"pa":[25,26,27,28,29,124,125],"pat":[25,26,27,28,29],"patk":[25,26,27,28,29],"patke":[25,26,27,28,29],"pr":[30,31,32,33,129,130,131,132],"pre":[30,31,32,33],"prea":[30,31,32,33],"preat":[30,31,32,33],"preatk":[30,31,32,33],"preatkr":[30,31,32,33],"preatkro":[30,31,32,33],"preatkrom":[30,31,32,33],"preatkromp":[30,31,32,33],"preatkromps":[30,31,32,33],"po":[34,35,36,37,38,126,127,128],"pot":[34,35,36,37,38],"poto":[34,35,36,37,38],"potom":[34,35,36,37,38],"k":[39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,190],"ka":[39,40,41,42,43,44,45,46,47,48,49,50,51],"kal":[39,40,41,42],"kale":[39,40,41,42],"kalem":[39,40,41,42],"kalemt":[39,40,41,42],"kalemta":[39,40,41,42],"kalemtar":[39,40,41,42],"kar":[43,44,45,46,47,48,49,50,51],"kart":[43,44,45,46,47,48,49,50,51],"karts":[43,44,45,46,47,48,49,50,51],"ke":[52,53,54,55,56,57,58,59,60,190],"kek":[52,53],"kekp":[52,53],"kekpo":[52,53],"kekpos":[52,53],"ker":[54,55,56,57,58,59,60],"kerk":[54,55,56,57,58,59,60],"kerko":[54,55,56,57,58,59,60],"kerkol":[54,55,56,57,58,59,60],"kerkola":[54,55,56,57,58,59,60],"kerkolar":[54,55,56,57,58,59,60],"ko":[61,62,63,64,65,66,67,68,69,70,71],"kom":[61,62,63,64,65,66,67,68,69,70,71],"komp":[61,62,63,64,65,66,67,68,69,70,71],"kompo":[61,62,63,64,65,66,67,68,69,70,71],"kompop":[61,62,63,64,65,66,67,68,69,70,71],"kompopo":[61,62,63,64,65,66,67,68,69,70,71],"kompopos":[61,62,63,64,65,66,67,68,69,70,71],"t":[72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,192,194,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213],"ta":[72,73,74,75,153,154,155,156,157,158,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213],"tat":[72,73,74,75],"tate":[72,73,74,75],"te":[76,77,78,79,80,81,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,192],"tea":[76,77,78,79,80,81],"teal":[76,77,78,79,80,81],"tealo":[76,77,78,79,80,81],"tealok":[76,77,78,79,80,81],"tr":[82,83,84,85,86,87,88,89,90,188,189],"tro":[82,83,84,85,86,87,88,89,90],"trop":[82,83,84,85,86,87,88,89,90],"tropt":[82,83,84,85,86,87,88,89,90],"tropto":[82,83,84,85,86,87,88,89,90],"troptof":[82,83,84,85,86,87,88,89,90],"troptofm":[82,83,84,85,86,87,88,89,90],"er":[91,92,93,94],"ero":[91,92,93,94],"eror":[91,92,93,94],"f":[95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110],"fe":[95,96],"fel":[95,96],"fele":[95,96],"fo":[97,98,99,100,101,102,103,104,105,106,107,108,109,110],"for":[97,98,99,100,101,102,103,104,105,106,107,108,109,110],"form":[97,98,99,100,101,102,103,104,105,106,107,108,109,110],"l":[111,112,113,114,115,116,195],"le":[111,112,113,114,115,116,195],"les":[111,112,113,114,115,116,195],"lest":[111,112,113,114,115,116,195],"m":[117,118,119,120,121,122,123],"mo":[117,118,119,120,121,122,123],"mom":[117,118,119],"momt":[117,118,119],"mol":[120,121,122,123],"molt":[120,121,122,123],"molte":[120,121,122,123],"pas":[124,125],"pasf":[124,125],"pasfo":[124,125],"pasfor":[124,125],"pasfort":[124,125],"pop":[126,127,128],"popo":[126,127,128],"popof":[126,127,128],"popofe":[126,127,128],"popofer":[126,127,128],"pro":[129,130,131,132],"prok":[129,130,131,132],"prokr":[129,130,131,132],"prokre":[129,130,131,132],"prokres":[129,130,131,132],"r":[133,134,196],"ra":[133,134],"rat":[133,134],"rate":[133,134],"ratem":[133,134],"ratemk":[133,134],"s":[135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152],"se":[135,136,137,138,139,140,141,142],"sel":[135,136,137,138,139,140],"sele":[135,136,137,138,139,140],"selek":[135,136,137,138,139,140],"selekt":[135,136,137,138,139,140],"set":[141,142],"sete":[141,142],"setep":[141,142],"setepa":[141,142],"setepar":[141,142],"sf":[143,144,145,146,147,148,149],"sfe":[143,144,145,146,147,148,149],"sfet":[143,144,145,146,147,148,149],"sfetk":[143,144,145,146,147,148,149],"sp":[150,151,152],"spe":[150,151,152],"spem":[150,151,152],"speme":[150,151,152],"spemer":[150,151,152],"tap":[153,154,155,156,157,158],"taps":[155,156,157,158],"tes":[159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178],"test":[159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178],"testa":[176,177,178],"testar":[176,177,178],"testare":[176,177,178],"testarea":[176,177,178],"tem":[179,180,181,182,183],"teme":[179,180,181,182,183],"to":[184,185,186,187,194],"tol":[184,185,186,187],"tolt":[184,185,186,187],"tolte":[184,185,186,187],"toltep":[184,185,186,187],"tre":[188,189],"ket":[190],"kete":[190],"ketem":[190],"ketemk":[190],"em":[191],"emt":[191],"emtr":[191],"emtro":[191],"emtrot":[191],"emtroto":[191],"emtrotok":[191],"emtrotokt":[191],"emtrotokte":[191],"emtrotokteo":[191],"emtrotokteom":[191],"ter":[192],"tere":[192],"terek":[192],"terekt":[192],"terekte":[192],"terektef":[192],"terektefe":[192],"terektefes":[192],"o":[193],"ot":[193],"ote":[193],"otel":[193],"otele":[193],"otelet":[193],"otelete":[193],"oteletes":[193],"tok":[194],"toko":[194],"tokom":[194],"tokome":[194],"tokomem":[194],"tokomemt":[194],"re":[196],"res":[196],"reso":[196],"resor":[196],"resork":[196],"resorke":[196],"tal":[197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213],"talf":[197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213],"talfe":[197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213],"talfem":[197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213],"talfemt":[197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213]},{"p":[0,1,2,3,4,5,6,47,54,55,56,57,58,59,60,68,72,73,74,75,77,117,118,119,144,153,154,179,180,181,182,183,198,200,201,209,210],"pe":[0,1,2,3,4,5,6,72,73,74,75,117,118,119,179,180,181,182,183],"pek":[0,1,2,3,4,5,6,72,73,74,75,117,118,119,179,180,181,182,183],"peke":[0,1,2,3,4,5,6,72,73,74,75,117,118,119,179,180,181,182,183],"peker":[0,1,2,3,4,5,6,72,73,74,75,117,118,119,179,180,181,182,183],"s":[8,15,16,17,22,24,26,27,35,36,45,46,62,120,121,122,123,177,190],"so":[8,26,27,35,36,177],"sok":[8],"soke":[8],"sokes":[8],"f":[9,31,32,33,51,84,85,88,89,90,111,112,113,114,115,116,137,156,157,158,185,187,203,204,205,211,213],"fa":[9],"far":[9],"farm":[9],"farme":[9],"farmem":[9],"farmemk":[9],"e":[10,11,131,132,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,212],"er":[10],"ero":[10],"eror":[10],"em":[11,131,132,159,160,161,162,163,164,165,166,167,168,169,170,171,172],"emf":[11],"emfo":[11],"k":[12,13,21,23,29,38,78,87,97,98,99,100,101,102,103,104,105,106,107,108,109,110,138,139,149,151,152],"ko":[12,13,29,38,41,42,78,97,98,99,100,101,102,103,104,105,106,107,108,109,110,138,139],"kom":[12,97,98,99,100,101,102,103,104,105,106,107,108,109,110],"komt":[12,97,98,99,100,101,102,103,104,105,106,107,108,109,110],"komtr":[12,97,98,99,100,101,102,103,104,105,106,107,108,109,110],"komtro":[12,97,98,99,100,101,102,103,104,105,106,107,108,109,110],"komtrol":[12,97,98,99,100,101,102,103,104,105,106,107,108,109,110],"komtrole":[12],"komtrolet":[12],"kos":[13,29,38,41,42,69,70,71,78,138,139],"kost":[13,29,38,41,42,69,70,71,78,138,139],"kosto":[13,41,42,69,70,71,78,138,139],"kostom":[13,41,42,69,70,71,78,138,139],"se":[15,16,17,45,62,120,121,122,123,147],"sem":[15,16,17,45,62],"semk":[15,16,17],"semkl":[15,16,17],"semkle":[15,16,17],"m":[18,19,44,91,92,93,94,140,202],"mo":[18,19,44,140],"mol":[18,19],"molt":[18,19],"molte":[18,19],"moltep":[18,19],"moltepl":[18,19],"molteple":[18,19],"ke":[21,23,87],"ker":[21,23],"kerk":[21,23],"kerkl":[21,23],"kerkle":[21,23],"sk":[22,24],"sko":[22,24],"skoa":[22,24],"skoar":[22,24],"skoare":[22,24],"sol":[26,35],"sole":[26,35],"solet":[26,35],"sop":[27,36,177],"sopt":[27,36,177],"soptl":[27,36,177],"soptle":[27,36,177],"o":[28,37,48,63,64,65,95,96,178],"ot":[28,37,63,178],"otl":[28,37,63,178],"otle":[28,37,63,178],"otlem":[28,37,63,178],"otleme":[28,37,63,178],"fe":[31,32,33,84,85,88,89,90,111,112,113,114,115,116,137,156,157,158,185,187,211],"fet":[31,32,33,84,85,88,89,90,137,156,157,185,187,211],"t":[40,50,53,67,125,127,128,134,136,146,148],"te":[40,53,67,83,125,134,136,146,148,186,189,199],"tef":[40,53,79,83,125,134,136,189],"tefa":[40,53,83,125,134,136,189],"tefao":[40,53,83,125,134,136,189],"tefaol":[40,53,83,125,134,136,189],"tefaolt":[40,53,83,125,134,136,189],"mom":[44],"momp":[44],"mompe":[44],"momper":[44],"semp":[45,62],"sempl":[45,62],"semple":[45,62],"st":[46,190],"sta":[46,190],"stak":[46],"stake":[46],"staket":[46],"pa":[47,77,198,201],"par":[47],"or":[48],"ore":[48],"ores":[48],"oreso":[48],"oresom":[48],"oresomt":[48],"oresomta":[48],"oresomtal":[48],"a":[49],"ar":[49],"are":[49],"area":[49],"to":[50],"tom":[50],"tomo":[50],"tomot":[50],"fo":[51,203,204,205,213],"fom":[51,203,204,205],"fome":[51],"fomel":[51],"pr":[54,55,56,57,58,59,60,68],"pro":[54,55,56,57,58,59,60],"prok":[54,55,56,57,58,59,60],"prokr":[54,55,56,57,58,59,60],"prokre":[54,55,56,57,58,59,60],"prokres":[54,55,56,57,58,59,60],"op":[64,65,95,96],"opk":[64],"opke":[64],"opkek":[64],"opkekt":[64],"opt":[65],"opte":[65],"opteo":[65],"opteom":[65],"opteoms":[65],"kr":[66],"kro":[66],"krop":[66],"krope":[66],"kropet":[66],"tes":[67,80,146,148,186,199],"tesa":[67,80,148,186],"tesap":[67,80,148,186],"tesapl":[67,80,148,186],"tesaple":[67,80,148,186],"tesaplet":[67,148,186],"pre":[68],"pas":[77],"pase":[77],"pasek":[77],"tefe":[79],"tefer":[79],"tefere":[79],"teferem":[79],"teferemt":[79],"r":[86,194,195],"re":[86,194,195],"rek":[86],"rekt":[86],"kem":[87],"kemt":[87],"kemte":[87],"kemter":[87],"me":[91,92,93,94],"mes":[91,92,93,94],"mesa":[91,92,93,94],"mesak":[91,92,93,94],"mesake":[91,92,93,94],"opl":[95,96],"oplo":[95,96],"oploa":[95,96],"oploat":[95,96],"oploate":[95,96],"oploater":[95,96],"fef":[111,112,113,114,115,116],"sel":[120,121,122,123],"sele":[120,121,122,123],"selek":[120,121,122,123],"selekt":[120,121,122,123],"tr":[127,128,208],"tre":[127,128],"trek":[127,128],"treke":[127,128],"treker":[127,128],"l":[130,145,206,207],"la":[130,145],"lap":[130,145],"lape":[130,145],"lapel":[130,145],"emt":[131,132],"emte":[132],"emter":[132],"emterf":[132],"emterfa":[132],"emterfal":[132],"emterfals":[132],"pl":[144],"pla":[144],"plam":[144],"tesk":[146],"teskr":[146],"teskre":[146],"teskrep":[146],"teskrept":[146],"teskrepte":[146],"teskrepteo":[146],"teskrepteom":[146],"ses":[147],"sese":[147],"kl":[149,151,152],"kla":[149,151,152],"klas":[149,151,152],"klase":[149],"klases":[149],"po":[153,154,200,209,210],"pot":[153,154],"poto":[153,154],"potom":[153,154],"potoms":[153,154],"feto":[156],"fetot":[156],"fer":[158],"fert":[158],"ferte":[158],"fertek":[158],"ferteka":[158],"fertekal":[158],"emp":[159,160,161,162,163,164,165,166,167,168,169,170,171,172],"empo":[159,160,161,162,163,164,165,166,167,168,169,170,171,172],"empot":[159,160,161,162,163,164,165,166,167,168,169,170,171,172],"et":[173,174,175],"ete":[173,174,175],"etet":[173,174,175],"eteto":[173,174,175],"etetor":[173,174,175],"star":[190],"start":[190],"starte":[190],"startet":[190],"res":[194,195],"reso":[194,195],"resor":[194,195],"resork":[194,195],"resorke":[194,195],"pak":[198],"pakr":[198],"pakro":[198],"pakrom":[198],"pakromt":[198],"test":[199],"por":[200,209,210],"port":[200,209,210],"porte":[200,209,210],"porter":[200,209,210],"pat":[201],"pate":[201],"patem":[201],"patemk":[201],"ma":[202],"mar":[202],"mark":[202],"marke":[202],"markem":[202],"fomt":[203,204,205],"le":[206,207],"let":[206],"lete":[206],"leter":[206],"lem":[207],"leme":[207],"tro":[208],"trop":[208],"ek":[212],"ekt":[212],"fol":[213]},{"2":[181],"24":[181],"pa":[1,45,46,48,54,55,56,57,58,59,60,102,165,174,180],"pas":[1,102,165,174,180],"pase":[1,174,180],"pasek":[1,174,180],"s":[2,12,13,67,68,79,88,89,92,103,105,109,112,166,171,187,203,206,208],"so":[2,88,109,140,171],"sop":[2,88],"sopt":[2],"soptl":[2],"soptle":[2],"o":[3,15,16,17,18,19,32,66,69,70,71,80,122,128,139,169],"ot":[3,80],"otl":[3],"otle":[3],"otlem":[3],"otleme":[3],"k":[4,84,85,113,114,115,127,175,182,198,199,200,213],"ko":[4,84,113,175,182,198,199,200,213],"kos":[4,84,113,182],"kost":[4,84,113,182],"pr":[5,108,110,137,170,172],"pre":[5,108,110,137,170,172],"t":[6,96,98,101,104,118,121],"te":[6,96,98,104,118,121,185],"tes":[6,98,104,185],"tesa":[6],"tesap":[6],"tesapl":[6],"tesaple":[6],"tesaplet":[6],"st":[12,62,67,92],"sta":[12,67],"stat":[12,67],"state":[12,67],"sl":[13,187],"slo":[13,187],"slot":[13,187],"slots":[13],"op":[15,16,17,18,19,66,69,70,71,122,139],"opt":[15,16,17,18,19,64,66,69,70,71,122,139],"opte":[15,16,17,18,19,64,66,69,70,71,122,139],"opteo":[15,16,17,18,19,64,66,69,70,71,122,139],"opteom":[15,16,17,18,19,64,66,69,70,71,122,139],"opteoms":[18,19,64,66,69,70,71],"r":[31,209],"ro":[31],"rot":[31],"rote":[31],"om":[32],"pref":[33,108,110,137,170,172],"prefe":[33,108,110,137,170,172],"prefes":[33,108,110,137,170,172],"e":[41,100,116,156,157,207],"ea":[41],"eat":[41],"eate":[41],"eater":[41],"kl":[42,127],"kle":[42,127],"klek":[42,127],"p":[45,46,48,102,108,110,137,165,170,172,174],"par":[45,46,48,54,55,56,57,58,59,60],"a":[47,86,87,146],"am":[47,146],"amt":[47,146],"str":[62,92],"stre":[62,92],"strem":[62,92],"stremk":[62,92],"f":[63,65,81,94,119,123,138,151,152,177,178,210],"fa":[63,94,177,178,205],"far":[63,177,178],"fare":[63,177,178],"farea":[63,177,178],"faream":[63,177,178],"fareamt":[63,177,178],"fe":[65,81,119,204,210],"fet":[65,81,119,210],"se":[68,79,103,105,112,166,203],"sel":[68,105],"sele":[68,105],"selek":[68,105],"selekt":[68,105],"selekte":[68],"selektet":[68],"kom":[78,175,213],"komt":[78],"komte":[78],"komtem":[78],"komtemt":[78],"ses":[79,203],"sese":[79,203],"seses":[79],"ots":[80],"otse":[80],"otset":[80],"otsete":[80],"kosto":[84,113,182],"kostom":[84,113,182],"kr":[85,114],"kro":[85,114],"krop":[85,114],"krops":[85],"al":[86,87],"ale":[86,87],"alek":[86,87],"alekm":[86,87],"alekme":[86,87],"alekmet":[86,87],"sopm":[88],"sopme":[88],"sopmem":[88],"sopmemo":[88],"sopmemos":[88],"sf":[89],"sfe":[89],"sfet":[89],"sfetk":[89],"sfetke":[89],"sfetkes":[89],"m":[90,99,161,183],"me":[90,183],"mes":[90],"mest":[90],"meste":[90],"mestet":[90],"fal":[94],"fals":[94],"false":[94],"tef":[96,118,121],"tefa":[96,118,121],"tefao":[96,118,121],"tefaol":[96,118,121],"tefaolt":[96,118,121],"test":[98,104,185],"mo":[99,161],"mom":[99,161],"momp":[99,161],"mompe":[99,161],"momper":[99,161],"em":[100,116],"ema":[100,162],"emal":[100,162],"ta":[101,163,164],"tat":[101,163,164],"tate":[101,163,164],"pasf":[102,165],"pasfo":[102,165],"pasfor":[102,165],"pasfort":[102,165],"sea":[103,166],"sear":[103,166],"seark":[103,166],"testa":[104],"testar":[104],"testare":[104],"testarea":[104],"komp":[106],"kompo":[106],"kompop":[106],"kompopo":[106],"kompopos":[106],"ke":[107,115],"kek":[107],"kekp":[107],"kekpo":[107],"kekpos":[107],"sof":[109,140,171],"sofe":[109,140,171],"sofes":[109,140,171],"sem":[112],"semp":[112],"sempl":[112],"semple":[112],"krope":[114],"kropet":[114],"kel":[115],"emp":[116],"empt":[116],"empte":[116],"fo":[123,138],"fot":[123,138],"fote":[123,138],"foter":[123,138],"of":[128],"ofe":[128],"ofer":[128],"ek":[156,157,207],"eko":[156,157],"ekom":[156,157],"tatet":[164],"tatete":[164],"tatetem":[164],"tateteme":[164],"tel":[167],"tem":[168],"teme":[168],"or":[169],"orl":[169],"kome":[175],"komem":[175],"komemt":[175],"mem":[183],"kol":[198,199,200],"kolo":[198,199,200],"kolor":[198,199,200],"fek":[204],"fekt":[204],"fam":[205],"fame":[205],"famel":[205],"famele":[205],"sp":[206],"spa":[206],"spak":[206],"spake":[206],"spakem":[206],"spakemk":[206],"ekt":[207],"sa":[208],"sat":[208],"sato":[208],"satof":[208],"ra":[209],"rat":[209],"rate":[209],"rateo":[209],"rateos":[209],"komf":[213],"komfe":[213],"komfek":[213]},{"4":[151],"8":[152],"o":[1,31,60,62,93,181,182],"os":[1],"osa":[1],"osak":[1],"osake":[1],"f":[2,3,4,16,17,19,68,69,70,71,77,78],"fa":[2,3,4,68],"far":[2,3,4],"fare":[2,3,4],"farea":[2,3,4],"faream":[2,3,4],"fareamt":[2,3,4],"s":[5,6,33,56,59,90,108,110,115,170,172],"se":[5,56],"sel":[5],"sele":[5],"selek":[5],"selekt":[5],"selekte":[5],"selektet":[5],"st":[6],"sta":[6],"stat":[6],"state":[6],"fe":[16,17,19,69,70,71,77,78],"fet":[16,17,19,69,70,71,77,78],"feto":[17,19],"fetot":[17,19],"op":[31,62,93,182],"opt":[31,62,182],"opte":[31,62,182],"opteo":[31,62,182],"opteom":[31,62,182],"k":[32,80],"kl":[32,80],"kle":[32,80],"klek":[32,80],"sl":[33,108,109,110,115,122,123,138,139,170,171,172],"slo":[33,108,109,110,115,122,123,138,139,170,171,172],"slot":[33,108,109,110,115,122,123,138,139,170,171,172],"e":[42,65,81,146],"ef":[42],"efe":[42],"efem":[42],"efemt":[42],"efemts":[42],"l":[47,164],"le":[47],"lem":[47],"leme":[47],"t":[55,57],"te":[55,57,74],"tef":[55],"tefa":[55],"tefao":[55],"tefaol":[55],"tefaolt":[55],"ses":[56],"sese":[56],"tem":[57,74],"teme":[57,74],"ko":[58],"kos":[58],"kost":[58],"kosto":[58],"kostom":[58],"so":[59,90],"sol":[59],"sole":[59],"solet":[59],"ot":[60],"otl":[60],"otle":[60],"otlem":[60],"otleme":[60],"opteoms":[62,182],"ek":[65,146],"eko":[65,146],"ekom":[65,146],"ekoms":[65],"fal":[68],"falo":[68,94],"r":[75,114],"ra":[75],"ram":[75],"ramk":[75],"ramke":[75],"em":[81],"emt":[81],"emte":[81],"emter":[81],"emtera":[81],"emterak":[81],"emterakt":[81],"emterakte":[81],"emteraktef":[81],"emteraktefe":[81],"p":[84,185],"po":[84],"pot":[84],"poto":[84],"potom":[84],"sop":[90],"sopm":[90],"sopme":[90],"sopmem":[90],"sopmemo":[90],"sopmemos":[90],"opk":[93],"opke":[93],"opkek":[93],"opkekt":[93],"ro":[114],"rof":[114],"rofs":[114],"lo":[164],"lok":[164],"loka":[164],"lokal":[164],"or":[181],"ma":[183],"mas":[183],"pr":[185],"pro":[185],"prop":[185]},{"t":[2,58],"te":[2,58],"tef":[2],"tefa":[2],"tefao":[2],"tefaol":[2],"tefaolt":[2],"p":[16],"pr":[16],"pre":[16],"pref":[16],"prefe":[16],"prefes":[16],"sea":[17,19],"sear":[17,19],"seark":[17,19],"s":[19,71,78],"se":[19],"op":[32],"opt":[32],"opte":[32],"opteo":[32],"opteom":[32],"ko":[47,81],"kom":[47,81],"komp":[47,81],"kompo":[47,81],"tem":[58],"teme":[58],"f":[59,60,181],"fa":[59,60],"far":[59,60],"fare":[59,60],"farea":[59,60],"faream":[59,60],"fareamt":[59,60],"om":[69],"r":[70,183],"re":[70],"rem":[70],"remt":[70],"remte":[70],"remter":[70],"sl":[71,78],"slo":[71,78],"slot":[71,78],"slots":[71,78],"a":[77,110,172],"ak":[77],"akt":[77],"akte":[77],"akteo":[77],"akteom":[77],"akteoms":[77],"to":[80],"k":[81],"kompom":[81],"kompome":[81],"kompomem":[81],"kompomemt":[81],"kompomemts":[81],"e":[108,109],"ek":[108,109,170,171],"eko":[108,109,170,171],"ekom":[108,109,170,171],"af":[110,172],"afa":[110,172],"afat":[110,172],"afata":[110,172],"afatar":[110,172],"fo":[181],"for":[181],"form":[181],"forma":[181],"format":[181],"m":[182],"mo":[182],"ra":[183],"ram":[183],"ramk":[183],"ramke":[183]},{"sl":[16],"slo":[16],"slot":[16],"slots":[16],"kl":[69],"kle":[69],"klek":[69],"fo":[70],"fom":[70],"fomk":[70],"fomkt":[70],"fomkte":[70],"fomkteo":[70],"fomkteom":[70],"klo":[80],"klos":[80],"klose":[80],"e":[182],"em":[182],"emt":[182],"emte":[182],"emter":[182],"emterf":[182],"emterfa":[182],"emterfal":[182]},{"ke":[182],"kem":[182],"keme":[182],"kemer":[182],"kemera":[182],"kemerat":[182],"kemerate":[182],"kemerateo":[182],"kemerateom":[182]},{},{}]', "text.ctx": "[{}]" }, "idMap": { "0": { "id": "icons-iconpicker-story-vue", "kind": "story" }, "1": { "id": "icons-iconpicker-story-vue:icons-iconpicker-story-vue-0", "kind": "variant" }, "2": { "id": "icons-iconpicker-story-vue:icons-iconpicker-story-vue-1", "kind": "variant" }, "3": { "id": "icons-iconpicker-story-vue:icons-iconpicker-story-vue-2", "kind": "variant" }, "4": { "id": "icons-iconpicker-story-vue:icons-iconpicker-story-vue-3", "kind": "variant" }, "5": { "id": "icons-iconpicker-story-vue:icons-iconpicker-story-vue-4", "kind": "variant" }, "6": { "id": "icons-iconpicker-story-vue:icons-iconpicker-story-vue-5", "kind": "variant" }, "7": { "id": "src-components-alert-alert-story-vue", "kind": "story" }, "8": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-0", "kind": "variant" }, "9": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-1", "kind": "variant" }, "10": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-2", "kind": "variant" }, "11": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-3", "kind": "variant" }, "12": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-4", "kind": "variant" }, "13": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-5", "kind": "variant" }, "14": { "id": "src-components-autocomplete-autocomplete-story-vue", "kind": "story" }, "15": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-0", "kind": "variant" }, "16": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-1", "kind": "variant" }, "17": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-2", "kind": "variant" }, "18": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-3", "kind": "variant" }, "19": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-4", "kind": "variant" }, "20": { "id": "src-components-avatar-avatar-story-vue", "kind": "story" }, "21": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-0", "kind": "variant" }, "22": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-1", "kind": "variant" }, "23": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-2", "kind": "variant" }, "24": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-3", "kind": "variant" }, "25": { "id": "src-components-badge-badge-story-vue", "kind": "story" }, "26": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-0", "kind": "variant" }, "27": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-1", "kind": "variant" }, "28": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-2", "kind": "variant" }, "29": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-3", "kind": "variant" }, "30": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue", "kind": "story" }, "31": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue:src-components-breadcrumbs-breadcrumbs-story-vue-0", "kind": "variant" }, "32": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue:src-components-breadcrumbs-breadcrumbs-story-vue-1", "kind": "variant" }, "33": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue:src-components-breadcrumbs-breadcrumbs-story-vue-2", "kind": "variant" }, "34": { "id": "src-components-button-button-story-vue", "kind": "story" }, "35": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-0", "kind": "variant" }, "36": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-1", "kind": "variant" }, "37": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-2", "kind": "variant" }, "38": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-3", "kind": "variant" }, "39": { "id": "src-components-calendar-calendar-story-vue", "kind": "story" }, "40": { "id": "src-components-calendar-calendar-story-vue:src-components-calendar-calendar-story-vue-0", "kind": "variant" }, "41": { "id": "src-components-calendar-calendar-story-vue:src-components-calendar-calendar-story-vue-1", "kind": "variant" }, "42": { "id": "src-components-calendar-calendar-story-vue:src-components-calendar-calendar-story-vue-2", "kind": "variant" }, "43": { "id": "src-components-charts-charts-story-vue", "kind": "story" }, "44": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-0", "kind": "variant" }, "45": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-1", "kind": "variant" }, "46": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-2", "kind": "variant" }, "47": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-3", "kind": "variant" }, "48": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-4", "kind": "variant" }, "49": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-5", "kind": "variant" }, "50": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-6", "kind": "variant" }, "51": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-7", "kind": "variant" }, "52": { "id": "src-components-checkbox-checkbox-story-vue", "kind": "story" }, "53": { "id": "src-components-checkbox-checkbox-story-vue:_default", "kind": "variant" }, "54": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue", "kind": "story" }, "55": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-0", "kind": "variant" }, "56": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-1", "kind": "variant" }, "57": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-2", "kind": "variant" }, "58": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-3", "kind": "variant" }, "59": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-4", "kind": "variant" }, "60": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-5", "kind": "variant" }, "61": { "id": "src-components-combobox-combobox-story-vue", "kind": "story" }, "62": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-0", "kind": "variant" }, "63": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-1", "kind": "variant" }, "64": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-2", "kind": "variant" }, "65": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-3", "kind": "variant" }, "66": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-4", "kind": "variant" }, "67": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-5", "kind": "variant" }, "68": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-6", "kind": "variant" }, "69": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-7", "kind": "variant" }, "70": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-8", "kind": "variant" }, "71": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-9", "kind": "variant" }, "72": { "id": "src-components-datepicker-datepicker-story-vue", "kind": "story" }, "73": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-0", "kind": "variant" }, "74": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-1", "kind": "variant" }, "75": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-2", "kind": "variant" }, "76": { "id": "src-components-dialog-dialog-story-vue", "kind": "story" }, "77": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-0", "kind": "variant" }, "78": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-1", "kind": "variant" }, "79": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-2", "kind": "variant" }, "80": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-3", "kind": "variant" }, "81": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-4", "kind": "variant" }, "82": { "id": "src-components-dropdown-dropdown-story-vue", "kind": "story" }, "83": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-0", "kind": "variant" }, "84": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-1", "kind": "variant" }, "85": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-2", "kind": "variant" }, "86": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-3", "kind": "variant" }, "87": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-4", "kind": "variant" }, "88": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-5", "kind": "variant" }, "89": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-6", "kind": "variant" }, "90": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-7", "kind": "variant" }, "91": { "id": "src-components-errormessage-errormessage-story-vue", "kind": "story" }, "92": { "id": "src-components-errormessage-errormessage-story-vue:src-components-errormessage-errormessage-story-vue-0", "kind": "variant" }, "93": { "id": "src-components-errormessage-errormessage-story-vue:src-components-errormessage-errormessage-story-vue-1", "kind": "variant" }, "94": { "id": "src-components-errormessage-errormessage-story-vue:src-components-errormessage-errormessage-story-vue-2", "kind": "variant" }, "95": { "id": "src-components-fileuploader-fileuploader-story-vue", "kind": "story" }, "96": { "id": "src-components-fileuploader-fileuploader-story-vue:_default", "kind": "variant" }, "97": { "id": "src-components-formcontrol-formcontrol-story-vue", "kind": "story" }, "98": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-0", "kind": "variant" }, "99": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-1", "kind": "variant" }, "100": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-2", "kind": "variant" }, "101": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-3", "kind": "variant" }, "102": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-4", "kind": "variant" }, "103": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-5", "kind": "variant" }, "104": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-6", "kind": "variant" }, "105": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-7", "kind": "variant" }, "106": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-8", "kind": "variant" }, "107": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-9", "kind": "variant" }, "108": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-10", "kind": "variant" }, "109": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-11", "kind": "variant" }, "110": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-12", "kind": "variant" }, "111": { "id": "src-components-listview-listview-story-vue", "kind": "story" }, "112": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-0", "kind": "variant" }, "113": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-1", "kind": "variant" }, "114": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-2", "kind": "variant" }, "115": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-3", "kind": "variant" }, "116": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-4", "kind": "variant" }, "117": { "id": "src-components-monthpicker-monthpicker-story-vue", "kind": "story" }, "118": { "id": "src-components-monthpicker-monthpicker-story-vue:src-components-monthpicker-monthpicker-story-vue-0", "kind": "variant" }, "119": { "id": "src-components-monthpicker-monthpicker-story-vue:src-components-monthpicker-monthpicker-story-vue-1", "kind": "variant" }, "120": { "id": "src-components-multiselect-multiselect-story-vue", "kind": "story" }, "121": { "id": "src-components-multiselect-multiselect-story-vue:src-components-multiselect-multiselect-story-vue-0", "kind": "variant" }, "122": { "id": "src-components-multiselect-multiselect-story-vue:src-components-multiselect-multiselect-story-vue-1", "kind": "variant" }, "123": { "id": "src-components-multiselect-multiselect-story-vue:src-components-multiselect-multiselect-story-vue-2", "kind": "variant" }, "124": { "id": "src-components-password-password-story-vue", "kind": "story" }, "125": { "id": "src-components-password-password-story-vue:_default", "kind": "variant" }, "126": { "id": "src-components-popover-popover-story-vue", "kind": "story" }, "127": { "id": "src-components-popover-popover-story-vue:src-components-popover-popover-story-vue-0", "kind": "variant" }, "128": { "id": "src-components-popover-popover-story-vue:src-components-popover-popover-story-vue-1", "kind": "variant" }, "129": { "id": "src-components-progress-progress-story-vue", "kind": "story" }, "130": { "id": "src-components-progress-progress-story-vue:src-components-progress-progress-story-vue-0", "kind": "variant" }, "131": { "id": "src-components-progress-progress-story-vue:src-components-progress-progress-story-vue-1", "kind": "variant" }, "132": { "id": "src-components-progress-progress-story-vue:src-components-progress-progress-story-vue-2", "kind": "variant" }, "133": { "id": "src-components-rating-rating-story-vue", "kind": "story" }, "134": { "id": "src-components-rating-rating-story-vue:src-components-rating-rating-story-vue-0", "kind": "variant" }, "135": { "id": "src-components-select-select-story-vue", "kind": "story" }, "136": { "id": "src-components-select-select-story-vue:src-components-select-select-story-vue-0", "kind": "variant" }, "137": { "id": "src-components-select-select-story-vue:src-components-select-select-story-vue-1", "kind": "variant" }, "138": { "id": "src-components-select-select-story-vue:src-components-select-select-story-vue-2", "kind": "variant" }, "139": { "id": "src-components-select-select-story-vue:src-components-select-select-story-vue-3", "kind": "variant" }, "140": { "id": "src-components-select-select-story-vue:src-components-select-select-story-vue-4", "kind": "variant" }, "141": { "id": "src-components-sidebar-sidebar-story-vue", "kind": "story" }, "142": { "id": "src-components-sidebar-sidebar-story-vue:src-components-sidebar-sidebar-story-vue-0", "kind": "variant" }, "143": { "id": "src-components-switch-switch-story-vue", "kind": "story" }, "144": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-0", "kind": "variant" }, "145": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-1", "kind": "variant" }, "146": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-2", "kind": "variant" }, "147": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-3", "kind": "variant" }, "148": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-4", "kind": "variant" }, "149": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-5", "kind": "variant" }, "150": { "id": "src-components-spinner-spinner-story-vue", "kind": "story" }, "151": { "id": "src-components-spinner-spinner-story-vue:src-components-spinner-spinner-story-vue-0", "kind": "variant" }, "152": { "id": "src-components-spinner-spinner-story-vue:src-components-spinner-spinner-story-vue-1", "kind": "variant" }, "153": { "id": "src-components-tabbuttons-tabbuttons-story-vue", "kind": "story" }, "154": { "id": "src-components-tabbuttons-tabbuttons-story-vue:src-components-tabbuttons-tabbuttons-story-vue-0", "kind": "variant" }, "155": { "id": "src-components-tabs-tabs-story-vue", "kind": "story" }, "156": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-0", "kind": "variant" }, "157": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-1", "kind": "variant" }, "158": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-2", "kind": "variant" }, "159": { "id": "src-components-textinput-textinput-story-vue", "kind": "story" }, "160": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-0", "kind": "variant" }, "161": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-1", "kind": "variant" }, "162": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-2", "kind": "variant" }, "163": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-3", "kind": "variant" }, "164": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-4", "kind": "variant" }, "165": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-5", "kind": "variant" }, "166": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-6", "kind": "variant" }, "167": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-7", "kind": "variant" }, "168": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-8", "kind": "variant" }, "169": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-9", "kind": "variant" }, "170": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-10", "kind": "variant" }, "171": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-11", "kind": "variant" }, "172": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-12", "kind": "variant" }, "173": { "id": "src-components-texteditor-texteditor-story-vue", "kind": "story" }, "174": { "id": "src-components-texteditor-texteditor-story-vue:src-components-texteditor-texteditor-story-vue-0", "kind": "variant" }, "175": { "id": "src-components-texteditor-texteditor-story-vue:src-components-texteditor-texteditor-story-vue-1", "kind": "variant" }, "176": { "id": "src-components-textarea-textarea-story-vue", "kind": "story" }, "177": { "id": "src-components-textarea-textarea-story-vue:src-components-textarea-textarea-story-vue-0", "kind": "variant" }, "178": { "id": "src-components-textarea-textarea-story-vue:src-components-textarea-textarea-story-vue-1", "kind": "variant" }, "179": { "id": "src-components-timepicker-timepicker-story-vue", "kind": "story" }, "180": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-0", "kind": "variant" }, "181": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-1", "kind": "variant" }, "182": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-2", "kind": "variant" }, "183": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-3", "kind": "variant" }, "184": { "id": "src-components-tooltip-tooltip-story-vue", "kind": "story" }, "185": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-0", "kind": "variant" }, "186": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-1", "kind": "variant" }, "187": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-2", "kind": "variant" }, "188": { "id": "src-components-tree-tree-story-vue", "kind": "story" }, "189": { "id": "src-components-tree-tree-story-vue:src-components-tree-tree-story-vue-0", "kind": "variant" }, "190": { "id": "docs-getting-started-story-js", "kind": "story" }, "191": { "id": "docs-introduction-story-js", "kind": "story" }, "192": { "id": "docs-other-directives-story-js", "kind": "story" }, "193": { "id": "docs-other-utilities-story-js", "kind": "story" }, "194": { "id": "docs-resources-document-resource-story-js", "kind": "story" }, "195": { "id": "docs-resources-list-resource-story-js", "kind": "story" }, "196": { "id": "docs-resources-resource-story-js", "kind": "story" }, "197": { "id": "tailwind", "kind": "story" }, "198": { "id": "tailwind:background-color", "kind": "variant" }, "199": { "id": "tailwind:text-color", "kind": "variant" }, "200": { "id": "tailwind:border-color", "kind": "variant" }, "201": { "id": "tailwind:padding", "kind": "variant" }, "202": { "id": "tailwind:margin", "kind": "variant" }, "203": { "id": "tailwind:font-size", "kind": "variant" }, "204": { "id": "tailwind:font-weight", "kind": "variant" }, "205": { "id": "tailwind:font-family", "kind": "variant" }, "206": { "id": "tailwind:letter-spacing", "kind": "variant" }, "207": { "id": "tailwind:line-height", "kind": "variant" }, "208": { "id": "tailwind:drop-shadow", "kind": "variant" }, "209": { "id": "tailwind:border-radius", "kind": "variant" }, "210": { "id": "tailwind:border-width", "kind": "variant" }, "211": { "id": "tailwind:width", "kind": "variant" }, "212": { "id": "tailwind:height", "kind": "variant" }, "213": { "id": "tailwind:full-config", "kind": "variant" } } };
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
    const DocSearchData = () => __vitePreload(() => import("./search-docs-data-DPb9JnoU.js"), true ? __vite__mapDeps([0,1]) : void 0);
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
