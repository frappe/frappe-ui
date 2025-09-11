import { ay as defineComponent, az as ref, b1 as onMounted, cv as init, bU as onBeforeUnmount, bb as watch, aB as openBlock, aG as createElementBlock, b3 as withDirectives, by as vShow, aF as createBaseVNode, aN as toDisplayString, aK as Fragment, aW as computed, aC as createBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aR as normalizeClass, aH as createCommentVNode } from "./vendor-YPVfCc2u.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { d as debounce } from "./debounce-CRCtzhPg.js";
import { d as dayjs } from "./dayjs-BES6pJGH.js";
function formatLabel(name) {
  return name.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function formatValue(value, precision = 0, shorten = false) {
  if (isNaN(value)) return value.toString();
  let locale = "en-US";
  if (shorten) {
    let formatted = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: precision
    }).format(value);
    return formatted;
  } else {
    precision = precision || guessPrecision(value);
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value);
  }
}
function guessPrecision(number) {
  if (!number || isNaN(number)) return 0;
  const str = number.toString();
  const decimalIndex = str.indexOf(".");
  if (decimalIndex === -1) return 0;
  return Math.min(str.length - decimalIndex - 1, 2);
}
function formatDate(date, format, grain = "day") {
  if (!date) return "";
  if (grain) {
    const grainToFormat = {
      second: "MMMM D, YYYY h:mm:ss A",
      minute: "MMMM D, YYYY h:mm A",
      hour: "MMMM D, YYYY h:00 A",
      day: "MMMM D, YYYY",
      week: "MMM Do, YYYY",
      month: "MMMM, YYYY",
      year: "YYYY",
      quarter: "[Q]Q, YYYY"
    };
    format = grainToFormat[grain];
  }
  if (!format) {
    format = "MMM D, YY";
  }
  return dayjs(date).format(format);
}
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (!source || !isObject(target) || !isObject(source)) {
    return mergeDeep(target, ...sources);
  }
  let output = Object.assign({}, target);
  Object.keys(source).forEach((key) => {
    if (isObject(source[key])) {
      if (!(key in output)) {
        output[key] = source[key];
      } else {
        output[key] = mergeDeep(output[key], source[key]);
      }
    } else {
      output[key] = source[key];
    }
  });
  return mergeDeep(output, ...sources);
}
const PADDING_TOP = 0;
const PADDING_BOTTOM = 10;
const LEGEND_HEIGHT = 30;
const LEGEND_BOTTOM = 10;
const TITLE_HEIGHT = 20;
const SUBTITLE_HEIGHT = 18;
const TITLE_BOTTOM = 24;
function useEchartsOptions(config) {
  var _a;
  const title = config.title;
  const subtitle = config.subtitle;
  const hasTitle = title ? 1 : 0;
  const hasSubtitle = subtitle ? 1 : 0;
  config.xAxis.title ? 1 : 0;
  config.yAxis.title ? 1 : 0;
  ((_a = config.y2Axis) == null ? void 0 : _a.title) ? 1 : 0;
  const hasLegend = config.series.length > 1 ? 1 : 0;
  const xAxisOptions = getXAxisOptions(config);
  const yAxisOptions = getYAxisOptions(config);
  return {
    animation: true,
    animationDuration: 700,
    textStyle: { fontFamily: ["InterVar", "sans-serif"] },
    title: getTitleOptions(title, subtitle),
    color: config.colors,
    grid: {
      left: "1%",
      right: config.swapXY ? "2.5%" : "1.5%",
      top: PADDING_TOP + TITLE_HEIGHT * hasTitle + SUBTITLE_HEIGHT * hasSubtitle + TITLE_BOTTOM,
      bottom: PADDING_BOTTOM + LEGEND_HEIGHT * hasLegend,
      containLabel: true
    },
    xAxis: xAxisOptions,
    yAxis: yAxisOptions,
    series: [],
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: (params) => {
        if (Array.isArray(params)) {
          params = params.filter((p) => {
            var _a2;
            return ((_a2 = p.value) == null ? void 0 : _a2[1]) !== 0;
          }).sort((a, b) => {
            var _a2, _b;
            return ((_a2 = b.value) == null ? void 0 : _a2[1]) - ((_b = a.value) == null ? void 0 : _b[1]);
          });
        }
        if (!Array.isArray(params)) {
          const p = params;
          const value = config.swapXY ? p.value[0] : p.value[1];
          const formatted = isNaN(value) ? value : formatValue(value);
          return `
                <div class="flex items-center justify-between gap-5">
                  <div>${p.name}</div>
                  <div class="font-bold">${formatted}</div>
                </div>
              `;
        }
        if (Array.isArray(params)) {
          const t = params.map((p, idx) => {
            const xValue = config.swapXY ? p.value[1] : p.value[0];
            const yValue = config.swapXY ? p.value[0] : p.value[1];
            const formattedX = config.xAxis.type == "time" ? formatDate(xValue, void 0, config.xAxis.timeGrain) : xValue;
            const formattedY = isNaN(yValue) ? yValue : formatValue(yValue);
            return `
              <div class="flex flex-col">
                ${idx == 0 ? `<div>${formattedX}</div>` : ""}
                <div class="flex items-center justify-between gap-5">
                  <div class="flex gap-1 items-center">
                    ${p.marker}
                    <div>${formatLabel(p.seriesName)}:</div>
                  </div>
                  <div class="font-bold">${formattedY}</div>
                </div>
              </div>
            `;
          });
          return t.join("");
        }
      },
      confine: true,
      appendToBody: false,
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      show: hasLegend,
      type: "scroll",
      bottom: LEGEND_BOTTOM,
      orient: "horizontal",
      itemGap: 12,
      padding: [0, 25],
      formatter: function(name) {
        return formatLabel(name);
      },
      textStyle: {
        padding: [0, 0, 0, -5],
        color: "var(--ink-gray-8)"
      },
      icon: "circle",
      pageIcons: {
        horizontal: [
          "M 17 3 h 2 c 0.386 0 0.738 0.223 0.904 0.572 s 0.115 0.762 -0.13 1.062 L 11.292 15 l 8.482 10.367 c 0.245 0.299 0.295 0.712 0.13 1.062 S 19.386 27 19 27 h -2 c -0.3 0 -0.584 -0.135 -0.774 -0.367 l -9 -11 c -0.301 -0.369 -0.301 -0.898 0 -1.267 l 9 -11 C 16.416 3.135 16.7 3 17 3 Z",
          "M 12 27 h -2 c -0.386 0 -0.738 -0.223 -0.904 -0.572 s -0.115 -0.762 0.13 -1.062 L 17.708 15 L 9.226 4.633 c -0.245 -0.299 -0.295 -0.712 -0.13 -1.062 S 9.614 3 10 3 h 2 c 0.3 0 0.584 0.135 0.774 0.367 l 9 11 c 0.301 0.369 0.301 0.898 0 1.267 l -9 11 C 12.584 26.865 12.3 27 12 27 Z"
        ]
      },
      pageIconColor: "var(--ink-gray-6)",
      pageInactiveColor: "var(--ink-gray-4)",
      pageIconSize: 10,
      pageTextStyle: {
        color: "var(--ink-gray-6)"
      },
      animationDurationUpdate: 300
    }
  };
}
function getTitleOptions(title, subtitle) {
  return {
    top: "4px",
    left: "0.8%",
    text: title,
    subtext: subtitle,
    padding: 0,
    itemGap: -3,
    textStyle: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 24,
      color: "var(--ink-gray-8)"
    },
    subtextStyle: {
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 20,
      color: "var(--ink-gray-6)"
    }
  };
}
function getXAxisOptions(config) {
  const options = config.swapXY ? {
    show: true,
    type: "value",
    z: 2,
    scale: false,
    boundaryGap: false,
    position: "top",
    name: `${config.yAxis.title} →`,
    nameGap: 6,
    nameLocation: "end",
    nameTextStyle: {
      align: "right",
      verticalAlign: "bottom",
      padding: [0, 0, 26, 0],
      backgroundColor: "var(--surface-white)",
      borderColor: "var(--surface-white)",
      color: "var(--ink-gray-8)",
      borderWidth: 4
    },
    splitLine: {
      show: true,
      width: 1,
      lineStyle: {
        color: "var(--ink-gray-3)"
      }
    },
    axisLine: {
      show: false,
      onZero: false
    },
    axisTick: {
      show: false,
      alignWithLabel: true,
      formatter: function(value) {
        return formatValue(value, 1, true);
      }
    },
    axisLabel: {
      show: true,
      hideOverlap: true,
      margin: 8,
      formatter: function(value) {
        return formatValue(value, 1, true);
      }
    }
  } : {
    z: 2,
    type: config.xAxis.type,
    scale: true,
    splitLine: {
      show: false
    },
    axisLine: {
      show: true
    },
    axisTick: {
      show: false,
      alignWithLabel: true
    },
    axisLabel: {
      show: true,
      hideOverlap: true,
      showMaxLabel: config.xAxis.type === "category" || config.xAxis.type === "value",
      margin: 8
    }
  };
  return mergeDeep(options, config.swapXY ? config.yAxis.echartOptions : config.xAxis.echartOptions);
}
function getYAxisOptions(config) {
  var _a, _b, _c, _d, _e;
  let primaryYAxisOptions = config.swapXY ? {
    show: true,
    type: config.xAxis.type,
    z: 2,
    scale: true,
    inverse: "true",
    splitLine: {
      show: false
    },
    axisLine: {
      show: true
    },
    axisTick: {
      show: false,
      alignWithLabel: true
    },
    axisLabel: {
      show: true,
      hideOverlap: true,
      margin: 6
    }
  } : {
    show: true,
    type: "value",
    z: 2,
    scale: false,
    boundaryGap: ["0%", "1%"],
    name: `↑ ${config.yAxis.title}`,
    nameGap: 6,
    nameLocation: "end",
    nameTextStyle: {
      align: "left",
      verticalAlign: "top",
      padding: [0, 0, 0, -2],
      backgroundColor: "var(--surface-white)",
      borderColor: "var(--surface-white)",
      color: "var(--ink-gray-8)",
      borderWidth: 4
    },
    splitLine: {
      show: true,
      width: 1,
      lineStyle: {
        color: "var(--ink-gray-3)"
      }
    },
    axisLine: {
      show: false,
      onZero: false
    },
    axisTick: {
      show: false,
      alignWithLabel: true
    },
    axisLabel: {
      show: true,
      hideOverlap: true,
      margin: 8,
      formatter: function(value) {
        return formatValue(value, 1, true);
      }
    },
    min: config.yAxis.yMin,
    max: config.yAxis.yMax
  };
  primaryYAxisOptions = mergeDeep(
    primaryYAxisOptions,
    config.swapXY ? config.xAxis.echartOptions : config.yAxis.echartOptions
  );
  let secondaryYAxisOptions = {
    show: false,
    type: "value",
    z: 2,
    alignTicks: true,
    scale: false,
    boundaryGap: ["0%", "1%"],
    name: `${(_a = config.y2Axis) == null ? void 0 : _a.title} ↑`,
    nameLocation: "end",
    nameTextStyle: {
      align: "right",
      verticalAlign: "top",
      padding: [0, 5, 0, 0],
      backgroundColor: "var(--surface-white)",
      borderColor: "var(--surface-white)",
      color: "var(--ink-gray-8)"
    },
    nameGap: 6,
    splitLine: {
      show: true,
      width: 1,
      lineStyle: {
        color: "var(--ink-gray-3)"
      }
    },
    axisLine: {
      show: false,
      onZero: false
    },
    axisTick: {
      show: false,
      alignWithLabel: true
    },
    axisLabel: {
      show: true,
      hideOverlap: true,
      margin: 8,
      formatter: function(value) {
        return formatValue(value, 1, true);
      }
      // color: '#000',
    },
    min: (_b = config.y2Axis) == null ? void 0 : _b.yMin,
    max: (_c = config.y2Axis) == null ? void 0 : _c.yMax
  };
  secondaryYAxisOptions = mergeDeep(
    secondaryYAxisOptions,
    config.swapXY ? (_d = config.y2Axis) == null ? void 0 : _d.echartOptions : (_e = config.y2Axis) == null ? void 0 : _e.echartOptions
  );
  return config.swapXY ? [primaryYAxisOptions] : [primaryYAxisOptions, secondaryYAxisOptions];
}
function useAxisChartOptions(config) {
  const data = config.data || [];
  const baseOptions = useEchartsOptions(config);
  if (config.xAxis.type === "time" && config.swapXY) {
    throw new Error("Swap axes is not supported for time series data");
  }
  if (config.series.find((s) => s.axis === "y2" || s.type !== "bar") && config.swapXY) {
    throw new Error("Swap axes is not supported for non-bar series or y2 axis");
  }
  const swapXY = config.swapXY;
  const lastBarSeriesIdx = config.series.slice().reverse().findIndex((s) => s.type === "bar");
  const hasY2 = config.series.some((s) => s.axis === "y2");
  if (hasY2) {
    baseOptions.yAxis[1].show = true;
  }
  baseOptions.series = config.series.map((s, idx) => {
    let labelPosition = "top";
    if (s.type == "bar" && config.stacked) {
      labelPosition = idx == lastBarSeriesIdx ? "top" : "inside";
    }
    if (s.type == "bar" && swapXY) {
      labelPosition = "right";
    }
    const standardSeriesOptions = {
      type: s.type,
      name: s.name,
      data: data.map((row) => {
        let x, y;
        if (swapXY) {
          x = row[s.name];
          y = row[config.xAxis.key];
        } else {
          x = row[config.xAxis.key];
          y = row[s.name];
        }
        return [x, y];
      }),
      yAxisIndex: s.axis === "y2" ? 1 : 0,
      label: {
        show: s.showDataLabels,
        position: labelPosition,
        formatter: (params) => {
          var _a, _b;
          const _val = swapXY ? (_a = params.value) == null ? void 0 : _a[0] : (_b = params.value) == null ? void 0 : _b[1];
          return formatValue(_val, 1, true);
        },
        fontSize: 11
      },
      labelLayout: { hideOverlap: true },
      itemStyle: {
        color: s.color
      }
    };
    let seriesTypeOptions = {};
    if (s.type === "bar") {
      seriesTypeOptions = getBarSeriesOptions(config, s);
    }
    if (s.type === "line") {
      seriesTypeOptions = getLineSeriesOptions(config, s);
    }
    if (s.type === "area") {
      seriesTypeOptions = getAreaSeriesOptions(config, s);
    }
    return mergeDeep(standardSeriesOptions, seriesTypeOptions, s.echartOptions);
  });
  return mergeDeep(baseOptions, config.echartOptions);
}
function getBarSeriesOptions(config, series) {
  const roundedCorners = config.swapXY ? [0, 2, 2, 0] : [2, 2, 0, 0];
  const idx = config.series.findIndex((s) => s.name === series.name);
  const lastBarSeriesIdx = config.series.slice().reverse().findIndex((s) => s.type === "bar");
  const isLastBar = lastBarSeriesIdx === idx;
  return {
    stack: config.stacked ? "stack" : void 0,
    barMaxWidth: 60,
    itemStyle: {
      borderRadius: config.stacked ? isLastBar ? roundedCorners : 0 : roundedCorners
    }
  };
}
function getLineSeriesOptions(config, series) {
  const showSymbol = series.showDataPoints || series.showDataLabels;
  return {
    connectNulls: true,
    symbol: "circle",
    symbolSize: 7,
    showSymbol,
    emphasis: {},
    lineStyle: {
      width: series.lineWidth || 2,
      type: series.lineType
    }
  };
}
function getAreaSeriesOptions(config, series) {
  return {
    type: "line",
    showSymbol: series.showDataPoints,
    areaStyle: {
      color: series.color,
      opacity: series.fillOpacity || 0.5
    }
  };
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ECharts",
  props: {
    options: { type: null, required: true },
    events: { type: Object, required: false },
    error: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    let chart;
    const chartDiv = ref();
    onMounted(() => {
      var _a;
      if (!chartDiv.value) return;
      chart = init(chartDiv.value, "light", { renderer: "svg" });
      chart.setOption({ ...props.options }, true);
      if ((_a = props.events) == null ? void 0 : _a.click) {
        chart.on("click", props.events.click);
      }
      const resizeDebounce = debounce(() => {
        chart.resize({
          animation: {
            duration: 300
          }
        });
      }, 250);
      let resizeObserver = new ResizeObserver(resizeDebounce);
      setTimeout(() => resizeObserver.observe(chartDiv.value), 500);
      onBeforeUnmount(() => resizeObserver.unobserve(chartDiv.value));
    });
    watch(
      () => props.options,
      (newOptions) => {
        if (chart) {
          chart.setOption(newOptions, true);
        }
      },
      { deep: true }
    );
    const __returned__ = { props, get chart() {
      return chart;
    }, set chart(v) {
      chart = v;
    }, chartDiv };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = {
  ref: "chartDiv",
  class: "h-full w-full min-w-[300px] md:min-w-[400px] min-h-[300px] px-4 py-2"
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      withDirectives(createBaseVNode(
        "div",
        _hoisted_1$1,
        null,
        512
        /* NEED_PATCH */
      ), [
        [vShow, !$props.error]
      ]),
      withDirectives(createBaseVNode(
        "div",
        { class: "flex h-full w-full items-center justify-center text-center text-ink-red-3" },
        " Error: " + toDisplayString($props.error),
        513
        /* TEXT, NEED_PATCH */
      ), [
        [vShow, $props.error]
      ])
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main$4.__file = "src/components/Charts/ECharts.vue";
const ECharts = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Charts/ECharts.vue"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AxisChart",
  props: {
    config: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const error = ref("");
    const options = computed(() => {
      try {
        return useAxisChartOptions(props.config);
      } catch (e) {
        error.value = e.message;
        return {};
      }
    });
    const __returned__ = { props, error, options, ECharts };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["ECharts"], {
    options: $setup.options,
    error: $setup.error
  }, null, 8, ["options", "error"]);
}
_sfc_main$3.__file = "src/components/Charts/AxisChart.vue";
const AxisChart = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Charts/AxisChart.vue"]]);
function useDonutChartOptions(config) {
  let data = config.data || [];
  data = data.sort((a, b) => {
    const aValue = a[config.valueColumn];
    const bValue = b[config.valueColumn];
    if (aValue === bValue) {
      return 0;
    }
    return aValue > bValue ? -1 : 1;
  });
  const labels = data.map((row) => row[config.categoryColumn]);
  const values = data.map((row) => row[config.valueColumn]);
  const total = values.reduce((acc, value) => {
    return isNaN(value) ? acc : acc + value;
  }, 0);
  let radius = ["40%", "70%"];
  let center = ["50%", "48%"];
  if (config.subtitle) {
    radius = ["40%", "70%"];
    center = ["50%", "50%"];
  }
  if (config.showInlineLabels) {
    center = ["50%", "50%"];
  }
  let orient = "horizontal";
  let bottom = 0;
  let left = "center";
  let padding = [0, 10, 10, 10];
  return {
    animation: true,
    animationDuration: 700,
    color: config.colors,
    textStyle: { fontFamily: ["InterVar", "sans-serif"] },
    title: getTitleOptions(config.title, config.subtitle),
    dataset: {
      source: [
        [config.categoryColumn, config.valueColumn],
        ...data.map((r) => [r[config.categoryColumn], r[config.valueColumn]])
      ]
    },
    series: [
      {
        type: "pie",
        name: config.categoryColumn,
        center,
        radius,
        labelLine: {
          show: config.showInlineLabels,
          lineStyle: {
            width: 2
          },
          length: 10,
          length2: 20,
          smooth: true
        },
        label: {
          show: config.showInlineLabels,
          formatter: ({ value, name }) => {
            const percentage = total > 0 ? value[1] / total * 100 : 0;
            return `${name} (${percentage.toFixed(0)}%)`;
          }
        },
        emphasis: { scaleSize: 5 }
      }
    ],
    legend: !config.showInlineLabels ? {
      // top,
      left,
      bottom,
      padding,
      orient,
      show: true,
      type: "scroll",
      itemGap: 12,
      formatter: function(name) {
        const labelIndex = labels.indexOf(name);
        const percentage = total > 0 ? values[labelIndex] / total * 100 : 0;
        return `${name} (${percentage.toFixed(0)}%)`;
      },
      textStyle: {
        padding: [0, 0, 0, -5],
        color: "var(--ink-gray-8)"
      },
      icon: "circle",
      pageIcons: {
        horizontal: [
          "M 17 3 h 2 c 0.386 0 0.738 0.223 0.904 0.572 s 0.115 0.762 -0.13 1.062 L 11.292 15 l 8.482 10.367 c 0.245 0.299 0.295 0.712 0.13 1.062 S 19.386 27 19 27 h -2 c -0.3 0 -0.584 -0.135 -0.774 -0.367 l -9 -11 c -0.301 -0.369 -0.301 -0.898 0 -1.267 l 9 -11 C 16.416 3.135 16.7 3 17 3 Z",
          "M 12 27 h -2 c -0.386 0 -0.738 -0.223 -0.904 -0.572 s -0.115 -0.762 0.13 -1.062 L 17.708 15 L 9.226 4.633 c -0.245 -0.299 -0.295 -0.712 -0.13 -1.062 S 9.614 3 10 3 h 2 c 0.3 0 0.584 0.135 0.774 0.367 l 9 11 c 0.301 0.369 0.301 0.898 0 1.267 l -9 11 C 12.584 26.865 12.3 27 12 27 Z"
        ]
      },
      pageIconColor: "var(--ink-gray-6)",
      pageInactiveColor: "var(--ink-gray-4)",
      pageIconSize: 10,
      pageTextStyle: {
        color: "var(--ink-gray-6)"
      },
      animationDurationUpdate: 300
    } : null,
    tooltip: {
      trigger: "item",
      confine: true,
      appendToBody: false,
      formatter: function(params) {
        const p = params;
        const value = p.value[1];
        const percentage = total > 0 ? value / total * 100 : 0;
        const formatted = isNaN(value) ? value : formatValue(value, 1, true);
        const formattedPercentage = percentage.toFixed(0);
        return `
          <div class="flex items-center justify-between gap-5">
            <div>${p.name}</div>
            <div class="font-bold">
              ${formatted} (${formattedPercentage}%)
            </div>
          </div>
        `;
      }
    }
  };
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DonutChart",
  props: {
    config: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const error = ref("");
    const options = computed(() => {
      try {
        return useDonutChartOptions(props.config);
      } catch (e) {
        error.value = e.message;
        return {};
      }
    });
    const __returned__ = { props, error, options, ECharts };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["ECharts"], {
    options: $setup.options,
    error: $setup.error
  }, null, 8, ["options", "error"]);
}
_sfc_main$2.__file = "src/components/Charts/DonutChart.vue";
const DonutChart = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Charts/DonutChart.vue"]]);
function getFunnelChartOptions(config) {
  let data = config.data || [];
  const hasSubtitle = config.subtitle ? 1 : 0;
  const labels = data.map((row) => row[config.categoryColumn]);
  const values = data.map((row) => row[config.valueColumn]);
  const total = values[0];
  const blueGradient = [
    "#2d87d6",
    "#4393da",
    "#589fdf",
    "#6dace3",
    "#83b8e7",
    "#98c4eb",
    "#c3dcf3",
    "#d8e9f7",
    "#edf5fc",
    "#ffffff"
  ];
  const colors = blueGradient;
  return {
    animation: true,
    animationDuration: 700,
    color: colors,
    textStyle: { fontFamily: ["InterVar", "sans-serif"] },
    title: getTitleOptions(config.title, config.subtitle),
    series: [
      {
        name: "Funnel",
        type: "funnel",
        orient: "vertical",
        funnelAlign: "center",
        top: PADDING_TOP + TITLE_HEIGHT + SUBTITLE_HEIGHT * hasSubtitle + TITLE_BOTTOM,
        left: "center",
        width: "60%",
        height: "75%",
        minSize: "10px",
        maxSize: "100%",
        sort: "descending",
        label: {
          show: true,
          position: "inside",
          lineHeight: 16,
          formatter: (params) => {
            const index = labels.indexOf(params.name);
            const value = formatValue(values[index], 1, true);
            if (!config.showPercentages) {
              return value;
            }
            const percentage = Number(values[index] / total * 100).toFixed(0);
            return `${value} (${percentage}%)`;
          }
        },
        labelLine: { show: false },
        gap: 6,
        data: values.map((value, index) => ({
          name: labels[index],
          value,
          itemStyle: {
            color: colors[index],
            borderColor: colors[index],
            borderWidth: 4,
            borderCap: "round",
            borderJoin: "round"
          },
          emphasis: {
            itemStyle: {
              color: colors[index],
              borderColor: colors[index],
              borderWidth: 6,
              borderCap: "round",
              borderJoin: "round"
            }
          }
        }))
      }
    ],
    tooltip: {
      trigger: "item",
      confine: true,
      appendToBody: false,
      formatter: function(params) {
        const p = params;
        const value = p.value;
        const percentage = total > 0 ? value / total * 100 : 0;
        const formatted = isNaN(value) ? value : formatValue(value, 1, true);
        const formattedPercentage = percentage.toFixed(0);
        return `
          <div class="flex items-center justify-between gap-5">
            <div>${p.name}</div>
            <div class="font-bold">
              ${formatted} (${formattedPercentage}%)
            </div>
          </div>
        `;
      }
    }
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FunnelChart",
  props: {
    config: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const error = ref("");
    const options = computed(() => {
      try {
        return getFunnelChartOptions(props.config);
      } catch (e) {
        error.value = e.message;
        return {};
      }
    });
    const __returned__ = { props, error, options, ECharts };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["ECharts"], {
    options: $setup.options,
    error: $setup.error
  }, null, 8, ["options", "error"]);
}
_sfc_main$1.__file = "src/components/Charts/FunnelChart.vue";
const FunnelChart = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Charts/FunnelChart.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NumberChart",
  props: {
    config: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { get formatValue() {
      return formatValue;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex w-full flex-col" };
const _hoisted_2 = { class: "truncate text-sm font-medium text-ink-gray-5" };
const _hoisted_3 = { class: "flex-1 flex-shrink-0 truncate text-[24px] text-ink-gray-6 font-semibold leading-10" };
const _hoisted_4 = { class: "" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["flex max-h-[140px] items-center gap-2 overflow-hidden bg-surface-white text-ink-gray-8 px-6 pt-5", $props.config.delta ? "pb-6" : "pb-3"])
    },
    [
      renderSlot(_ctx.$slots, "body", {}, () => [
        createBaseVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "title", {}, () => [
            createBaseVNode(
              "span",
              _hoisted_2,
              toDisplayString($props.config.title),
              1
              /* TEXT */
            )
          ]),
          renderSlot(_ctx.$slots, "subtitle", normalizeProps(guardReactiveProps({ formatValue: $setup.formatValue })), () => [
            createBaseVNode(
              "div",
              _hoisted_3,
              toDisplayString($props.config.prefix) + toDisplayString($setup.formatValue($props.config.value, 1, true)) + toDisplayString($props.config.suffix),
              1
              /* TEXT */
            )
          ]),
          renderSlot(_ctx.$slots, "delta", normalizeProps(guardReactiveProps({ formatValue: $setup.formatValue })), () => [
            $props.config.delta ? (openBlock(), createElementBlock(
              "div",
              {
                key: 0,
                class: normalizeClass(["flex items-center gap-0.5 text-xs font-medium", [
                  $props.config.negativeIsBetter ? $props.config.delta >= 0 ? "text-ink-red-4" : "text-ink-green-3" : $props.config.delta >= 0 ? "text-ink-green-3" : "text-ink-red-4"
                ]])
              },
              [
                createBaseVNode(
                  "span",
                  _hoisted_4,
                  toDisplayString($props.config.delta >= 0 ? "↑" : "↓"),
                  1
                  /* TEXT */
                ),
                createBaseVNode(
                  "span",
                  null,
                  toDisplayString($props.config.deltaPrefix) + toDisplayString($setup.formatValue($props.config.delta, 1, true)) + toDisplayString($props.config.deltaSuffix),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            )) : createCommentVNode("v-if", true)
          ])
        ])
      ])
    ],
    2
    /* CLASS */
  );
}
_sfc_main.__file = "src/components/Charts/NumberChart.vue";
const NumberChart = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Charts/NumberChart.vue"]]);
export {
  AxisChart as A,
  DonutChart as D,
  FunnelChart as F,
  NumberChart as N
};
