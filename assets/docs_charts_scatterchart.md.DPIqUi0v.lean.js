import{_ as vs}from"./chunks/PropsTable.DYx5ISsp.js";import{_ as gs}from"./chunks/SlotsTable.D5sWz11K.js";import{_ as ks}from"./chunks/EmitsTable.dSqMsgj4.js";import{bm as bs,bg as xs,bh as js,br as zs}from"./chunks/theme.pB057sn-.js";import{r as Cs,u as Ss}from"./chunks/useChart.d6FEDsXu.js";import{u as As}from"./chunks/usePlotKeyboard.DqcVDNeA.js";import{t as B,c as Os,D as Ps,B as K,A as Rs,e as Ts}from"./chunks/axisChartCommon.C2JnP7vp.js";import{a as T,d as Es}from"./chunks/format.BfcWt-Im.js";import{c as Ds,C as Ls,u as Is}from"./chunks/tokens.Byn92Nzx.js";import{b as Ns,t as Bs,p as qs}from"./chunks/referenceLines.D4kAR0Ef.js";import{b as cs,c as Fs,d as Ms,p as Vs}from"./chunks/utils.BIjrxRCb.js";import{_ as $s}from"./chunks/ChartContainer.vue_vue_type_script_setup_true_lang.CwTvMZdC.js";import{_ as Hs}from"./chunks/ChartLegend.vue_vue_type_script_setup_true_lang.V_6clCv-.js";import{_ as Gs}from"./chunks/ChartTooltip.vue_vue_type_script_setup_true_lang.CnJrGqfk.js";import{I as E,aV as Ws,bb as X,l as v,ad as O,p as Us,z as Z,bh as m,an as C,a1 as Q,L as J,D as d,o as s,Z as Ys,aE as A,au as Ks,Y as ss,aj as q,ag as as,r as D,ao as ns,A as F,B as a}from"./chunks/framework.BT7BGxmb.js";const Xs="categorical",S=10,ls=35,es=.75,ps="6%";function is(l,{tokens:r}){const c=l.data??[],p=[],i=new Map,t=[];for(const u of c){const x=B(u[l.xColumn]),w=B(u[l.yColumn]);if(x===null||w===null)continue;const z=Qs(l,u);let j=i.get(z);j||(j=[],p.push(z),i.set(z,j));const g=l.sizeColumn?B(u[l.sizeColumn]):null;g!==null&&t.push(g),j.push({x,y:w,size:g,label:Js(l,u),row:u})}const f=sa(t,!!l.sizeColumn),y=Ds(l.palette,r,{fallback:Xs,count:p.length});return p.map((u,x)=>({name:u,label:T(u),color:y[x],points:i.get(u).map(w=>({...w,symbolSize:f(w.size)}))}))}const Zs="(Blank)";function Qs(l,r){if(!l.seriesColumn)return l.yColumn;const c=r[l.seriesColumn];return c==null||c===""?Zs:String(c)}function Js(l,r){if(!l.labelColumn)return;const c=r[l.labelColumn];return c==null?void 0:String(c)}function sa(l,r){if(!r)return()=>S;const c=aa(l);return p=>p===null?S:c(p)}function aa(l){let r=1/0,c=-1/0;for(const i of l)i<r&&(r=i),i>c&&(c=i);if(r===c){const i=(S+ls)/2;return()=>i}const p=ls-S;return i=>S+(i-r)/(c-r)*p}function na(l,r){const{tokens:c,hiddenSeries:p=[],format:i}=r,t=l.dir==="rtl",y=is(l,r).filter(w=>!p.includes(w.name)),u=ea(l),x={animation:!0,animationDuration:500,animationDurationUpdate:300,textStyle:{fontFamily:Ls},grid:Os({horizontal:!1,isRTL:t,labelGutter:0}),xAxis:ts(l.xAxis,c,{horizontal:!0,isRTL:t,format:i?.x,name:l.xAxis?.title}),yAxis:ts(l.yAxis,c,{horizontal:!1,isRTL:t,format:i?.y}),series:[...y.map(w=>pa(w,{tokens:c,isRTL:t,showLabels:u})),...Ns(la(l),{tokens:c,horizontal:!1,hasSecondaryValueAxis:!1,hasCategoryAxis:!1,hostSeriesType:"scatter"})]};return cs(x,l.echartOptions)}function la(l){const r=l.referenceLines;return r?.filter(c=>c.axis==="y2").length,r}function ea(l){return l.showDataLabels?!!l.labelColumn:!1}function pa(l,r){const{tokens:c,isRTL:p,showLabels:i}=r;return{type:"scatter",name:l.name,data:l.points.map(t=>({value:[t.x,t.y],symbolSize:t.symbolSize,...i?{name:t.label??""}:{}})),symbol:"circle",itemStyle:{color:l.color,opacity:es,borderWidth:0},emphasis:{focus:"series",blurScope:"coordinateSystem"},blur:{itemStyle:{opacity:es*K},label:{opacity:K}},...i?{label:{show:!0,position:p?"left":"right",color:c.dataLabel,fontSize:Ps,formatter:t=>String(t?.name??"")},labelLayout:{hideOverlap:!0}}:{}}}function ts(l,r,c){const{horizontal:p,isRTL:i,format:t,name:f}=c,y=cs({scale:!0,boundaryGap:[ps,ps],...f?{name:T(f),nameLocation:"end",nameGap:8,nameTextStyle:{color:r.axisTitle,fontSize:Rs}}:{},...t?{axisLabel:{formatter:u=>t(Number(u))}}:{}},l?.echartOptions);return Ts({...l,echartOptions:y},r,{horizontal:p,isRTL:i})}const ta=["aria-label"],ca={class:"sr-only",role:"status"},M=E({__name:"ScatterChart",props:ss({title:{},subtitle:{},dir:{},loading:{type:Boolean},error:{},data:{},x:{},y:{},size:{},series:{},hiddenSeries:{},label:{},showDataLabels:{type:Boolean},xAxis:{},yAxis:{},palette:{},referenceLines:{},format:{type:Function},echartOptions:{}},{hiddenSeries:{default:()=>[]},hiddenSeriesModifiers:{}}),emits:ss(["select"],["update:hiddenSeries"]),setup(l,{expose:r,emit:c}){Cs([bs,xs,js,zs]);const p=l,i=Ws(l,"hiddenSeries"),t=c,f=q(),y=v(()=>p.dir??Ms()),u=v(()=>p.xAxis?.format??p.format),x=v(()=>p.yAxis?.format??p.format),w=v(()=>({data:p.data,xColumn:p.x,yColumn:p.y,sizeColumn:p.size,seriesColumn:p.series,labelColumn:p.label,showDataLabels:p.showDataLabels,xAxis:z(p.xAxis),yAxis:z(p.yAxis),referenceLines:p.referenceLines,palette:p.palette,dir:y.value,echartOptions:p.echartOptions}));function z(n){if(n)return{title:n.title,min:n.min,max:n.max,echartOptions:n.echartOptions}}const{tokens:j}=Is(f),g=v(()=>is(w.value,{tokens:j.value})),rs=v(()=>g.value.every(n=>!n.points.length)),_s=v(()=>p.yAxis?.title?T(p.yAxis.title):void 0),V=v(()=>{try{return{option:na(w.value,{tokens:j.value,hiddenSeries:i.value,format:{x:u.value,y:x.value}}),error:null}}catch(n){return{option:void 0,error:n?.message??String(n)}}}),os=v(()=>V.value.error),k=as({x:0,y:0}),o=as({open:!1,x:0,y:0,label:void 0,items:[]}),{chart:$,dispatch:P}=Ss({container:f,option:()=>V.value.option,events:{mouseover:n=>hs(n),mouseout:()=>o.open=!1,click:n=>{const e=H(n);e&&t("select",{seriesName:e.series.name,x:e.point.x,y:e.point.y,size:e.point.size,label:e.point.label,row:e.point.row})}},onZrEvents:{mousemove:n=>{k.x=n.event?.clientX??k.x,k.y=n.event?.clientY??k.y,o.open&&(o.x=k.x,o.y=k.y)},globalout:()=>o.open=!1}});function H(n){const e=g.value.find(_=>_.name===n?.seriesName),h=e?.points[n?.dataIndex];return e&&h?{series:e,point:h}:void 0}function hs(n){const e=H(n);if(!e){o.open=!1;return}G(e,k.x,k.y)}function G(n,e,h){const{series:_,point:b}=n,ws=[b.label,p.series?_.label:void 0].filter(Boolean).join(" · ");o.label=ws||void 0,o.items=[L(p.x,b.x,u.value,_.color),L(p.y,b.y,x.value,_.color),...p.size&&b.size!==null?[L(p.size,b.size,p.format,_.color)]:[]],o.x=e,o.y=h,o.open=!0}function L(n,e,h,_){return{name:n,label:T(n),color:_,value:e,formattedValue:h?h(e):Es(e)}}const W=v(()=>g.value.map(n=>({name:n.name,label:n.label,color:n.color,hidden:i.value.includes(n.name)})));function us(n){i.value=Bs(i.value,n,g.value.length)}const U=q(null);function ds(n){U.value=n}X(U,(n,e)=>{e&&P({type:"downplay",seriesName:e}),n&&!i.value.includes(n)&&P({type:"highlight",seriesName:n})});const I=q(""),R=v(()=>g.value.filter(n=>!i.value.includes(n.name)).flatMap((n,e)=>n.points.map((h,_)=>({entry:n,point:h,seriesIndex:e,dataIndex:_}))));function ms(n,e){const h=f.value;if(!h)return;const _=h.getBoundingClientRect(),b=$.value?.convertToPixel({gridIndex:0},[n,e]);return!b||b.some(N=>typeof N!="number"||isNaN(N))?{x:_.left+_.width/2,y:_.top+_.height/2}:{x:_.left+b[0],y:_.top+b[1]}}function fs(n){const e=R.value[n];if(!e)return;const h=ms(e.point.x,e.point.y);P({type:"highlight",seriesIndex:e.seriesIndex,dataIndex:e.dataIndex}),G({series:e.entry,point:e.point},h?.x??k.x,h?.y??k.y),I.value=Vs(o.label,o.items.map(_=>({label:_.label,value:_.formattedValue})))}function Y(n){const e=n===null?void 0:R.value[n];e&&P({type:"downplay",seriesIndex:e.seriesIndex,dataIndex:e.dataIndex})}const ys=As({marks:()=>R.value,key:n=>`${n.entry.name} ${n.point.x} ${n.point.y}`,move:(n,e)=>{Y(e),fs(n)},activate:n=>{const e=R.value[n];e&&t("select",{seriesName:e.entry.name,x:e.point.x,y:e.point.y,size:e.point.size,label:e.point.label,row:e.point.row})},clear:n=>{Y(n),o.open=!1,I.value=""}}).attrs;return X(()=>g.value.map(n=>n.name),n=>{i.value=qs(i.value,n)}),r({chart:v(()=>$.value)}),(n,e)=>(O(),Us($s,{title:l.title,subtitle:l.subtitle,"plot-label":_s.value,loading:l.loading,error:l.error||os.value,empty:rs.value,dir:y.value},Z({default:m(()=>[s("div",Ys({ref_key:"plotEl",ref:f,class:"h-full w-full rounded-2 focus-visible:focus-ring",dir:"ltr",role:"img","aria-label":A(Fs)(l.title,l.subtitle)},A(ys)),null,16,ta),s("span",ca,Ks(I.value),1),d(Gs,{open:o.open,x:o.x,y:o.y,label:o.label,items:o.items,dir:y.value},Z({_:2},[n.$slots.tooltip?{name:"default",fn:m(h=>[C(n.$slots,"tooltip",Q(J(h)))]),key:"0"}:void 0]),1032,["open","x","y","label","items","dir"])]),_:2},[n.$slots.actions?{name:"actions",fn:m(()=>[C(n.$slots,"actions")]),key:"0"}:void 0,n.$slots.loading?{name:"loading",fn:m(()=>[C(n.$slots,"loading")]),key:"1"}:void 0,n.$slots.error?{name:"error",fn:m(h=>[C(n.$slots,"error",Q(J(h)))]),key:"2"}:void 0,n.$slots.empty?{name:"empty",fn:m(()=>[C(n.$slots,"empty")]),key:"3"}:void 0,W.value.length>1?{name:"legend",fn:m(()=>[d(Hs,{items:W.value,onChange:us,onHighlight:ds},null,8,["items"])]),key:"4"}:void 0]),1032,["title","subtitle","plot-label","loading","error","empty","dir"]))}}),ia={class:"h-80 w-full"},ra=E({__name:"ScatterQuadrants",setup(l){const r=[{product:"Payroll",growth:34,margin:62},{product:"Invoicing",growth:12,margin:71},{product:"CRM",growth:41,margin:48},{product:"Helpdesk",growth:27,margin:55},{product:"Inventory",growth:8,margin:44},{product:"Insights",growth:52,margin:39},{product:"Field service",growth:6,margin:58},{product:"Point of sale",growth:19,margin:33}],c=p=>`${p}%`;return(p,i)=>(O(),D("div",ia,[d(A(M),{data:r,x:"growth",y:"margin",label:"product","show-data-labels":"","x-axis":{title:"Growth",format:c},"y-axis":{title:"Margin",format:c},"reference-lines":[{value:25,axis:"x",label:"Median growth",dashed:!0},{value:50,axis:"y",label:"Median margin",dashed:!0}],title:"Growth against margin",subtitle:"Median lines divide the plot into four"},null,8,["x-axis","y-axis"])]))}}),_a={class:"h-96 w-full"},oa=E({__name:"ScatterMarkets",setup(l){const r=[{market:"Germany",arpu:61,retention:88,seats:14200,region:"EMEA"},{market:"France",arpu:54,retention:82,seats:9100,region:"EMEA"},{market:"UAE",arpu:72,retention:79,seats:2600,region:"EMEA"},{market:"Nigeria",arpu:21,retention:74,seats:4800,region:"EMEA"},{market:"India",arpu:18,retention:91,seats:38400,region:"APAC"},{market:"Japan",arpu:68,retention:94,seats:7300,region:"APAC"},{market:"Australia",arpu:59,retention:85,seats:5200,region:"APAC"},{market:"Singapore",arpu:77,retention:81,seats:1900,region:"APAC"},{market:"United States",arpu:74,retention:87,seats:41500,region:"Americas"},{market:"Canada",arpu:63,retention:89,seats:8600,region:"Americas"},{market:"Brazil",arpu:26,retention:71,seats:12800,region:"Americas"},{market:"Mexico",arpu:31,retention:76,seats:6400,region:"Americas"}];return(c,p)=>(O(),D("div",_a,[d(A(M),{data:r,x:"arpu",y:"retention",size:"seats",series:"region",label:"market","x-axis":{title:"ARPU",format:i=>`$${i}`},"y-axis":{title:"Retention",format:i=>`${i}%`},title:"Revenue per seat against retention",subtitle:"Bubble size is the number of seats"},null,8,["x-axis","y-axis"])]))}}),ha={class:"h-80 w-full"},ua=E({__name:"ScatterSpend",setup(l){const r=[{account:"Acme",spend:4200,revenue:12400},{account:"Globex",spend:9100,revenue:24200},{account:"Initech",spend:2200,revenue:3100},{account:"Umbrella",spend:7400,revenue:9600},{account:"Soylent",spend:5600,revenue:18800},{account:"Hooli",spend:12800,revenue:21400},{account:"Vehement",spend:1800,revenue:6200},{account:"Massive Dynamic",spend:10400,revenue:34600},{account:"Stark",spend:6800,revenue:7400},{account:"Wayne",spend:3100,revenue:11200}],c=p=>`$${new Intl.NumberFormat("en-US").format(p)}`;return(p,i)=>(O(),D("div",ha,[d(A(M),{data:r,x:"spend",y:"revenue",label:"account","x-axis":{title:"Acquisition spend"},"y-axis":{title:"Revenue"},format:c,title:"Spend against revenue",subtitle:"Ten largest accounts, last quarter"})]))}}),Ra=JSON.parse('{"title":"ScatterChart","description":"","frontmatter":{},"headers":[],"relativePath":"docs/charts/scatterchart.md","filePath":"docs/charts/scatterchart.md","lastUpdated":0}'),da={name:"docs/charts/scatterchart.md"},Ta=Object.assign(da,{setup(l){const r=[{name:"title",description:"Heads the card. Left out, the chart draws no header row at all.",required:!1,type:"string"},{name:"subtitle",description:"A second line under the title, e.g. the period the numbers cover.",required:!1,type:"string"},{name:"dir",description:"Forces layout direction; defaults to document.documentElement.dir",required:!1,type:"ChartDir"},{name:"loading",description:"Draws the placeholder in place of the plot, for data still on its way.",required:!1,type:"boolean"},{name:"error",description:`Puts the chart in its error state and prints this message under it. A
chart that fails to draw sets its own; this is for a failed request.`,required:!1,type:"string | null"},{name:"data",description:"One row per point.",required:!0,type:"Record<string, any>[]"},{name:"x",description:"Row key holding the horizontal measure.",required:!0,type:"string"},{name:"y",description:"Row key holding the vertical measure.",required:!0,type:"string"},{name:"size",description:"Row key holding the magnitude each point is sized by.",required:!1,type:"string"},{name:"series",description:"Grouping column: one series per distinct value.",required:!1,type:"string"},{name:"hiddenSeries",description:"Groups the legend has switched off, by name. Bind it with\n`v-model:hiddenSeries` to drive the legend from the app. Left unbound, the\nlegend owns it.",required:!1,type:"string[]",default:"[]"},{name:"label",description:"Row key holding the point's own name, which heads its tooltip.",required:!1,type:"string"},{name:"showDataLabels",description:`Prints the point's own name beside it, the way an axis series prints its
value. \`label\` is what it prints, so a chart that names no label column has
nothing to show and says so in a dev-mode warning. Names that would collide
with a neighbour are dropped, so a dense cloud carries few.`,required:!1,type:"boolean"},{name:"xAxis",description:"The horizontal scale. Both axes are value axes: a scatter has no categories.",required:!1,type:"ChartValueAxisOptions"},{name:"yAxis",description:"The vertical scale.",required:!1,type:"ChartValueAxisOptions"},{name:"palette",description:"Defaults to `'categorical'`: the groups are unrelated categories.",required:!1,type:"ChartPalette"},{name:"referenceLines",description:`Targets, thresholds and quadrant dividers drawn over the plot. They are
annotations, not series: no legend entry, and no way to switch one off.
Both axes are measured here, so \`axis: 'x'\` takes a number too — a pair of
lines, one per axis, is what divides a scatter into quadrants.`,required:!1,type:"ReferenceLine[]"},{name:"format",description:"Prints every number the chart shows. `xAxis.format` and `yAxis.format`\noverride it for their own axis; the size measure has no axis, so this is\nwhat prints it.",required:!1,type:"ChartValueFormatter"},{name:"echartOptions",description:"Escape hatch: deep-merged into the echarts option the props built.",required:!1,type:"EchartOptionsOverride"}],c=[{name:"loading",description:"Replaces the whole placeholder, e.g. with a skeleton of the app's own.",type:"any"},{name:"error",description:"Replaces the message, e.g. to put a retry button beside it.",type:"{ error?: string | null | undefined; }"},{name:"empty",description:'Replaces the "no data" line, e.g. with a hint about the filters.',type:"any"},{name:"actions",description:"",type:"any"},{name:"tooltip",description:"Replaces the tooltip body. `items` holds the point's two measures, and\nits size when the chart draws one.",type:"{ label?: string | undefined; items: ChartTooltipItem[]; }"}],p=[{name:"select",description:`A point was selected, by click or by Enter on the keyboard cursor. Carries
both measures and the row behind it.`,type:"[event: ScatterPointEvent]"},{name:"update:hiddenSeries",description:"Fired when the hidden series changes.",type:"[value: string[]]"}];return(i,t)=>{const f=ns("ComponentPreview"),y=ns("ClientOnly");return O(),D("div",null,[t[4]||(t[4]=F("",5)),d(y,null,{default:m(()=>[d(f,{name:"Charts-ScatterSpend","self-layout":""},{code:m(()=>[...t[0]||(t[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:m(()=>[d(ua)]),_:1})]),_:1}),t[5]||(t[5]=s("h2",{id:"a-third-measure-as-size",tabindex:"-1"},[a("A third measure as size "),s("a",{class:"header-anchor",href:"#a-third-measure-as-size","aria-label":"Permalink to “A third measure as size”"},"​")],-1)),t[6]||(t[6]=s("p",null,[s("code",null,"size"),a(" names a column of magnitudes, and each point is drawn at a diameter that maps that magnitude linearly into a readable range. The scale runs over the whole plot rather than within a group, so a bubble means the same thing wherever it sits. Data with one distinct magnitude draws every bubble at the middle of the range: it has no relative size to show, and drawing them all at the floor would claim they were the smallest there is.")],-1)),t[7]||(t[7]=s("p",null,[s("code",null,"series"),a(" splits the rows into one group per distinct value, colored from the palette and named in the legend. Press a legend entry to take a group out of the plot, or bind "),s("code",null,"v-model:hiddenSeries"),a(" to own that list yourself.")],-1)),d(y,null,{default:m(()=>[d(f,{name:"Charts-ScatterMarkets","self-layout":""},{code:m(()=>[...t[1]||(t[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:m(()=>[d(oa)]),_:1})]),_:1}),t[8]||(t[8]=F("",4)),d(y,null,{default:m(()=>[d(f,{name:"Charts-ScatterQuadrants","self-layout":""},{code:m(()=>[...t[2]||(t[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:m(()=>[d(ra)]),_:1})]),_:1}),t[9]||(t[9]=F("",7)),d(vs,{name:"ScatterChart",data:r},{code:m(()=>[...t[3]||(t[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ComputedRef"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * How many slices the ring holds, "Others" included: past that it keeps the')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * largest `maxSlices - 1` and sums the tail into "Others". A ring stops being')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * readable long before the palette runs out, so it defaults to 9.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heads the card. Left out, the chart draws no header row at all. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** A second line under the title, e.g. the period the numbers cover. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Draws the placeholder in place of the plot, for data still on its way. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  loading"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Puts the chart in its error state and prints this message under it. A")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * chart that fails to draw sets its own; this is for a failed request.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  error"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartXAxisOptions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heads the axis, under its labels. Left out, the axis carries no name. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints each category label. Takes whatever the column holds. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartCategoryFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into this axis' echarts option. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartValueAxisOptions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Names what the axis measures. Drawn above the plot rather than turned")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * sideways along it, so it reads with the chart title.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bottom of the scale. Defaults to a round number under the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Top of the scale. Defaults to a round number over the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints each tick label, and every value this axis carries elsewhere. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into this axis' echarts option. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Takes this series out of the palette, e.g. to pin one to a brand color. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints this series' value beside each of its marks. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into this series' echarts option. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The rows to plot. One row is one position on the category axis. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Series the legend has switched off, by name. Bind it with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `v-model:hiddenSeries` to drive the legend from the app, or to keep what a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * reader hid across a reload. Left unbound, the legend owns it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  hiddenSeries"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The category axis: its title, how the `x` column reads, and label format. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartXAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The primary value axis: its title, its range, and how a value prints. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into the echarts option the props built. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'  /** The rows to plot. One row is one slice, before the "Others" grouping. */')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the slice name. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  category"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the slice size. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * How many slices the ring holds, "Others" included. Past that the ring keeps')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * the largest `maxSlices - 1` and sums the tail into a single "Others" slice,')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * named `OTHERS_KEY`. Defaults to 9 — a ring stops being readable long before")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the palette runs out.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  maxSlices"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each slice's name and share beside the ring, and drops the readout")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the middle. Off by default: the legend says the same without the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * leader lines.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showInlineLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Caption under the total in the middle. Defaults to the `value` key. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  centerLabel"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `'half'` draws the ring as a semicircle; only the geometry changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  variant"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DonutVariant")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints every number the ring shows: the readout, the tooltip, the labels. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to `'categorical'`: slices are unrelated categories, not steps. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into the echarts option the props built. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartBaseProps"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per stage, in process order. Rows are drawn as they arrive. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  data"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding the stage name. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  category"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key holding how many reached the stage. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints each stage's share of the first stage. On by default. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showPercentages"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints every number the funnel shows: the stage values and the tooltip. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bottom of the color scale. Defaults to the smallest value in the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Top of the color scale. Defaults to the largest value in the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each cell's value inside it. A label that would collide with its")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * neighbour is dropped, so a grid too fine to carry numbers shows none.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showValues"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints every number the grid shows: the cells, the scale ends, the tooltip. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ramp cells are colored from. Defaults to `'sequential'`, which is what a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * magnitude reads as; `'diverging'` is for signed data and centers on zero.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," HeatmapPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into the echarts option the props built. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints every number the flow shows, i.e. what a band or node carries. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to `'categorical'`: nodes are unrelated categories. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  palette"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartPalette")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into the echarts option the props built. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Groups the legend has switched off, by name. Bind it with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `v-model:hiddenSeries` to drive the legend from the app. Left unbound, the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * legend owns it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  hiddenSeries"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into the echarts option the props built. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** No `subtitle`: the card is one reading, and the caption row says what it compares against. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," NumberCardProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," Omit"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ChartBaseProps"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"subtitle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  Pick"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ChartCardProps"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"card"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** What the reading is, printed above the number. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Printed before the number, e.g. a currency sign. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Printed after the number, e.g. a unit. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Change against the comparison period. Sign drives the arrow. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    delta"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Unit printed after the delta, e.g. `'%'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaSuffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** What the delta is measured against, e.g. `'vs last month'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaCaption"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Flips the delta colors, for metrics like churn or cost. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    negativeIsBetter"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Decimal places. Defaults to as many as the value carries, up to 2. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    precision"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Shortens the value, `12300` -> `12.3K`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    compact"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** A trend across the bottom of the card: shape only, no axes to read against. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heads the card. Left out, the container draws no header row at all. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** A second line under the title, e.g. the period the numbers cover. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Value-axis title, drawn above the plot instead of inside it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  plotLabel"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Title of the second value axis, drawn over the edge that axis sits on. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  plotLabelSecondary"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Edge of the plot the value-axis titles head. Defaults to the top. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  plotLabelPlacement"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PlotLabelPlacement")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Draws the placeholder in place of the plot, for data still on its way. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  loading"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Non-empty switches the container into its error state. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  error"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Draws the empty state: there is data, and it plots to nothing. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  empty"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartLegendProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One entry per series, in the order they are drawn. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartLegendItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartTooltipProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Draws the tooltip. It is measured before it is placed, so it flips at the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * viewport edge rather than running off it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Viewport x of the point the tooltip hangs off, i.e. the pointer. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  x"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Viewport y of the point the tooltip hangs off, i.e. the pointer. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heads the tooltip, e.g. the category the readings below it belong to. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One row per reading, in the order they should be read. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ---------------------------------------------------------------------------")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Component emits and slots. Declared here beside the props so a consumer can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// name a handler's payload or a slot's props — `(e: ChartDatapointEvent)` reads")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// as the family's own type rather than as an inline literal nobody can import.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ---------------------------------------------------------------------------")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * The three states, forwarded by every chart. A slot replaces the whole state")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * rather than a line inside it, so an app reaching one corner of the chrome")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * does not have to rebuild the rest of it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartStateSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the whole placeholder, e.g. with a skeleton of the app's own. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  loading"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the message, e.g. to put a retry button beside it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  error"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," error"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'  /** Replaces the "no data" line, e.g. with a hint about the filters. */')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  empty"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Controls at the top right of the card, e.g. a period Select or a Dropdown. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A mark was selected, by click or by Enter on the keyboard cursor. Carries")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the series it belongs to, its position along the category axis, and the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * row behind it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," ChartDatapointEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `items` holds one entry per visible series at")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * the hovered category, biggest first.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_1jjt6x"},";"),s("span",{class:"s_bsv8nz"}," items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," BarChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartEmits")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," BarChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartSlots")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," LineChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartEmits")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," LineChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartSlots")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AreaChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartEmits")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AreaChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," AxisChartSlots")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DonutChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A slice was selected, by click or by Enter on the keyboard cursor. The")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * "Others" slice carries every row it grouped, so a caller can drill into')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the tail as well as into a named slice.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," DonutSliceEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DonutChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the readout in the middle of the ring. Reads the total, or the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * hovered slice while one is hovered.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    center"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      /** Only set while a slice is hovered. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      percent"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Replaces the tooltip body. `items` holds the hovered slice alone. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A stage was selected, by click or by Enter on the keyboard cursor. Carries")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * its position in the funnel and the row behind it; the whole column is the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * hit area, not just the shape it draws.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," FunnelStageEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `stage` carries the two conversion rates the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * default body prints under the value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      stage"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," FunnelStage")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A cell was selected, by click or by Enter on the keyboard cursor. Carries")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * both its categories and the row behind it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," HeatmapCellEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Replaces the tooltip body. `items` holds the hovered cell alone. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_1jjt6x"},";"),s("span",{class:"s_bsv8nz"}," items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A band was selected, by click or by Enter on the keyboard cursor. Carries")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * its two nodes and the row behind it. A node emits nothing: it stands for")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * every row that passes through it, not one.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," SankeyLinkEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SankeyChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Replaces the tooltip body. `items` holds the hovered band or node alone. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_1jjt6x"},";"),s("span",{class:"s_bsv8nz"}," items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A point was selected, by click or by Enter on the keyboard cursor. Carries")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * both measures and the row behind it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," ScatterPointEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `items` holds the point's two measures, and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * its size when the chart draws one.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_1jjt6x"},";"),s("span",{class:"s_bsv8nz"}," items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** No tooltip slot: a card with no plot has nothing to hover. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," NumberCardSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Replaces `deltaCaption`, e.g. with a Dropdown that changes the period. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    caption"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," caption"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartCardSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The card's contents. The card supplies the surface and clips them. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  default"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartContainerSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** The plot itself, drawn into a box the container sizes and states. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    default"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** The row under the plot, e.g. a `ChartLegend` or a ramp scale. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    legend"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartLegendEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** An entry was pressed: the named series' visibility flipped. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  change"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The highlighted series, or null when the highlight clears. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  highlight"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"name"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartTooltipSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the whole tooltip body, headline row included. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  default"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_bsv8nz"}," label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_1jjt6x"},";"),s("span",{class:"s_bsv8nz"}," items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_13ahmt"}," })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),d(gs,{data:c}),d(ks,{data:p})])}}});export{Ra as __pageData,Ta as default};
