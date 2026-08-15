import{_ as z}from"./chunks/PropsTable.BAKubfUu.js";import{_ as y}from"./chunks/SlotsTable.Ck8bK-wX.js";import{_ as H}from"./chunks/EmitsTable.BGe5DBM6.js";import{_ as q,a as T,b as w}from"./chunks/ListCell.vue_vue_type_script_setup_true_lang.Dx7NiebO.js";import{_ as A}from"./chunks/ListRows.vue_vue_type_script_setup_true_lang.CHVawvhr.js";import{I as D,ad as v,r as g,D as n,aE as c,be as e,o as s,au as _,p as B,B as a,a0 as k,aj as x,l as E,q as G,F as O,am as N,ao as P,A as j}from"./chunks/framework.1L9nD1RG.js";import{Q as F,J,N as W}from"./chunks/theme.DBhZkpjH.js";import{_ as Q}from"./chunks/ListHeader.vue_vue_type_script_setup_true_lang.DC8mD6xY.js";import{_ as S}from"./chunks/ListHeaderCellSort.vue_vue_type_script_setup_true_lang.3p-HYBrH.js";const U={class:"h-72 w-full overflow-y-auto rounded-4 border"},K={class:"text-sm text-ink-gray-4"},Y={class:"truncate text-base text-ink-gray-8"},X={class:"text-sm text-ink-gray-5"},Z=D({__name:"Virtual",setup(b){const f=Array.from({length:1e3},(h,i)=>({id:String(i+1),title:`Task ${i+1}`,status:i%3===0?"Done":i%3===1?"In progress":"Backlog"}));return(h,i)=>(v(),g("div",U,[n(c(q),{columns:["3rem","minmax(0,1fr)","6rem"],"row-height":44,class:"px-2"},{default:e(()=>[n(c(A),{items:c(f),virtual:""},{default:e(({item:r})=>[n(c(T),null,{default:e(()=>[n(c(w),null,{default:e(()=>[s("span",K,"#"+_(r.id),1)]),_:2},1024),n(c(w),null,{default:e(()=>[s("span",Y,_(r.title),1)]),_:2},1024),n(c(w),{class:"justify-end"},{default:e(()=>[s("span",X,_(r.status),1)]),_:2},1024)]),_:2},1024)]),_:1},8,["items"])]),_:1})]))}}),ss={class:"ml-3 min-w-0"},as={class:"truncate text-base text-ink-gray-8"},ns={class:"mt-0.5 truncate text-sm text-ink-gray-5"},ls={class:"text-base text-ink-gray-7"},es={class:"text-base text-ink-gray-6"},cs=D({__name:"Columns",setup(b){const f=[{name:"Rosa Diaz",email:"rosa@example.com",role:"Admin",since:"2021-06"},{name:"Jake Peralta",email:"jake@example.com",role:"Member",since:"2022-01"},{name:"Amy Santiago",email:"amy@example.com",role:"Admin",since:"2020-11"},{name:"Terry Jeffords",email:"terry@example.com",role:"Member",since:"2023-03"},{name:"Raymond Holt",email:"holt@example.com",role:"Guest",since:"2024-08"}],h=x("Rosa Diaz");function i(d){return d?d==="asc"?"lucide-arrow-up":"lucide-arrow-down":"lucide-arrow-up-down"}const r=x("name"),u=x("asc");function m(d,p="asc"){r.value===d?u.value=u.value==="asc"?"desc":"asc":(r.value=d,u.value=p)}function o(d){return r.value===d?u.value:null}const L=E(()=>{const d=u.value==="desc"?-1:1;return[...f].sort((p,t)=>d*p[r.value].localeCompare(t[r.value]))});return(d,p)=>(v(),B(c(q),{active:h.value,"onUpdate:active":p[3]||(p[3]=t=>h.value=t),class:"w-full list-row-px-3",columns:["minmax(0,1fr)","7rem","8rem"],"row-height":56},{default:e(()=>[n(c(Q),null,{default:e(()=>[n(c(S),{direction:o("name"),onClick:p[0]||(p[0]=t=>m("name"))},{suffix:e(({direction:t})=>[s("span",{class:k(["block size-3.5",i(t)])},null,2)]),default:e(()=>[p[4]||(p[4]=a(" Member ",-1))]),_:1},8,["direction"]),n(c(S),{direction:o("role"),onClick:p[1]||(p[1]=t=>m("role"))},{suffix:e(({direction:t})=>[s("span",{class:k(["block size-3.5",i(t)])},null,2)]),default:e(()=>[p[5]||(p[5]=a(" Role ",-1))]),_:1},8,["direction"]),n(c(S),{direction:o("since"),class:"justify-end",onClick:p[2]||(p[2]=t=>m("since","desc"))},{suffix:e(({direction:t})=>[s("span",{class:k(["block size-3.5",i(t)])},null,2)]),default:e(()=>[p[6]||(p[6]=a(" Member since ",-1))]),_:1},8,["direction"])]),_:1}),n(c(A),{items:L.value},{default:e(({item:t,value:R})=>[n(c(T),{value:R},{default:e(()=>[n(c(w),null,{default:e(()=>[n(c(F),{label:t.name,size:"xl"},null,8,["label"]),s("div",ss,[s("div",as,_(t.name),1),s("div",ns,_(t.email),1)])]),_:2},1024),n(c(w),null,{default:e(()=>[s("span",ls,_(t.role),1)]),_:2},1024),n(c(w),{class:"justify-end"},{default:e(()=>[s("span",es,_(t.since),1)]),_:2},1024)]),_:2},1032,["value"])]),_:1},8,["items"])]),_:1},8,["active"]))}}),ps={class:"w-full"},ts={class:"mb-2 flex h-7 items-center justify-end gap-3"},is={key:0,class:"text-sm text-ink-gray-5"},os={class:"min-w-0"},_s={class:"mt-1 truncate text-base text-ink-gray-5"},rs={class:"flex flex-col items-end gap-1"},ds={class:"text-sm text-ink-gray-5"},hs=D({__name:"Feed",setup(b){const f=[{name:"1",title:"Weekly sync notes",author:"Rosa Diaz",comment:"Sounds good, let us ship it on Monday",time:"2 h",comments:4,unread:!0},{name:"2",title:"Redesigning the onboarding flow",author:"Jake Peralta",comment:"I added the new mockups to the page",time:"5 h",comments:12,unread:!1},{name:"3",title:"Q3 hiring plan",author:"Amy Santiago",comment:"Two backend roles and one designer",time:"1 d",comments:7,unread:!0},{name:"4",title:"Incident review: search downtime",author:"Terry Jeffords",comment:"Root cause was the index rebuild",time:"2 d",comments:9,unread:!1},{name:"5",title:"Docs sprint retrospective",author:"Raymond Holt",comment:"Velocity was acceptable.",time:"4 d",comments:3,unread:!1}],h=x(!1),i=x([]);function r(){h.value=!h.value,i.value=[]}return(u,m)=>(v(),g("div",ps,[s("div",ts,[i.value.length?(v(),g("span",is,_(i.value.length)+" selected ",1)):G("",!0),n(c(J),{onClick:r},{default:e(()=>[a(_(h.value?"Done":"Select"),1)]),_:1})]),n(c(q),{selectable:h.value,selection:i.value,"onUpdate:selection":m[0]||(m[0]=o=>i.value=o),"row-height":60},{default:e(()=>[(v(),g(O,null,N(f,o=>n(c(T),{key:o.name,value:o.name,onClick:()=>{}},{default:e(()=>[n(c(w),null,{default:e(()=>[n(c(F),{label:o.author,size:"2xl"},null,8,["label"])]),_:2},1024),n(c(w),null,{default:e(()=>[s("div",os,[s("div",{class:k(["truncate text-base text-ink-gray-8",o.unread&&"font-semibold"])},_(o.title),3),s("div",_s,_(o.author)+": "+_(o.comment),1)])]),_:2},1024),n(c(w),{class:"justify-end"},{default:e(()=>[s("div",rs,[s("span",ds,_(o.time),1),n(c(W),null,{default:e(()=>[a(_(o.comments),1)]),_:2},1024)])]),_:2},1024)]),_:2},1032,["value"])),64))]),_:1},8,["selectable","selection"])]))}}),bs=JSON.parse('{"title":"List","description":"","frontmatter":{},"headers":[],"relativePath":"docs/molecules/list.md","filePath":"docs/molecules/list.md","lastUpdated":1782986620000}'),ws={name:"docs/molecules/list.md"},Ls=Object.assign(ws,{setup(b){const f=[{name:"columns",description:"Grid track sizes shared by the header and every row. Defaults to the feed\ntemplate `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,\ntrailing). Table-style lists must pass deterministic track sizes — `auto`\ntracks size independently per row. The `--list-columns` styling hook\noverrides this per breakpoint: a consumer class always beats the prop.",required:!1,type:"string[]"},{name:"divider",description:"Divider treatment between rows: `inset` starts at the content column\n(the text edge), `full` spans all columns. Defaults to `inset` with the\ndefault feed template, `full` when `columns` is set.",required:!1,type:"ListDivider"},{name:"selectable",description:"Reveals the animated checkbox column and switches row click from\nnavigate to toggle. Selected values surface via `v-model:selection`.",required:!1,type:"boolean"},{name:"rowHeight",description:`Fixed row height in px. Required for virtualization; without it rows size
to their content. Responsive heights are non-virtual — set them with
height classes on the rows instead.`,required:!1,type:"number"},{name:"selection",description:"The checkbox-selected row values, when `selectable` reveals the checkbox\ncolumn. Two-way — toggling a row's checkbox updates this set.",required:!1,type:"string[]",default:"[]"},{name:"active",description:"The single open/highlighted row, for a master–detail layout. Binding this\nmodel is what opts a list into active-row tracking — an unbound list shows\nno highlight. Independent of `selection`.",required:!1,type:"string"}],h=[{name:"default",description:"The list's rows — `<ListRow>` / `<ListRows>`, optionally under `<ListHeader>` / `<ListGroup>`.",type:"any"}],i=[{name:"update:selection",description:"Fired when the selection changes.",type:"[value: string[]]"},{name:"update:active",description:"Fired when the active changes.",type:"[value: string | undefined]"}],r=[{name:"to",description:"Renders the row as a RouterLink. Without `to`, a row with a click\nlistener renders as a button; otherwise a plain div.",required:!1,type:"string | kt | Tt"},{name:"value",description:"Row key — the `selection` key when `selectable` and the `v-model:active`\nkey. Required whenever the list uses either.",required:!1,type:"string"},{name:"onClick",description:"Fired when the row is activated, unless selection mode claims the click.",required:!1,type:"((event: MouseEvent) => void)"}],u=[{name:"default",description:"The row's cells — `<ListCell>` elements, or feed content directly.",type:"any"}],m=[{name:"default",description:"The cell's content.",type:"any"}],o=[{name:"default",description:"The header's columns — `<ListHeaderCell>` / `<ListHeaderCellSort>` elements.",type:"any"}],L=[{name:"default",description:"Column label.",type:"any"},{name:"prefix",description:"Leading adornment, rendered before the label.",type:"any"},{name:"suffix",description:"Trailing adornment, rendered after the label.",type:"any"}],d=[{name:"direction",description:"Active sort direction for this column, `null`/omitted when inactive.\nThe cell is controlled — sort state and toggle rules are app-owned:\nupdate whatever drives your ordering in the `click` handler.",required:!1,type:"ListSortDirection | null"},{name:"align",description:"Horizontal alignment of the header content. `'end'` right-aligns the cell\n(for numeric/right-aligned columns) *and* moves the sort glyph to the\nleading side, so the label stays flush with the column's right edge and\nlines up with the values below. Defaults to `'start'`.",required:!1,type:'"start" | "end"'}],p=[{name:"default",description:"Column label.",type:"any"},{name:"prefix",description:"Leading adornment, rendered before the label.",type:'{ direction: "asc" | "desc" | null; }'},{name:"suffix",description:"Sort glyph. Optional — the cell renders a built-in arrow from `direction`\nby default. Provide this to override (e.g. a custom lucide span). The cell\nowns the reveal: an inactive column's glyph shows on hover.",type:'{ direction: "asc" | "desc" | null; }'}],t=[{name:"click",description:"Fired on sort button click — update your sort state here.",type:"[event: MouseEvent]"}],R=[{name:"items",description:"Items to iterate — one default-slot render per item.",required:!0,type:"T[]"},{name:"rowKey",description:"How to derive a row's identity. A string reads that property off the item;\na function computes it. Drives the render `:key`, the header select-all\nuniverse, and the scoped `value` slot prop. Defaults to the item's `name`,\nthen `id`, then the index.",required:!1,type:"string | ((item: T, index: number) => PropertyKey)"},{name:"virtual",description:"Window the rows (vueuse useVirtualList) so only rows near the viewport\nmount. `itemHeight` defaults to the List's `rowHeight`; the scroll\ncontainer is the nearest scrollable ancestor.",required:!1,type:"boolean | ListVirtualOptions"}],I=[{name:"default",description:"One render per item — `{ item, index, value }`, where `value` is the row's resolved identity.",type:"{ item: T; index: number; value: string; }"}],V=[{name:"label",description:"Section label shown in the group header. Overridden by the #header slot.",required:!1,type:"string"},{name:"sticky",description:`Pin the group header to the top of the scroll container while its rows
scroll under it. Off by default.`,required:!1,type:"boolean"}],$=[{name:"default",description:"The group's rows — `<ListRow>` elements.",type:"any"},{name:"header",description:"Replaces the header content (the label).",type:"any"}];return(us,l)=>{const C=P("ComponentPreview"),M=P("ClientOnly");return v(),g("div",null,[l[8]||(l[8]=j("",6)),n(C,{name:"List-Feed"},{code:e(()=>[...l[0]||(l[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[n(hs)]),_:1}),l[9]||(l[9]=j("",6)),n(C,{name:"List-Columns"},{code:e(()=>[...l[1]||(l[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[n(cs)]),_:1}),l[10]||(l[10]=j("",2)),n(M,null,{default:e(()=>[n(C,{name:"List-Virtual"},{code:e(()=>[...l[2]||(l[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[n(Z)]),_:1})]),_:1}),l[11]||(l[11]=j("",12)),n(z,{name:"List",data:f},{code:e(()=>[...l[3]||(l[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row. The `--list-columns` styling hook")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * overrides this per breakpoint: a consumer class always beats the prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(y,{data:h}),n(H,{data:i}),l[12]||(l[12]=s("h3",{id:"listrow",tabindex:"-1"},[a("ListRow "),s("a",{class:"header-anchor",href:"#listrow","aria-label":"Permalink to “ListRow”"},"​")],-1)),n(z,{name:"ListRow",data:r},{code:e(()=>[...l[4]||(l[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row. The `--list-columns` styling hook")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * overrides this per breakpoint: a consumer class always beats the prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(y,{data:u}),l[13]||(l[13]=s("h3",{id:"listcell",tabindex:"-1"},[a("ListCell "),s("a",{class:"header-anchor",href:"#listcell","aria-label":"Permalink to “ListCell”"},"​")],-1)),n(y,{data:m}),l[14]||(l[14]=s("h3",{id:"listheader",tabindex:"-1"},[a("ListHeader "),s("a",{class:"header-anchor",href:"#listheader","aria-label":"Permalink to “ListHeader”"},"​")],-1)),n(y,{data:o}),l[15]||(l[15]=s("h3",{id:"listheadercell",tabindex:"-1"},[a("ListHeaderCell "),s("a",{class:"header-anchor",href:"#listheadercell","aria-label":"Permalink to “ListHeaderCell”"},"​")],-1)),n(y,{data:L}),l[16]||(l[16]=s("h3",{id:"listheadercellsort",tabindex:"-1"},[a("ListHeaderCellSort "),s("a",{class:"header-anchor",href:"#listheadercellsort","aria-label":"Permalink to “ListHeaderCellSort”"},"​")],-1)),n(z,{name:"ListHeaderCellSort",data:d},{code:e(()=>[...l[5]||(l[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row. The `--list-columns` styling hook")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * overrides this per breakpoint: a consumer class always beats the prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(y,{data:p}),n(H,{data:t}),l[17]||(l[17]=s("h3",{id:"listrows",tabindex:"-1"},[a("ListRows "),s("a",{class:"header-anchor",href:"#listrows","aria-label":"Permalink to “ListRows”"},"​")],-1)),n(z,{name:"ListRows",data:R},{code:e(()=>[...l[6]||(l[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row. The `--list-columns` styling hook")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * overrides this per breakpoint: a consumer class always beats the prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(y,{data:I}),l[18]||(l[18]=s("h3",{id:"listgroup",tabindex:"-1"},[a("ListGroup "),s("a",{class:"header-anchor",href:"#listgroup","aria-label":"Permalink to “ListGroup”"},"​")],-1)),n(z,{name:"ListGroup",data:V},{code:e(()=>[...l[7]||(l[7]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListDivider"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inset"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"none"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ListSortDirection"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"asc"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"desc"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," ListProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Grid track sizes shared by the header and every row. Defaults to the feed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * trailing). Table-style lists must pass deterministic track sizes — `auto`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * tracks size independently per row. The `--list-columns` styling hook")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * overrides this per breakpoint: a consumer class always beats the prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  columns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n(y,{data:$})])}}});export{bs as __pageData,Ls as default};
