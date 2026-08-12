import{_ as k}from"./chunks/PropsTable.DgEk33UD.js";import{_ as g}from"./chunks/SlotsTable.12IYQNSC.js";import{_ as v}from"./chunks/EmitsTable.COtCPWIW.js";import"./chunks/theme.CchDXMNg.js";import{_ as t}from"./chunks/LineChart.vue_vue_type_script_setup_true_lang.DVWmtiFR.js";import{I as y,ad as r,r as o,o as s,D as l,aE as i,Z as f,ao as j,A as w,be as e,B as a}from"./chunks/framework.CK2aBVEu.js";import"./chunks/useChart.DdI8R1Al.js";import"./chunks/tokens.Da4oEHRh.js";import"./chunks/utils.BIjrxRCb.js";import"./chunks/seriesData.BORrCLEW.js";import"./chunks/createSeriesData.B315BIfk.js";import"./chunks/dataStackHelper.wURsTTdH.js";import"./chunks/referenceLines.CNCzj_aZ.js";import"./chunks/installLabelLayout.DAF0Ukrs.js";import"./chunks/axisAlignTicks.C3GKrOps.js";import"./chunks/labelLayoutHelper.CAjfqscQ.js";import"./chunks/labelGuideHelper.DQxR9qas.js";import"./chunks/axisChartCommon.CBi4S2hA.js";import"./chunks/format.1sKmFCir.js";import"./chunks/sectorHelper.jF99l91k.js";import"./chunks/usePlotKeyboard.CAiqHl1V.js";import"./chunks/ChartContainer.vue_vue_type_script_setup_true_lang.DnS3cgim.js";import"./chunks/ChartLegend.vue_vue_type_script_setup_true_lang.C03M4QSG.js";import"./chunks/ChartTooltip.vue_vue_type_script_setup_true_lang.Tvuur-_0.js";const x={class:"grid w-full gap-4 sm:grid-cols-2"},b={class:"h-72"},z={class:"h-72"},C=y({__name:"LineGaps",setup(h){const c={data:[{week:"2026-05-11",share:8.2},{week:"2026-05-18",share:9.1},{week:"2026-05-25",share:9.8},{week:"2026-06-01",share:null},{week:"2026-06-08",share:null},{week:"2026-06-15",share:11.4},{week:"2026-06-22",share:12},{week:"2026-06-29",share:12.9},{week:"2026-07-06",share:13.4},{week:"2026-07-13",share:14.1},{week:"2026-07-20",share:15.2},{week:"2026-07-27",share:16}],x:"week",y:"share",xAxis:{type:"time",timeGrain:"week"},yAxis:{title:"Share of orders (%)"},seriesConfig:{share:{label:"In-app checkout",showDataPoints:!0}}};return(_,d)=>(r(),o("div",x,[s("div",b,[l(i(t),f(c,{title:"In-app checkout",subtitle:"Share of orders, weekly"}),null,16)]),s("div",z,[l(i(t),f(c,{"connect-nulls":"",title:"In-app checkout",subtitle:"Same series with connectNulls"}),null,16)])]))}}),S={class:"h-80 w-full"},A=y({__name:"LineThresholds",setup(h){const p=[{day:"2026-07-06",p95:412,errors:.9},{day:"2026-07-07",p95:398,errors:.7},{day:"2026-07-08",p95:445,errors:1.1},{day:"2026-07-09",p95:612,errors:2.4},{day:"2026-07-10",p95:704,errors:3.1},{day:"2026-07-11",p95:538,errors:1.6},{day:"2026-07-12",p95:461,errors:1},{day:"2026-07-13",p95:388,errors:.6}];return(c,_)=>(r(),o("div",S,[l(i(t),{data:p,x:"day",y:["p95","errors"],"x-axis":{type:"time",timeGrain:"day"},"y-axis":{title:"p95 latency",format:d=>`${d} ms`},"y2-axis":{title:"Error rate",format:d=>`${d}%`},palette:"categorical","series-config":{errors:{label:"Errors",axis:"y2"}},"reference-lines":[{value:500,label:"SLA",dashed:!0},{value:2,axis:"y2",label:"Error budget",dashed:!0},{value:"2026-07-09",axis:"x",label:"Release 4.2"}],title:"Latency and errors",subtitle:"API gateway, last eight days"},null,8,["y-axis","y2-axis"])]))}}),O={class:"h-80 w-full"},T=y({__name:"LineFilledSeries",setup(h){const p=[{week:"2026-05-04",signups:1240,plan:1100},{week:"2026-05-11",signups:1385,plan:1150},{week:"2026-05-18",signups:1302,plan:1200},{week:"2026-05-25",signups:1467,plan:1250},{week:"2026-06-01",signups:1590,plan:1300},{week:"2026-06-08",signups:1521,plan:1350},{week:"2026-06-15",signups:1688,plan:1400},{week:"2026-06-22",signups:1744,plan:1450}];return(c,_)=>(r(),o("div",O,[l(i(t),{data:p,x:"week",y:["signups","plan"],"x-axis":{type:"time",timeGrain:"week"},"y-axis":{title:"Signups"},palette:"categorical","series-config":{signups:{type:"area"},plan:{lineType:"dashed",lineWidth:1.5}},title:"Signups against plan",subtitle:"The reading carries a fill; the plan stays a line"})]))}}),P={class:"h-80 w-full"},R=y({__name:"LineDualAxis",setup(h){const p=[{month:"2025-08-01",revenue:144500,target:14e4,attainment:103.2},{month:"2025-09-01",revenue:150700,target:148e3,attainment:101.8},{month:"2025-10-01",revenue:157400,target:155e3,attainment:101.5},{month:"2025-11-01",revenue:172700,target:175e3,attainment:98.7},{month:"2025-12-01",revenue:188600,target:195e3,attainment:96.7},{month:"2026-01-01",revenue:171700,target:178e3,attainment:96.5},{month:"2026-02-01",revenue:177100,target:18e4,attainment:98.4},{month:"2026-03-01",revenue:186700,target:185e3,attainment:100.9},{month:"2026-04-01",revenue:193600,target:19e4,attainment:101.9},{month:"2026-05-01",revenue:202100,target:198e3,attainment:102.1},{month:"2026-06-01",revenue:209500,target:206e3,attainment:101.7},{month:"2026-07-01",revenue:220200,target:215e3,attainment:102.4}];return(c,_)=>(r(),o("div",P,[l(i(t),{data:p,x:"month",y:["revenue","target","attainment"],"x-axis":{type:"time",timeGrain:"month"},"y-axis":{title:"Revenue ($)"},"y2-axis":{title:"Attainment (%)",min:90,max:110},palette:"categorical","series-config":{target:{lineType:"dashed",lineWidth:1.5},attainment:{label:"Attainment",axis:"y2"}},title:"Revenue against target",subtitle:"Committed plan vs actuals, last 12 months"})]))}}),D={class:"grid w-full gap-4 sm:grid-cols-2"},E={class:"h-72"},L={class:"h-72"},I=y({__name:"LineNumericAxis",setup(h){const c={data:[{discount:0,conversion:2.1},{discount:5,conversion:3.4},{discount:10,conversion:4.6},{discount:15,conversion:5.1},{discount:40,conversion:6},{discount:60,conversion:6.2}],x:"discount",y:"conversion",xAxis:{title:"Discount (%)"},yAxis:{title:"Conversion (%)"},seriesConfig:{conversion:{label:"Conversion",showDataPoints:!0}}};return(_,d)=>(r(),o("div",D,[s("div",E,[l(i(t),f(c,{title:"Conversion by discount",subtitle:"Discounts as categories"}),null,16)]),s("div",L,[l(i(t),f(c,{"x-axis":{title:"Discount (%)",type:"value"},title:"Conversion by discount",subtitle:"Discounts on a numeric axis"}),null,16)])]))}}),q={class:"h-80 w-full"},N=y({__name:"LineTrend",setup(h){const p=[{month:"2025-08-01",mobile:41200,desktop:26800},{month:"2025-09-01",mobile:43100,desktop:27400},{month:"2025-10-01",mobile:45600,desktop:28200},{month:"2025-11-01",mobile:52400,desktop:31900},{month:"2025-12-01",mobile:58200,desktop:34100},{month:"2026-01-01",mobile:47800,desktop:29600},{month:"2026-02-01",mobile:49300,desktop:30200},{month:"2026-03-01",mobile:52100,desktop:31400},{month:"2026-04-01",mobile:54600,desktop:32300},{month:"2026-05-01",mobile:57200,desktop:33500},{month:"2026-06-01",mobile:59800,desktop:34600},{month:"2026-07-01",mobile:63400,desktop:36100}];return(c,_)=>(r(),o("div",q,[l(i(t),{data:p,x:"month",y:["mobile","desktop"],"x-axis":{type:"time",timeGrain:"month",title:"Month"},"y-axis":{title:"Sessions"},palette:"categorical","series-config":{mobile:{smooth:!0},desktop:{lineType:"dashed",lineWidth:1.5,smooth:!0}},title:"Sessions by device",subtitle:"Store sessions, last 12 months"})]))}}),rs=JSON.parse('{"title":"LineChart","description":"","frontmatter":{},"headers":[],"relativePath":"docs/charts/linechart.md","filePath":"docs/charts/linechart.md","lastUpdated":0}'),B={name:"docs/charts/linechart.md"},os=Object.assign(B,{setup(h){const p=[{name:"title",description:"Heads the card. Left out, the chart draws no header row at all.",required:!1,type:"string"},{name:"subtitle",description:"A second line under the title, e.g. the period the numbers cover.",required:!1,type:"string"},{name:"dir",description:"Forces layout direction; defaults to document.documentElement.dir",required:!1,type:"ChartDir"},{name:"loading",description:"Draws the placeholder in place of the plot, for data still on its way.",required:!1,type:"boolean"},{name:"error",description:`Puts the chart in its error state and prints this message under it. A
chart that fails to draw sets its own; this is for a failed request.`,required:!1,type:"string | null"},{name:"data",description:"The rows to plot. One row is one position on the category axis.",required:!0,type:"Record<string, any>[]"},{name:"x",description:"Column holding the category or time each point sits at.",required:!0,type:"string"},{name:"y",description:"Value column(s). A list reads wide data: one series per column, drawn and\ncolored in the order given. `seriesConfig[key].axis` moves one of them to\nthe second value axis without moving it in the list.",required:!0,type:"string | string[]"},{name:"series",description:"Grouping column, i.e. long data. Use with a single `y`.",required:!1,type:"string"},{name:"maxSeries",description:'Caps how many series the `series` column produces. The rest are summed\ninto a single "Others" series, keyed `OTHERS_KEY` so `seriesConfig` can\nstyle it. Uncapped by default, and ignored when `y` names the columns:\nthose the caller chose one by one.',required:!1,type:"number"},{name:"seriesConfig",description:"Keyed by series identity: a `y` column, or a value of the `series` column.",required:!1,type:"Record<string, SeriesStyle>"},{name:"hiddenSeries",description:"Series the legend has switched off, by name. Bind it with\n`v-model:hiddenSeries` to drive the legend from the app, or to keep what a\nreader hid across a reload. Left unbound, the legend owns it.",required:!1,type:"string[]",default:"[]"},{name:"xAxis",description:"The category axis: its title, how the `x` column reads, and label format.",required:!1,type:"ChartXAxisOptions"},{name:"yAxis",description:"The primary value axis: its title, its range, and how a value prints.",required:!1,type:"ChartValueAxisOptions"},{name:"y2Axis",description:"The second value axis. Only drawn when a series sits on `axis: 'y2'`.",required:!1,type:"ChartValueAxisOptions"},{name:"palette",description:"Ramp series colors are drawn from. Defaults to `'sequential'`.",required:!1,type:"ChartPalette"},{name:"stacked",description:"Series sum on top of each other. Bar and area series; a line never stacks.\n`'normalized'` reads each value as its share of the stack it sits in\ninstead of its own magnitude, and pins that value axis to 0-100.",required:!1,type:'boolean | "normalized"'},{name:"connectNulls",description:"Bridges gaps left by nulls. Line and area series.",required:!1,type:"boolean"},{name:"fillOpacity",description:"Chart-level fill alpha; `seriesConfig` overrides it per series. Area series.",required:!1,type:"number"},{name:"referenceLines",description:`Targets, thresholds and other fixed marks drawn over the plot. They are
annotations, not series: no legend entry, and no way to switch one off.`,required:!1,type:"ReferenceLine[]"},{name:"echartOptions",description:"Escape hatch: deep-merged into the echarts option the props built.",required:!1,type:"EchartOptionsOverride"}],c=[{name:"loading",description:"Replaces the whole placeholder, e.g. with a skeleton of the app's own.",type:"any"},{name:"error",description:"Replaces the message, e.g. to put a retry button beside it.",type:"{ error?: string | null | undefined; }"},{name:"empty",description:'Replaces the "no data" line, e.g. with a hint about the filters.',type:"any"},{name:"actions",description:"",type:"any"},{name:"tooltip",description:"Replaces the tooltip body. `items` holds one entry per visible series at\nthe hovered category, biggest first.",type:"{ label?: string | undefined; items: ChartTooltipItem[]; }"}],_=[{name:"select",description:`A mark was selected, by click or by Enter on the keyboard cursor. Carries
the series it belongs to, its position along the category axis, and the
row behind it.`,type:"[event: ChartDatapointEvent]"},{name:"update:hiddenSeries",description:"Fired when the hidden series changes.",type:"[value: string[]]"}];return(d,n)=>{const u=j("ComponentPreview"),m=j("ClientOnly");return r(),o("div",null,[n[7]||(n[7]=w('<h1 id="linechart" tabindex="-1">LineChart <a class="header-anchor" href="#linechart" aria-label="Permalink to “LineChart”">​</a></h1><p>Lines for a measure that moves over time.</p><h2 id="trends" tabindex="-1">Trends <a class="header-anchor" href="#trends" aria-label="Permalink to “Trends”">​</a></h2><p>Two series on a time axis, one dashed as the comparison. <code>smooth</code>, <code>lineType</code>, <code>lineWidth</code> and <code>showDataPoints</code> are per-series settings in <code>seriesConfig</code>.</p>',4)),l(m,null,{default:e(()=>[l(u,{name:"Charts-LineTrend","self-layout":""},{code:e(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sessions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-08-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 41200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 26800"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-09-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 43100"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 27400"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-10-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 45600"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 28200"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-11-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 52400"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 31900"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-12-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 58200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 34100"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-01-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 47800"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 29600"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-02-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 49300"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 30200"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-03-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 52100"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 31400"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-04-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 54600"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 32300"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 57200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 33500"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 59800"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 34600"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," mobile"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 63400"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," desktop"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 36100"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-80 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sessions"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"month"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"['mobile', 'desktop']"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ type: 'time', timeGrain: 'month', title: 'Month' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Sessions' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      palette"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"categorical"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :series-config"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        mobile: { smooth: true },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        desktop: { lineType: 'dashed', lineWidth: 1.5, smooth: true },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Sessions by device"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Store sessions, last 12 months"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(N)]),_:1})]),_:1}),n[8]||(n[8]=w('<h2 id="a-numeric-x-axis" tabindex="-1">A numeric x axis <a class="header-anchor" href="#a-numeric-x-axis" aria-label="Permalink to “A numeric x axis”">​</a></h2><p><code>xAxis.type: &#39;value&#39;</code> reads the x column as a quantity. A point sits at its own number, so a row at 5 and a row at 60 stand as far apart as the numbers are, and the rows draw in numeric order whatever order they arrive in.</p><p>The default reading is <code>&#39;category&#39;</code>, which gives every row an equal slot. A column of dates becomes <code>&#39;time&#39;</code> on its own, but a column of numbers never becomes a scale by itself — a category column often holds numbers, so the scale is asked for. A horizontal <code>BarChart</code> ignores the setting, because a bar is sized from the slot it stands in; <code>horizontal</code> is a <code>BarChart</code> prop, and a line chart has none.</p>',3)),l(m,null,{default:e(()=>[l(u,{name:"Charts-LineNumericAxis","self-layout":""},{code:e(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChartProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// The discounts pricing actually ran, which is not an even ladder: the last two")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// are where the curve flattens out, and they are the reason to read the scale.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," byDiscount"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," discount"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," conversion"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 2.1"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," discount"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 5"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," conversion"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 3.4"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," discount"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 10"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," conversion"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 4.6"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," discount"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 15"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," conversion"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 5.1"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," discount"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 40"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," conversion"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 6.0"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," discount"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 60"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," conversion"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 6.2"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," conversion"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," LineChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  data"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_22m8k2"}," byDiscount"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  x"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"discount"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  y"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"conversion"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  xAxis"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Discount (%)"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  yAxis"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Conversion (%)"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  seriesConfig"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," conversion"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_12xt1b"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Conversion"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_12xt1b"}," showDataPoints"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full gap-4 sm:grid-cols-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-bind"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"conversion"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Conversion by discount"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Discounts as categories"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-bind"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"conversion"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Discount (%)', type: 'value' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Conversion by discount"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Discounts on a numeric axis"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(I)]),_:1})]),_:1}),n[9]||(n[9]=s("h2",{id:"a-second-value-axis",tabindex:"-1"},[a("A second value axis "),s("a",{class:"header-anchor",href:"#a-second-value-axis","aria-label":"Permalink to “A second value axis”"},"​")],-1)),n[10]||(n[10]=s("p",null,[s("code",null,"seriesConfig[key].axis"),a(" measures a series against a second value axis, drawn opposite the primary — for a series in another unit, like a rate against dollars. "),s("code",null,"y2Axis.min"),a(" / "),s("code",null,"max"),a(" pin that scale so the line reads as over or under plan rather than as its own trend. The axis is only drawn when a series asks for it.")],-1)),l(m,null,{default:e(()=>[l(u,{name:"Charts-LineDualAxis","self-layout":""},{code:e(()=>[...n[2]||(n[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," performance"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-08-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 144500"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 140000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 103.2"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-09-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 150700"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 148000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 101.8"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-10-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 157400"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 155000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 101.5"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-11-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 172700"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 175000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 98.7"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2025-12-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 188600"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 195000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 96.7"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-01-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 171700"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 178000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 96.5"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-02-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 177100"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 180000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 98.4"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-03-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 186700"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 185000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 100.9"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-04-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 193600"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 190000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 101.9"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 202100"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 198000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 102.1"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 209500"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 206000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 101.7"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," revenue"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 220200"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," target"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 215000"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," attainment"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 102.4"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-80 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"performance"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"month"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"['revenue', 'target', 'attainment']"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ type: 'time', timeGrain: 'month' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Revenue ($)' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y2-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Attainment (%)', min: 90, max: 110 }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      palette"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"categorical"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :series-config"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        target: { lineType: 'dashed', lineWidth: 1.5 },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        attainment: { label: 'Attainment', axis: 'y2' },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Revenue against target"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Committed plan vs actuals, last 12 months"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(R)]),_:1})]),_:1}),n[11]||(n[11]=w('<p>Which scale a series is read against is per-series meaning, so it sits in the same entry as that series&#39; label and mark. It is not a second column list: <code>y</code> names every series once, in the order they are drawn and colored, and moving one across to the second axis leaves it where it was. Long data reaches the axis the same way, keyed by a value of the <code>series</code> column.</p><h2 id="filling-one-series" tabindex="-1">Filling one series <a class="header-anchor" href="#filling-one-series" aria-label="Permalink to “Filling one series”">​</a></h2><p><code>seriesConfig[key].type</code> sets the mark a single series draws as, so one line of a <code>LineChart</code> carries a fill on <code>type: &#39;area&#39;</code> while the rest stay bare. There is no separate fill flag: an area <em>is</em> a filled line. <code>fillOpacity</code> sets the alpha, chart-wide or per series. The same key takes <code>&#39;bar&#39;</code>, which is what makes a combo chart.</p>',3)),l(m,null,{default:e(()=>[l(u,{name:"Charts-LineFilledSeries","self-layout":""},{code:e(()=>[...n[3]||(n[3]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," weekly"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-04"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1240"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1100"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-11"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1385"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1150"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-18"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1302"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1200"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-25"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1467"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1250"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1590"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1300"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-08"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1521"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1350"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-15"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1688"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1400"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-22"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," signups"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1744"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," plan"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1450"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-80 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"weekly"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"week"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"['signups', 'plan']"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ type: 'time', timeGrain: 'week' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Signups' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      palette"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"categorical"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :series-config"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        signups: { type: 'area' },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        plan: { lineType: 'dashed', lineWidth: 1.5 },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Signups against plan"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"The reading carries a fill; the plan stays a line"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(T)]),_:1})]),_:1}),n[12]||(n[12]=w('<h2 id="targets-and-thresholds" tabindex="-1">Targets and thresholds <a class="header-anchor" href="#targets-and-thresholds" aria-label="Permalink to “Targets and thresholds”">​</a></h2><p><code>referenceLines</code> draws a rule over the plot at a fixed position. <code>axis</code> says what <code>value</code> is read against: <code>&#39;y&#39;</code> (the default) or <code>&#39;y2&#39;</code> for a rule across the plot at a measured value, <code>&#39;x&#39;</code> for one down it at a category, a date, or a number on a numeric x axis. Each line also takes an optional <code>label</code>, <code>color</code> and <code>dashed</code>.</p>',2)),l(m,null,{default:e(()=>[l(u,{name:"Charts-LineThresholds","self-layout":""},{code:e(()=>[...n[4]||(n[4]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," latency"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-06"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 412"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0.9"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-07"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 398"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0.7"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-08"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 445"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1.1"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-09"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 612"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 2.4"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-10"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 704"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 3.1"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-11"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 538"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1.6"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-12"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 461"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1.0"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-13"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," p95"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 388"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," errors"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0.6"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-80 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"latency"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"['p95', 'errors']"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ type: 'time', timeGrain: 'day' }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'p95 latency', format: (value) => `${value} ms` }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :y2-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ title: 'Error rate', format: (value) => `${value}%` }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      palette"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"categorical"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :series-config"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ errors: { label: 'Errors', axis: 'y2' } }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :reference-lines"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        { value: 500, label: 'SLA', dashed: true },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        { value: 2, axis: 'y2', label: 'Error budget', dashed: true },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        { value: '2026-07-09', axis: 'x', label: 'Release 4.2' },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"      ]"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Latency and errors"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"API gateway, last eight days"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(A)]),_:1})]),_:1}),n[13]||(n[13]=w('<p>A reference line is an annotation, not a series: it has no legend entry, it is never in the tooltip, and it cannot be switched off — which is what a threshold has to be to stay comparable. A line outside the range the plot covers is not drawn, because stretching the scale to fit a distant target would flatten the data it is meant to be read against; pin <code>yAxis.min</code> / <code>max</code> instead.</p><h2 id="hiding-a-series" tabindex="-1">Hiding a series <a class="header-anchor" href="#hiding-a-series" aria-label="Permalink to “Hiding a series”">​</a></h2><p>A chart with more than one series draws a legend under the plot. Press an entry to take that line out of the chart, or bind <code>v-model:hiddenSeries</code> to own that list yourself. It is described under <a href="/docs/charts/barchart#hiding-a-series">BarChart</a>.</p><h2 id="gaps" tabindex="-1">Gaps <a class="header-anchor" href="#gaps" aria-label="Permalink to “Gaps”">​</a></h2><p>Null readings break the line, because a gap in the data should read as a gap. <code>connectNulls</code> bridges them instead.</p>',5)),l(m,null,{default:e(()=>[l(u,{name:"Charts-LineGaps","self-layout":""},{code:e(()=>[...n[5]||(n[5]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"LineChartProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// The two nulls are a tracking outage, not two weeks of nobody checking out.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," checkoutShare"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-11"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 8.2"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-18"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 9.1"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-05-25"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 9.8"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," null"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-08"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," null"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-15"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 11.4"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-22"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12.0"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-06-29"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12.9"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-06"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 13.4"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-13"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 14.1"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-20"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 15.2"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," week"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2026-07-27"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 16.0"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," adoption"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," LineChartProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  data"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_22m8k2"}," checkoutShare"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  x"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"week"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  y"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"share"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  xAxis"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," type"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"time"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," timeGrain"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"week"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  yAxis"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Share of orders (%)"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  seriesConfig"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," share"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_12xt1b"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"In-app checkout"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_12xt1b"}," showDataPoints"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full gap-4 sm:grid-cols-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-bind"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"adoption"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"In-app checkout"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Share of orders, weekly"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"LineChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-bind"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"adoption"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        connect-nulls")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"In-app checkout"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Same series with connectNulls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(C)]),_:1})]),_:1}),n[14]||(n[14]=s("h2",{id:"api-reference",tabindex:"-1"},[a("API Reference "),s("a",{class:"header-anchor",href:"#api-reference","aria-label":"Permalink to “API Reference”"},"​")],-1)),l(k,{name:"LineChart",data:p},{code:e(()=>[...n[6]||(n[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ComputedRef"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(g,{data:c}),l(v,{data:_})])}}});export{rs as __pageData,os as default};
