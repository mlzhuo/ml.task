<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{ pageTitle }}</block>
    </cu-custom>
    <view class="container">
      <view class="month-overview">
        <!-- <ve-histogram :data="monthOverviewChartData" ref="month-overview"></ve-histogram> -->
        <mpvue-echarts
          lazyLoad
          :echarts="echarts"
          :onInit="monthOverviewChartInit"
          ref="monthOverviewChart"
        />
      </view>
      <view class="cu-item shadow boxshadow" v-if="dateObj[yearMonth]">
        <view class="week-item">
          <view class="date-item">日</view>
          <view class="date-item">一</view>
          <view class="date-item">二</view>
          <view class="date-item">三</view>
          <view class="date-item">四</view>
          <view class="date-item">五</view>
          <view class="date-item">六</view>
        </view>
        <view
          class="week-item"
          v-for="(num, rowIndex) in dateObj[yearMonth].length > 35 ? 6 : 5"
          :key="rowIndex"
        >
          <view
            class="date-item"
            v-for="(date, culumIndex) in 7"
            :key="culumIndex"
          >
            <view
              class="date-item-today"
              :class="{'only-date': dateObj[yearMonth][rowIndex * 7 + date] &&!dateObj[yearMonth][rowIndex * 7 + date].step}"
              v-if="dateObj[yearMonth][rowIndex * 7 + date] &&!dateObj[yearMonth][rowIndex * 7 + date].step"
              >{{ dateObj[yearMonth][rowIndex * 7 + date].date }}</view
            >
            <view class="date-item-today" v-else>{{
              (dateObj[yearMonth][rowIndex * 7 + date] &&
                dateObj[yearMonth][rowIndex * 7 + date].step) || "-"
            }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import { formatYMD, formatTime, formatPunchDate } from "@/utils";
import * as echarts from "../../../static/js/echarts.min.js";
import mpvueEcharts from "mpvue-echarts";
import {
  GET_WERUN_DATA_YEAR,
  GET_WERUN_DATA_MONTH
} from "@/store/mutation-types";
let monthOverviewChart, monthOverviewChartOption;
export default {
  data() {
    return {
      pageTitle: "运动报告",
      yearData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      echarts,
      dateObj: {},
      yearMonth: "",
      detailData: []
    };
  },
  components: {
    mpvueEcharts
  },
  onShow() {
    const { year } = this.$root.$mp.query;
    this.pageTitle = `${year}年微信运动报告`;
    this.getYearData(year);
  },
  mounted() {},
  methods: {
    getYearData(year) {
      this.$store.dispatch(`tools/${GET_WERUN_DATA_YEAR}`, {
        year,
        onSuccess: this.getWeRunDataSuccess
      });
    },
    getMonthData(year, month) {
      this.$store.dispatch(`tools/${GET_WERUN_DATA_MONTH}`, {
        year,
        month,
        onSuccess: this.getWeRunMonthDataSuccess
      });
    },
    getWeRunDataSuccess(data) {
      data.forEach(v => {
        this.yearData[+v._id - 1] = v.step;
      });
      this.monthOverviewChartRender();
      this.isShowLoading = false;
      const index = this.yearData.findIndex(v => v > 0);
      const month = index + 1 > 10 ? index + 1 + "" : "0" + (index + 1);
      const { year } = this.$root.$mp.query;
      this.yearMonth = `${year}-${month}`;
    },
    getWeRunMonthDataSuccess(data) {
      const year = this.yearMonth.split("-")[0];
      const month = this.yearMonth.split("-")[1];
      const monthItem = formatPunchDate(
        `${year}-${month}-01`,
        formatYMD(new Date(year, month, 0))
      );
      data.forEach(v => {
        const { _id, step } = v;
        monthItem[`${year}-${month}`].find(v => v.date === _id).step = step;
      });
      this.dateObj = Object.assign({}, this.dateObj, monthItem);
    },
    monthOverviewChartInit(canvas, width, height) {
      monthOverviewChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(monthOverviewChart);
      monthOverviewChart.setOption(monthOverviewChartOption);
      this.chartItemClick();
      return monthOverviewChart;
    },
    getMonthOverviewChartOption() {
      const data = this.yearData.map(v => (v / 10000).toFixed(2));
      return {
        backgroundColor: "#00265f",
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12"
            ],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#063374",
                width: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#00c7ff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1,
            axisLabel: {
              formatter(value) {
                return value + "w";
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#00c7ff",
                width: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "#063374"
              }
            }
          }
        ],
        series: [
          {
            name: "万步",
            type: "bar",
            data,
            //barWidth: 50, //柱子宽度
            //barGap: 1, //柱子之间间距
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#00fcae"
                  },
                  {
                    offset: 1,
                    color: "#006388"
                  }
                ]),
                opacity: 1
              }
            }
          }
        ]
      };
    },
    monthOverviewChartRender() {
      monthOverviewChartOption = this.getMonthOverviewChartOption();
      this.$nextTick(() => {
        this.$refs.monthOverviewChart.init();
      });
    },
    chartItemClick() {
      monthOverviewChart.on("click", e => {
        const { name, data } = e;
        const { year } = this.$root.$mp.query;
        this.yearMonth = `${year}-${name}`;
      });
    }
  },
  watch: {
    yearMonth(newVal) {
      const year = newVal.split("-")[0];
      const month = newVal.split("-")[1];
      if (year && month) {
        this.getMonthData(year, month);
      }
    }
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data());
  }
};
</script>
<style scoped>
.month-overview {
  height: 150px;
}
.boxshadow {
  box-shadow: 0 0 10px #ddd;
  position: relative;
  padding-bottom: 10px;
  line-height: 33px;
  text-align: center;
  margin-top: 5px;
}
.week-item {
  width: 100%;
  display: flex;
  height: 35px;
}
.date-item {
  box-sizing: border-box;
  flex: 1;
  height: 35px;
  opacity: .7;
}
.only-date {
  font-size: 20px;
  font-weight: 700;
  opacity: .2;
}
</style>
