import{_ as C}from"./chunks/PropsTable.6nEstcyM.js";import{_ as z}from"./chunks/SlotsTable.H8OiFYJg.js";import{_ as $}from"./chunks/EmitsTable.SpPidrGF.js";import{_ as R,a as S,b as w}from"./chunks/ListCell.vue_vue_type_script_setup_true_lang.CzhvXTfW.js";import{_ as D}from"./chunks/ListRows.vue_vue_type_script_setup_true_lang.BQP_loEW.js";import{I as q,ad as f,r as g,D as n,aE as p,be as l,o as s,au as i,p as F,B as a,a0 as j,aj as v,l as W,F as M,am as I,q as U,ao as B,A as x}from"./chunks/framework.CK2aBVEu.js";import{W as P,N as V,P as Q}from"./chunks/theme.CydPBHY9.js";import{_ as E,a as A}from"./chunks/ListHeaderCell.vue_vue_type_script_setup_true_lang.U3qWZTt_.js";import{_ as H}from"./chunks/ListHeaderCellSort.vue_vue_type_script_setup_true_lang.DFJZOdVN.js";const K={class:"h-72 w-full overflow-y-auto rounded-4 border"},Y={class:"text-sm text-ink-gray-4"},X={class:"truncate text-base text-ink-gray-8"},Z={class:"text-sm text-ink-gray-5"},ss=q({__name:"Virtual",setup(k){const u=Array.from({length:1e3},(d,c)=>({id:String(c+1),title:`Task ${c+1}`,status:c%3===0?"Done":c%3===1?"In progress":"Backlog"}));return(d,c)=>(f(),g("div",K,[n(p(R),{columns:["3rem","minmax(0,1fr)","6rem"],"row-height":44,class:"px-2"},{default:l(()=>[n(p(D),{items:p(u),virtual:""},{default:l(({item:o})=>[n(p(S),null,{default:l(()=>[n(p(w),null,{default:l(()=>[s("span",Y,"#"+i(o.id),1)]),_:2},1024),n(p(w),null,{default:l(()=>[s("span",X,i(o.title),1)]),_:2},1024),n(p(w),{class:"justify-end"},{default:l(()=>[s("span",Z,i(o.status),1)]),_:2},1024)]),_:2},1024)]),_:1},8,["items"])]),_:1})]))}}),as={class:"ml-3 min-w-0"},ns={class:"truncate text-base text-ink-gray-8"},ls={class:"mt-0.5 truncate text-sm text-ink-gray-5"},es={class:"text-base text-ink-gray-7"},ps={class:"text-base text-ink-gray-6"},cs=q({__name:"Responsive",setup(k){const u=[{name:"Rosa Diaz",email:"rosa@example.com",role:"Admin",since:"2021-06"},{name:"Jake Peralta",email:"jake@example.com",role:"Member",since:"2022-01"},{name:"Amy Santiago",email:"amy@example.com",role:"Admin",since:"2020-11"},{name:"Terry Jeffords",email:"terry@example.com",role:"Member",since:"2023-03"}];return(d,c)=>(f(),F(p(R),{class:"w-full list-row-px-3",columns:{base:["minmax(0,1fr)","6.5rem"],md:["minmax(0,1fr)","7rem","6rem"],lg:["minmax(0,2fr)","9rem","8rem"]},"row-height":56},{default:l(()=>[n(p(E),null,{default:l(()=>[n(p(A),null,{default:l(()=>[...c[0]||(c[0]=[a("Member",-1)])]),_:1}),n(p(A),{class:"max-md:hidden"},{default:l(()=>[...c[1]||(c[1]=[a("Role",-1)])]),_:1}),n(p(A),{class:"justify-end"},{default:l(()=>[...c[2]||(c[2]=[a("Member since",-1)])]),_:1})]),_:1}),n(p(D),{items:u},{default:l(({item:o,value:h})=>[n(p(S),{value:h},{default:l(()=>[n(p(w),null,{default:l(()=>[n(p(P),{label:o.name,size:"xl"},null,8,["label"]),s("div",as,[s("div",ns,i(o.name),1),s("div",ls,i(o.email),1)])]),_:2},1024),n(p(w),{class:"max-md:hidden"},{default:l(()=>[s("span",es,i(o.role),1)]),_:2},1024),n(p(w),{class:"justify-end"},{default:l(()=>[s("span",ps,i(o.since),1)]),_:2},1024)]),_:2},1032,["value"])]),_:1})]),_:1}))}}),ts={class:"ml-3 min-w-0"},is={class:"truncate text-base text-ink-gray-8"},os={class:"mt-0.5 truncate text-sm text-ink-gray-5"},_s={class:"text-base text-ink-gray-7"},rs={class:"text-base text-ink-gray-6"},ds=q({__name:"Columns",setup(k){const u=[{name:"Rosa Diaz",email:"rosa@example.com",role:"Admin",since:"2021-06"},{name:"Jake Peralta",email:"jake@example.com",role:"Member",since:"2022-01"},{name:"Amy Santiago",email:"amy@example.com",role:"Admin",since:"2020-11"},{name:"Terry Jeffords",email:"terry@example.com",role:"Member",since:"2023-03"},{name:"Raymond Holt",email:"holt@example.com",role:"Guest",since:"2024-08"}],d=v("Rosa Diaz");function c(m){return m?m==="asc"?"lucide-arrow-up":"lucide-arrow-down":"lucide-arrow-up-down"}const o=v("name"),h=v("asc");function y(m,_="asc"){o.value===m?h.value=h.value==="asc"?"desc":"asc":(o.value=m,h.value=_)}function t(m){return o.value===m?h.value:null}const b=W(()=>{const m=h.value==="desc"?-1:1;return[...u].sort((_,r)=>m*_[o.value].localeCompare(r[o.value]))});return(m,_)=>(f(),F(p(R),{active:d.value,"onUpdate:active":_[3]||(_[3]=r=>d.value=r),class:"w-full list-row-px-3",columns:["minmax(0,1fr)","7rem","8rem"],"row-height":56},{default:l(()=>[n(p(E),null,{default:l(()=>[n(p(H),{direction:t("name"),onClick:_[0]||(_[0]=r=>y("name"))},{suffix:l(({direction:r})=>[s("span",{class:j(["block size-3.5",c(r)])},null,2)]),default:l(()=>[_[4]||(_[4]=a(" Member ",-1))]),_:1},8,["direction"]),n(p(H),{direction:t("role"),onClick:_[1]||(_[1]=r=>y("role"))},{suffix:l(({direction:r})=>[s("span",{class:j(["block size-3.5",c(r)])},null,2)]),default:l(()=>[_[5]||(_[5]=a(" Role ",-1))]),_:1},8,["direction"]),n(p(H),{direction:t("since"),class:"justify-end",onClick:_[2]||(_[2]=r=>y("since","desc"))},{suffix:l(({direction:r})=>[s("span",{class:j(["block size-3.5",c(r)])},null,2)]),default:l(()=>[_[6]||(_[6]=a(" Member since ",-1))]),_:1},8,["direction"])]),_:1}),n(p(D),{items:b.value},{default:l(({item:r,value:T})=>[n(p(S),{value:T},{default:l(()=>[n(p(w),null,{default:l(()=>[n(p(P),{label:r.name,size:"xl"},null,8,["label"]),s("div",ts,[s("div",is,i(r.name),1),s("div",os,i(r.email),1)])]),_:2},1024),n(p(w),null,{default:l(()=>[s("span",_s,i(r.role),1)]),_:2},1024),n(p(w),{class:"justify-end"},{default:l(()=>[s("span",rs,i(r.since),1)]),_:2},1024)]),_:2},1032,["value"])]),_:1},8,["items"])]),_:1},8,["active"]))}}),hs={class:"w-full"},ws={class:"mb-2 flex h-7 items-center justify-end text-sm text-ink-gray-5"},ms=["aria-label","onClick"],us={class:"truncate text-base text-ink-gray-8"},ys={class:"text-sm text-ink-gray-5"},fs=q({__name:"RowActions",setup(k){const u=[{id:"1",title:"Q3 launch brief",icon:"lucide-file-text",updated:"2 h"},{id:"2",title:"Hiring pipeline",icon:"lucide-file-spreadsheet",updated:"5 h"},{id:"3",title:"Onboarding flow",icon:"lucide-file-image",updated:"1 d"},{id:"4",title:"Retention report",icon:"lucide-file-chart-column",updated:"3 d"},{id:"5",title:"Support playbook",icon:"lucide-file-text",updated:"6 d"}],d=v(),c=v(["2"]);function o(h){c.value=c.value.includes(h)?c.value.filter(y=>y!==h):[...c.value,h]}return(h,y)=>(f(),g("div",hs,[s("div",ws,[s("span",null,i(c.value.length)+" starred "+i(d.value?` · Opened: ${d.value}`:" · Click a row to open it"),1)]),n(p(R),{class:"list-row-px-3","row-height":48},{default:l(()=>[(f(),g(M,null,I(u,t=>n(p(S),{key:t.id,class:"active:bg-surface-gray-2 sm:rounded-[10px] sm:hover:bg-surface-gray-1"},{default:l(()=>[n(p(w),null,{default:l(()=>[s("span",{class:j([t.icon,"size-4 text-ink-gray-5"]),"aria-hidden":"true"},null,2)]),_:2},1024),n(p(w),null,{default:l(()=>[s("button",{type:"button",class:"absolute inset-0 sm:rounded-[10px]","aria-label":`Open ${t.title}`,onClick:b=>d.value=t.title},null,8,ms),s("span",us,i(t.title),1)]),_:2},1024),n(p(w),{class:"justify-end gap-3"},{default:l(()=>[s("span",ys,i(t.updated),1),n(p(V),{class:"relative",variant:"ghost",label:c.value.includes(t.id)?`Unstar ${t.title}`:`Star ${t.title}`,"aria-pressed":c.value.includes(t.id),onClick:b=>o(t.id)},{icon:l(()=>[s("span",{class:j(["lucide-star size-4",c.value.includes(t.id)?"text-ink-gray-9":"text-ink-gray-4"]),"aria-hidden":"true"},null,2)]),_:2},1032,["label","aria-pressed","onClick"])]),_:2},1024)]),_:2},1024)),64))]),_:1})]))}}),zs={class:"w-full"},gs={class:"mb-2 flex h-7 items-center justify-end gap-3"},vs={key:0,class:"text-sm text-ink-gray-5"},xs={class:"min-w-0"},js={class:"mt-1 truncate text-base text-ink-gray-5"},ks={class:"flex flex-col items-end gap-1"},bs={class:"text-sm text-ink-gray-5"},Ls=q({__name:"Feed",setup(k){const u=[{name:"1",title:"Weekly sync notes",author:"Rosa Diaz",comment:"Sounds good, let us ship it on Monday",time:"2 h",comments:4,unread:!0},{name:"2",title:"Redesigning the onboarding flow",author:"Jake Peralta",comment:"I added the new mockups to the page",time:"5 h",comments:12,unread:!1},{name:"3",title:"Q3 hiring plan",author:"Amy Santiago",comment:"Two backend roles and one designer",time:"1 d",comments:7,unread:!0},{name:"4",title:"Incident review: search downtime",author:"Terry Jeffords",comment:"Root cause was the index rebuild",time:"2 d",comments:9,unread:!1},{name:"5",title:"Docs sprint retrospective",author:"Raymond Holt",comment:"Velocity was acceptable.",time:"4 d",comments:3,unread:!1}],d=v(!1),c=v([]);function o(){d.value=!d.value,c.value=[]}return(h,y)=>(f(),g("div",zs,[s("div",gs,[c.value.length?(f(),g("span",vs,i(c.value.length)+" selected ",1)):U("",!0),n(p(V),{onClick:o},{default:l(()=>[a(i(d.value?"Done":"Select"),1)]),_:1})]),n(p(R),{selectable:d.value,selection:c.value,"onUpdate:selection":y[0]||(y[0]=t=>c.value=t),"row-height":60},{default:l(()=>[(f(),g(M,null,I(u,t=>n(p(S),{key:t.name,value:t.name,onClick:()=>{}},{default:l(()=>[n(p(w),null,{default:l(()=>[n(p(P),{label:t.author,size:"2xl"},null,8,["label"])]),_:2},1024),n(p(w),null,{default:l(()=>[s("div",xs,[s("div",{class:j(["truncate text-base text-ink-gray-8",t.unread&&"font-semibold"])},i(t.title),3),s("div",js,i(t.author)+": "+i(t.comment),1)])]),_:2},1024),n(p(w),{class:"justify-end"},{default:l(()=>[s("div",ks,[s("span",bs,i(t.time),1),n(p(Q),null,{default:l(()=>[a(i(t.comments),1)]),_:2},1024)])]),_:2},1024)]),_:2},1032,["value"])),64))]),_:1},8,["selectable","selection"])]))}}),Fs=JSON.parse('{"title":"List","description":"","frontmatter":{},"headers":[],"relativePath":"docs/molecules/list.md","filePath":"docs/molecules/list.md","lastUpdated":1782986620000}'),Cs={name:"docs/molecules/list.md"},Ms=Object.assign(Cs,{setup(k){const u=[{name:"columns",description:"Grid track sizes shared by the header and every row. Defaults to the feed\ntemplate `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,\ntrailing). Table-style lists must pass deterministic track sizes — `auto`\ntracks size independently per row, so independent row grids can't agree.\n\nPass an array for one template at every width, or an object keyed by\nbreakpoint for a template that changes with the viewport:\n`{ base: ['minmax(0,1fr)', '80px'], md: ['minmax(0,2fr)', '140px', '100px'] }`.\n`base` is required, each breakpoint replaces the whole template, and an\nomitted breakpoint keeps the one below it. Breakpoints are the consuming\napp's own Tailwind `screens`, resolved in CSS — so `md` here and `md:hidden`\non a cell switch at the same width. A key that is not one of those screens\nis ignored: its template never applies, and a dev-mode warning names it.\nChanging the track count never hides a cell: pair it with matching\nvisibility classes on the header and the rows.",required:!1,type:"ListColumns"},{name:"divider",description:"Divider treatment between rows: `inset` starts at the content column\n(the text edge), `full` spans all columns. Defaults to `inset` with the\ndefault feed template, `full` when `columns` is set.",required:!1,type:"ListDivider"},{name:"selectable",description:"Reveals the animated checkbox column and switches row click from\nnavigate to toggle. Selected values surface via `v-model:selection`.",required:!1,type:"boolean"},{name:"rowHeight",description:`Fixed row height in px. Required for virtualization; without it rows size
to their content. Responsive heights are non-virtual — set them with
height classes on the rows instead.`,required:!1,type:"number"},{name:"selection",description:"The checkbox-selected row values, when `selectable` reveals the checkbox\ncolumn. Two-way — toggling a row's checkbox updates this set.",required:!1,type:"string[]",default:"[]"},{name:"active",description:"The single open/highlighted row, for a master–detail layout. Binding this\nmodel is what opts a list into active-row tracking — an unbound list shows\nno highlight. Independent of `selection`.",required:!1,type:"string"}],d=[{name:"default",description:"The list's rows — `<ListRow>` / `<ListRows>`, optionally under `<ListHeader>` / `<ListGroup>`.",type:"any"}],c=[{name:"update:selection",description:"Fired when the selection changes.",type:"[value: string[]]"},{name:"update:active",description:"Fired when the active changes.",type:"[value: string | undefined]"}],o=[{name:"to",description:"Renders the row as a RouterLink. Without `to`, a row with a click\nlistener renders as a button; otherwise a plain div.",required:!1,type:"string | kt | Tt"},{name:"value",description:"Row key — the `selection` key when `selectable` and the `v-model:active`\nkey. Required whenever the list uses either.",required:!1,type:"string"},{name:"onClick",description:"Fired when the row is activated, unless selection mode claims the click.",required:!1,type:"((event: MouseEvent) => void)"}],h=[{name:"default",description:"The row's cells — `<ListCell>` elements, or feed content directly.",type:"any"}],y=[{name:"default",description:"The cell's content.",type:"any"}],t=[{name:"default",description:"The header's columns — `<ListHeaderCell>` / `<ListHeaderCellSort>` elements.",type:"any"}],b=[{name:"default",description:"Column label.",type:"any"},{name:"prefix",description:"Leading adornment, rendered before the label.",type:"any"},{name:"suffix",description:"Trailing adornment, rendered after the label.",type:"any"}],m=[{name:"direction",description:"Active sort direction for this column, `null`/omitted when inactive.\nThe cell is controlled — sort state and toggle rules are app-owned:\nupdate whatever drives your ordering in the `click` handler.",required:!1,type:"ListSortDirection | null"},{name:"align",description:"Horizontal alignment of the header content. `'end'` right-aligns the cell\n(for numeric/right-aligned columns) *and* moves the sort glyph to the\nleading side, so the label stays flush with the column's right edge and\nlines up with the values below. Defaults to `'start'`.",required:!1,type:'"start" | "end"'}],_=[{name:"default",description:"Column label.",type:"any"},{name:"prefix",description:"Leading adornment, rendered before the label.",type:'{ direction: "asc" | "desc" | null; }'},{name:"suffix",description:"Sort glyph. Optional — the cell renders a built-in arrow from `direction`\nby default. Provide this to override (e.g. a custom lucide span). The cell\nowns the reveal: an inactive column's glyph shows on hover.",type:'{ direction: "asc" | "desc" | null; }'}],r=[{name:"click",description:"Fired on sort button click — update your sort state here.",type:"[event: MouseEvent]"}],T=[{name:"items",description:"Items to iterate — one default-slot render per item.",required:!0,type:"T[]"},{name:"rowKey",description:"How to derive a row's identity. A string reads that property off the item;\na function computes it. Drives the render `:key`, the header select-all\nuniverse, and the scoped `value` slot prop. Defaults to the item's `name`,\nthen `id`, then the index.",required:!1,type:"string | ((item: T, index: number) => PropertyKey)"},{name:"virtual",description:"Window the rows (vueuse useVirtualList) so only rows near the viewport\nmount. `itemHeight` defaults to the List's `rowHeight`; the scroll\ncontainer is the nearest scrollable ancestor.",required:!1,type:"boolean | ListVirtualOptions"}],O=[{name:"default",description:"One render per item — `{ item, index, value }`, where `value` is the row's resolved identity.",type:"{ item: T; index: number; value: string; }"}],N=[{name:"label",description:"Section label shown in the group header. Overridden by the #header slot.",required:!1,type:"string"},{name:"sticky",description:`Pin the group header to the top of the scroll container while its rows
scroll under it. Off by default.`,required:!1,type:"boolean"}],G=[{name:"default",description:"The group's rows — `<ListRow>` elements.",type:"any"},{name:"header",description:"Replaces the header content (the label).",type:"any"}];return(Rs,e)=>{const L=B("ComponentPreview"),J=B("ClientOnly");return f(),g("div",null,[e[10]||(e[10]=x("",6)),n(L,{name:"List-Feed"},{code:l(()=>[...e[0]||(e[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Avatar"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Badge"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"List"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ListRow"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ListCell"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/list"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," discussions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"1"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Weekly sync notes"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    author"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Rosa Diaz"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Sounds good, let us ship it on Monday"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    time"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2 h"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comments"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 4"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Redesigning the onboarding flow"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    author"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Jake Peralta"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"I added the new mockups to the page"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    time"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"5 h"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comments"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"3"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Q3 hiring plan"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    author"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Amy Santiago"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Two backend roles and one designer"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    time"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"1 d"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comments"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"4"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Incident review: search downtime"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    author"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Terry Jeffords"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Root cause was the index rebuild"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    time"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2 d"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comments"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 9"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"5"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Docs sprint retrospective"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    author"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Raymond Holt"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Velocity was acceptable."),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    time"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"4 d"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    comments"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 3"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," selectable"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"false"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," selection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," toggleSelectMode"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  selectable"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_50ecpt"}," !"),s("span",{class:"s_22m8k2"},"selectable"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  selection"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mb-2 flex h-7 items-center justify-end gap-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"selection.length"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        {{ selection.length }} selected")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1i4ay4"}," @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"toggleSelectMode"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        {{ selectable ? 'Done' : 'Select' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1i4ay4"}," :selectable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"selectable"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," v-model:selection"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"selection"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :row-height"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"60"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListRow")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"discussion in discussions"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"discussion.name"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"discussion.name"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"() => {}"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"Avatar"),s("span",{class:"s_1i4ay4"}," :label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"discussion.author"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," size"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"2xl"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"min-w-0"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"truncate text-base text-ink-gray-8"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"discussion.unread && 'font-semibold'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"              {{ discussion.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mt-1 truncate text-base text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"              {{ discussion.author }}: {{ discussion.comment }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"justify-end"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col items-end gap-1"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ discussion.time }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ discussion.comments }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(Ls)]),_:1}),e[11]||(e[11]=x("",2)),n(L,{name:"List-RowActions"},{code:l(()=>[...e[1]||(e[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"List"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ListRow"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ListCell"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/list"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," documents"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"1"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Q3 launch brief"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-file-text"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    updated"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2 h"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Hiring pipeline"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-file-spreadsheet"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    updated"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"5 h"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"3"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Onboarding flow"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-file-image"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    updated"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"1 d"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"4"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Retention report"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-file-chart-column"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    updated"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"3 d"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"5"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Support playbook"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-file-text"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    updated"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"6 d"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," opened"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," starred"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"(["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"2"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," toggleStar"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"id"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  starred"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," starred"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"includes"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"id"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"    ?"),s("span",{class:"s_22m8k2"}," starred"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"filter"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"s"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_50ecpt"},"=>"),s("span",{class:"s_22m8k2"}," s"),s("span",{class:"s_50ecpt"}," !=="),s("span",{class:"s_22m8k2"}," id"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"    :"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_fjrnv8"},"..."),s("span",{class:"s_22m8k2"},"starred"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_11933w"}," id"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mb-2 flex h-7 items-center justify-end text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        {{ starred.length }} starred")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        {{ opened ? ` · Opened: ${opened}` : ' · Click a row to open it' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- A row is one interactive element, so these rows stay static: the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'         content cell stretches an "open" button over the row (rows are')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"         `position: relative`) and the star button layers above it with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"         `relative` — the overlay's sibling, so no stopPropagation. The")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"         hover/active classes and list-row-px-3 restore the interactive look")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"         and inset a static row doesn't get for free. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"list-row-px-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :row-height"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"48"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListRow")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"doc in documents"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"doc.id"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active:bg-surface-gray-2 sm:rounded-[10px] sm:hover:bg-surface-gray-1"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"doc.icon"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"          /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'          <!-- `type="button"` so the pattern stays safe inside a form, and')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"               the row's own radius so the global `:focus-visible` outline")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"               follows the row's corners instead of cutting them square. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"absolute inset-0 sm:rounded-[10px]"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :aria-label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"`Open ${doc.title}`"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"opened = doc.title"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"          /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"truncate text-base text-ink-gray-8"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            {{ doc.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"justify-end gap-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ doc.updated }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"Button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"relative"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ghost"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              starred.includes(doc.id)")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                ? `Unstar ${doc.title}`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                : `Star ${doc.title}`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :aria-pressed"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"starred.includes(doc.id)"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"toggleStar(doc.id)"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"            <!-- Colour lives on an #icon-slot span: Button's ghost classes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"                 already set an ink colour on the button element, and without")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"                 tailwind-merge the stylesheet order — not this template —")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"                 would decide which class wins there. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"icon"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-star size-4"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                  starred.includes(doc.id)")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                    ? 'text-ink-gray-9'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                    : 'text-ink-gray-4'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'                "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"              /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(fs)]),_:1}),e[12]||(e[12]=x("",7)),n(L,{name:"List-Columns"},{code:l(()=>[...e[2]||(e[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"computed"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Avatar"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  List"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListRow"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListCell"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListHeader"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListHeaderCellSort"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListRows"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/list"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," members"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Rosa Diaz"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"rosa@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Admin"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2021-06"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Jake Peralta"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"jake@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Member"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2022-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Amy Santiago"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"amy@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Admin"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2020-11"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Terry Jeffords"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"terry@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Member"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2023-03"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Raymond Holt"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"holt@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Guest"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2024-08"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," activeMember"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"Rosa Diaz"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Sort state, toggle rules, comparator, and direction icons are all app")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// code — the header cells only render the chrome for whatever `direction`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// you hand them.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"type"),s("span",{class:"s_euu481"}," Field"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"name"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"role"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"since"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," sortIcon"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"direction"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"  if"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_50ecpt"},"!"),s("span",{class:"s_22m8k2"},"direction"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_29n2kq"},"return"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-arrow-up-down"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," direction"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-arrow-up"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-arrow-down"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sortField"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"Field"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"name"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," toggleSort"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"field"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Field"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," firstDirection"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"  if"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_22m8k2"},"sortField"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_22m8k2"}," field"),s("span",{class:"s_13ahmt"},") {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    sortDirection"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," sortDirection"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  } "),s("span",{class:"s_50ecpt"},"else"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    sortField"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," field")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    sortDirection"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," firstDirection")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," directionFor"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"field"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Field"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," sortField"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_22m8k2"}," field"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_22m8k2"}," sortDirection"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_40mev6"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sortedMembers"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," computed"),s("span",{class:"s_13ahmt"},"(()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," factor"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," sortDirection"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_2ekfrt"}," -"),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_40mev6"}," 1")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_fjrnv8"},"..."),s("span",{class:"s_11933w"},"members"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"sort"),s("span",{class:"s_13ahmt"},"(")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    ("),s("span",{class:"s_fsg3al"},"a"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," b"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_50ecpt"},"=>"),s("span",{class:"s_22m8k2"}," factor"),s("span",{class:"s_2ekfrt"}," *"),s("span",{class:"s_22m8k2"}," a"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_22m8k2"},"sortField"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"localeCompare"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"b"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_22m8k2"},"sortField"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  )")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"})")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  <!-- v-model:active makes the rows clickable, and clickable rows carry a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"       0.75rem hover-surface inset. `list-row-px-3` hands the header the same")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"       inset, so its labels stay aligned with the cell text below them — the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"       canonical pairing for a column-mode list with interactive rows. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"List")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    v-model:active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"activeMember"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-full list-row-px-3"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :columns"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"['minmax(0,1fr)', '7rem', '8rem']"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :row-height"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"56"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"ListHeader"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListHeaderCellSort"),s("span",{class:"s_1i4ay4"}," :direction"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"directionFor('name')"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"toggleSort('name')"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        Member")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," direction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"block size-3.5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sortIcon(direction)"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListHeaderCellSort"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListHeaderCellSort"),s("span",{class:"s_1i4ay4"}," :direction"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"directionFor('role')"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"toggleSort('role')"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        Role")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," direction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"block size-3.5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sortIcon(direction)"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListHeaderCellSort"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListHeaderCellSort")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :direction"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"directionFor('since')"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"justify-end"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"toggleSort('since', 'desc')"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        Member since")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," direction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"block size-3.5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sortIcon(direction)"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListHeaderCellSort"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"ListHeader"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"ListRows"),s("span",{class:"s_1i4ay4"}," :items"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sortedMembers"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ item: member, value }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1i4ay4"}," :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"value"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"Avatar"),s("span",{class:"s_1i4ay4"}," :label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"member.name"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," size"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"xl"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ml-3 min-w-0"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"truncate text-base text-ink-gray-8"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.name }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mt-0.5 truncate text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.email }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-base text-ink-gray-7"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.role }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"justify-end"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-base text-ink-gray-6"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.since }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"ListRows"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(ds)]),_:1}),e[13]||(e[13]=x("",14)),n(L,{name:"List-Responsive"},{code:l(()=>[...e[3]||(e[3]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Avatar"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  List"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListRow"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListCell"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListHeader"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListHeaderCell"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ListRows"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/list"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," members"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Rosa Diaz"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"rosa@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Admin"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2021-06"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Jake Peralta"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"jake@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Member"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2022-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Amy Santiago"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"amy@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Admin"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2020-11"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Terry Jeffords"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," email"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"terry@example.com"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," role"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Member"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," since"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2023-03"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  <!-- Narrow: name and date only. From md: the role column joins, and the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"       fixed tracks widen again at lg. Dropping a track never hides its cells")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"       on its own, so the Role header and cell carry `max-md:hidden` to match. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"List")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-full list-row-px-3"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :columns"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      base: ['minmax(0,1fr)', '6.5rem'],")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      md: ['minmax(0,1fr)', '7rem', '6rem'],")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      lg: ['minmax(0,2fr)', '9rem', '8rem'],")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"    }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :row-height"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"56"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"ListHeader"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListHeaderCell"),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Member"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"ListHeaderCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListHeaderCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"max-md:hidden"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Role"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"ListHeaderCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListHeaderCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"justify-end"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Member since"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"ListHeaderCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"ListHeader"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"ListRows"),s("span",{class:"s_1i4ay4"}," :items"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"members"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ item: member, value }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1i4ay4"}," :value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"value"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"Avatar"),s("span",{class:"s_1i4ay4"}," :label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"member.name"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," size"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"xl"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ml-3 min-w-0"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"truncate text-base text-ink-gray-8"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.name }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mt-0.5 truncate text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.email }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"max-md:hidden"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-base text-ink-gray-7"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.role }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"justify-end"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-base text-ink-gray-6"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ member.since }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"ListRows"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(cs)]),_:1}),e[14]||(e[14]=x("",2)),n(J,null,{default:l(()=>[n(L,{name:"List-Virtual"},{code:l(()=>[...e[4]||(e[4]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"List"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ListRow"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ListCell"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ListRows"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/list"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," items"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," Array"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"from"),s("span",{class:"s_13ahmt"},"({"),s("span",{class:"s_r4oegk"}," length"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1000"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"_"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," i"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," ({")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_indoxt"}," String"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"i"),s("span",{class:"s_2ekfrt"}," +"),s("span",{class:"s_40mev6"}," 1"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," `"),s("span",{class:"s_2575z4"},"Task "),s("span",{class:"s_20l85h"},"${"),s("span",{class:"s_22m8k2"},"i"),s("span",{class:"s_2ekfrt"}," +"),s("span",{class:"s_40mev6"}," 1"),s("span",{class:"s_20l85h"},"}"),s("span",{class:"s_w1p9wo"},"`"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  status"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_22m8k2"}," i"),s("span",{class:"s_2ekfrt"}," %"),s("span",{class:"s_40mev6"}," 3"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Done"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_22m8k2"}," i"),s("span",{class:"s_2ekfrt"}," %"),s("span",{class:"s_40mev6"}," 3"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 1"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"In progress"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Backlog"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  <!-- The scroll container is app-owned: ListRows finds the nearest")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"       scrollable ancestor and windows against it. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72 w-full overflow-y-auto rounded-4 border"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1i4ay4"}," :columns"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"['3rem', 'minmax(0,1fr)', '6rem']"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :row-height"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"44"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"px-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ListRows"),s("span",{class:"s_1i4ay4"}," :items"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"items"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," virtual"),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ item }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-4"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"#{{ item.id }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"truncate text-base text-ink-gray-8"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ item.title }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"justify-end"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"{{ item.status }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"ListCell"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"ListRow"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ListRows"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"List"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:l(()=>[n(ss)]),_:1})]),_:1}),e[15]||(e[15]=x("",11)),n(C,{name:"List",data:u},{code:l(()=>[...e[5]||(e[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * One complete track template per breakpoint. `base` is required and applies")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * from zero width up; every other key names a breakpoint from the app's")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Tailwind `screens` and applies from that viewport width upward, until the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * next supplied breakpoint. `sm` / `md` / `lg` / `xl` are the preset's own")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * names — an app with custom screens uses its own. A screen that is not a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * plain width (a `{ min, max }` band, a `{ max }` ceiling, a `{ raw }` query)")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * gives a tier that is live wherever that screen's own variants are live.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A key that is not one of the app's screens is ignored — its template never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * applies. The index signature has to stay open because the names belong to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the app, so the type cannot reject it; a dev-mode warning does.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Each value replaces the whole template. Arrays are never merged track by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * track, so a breakpoint may change the track count as well as the widths.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Applies from zero width, up to the smallest supplied breakpoint. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  base"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sm"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  md"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lg"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xl"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_11933w"},"breakpoint"),s("span",{class:"s_kq5psm"},": "),s("span",{class:"s_11933w"},"string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `columns` in either form: one template for every width, or one template per")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * breakpoint.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListColumns"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row, so independent row grids can't agree.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Pass an array for one template at every width, or an object keyed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * breakpoint for a template that changes with the viewport:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `{ base: ['minmax(0,1fr)', '80px'], md: ['minmax(0,2fr)', '140px', '100px'] }`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `base` is required, each breakpoint replaces the whole template, and an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted breakpoint keeps the one below it. Breakpoints are the consuming")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * app's own Tailwind `screens`, resolved in CSS — so `md` here and `md:hidden`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * on a cell switch at the same width. A key that is not one of those screens")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * is ignored: its template never applies, and a dev-mode warning names it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Changing the track count never hides a cell: pair it with matching")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * visibility classes on the header and the rows.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListColumns")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Divider treatment between rows: `inset` starts at the content column")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (the text edge), `full` spans all columns. Defaults to `inset` with the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default feed template, `full` when `columns` is set.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListDivider")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Reveals the animated checkbox column and switches row click from")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * navigate to toggle. Selected values surface via `v-model:selection`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selectable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Two more models live on List but aren't plain props (so they're not in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // this interface): `v-model:selection` (string[], the checkbox set) and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // `v-model:active` (string, the single open/highlighted row — the List")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // styles it and hides the dividers hugging it). See List.vue.")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fixed row height in px. Required for virtualization; without it rows size")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * to their content. Responsive heights are non-virtual — set them with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * height classes on the rows instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rowHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListRowProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Renders the row as a RouterLink. Without `to`, a row with a click")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * listener renders as a button; otherwise a plain div.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Row key — the `selection` key when `selectable` and the `v-model:active`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * key. Required whenever the list uses either.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the row is activated, unless selection mode claims the click. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListHeaderCellSortProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Active sort direction for this column, `null`/omitted when inactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The cell is controlled — sort state and toggle rules are app-owned:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * update whatever drives your ordering in the `click` handler.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  direction"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Horizontal alignment of the header content. `'end'` right-aligns the cell")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (for numeric/right-aligned columns) *and* moves the sort glyph to the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * leading side, so the label stays flush with the column's right edge and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * lines up with the values below. Defaults to `'start'`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListVirtualOptions"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row height in px. Defaults to the List's `rowHeight`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  itemHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rows rendered beyond the visible window on each side. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  overscan"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(z,{data:d}),n($,{data:c}),e[16]||(e[16]=s("h3",{id:"listrow",tabindex:"-1"},[a("ListRow "),s("a",{class:"header-anchor",href:"#listrow","aria-label":"Permalink to “ListRow”"},"​")],-1)),n(C,{name:"ListRow",data:o},{code:l(()=>[...e[6]||(e[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * One complete track template per breakpoint. `base` is required and applies")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * from zero width up; every other key names a breakpoint from the app's")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Tailwind `screens` and applies from that viewport width upward, until the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * next supplied breakpoint. `sm` / `md` / `lg` / `xl` are the preset's own")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * names — an app with custom screens uses its own. A screen that is not a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * plain width (a `{ min, max }` band, a `{ max }` ceiling, a `{ raw }` query)")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * gives a tier that is live wherever that screen's own variants are live.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A key that is not one of the app's screens is ignored — its template never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * applies. The index signature has to stay open because the names belong to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the app, so the type cannot reject it; a dev-mode warning does.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Each value replaces the whole template. Arrays are never merged track by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * track, so a breakpoint may change the track count as well as the widths.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Applies from zero width, up to the smallest supplied breakpoint. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  base"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sm"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  md"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lg"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xl"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_11933w"},"breakpoint"),s("span",{class:"s_kq5psm"},": "),s("span",{class:"s_11933w"},"string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `columns` in either form: one template for every width, or one template per")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * breakpoint.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListColumns"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row, so independent row grids can't agree.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Pass an array for one template at every width, or an object keyed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * breakpoint for a template that changes with the viewport:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `{ base: ['minmax(0,1fr)', '80px'], md: ['minmax(0,2fr)', '140px', '100px'] }`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `base` is required, each breakpoint replaces the whole template, and an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted breakpoint keeps the one below it. Breakpoints are the consuming")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * app's own Tailwind `screens`, resolved in CSS — so `md` here and `md:hidden`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * on a cell switch at the same width. A key that is not one of those screens")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * is ignored: its template never applies, and a dev-mode warning names it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Changing the track count never hides a cell: pair it with matching")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * visibility classes on the header and the rows.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListColumns")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Divider treatment between rows: `inset` starts at the content column")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (the text edge), `full` spans all columns. Defaults to `inset` with the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default feed template, `full` when `columns` is set.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListDivider")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Reveals the animated checkbox column and switches row click from")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * navigate to toggle. Selected values surface via `v-model:selection`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selectable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Two more models live on List but aren't plain props (so they're not in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // this interface): `v-model:selection` (string[], the checkbox set) and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // `v-model:active` (string, the single open/highlighted row — the List")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // styles it and hides the dividers hugging it). See List.vue.")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fixed row height in px. Required for virtualization; without it rows size")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * to their content. Responsive heights are non-virtual — set them with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * height classes on the rows instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rowHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListRowProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Renders the row as a RouterLink. Without `to`, a row with a click")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * listener renders as a button; otherwise a plain div.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Row key — the `selection` key when `selectable` and the `v-model:active`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * key. Required whenever the list uses either.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the row is activated, unless selection mode claims the click. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListHeaderCellSortProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Active sort direction for this column, `null`/omitted when inactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The cell is controlled — sort state and toggle rules are app-owned:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * update whatever drives your ordering in the `click` handler.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  direction"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Horizontal alignment of the header content. `'end'` right-aligns the cell")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (for numeric/right-aligned columns) *and* moves the sort glyph to the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * leading side, so the label stays flush with the column's right edge and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * lines up with the values below. Defaults to `'start'`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListVirtualOptions"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row height in px. Defaults to the List's `rowHeight`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  itemHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rows rendered beyond the visible window on each side. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  overscan"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(z,{data:h}),e[17]||(e[17]=s("h3",{id:"listcell",tabindex:"-1"},[a("ListCell "),s("a",{class:"header-anchor",href:"#listcell","aria-label":"Permalink to “ListCell”"},"​")],-1)),n(z,{data:y}),e[18]||(e[18]=s("h3",{id:"listheader",tabindex:"-1"},[a("ListHeader "),s("a",{class:"header-anchor",href:"#listheader","aria-label":"Permalink to “ListHeader”"},"​")],-1)),n(z,{data:t}),e[19]||(e[19]=s("h3",{id:"listheadercell",tabindex:"-1"},[a("ListHeaderCell "),s("a",{class:"header-anchor",href:"#listheadercell","aria-label":"Permalink to “ListHeaderCell”"},"​")],-1)),n(z,{data:b}),e[20]||(e[20]=s("h3",{id:"listheadercellsort",tabindex:"-1"},[a("ListHeaderCellSort "),s("a",{class:"header-anchor",href:"#listheadercellsort","aria-label":"Permalink to “ListHeaderCellSort”"},"​")],-1)),n(C,{name:"ListHeaderCellSort",data:m},{code:l(()=>[...e[7]||(e[7]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * One complete track template per breakpoint. `base` is required and applies")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * from zero width up; every other key names a breakpoint from the app's")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Tailwind `screens` and applies from that viewport width upward, until the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * next supplied breakpoint. `sm` / `md` / `lg` / `xl` are the preset's own")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * names — an app with custom screens uses its own. A screen that is not a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * plain width (a `{ min, max }` band, a `{ max }` ceiling, a `{ raw }` query)")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * gives a tier that is live wherever that screen's own variants are live.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A key that is not one of the app's screens is ignored — its template never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * applies. The index signature has to stay open because the names belong to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the app, so the type cannot reject it; a dev-mode warning does.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Each value replaces the whole template. Arrays are never merged track by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * track, so a breakpoint may change the track count as well as the widths.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Applies from zero width, up to the smallest supplied breakpoint. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  base"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sm"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  md"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lg"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xl"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_11933w"},"breakpoint"),s("span",{class:"s_kq5psm"},": "),s("span",{class:"s_11933w"},"string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `columns` in either form: one template for every width, or one template per")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * breakpoint.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListColumns"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row, so independent row grids can't agree.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Pass an array for one template at every width, or an object keyed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * breakpoint for a template that changes with the viewport:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `{ base: ['minmax(0,1fr)', '80px'], md: ['minmax(0,2fr)', '140px', '100px'] }`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `base` is required, each breakpoint replaces the whole template, and an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted breakpoint keeps the one below it. Breakpoints are the consuming")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * app's own Tailwind `screens`, resolved in CSS — so `md` here and `md:hidden`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * on a cell switch at the same width. A key that is not one of those screens")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * is ignored: its template never applies, and a dev-mode warning names it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Changing the track count never hides a cell: pair it with matching")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * visibility classes on the header and the rows.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListColumns")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Divider treatment between rows: `inset` starts at the content column")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (the text edge), `full` spans all columns. Defaults to `inset` with the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default feed template, `full` when `columns` is set.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListDivider")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Reveals the animated checkbox column and switches row click from")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * navigate to toggle. Selected values surface via `v-model:selection`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selectable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Two more models live on List but aren't plain props (so they're not in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // this interface): `v-model:selection` (string[], the checkbox set) and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // `v-model:active` (string, the single open/highlighted row — the List")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // styles it and hides the dividers hugging it). See List.vue.")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fixed row height in px. Required for virtualization; without it rows size")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * to their content. Responsive heights are non-virtual — set them with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * height classes on the rows instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rowHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListRowProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Renders the row as a RouterLink. Without `to`, a row with a click")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * listener renders as a button; otherwise a plain div.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Row key — the `selection` key when `selectable` and the `v-model:active`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * key. Required whenever the list uses either.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the row is activated, unless selection mode claims the click. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListHeaderCellSortProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Active sort direction for this column, `null`/omitted when inactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The cell is controlled — sort state and toggle rules are app-owned:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * update whatever drives your ordering in the `click` handler.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  direction"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Horizontal alignment of the header content. `'end'` right-aligns the cell")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (for numeric/right-aligned columns) *and* moves the sort glyph to the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * leading side, so the label stays flush with the column's right edge and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * lines up with the values below. Defaults to `'start'`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListVirtualOptions"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row height in px. Defaults to the List's `rowHeight`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  itemHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rows rendered beyond the visible window on each side. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  overscan"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(z,{data:_}),n($,{data:r}),e[21]||(e[21]=s("h3",{id:"listrows",tabindex:"-1"},[a("ListRows "),s("a",{class:"header-anchor",href:"#listrows","aria-label":"Permalink to “ListRows”"},"​")],-1)),n(C,{name:"ListRows",data:T},{code:l(()=>[...e[8]||(e[8]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * One complete track template per breakpoint. `base` is required and applies")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * from zero width up; every other key names a breakpoint from the app's")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Tailwind `screens` and applies from that viewport width upward, until the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * next supplied breakpoint. `sm` / `md` / `lg` / `xl` are the preset's own")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * names — an app with custom screens uses its own. A screen that is not a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * plain width (a `{ min, max }` band, a `{ max }` ceiling, a `{ raw }` query)")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * gives a tier that is live wherever that screen's own variants are live.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A key that is not one of the app's screens is ignored — its template never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * applies. The index signature has to stay open because the names belong to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the app, so the type cannot reject it; a dev-mode warning does.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Each value replaces the whole template. Arrays are never merged track by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * track, so a breakpoint may change the track count as well as the widths.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Applies from zero width, up to the smallest supplied breakpoint. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  base"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sm"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  md"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lg"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xl"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_11933w"},"breakpoint"),s("span",{class:"s_kq5psm"},": "),s("span",{class:"s_11933w"},"string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `columns` in either form: one template for every width, or one template per")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * breakpoint.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListColumns"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row, so independent row grids can't agree.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Pass an array for one template at every width, or an object keyed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * breakpoint for a template that changes with the viewport:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `{ base: ['minmax(0,1fr)', '80px'], md: ['minmax(0,2fr)', '140px', '100px'] }`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `base` is required, each breakpoint replaces the whole template, and an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted breakpoint keeps the one below it. Breakpoints are the consuming")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * app's own Tailwind `screens`, resolved in CSS — so `md` here and `md:hidden`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * on a cell switch at the same width. A key that is not one of those screens")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * is ignored: its template never applies, and a dev-mode warning names it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Changing the track count never hides a cell: pair it with matching")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * visibility classes on the header and the rows.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListColumns")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Divider treatment between rows: `inset` starts at the content column")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (the text edge), `full` spans all columns. Defaults to `inset` with the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default feed template, `full` when `columns` is set.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListDivider")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Reveals the animated checkbox column and switches row click from")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * navigate to toggle. Selected values surface via `v-model:selection`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selectable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Two more models live on List but aren't plain props (so they're not in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // this interface): `v-model:selection` (string[], the checkbox set) and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // `v-model:active` (string, the single open/highlighted row — the List")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // styles it and hides the dividers hugging it). See List.vue.")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fixed row height in px. Required for virtualization; without it rows size")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * to their content. Responsive heights are non-virtual — set them with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * height classes on the rows instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rowHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListRowProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Renders the row as a RouterLink. Without `to`, a row with a click")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * listener renders as a button; otherwise a plain div.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Row key — the `selection` key when `selectable` and the `v-model:active`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * key. Required whenever the list uses either.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the row is activated, unless selection mode claims the click. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListHeaderCellSortProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Active sort direction for this column, `null`/omitted when inactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The cell is controlled — sort state and toggle rules are app-owned:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * update whatever drives your ordering in the `click` handler.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  direction"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Horizontal alignment of the header content. `'end'` right-aligns the cell")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (for numeric/right-aligned columns) *and* moves the sort glyph to the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * leading side, so the label stays flush with the column's right edge and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * lines up with the values below. Defaults to `'start'`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListVirtualOptions"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row height in px. Defaults to the List's `rowHeight`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  itemHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rows rendered beyond the visible window on each side. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  overscan"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(z,{data:O}),e[22]||(e[22]=s("h3",{id:"listgroup",tabindex:"-1"},[a("ListGroup "),s("a",{class:"header-anchor",href:"#listgroup","aria-label":"Permalink to “ListGroup”"},"​")],-1)),n(C,{name:"ListGroup",data:N},{code:l(()=>[...e[9]||(e[9]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * One complete track template per breakpoint. `base` is required and applies")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * from zero width up; every other key names a breakpoint from the app's")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Tailwind `screens` and applies from that viewport width upward, until the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * next supplied breakpoint. `sm` / `md` / `lg` / `xl` are the preset's own")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * names — an app with custom screens uses its own. A screen that is not a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * plain width (a `{ min, max }` band, a `{ max }` ceiling, a `{ raw }` query)")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * gives a tier that is live wherever that screen's own variants are live.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A key that is not one of the app's screens is ignored — its template never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * applies. The index signature has to stay open because the names belong to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the app, so the type cannot reject it; a dev-mode warning does.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Each value replaces the whole template. Arrays are never merged track by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * track, so a breakpoint may change the track count as well as the widths.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Applies from zero width, up to the smallest supplied breakpoint. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  base"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sm"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  md"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lg"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xl"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_11933w"},"breakpoint"),s("span",{class:"s_kq5psm"},": "),s("span",{class:"s_11933w"},"string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `columns` in either form: one template for every width, or one template per")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * breakpoint.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListColumns"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," ListColumnsByBreakpoint")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row, so independent row grids can't agree.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Pass an array for one template at every width, or an object keyed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * breakpoint for a template that changes with the viewport:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `{ base: ['minmax(0,1fr)', '80px'], md: ['minmax(0,2fr)', '140px', '100px'] }`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `base` is required, each breakpoint replaces the whole template, and an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted breakpoint keeps the one below it. Breakpoints are the consuming")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * app's own Tailwind `screens`, resolved in CSS — so `md` here and `md:hidden`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * on a cell switch at the same width. A key that is not one of those screens")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * is ignored: its template never applies, and a dev-mode warning names it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Changing the track count never hides a cell: pair it with matching")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * visibility classes on the header and the rows.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListColumns")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Divider treatment between rows: `inset` starts at the content column")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (the text edge), `full` spans all columns. Defaults to `inset` with the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default feed template, `full` when `columns` is set.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListDivider")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Reveals the animated checkbox column and switches row click from")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * navigate to toggle. Selected values surface via `v-model:selection`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selectable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Two more models live on List but aren't plain props (so they're not in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // this interface): `v-model:selection` (string[], the checkbox set) and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // `v-model:active` (string, the single open/highlighted row — the List")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // styles it and hides the dividers hugging it). See List.vue.")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fixed row height in px. Required for virtualization; without it rows size")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * to their content. Responsive heights are non-virtual — set them with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * height classes on the rows instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rowHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListRowProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Renders the row as a RouterLink. Without `to`, a row with a click")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * listener renders as a button; otherwise a plain div.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Row key — the `selection` key when `selectable` and the `v-model:active`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * key. Required whenever the list uses either.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the row is activated, unless selection mode claims the click. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListHeaderCellSortProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Active sort direction for this column, `null`/omitted when inactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The cell is controlled — sort state and toggle rules are app-owned:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * update whatever drives your ordering in the `click` handler.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  direction"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Horizontal alignment of the header content. `'end'` right-aligns the cell")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (for numeric/right-aligned columns) *and* moves the sort glyph to the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * leading side, so the label stays flush with the column's right edge and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * lines up with the values below. Defaults to `'start'`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListVirtualOptions"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row height in px. Defaults to the List's `rowHeight`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  itemHeight"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rows rendered beyond the visible window on each side. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  overscan"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(z,{data:G})])}}});export{Fs as __pageData,Ms as default};
