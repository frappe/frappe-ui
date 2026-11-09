import{_ as K}from"./chunks/PropsTable.DMb0kJFT.js";import{_ as S}from"./chunks/SlotsTable.BhoDj-rT.js";import{_ as es}from"./chunks/EmitsTable.DEqllUtK.js";import{r as ms,V as hs,m as us,l as fs,n as ws,L as ys,o as vs,p as xs,bi as js,q as zs,bs,K as J,bA as ks,af as W}from"./chunks/theme.88n3FgOv.js";import{Q as Z,ag as X,J as k,aV as ls,b2 as H,b9 as Q,ae as h,p as P,bf as e,E as n,aG as p,$ as M,D as a,aw as z,ao as b,a2 as A,M as L,Z as ts,at as U,l as j,a0 as gs,aD as ps,r as x,o as s,bg as Ps,b8 as Cs,q as I,aI as qs,aa as Ss,ad as Is,ac as Ts,aq as Es,ak as g,F as G,an as N,a1 as cs,ap as Vs,B as O}from"./chunks/framework.Dz2Djkpf.js";const is=Symbol("frappe-ui:command-palette"),os=Symbol("frappe-ui:command-palette-group"),_s=Symbol("frappe-ui:command-palette-list");function As(m){X(is,m)}function $(){return Z(is,null)}function Ls(m){X(os,m)}function $s(){return Z(os,null)}function Ds(){X(_s,!0)}function rs(){return Z(_s,null)}const Y=k({name:"CommandPalette",inheritAttrs:!1,__name:"CommandPalette",props:ts({filterable:{type:Boolean,default:!0},title:{default:"Command palette"}},{open:{type:Boolean,default:!1},openModifiers:{},query:{default:""},queryModifiers:{}}),emits:ts(["select"],["update:open","update:query"]),setup(m,{emit:u}){const _=m,i=u,o=ls(m,"open"),r=ls(m,"query"),f=H("listbox"),c=U(),l=U(),d=U(new Map);function T(w,v){return d.value.set(w,v),ps(d),()=>{d.value.delete(w),ps(d)}}function E(w){for(const v of d.value.values())if(v.groupId===w&&v.visible.value)return!0;return!1}const C=j(()=>{for(const w of d.value.values())if(w.visible.value)return!1;return!0});function V(w,v){const y=r.value.trim().toLowerCase();return y?[w,...v].join(" ").toLowerCase().includes(y):!0}function D(w,v){i("select",w,v),!v.defaultPrevented&&(o.value=!1)}function t(){r.value="",c.value=void 0,l.value=void 0}function q(w){c.value=w?.value}Q([o,r],async()=>{o.value&&(await gs(),f.value?.highlightFirstItem())},{immediate:!0}),Q(C,w=>{!w||!f.value||(f.value.highlightedElement=null,c.value=void 0)},{flush:"post"});const F=j(()=>({query:r.value,active:c.value,empty:C.value}));return As({query:r,title:j(()=>_.title),filterable:j(()=>_.filterable),activeValue:c,empty:C,matches:V,registerItem:T,groupHasVisibleItems:E,select:D}),(w,v)=>(h(),P(fs,{open:o.value,"onUpdate:open":v[1]||(v[1]=y=>o.value=y),size:"xl",position:"top",bare:"",onAfterLeave:t},{default:e(()=>[n(p(ms),M({ref_key:"listbox",ref:f,modelValue:l.value,"onUpdate:modelValue":v[0]||(v[0]=y=>l.value=y),as:"div","data-slot":"command-palette",class:"flex max-h-[60vh] flex-col"},w.$attrs,{"highlight-on-hover":"","selection-behavior":"replace",onHighlight:q}),{default:e(()=>[n(p(hs),{"as-child":""},{default:e(()=>[n(p(us),null,{default:e(()=>[a(z(m.title),1)]),_:1})]),_:1}),b(w.$slots,"default",A(L(F.value)))]),_:3},16,["modelValue"])]),_:3},8,["open"]))}}),Fs={"data-slot":"command-palette-input",class:"flex shrink-0 items-center gap-3 border-b border-outline-gray-1 px-4.5 dark:border-outline-gray-2"},ss=k({name:"CommandPaletteInput",inheritAttrs:!1,__name:"CommandPaletteInput",props:{placeholder:{default:"Search"}},setup(m){const u=$(),_=j({get:()=>u?.query.value??"",set:i=>{u&&(u.query.value=i)}});return(i,o)=>(h(),x("div",Fs,[b(i.$slots,"prefix",{},()=>[o[1]||(o[1]=s("span",{class:"lucide-search size-4 shrink-0 text-ink-gray-6"},null,-1))]),n(p(ws),M({modelValue:_.value,"onUpdate:modelValue":o[0]||(o[0]=r=>_.value=r),as:"input","auto-focus":"",autocomplete:"off",placeholder:m.placeholder,class:"w-full border-none bg-transparent py-3 px-0 text-base leading-tighter text-ink-gray-8 placeholder-ink-gray-4 focus:ring-0"},i.$attrs),null,16,["modelValue","placeholder"]),b(i.$slots,"suffix")]))}}),as=k({name:"CommandPaletteList",__name:"CommandPaletteList",setup(m){const u=$();return Ds(),(_,i)=>(h(),P(p(ys),{as:"div","data-slot":"command-palette-list","aria-label":p(u)?.title.value,class:"min-h-0 overflow-y-auto overscroll-contain focus-visible:outline-none"},{default:e(()=>[b(_.$slots,"default")]),_:3},8,["aria-label"]))}}),R=k({name:"CommandPaletteGroup",__name:"CommandPaletteGroup",props:{label:{}},setup(m){const u=$();rs();const _=Symbol("command-palette-group");Ls({id:_});const i=j(()=>u?.groupHasVisibleItems(_)??!0);return(o,r)=>Ps((h(),P(p(xs),{as:"div","data-slot":"command-palette-group",class:"mb-2 mt-4.5 first:mt-3"},{default:e(()=>[m.label?(h(),P(p(vs),{key:0,as:"div","data-slot":"command-palette-group-label",class:"mb-2.5 px-4.5 text-base leading-tighter text-ink-gray-5"},{default:e(()=>[a(z(m.label),1)]),_:1})):I("",!0),b(o.$slots,"default")]),_:3},512)),[[Cs,i.value]])}}),Ks={key:0,class:"ml-auto whitespace-nowrap pl-2"},B=k({name:"CommandPaletteItem",inheritAttrs:!1,__name:"CommandPaletteItem",props:{value:{},label:{},keywords:{},disabled:{type:Boolean},as:{default:"div"}},emits:["select"],setup(m,{emit:u}){const _=m,i=u,o=$(),r=qs(),f=j(()=>"href"in r?{...r,href:bs(r.href)}:r),c=$s();rs();const l=Symbol("command-palette-item"),d=H("labelEl"),T=g("");function E(){const y=d.value?.textContent?.trim();y&&(T.value=y)}Ss(()=>{E()}),Is(()=>{E()});const C=j(()=>_.label??T.value),V=j(()=>!o||!o.filterable.value||!C.value?!0:o.matches(C.value,_.keywords??[])),D=o?.registerItem(l,{groupId:c?.id??null,visible:V});Ts(()=>D?.());const t=js(null),q=H("item"),F=j(()=>{const y=q.value?.$el;return!!y&&t?.highlightedElement.value===y}),w=j(()=>({active:F.value,disabled:_.disabled??!1}));function v(y){i("select",y),!y.defaultPrevented&&o?.select(_.value,y)}return(y,ds)=>V.value?(h(),P(p(zs),{key:0,ref_key:"item",ref:q,value:m.value,disabled:m.disabled,"as-child":"",onSelect:v},{default:e(()=>[(h(),P(Es(m.as),M({"data-slot":"command-palette-item","data-state":F.value?"active":void 0,"data-disabled":m.disabled?"":void 0,class:"mx-2.5 flex min-w-0 cursor-default items-center rounded-4 px-2 py-2 text-base-medium leading-tighter text-ink-gray-8 outline-none data-[state=active]:bg-surface-gray-2 data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-gray-4"},f.value),{default:e(()=>[b(y.$slots,"prefix",A(L(w.value))),s("span",{ref_key:"labelEl",ref:d,"data-slot":"command-palette-item-label",class:"overflow-hidden text-ellipsis whitespace-nowrap"},[b(y.$slots,"default",A(L(w.value)))],512),y.$slots.suffix?(h(),x("span",Ks,[b(y.$slots,"suffix",A(L(w.value)))])):I("",!0)]),_:3},16,["data-state","data-disabled"]))]),_:3},8,["value","disabled"])):I("",!0)}}),Gs={role:"status"},ns=k({name:"CommandPaletteEmpty",inheritAttrs:!1,__name:"CommandPaletteEmpty",setup(m){const u=$(),_=j(()=>u?.empty.value??!1),i=j(()=>({query:u?.query.value??""})),o=j(()=>i.value.query?`No results for "${i.value.query}"`:"No results");return(r,f)=>(h(),x("div",Gs,[_.value?(h(),x("div",M({key:0},r.$attrs,{"data-slot":"command-palette-empty",class:"px-4.5 py-8 text-center text-base text-ink-gray-6"}),[b(r.$slots,"default",A(L(i.value)),()=>[a(z(o.value),1)])],16)):I("",!0)]))}}),Ns={"data-slot":"command-palette-footer",class:"flex shrink-0 items-center gap-4 border-t border-outline-gray-1 px-4.5 py-2 text-sm leading-tighter text-ink-gray-6 dark:border-outline-gray-2"},Rs=k({name:"CommandPaletteFooter",__name:"CommandPaletteFooter",setup(m){const u=$(),_=j(()=>({active:u?.activeValue.value}));return(i,o)=>(h(),x("div",Ns,[b(i.$slots,"default",A(L(_.value)))]))}}),Bs={class:"flex flex-col items-start gap-3"},Ms={key:0,class:"text-p-sm text-ink-gray-6"},Ws=k({__name:"Links",setup(m){const u=[{link:"/docs/components/button",text:"Button"},{link:"/docs/components/dialog",text:"Dialog"},{link:"/docs/components/combobox",text:"Combobox"}],_=g(!1),i=g("");function o(r,f){const c=r,l=f.detail.originalEvent;l.metaKey||l.ctrlKey||l.shiftKey||l.button===1||(l.preventDefault(),i.value=c.link)}return(r,f)=>(h(),x("div",Bs,[n(p(J),{onClick:f[0]||(f[0]=c=>_.value=!0)},{default:e(()=>[...f[2]||(f[2]=[a("Search the docs",-1)])]),_:1}),i.value?(h(),x("p",Ms," Would navigate to "+z(i.value),1)):I("",!0),n(p(Y),{open:_.value,"onUpdate:open":f[1]||(f[1]=c=>_.value=c),onSelect:o},{default:e(()=>[n(p(ss),{placeholder:"Search documentation"}),n(p(as),null,{default:e(()=>[n(p(R),{label:"Components"},{default:e(()=>[(h(),x(G,null,N(u,c=>n(p(B),{key:c.link,as:"a",href:c.link,value:c},{default:e(()=>[a(z(c.text),1)]),_:2},1032,["href","value"])),64))]),_:1})]),_:1}),n(p(ns))]),_:1},8,["open"])]))}}),Us={class:"flex flex-col items-start gap-3"},Os={key:0,class:"px-4.5 py-8 text-center text-base text-ink-gray-5"},Hs={class:"text-ink-gray-5"},Qs=k({__name:"ServerSearch",setup(m){const u=[{name:"design-review",title:"Design review",team:"Product"},{name:"release-plan",title:"Release plan",team:"Engineering"},{name:"onboarding",title:"Onboarding checklist",team:"People"},{name:"q3-budget",title:"Q3 budget",team:"Finance"}],_=g(!1),i=g(""),o=g([]),r=g(!1);let f;return Q(i,c=>{if(clearTimeout(f),!c){o.value=[],r.value=!1;return}r.value=!0,f=setTimeout(()=>{const l=c.toLowerCase();o.value=u.filter(d=>d.title.toLowerCase().includes(l)||d.team.toLowerCase().includes(l)),r.value=!1},300)}),(c,l)=>(h(),x("div",Us,[n(p(J),{onClick:l[0]||(l[0]=d=>_.value=!0)},{default:e(()=>[...l[3]||(l[3]=[a("Search the server",-1)])]),_:1}),n(p(Y),{open:_.value,"onUpdate:open":l[1]||(l[1]=d=>_.value=d),query:i.value,"onUpdate:query":l[2]||(l[2]=d=>i.value=d),filterable:!1},{default:e(()=>[n(p(ss),{placeholder:"Search documents"}),r.value?(h(),x("div",Os," Searching… ")):(h(),P(p(as),{key:1},{default:e(()=>[n(p(R),{label:"Documents"},{default:e(()=>[(h(!0),x(G,null,N(o.value,d=>(h(),P(p(B),{key:d.name,value:d},{suffix:e(()=>[s("span",Hs,z(d.team),1)]),default:e(()=>[a(z(d.title)+" ",1)]),_:2},1032,["value"]))),128))]),_:1})]),_:1})),r.value?I("",!0):(h(),P(p(ns),{key:2},{default:e(({query:d})=>[a(z(d?`No documents match "${d}"`:"Type to search"),1)]),_:1}))]),_:1},8,["open","query"])]))}}),Js={class:"flex flex-col items-start gap-3"},Zs={key:0,class:"text-p-sm text-ink-gray-6"},Xs=k({__name:"Default",setup(m){const u=[{name:"inbox",title:"Inbox",icon:"lucide-inbox",keywords:["mail"]},{name:"people",title:"People",icon:"lucide-users"},{name:"settings",title:"Settings",icon:"lucide-settings"}],_=[{name:"new-task",title:"New task",icon:"lucide-plus",combo:"Mod+N"},{name:"new-note",title:"New note",icon:"lucide-file-text",combo:"Mod+Shift+N"}],i=g(!1),o=g("");ks({combo:"Mod+K",description:"Open command palette",allowInInput:!0,handler:()=>i.value=!0});function r(f){o.value=f.title}return(f,c)=>(h(),x("div",Js,[n(p(J),{onClick:c[0]||(c[0]=l=>i.value=!0)},{default:e(()=>[...c[2]||(c[2]=[a("Open command palette (or press Mod+K)",-1)])]),_:1}),o.value?(h(),x("p",Zs,"Picked: "+z(o.value),1)):I("",!0),n(p(Y),{open:i.value,"onUpdate:open":c[1]||(c[1]=l=>i.value=l),onSelect:r},{default:e(()=>[n(p(ss),{placeholder:"Search commands"}),n(p(as),null,{default:e(()=>[n(p(R),{label:"Pages"},{default:e(()=>[(h(),x(G,null,N(u,l=>n(p(B),{key:l.name,value:l,keywords:l.keywords},{prefix:e(()=>[s("span",{class:cs([l.icon,"mr-3 size-4 text-ink-gray-7"])},null,2)]),default:e(()=>[a(" "+z(l.title),1)]),_:2},1032,["value","keywords"])),64))]),_:1}),n(p(R),{label:"Actions"},{default:e(()=>[(h(),x(G,null,N(_,l=>n(p(B),{key:l.name,value:l},{prefix:e(()=>[s("span",{class:cs([l.icon,"mr-3 size-4 text-ink-gray-7"])},null,2)]),suffix:e(()=>[n(p(W),{combo:l.combo},null,8,["combo"])]),default:e(()=>[a(" "+z(l.title)+" ",1)]),_:2},1032,["value"])),64))]),_:1})]),_:1}),n(p(ns),null,{default:e(({query:l})=>[a(' Nothing matches "'+z(l)+'" ',1)]),_:1}),n(p(Rs),null,{default:e(()=>[n(p(W),{combo:"Enter"}),c[3]||(c[3]=a(" to run ",-1)),n(p(W),{combo:"Escape"}),c[4]||(c[4]=a(" to close ",-1))]),_:1})]),_:1},8,["open"])]))}}),ta=JSON.parse('{"title":"CommandPalette","description":"","frontmatter":{},"headers":[],"relativePath":"docs/experimental/commandpalette.md","filePath":"docs/experimental/commandpalette.md","lastUpdated":0}'),Ys={name:"docs/experimental/commandpalette.md"},pa=Object.assign(Ys,{setup(m){const u=[{name:"filterable",description:"Filter the items against the query on the client. Set it to `false` when a\nserver search already decided what matches (ADR-0009), then refetch on\n`update:query` yourself.",required:!1,type:"boolean",default:"true"},{name:"title",description:`The dialog's accessible name, and the list's. It is read by screen readers
and never drawn, because the palette's shell has no header.`,required:!1,type:"string",default:'"Command palette"'},{name:"open",description:"Whether the palette is open.",required:!1,type:"boolean",default:"false"},{name:"query",description:"The search text. Cleared when the palette closes.",required:!1,type:"string",default:'""'}],_=[{name:"default",description:"The palette's parts. Receives the query, the active value and the empty state.",type:"CommandPaletteSlotProps"}],i=[{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"},{name:"select",description:"Fired when the user picks an item. The palette closes right after, unless\nthe handler calls `event.preventDefault()`.",type:"[value: AcceptableValue, event: CommandPaletteSelectEvent]"},{name:"update:query",description:"Fired when the query changes.",type:"[value: string]"}],o=[{name:"placeholder",description:"Placeholder text for the search field.",required:!1,type:"string",default:'"Search"'}],r=[{name:"prefix",description:"Replaces the leading search icon.",type:"any"},{name:"suffix",description:"Trailing content, after the field.",type:"any"}],f=[{name:"default",description:`The palette's groups and items. This element is the listbox itself, and a
listbox owns options and groups only, so anything else belongs outside it.`,type:"any"}],c=[{name:"label",description:"Heading above the group's items. Leave it out to group without a heading.",required:!1,type:"string"}],l=[{name:"default",description:"The group's `CommandPaletteItem`s.",type:"any"}],d=[{name:"value",description:"The value the palette reports in `select`.",required:!0,type:"AcceptableValue"},{name:"label",description:`Text the client filter matches. It defaults to the item's own rendered
text, so set it only when the default slot draws more than the label.
An item that draws no text at all has to set it, or the filter can never
narrow it away.`,required:!1,type:"string"},{name:"keywords",description:"Extra words the client filter matches, on top of the label.",required:!1,type:"string[]"},{name:"disabled",description:"Stop the user picking this item.",required:!1,type:"boolean"},{name:"as",description:"Element the item renders as. Use `a` with an `href` for a real link, so\nmiddle-click and modifier-click open a new tab.",required:!1,type:"string | Component",default:'"div"'}],T=[{name:"default",description:"The item's label. The client filter matches its text.",type:"CommandPaletteItemSlotProps"},{name:"prefix",description:"Leading content, before the label.",type:"CommandPaletteItemSlotProps"},{name:"suffix",description:"Trailing content, pushed to the end of the row.",type:"CommandPaletteItemSlotProps"}],E=[{name:"select",description:"Fired when this item is picked, before the palette's own `select`. Call\n`event.preventDefault()` to keep the palette open.",type:"[event: CommandPaletteSelectEvent]"}],C=[{name:"default",description:"The message. Receives the query so it can quote what the user typed.",type:"CommandPaletteEmptySlotProps"}],V=[{name:"default",description:"The footer's content. Receives the active value, so a hint can follow it.",type:"CommandPaletteFooterSlotProps"}];return(D,t)=>{const q=Vs("ComponentPreview");return h(),x("div",null,[t[7]||(t[7]=O("",6)),n(q,{name:"CommandPalette-Default"},{code:e(()=>[...t[0]||(t[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[n(Xs)]),_:1}),t[8]||(t[8]=O("",10)),n(q,{name:"CommandPalette-ServerSearch"},{code:e(()=>[...t[1]||(t[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[n(Qs)]),_:1}),t[9]||(t[9]=s("h2",{id:"items-that-are-links",tabindex:"-1"},[a("Items that are links "),s("a",{class:"header-anchor",href:"#items-that-are-links","aria-label":"Permalink to “Items that are links”"},"​")],-1)),t[10]||(t[10]=s("p",null,[a("Give an item "),s("code",null,'as="a"'),a(" and an "),s("code",null,"href"),a(" and it renders a real anchor, so middle-click and modifier-click open a new tab natively. "),s("code",null,"select"),a(" carries the click that picked the row in "),s("code",null,"event.detail.originalEvent"),a(", which is where the modifier keys are.")],-1)),n(q,{name:"CommandPalette-Links"},{code:e(()=>[...t[2]||(t[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[n(Ws)]),_:1}),t[11]||(t[11]=O("",8)),n(K,{name:"CommandPalette",data:u},{code:e(()=>[...t[3]||(t[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(S,{data:_}),n(es,{data:i}),t[12]||(t[12]=s("h3",{id:"commandpaletteinput",tabindex:"-1"},[a("CommandPaletteInput "),s("a",{class:"header-anchor",href:"#commandpaletteinput","aria-label":"Permalink to “CommandPaletteInput”"},"​")],-1)),n(K,{name:"CommandPaletteInput",data:o},{code:e(()=>[...t[4]||(t[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(S,{data:r}),t[13]||(t[13]=s("h3",{id:"commandpalettelist",tabindex:"-1"},[a("CommandPaletteList "),s("a",{class:"header-anchor",href:"#commandpalettelist","aria-label":"Permalink to “CommandPaletteList”"},"​")],-1)),n(S,{data:f}),t[14]||(t[14]=s("h3",{id:"commandpalettegroup",tabindex:"-1"},[a("CommandPaletteGroup "),s("a",{class:"header-anchor",href:"#commandpalettegroup","aria-label":"Permalink to “CommandPaletteGroup”"},"​")],-1)),n(K,{name:"CommandPaletteGroup",data:c},{code:e(()=>[...t[5]||(t[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(S,{data:l}),t[15]||(t[15]=s("h3",{id:"commandpaletteitem",tabindex:"-1"},[a("CommandPaletteItem "),s("a",{class:"header-anchor",href:"#commandpaletteitem","aria-label":"Permalink to “CommandPaletteItem”"},"​")],-1)),n(K,{name:"CommandPaletteItem",data:d},{code:e(()=>[...t[6]||(t[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(S,{data:T}),n(es,{data:E}),t[16]||(t[16]=s("h3",{id:"commandpaletteempty",tabindex:"-1"},[a("CommandPaletteEmpty "),s("a",{class:"header-anchor",href:"#commandpaletteempty","aria-label":"Permalink to “CommandPaletteEmpty”"},"​")],-1)),n(S,{data:C}),t[17]||(t[17]=s("h3",{id:"commandpalettefooter",tabindex:"-1"},[a("CommandPaletteFooter "),s("a",{class:"header-anchor",href:"#commandpalettefooter","aria-label":"Permalink to “CommandPaletteFooter”"},"​")],-1)),n(S,{data:V})])}}});export{ta as __pageData,pa as default};
