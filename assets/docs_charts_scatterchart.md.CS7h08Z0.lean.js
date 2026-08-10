import{_ as _s}from"./chunks/PropsTable.BfeoCnFJ.js";import{_ as os}from"./chunks/SlotsTable.DzRB1Qtt.js";import{_ as hs}from"./chunks/EmitsTable.DBVM0Dxa.js";import{bj as us,bd as ds,be as ms,bo as fs}from"./chunks/theme.BTsZGPZJ.js";import{r as ys,u as ws}from"./chunks/useChart.BCtHR8Az.js";import{t as D,c as vs,D as gs,B as F,A as ks,e as bs,_ as xs}from"./chunks/ChartTooltip.vue_vue_type_script_setup_true_lang.hYxFlIXc.js";import{b as S,m as ss,c as js,d as zs,i as Cs}from"./chunks/utils.omm13AYg.js";import{c as As,C as Ss,u as Os}from"./chunks/theme.DYMzuGPe.js";import{b as Ps,t as Rs,p as Ts}from"./chunks/referenceLines.CyR3CDHq.js";import{_ as Ds}from"./chunks/ChartContainer.vue_vue_type_script_setup_true_lang.D2fT_HJw.js";import{_ as Ls}from"./chunks/ChartLegend.vue_vue_type_script_setup_true_lang.B5EdsDkK.js";import{I as O,aU as Es,b9 as V,l as w,ad as A,p as Is,z as $,bf as h,an as z,a1 as G,L as W,D as o,o as s,aE as P,Y as U,aj as H,ag as Y,r as R,ao as X,A as L,B as a}from"./chunks/framework.nEVVyQQB.js";const Ns="categorical",C=10,K=35,Z=.75,Q="6%";function as(n,{theme:i}){const t=n.data??[],e=[],c=new Map,p=[];for(const _ of t){const v=D(_[n.xColumn]),y=D(_[n.yColumn]);if(v===null||y===null)continue;const j=Bs(n,_);let x=c.get(j);x||(x=[],e.push(j),c.set(j,x));const g=n.sizeColumn?D(_[n.sizeColumn]):null;g!==null&&p.push(g),x.push({x:v,y,size:g,label:Ms(n,_),row:_})}const m=Fs(p,!!n.sizeColumn),f=As(n.palette,i,{fallback:Ns,count:e.length});return e.map((_,v)=>({name:_,label:S(_),color:f[v],points:c.get(_).map(y=>({...y,symbolSize:m(y.size)}))}))}const qs="(Blank)";function Bs(n,i){if(!n.seriesColumn)return n.yColumn;const t=i[n.seriesColumn];return t==null||t===""?qs:String(t)}function Ms(n,i){if(!n.labelColumn)return;const t=i[n.labelColumn];return t==null?void 0:String(t)}function Fs(n,i){if(!i)return()=>C;const t=Vs(n);return e=>e===null?C:t(e)}function Vs(n){let i=1/0,t=-1/0;for(const c of n)c<i&&(i=c),c>t&&(t=c);if(i===t){const c=(C+K)/2;return()=>c}const e=K-C;return c=>C+(c-i)/(t-i)*e}function $s(n,i){const{theme:t,hiddenSeries:e=[],format:c}=i,p=n.dir==="rtl",f=as(n,i).filter(y=>!e.includes(y.name)),_=Ws(n),v={animation:!0,animationDuration:500,animationDurationUpdate:300,textStyle:{fontFamily:Ss},grid:vs({horizontal:!1,isRTL:p,labelGutter:0}),xAxis:J(n.xAxis,t,{horizontal:!0,isRTL:p,format:c?.x,name:n.xAxis?.title}),yAxis:J(n.yAxis,t,{horizontal:!1,isRTL:p,format:c?.y}),series:[...f.map(y=>Us(y,{theme:t,isRTL:p,showLabels:_})),...Ps(Gs(n),{theme:t,horizontal:!1,hasSecondaryValueAxis:!1,hasCategoryAxis:!1,hostSeriesType:"scatter"})]};return ss(v,n.echartOptions)}function Gs(n){const i=n.referenceLines;return i?.filter(t=>t.axis==="y2").length,i}function Ws(n){return n.showDataLabels?!!n.labelColumn:!1}function Us(n,i){const{theme:t,isRTL:e,showLabels:c}=i;return{type:"scatter",name:n.name,data:n.points.map(p=>({value:[p.x,p.y],symbolSize:p.symbolSize,...c?{name:p.label??""}:{}})),symbol:"circle",itemStyle:{color:n.color,opacity:Z,borderWidth:0},emphasis:{focus:"series",blurScope:"coordinateSystem"},blur:{itemStyle:{opacity:Z*F},label:{opacity:F}},...c?{label:{show:!0,position:e?"left":"right",color:t.dataLabel,fontSize:gs,formatter:p=>String(p?.name??"")},labelLayout:{hideOverlap:!0}}:{}}}function J(n,i,t){const{horizontal:e,isRTL:c,format:p,name:m}=t,f=ss({scale:!0,boundaryGap:[Q,Q],...m?{name:S(m),nameLocation:"end",nameGap:8,nameTextStyle:{color:i.axisTitle,fontSize:ks}}:{},...p?{axisLabel:{formatter:_=>p(Number(_))}}:{}},n?.echartOptions);return bs({...n,echartOptions:f},i,{horizontal:e,isRTL:c})}const Hs=["aria-label"],E=O({__name:"ScatterChart",props:U({title:{},subtitle:{},dir:{},loading:{type:Boolean},error:{},data:{},x:{},y:{},size:{},series:{},label:{},showDataLabels:{type:Boolean},xAxis:{},yAxis:{},palette:{},referenceLines:{},format:{type:Function},echartOptions:{}},{hiddenSeries:{default:()=>[]},hiddenSeriesModifiers:{}}),emits:U(["pointClick"],["update:hiddenSeries"]),setup(n,{expose:i,emit:t}){ys([us,ds,ms,fs]);const e=n,c=Es(n,"hiddenSeries"),p=t,m=H(),f=w(()=>e.dir??zs()),_=w(()=>e.xAxis?.format??e.format),v=w(()=>e.yAxis?.format??e.format),y=w(()=>({data:e.data,xColumn:e.x,yColumn:e.y,sizeColumn:e.size,seriesColumn:e.series,labelColumn:e.label,showDataLabels:e.showDataLabels,xAxis:j(e.xAxis),yAxis:j(e.yAxis),referenceLines:e.referenceLines,palette:e.palette,dir:f.value,echartOptions:e.echartOptions}));function j(l){if(l)return{title:l.title,min:l.min,max:l.max,echartOptions:l.echartOptions}}const{theme:x}=Os(m),g=w(()=>as(y.value,{theme:x.value})),ns=w(()=>g.value.every(l=>!l.points.length)),ls=w(()=>e.yAxis?.title?S(e.yAxis.title):void 0),I=w(()=>{try{return{option:$s(y.value,{theme:x.value,hiddenSeries:c.value,format:{x:_.value,y:v.value}}),error:null}}catch(l){return{option:void 0,error:l?.message??String(l)}}}),es=w(()=>I.value.error),b=Y({x:0,y:0}),u=Y({open:!1,x:0,y:0,label:void 0,items:[]}),{chart:ps,dispatch:N}=ws({container:m,option:()=>I.value.option,events:{mouseover:l=>ts(l),mouseout:()=>u.open=!1,click:l=>{const r=q(l);r&&p("pointClick",{seriesName:r.series.name,x:r.point.x,y:r.point.y,size:r.point.size,label:r.point.label,row:r.point.row})}},onZrEvents:{mousemove:l=>{b.x=l.event?.clientX??b.x,b.y=l.event?.clientY??b.y,u.open&&(u.x=b.x,u.y=b.y)},globalout:()=>u.open=!1}});function q(l){const r=g.value.find(k=>k.name===l?.seriesName),d=r?.points[l?.dataIndex];return r&&d?{series:r,point:d}:void 0}function ts(l){const r=q(l);if(!r){u.open=!1;return}const{series:d,point:k}=r,rs=[k.label,e.series?d.label:void 0].filter(Boolean).join(" · ");u.label=rs||void 0,u.items=[T(e.x,k.x,_.value,d.color),T(e.y,k.y,v.value,d.color),...e.size&&k.size!==null?[T(e.size,k.size,e.format,d.color)]:[]],u.x=b.x,u.y=b.y,u.open=!0}function T(l,r,d,k){return{name:l,label:S(l),color:k,value:r,formattedValue:d?d(r):Cs(r)}}const B=w(()=>g.value.map(l=>({name:l.name,label:l.label,color:l.color,hidden:c.value.includes(l.name)})));function cs(l){c.value=Rs(c.value,l,g.value.length)}const M=H(null);function is(l){M.value=l}return V(M,(l,r)=>{r&&N({type:"downplay",seriesName:r}),l&&!c.value.includes(l)&&N({type:"highlight",seriesName:l})}),V(()=>g.value.map(l=>l.name),l=>{c.value=Ts(c.value,l)}),i({chart:w(()=>ps.value)}),(l,r)=>(A(),Is(Ds,{title:n.title,subtitle:n.subtitle,"plot-label":ls.value,loading:n.loading,error:n.error||es.value,empty:ns.value,dir:f.value},$({default:h(()=>[s("div",{ref_key:"plotEl",ref:m,class:"h-full w-full",dir:"ltr",role:"img","aria-label":P(js)(n.title,n.subtitle)},null,8,Hs),o(xs,{open:u.open,x:u.x,y:u.y,label:u.label,items:u.items,dir:f.value},$({_:2},[l.$slots.tooltip?{name:"default",fn:h(d=>[z(l.$slots,"tooltip",G(W(d)))]),key:"0"}:void 0]),1032,["open","x","y","label","items","dir"])]),_:2},[l.$slots.actions?{name:"actions",fn:h(()=>[z(l.$slots,"actions")]),key:"0"}:void 0,l.$slots.loading?{name:"loading",fn:h(()=>[z(l.$slots,"loading")]),key:"1"}:void 0,l.$slots.error?{name:"error",fn:h(d=>[z(l.$slots,"error",G(W(d)))]),key:"2"}:void 0,l.$slots.empty?{name:"empty",fn:h(()=>[z(l.$slots,"empty")]),key:"3"}:void 0,B.value.length>1?{name:"legend",fn:h(()=>[o(Ls,{items:B.value,onChange:cs,onHighlight:is},null,8,["items"])]),key:"4"}:void 0]),1032,["title","subtitle","plot-label","loading","error","empty","dir"]))}}),Ys={class:"h-80 w-full"},Xs=O({__name:"ScatterQuadrants",setup(n){const i=[{product:"Payroll",growth:34,margin:62},{product:"Invoicing",growth:12,margin:71},{product:"CRM",growth:41,margin:48},{product:"Helpdesk",growth:27,margin:55},{product:"Inventory",growth:8,margin:44},{product:"Insights",growth:52,margin:39},{product:"Field service",growth:6,margin:58},{product:"Point of sale",growth:19,margin:33}],t=e=>`${e}%`;return(e,c)=>(A(),R("div",Ys,[o(P(E),{data:i,x:"growth",y:"margin",label:"product","show-data-labels":"","x-axis":{title:"Growth",format:t},"y-axis":{title:"Margin",format:t},"reference-lines":[{value:25,axis:"x",label:"Median growth",dashed:!0},{value:50,axis:"y",label:"Median margin",dashed:!0}],title:"Growth against margin",subtitle:"Median lines divide the plot into four"},null,8,["x-axis","y-axis"])]))}}),Ks={class:"h-96 w-full"},Zs=O({__name:"ScatterMarkets",setup(n){const i=[{market:"Germany",arpu:61,retention:88,seats:14200,region:"EMEA"},{market:"France",arpu:54,retention:82,seats:9100,region:"EMEA"},{market:"UAE",arpu:72,retention:79,seats:2600,region:"EMEA"},{market:"Nigeria",arpu:21,retention:74,seats:4800,region:"EMEA"},{market:"India",arpu:18,retention:91,seats:38400,region:"APAC"},{market:"Japan",arpu:68,retention:94,seats:7300,region:"APAC"},{market:"Australia",arpu:59,retention:85,seats:5200,region:"APAC"},{market:"Singapore",arpu:77,retention:81,seats:1900,region:"APAC"},{market:"United States",arpu:74,retention:87,seats:41500,region:"Americas"},{market:"Canada",arpu:63,retention:89,seats:8600,region:"Americas"},{market:"Brazil",arpu:26,retention:71,seats:12800,region:"Americas"},{market:"Mexico",arpu:31,retention:76,seats:6400,region:"Americas"}];return(t,e)=>(A(),R("div",Ks,[o(P(E),{data:i,x:"arpu",y:"retention",size:"seats",series:"region",label:"market","x-axis":{title:"ARPU",format:c=>`$${c}`},"y-axis":{title:"Retention",format:c=>`${c}%`},title:"Revenue per seat against retention",subtitle:"Bubble size is the number of seats"},null,8,["x-axis","y-axis"])]))}}),Qs={class:"h-80 w-full"},Js=O({__name:"ScatterSpend",setup(n){const i=[{account:"Acme",spend:4200,revenue:12400},{account:"Globex",spend:9100,revenue:24200},{account:"Initech",spend:2200,revenue:3100},{account:"Umbrella",spend:7400,revenue:9600},{account:"Soylent",spend:5600,revenue:18800},{account:"Hooli",spend:12800,revenue:21400},{account:"Vehement",spend:1800,revenue:6200},{account:"Massive Dynamic",spend:10400,revenue:34600},{account:"Stark",spend:6800,revenue:7400},{account:"Wayne",spend:3100,revenue:11200}],t=e=>`$${new Intl.NumberFormat("en-US").format(e)}`;return(e,c)=>(A(),R("div",Qs,[o(P(E),{data:i,x:"spend",y:"revenue",label:"account","x-axis":{title:"Acquisition spend"},"y-axis":{title:"Revenue"},format:t,title:"Spend against revenue",subtitle:"Ten largest accounts, last quarter"})]))}}),da=JSON.parse('{"title":"ScatterChart","description":"","frontmatter":{},"headers":[],"relativePath":"docs/charts/scatterchart.md","filePath":"docs/charts/scatterchart.md","lastUpdated":0}'),sa={name:"docs/charts/scatterchart.md"},ma=Object.assign(sa,{setup(n){const i=[{name:"title",description:"",required:!1,type:"string"},{name:"subtitle",description:"",required:!1,type:"string"},{name:"dir",description:"Forces layout direction; defaults to document.documentElement.dir",required:!1,type:"ChartDir"},{name:"loading",description:"",required:!1,type:"boolean"},{name:"error",description:"",required:!1,type:"string | null"},{name:"data",description:"One row per point.",required:!0,type:"Record<string, any>[]"},{name:"x",description:"Row key holding the horizontal measure.",required:!0,type:"string"},{name:"y",description:"Row key holding the vertical measure.",required:!0,type:"string"},{name:"size",description:"Row key holding the magnitude each point is sized by.",required:!1,type:"string"},{name:"series",description:"Grouping column: one series per distinct value.",required:!1,type:"string"},{name:"label",description:"Row key holding the point's own name, which heads its tooltip.",required:!1,type:"string"},{name:"showDataLabels",description:`Prints the point's own name beside it, the way an axis series prints its
value. \`label\` is what it prints, so a chart that names no label column has
nothing to show and says so in a dev-mode warning. Names that would collide
with a neighbour are dropped, so a dense cloud carries few.`,required:!1,type:"boolean"},{name:"xAxis",description:"The horizontal scale. Both axes are value axes: a scatter has no categories.",required:!1,type:"ChartValueAxisOptions"},{name:"yAxis",description:"The vertical scale.",required:!1,type:"ChartValueAxisOptions"},{name:"palette",description:"Defaults to `'categorical'`: the groups are unrelated categories.",required:!1,type:"ChartPalette"},{name:"referenceLines",description:`Targets, thresholds and quadrant dividers drawn over the plot. They are
annotations, not series: no legend entry, and no way to switch one off.
Both axes are measured here, so \`axis: 'x'\` takes a number too — a pair of
lines, one per axis, is what divides a scatter into quadrants.`,required:!1,type:"ReferenceLine[]"},{name:"format",description:"Prints every number the chart shows. `xAxis.format` and `yAxis.format`\noverride it for their own axis; the size measure has no axis, so this is\nwhat prints it.",required:!1,type:"ChartValueFormatter"},{name:"echartOptions",description:"",required:!1,type:"EchartOptionsOverride"},{name:"hiddenSeries",description:"",required:!1,type:"string[]",default:"[]"}],t=[{name:"actions",description:"",type:"any"},{name:"tooltip",description:"",type:"{ label?: string | undefined; items: ChartTooltipItem[]; }"},{name:"loading",description:"Replaces the whole placeholder, e.g. with a skeleton of the app's own.",type:"any"},{name:"error",description:"Replaces the message, e.g. to put a retry button beside it.",type:"{ error?: string | null | undefined; }"},{name:"empty",description:'Replaces the "no data" line, e.g. with a hint about the filters.',type:"any"}],e=[{name:"update:hiddenSeries",description:"Fired when the hidden series changes.",type:"[value: string[]]"},{name:"pointClick",description:"",type:"[event: ScatterPointEvent]"}];return(c,p)=>{const m=X("ComponentPreview"),f=X("ClientOnly");return A(),R("div",null,[p[4]||(p[4]=L("",5)),o(f,null,{default:h(()=>[o(m,{name:"Charts-ScatterSpend","self-layout":""},{code:h(()=>[...p[0]||(p[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ScatterChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** What each account cost to win last quarter, and what it brought back. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," accounts"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Acme"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 4200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12400"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Globex"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 9100"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 24200"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Initech"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 2200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 3100"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Umbrella"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 7400"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 9600"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Soylent"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 5600"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 18800"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Hooli"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12800"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 21400"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Vehement"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1800"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 6200"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Massive Dynamic"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 10400"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 34600"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Stark"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 6800"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 7400"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," account"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Wayne"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," spend"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 3100"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 11200"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_indoxt"}," currency"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  `"),s("span",{class:"s_2575z4"},"$"),s("span",{class:"s_20l85h"},"${"),s("span",{class:"s_2ekfrt"},"new"),s("span",{class:"s_22m8k2"}," Intl"),s("span",{class:"s_w1p9wo"},"."),s("span",{class:"s_indoxt"},"NumberFormat"),s("span",{class:"s_1299x4"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"en-US"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1299x4"},")"),s("span",{class:"s_w1p9wo"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_1299x4"},"("),s("span",{class:"s_22m8k2"},"value"),s("span",{class:"s_1299x4"},")"),s("span",{class:"s_20l85h"},"}"),s("span",{class:"s_w1p9wo"},"`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-80 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"ScatterChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"accounts"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"spend"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"revenue"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"account"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Acquisition spend' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Revenue' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"currency"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Spend against revenue"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Ten largest accounts, last quarter"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:h(()=>[o(Js)]),_:1})]),_:1}),p[5]||(p[5]=s("h2",{id:"a-third-measure-as-size",tabindex:"-1"},[a("A third measure as size "),s("a",{class:"header-anchor",href:"#a-third-measure-as-size","aria-label":"Permalink to “A third measure as size”"},"​")],-1)),p[6]||(p[6]=s("p",null,[s("code",null,"size"),a(" names a column of magnitudes, and each point is drawn at a diameter that maps that magnitude linearly into a readable range. The scale runs over the whole plot rather than within a group, so a bubble means the same thing wherever it sits. Data with one distinct magnitude draws every bubble at the middle of the range: it has no relative size to show, and drawing them all at the floor would claim they were the smallest there is.")],-1)),p[7]||(p[7]=s("p",null,[s("code",null,"series"),a(" splits the rows into one group per distinct value, colored from the palette and named in the legend. Press a legend entry to take a group out of the plot, or bind "),s("code",null,"v-model:hiddenSeries"),a(" to own that list yourself.")],-1)),o(f,null,{default:h(()=>[o(m,{name:"Charts-ScatterMarkets","self-layout":""},{code:h(()=>[...p[1]||(p[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ScatterChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One row per market: what a seat costs, how long it stays, how many there are. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," markets"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Germany"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 61"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 88"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 14200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"EMEA"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"France"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 54"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 82"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 9100"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"EMEA"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"UAE"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 72"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 79"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 2600"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"EMEA"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Nigeria"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 21"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 74"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 4800"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"EMEA"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"India"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 18"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 91"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 38400"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"APAC"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Japan"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 68"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 94"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 7300"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"APAC"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Australia"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 59"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 85"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 5200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"APAC"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Singapore"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 77"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 81"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1900"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"APAC"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"United States"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 74"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 87"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 41500"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Americas"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Canada"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 63"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 89"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 8600"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Americas"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Brazil"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 26"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 71"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12800"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Americas"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    market"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Mexico"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    arpu"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 31"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    retention"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 76"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    seats"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 6400"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    region"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Americas"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-96 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"ScatterChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"markets"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"arpu"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"retention"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      size"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"seats"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      series"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"region"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"market"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'ARPU', format: (value: number) => `$${value}` }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Retention', format: (value: number) => `${value}%` }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Revenue per seat against retention"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Bubble size is the number of seats"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:h(()=>[o(Zs)]),_:1})]),_:1}),p[8]||(p[8]=L("",4)),o(f,null,{default:h(()=>[o(m,{name:"Charts-ScatterQuadrants","self-layout":""},{code:h(()=>[...p[2]||(p[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ScatterChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One row per product line: how fast it grows, and what it keeps. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," products"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Payroll"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 34"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 62"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Invoicing"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 71"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"CRM"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 41"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 48"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Helpdesk"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 27"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 55"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Inventory"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 8"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 44"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Insights"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 52"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 39"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Field service"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 6"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 58"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," product"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Point of sale"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," growth"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 19"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," margin"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 33"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_indoxt"}," percent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_w1p9wo"}," `"),s("span",{class:"s_20l85h"},"${"),s("span",{class:"s_22m8k2"},"value"),s("span",{class:"s_20l85h"},"}"),s("span",{class:"s_2575z4"},"%"),s("span",{class:"s_w1p9wo"},"`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-80 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"ScatterChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"products"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"growth"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"margin"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"product"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      show-data-labels")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Growth', format: percent }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Margin', format: percent }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :reference-lines"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        { value: 25, axis: 'x', label: 'Median growth', dashed: true },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        { value: 50, axis: 'y', label: 'Median margin', dashed: true },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      ]"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Growth against margin"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Median lines divide the plot into four"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:h(()=>[o(Xs)]),_:1})]),_:1}),p[9]||(p[9]=L("",7)),o(_s,{name:"ScatterChart",data:i},{code:h(()=>[...p[3]||(p[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ComputedRef"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ECharts"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"echarts/core"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"TimeGrain"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"./format"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartDir"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"ltr"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"rtl"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** What an echarts-backed chart hands back through a template ref. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartExposed"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The echarts instance, once the plot has a size to initialise into. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  chart"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ECharts"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Deep-merged into the generated echarts option as a last-resort escape hatch. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," EchartOptionsOverride"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartPaletteName"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"sequential"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"categorical"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"diverging"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Which ramp series colors come from, or an explicit list of colors to cycle.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * The named ramps read `--chart-*` from CSS, so they follow the app's theme.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartPalette"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartPaletteName"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartXAxisConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  key"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Inferred: `'time'` when every value in `key` is a `Date` or ISO date")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * string, `'category'` otherwise. Set it to override — e.g. `'category'` to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * line dates up as evenly spaced buckets rather than on a real timeline.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `'value'` reads the column as a quantity: a point sits at its own number,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * so a row at 1 and a row at 100 stand a hundred apart rather than in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * neighbouring slots. It is only ever asked for, never inferred — a category")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * column often holds numbers, and re-spacing those would redraw a chart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * nobody changed. It is ignored on a horizontal bar chart.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  type"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"category"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"time"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"value"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Label granularity on a time axis. Inferred from the spacing of the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  timeGrain"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," TimeGrain")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartYAxisConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * What a series draws as. Every cartesian chart can hold every mark, so a bar")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chart with one line series and an area chart are the same option with a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * different default.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartMark"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bar"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"line"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"area"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartSeriesConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Key in each data row that holds this series' value, and its identity. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Display name. Falls back to the formatted `name`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Mark this series draws as. Defaults to the chart's own mark. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  type"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartMark")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Which value axis this series is measured against. `'y2'` gives a series in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * a different unit or magnitude its own scale, opposite the primary. Ignored")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * on a horizontal bar chart, which has no second value axis.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  axis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"y"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"y2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Groups series into separate stacks. Only read when `stacked` is on, and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * only by the marks that stack — a line never does.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  stackName"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Dash pattern of the line itself. Defaults to a solid stroke. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lineType"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"solid"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dashed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dotted"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Stroke width in px. Defaults to 2. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lineWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Marks every datapoint with a dot. Off by default — a clean line reads")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * better, and the dot for the hovered point appears anyway.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataPoints"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rounds the corners of the line instead of drawing straight segments. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  smooth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the chart-level `fillOpacity`. Read by an area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fillOpacity"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A rule drawn across the plot at a fixed position: a target, a threshold, a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * budget, or the date something changed. An annotation rather than a series —")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * it has no legend entry, cannot be switched off, and is never in the tooltip.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ReferenceLine"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Where the line sits: a number on a value axis, or whatever the category")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * column holds on the category axis. A value outside the range the plot")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * covers is not drawn; the scale follows the data, not the annotation.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Which axis `value` is read against. `'y'` (the default) and `'y2'` draw a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rule across the plot at a measured value; `'x'` draws one down it at a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * category. `'y2'` reads against the primary axis on a chart that draws only")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * one, exactly as a series does.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * On a scatter both axes are value axes, so `'x'` is a number on the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * horizontal scale rather than a category, and `'y2'` names an axis a scatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * does not have — it reads as `'y'`, with a dev-mode warning. An axis chart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * with `xAxis.type: 'value'` reads `'x'` the same way: a number on the scale.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  axis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"y"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"y2"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"x"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Printed at the far end of the line. Left out, the rule carries no text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to the ink data labels are printed in, so it reads as an annotation. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Breaks the rule up, for a line that should not read as a hard boundary. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dashed"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Everything a cartesian chart config carries whatever it draws. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartBaseConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xAxis"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartXAxisConfig")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartYAxisConfig")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The second value axis, drawn opposite the primary. Only read when a series")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * sets `axis: 'y2'`, and never on a horizontal bar chart — two value axes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * along the top and bottom of the plot are unreadable.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y2Axis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartYAxisConfig")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  series"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," AxisChartSeriesConfig"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rules drawn over the plot at fixed positions. Not series: see `ReferenceLine`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  referenceLines"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ReferenceLine"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ramp series colors are drawn from. Defaults to `'sequential'`: one series")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * gets a single mid-blue, more get evenly spaced stops running dark to light.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * What every cartesian chart hands its option builder. Bar, line and area")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * differ in one value — the mark their unmarked series draw as — so a combo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chart is not a fourth shape, it is this one with a mixed series list.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartBaseConfig"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Mark for series that name none: the chart component the caller picked. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  type"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartMark")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Series sum on top of each other rather than standing side by side. Read by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the marks that stack, i.e. bars and areas; a line never stacks.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `'normalized'` plots each value as its share of its stack — the 100%")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * stacked reading — and pins the value axis that carries it to 0-100.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  stacked"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"normalized"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bars run left-to-right; the category axis moves to Y. Bars only. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  horizontal"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Bridges gaps left by null or non-numeric values. Off by default: a break in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the line is how missing data should read. Line and area series only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  connectNulls"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Alpha of the fill under an area series. Defaults to a faint wash that fades")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * out towards the axis; areas that stack into a band default to solid.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fillOpacity"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DonutChartConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the slice name. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  categoryColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the slice size. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  valueColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Slices past this many are summed into a single "Others" slice. A ring stops')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * being readable long before the palette runs out, so it defaults to 9.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  maxSlices"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ramp slice colors are drawn from. Defaults to `'categorical'`: slices are")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * unrelated categories, not steps of one magnitude, so they read as separate")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * hues rather than as a ramp.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each slice's name and share next to the ring. Off by default: the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * legend carries the same information without the leader lines.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showInlineLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Caption under the total in the middle. Defaults to the value column name. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  centerLabel"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `'half'` draws the ring as a semicircle; only the geometry changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  variant"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DonutVariant")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DonutVariant"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"full"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"half"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'/** One arc of the ring, after sorting, "Others" grouping and color assignment. */')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DonutSlice"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Identity used by echarts actions and the legend. Unique within the ring. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The category value as it should read; not unique. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Share of the *visible* total, so hiding a slice re-percentages the rest. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  percent"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  hidden"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'  /** The row behind this slice, or every grouped row for the "Others" slice. */')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rows"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isOthers"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DonutSliceEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'  /** The slice as it reads, i.e. the category value or "Others". */')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  percent"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'  /** One row, or every grouped row when the "Others" slice was clicked. */')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rows"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelChartConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per stage, in process order. Rows are drawn as they arrive. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the stage name. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  categoryColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding how many reached the stage. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  valueColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ramp the columns are colored from. Defaults to `'sequential'` reversed —")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * palest at the top of the funnel, deepest at the end — so the color darkens")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * as the population narrows.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each stage's share of the first stage under its value. On by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default: the conversion rate is what a funnel is read for.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showPercentages"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One stage of the funnel, after coercion and percentage arithmetic. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelStage"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  index"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Share of the first stage, i.e. the conversion rate to here. 0-100. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  percentOfFirst"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Share of the preceding stage. 0-100; the first stage's is 100. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  percentOfPrevious"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelStageEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  index"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Which continuous ramp cells are colored from, or an explicit list of stops to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * interpolate between. Only the continuous ramps: a heatmap reads one measure")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * across a scale, so the categorical palette has nothing to say here.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapPalette"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"sequential"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"diverging"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapChartConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per cell. Rows with no numeric value leave their cell undrawn. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the column a cell sits in. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the row a cell sits in. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the magnitude the cell is colored by. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  valueColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ramp cells are colored from. Defaults to `'sequential'`, which is what a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * magnitude reads as; `'diverging'` is for signed data, and centers the scale")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * on zero unless `min`/`max` say otherwise.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," HeatmapPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bottom of the color scale. Defaults to the smallest value in the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Top of the color scale. Defaults to the largest value in the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each cell's value inside it. Labels that would collide with a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * neighbour are dropped, so a grid too fine to carry numbers shows none.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showValues"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One drawn cell of the grid, after category indexing and color assignment. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapCell"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The x category as it reads. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The y category as it reads. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xIndex"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yIndex"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** The grid as the plot, the tooltip and the ramp scale all read it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapMatrix"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Columns, in the order the rows first mention them. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xCategories"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rows, in the order the rows first mention them. Drawn top to bottom. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yCategories"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  cells"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," HeatmapCell"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bottom of the color scale, config or data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Top of the color scale, config or data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The ramp the scale runs along, low end first. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  stops"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapCellEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," NumberCardConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Null renders the empty state; a KPI with no number is not a zero. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Change against the comparison period. Sign drives the arrow. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  delta"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Unit printed after the delta, e.g. `'%'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  deltaSuffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** What the delta is measured against, e.g. `'vs last month'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  deltaCaption"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Flips the delta colors, for metrics like churn or cost. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  negativeIsBetter"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Decimal places. Defaults to as many as the value carries, up to 2. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  precision"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shortens the value, `12300` -> `12.3K`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  compact"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** A trend across the bottom of the card: shape only, no axes to read against. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sparkline"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," NumberCardSparkline")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," NumberCardSparkline"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Oldest reading first. Gaps are skipped, not drawn as zero. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_i592pt"},"number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined"),s("span",{class:"s_13ahmt"},")[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `line` for a continuous reading, `bar` for one the reader counts in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * periods. Defaults to `line`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  type"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," NumberCardSparklineType")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the sequential-palette blue the sparkline is drawn in. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," NumberCardSparklineType"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"line"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bar"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Which way the flow runs: columns of nodes left to right, or rows top to bottom. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyOrient"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"horizontal"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vertical"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Where a node sits along the flow. `'justify'` pushes a node with no outgoing")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * flow to the far end, `'left'` and `'right'` pin every node to the end it is")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * named after.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyNodeAlign"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"justify"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyChartConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per flow. Rows with no numeric value draw no band. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the node a flow leaves. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sourceColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the node a flow arrives at. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  targetColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding how much flows along the link. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  valueColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  orient"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SankeyOrient")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  nodeAlign"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SankeyNodeAlign")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ramp node colors are drawn from. Defaults to `'categorical'`: the nodes of")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * a flow are unrelated categories, not steps of one magnitude.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One node of the flow, after de-duplication and color assignment. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyNode"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The source or target value as it reads. Unique within the graph. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * What passes through the node: the larger of what arrives and what leaves,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * which is the side that decides how tall echarts draws it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One drawn link, i.e. one row of the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyLink"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  source"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  target"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The source node's color, which is what the band is painted in. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** The flow as the plot, the labels and the tooltip all read it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyGraph"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Nodes in the order the rows first mention them, source before target. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  nodes"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SankeyNode"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  links"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SankeyLink"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyLinkEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  source"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  target"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterChartConfig"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per point. A row missing either coordinate draws nothing. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the horizontal measure. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the vertical measure. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yColumn"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the magnitude each point is sized by. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sizeColumn"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Grouping column: one series per distinct value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  seriesColumn"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the point's own name, which heads its tooltip. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  labelColumn"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints the point's own name beside it. Needs `labelColumn` to have one. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Both axes are value axes: a scatter reads one measure against another. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartYAxisConfig")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartYAxisConfig")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Rules drawn over the plot at fixed positions, quadrant dividers among them.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Not series: see `ReferenceLine`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  referenceLines"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ReferenceLine"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ramp series colors are drawn from. Defaults to `'categorical'`: the groups")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * of a scatter are unrelated categories, not steps of one magnitude.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One drawn point, after coercion and size scaling. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterPoint"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The magnitude behind the symbol. Null when the chart has no size column. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  size"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Symbol diameter in px: the magnitude mapped into the readable range. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  symbolSize"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The point's own name, when the config names a label column. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One group of points, i.e. one value of the grouping column. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterSeries"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The grouping value as it reads, or the y column when nothing groups. Unique. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  points"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ScatterPoint"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterPointEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  seriesName"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Null when the chart has no size column. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  size"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Which edge of the plot the value-axis title heads, i.e. the edge that axis is")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * drawn on: the top for a column chart, the bottom for a row chart.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," PlotLabelPlacement"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartLegendItem"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Series name, i.e. the identity used by echarts actions. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  hidden"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Muted note after the label, e.g. a donut slice's share of the total. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  hint"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  formattedValue"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Share of the total, printed after the value. Only part-to-whole charts set it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  percent"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartDatapointEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  seriesName"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dataIndex"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  row"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ---------------------------------------------------------------------------")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Component props: the public surface every chart takes.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"//")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// These sit in `types.ts` rather than a `props.ts` of their own because")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// studio reads `<Component>Props` out of the family folder's `types.ts` to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// build its block schemas, and matches the declaration by name — a re-export")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// from another file does not satisfy it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ---------------------------------------------------------------------------")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Formats a measured value wherever it is printed: axis labels, tooltip, readouts. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartValueFormatter"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** A category axis carries whatever the column holds, so its formatter takes any. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartCategoryFormatter"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  loading"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  error"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartXAxisOptions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Inferred: `'time'` when every value in the `x` column is a `Date` or ISO")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * date string, `'category'` otherwise.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `'value'` reads the column as a quantity and places every point by its own")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * number, the way a scatter reads its x. Ask for it — it is never inferred,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * because a category column that happens to hold numbers still reads as a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * list of categories. Ignored when `horizontal` is set.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  type"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"category"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"time"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"value"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Label granularity on a time axis. Inferred from the spacing of the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  timeGrain"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," TimeGrain")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartCategoryFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartValueAxisOptions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Per-series look. Every key is optional: an unstyled series renders with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * defaults. One style covers every mark, so a series keeps its label and color")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * when `type` changes, and the keys the mark it draws as does not read are")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * ignored rather than dropped.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SeriesStyle"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Display name. The `seriesConfig` key stays the identity. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Mark this series draws as. Defaults to the mark of the chart component it")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * sits in, so `BarChart` with one `'line'` series is a combo chart.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  type"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartMark")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Which value axis this series is measured against. `'y2'` gives a series in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * another unit or magnitude its own scale, drawn opposite the primary.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Defaults to `'y'`. Ignored on a horizontal bar chart, which has no second")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * value axis, and on a chart where no series asks for `'y2'` the second axis")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * is not drawn at all.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Moving a series here never moves it in the chart: the series are drawn in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `y` order whatever axis each one sits on, so a series keeps its color.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  axis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"y"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"y2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Groups series into separate stacks. Only read when `stacked` is on, and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * only by the marks that stack: bars stack with bars, areas with areas.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  stackName"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Line and area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lineType"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"solid"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dashed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dotted"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Line and area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  lineWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Line and area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataPoints"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Line and area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  smooth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the chart-level `fillOpacity`. Area series only. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fillOpacity"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Column holding the category or time each point sits at. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Value column(s). A list reads wide data: one series per column, drawn and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * colored in the order given. `seriesConfig[key].axis` moves one of them to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the second value axis without moving it in the list.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Grouping column, i.e. long data. Use with a single `y`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  series"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Caps how many series the `series` column produces. The rest are summed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * into a single "Others" series, keyed `OTHERS_KEY` so `seriesConfig` can')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * style it. Uncapped by default, and ignored when `y` names the columns:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * those the caller chose one by one.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  maxSeries"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Keyed by series identity: a `y` column, or a value of the `series` column. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  seriesConfig"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," SeriesStyle"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartXAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The second value axis. Only drawn when a series sits on `axis: 'y2'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y2Axis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Ramp series colors are drawn from. Defaults to `'sequential'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Series sum on top of each other. Bar and area series; a line never stacks.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `'normalized'` reads each value as its share of the stack it sits in")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * instead of its own magnitude, and pins that value axis to 0-100.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  stacked"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"normalized"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bridges gaps left by nulls. Line and area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  connectNulls"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Chart-level fill alpha; `seriesConfig` overrides it per series. Area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fillOpacity"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Targets, thresholds and other fixed marks drawn over the plot. They are")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * annotations, not series: no legend entry, and no way to switch one off.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  referenceLines"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ReferenceLine"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," BarChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bars run left-to-right; the category axis moves to Y. Bars only. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  horizontal"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** A line chart is an axis chart whose unmarked series draw as lines. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," LineChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartProps")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** An area chart is a line chart whose unmarked series carry a fill. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AreaChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartProps")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DonutChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the slice name. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  category"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the slice size. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Slices past this many are summed into a single "Others" slice, named')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `OTHERS_KEY`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  maxSlices"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showInlineLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Caption under the total in the middle. Defaults to the `value` key. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  centerLabel"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  variant"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DonutVariant")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to `'categorical'`: slices are unrelated categories, not steps. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per stage, in process order. Rows are drawn as they arrive. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  category"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints each stage's share of the first stage. On by default. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showPercentages"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to `'sequential'` reversed, so color darkens as the funnel narrows. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per cell. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the column a cell sits in. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the row a cell sits in. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the magnitude the cell is colored by. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showValues"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," HeatmapPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per flow, i.e. one band from a source node to a target node. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the node a flow leaves. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  source"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the node a flow arrives at. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  target"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding how much flows along the link. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to `'horizontal'`: the flow runs left to right. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  orient"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SankeyOrient")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Where a node sits along the flow. Defaults to `'justify'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  nodeAlign"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SankeyNodeAlign")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to `'categorical'`: nodes are unrelated categories. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per point. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the horizontal measure. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the vertical measure. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the magnitude each point is sized by. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  size"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Grouping column: one series per distinct value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  series"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the point's own name, which heads its tooltip. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints the point's own name beside it, the way an axis series prints its")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * value. `label` is what it prints, so a chart that names no label column has")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * nothing to show and says so in a dev-mode warning. Names that would collide")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * with a neighbour are dropped, so a dense cloud carries few.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The horizontal scale. Both axes are value axes: a scatter has no categories. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The vertical scale. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to `'categorical'`: the groups are unrelated categories. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Targets, thresholds and quadrant dividers drawn over the plot. They are")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * annotations, not series: no legend entry, and no way to switch one off.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Both axes are measured here, so `axis: 'x'` takes a number too — a pair of")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * lines, one per axis, is what divides a scatter into quadrants.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  referenceLines"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ReferenceLine"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints every number the chart shows. `xAxis.format` and `yAxis.format`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * override it for their own axis; the size measure has no axis, so this is")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * what prints it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** No `subtitle`: the card is one reading, and the caption row says what it compares against. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," NumberCardProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," Omit"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ChartBaseProps"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"subtitle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  Pick"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ChartCardProps"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"card"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** A string renders as given: the formatting props only apply to a number. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Ink the reading is printed in, e.g. the color of the series it summarizes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * on a dashboard. One color for one mark, the way `SeriesStyle.color` names")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * a series' own — it does not restyle the card, and the delta keeps the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * tone that says which way the number moved.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    color"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Change against the comparison period. Sign drives the arrow. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    delta"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaSuffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaCaption"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Flips the delta colors, for metrics like churn or cost. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    negativeIsBetter"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Decimal places. Defaults to as many as the value carries, up to 2. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    precision"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Shortens the value, `12300` -> `12.3K`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    compact"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    sparkline"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," NumberCardSparkline")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// The chrome, i.e. everything around the plot. A chart an app draws itself")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// composes these and reads as one of the family.")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartCardProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Draws the card surface: border, background, corner radius and padding. On")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * by default. Set it to `false` for a chart the app has already placed inside")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * a card of its own, so a bordered box does not nest in a bordered box.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  card"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartContainerProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Value-axis title, drawn above the plot instead of inside it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  plotLabel"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Title of the second value axis, drawn over the edge that axis sits on. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  plotLabelSecondary"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Edge of the plot the value-axis titles head. Defaults to the top. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  plotLabelPlacement"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PlotLabelPlacement")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  loading"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Non-empty switches the container into its error state. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  error"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  empty"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartLegendProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One entry per series, in the order they are drawn. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartLegendItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartTooltipProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Viewport coordinates of the pointer. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),o(os,{data:t}),o(hs,{data:e})])}}});export{da as __pageData,ma as default};
