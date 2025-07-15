import { ay as defineComponent, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode } from "./vendor-DoyARfCS.js";
import { A as AxisChart, D as DonutChart, F as FunnelChart, N as NumberChart } from "./NumberChart-G4-VkwnF.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-dSBWzZJZ.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Charts.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const salesData = [
      { month: /* @__PURE__ */ new Date("2021-01-01"), sales: 200, profit: 50, returns: 20 },
      { month: /* @__PURE__ */ new Date("2021-02-01"), sales: 300, profit: 80, returns: 25 },
      { month: /* @__PURE__ */ new Date("2021-03-01"), sales: 250, profit: 60, returns: 15 },
      { month: /* @__PURE__ */ new Date("2021-04-01"), sales: 350, profit: 90, returns: 30 },
      { month: /* @__PURE__ */ new Date("2021-05-01"), sales: 400, profit: 100, returns: 35 },
      { month: /* @__PURE__ */ new Date("2021-06-01"), sales: 300, profit: 80, returns: 25 },
      { month: /* @__PURE__ */ new Date("2021-07-01"), sales: 200, profit: 50, returns: 20 },
      { month: /* @__PURE__ */ new Date("2021-08-01"), sales: 300, profit: 80, returns: 25 },
      { month: /* @__PURE__ */ new Date("2021-09-01"), sales: 250, profit: 60, returns: 15 },
      { month: /* @__PURE__ */ new Date("2021-10-01"), sales: 350, profit: 90, returns: 30 },
      { month: /* @__PURE__ */ new Date("2021-11-01"), sales: 400, profit: 100, returns: 35 },
      { month: /* @__PURE__ */ new Date("2021-12-01"), sales: 300, profit: 80, returns: 25 }
    ];
    const productData = [
      { product: "iPhone", sales: 200 },
      { product: "iPad", sales: 300 },
      { product: "Macbook", sales: 250 },
      { product: "iMac", sales: 350 },
      { product: "Apple Watch", sales: 400 },
      { product: "AirPods", sales: 300 },
      { product: "HomePod", sales: 200 },
      { product: "Apple TV", sales: 300 },
      { product: "Beats", sales: 250 },
      { product: "Accessories", sales: 350 },
      { product: "Services", sales: 400 },
      { product: "Others", sales: 300 }
    ];
    const simpleConfig = {
      data: salesData,
      title: "Monthly Sales",
      subtitle: "Sales data for first half of the year",
      xAxis: {
        key: "month",
        type: "time",
        title: "Month",
        timeGrain: "month"
      },
      yAxis: {
        title: "Amount ($)",
        echartOptions: {
          min: 0,
          max: 800
        }
      },
      series: [{ name: "sales", type: "bar" }]
    };
    const stackedConfig = {
      data: salesData,
      title: "Sales, Profit, and Returns",
      subtitle: "Monthly breakdown",
      xAxis: {
        key: "month",
        type: "time",
        title: "Month",
        timeGrain: "month"
      },
      yAxis: {
        title: "Amount ($)"
      },
      stacked: true,
      series: [
        { name: "sales", type: "bar" },
        { name: "profit", type: "bar" },
        { name: "returns", type: "bar" }
      ]
    };
    const horizontalConfig = {
      data: productData,
      title: "Monthly Sales - Horizontal",
      subtitle: "Sales data presented horizontally",
      xAxis: {
        key: "product",
        title: "Product",
        type: "category"
      },
      yAxis: {
        title: "Sales ($)"
      },
      swapXY: true,
      series: [{ name: "sales", type: "bar" }]
    };
    const comboData = salesData.map((item) => ({
      ...item,
      growth_rate: item.sales > 0 ? item.profit / item.sales * 100 : 0
    }));
    const comboConfig = {
      data: comboData,
      title: "Sales and Growth Rate",
      subtitle: "Bar and line combination",
      xAxis: {
        key: "month",
        type: "time",
        title: "Month",
        timeGrain: "month"
      },
      yAxis: {
        title: "Amount ($)"
      },
      y2Axis: {
        title: "Growth Rate (%)"
      },
      series: [
        { name: "sales", type: "bar" },
        { name: "growth_rate", type: "line", axis: "y2" }
      ]
    };
    const areaConfig = {
      data: salesData,
      title: "Monthly Sales - Area Chart",
      subtitle: "Sales data for first half of the year",
      xAxis: {
        key: "month",
        type: "time",
        title: "Month",
        timeGrain: "month"
      },
      yAxis: {
        title: "Amount ($)"
      },
      stacked: true,
      series: [
        { name: "sales", type: "area" },
        { name: "profit", type: "area" },
        { name: "returns", type: "area" }
      ]
    };
    const donutConfig = {
      data: productData,
      title: "Product Sales Distribution",
      subtitle: "Sales distribution across products",
      categoryColumn: "product",
      valueColumn: "sales"
    };
    const numberChart1Config = {
      title: "Total Sales",
      value: 123456,
      prefix: "$",
      delta: 10,
      deltaSuffix: "% MoM",
      negativeIsBetter: false
    };
    const numberChart2Config = {
      title: "Total Expenses",
      value: 5682,
      prefix: "$",
      delta: -2,
      deltaSuffix: "% MoM",
      negativeIsBetter: true
    };
    const numberChart3Config = {
      title: "Total Profit",
      value: 123456 - 5682,
      prefix: "$",
      delta: 8,
      deltaSuffix: "% MoM",
      negativeIsBetter: false
    };
    const funnelConfig = {
      data: [
        { stage: "Stage 1", value: 100 },
        { stage: "Stage 2", value: 50 },
        { stage: "Stage 3", value: 30 },
        { stage: "Stage 4", value: 20 },
        { stage: "Stage 5", value: 10 }
      ],
      title: "Sales Funnel",
      subtitle: "Conversion rates at each stage",
      categoryColumn: "stage",
      valueColumn: "value"
    };
    const __returned__ = { salesData, productData, simpleConfig, stackedConfig, horizontalConfig, comboData, comboConfig, areaConfig, donutConfig, numberChart1Config, numberChart2Config, numberChart3Config, funnelConfig, AxisChart, DonutChart, FunnelChart, NumberChart };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex gap-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 800 } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Number Charts" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["NumberChart"], { config: $setup.numberChart1Config }),
            createVNode($setup["NumberChart"], { config: $setup.numberChart2Config }),
            createVNode($setup["NumberChart"], { config: $setup.numberChart3Config })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Simple Bar Chart" }, {
        default: withCtx(() => [
          createVNode($setup["AxisChart"], { config: $setup.simpleConfig })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Stacked Bar Chart" }, {
        default: withCtx(() => [
          createVNode($setup["AxisChart"], { config: $setup.stackedConfig })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Bar and Line Combo" }, {
        default: withCtx(() => [
          createVNode($setup["AxisChart"], { config: $setup.comboConfig })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Horizontal Bar Chart" }, {
        default: withCtx(() => [
          createVNode($setup["AxisChart"], { config: $setup.horizontalConfig })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Area Chart" }, {
        default: withCtx(() => [
          createVNode($setup["AxisChart"], { config: $setup.areaConfig })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Donut Chart" }, {
        default: withCtx(() => [
          createVNode($setup["DonutChart"], { config: $setup.donutConfig })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Funnel Chart" }, {
        default: withCtx(() => [
          createVNode($setup["FunnelChart"], { config: $setup.funnelConfig })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Charts/Charts.story.vue";
const Charts_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Charts/Charts.story.vue"]]);
export {
  Charts_story as default
};
