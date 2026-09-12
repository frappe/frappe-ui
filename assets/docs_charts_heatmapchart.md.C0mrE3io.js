import{_ as k}from"./chunks/PropsTable.6nEstcyM.js";import{_ as g}from"./chunks/SlotsTable.H8OiFYJg.js";import{_ as b}from"./chunks/EmitsTable.SpPidrGF.js";import"./chunks/theme.CydPBHY9.js";import{_ as f}from"./chunks/HeatmapChart.vue_vue_type_script_setup_true_lang.BQcWZzS3.js";import{I as w,ad as d,r as u,D as l,aE as h,ao as v,A as x,be as t,o as s,B as a}from"./chunks/framework.CK2aBVEu.js";import"./chunks/useChart.CKDUUSii.js";import"./chunks/tokens.r7Sdvmlm.js";import"./chunks/usePlotKeyboard.CAiqHl1V.js";import"./chunks/axisChartCommon.BkSmHd7l.js";import"./chunks/format.DT9YW6RO.js";import"./chunks/ChartContainer.vue_vue_type_script_setup_true_lang.C4eTr5ZS.js";import"./chunks/ChartTooltip.vue_vue_type_script_setup_true_lang.D4mKZYcI.js";import"./chunks/installLabelLayout.CSE4hXjS.js";import"./chunks/axisAlignTicks.BXLiksPW.js";import"./chunks/labelLayoutHelper.BB28TU2Y.js";import"./chunks/dataStackHelper.BVYmver6.js";import"./chunks/labelGuideHelper.BkpGRtC-.js";import"./chunks/createSeriesData.CT5Wtg2U.js";import"./chunks/VisualMapping.DznFoLhQ.js";const z={class:"h-72 w-full"},j=w({__name:"HeatmapDemand",setup(m){const i=["6am","8am","10am","12pm","2pm","4pm","6pm","8pm"],_=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],r=[[6,45,35,29,18,14,22,10],[6,47,36,30,18,15,23,10],[6,46,35,29,18,14,22,10],[7,48,37,31,19,15,23,11],[7,50,38,32,20,16,26,12],[2,12,48,55,28,21,22,9],[2,10,44,50,25,18,18,7]],o=[8,52,38,34,20,15,20,9],n=r.flatMap((e,p)=>e.map((c,y)=>({day:_[p],hour:i[y],deviation:Math.round((c-o[y])/o[y]*100)})));return(e,p)=>(d(),u("div",z,[l(h(f),{data:h(n),x:"hour",y:"day",value:"deviation",palette:"diverging",min:-60,max:60,format:c=>`${c>0?"+":""}${c}%`,title:"Demand vs typical week",subtitle:"Orders against the same hour's four-week average"},null,8,["data","format"])]))}}),C={class:"h-72 w-full"},S=w({__name:"HeatmapSignups",setup(m){const i=["Free","Pro","Team"],_=[[420,455,512,498,540,601],[86,92,104,118,131,147],[12,15,14,21,26,33]],r=i.flatMap((n,e)=>_[e].map((p,c)=>({plan:n,month:new Date(Date.UTC(2024,c,1)),signups:p}))),o=n=>n.toLocaleString("en-US",{month:"short",timeZone:"UTC"});return(n,e)=>(d(),u("div",C,[l(h(f),{data:h(r),x:"month",y:"plan",value:"signups","x-axis":{format:o},"show-data-labels":"",title:"Signups by plan",subtitle:"First half of 2024"},null,8,["data","x-axis"])]))}}),O={class:"h-72 w-full"},T=w({__name:"HeatmapTickets",setup(m){const i=["9am","11am","1pm","3pm","5pm","7pm"],_=["Mon","Tue","Wed","Thu","Fri"],r=[[34,48,29,41,26,11],[37,52,31,44,28,13],[35,55,33,46,27,12],[39,58,36,49,31,15],[30,43,25,38,22,9]],o=_.flatMap((n,e)=>i.map((p,c)=>({day:n,hour:p,tickets:r[e][c]})));return(n,e)=>(d(),u("div",O,[l(h(f),{data:h(o),x:"hour",y:"day",value:"tickets","show-data-labels":"",title:"Support load",subtitle:"Tickets opened by hour of the working week"},null,8,["data"])]))}}),J=JSON.parse('{"title":"HeatmapChart","description":"","frontmatter":{},"headers":[],"relativePath":"docs/charts/heatmapchart.md","filePath":"docs/charts/heatmapchart.md","lastUpdated":0}'),A={name:"docs/charts/heatmapchart.md"},Z=Object.assign(A,{setup(m){const i=[{name:"title",description:"Heads the card. Left out, the chart draws no header row at all.",required:!1,type:"string"},{name:"subtitle",description:"A second line under the title, e.g. the period the numbers cover.",required:!1,type:"string"},{name:"dir",description:"Forces layout direction; defaults to document.documentElement.dir",required:!1,type:"ChartDir"},{name:"loading",description:"Draws the placeholder in place of the plot, for data still on its way.",required:!1,type:"boolean"},{name:"error",description:`Puts the chart in its error state and prints this message under it. Data
the chart cannot draw shows the empty state, not this one.`,required:!1,type:"string | null"},{name:"data",description:"One row per cell.",required:!0,type:"Record<string, any>[]"},{name:"x",description:"Row key holding the column a cell sits in.",required:!0,type:"string"},{name:"y",description:"Row key holding the row a cell sits in.",required:!0,type:"string"},{name:"value",description:"Row key holding the magnitude the cell is colored by.",required:!0,type:"string"},{name:"min",description:"Bottom of the color scale. Defaults to the smallest value in the data.",required:!1,type:"number"},{name:"max",description:"Top of the color scale. Defaults to the largest value in the data.",required:!1,type:"number"},{name:"xAxis",description:"The columns of the grid: the axis under it, and the tooltip head.",required:!1,type:"HeatmapAxisOptions"},{name:"yAxis",description:"The rows of the grid: the axis beside it, and the tooltip head.",required:!1,type:"HeatmapAxisOptions"},{name:"showDataLabels",description:`Prints each cell's value inside it. A label that would collide with its
neighbour is dropped, so a grid too fine to carry numbers shows none.`,required:!1,type:"boolean"},{name:"format",description:"Prints every number the grid shows: the cells, the scale ends, the tooltip.",required:!1,type:"ChartValueFormatter"},{name:"palette",description:"Ramp cells are colored from. Defaults to `'sequential'`, which is what a\nmagnitude reads as; `'diverging'` is for signed data and centers on zero.",required:!1,type:"HeatmapPalette"},{name:"echartOptions",description:"Escape hatch: deep-merged into the echarts option the props built.",required:!1,type:"EchartOptionsOverride"}],_=[{name:"loading",description:"Replaces the whole placeholder, e.g. with a skeleton of the app's own.",type:"any"},{name:"error",description:"Replaces the message, e.g. to put a retry button beside it.",type:"{ error?: string | null | undefined; }"},{name:"empty",description:'Replaces the "no data" line, e.g. with a hint about the filters.',type:"any"},{name:"actions",description:"",type:"any"},{name:"tooltip",description:"Replaces the tooltip body. `items` holds the hovered cell alone, and\n`rows` the row behind it, so a body can read a column the grid never drew.",type:"ChartTooltipSlotProps"}],r=[{name:"select",description:`A cell was selected, by click or by Enter on the keyboard cursor. Carries
both its categories and the row behind it.`,type:"[event: HeatmapCellEvent]"}];return(o,n)=>{const e=v("ComponentPreview"),p=v("ClientOnly");return d(),u("div",null,[n[4]||(n[4]=x('<h1 id="heatmapchart" tabindex="-1">HeatmapChart <a class="header-anchor" href="#heatmapchart" aria-label="Permalink to “HeatmapChart”">​</a></h1><p>Magnitude across two dimensions, a cell per pair.</p><h2 id="values-in-cells" tabindex="-1">Values in cells <a class="header-anchor" href="#values-in-cells" aria-label="Permalink to “Values in cells”">​</a></h2><p><code>x</code>, <code>y</code> and <code>value</code> name a cell&#39;s column, row and magnitude, so the data is one row per cell. <code>showDataLabels</code> prints values inside the cells, dropping any label that would collide with its neighbour.</p>',4)),l(p,null,{default:t(()=>[l(e,{name:"Charts-HeatmapTickets","self-layout":""},{code:t(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"HeatmapChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," HOURS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"9am"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"11am"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"1pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"3pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"5pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"7pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," DAYS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"Mon"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Tue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Wed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Thu"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Fri"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// One row per cell: a grid is long data by construction.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," COUNTS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"34"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 48"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 29"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 41"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 26"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 11"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"37"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 52"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 31"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 44"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 28"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 13"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"35"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 55"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 33"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 46"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 27"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 12"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"39"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 58"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 36"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 49"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 31"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 15"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"30"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 43"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 25"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 38"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 22"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 9"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," tickets"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," DAYS"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"flatMap"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"day"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," dayIndex"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_i592pt"},"  HOURS"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"map"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"hour"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," hourIndex"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," ({")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    day"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    hour"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    tickets"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," COUNTS"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_11933w"},"dayIndex"),s("span",{class:"s_13ahmt"},"]["),s("span",{class:"s_11933w"},"hourIndex"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }))"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"HeatmapChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"tickets"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"hour"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"tickets"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      show-data-labels")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Support load"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Tickets opened by hour of the working week"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:t(()=>[l(T)]),_:1})]),_:1}),n[5]||(n[5]=s("h2",{id:"printing-the-categories",tabindex:"-1"},[a("Printing the categories "),s("a",{class:"header-anchor",href:"#printing-the-categories","aria-label":"Permalink to “Printing the categories”"},"​")],-1)),n[6]||(n[6]=s("p",null,[s("code",null,"xAxis.format"),a(" and "),s("code",null,"yAxis.format"),a(" print one cut each, on the axis and in the tooltip. Each is given the value the row carried rather than the string the category reads as, so a date column can read as "),s("code",null,"Mar"),a(".")],-1)),n[7]||(n[7]=s("p",null,[a("They change how a category prints, not what it is: two categories that print alike stay two cells, and "),s("code",null,"select"),a(" still names the raw value.")],-1)),l(p,null,{default:t(()=>[l(e,{name:"Charts-HeatmapSignups","self-layout":""},{code:t(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"HeatmapChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," PLANS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"Free"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Pro"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Team"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," COUNTS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"420"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 455"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 512"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 498"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 540"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 601"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"86"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 92"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 104"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 118"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 131"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 147"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"12"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 15"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 14"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 21"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 26"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 33"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// A real date column: the axis would otherwise print the whole timestamp.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," signups"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," PLANS"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"flatMap"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"plan"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," planIndex"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_40mev6"},"  COUNTS"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_11933w"},"planIndex"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"map"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"signups"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," month"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," ({")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    plan"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_2ekfrt"}," new"),s("span",{class:"s_indoxt"}," Date"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"Date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"UTC"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"2024"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_22m8k2"}," month"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 1"),s("span",{class:"s_13ahmt"},"))"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"    signups"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }))"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_indoxt"}," monthName"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"month"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  month"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"toLocaleString"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"en-US"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," month"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"short"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," timeZone"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"UTC"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," })")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"HeatmapChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"signups"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"month"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"plan"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"signups"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :x-axis"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ format: monthName }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      show-data-labels")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Signups by plan"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"First half of 2024"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:t(()=>[l(S)]),_:1})]),_:1}),n[8]||(n[8]=s("h2",{id:"signed-data",tabindex:"-1"},[a("Signed data "),s("a",{class:"header-anchor",href:"#signed-data","aria-label":"Permalink to “Signed data”"},"​")],-1)),n[9]||(n[9]=s("p",null,[a("Signed data reads on the "),s("code",null,"diverging"),a(" ramp, centered on zero. "),s("code",null,"min"),a(" and "),s("code",null,"max"),a(" pin the scale so the colors mean the same thing across reloads.")],-1)),l(p,null,{default:t(()=>[l(e,{name:"Charts-HeatmapDemand","self-layout":""},{code:t(()=>[...n[2]||(n[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"HeatmapChart"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui/charts"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," HOURS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"6am"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"8am"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"10am"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"12pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"2pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"4pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"6pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"8pm"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," DAYS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"Mon"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Tue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Wed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Thu"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Fri"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Sat"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Sun"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Orders placed in each hour of July, against the same hour's four-week average. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," ORDERS"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"6"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 45"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 35"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 29"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 18"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 14"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 22"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 10"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"6"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 47"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 36"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 30"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 18"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 15"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 23"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 10"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"6"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 46"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 35"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 29"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 18"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 14"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 22"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 10"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"7"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 48"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 37"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 31"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 19"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 15"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 23"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 11"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"7"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 50"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 38"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 32"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 20"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 16"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 26"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 12"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"2"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 12"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 48"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 55"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 28"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 21"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 22"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 9"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_40mev6"},"2"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 10"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 44"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 50"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 25"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 18"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 18"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," TYPICAL"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_40mev6"},"8"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 52"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 38"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 34"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 20"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 15"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 20"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 9"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Signed deviation, so the diverging ramp does the reading: quiet weekend")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// mornings cool, the brunch rush hot.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," ordersVsTypical"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," ORDERS"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"flatMap"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"row"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," day"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  row"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"map"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"orders"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," hour"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," ({")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    day"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," DAYS"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_11933w"},"day"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    hour"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," HOURS"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_11933w"},"hour"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    deviation"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_22m8k2"}," Math"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"round"),s("span",{class:"s_13ahmt"},"((("),s("span",{class:"s_22m8k2"},"orders"),s("span",{class:"s_2ekfrt"}," -"),s("span",{class:"s_40mev6"}," TYPICAL"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_11933w"},"hour"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_2ekfrt"}," /"),s("span",{class:"s_40mev6"}," TYPICAL"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_11933w"},"hour"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_2ekfrt"}," *"),s("span",{class:"s_40mev6"}," 100"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }))"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"h-72 w-full"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"HeatmapChart")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :data"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ordersVsTypical"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      x"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"hour"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      y"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      value"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"deviation"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      palette"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"diverging"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"-60"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"60"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"(value) => `${value > 0 ? '+' : ''}${value}%`"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Demand vs typical week"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      subtitle"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Orders against the same hour's four-week average"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:t(()=>[l(j)]),_:1})]),_:1}),n[10]||(n[10]=s("h2",{id:"api-reference",tabindex:"-1"},[a("API Reference "),s("a",{class:"header-anchor",href:"#api-reference","aria-label":"Permalink to “API Reference”"},"​")],-1)),l(k,{name:"HeatmapChart",data:i},{code:t(()=>[...n[3]||(n[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ComputedRef"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ECharts"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"echarts/core"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"TimeGrain"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"./format"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartDir"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"ltr"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"rtl"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** What an echarts-backed chart hands back through a template ref. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartExposed"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The echarts instance, once the plot has a size to initialise into. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  chart"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ECharts"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * What a chart hands `defineExpose`. Vue unwraps the computed on the way out,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * so what a caller reads is `ChartExposed`. Internal.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartExposedRefs"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  chart"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ECharts"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," undefined"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Deep-merged into the generated echarts option as a last-resort escape hatch.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Objects merge key by key; arrays replace. So `series: [...]` at chart level")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * throws away the generated series, data and colors included. To reach one")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * series key, use the per-series `echartOptions` on an axis chart.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `animationDuration` set here applies to the first draw only; every later")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * draw is instant.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Breaks the line into a dash. Defaults to a solid stroke. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dashed"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Marks every datapoint with a dot. Off by default — a clean line reads")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * better, and the dot for the hovered point appears anyway.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataPoints"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rounds the corners of the line instead of drawing straight segments. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  smooth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * A rule drawn across the plot at a fixed position: a target, a threshold, a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * budget, or the date something changed. An annotation rather than a series —")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * it has no legend entry, cannot be switched off, and is never in the tooltip.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** An end of a reference line, and a side of it. See `ReferenceLine.labelPlacement`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ReferenceLineLabelPlacement"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start-top"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start-bottom"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end-top"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end-bottom"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Printed on the line. Left out, the rule carries no text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Where the label sits, as an end of the rule and a side of it. Defaults to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `'end-top'`. Move it when the default lands on a mark or on another rule's")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * label. The ends are read in the direction of the axis the rule runs along,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * so an RTL chart swaps them. A rule drawn down the plot carries its label")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rotated, so its sides are the left and the right of it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  labelPlacement"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ReferenceLineLabelPlacement")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Defaults to the ink the axis labels are printed in, so it reads as furniture. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A chart of mixed marks spends those stops by mark rather than by series")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * order: see `resolveSeriesColors`.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Identity of the slice: the category value, or `OTHERS_KEY` for the tail. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'  /** The slice as it reads, i.e. the category value or "Others". */')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Share of the *visible* total, so a hidden slice changes what this reads. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Forces layout direction; defaults to document.documentElement.dir */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dir"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartDir")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One stage of the funnel, after coercion and percentage arithmetic. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelStage"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  index"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Identity of the stage: the category value as a string. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The stage as it should read; `(Blank)` where the category is empty. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Identity of the stage: the category value as a string. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The stage as it printed, i.e. `(Blank)` where the category is empty. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One cut of the grid. Both are category axes, so both read the same way. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," HeatmapAxisOptions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each category. Takes the value the row carried, not the string it")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * reads as: a date column arrives as a Date, and `Mar 2024` needs the value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Display only. Two categories printing alike stay two categories.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartCategoryFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The value each x category was first named by, keyed by the category. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xValues"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Map"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** As `xValues`, for the rows of the grid. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yValues"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Map"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** What the reading is measured against, printed as a muted ` / target` in the value's own formatting. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Change against the comparison period. Sign drives the arrow. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  delta"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Unit printed before the delta, e.g. `'$'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  deltaPrefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Unit printed after the delta, e.g. `'%'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  deltaSuffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** What the delta is measured against, e.g. `'vs last month'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  deltaCaption"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Flips the delta colors, for metrics like churn or cost. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  negativeIsBetter"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints the reading and the target: they are one measure, read against each other. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints the delta. It takes the absolute value: the arrow beside it carries the sign. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  deltaFormat"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The mark, from the set every other chart's `type` takes. `'area'` draws a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * line over a filled curve, `'line'` the stroke alone, and `'bar'` one bar")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * per reading. Defaults to `'area'`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  type"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartMark")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the sequential-palette blue the sparkline is drawn in. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  vertical"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Identity of the group the point belongs to, i.e. the grouping value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisTitlePlacement"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Left out by a `'context'` item: a swatch would claim a mark on the plot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  color"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  formattedValue"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Share of the total, printed after the value. Only part-to-whole charts set it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  percent"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `'series'` is a value the plot draws. `'context'` is a reading it does not:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * a `tooltipColumns` entry, or a funnel stage's conversion rate.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  kind"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"series"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"context"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * What every tooltip body reads: the `#tooltip` slot on every chart, and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `ChartTooltip`'s own default slot.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Heads the readings, e.g. the category the pointer is over. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** One entry per reading, in the order they should be read. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The rows behind the reading, so a body can read a column the plot never")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * drew. One row for a point, cell, band or stage; every grouped row for the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},`   * donut's "Others" slice; none for a sankey node, which stands for every row`)]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * through it rather than one.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rows"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartDatapointEvent"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Identity of the series the mark belongs to, i.e. the column it plots. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** A tooltip column may hold text, so its formatter takes either. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartTooltipFormatter"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," string")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Puts the chart in its error state and prints this message under it. Data")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the chart cannot draw shows the empty state, not this one.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Names what the axis measures. Reads as running text, never set on its")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * side.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Bottom of the scale. Defaults to a round number under the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Top of the scale. Defaults to a round number over the data. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints each tick label, and every value this axis carries elsewhere. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Escape hatch: deep-merged into this axis' echarts option. On a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `stacked: 'normalized'` chart the percent formatter wins over an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `axisLabel.formatter` set here.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints this series' value beside each of its marks, overriding the chart's")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * own `showDataLabels`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Groups series into separate stacks. Only read when `stacked` is on, and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * only by the marks that stack: bars stack with bars, areas with areas.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  stackName"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Breaks this series' line, for a projection or a comparison that should not")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * read as measured as the rest. Line and area series.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dashed"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Line and area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataPoints"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Line and area series. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  smooth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Escape hatch: deep-merged into this series' echarts option. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  echartOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," EchartOptionsOverride")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** One `tooltipColumns` entry. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ChartTooltipColumn"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row key. Also the label when none is given. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  name"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A column sits on no axis, so it takes no formatter from one. Left out, a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * number prints with the default grouping and text prints as it stands.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartTooltipFormatter")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints every series' value beside its marks. A `seriesConfig` entry")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * overrides it for one series, on or off.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Series the legend has switched off, by name. Bind it with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `v-model:hiddenSeries` to drive the legend from the app, or to keep what a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * reader hid across a reload. Left unbound, the legend owns it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  hiddenSeries"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Columns that reach the tooltip and nothing else: no mark, no legend entry,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * no palette slot, and no effect on the value axis. For context in another")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * unit, such as the count behind a rate. They print after the series rows,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the order given: a value in another unit cannot be ranked among them.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  tooltipColumns"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartTooltipColumn"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Slices the legend has switched off, by name. A slice is the donut's series,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * so this is the same `hiddenSeries` an axis chart takes. Bind it with")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `v-model:hiddenSeries` to drive the legend from the app. Left unbound, the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * legend owns it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  hiddenSeries"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each slice's name and share beside the ring, and drops the readout")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the middle. Off by default. The legend already names every slice and its")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * share, without the lines that tie a label back to its arc.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Caption under the total in the middle. Defaults to the `value` key. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  centerLabel"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `'half'` draws the ring as a semicircle; only the geometry changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  variant"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DonutVariant")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Prints the readout and the tooltip. The slice labels print shares. */")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The columns of the grid: the axis under it, and the tooltip head. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  xAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," HeatmapAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The rows of the grid: the axis beside it, and the tooltip head. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yAxis"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," HeatmapAxisOptions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each cell's value inside it. A label that would collide with its")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * neighbour is dropped, so a grid too fine to carry numbers shows none.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showDataLabels"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Flow runs top to bottom, in rows of nodes. Defaults to left to right. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  vertical"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prints each point's own name beside it, the way an axis series prints its")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * value. The `label` prop names the column those come from; without it there")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * is nothing to print, and a development build warns. A name that would")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * collide with its neighbour is dropped, so a dense cloud carries few.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** What the reading is measured against, printed as a muted ` / target` in the value's own formatting. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Change against the comparison period. Sign drives the arrow. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    delta"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Unit printed before the delta, e.g. `'$'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaPrefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Unit printed after the delta, e.g. `'%'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaSuffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** What the delta is measured against, e.g. `'vs last month'`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaCaption"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Flips the delta colors, for metrics like churn or cost. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    negativeIsBetter"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Prints the reading and the target: they are one measure, read against each other. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /** Prints the delta. It takes the absolute value: the arrow beside it carries the sign. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    deltaFormat"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ChartValueFormatter")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Title of the primary value axis. The container draws it above the plot")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rather than along the axis, where it would have to be turned sideways.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  yAxisTitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Title of the second value axis, drawn over the edge that axis sits on. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  y2AxisTitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Edge of the plot the value-axis titles head. Defaults to the top. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  axisTitlePlacement"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," AxisTitlePlacement")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * The rows behind the reading, handed to the slot so a body can read a column")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the plot never drew. Empty when the pointer is over an aggregate that")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * stands for no single row.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  rows"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"[]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The legend switched a series off or back on. Carries the new list. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"update:hiddenSeries"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"value"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A mark was selected, by click or by Enter on the keyboard cursor. Carries")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * the series it belongs to, its value, and the row behind it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," ChartDatapointEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," AxisChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `items` holds one entry per visible series at")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * the hovered category, biggest first. `rows` holds the data row behind")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * them, so a replacement body can read a column the chart never plotted.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The legend switched a slice off or back on. Carries the new list. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"update:hiddenSeries"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"value"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A slice was selected, by click or by Enter on the keyboard cursor. `name`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * identifies the slice and `label` is what it printed. The collapsed tail is")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * named `OTHERS_KEY` and carries every row it grouped, so a caller can drill")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * into it as well as into a named slice.")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      formattedValue"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      /** Only set while a slice is hovered. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      percent"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    })"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `items` holds the hovered slice alone. A named")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'     * slice carries one row, and the "Others" slice every row it collapsed.')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * A stage was selected, by click or by Enter on the keyboard cursor. Carries")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * its label, its value and the row behind it; the whole column is the hit")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * area, not just the shape it draws.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  select"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," FunnelStageEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," FunnelChartSlots"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," ChartActionsSlot"),s("span",{class:"s_2ekfrt"}," &")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_euu481"},"  ChartStateSlots"),s("span",{class:"s_2ekfrt"}," &"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `items` holds the stage's value and its two")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * conversion rates, which are `'context'` items; `rows` holds the row")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * behind the stage.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `items` holds the hovered cell alone, and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * `rows` the row behind it, so a body can read a column the grid never drew.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * Replaces the tooltip body. `items` holds the hovered band or node alone.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * A node's `rows` is empty: it stands for every row through it, not one.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," ScatterChartEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The legend switched a group off or back on. Carries the new list. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"update:hiddenSeries"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"value"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]]")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * its size when the chart draws one. `rows` holds the row behind the point,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     * so a body can read a column the plot never drew.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"     */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    tooltip"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  default"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," ChartTooltipSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," unknown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(g,{data:_}),l(b,{data:r})])}}});export{J as __pageData,Z as default};
