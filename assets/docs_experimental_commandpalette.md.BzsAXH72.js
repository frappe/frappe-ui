import{_ as F}from"./chunks/PropsTable.Z3qPG-lZ.js";import{_ as q}from"./chunks/SlotsTable.bNCdchVN.js";import{_ as es}from"./chunks/EmitsTable.CSlNJ0LI.js";import{r as ds,V as ms,m as hs,l as us,n as fs,L as ws,o as ys,p as vs,bi as xs,q as js,J,bx as zs,aa as W}from"./chunks/theme.CFd0xgkn.js";import{P as Y,af as Z,I as b,aT as ls,b0 as H,b8 as Q,ad as u,p as P,be as l,D as n,aE as p,Z as B,B as a,au as j,an as z,a1 as V,L as A,Y as ts,ar as U,l as x,$ as bs,aB as ps,r as y,o as s,bf as ks,b7 as gs,q as S,a9 as Ps,ac as Cs,ab as qs,ap as Ss,aj as g,F as K,am as G,a0 as cs,ao as Is,A as O}from"./chunks/framework.CK2aBVEu.js";const is=Symbol("frappe-ui:command-palette"),os=Symbol("frappe-ui:command-palette-group"),_s=Symbol("frappe-ui:command-palette-list");function Ts(m){Z(is,m)}function L(){return Y(is,null)}function Es(m){Z(os,m)}function Vs(){return Y(os,null)}function As(){Z(_s,!0)}function rs(){return Y(_s,null)}const X=b({name:"CommandPalette",inheritAttrs:!1,__name:"CommandPalette",props:ts({filterable:{type:Boolean,default:!0},title:{default:"Command palette"}},{open:{type:Boolean,default:!1},openModifiers:{},query:{default:""},queryModifiers:{}}),emits:ts(["select"],["update:open","update:query"]),setup(m,{emit:f}){const r=m,i=f,o=ls(m,"open"),h=ls(m,"query"),w=H("listbox"),c=U(),e=U(),d=U(new Map);function I(_,v){return d.value.set(_,v),ps(d),()=>{d.value.delete(_),ps(d)}}function T(_){for(const v of d.value.values())if(v.groupId===_&&v.visible.value)return!0;return!1}const C=x(()=>{for(const _ of d.value.values())if(_.visible.value)return!1;return!0});function $(_,v){const E=h.value.trim().toLowerCase();return E?[_,...v].join(" ").toLowerCase().includes(E):!0}function D(_,v){i("select",_,v),!v.defaultPrevented&&(o.value=!1)}function t(){h.value="",c.value=void 0,e.value=void 0}function k(_){c.value=_?.value}Q([o,h],async()=>{o.value&&(await bs(),w.value?.highlightFirstItem())},{immediate:!0}),Q(C,_=>{!_||!w.value||(w.value.highlightedElement=null,c.value=void 0)},{flush:"post"});const M=x(()=>({query:h.value,active:c.value,empty:C.value}));return Ts({query:h,title:x(()=>r.title),filterable:x(()=>r.filterable),activeValue:c,empty:C,matches:$,registerItem:I,groupHasVisibleItems:T,select:D}),(_,v)=>(u(),P(us,{open:o.value,"onUpdate:open":v[1]||(v[1]=E=>o.value=E),size:"xl",position:"top",bare:"",onAfterLeave:t},{default:l(()=>[n(p(ds),B({ref_key:"listbox",ref:w,modelValue:e.value,"onUpdate:modelValue":v[0]||(v[0]=E=>e.value=E),as:"div","data-slot":"command-palette",class:"flex max-h-[60vh] flex-col"},_.$attrs,{"highlight-on-hover":"","selection-behavior":"replace",onHighlight:k}),{default:l(()=>[n(p(ms),{"as-child":""},{default:l(()=>[n(p(hs),null,{default:l(()=>[a(j(m.title),1)]),_:1})]),_:1}),z(_.$slots,"default",V(A(M.value)))]),_:3},16,["modelValue"])]),_:3},8,["open"]))}}),Ls={"data-slot":"command-palette-input",class:"flex shrink-0 items-center gap-3 border-b border-outline-gray-1 px-4.5 dark:border-outline-gray-2"},ss=b({name:"CommandPaletteInput",inheritAttrs:!1,__name:"CommandPaletteInput",props:{placeholder:{default:"Search"}},setup(m){const f=L(),r=x({get:()=>f?.query.value??"",set:i=>{f&&(f.query.value=i)}});return(i,o)=>(u(),y("div",Ls,[z(i.$slots,"prefix",{},()=>[o[1]||(o[1]=s("span",{class:"lucide-search size-4 shrink-0 text-ink-gray-6"},null,-1))]),n(p(fs),B({modelValue:r.value,"onUpdate:modelValue":o[0]||(o[0]=h=>r.value=h),as:"input","auto-focus":"",autocomplete:"off",placeholder:m.placeholder,class:"w-full border-none bg-transparent py-3 px-0 text-base text-ink-gray-8 placeholder-ink-gray-4 focus:ring-0"},i.$attrs),null,16,["modelValue","placeholder"]),z(i.$slots,"suffix")]))}}),as=b({name:"CommandPaletteList",__name:"CommandPaletteList",setup(m){const f=L();return As(),(r,i)=>(u(),P(p(ws),{as:"div","data-slot":"command-palette-list","aria-label":p(f)?.title.value,class:"min-h-0 overflow-y-auto overscroll-contain focus-visible:outline-none"},{default:l(()=>[z(r.$slots,"default")]),_:3},8,["aria-label"]))}}),N=b({name:"CommandPaletteGroup",__name:"CommandPaletteGroup",props:{label:{}},setup(m){const f=L();rs();const r=Symbol("command-palette-group");Es({id:r});const i=x(()=>f?.groupHasVisibleItems(r)??!0);return(o,h)=>ks((u(),P(p(vs),{as:"div","data-slot":"command-palette-group",class:"mb-2 mt-4.5 first:mt-3"},{default:l(()=>[m.label?(u(),P(p(ys),{key:0,as:"div","data-slot":"command-palette-group-label",class:"mb-2.5 px-4.5 text-base text-ink-gray-5"},{default:l(()=>[a(j(m.label),1)]),_:1})):S("",!0),z(o.$slots,"default")]),_:3},512)),[[gs,i.value]])}}),$s={key:0,class:"ml-auto whitespace-nowrap pl-2"},R=b({name:"CommandPaletteItem",inheritAttrs:!1,__name:"CommandPaletteItem",props:{value:{},label:{},keywords:{},disabled:{type:Boolean},as:{default:"div"}},emits:["select"],setup(m,{emit:f}){const r=m,i=f,o=L(),h=Vs();rs();const w=Symbol("command-palette-item"),c=H("labelEl"),e=g("");function d(){const _=c.value?.textContent?.trim();_&&(e.value=_)}Ps(()=>{d()}),Cs(()=>{d()});const I=x(()=>r.label??e.value),T=x(()=>!o||!o.filterable.value||!I.value?!0:o.matches(I.value,r.keywords??[])),C=o?.registerItem(w,{groupId:h?.id??null,visible:T});qs(()=>C?.());const $=xs(null),D=H("item"),t=x(()=>{const _=D.value?.$el;return!!_&&$?.highlightedElement.value===_}),k=x(()=>({active:t.value,disabled:r.disabled??!1}));function M(_){i("select",_),!_.defaultPrevented&&o?.select(r.value,_)}return(_,v)=>T.value?(u(),P(p(js),{key:0,ref_key:"item",ref:D,value:m.value,disabled:m.disabled,"as-child":"",onSelect:M},{default:l(()=>[(u(),P(Ss(m.as),B({"data-slot":"command-palette-item","data-state":t.value?"active":void 0,"data-disabled":m.disabled?"":void 0,class:"mx-2.5 flex min-w-0 cursor-default items-center rounded-4 px-2 py-2 text-base-medium text-ink-gray-8 outline-none data-[state=active]:bg-surface-gray-2 data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-gray-4"},_.$attrs),{default:l(()=>[z(_.$slots,"prefix",V(A(k.value))),s("span",{ref_key:"labelEl",ref:c,"data-slot":"command-palette-item-label",class:"overflow-hidden text-ellipsis whitespace-nowrap"},[z(_.$slots,"default",V(A(k.value)))],512),_.$slots.suffix?(u(),y("span",$s,[z(_.$slots,"suffix",V(A(k.value)))])):S("",!0)]),_:3},16,["data-state","data-disabled"]))]),_:3},8,["value","disabled"])):S("",!0)}}),Ds={role:"status"},ns=b({name:"CommandPaletteEmpty",inheritAttrs:!1,__name:"CommandPaletteEmpty",setup(m){const f=L(),r=x(()=>f?.empty.value??!1),i=x(()=>({query:f?.query.value??""})),o=x(()=>i.value.query?`No results for "${i.value.query}"`:"No results");return(h,w)=>(u(),y("div",Ds,[r.value?(u(),y("div",B({key:0},h.$attrs,{"data-slot":"command-palette-empty",class:"px-4.5 py-8 text-center text-base text-ink-gray-6"}),[z(h.$slots,"default",V(A(i.value)),()=>[a(j(o.value),1)])],16)):S("",!0)]))}}),Fs={"data-slot":"command-palette-footer",class:"flex shrink-0 items-center gap-4 border-t border-outline-gray-1 px-4.5 py-2 text-sm text-ink-gray-6 dark:border-outline-gray-2"},Ks=b({name:"CommandPaletteFooter",__name:"CommandPaletteFooter",setup(m){const f=L(),r=x(()=>({active:f?.activeValue.value}));return(i,o)=>(u(),y("div",Fs,[z(i.$slots,"default",V(A(r.value)))]))}}),Gs={class:"flex flex-col items-start gap-3"},Ns={key:0,class:"text-p-sm text-ink-gray-6"},Rs=b({__name:"Links",setup(m){const f=[{link:"/docs/components/button",text:"Button"},{link:"/docs/components/dialog",text:"Dialog"},{link:"/docs/components/combobox",text:"Combobox"}],r=g(!1),i=g("");function o(h,w){const c=h,e=w.detail.originalEvent;e.metaKey||e.ctrlKey||e.shiftKey||e.button===1||(e.preventDefault(),i.value=c.link)}return(h,w)=>(u(),y("div",Gs,[n(p(J),{onClick:w[0]||(w[0]=c=>r.value=!0)},{default:l(()=>[...w[2]||(w[2]=[a("Search the docs",-1)])]),_:1}),i.value?(u(),y("p",Ns," Would navigate to "+j(i.value),1)):S("",!0),n(p(X),{open:r.value,"onUpdate:open":w[1]||(w[1]=c=>r.value=c),onSelect:o},{default:l(()=>[n(p(ss),{placeholder:"Search documentation"}),n(p(as),null,{default:l(()=>[n(p(N),{label:"Components"},{default:l(()=>[(u(),y(K,null,G(f,c=>n(p(R),{key:c.link,as:"a",href:c.link,value:c},{default:l(()=>[a(j(c.text),1)]),_:2},1032,["href","value"])),64))]),_:1})]),_:1}),n(p(ns))]),_:1},8,["open"])]))}}),Bs={class:"flex flex-col items-start gap-3"},Ms={key:0,class:"px-4.5 py-8 text-center text-base text-ink-gray-5"},Ws={class:"text-ink-gray-5"},Us=b({__name:"ServerSearch",setup(m){const f=[{name:"design-review",title:"Design review",team:"Product"},{name:"release-plan",title:"Release plan",team:"Engineering"},{name:"onboarding",title:"Onboarding checklist",team:"People"},{name:"q3-budget",title:"Q3 budget",team:"Finance"}],r=g(!1),i=g(""),o=g([]),h=g(!1);let w;return Q(i,c=>{if(clearTimeout(w),!c){o.value=[],h.value=!1;return}h.value=!0,w=setTimeout(()=>{const e=c.toLowerCase();o.value=f.filter(d=>d.title.toLowerCase().includes(e)||d.team.toLowerCase().includes(e)),h.value=!1},300)}),(c,e)=>(u(),y("div",Bs,[n(p(J),{onClick:e[0]||(e[0]=d=>r.value=!0)},{default:l(()=>[...e[3]||(e[3]=[a("Search the server",-1)])]),_:1}),n(p(X),{open:r.value,"onUpdate:open":e[1]||(e[1]=d=>r.value=d),query:i.value,"onUpdate:query":e[2]||(e[2]=d=>i.value=d),filterable:!1},{default:l(()=>[n(p(ss),{placeholder:"Search documents"}),h.value?(u(),y("div",Ms," Searching… ")):(u(),P(p(as),{key:1},{default:l(()=>[n(p(N),{label:"Documents"},{default:l(()=>[(u(!0),y(K,null,G(o.value,d=>(u(),P(p(R),{key:d.name,value:d},{suffix:l(()=>[s("span",Ws,j(d.team),1)]),default:l(()=>[a(j(d.title)+" ",1)]),_:2},1032,["value"]))),128))]),_:1})]),_:1})),h.value?S("",!0):(u(),P(p(ns),{key:2},{default:l(({query:d})=>[a(j(d?`No documents match "${d}"`:"Type to search"),1)]),_:1}))]),_:1},8,["open","query"])]))}}),Os={class:"flex flex-col items-start gap-3"},Hs={key:0,class:"text-p-sm text-ink-gray-6"},Qs=b({__name:"Default",setup(m){const f=[{name:"inbox",title:"Inbox",icon:"lucide-inbox",keywords:["mail"]},{name:"people",title:"People",icon:"lucide-users"},{name:"settings",title:"Settings",icon:"lucide-settings"}],r=[{name:"new-task",title:"New task",icon:"lucide-plus",combo:"Mod+N"},{name:"new-note",title:"New note",icon:"lucide-file-text",combo:"Mod+Shift+N"}],i=g(!1),o=g("");zs({combo:"Mod+K",description:"Open command palette",allowInInput:!0,handler:()=>i.value=!0});function h(w){o.value=w.title}return(w,c)=>(u(),y("div",Os,[n(p(J),{onClick:c[0]||(c[0]=e=>i.value=!0)},{default:l(()=>[...c[2]||(c[2]=[a("Open command palette (or press Mod+K)",-1)])]),_:1}),o.value?(u(),y("p",Hs,"Picked: "+j(o.value),1)):S("",!0),n(p(X),{open:i.value,"onUpdate:open":c[1]||(c[1]=e=>i.value=e),onSelect:h},{default:l(()=>[n(p(ss),{placeholder:"Search commands"}),n(p(as),null,{default:l(()=>[n(p(N),{label:"Pages"},{default:l(()=>[(u(),y(K,null,G(f,e=>n(p(R),{key:e.name,value:e,keywords:e.keywords},{prefix:l(()=>[s("span",{class:cs([e.icon,"mr-3 size-4 text-ink-gray-7"])},null,2)]),default:l(()=>[a(" "+j(e.title),1)]),_:2},1032,["value","keywords"])),64))]),_:1}),n(p(N),{label:"Actions"},{default:l(()=>[(u(),y(K,null,G(r,e=>n(p(R),{key:e.name,value:e},{prefix:l(()=>[s("span",{class:cs([e.icon,"mr-3 size-4 text-ink-gray-7"])},null,2)]),suffix:l(()=>[n(p(W),{combo:e.combo},null,8,["combo"])]),default:l(()=>[a(" "+j(e.title)+" ",1)]),_:2},1032,["value"])),64))]),_:1})]),_:1}),n(p(ns),null,{default:l(({query:e})=>[a(' Nothing matches "'+j(e)+'" ',1)]),_:1}),n(p(Ks),null,{default:l(()=>[n(p(W),{combo:"Enter"}),c[3]||(c[3]=a(" to run ",-1)),n(p(W),{combo:"Escape"}),c[4]||(c[4]=a(" to close ",-1))]),_:1})]),_:1},8,["open"])]))}}),ea=JSON.parse('{"title":"CommandPalette","description":"","frontmatter":{},"headers":[],"relativePath":"docs/experimental/commandpalette.md","filePath":"docs/experimental/commandpalette.md","lastUpdated":0}'),Js={name:"docs/experimental/commandpalette.md"},la=Object.assign(Js,{setup(m){const f=[{name:"filterable",description:"Filter the items against the query on the client. Set it to `false` when a\nserver search already decided what matches (ADR-0009), then refetch on\n`update:query` yourself.",required:!1,type:"boolean",default:"true"},{name:"title",description:`The dialog's accessible name, and the list's. It is read by screen readers
and never drawn, because the palette's shell has no header.`,required:!1,type:"string",default:'"Command palette"'},{name:"open",description:"Whether the palette is open.",required:!1,type:"boolean",default:"false"},{name:"query",description:"The search text. Cleared when the palette closes.",required:!1,type:"string",default:'""'}],r=[{name:"default",description:"The palette's parts. Receives the query, the active value and the empty state.",type:"CommandPaletteSlotProps"}],i=[{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"},{name:"select",description:"Fired when the user picks an item. The palette closes right after, unless\nthe handler calls `event.preventDefault()`.",type:"[value: AcceptableValue, event: CommandPaletteSelectEvent]"},{name:"update:query",description:"Fired when the query changes.",type:"[value: string]"}],o=[{name:"placeholder",description:"Placeholder text for the search field.",required:!1,type:"string",default:'"Search"'}],h=[{name:"prefix",description:"Replaces the leading search icon.",type:"any"},{name:"suffix",description:"Trailing content, after the field.",type:"any"}],w=[{name:"default",description:`The palette's groups and items. This element is the listbox itself, and a
listbox owns options and groups only, so anything else belongs outside it.`,type:"any"}],c=[{name:"label",description:"Heading above the group's items. Leave it out to group without a heading.",required:!1,type:"string"}],e=[{name:"default",description:"The group's `CommandPaletteItem`s.",type:"any"}],d=[{name:"value",description:"The value the palette reports in `select`.",required:!0,type:"AcceptableValue"},{name:"label",description:`Text the client filter matches. It defaults to the item's own rendered
text, so set it only when the default slot draws more than the label.
An item that draws no text at all has to set it, or the filter can never
narrow it away.`,required:!1,type:"string"},{name:"keywords",description:"Extra words the client filter matches, on top of the label.",required:!1,type:"string[]"},{name:"disabled",description:"Stop the user picking this item.",required:!1,type:"boolean"},{name:"as",description:"Element the item renders as. Use `a` with an `href` for a real link, so\nmiddle-click and modifier-click open a new tab.",required:!1,type:"string | Component",default:'"div"'}],I=[{name:"default",description:"The item's label. The client filter matches its text.",type:"CommandPaletteItemSlotProps"},{name:"prefix",description:"Leading content, before the label.",type:"CommandPaletteItemSlotProps"},{name:"suffix",description:"Trailing content, pushed to the end of the row.",type:"CommandPaletteItemSlotProps"}],T=[{name:"select",description:"Fired when this item is picked, before the palette's own `select`. Call\n`event.preventDefault()` to keep the palette open.",type:"[event: CommandPaletteSelectEvent]"}],C=[{name:"default",description:"The message. Receives the query so it can quote what the user typed.",type:"CommandPaletteEmptySlotProps"}],$=[{name:"default",description:"The footer's content. Receives the active value, so a hint can follow it.",type:"CommandPaletteFooterSlotProps"}];return(D,t)=>{const k=Is("ComponentPreview");return u(),y("div",null,[t[7]||(t[7]=O(`<h1 id="commandpalette" tabindex="-1">CommandPalette <a class="header-anchor" href="#commandpalette" aria-label="Permalink to “CommandPalette”">​</a></h1><p>A searchable list of commands in a dialog. Compose <code>CommandPaletteInput</code>, <code>CommandPaletteList</code>, <code>CommandPaletteGroup</code>, <code>CommandPaletteItem</code>, <code>CommandPaletteEmpty</code> and <code>CommandPaletteFooter</code> inside the <code>CommandPalette</code> root. The app writes the rows; the palette owns the dialog, the query, the keyboard and the filter.</p><p>Groups and items go inside <code>CommandPaletteList</code>, which is the list itself and the only part that scrolls. The field, the empty state and the footer are its siblings: a list may own rows and groups and nothing else, and keeping them outside it is also what stops them scrolling away.</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">CommandPalette</span><span class="s_1i4ay4"> v-model</span><span class="s_1jjt6x">:</span><span class="s_1i4ay4">open</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_22m8k2">open</span><span class="s_w1p9wo">&quot;</span><span class="s_1jjt6x"> @</span><span class="s_1i4ay4">select</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_22m8k2">select</span><span class="s_w1p9wo">&quot;</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_6am9cx">  &lt;CommandPaletteInput placeholder=&quot;Search commands&quot; /&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="s_6am9cx">  &lt;CommandPaletteList&gt;</span></span>
<span class="line"><span class="s_6am9cx">    &lt;CommandPaletteGroup label=&quot;Pages&quot;&gt;</span></span>
<span class="line"><span class="s_6am9cx">      &lt;CommandPaletteItem :value=&quot;page&quot;&gt;Inbox&lt;/CommandPaletteItem&gt;</span></span>
<span class="line"><span class="s_6am9cx">    &lt;/CommandPaletteGroup&gt;</span></span>
<span class="line"><span class="s_6am9cx">  &lt;/CommandPaletteList&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="s_6am9cx">  &lt;CommandPaletteEmpty&gt;No matches&lt;/CommandPaletteEmpty&gt;</span></span>
<span class="line"><span class="s_6am9cx">  &lt;CommandPaletteFooter&gt;&lt;KeyboardShortcut combo=&quot;Enter&quot; /&gt; to run&lt;/CommandPaletteFooter&gt;</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">CommandPalette</span><span class="s_1zd9e2">&gt;</span></span></code></pre></div><blockquote><p><strong>Experimental</strong> — the family ships from <a href="/docs/experimental"><code>frappe-ui/experimental</code></a> while its API settles, so it is exempt from the usual deprecation policy and can change shape or disappear in any release. The root <code>CommandPalette</code> was removed in <code>1.0.0</code>; see the <a href="/docs/migration#commandpalette">migration guide</a>.</p></blockquote><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_edvzsf">import</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_4q1z3w">  CommandPalette</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_4q1z3w">  CommandPaletteInput</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_4q1z3w">  CommandPaletteList</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_4q1z3w">  CommandPaletteGroup</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_4q1z3w">  CommandPaletteItem</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_4q1z3w">  CommandPaletteEmpty</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_4q1z3w">  CommandPaletteFooter</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">}</span><span class="s_edvzsf"> from</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">frappe-ui/experimental</span><span class="s_w1p9wo">&#39;</span></span></code></pre></div>`,6)),n(k,{name:"CommandPalette-Default"},{code:l(()=>[...t[0]||(t[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," KeyboardShortcut"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," useKeyboardShortcut"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPalette"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteEmpty"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteFooter"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteGroup"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteInput"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteList"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteItem"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},".."),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"CommandPaletteValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},".."),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// The client filter runs by default, so this list is written once and the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// palette narrows it as the user types.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," pages"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inbox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Inbox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-inbox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," keywords"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"mail"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"people"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"People"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-users"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"settings"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Settings"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-settings"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," actions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"new-task"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"New task"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-plus"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    combo"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Mod+N"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"new-note"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"New note"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-file-text"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    combo"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Mod+Shift+N"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," open"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"false"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," picked"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// The palette no longer registers a shortcut. The app decides when Mod+K")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// belongs to it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"useKeyboardShortcut"),s("span",{class:"s_13ahmt"},"({")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  combo"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Mod+K"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  description"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Open command palette"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  allowInInput"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  handler"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_22m8k2"},"open"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"})")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// `select` hands back exactly the object the item carried, typed as the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// palette's value union, so the handler narrows it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," select"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  picked"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_22m8k2"},"value"),s("span",{class:"s_2ekfrt"}," as"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_bsv8nz"},"title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"title")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col items-start gap-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1i4ay4"}," @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open = true"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Open command palette (or press Mod+K)"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"p"),s("span",{class:"s_1i4ay4"}," v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"picked"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-p-sm text-ink-gray-6"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Picked: {{ picked }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"p"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"CommandPalette"),s("span",{class:"s_1i4ay4"}," v-model:open"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," @select"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"select"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteInput"),s("span",{class:"s_1i4ay4"}," placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Search commands"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteList"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pages"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page in pages"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.name"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :keywords"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.keywords"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[page.icon, 'mr-3 size-4 text-ink-gray-7']"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            {{ page.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Actions"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action in actions"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action.name"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[action.icon, 'mr-3 size-4 text-ink-gray-7']"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            {{ action.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_wac0bt"},"KeyboardShortcut"),s("span",{class:"s_1i4ay4"}," :combo"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action.combo"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteList"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ query }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},'        Nothing matches "{{ query }}"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteFooter"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"KeyboardShortcut"),s("span",{class:"s_1i4ay4"}," combo"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Enter"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />"),s("span",{class:"s_6am9cx"}," to run")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"KeyboardShortcut"),s("span",{class:"s_1i4ay4"}," combo"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Escape"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />"),s("span",{class:"s_6am9cx"}," to close")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteFooter"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"CommandPalette"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(Qs)]),_:1}),t[8]||(t[8]=O(`<h2 id="opening-it" tabindex="-1">Opening it <a class="header-anchor" href="#opening-it" aria-label="Permalink to “Opening it”">​</a></h2><p>The palette registers no shortcut. Write the one line yourself, so the app decides when <code>Mod+K</code> belongs to the palette and when it belongs to a focused editor:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_indoxt">useKeyboardShortcut</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_r4oegk">  combo</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Mod+K</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  description</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Open command palette</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">  // Guards are off by default, so without this the shortcut dies as soon as</span></span>
<span class="line"><span class="s_1th9sy">  // any field has focus.</span></span>
<span class="line"><span class="s_r4oegk">  allowInInput</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> true</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">  handler</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> ()</span><span class="s_50ecpt"> =&gt;</span><span class="s_13ahmt"> (</span><span class="s_22m8k2">open</span><span class="s_1jjt6x">.</span><span class="s_11933w">value</span><span class="s_2ekfrt"> =</span><span class="s_40mev6"> true</span><span class="s_13ahmt">)</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">})</span></span></code></pre></div><h2 id="filtering" tabindex="-1">Filtering <a class="header-anchor" href="#filtering" aria-label="Permalink to “Filtering”">​</a></h2><p><code>filterable</code> is on by default. Each item matches when the query is a substring of its text, the same rule <a href="/docs/components/combobox"><code>Combobox</code></a> applies to its options.</p><p>An item filters on the text it renders in its default slot. <code>#prefix</code> and <code>#suffix</code> are left out, so a trailing shortcut hint or badge never becomes searchable. Add <code>keywords</code> for aliases the row does not show, and set <code>label</code> when the default slot draws more than the label.</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">CommandPaletteItem</span><span class="s_1jjt6x"> :</span><span class="s_1i4ay4">value</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_22m8k2">page</span><span class="s_w1p9wo">&quot;</span><span class="s_1jjt6x"> :</span><span class="s_1i4ay4">keywords</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_13ahmt">[</span><span class="s_w1p9wo">&#39;</span><span class="s_2575z4">mail</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">, </span><span class="s_w1p9wo">&#39;</span><span class="s_2575z4">unread</span><span class="s_w1p9wo">&#39;</span><span class="s_13ahmt">]</span><span class="s_w1p9wo">&quot;</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_6am9cx">  Inbox</span></span>
<span class="line"><span class="s_6am9cx">  &lt;template #suffix&gt;&lt;KeyboardShortcut combo=&quot;Mod+I&quot; /&gt;&lt;/template&gt;</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">CommandPaletteItem</span><span class="s_1zd9e2">&gt;</span></span></code></pre></div><p>A group hides itself, heading and all, once the filter empties it.</p><h2 id="server-side-search" tabindex="-1">Server-side search <a class="header-anchor" href="#server-side-search" aria-label="Permalink to “Server-side search”">​</a></h2><p>Set <code>:filterable=&quot;false&quot;</code> and refetch on <code>update:query</code>. The backend has already decided what matches, so a second pass on the client would drop its fuzzy and relevance-ranked rows.</p>`,10)),n(k,{name:"CommandPalette-ServerSearch"},{code:l(()=>[...t[1]||(t[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," watch"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPalette"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteEmpty"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteGroup"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteInput"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteList"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteItem"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},".."),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'// `:filterable="false"` hands the matching to the server. Without it, a')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// second literal substring pass on the client would drop the fuzzy and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// relevance-ranked rows the backend just returned (ADR-0009).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," everything"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"design-review"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Design review"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," team"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Product"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"release-plan"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Release plan"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," team"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Engineering"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"onboarding"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Onboarding checklist"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," team"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"People"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"q3-budget"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Q3 budget"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," team"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Finance"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," open"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"false"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," query"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," results"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_2ekfrt"},"typeof"),s("span",{class:"s_22m8k2"}," everything"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," loading"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"false"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"let"),s("span",{class:"s_2a1oer"}," timer"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ReturnType"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_2ekfrt"},"typeof"),s("span",{class:"s_22m8k2"}," setTimeout"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// A debounced refetch stands in for the real request.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"watch"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"query"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"text"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clearTimeout"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"timer"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"  if"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_50ecpt"},"!"),s("span",{class:"s_22m8k2"},"text"),s("span",{class:"s_13ahmt"},") {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    results"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    loading"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_40mev6"}," false")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"    return")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  loading"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_40mev6"}," true")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  timer"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," setTimeout"),s("span",{class:"s_13ahmt"},"(() "),s("span",{class:"s_50ecpt"},"=>"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"    const"),s("span",{class:"s_295sjd"}," needle"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," text"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"toLowerCase"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    results"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," everything"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"filter"),s("span",{class:"s_13ahmt"},"(")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"      ("),s("span",{class:"s_fsg3al"},"row"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_50ecpt"},"=>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"        row"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"title"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"toLowerCase"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"includes"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"needle"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_50ecpt"},"||")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"        row"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"team"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"toLowerCase"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"includes"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"needle"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    )")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    loading"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_40mev6"}," false")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 300"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"})")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col items-start gap-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1i4ay4"}," @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open = true"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Search the server"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"CommandPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model:open"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model:query"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"query"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :filterable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"false"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteInput"),s("span",{class:"s_1i4ay4"}," placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Search documents"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- The palette's own slot is open, so a loading row needs no extra")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      part. It sits outside the list, which owns options and groups only. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"loading"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"px-4.5 py-8 text-center text-base text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        Searching…")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteList"),s("span",{class:"s_1i4ay4"}," v-else"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Documents"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"row in results"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"row.name"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"row"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            {{ row.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ row.team }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteList"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1i4ay4"}," v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"!loading"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ query: text }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        {{ text ? `No documents match \"${text}\"` : 'Type to search' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"CommandPalette"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(Us)]),_:1}),t[9]||(t[9]=s("h2",{id:"items-that-are-links",tabindex:"-1"},[a("Items that are links "),s("a",{class:"header-anchor",href:"#items-that-are-links","aria-label":"Permalink to “Items that are links”"},"​")],-1)),t[10]||(t[10]=s("p",null,[a("Give an item "),s("code",null,'as="a"'),a(" and an "),s("code",null,"href"),a(" and it renders a real anchor, so middle-click and modifier-click open a new tab natively. "),s("code",null,"select"),a(" carries the click that picked the row in "),s("code",null,"event.detail.originalEvent"),a(", which is where the modifier keys are.")],-1)),n(k,{name:"CommandPalette-Links"},{code:l(()=>[...t[2]||(t[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPalette"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteEmpty"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteGroup"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteInput"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteList"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteItem"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},".."),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"CommandPaletteSelectEvent"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," CommandPaletteValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},".."),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'// `as="a"` plus `href` makes the row a real link, so middle-click,')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'// Cmd-click and "open in a new tab" all work the way the browser does')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// them. Nothing here re-implements that.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," docs"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," link"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/docs/components/button"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," text"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Button"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," link"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/docs/components/dialog"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," text"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Dialog"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," link"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/docs/components/combobox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," text"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Combobox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," open"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"false"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," visited"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," select"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," item"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," value"),s("span",{class:"s_2ekfrt"}," as"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_bsv8nz"},"link"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"}," }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," click"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," event"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_22m8k2"},"detail"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"originalEvent")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Let the browser take modifier-clicks through the `href`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"  if"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_22m8k2"},"click"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"metaKey"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_22m8k2"}," click"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"ctrlKey"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_22m8k2"}," click"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"shiftKey"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_22m8k2"}," click"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"button"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 1"),s("span",{class:"s_13ahmt"},") {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"    return")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  click"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"preventDefault"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  visited"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," item"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"link")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col items-start gap-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1i4ay4"}," @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open = true"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Search the docs"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"p"),s("span",{class:"s_1i4ay4"}," v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"visited"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-p-sm text-ink-gray-6"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"      Would navigate to {{ visited }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"p"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"CommandPalette"),s("span",{class:"s_1i4ay4"}," v-model:open"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," @select"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"select"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteInput"),s("span",{class:"s_1i4ay4"}," placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Search documentation"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteList"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Components"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page in docs"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.link"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            as"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"a"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :href"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.link"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            {{ page.text }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteList"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"CommandPalette"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(Rs)]),_:1}),t[11]||(t[11]=O(`<h2 id="keeping-it-open" tabindex="-1">Keeping it open <a class="header-anchor" href="#keeping-it-open" aria-label="Permalink to “Keeping it open”">​</a></h2><p>The palette closes after a pick. Call <code>event.preventDefault()</code> in the <code>select</code> handler to keep it open, for a row that switches the palette into a mode instead of running a command.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_50ecpt">function</span><span class="s_indoxt"> select</span><span class="s_13ahmt">(</span><span class="s_fsg3al">value</span><span class="s_1jjt6x">,</span><span class="s_fsg3al"> event</span><span class="s_13ahmt">)</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_50ecpt">  if</span><span class="s_13ahmt"> (</span><span class="s_22m8k2">value</span><span class="s_1jjt6x">.</span><span class="s_11933w">kind</span><span class="s_50ecpt"> ===</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">mode</span><span class="s_w1p9wo">&#39;</span><span class="s_13ahmt">) {</span></span>
<span class="line"><span class="s_22m8k2">    event</span><span class="s_1jjt6x">.</span><span class="s_indoxt">preventDefault</span><span class="s_13ahmt">()</span></span>
<span class="line"><span class="s_22m8k2">    mode</span><span class="s_1jjt6x">.</span><span class="s_11933w">value</span><span class="s_2ekfrt"> =</span><span class="s_22m8k2"> value</span><span class="s_1jjt6x">.</span><span class="s_11933w">name</span></span>
<span class="line"><span class="s_13ahmt">  }</span></span>
<span class="line"><span class="s_13ahmt">}</span></span></code></pre></div><h2 id="styling-hooks" tabindex="-1">Styling hooks <a class="header-anchor" href="#styling-hooks" aria-label="Permalink to “Styling hooks”">​</a></h2><p>Every part stamps <code>data-slot</code>. An item adds <code>data-state=&quot;active&quot;</code> while the keyboard or the pointer is on it, and <code>data-disabled</code> when it cannot be picked. Items hand <code>active</code> and <code>disabled</code> to every one of their slots.</p><p>There is no selected state. A pick closes the palette, and a pick that keeps it open does so by preventing the event, which is the same signal that tells the list not to record the row.</p><h2 id="api-reference" tabindex="-1">API Reference <a class="header-anchor" href="#api-reference" aria-label="Permalink to “API Reference”">​</a></h2><h3 id="commandpalette-1" tabindex="-1">CommandPalette <a class="header-anchor" href="#commandpalette-1" aria-label="Permalink to “CommandPalette”">​</a></h3>`,8)),n(F,{name:"CommandPalette",data:f},{code:l(()=>[...t[3]||(t[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A value a `CommandPaletteItem` can carry. The palette hands it back")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * untouched in `select`, so most apps pass their own command object.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AcceptableValue")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * The event `CommandPalette` and `CommandPaletteItem` emit on `select`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `detail.originalEvent` is the click that picked the item, so a caller can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * read `metaKey`, `ctrlKey`, `shiftKey` and `button`. Call `preventDefault()`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * on the event itself to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," CustomEvent"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  originalEvent"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," PointerEvent")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Filter the items against the query on the client. Set it to `false` when a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * server search already decided what matches (ADR-0009), then refetch on")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `update:query` yourself.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  filterable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name, and the list's. It is read by screen readers")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * and never drawn, because the palette's shell has no header.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when the user picks an item. The palette closes right after, unless")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the handler calls `event.preventDefault()`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"value"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether no item is on screen, hidden by the query or never given. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  empty"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteInputProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text for the search field. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteGroupProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heading above the group's items. Leave it out to group without a heading. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * An item that draws no text at all has to set it, or the filter can never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * narrow it away.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Extra words the client filter matches, on top of the label. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keywords"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Stop the user picking this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Element the item renders as. Use `a` with an `href` for a real link, so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * middle-click and modifier-click open a new tab.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  as"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when this item is picked, before the palette's own `select`. Call")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `event.preventDefault()` to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the keyboard or the pointer is on this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the item cannot be picked. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmptySlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteFooterSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(q,{data:r}),n(es,{data:i}),t[12]||(t[12]=s("h3",{id:"commandpaletteinput",tabindex:"-1"},[a("CommandPaletteInput "),s("a",{class:"header-anchor",href:"#commandpaletteinput","aria-label":"Permalink to “CommandPaletteInput”"},"​")],-1)),n(F,{name:"CommandPaletteInput",data:o},{code:l(()=>[...t[4]||(t[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A value a `CommandPaletteItem` can carry. The palette hands it back")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * untouched in `select`, so most apps pass their own command object.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AcceptableValue")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * The event `CommandPalette` and `CommandPaletteItem` emit on `select`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `detail.originalEvent` is the click that picked the item, so a caller can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * read `metaKey`, `ctrlKey`, `shiftKey` and `button`. Call `preventDefault()`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * on the event itself to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," CustomEvent"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  originalEvent"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," PointerEvent")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Filter the items against the query on the client. Set it to `false` when a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * server search already decided what matches (ADR-0009), then refetch on")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `update:query` yourself.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  filterable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name, and the list's. It is read by screen readers")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * and never drawn, because the palette's shell has no header.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when the user picks an item. The palette closes right after, unless")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the handler calls `event.preventDefault()`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"value"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether no item is on screen, hidden by the query or never given. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  empty"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteInputProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text for the search field. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteGroupProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heading above the group's items. Leave it out to group without a heading. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * An item that draws no text at all has to set it, or the filter can never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * narrow it away.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Extra words the client filter matches, on top of the label. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keywords"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Stop the user picking this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Element the item renders as. Use `a` with an `href` for a real link, so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * middle-click and modifier-click open a new tab.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  as"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when this item is picked, before the palette's own `select`. Call")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `event.preventDefault()` to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the keyboard or the pointer is on this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the item cannot be picked. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmptySlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteFooterSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(q,{data:h}),t[13]||(t[13]=s("h3",{id:"commandpalettelist",tabindex:"-1"},[a("CommandPaletteList "),s("a",{class:"header-anchor",href:"#commandpalettelist","aria-label":"Permalink to “CommandPaletteList”"},"​")],-1)),n(q,{data:w}),t[14]||(t[14]=s("h3",{id:"commandpalettegroup",tabindex:"-1"},[a("CommandPaletteGroup "),s("a",{class:"header-anchor",href:"#commandpalettegroup","aria-label":"Permalink to “CommandPaletteGroup”"},"​")],-1)),n(F,{name:"CommandPaletteGroup",data:c},{code:l(()=>[...t[5]||(t[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A value a `CommandPaletteItem` can carry. The palette hands it back")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * untouched in `select`, so most apps pass their own command object.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AcceptableValue")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * The event `CommandPalette` and `CommandPaletteItem` emit on `select`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `detail.originalEvent` is the click that picked the item, so a caller can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * read `metaKey`, `ctrlKey`, `shiftKey` and `button`. Call `preventDefault()`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * on the event itself to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," CustomEvent"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  originalEvent"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," PointerEvent")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Filter the items against the query on the client. Set it to `false` when a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * server search already decided what matches (ADR-0009), then refetch on")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `update:query` yourself.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  filterable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name, and the list's. It is read by screen readers")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * and never drawn, because the palette's shell has no header.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when the user picks an item. The palette closes right after, unless")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the handler calls `event.preventDefault()`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"value"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether no item is on screen, hidden by the query or never given. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  empty"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteInputProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text for the search field. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteGroupProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heading above the group's items. Leave it out to group without a heading. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * An item that draws no text at all has to set it, or the filter can never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * narrow it away.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Extra words the client filter matches, on top of the label. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keywords"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Stop the user picking this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Element the item renders as. Use `a` with an `href` for a real link, so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * middle-click and modifier-click open a new tab.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  as"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when this item is picked, before the palette's own `select`. Call")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `event.preventDefault()` to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the keyboard or the pointer is on this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the item cannot be picked. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmptySlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteFooterSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(q,{data:e}),t[15]||(t[15]=s("h3",{id:"commandpaletteitem",tabindex:"-1"},[a("CommandPaletteItem "),s("a",{class:"header-anchor",href:"#commandpaletteitem","aria-label":"Permalink to “CommandPaletteItem”"},"​")],-1)),n(F,{name:"CommandPaletteItem",data:d},{code:l(()=>[...t[6]||(t[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A value a `CommandPaletteItem` can carry. The palette hands it back")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * untouched in `select`, so most apps pass their own command object.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AcceptableValue")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * The event `CommandPalette` and `CommandPaletteItem` emit on `select`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `detail.originalEvent` is the click that picked the item, so a caller can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * read `metaKey`, `ctrlKey`, `shiftKey` and `button`. Call `preventDefault()`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * on the event itself to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," CustomEvent"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  originalEvent"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," PointerEvent")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Filter the items against the query on the client. Set it to `false` when a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * server search already decided what matches (ADR-0009), then refetch on")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `update:query` yourself.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  filterable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name, and the list's. It is read by screen readers")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * and never drawn, because the palette's shell has no header.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when the user picks an item. The palette closes right after, unless")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the handler calls `event.preventDefault()`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"value"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether no item is on screen, hidden by the query or never given. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  empty"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteInputProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text for the search field. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteGroupProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heading above the group's items. Leave it out to group without a heading. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * An item that draws no text at all has to set it, or the filter can never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * narrow it away.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Extra words the client filter matches, on top of the label. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keywords"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Stop the user picking this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Element the item renders as. Use `a` with an `href` for a real link, so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * middle-click and modifier-click open a new tab.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  as"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired when this item is picked, before the palette's own `select`. Call")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `event.preventDefault()` to keep the palette open.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," CommandPaletteSelectEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the keyboard or the pointer is on this item. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the item cannot be picked. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteEmptySlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The current search text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  query"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteFooterSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value of the item the keyboard is on, or `undefined`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(q,{data:I}),n(es,{data:T}),t[16]||(t[16]=s("h3",{id:"commandpaletteempty",tabindex:"-1"},[a("CommandPaletteEmpty "),s("a",{class:"header-anchor",href:"#commandpaletteempty","aria-label":"Permalink to “CommandPaletteEmpty”"},"​")],-1)),n(q,{data:C}),t[17]||(t[17]=s("h3",{id:"commandpalettefooter",tabindex:"-1"},[a("CommandPaletteFooter "),s("a",{class:"header-anchor",href:"#commandpalettefooter","aria-label":"Permalink to “CommandPaletteFooter”"},"​")],-1)),n(q,{data:$})])}}});export{ea as __pageData,la as default};
