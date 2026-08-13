import{_ as K}from"./chunks/PropsTable.DT4DWdwl.js";import{_ as E}from"./chunks/SlotsTable.ChDjSTq7.js";import{_ as X}from"./chunks/EmitsTable.BPsvu1WE.js";import{r as os,V as rs,m as ds,L as ms,l as hs,n as us,o as fs,p as ws,bi as ys,q as vs,J as H,bx as xs,aa as B}from"./chunks/theme.CKOvzESB.js";import{P as ls,af as ts,I as g,aT as ss,b0 as O,b8 as ps,ad as h,p as C,be as l,D as e,aE as i,Z as Q,B as a,au as z,an as k,a1 as V,L as A,Y as as,ar as M,l as j,$ as js,aB as ns,r as x,o as s,bf as zs,b7 as bs,q,a9 as ks,ac as gs,ab as Ps,ap as Cs,aj as b,F as G,am as L,a0 as es,ao as qs,A as U}from"./chunks/framework.0wKa1_Sn.js";const cs=Symbol("frappe-ui:command-palette"),is=Symbol("frappe-ui:command-palette-group");function Ss(d){ts(cs,d)}function D(){return ls(cs,null)}function Is(d){ts(is,d)}function Ts(){return ls(is,null)}const J=g({name:"CommandPalette",inheritAttrs:!1,__name:"CommandPalette",props:as({filterable:{type:Boolean,default:!0},title:{default:"Command palette"}},{open:{type:Boolean,default:!1},openModifiers:{},query:{default:""},queryModifiers:{}}),emits:as(["select"],["update:open","update:query"]),setup(d,{emit:u}){const o=d,_=u,c=ss(d,"open"),m=ss(d,"query"),w=O("listbox"),p=M(),n=M(),r=M(new Map);function $(y,v){return r.value.set(y,v),ns(r),()=>{r.value.delete(y),ns(r)}}function S(y){for(const v of r.value.values())if(v.groupId===y&&v.visible.value)return!0;return!1}const I=j(()=>{for(const y of r.value.values())if(y.visible.value)return!1;return!0});function T(y,v){const f=m.value.trim().toLowerCase();return f?[y,...v].join(" ").toLowerCase().includes(f):!0}function t(y,v){_("select",y,v),!v.defaultPrevented&&(c.value=!1)}function P(){m.value="",p.value=void 0,n.value=void 0}function F(y){p.value=y?.value}ps([c,m],async()=>{c.value&&(await js(),w.value?.highlightFirstItem())},{immediate:!0});const W=j(()=>({query:m.value,active:p.value,empty:I.value}));return Ss({query:m,filterable:j(()=>o.filterable),activeValue:p,empty:I,matches:T,registerItem:$,groupHasVisibleItems:S,select:t}),(y,v)=>(h(),C(hs,{open:c.value,"onUpdate:open":v[1]||(v[1]=f=>c.value=f),size:"xl",position:"top",bare:"",onAfterLeave:P},{default:l(()=>[e(i(os),Q({ref_key:"listbox",ref:w,modelValue:n.value,"onUpdate:modelValue":v[0]||(v[0]=f=>n.value=f),as:"div","data-slot":"command-palette",class:"flex flex-col"},y.$attrs,{"highlight-on-hover":"","selection-behavior":"replace",onHighlight:F}),{default:l(()=>[e(i(rs),{"as-child":""},{default:l(()=>[e(i(ds),null,{default:l(()=>[a(z(d.title),1)]),_:1})]),_:1}),e(i(ms),{as:"div","data-slot":"command-palette-content",class:"max-h-[60vh] overflow-y-auto overscroll-contain focus-visible:outline-none"},{default:l(()=>[k(y.$slots,"default",V(A(W.value)))]),_:3})]),_:3},16,["modelValue"])]),_:3},8,["open"]))}}),Es={"data-slot":"command-palette-input",class:"sticky top-0 z-10 flex items-center gap-3 border-b border-outline-gray-1 bg-surface-elevation-1 px-4.5 dark:border-outline-gray-2"},Y=g({name:"CommandPaletteInput",inheritAttrs:!1,__name:"CommandPaletteInput",props:{placeholder:{default:"Search"}},setup(d){const u=D(),o=j({get:()=>u?.query.value??"",set:_=>{u&&(u.query.value=_)}});return(_,c)=>(h(),x("div",Es,[k(_.$slots,"prefix",{},()=>[c[1]||(c[1]=s("span",{class:"lucide-search size-4 shrink-0 text-ink-gray-6"},null,-1))]),e(i(us),Q({modelValue:o.value,"onUpdate:modelValue":c[0]||(c[0]=m=>o.value=m),as:"input","auto-focus":"",autocomplete:"off",placeholder:d.placeholder,class:"w-full border-none bg-transparent py-3 px-0 text-base text-ink-gray-8 placeholder-ink-gray-4 focus:ring-0"},_.$attrs),null,16,["modelValue","placeholder"]),k(_.$slots,"suffix")]))}}),R=g({name:"CommandPaletteGroup",__name:"CommandPaletteGroup",props:{title:{}},setup(d){const u=D(),o=Symbol("command-palette-group");Is({id:o});const _=j(()=>u?.groupHasVisibleItems(o)??!0);return(c,m)=>zs((h(),C(i(ws),{as:"div","data-slot":"command-palette-group",class:"mb-2 mt-4.5 first:mt-3"},{default:l(()=>[d.title?(h(),C(i(fs),{key:0,as:"div","data-slot":"command-palette-group-title",class:"mb-2.5 px-4.5 text-base text-ink-gray-5"},{default:l(()=>[a(z(d.title),1)]),_:1})):q("",!0),k(c.$slots,"default")]),_:3},512)),[[bs,_.value]])}}),Vs={key:0,class:"px-2.5"},As={key:0,class:"ml-auto whitespace-nowrap pl-2"},N=g({name:"CommandPaletteItem",inheritAttrs:!1,__name:"CommandPaletteItem",props:{value:{},label:{},keywords:{},disabled:{type:Boolean},as:{default:"div"}},emits:["select"],setup(d,{emit:u}){const o=d,_=u,c=D(),m=Ts(),w=Symbol("command-palette-item"),p=O("labelEl"),n=b("");function r(){const f=p.value?.textContent?.trim();f&&(n.value=f)}ks(r),gs(r);const $=j(()=>o.label??n.value),S=j(()=>!c||!c.filterable.value?!0:c.matches($.value,o.keywords??[])),I=c?.registerItem(w,{groupId:m?.id??null,visible:S});Ps(()=>I?.());const T=ys(null),t=O("item"),P=j(()=>{const f=t.value?.$el;return!!f&&T?.highlightedElement.value===f}),F=j(()=>T!=null&&T.modelValue.value===o.value),W=j(()=>{if(P.value)return"active";if(F.value)return"selected"}),y=j(()=>({active:P.value,selected:F.value,disabled:o.disabled??!1}));function v(f){_("select",f),!f.defaultPrevented&&c?.select(o.value,f)}return(f,_s)=>S.value?(h(),x("div",Vs,[e(i(vs),{ref_key:"item",ref:t,value:d.value,disabled:d.disabled,"as-child":"",onSelect:v},{default:l(()=>[(h(),C(Cs(d.as),Q({"data-slot":"command-palette-item","data-state":W.value,"data-disabled":d.disabled?"":void 0,class:"flex w-full min-w-0 cursor-default items-center rounded-4 px-2 py-2 text-base-medium text-ink-gray-8 outline-none data-[state=active]:bg-surface-gray-2 data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-gray-4"},f.$attrs),{default:l(()=>[k(f.$slots,"prefix",V(A(y.value))),s("span",{ref_key:"labelEl",ref:p,"data-slot":"command-palette-item-label",class:"overflow-hidden text-ellipsis whitespace-nowrap"},[k(f.$slots,"default",V(A(y.value)))],512),f.$slots.suffix?(h(),x("span",As,[k(f.$slots,"suffix",V(A(y.value)))])):q("",!0)]),_:3},16,["data-state","data-disabled"]))]),_:3},8,["value","disabled"])])):q("",!0)}}),$s={key:0,"data-slot":"command-palette-empty",class:"px-4.5 py-8 text-center text-base text-ink-gray-6"},Z=g({name:"CommandPaletteEmpty",__name:"CommandPaletteEmpty",setup(d){const u=D(),o=j(()=>u?.empty.value??!1),_=j(()=>({query:u?.query.value??""}));return(c,m)=>o.value?(h(),x("div",$s,[k(c.$slots,"default",V(A(_.value)),()=>[a('No results for "'+z(_.value.query)+'"',1)])])):q("",!0)}}),Ds={"data-slot":"command-palette-footer",class:"sticky bottom-0 z-10 flex items-center gap-4 border-t border-outline-gray-1 bg-surface-elevation-1 px-4.5 py-2 text-sm text-ink-gray-6 dark:border-outline-gray-2"},Fs=g({name:"CommandPaletteFooter",__name:"CommandPaletteFooter",setup(d){const u=D(),o=j(()=>({active:u?.activeValue.value}));return(_,c)=>(h(),x("div",Ds,[k(_.$slots,"default",V(A(o.value)))]))}}),Ks={class:"flex flex-col items-start gap-3"},Gs={key:0,class:"text-p-sm text-ink-gray-6"},Ls=g({__name:"Links",setup(d){const u=[{link:"/docs/components/button",text:"Button"},{link:"/docs/components/dialog",text:"Dialog"},{link:"/docs/components/combobox",text:"Combobox"}],o=b(!1),_=b("");function c(m,w){const p=m,n=w.detail.originalEvent;n.metaKey||n.ctrlKey||n.shiftKey||n.button===1||(n.preventDefault(),_.value=p.link)}return(m,w)=>(h(),x("div",Ks,[e(i(H),{onClick:w[0]||(w[0]=p=>o.value=!0)},{default:l(()=>[...w[2]||(w[2]=[a("Search the docs",-1)])]),_:1}),_.value?(h(),x("p",Gs," Would navigate to "+z(_.value),1)):q("",!0),e(i(J),{open:o.value,"onUpdate:open":w[1]||(w[1]=p=>o.value=p),onSelect:c},{default:l(()=>[e(i(Y),{placeholder:"Search documentation"}),e(i(R),{title:"Components"},{default:l(()=>[(h(),x(G,null,L(u,p=>e(i(N),{key:p.link,as:"a",href:p.link,value:p},{default:l(()=>[a(z(p.text),1)]),_:2},1032,["href","value"])),64))]),_:1}),e(i(Z))]),_:1},8,["open"])]))}}),Rs={class:"flex flex-col items-start gap-3"},Ns={key:0,class:"px-4.5 py-8 text-center text-base text-ink-gray-5"},Ws={class:"text-ink-gray-5"},Bs=g({__name:"ServerSearch",setup(d){const u=[{name:"design-review",title:"Design review",team:"Product"},{name:"release-plan",title:"Release plan",team:"Engineering"},{name:"onboarding",title:"Onboarding checklist",team:"People"},{name:"q3-budget",title:"Q3 budget",team:"Finance"}],o=b(!1),_=b(""),c=b([]),m=b(!1);let w;return ps(_,p=>{if(clearTimeout(w),!p){c.value=[],m.value=!1;return}m.value=!0,w=setTimeout(()=>{const n=p.toLowerCase();c.value=u.filter(r=>r.title.toLowerCase().includes(n)||r.team.toLowerCase().includes(n)),m.value=!1},300)}),(p,n)=>(h(),x("div",Rs,[e(i(H),{onClick:n[0]||(n[0]=r=>o.value=!0)},{default:l(()=>[...n[4]||(n[4]=[a("Search the server",-1)])]),_:1}),e(i(J),{open:o.value,"onUpdate:open":n[1]||(n[1]=r=>o.value=r),query:_.value,"onUpdate:query":n[2]||(n[2]=r=>_.value=r),filterable:!1,onSelect:n[3]||(n[3]=r=>o.value=!1)},{default:l(()=>[e(i(Y),{placeholder:"Search documents"}),m.value?(h(),x("div",Ns," Searching… ")):(h(),C(i(R),{key:1,title:"Documents"},{default:l(()=>[(h(!0),x(G,null,L(c.value,r=>(h(),C(i(N),{key:r.name,value:r},{suffix:l(()=>[s("span",Ws,z(r.team),1)]),default:l(()=>[a(z(r.title)+" ",1)]),_:2},1032,["value"]))),128))]),_:1})),m.value?q("",!0):(h(),C(i(Z),{key:2},{default:l(({query:r})=>[a(z(r?`No documents match "${r}"`:"Type to search"),1)]),_:1}))]),_:1},8,["open","query"])]))}}),Ms={class:"flex flex-col items-start gap-3"},Us={key:0,class:"text-p-sm text-ink-gray-6"},Os=g({__name:"Default",setup(d){const u=[{name:"inbox",title:"Inbox",icon:"lucide-inbox",keywords:["mail"]},{name:"people",title:"People",icon:"lucide-users"},{name:"settings",title:"Settings",icon:"lucide-settings"}],o=[{name:"new-task",title:"New task",icon:"lucide-plus",combo:"Mod+N"},{name:"new-note",title:"New note",icon:"lucide-file-text",combo:"Mod+Shift+N"}],_=b(!1),c=b("");xs({combo:"Mod+K",description:"Open command palette",allowInInput:!0,handler:()=>_.value=!0});function m(w){c.value=w.title}return(w,p)=>(h(),x("div",Ms,[e(i(H),{onClick:p[0]||(p[0]=n=>_.value=!0)},{default:l(()=>[...p[2]||(p[2]=[a("Open command palette (or press Mod+K)",-1)])]),_:1}),c.value?(h(),x("p",Us,"Picked: "+z(c.value),1)):q("",!0),e(i(J),{open:_.value,"onUpdate:open":p[1]||(p[1]=n=>_.value=n),onSelect:m},{default:l(()=>[e(i(Y),{placeholder:"Search commands"}),e(i(R),{title:"Pages"},{default:l(()=>[(h(),x(G,null,L(u,n=>e(i(N),{key:n.name,value:n,keywords:n.keywords},{prefix:l(()=>[s("span",{class:es([n.icon,"mr-3 size-4 text-ink-gray-7"])},null,2)]),default:l(()=>[a(" "+z(n.title),1)]),_:2},1032,["value","keywords"])),64))]),_:1}),e(i(R),{title:"Actions"},{default:l(()=>[(h(),x(G,null,L(o,n=>e(i(N),{key:n.name,value:n},{prefix:l(()=>[s("span",{class:es([n.icon,"mr-3 size-4 text-ink-gray-7"])},null,2)]),suffix:l(()=>[e(i(B),{combo:n.combo},null,8,["combo"])]),default:l(()=>[a(" "+z(n.title)+" ",1)]),_:2},1032,["value"])),64))]),_:1}),e(i(Z),null,{default:l(({query:n})=>[a(' Nothing matches "'+z(n)+'" ',1)]),_:1}),e(i(Fs),null,{default:l(()=>[e(i(B),{combo:"Enter"}),p[3]||(p[3]=a(" to run ",-1)),e(i(B),{combo:"Escape"}),p[4]||(p[4]=a(" to close ",-1))]),_:1})]),_:1},8,["open"])]))}}),sa=JSON.parse('{"title":"CommandPalette","description":"","frontmatter":{},"headers":[],"relativePath":"docs/experimental/commandpalette.md","filePath":"docs/experimental/commandpalette.md","lastUpdated":0}'),Hs={name:"docs/experimental/commandpalette.md"},aa=Object.assign(Hs,{setup(d){const u=[{name:"filterable",description:"Filter the items against the query on the client. Set it to `false` when a\nserver search already decided what matches (ADR-0009), then refetch on\n`update:query` yourself.",required:!1,type:"boolean",default:"true"},{name:"title",description:`The dialog's accessible name. It is read by screen readers and never
drawn, because the palette's shell has no header.`,required:!1,type:"string",default:'"Command palette"'},{name:"open",description:"Whether the palette is open.",required:!1,type:"boolean",default:"false"},{name:"query",description:"The search text. Cleared when the palette closes.",required:!1,type:"string",default:'""'}],o=[{name:"default",description:"The palette's parts. Receives the query, the active value and the empty state.",type:"CommandPaletteSlotProps"}],_=[{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"},{name:"select",description:"Fired when the user picks an item. The palette closes right after, unless\nthe handler calls `event.preventDefault()`.",type:"[value: AcceptableValue, event: CommandPaletteSelectEvent]"},{name:"update:query",description:"Fired when the query changes.",type:"[value: string]"}],c=[{name:"placeholder",description:"Placeholder text for the search field.",required:!1,type:"string",default:'"Search"'}],m=[{name:"prefix",description:"Replaces the leading search icon.",type:"any"},{name:"suffix",description:"Trailing content, after the field.",type:"any"}],w=[{name:"title",description:"Heading above the group's items. Leave it out to group without a heading.",required:!1,type:"string"}],p=[{name:"default",description:"The group's `CommandPaletteItem`s.",type:"any"}],n=[{name:"value",description:"The value the palette reports in `select`.",required:!0,type:"AcceptableValue"},{name:"label",description:`Text the client filter matches. It defaults to the item's own rendered
text, so set it only when the default slot draws more than the label.`,required:!1,type:"string"},{name:"keywords",description:"Extra words the client filter matches, on top of the label.",required:!1,type:"string[]"},{name:"disabled",description:"Stop the user picking this item.",required:!1,type:"boolean"},{name:"as",description:"Element the item renders as. Use `a` with an `href` for a real link, so\nmiddle-click and modifier-click open a new tab.",required:!1,type:"string | Component",default:'"div"'}],r=[{name:"default",description:"The item's label. The client filter matches its text.",type:"CommandPaletteItemSlotProps"},{name:"prefix",description:"Leading content, before the label.",type:"CommandPaletteItemSlotProps"},{name:"suffix",description:"Trailing content, pushed to the end of the row.",type:"CommandPaletteItemSlotProps"}],$=[{name:"select",description:"Fired when this item is picked, before the palette's own `select`. Call\n`event.preventDefault()` to keep the palette open.",type:"[event: CommandPaletteSelectEvent]"}],S=[{name:"default",description:"The message. Receives the query so it can quote what the user typed.",type:"CommandPaletteEmptySlotProps"}],I=[{name:"default",description:"The footer's content. Receives the active value, so a hint can follow it.",type:"CommandPaletteFooterSlotProps"}];return(T,t)=>{const P=qs("ComponentPreview");return h(),x("div",null,[t[7]||(t[7]=U("",4)),e(P,{name:"CommandPalette-Default"},{code:l(()=>[...t[0]||(t[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," KeyboardShortcut"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," useKeyboardShortcut"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPalette"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteEmpty"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteFooter"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteGroup"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteInput"),s("span",{class:"s_1jjt6x"},",")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pages"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page in pages"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.name"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :keywords"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.keywords"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[page.icon, 'mr-3 size-4 text-ink-gray-7']"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          {{ page.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Actions"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action in actions"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action.name"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[action.icon, 'mr-3 size-4 text-ink-gray-7']"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          {{ action.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_wac0bt"},"KeyboardShortcut"),s("span",{class:"s_1i4ay4"}," :combo"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"action.combo"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[e(Os)]),_:1}),t[8]||(t[8]=U("",10)),e(P,{name:"CommandPalette-ServerSearch"},{code:l(()=>[...t[1]||(t[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," watch"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPalette"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteEmpty"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteGroup"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteInput"),s("span",{class:"s_1jjt6x"},",")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      @select"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open = false"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteInput"),s("span",{class:"s_1i4ay4"}," placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Search documents"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- The default slot is open, so a loading row needs no extra part. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"loading"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"px-4.5 py-8 text-center text-base text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        Searching…")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," v-else"),s("span",{class:"s_1i4ay4"}," title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Documents"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1i4ay4"}," v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"row in results"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"row.name"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"row"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          {{ row.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ row.team }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1i4ay4"}," v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"!loading"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ query: text }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        {{ text ? `No documents match \"${text}\"` : 'Type to search' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"CommandPalette"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[e(Bs)]),_:1}),t[9]||(t[9]=s("h2",{id:"items-that-are-links",tabindex:"-1"},[a("Items that are links "),s("a",{class:"header-anchor",href:"#items-that-are-links","aria-label":"Permalink to “Items that are links”"},"​")],-1)),t[10]||(t[10]=s("p",null,[a("Give an item "),s("code",null,'as="a"'),a(" and an "),s("code",null,"href"),a(" and it renders a real anchor, so middle-click and modifier-click open a new tab natively. "),s("code",null,"select"),a(" carries the click that picked the row in "),s("code",null,"event.detail.originalEvent"),a(", which is where the modifier keys are.")],-1)),e(P,{name:"CommandPalette-Links"},{code:l(()=>[...t[2]||(t[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPalette"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteEmpty"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteGroup"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  CommandPaletteInput"),s("span",{class:"s_1jjt6x"},",")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1i4ay4"}," title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Components"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"CommandPaletteItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page in docs"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.link"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          as"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"a"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :href"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page.link"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"page"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          {{ page.text }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"CommandPaletteItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"CommandPaletteGroup"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"CommandPaletteEmpty"),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"CommandPalette"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[e(Ls)]),_:1}),t[11]||(t[11]=U("",7)),e(K,{name:"CommandPalette",data:u},{code:l(()=>[...t[3]||(t[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name. It is read by screen readers and never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * drawn, because the palette's shell has no header.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the filter hides every item. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether this item holds the palette's current value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),e(E,{data:o}),e(X,{data:_}),t[12]||(t[12]=s("h3",{id:"commandpaletteinput",tabindex:"-1"},[a("CommandPaletteInput "),s("a",{class:"header-anchor",href:"#commandpaletteinput","aria-label":"Permalink to “CommandPaletteInput”"},"​")],-1)),e(K,{name:"CommandPaletteInput",data:c},{code:l(()=>[...t[4]||(t[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name. It is read by screen readers and never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * drawn, because the palette's shell has no header.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the filter hides every item. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether this item holds the palette's current value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),e(E,{data:m}),t[13]||(t[13]=s("h3",{id:"commandpalettegroup",tabindex:"-1"},[a("CommandPaletteGroup "),s("a",{class:"header-anchor",href:"#commandpalettegroup","aria-label":"Permalink to “CommandPaletteGroup”"},"​")],-1)),e(K,{name:"CommandPaletteGroup",data:w},{code:l(()=>[...t[5]||(t[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name. It is read by screen readers and never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * drawn, because the palette's shell has no header.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the filter hides every item. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether this item holds the palette's current value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),e(E,{data:p}),t[14]||(t[14]=s("h3",{id:"commandpaletteitem",tabindex:"-1"},[a("CommandPaletteItem "),s("a",{class:"header-anchor",href:"#commandpaletteitem","aria-label":"Permalink to “CommandPaletteItem”"},"​")],-1)),e(K,{name:"CommandPaletteItem",data:n},{code:l(()=>[...t[6]||(t[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AcceptableValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"reka-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The dialog's accessible name. It is read by screen readers and never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * drawn, because the palette's shell has no header.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the filter hides every item. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommandPaletteItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value the palette reports in `select`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," CommandPaletteValue")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Text the client filter matches. It defaults to the item's own rendered")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * text, so set it only when the default slot draws more than the label.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether this item holds the palette's current value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),e(E,{data:r}),e(X,{data:$}),t[15]||(t[15]=s("h3",{id:"commandpaletteempty",tabindex:"-1"},[a("CommandPaletteEmpty "),s("a",{class:"header-anchor",href:"#commandpaletteempty","aria-label":"Permalink to “CommandPaletteEmpty”"},"​")],-1)),e(E,{data:S}),t[16]||(t[16]=s("h3",{id:"commandpalettefooter",tabindex:"-1"},[a("CommandPaletteFooter "),s("a",{class:"header-anchor",href:"#commandpalettefooter","aria-label":"Permalink to “CommandPaletteFooter”"},"​")],-1)),e(E,{data:I})])}}});export{sa as __pageData,aa as default};
