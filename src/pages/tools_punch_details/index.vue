<template>
  <view>
    <view>
      <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">打卡详情</block>
      </cu-custom>
    </view>
    <view class="container">
      <!-- <scroll-view scroll-x class="bg-white nav text-center">
        <view
          class="cu-item"
          :class="index == tabIndex ? 'text-purple cur' : ''"
          v-for="(item, index) in tabs"
          :key="index"
          @tap="tabSelect"
          :data-id="index"
          >{{ item }}</view
        >
      </scroll-view> -->
      <view v-if="tabIndex === 0">
        <view
          class="cu-card dynamic"
          v-for="(monthItem, yearMonth) in punchDate"
          :key="yearMonth"
        >
          <view class="month-title margin-top-sm margin-bottom-xs">{{
            yearMonth
          }}</view>
          <view class="cu-item shadow boxshadow">
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
              v-for="(num, rowIndex) in monthItem.length > 35 ? 6 : 5"
              :key="rowIndex"
            >
              <view
                class="date-item"
                :class="{
                  'not-in': !monthItem[rowIndex * 7 + culumIndex].isIn,
                  'ml-success':
                    punchHistory[yearMonth + '-' + monthItem[rowIndex * 7 + culumIndex].date],
                  'ml-danger':
                    punchHistory[yearMonth +'-' +monthItem[rowIndex * 7 + culumIndex].date] &&
                    punchHistory[yearMonth +'-' +monthItem[rowIndex * 7 + culumIndex].date] === 'no'
                }"
                v-for="(date, culumIndex) in 7"
                :key="culumIndex"
                @click="showPunchTime( yearMonth + '-' + monthItem[rowIndex * 7 + culumIndex].date)"
              >
                <view
                  class="date-item-today bg-gradual-purple"
                  v-if="yearMonth +'-' +monthItem[rowIndex * 7 + culumIndex].date ===today"
                  >{{yearMonth +"-" +monthItem[rowIndex * 7 + culumIndex].date ===datePunchTime.date? datePunchTime.time: monthItem[rowIndex * 7 + culumIndex].date
                  }}</view
                >
                <view
                  v-else
                  :class="{
                    'date-item-today': true,
                    'date-item-today-check':yearMonth +'-' +monthItem[rowIndex * 7 + culumIndex].date ===datePunchTime.date
                  }"
                  >{{yearMonth +"-" +monthItem[rowIndex * 7 + culumIndex].date ===datePunchTime.date? datePunchTime.time: monthItem[rowIndex * 7 + culumIndex].date
                  }}</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="tabIndex === 1">
        <view class="cu-card dynamic">
          <view class="month-title margin-top-sm margin-bottom-xs">&nbsp;</view>
          <view class="cu-item shadow boxshadow point-chart">
            <mpvue-echarts
              lazyLoad
              :echarts="echarts"
              :onInit="ecScatterInit"
              ref="ecScatterChart"
            />
          </view>
        </view>
      </view>
      <view class="cu-tabbar-height"></view>
    </view>
  </view>
</template>

<script>
import { formatYMD, formatTime } from "@/utils";
import * as echarts from "../../../static/js/echarts.min.js";
import mpvueEcharts from "mpvue-echarts";
import ecStat from "echarts-stat";
let scatterChart;
export default {
  data() {
    return {
      punch: {},
      punchDate: {},
      punchHistory: {},
      today: "",
      datePunchTime: {},
      tabIndex: 0,
      tabs: ["记录", "统计"],
      echarts,
      ecScatterOption: null
    };
  },
  components: {
    mpvueEcharts
  },
  onShow() {
    this.tabIndex = 0;
    this.datePunchTime = {};
    this.today = formatYMD(new Date());
    this.punch = this.$store.state.tools.currentPunch;
    const { start_date, end_date, punchHistory } = this.punch;
    const dateObj = this.formatPunchDate(start_date, end_date);
    this.punchDate = dateObj;
    let allDates = [];
    Object.values(dateObj).forEach(v => {
      allDates = [...allDates, ...v];
    });
    const toTodayLen =
      (new Date().getTime() - new Date(start_date).getTime()) /
      (24 * 3600 * 1000);
    let punchHistoryCopy = { ...punchHistory };
    for (let i = 0; i < toTodayLen; i++) {
      const date = formatYMD(
        new Date(new Date(start_date).getTime() + i * 24 * 3600 * 1000)
      );
      punchHistoryCopy[date] = punchHistory[date] ? punchHistory[date] : "no";
    }
    this.punchHistory = punchHistoryCopy;
  },
  methods: {
    showPunchTime(date) {
      if (this.punchHistory[date] && this.punchHistory[date] !== "no") {
        this.datePunchTime = {
          date,
          time: formatTime(new Date(this.punchHistory[date]))
            .split(" ")[1]
            .slice(0, 5)
        };
      } else if (this.punchHistory[date] && this.punchHistory[date] === "no") {
        this.datePunchTime = {
          date,
          time: "😪"
        };
      }
    },
    tabSelect(e) {
      if (this.tabIndex === e.currentTarget.dataset.id) {
        return;
      }
      this.tabIndex = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      switch (e.currentTarget.dataset.id) {
        case 1:
          this.ecScatterRender();
          break;
        default:
          break;
      }
    },
    ecScatterInit(canvas, width, height) {
      scatterChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(scatterChart);
      scatterChart.setOption(this.ecScatterOption);
      return scatterChart;
    },
    getScatterOption() {
      let data = [];
      const punchHistory = this.punchHistory
      for (const key in punchHistory) {
        const value = punchHistory[key];
        const x = new Date(key).getTime();
        const y =
          value === "no"
            ? null
            : new Date(value).getHours() +
              +(new Date(value).getMinutes() / 60).toFixed(2);
        data.push([x, y]);
      }
      console.log(data);
      
      const myRegression = ecStat.regression("polynomial", data, 3);
      myRegression.points.sort(function(a, b) {
        return a[0] - b[0];
      });
      return {
        title: {
          text: "打卡时间分布",
          textStyle: {
            fontSize: 14,
            fontWeight: "bold"
          }
        },
        color: ["#b6a2de", "#ffb980"],
        xAxis: {
          type: "value",
          min: 'dataMin',
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: function(value, index) {
              var date = new Date(value);
              var texts = [date.getMonth() + 1, date.getDate()];
              if (index === 0) {
                texts.unshift(date.getYear());
              }
              return texts.join("/");
            }
          }
        },
        yAxis: {
          type: "value",
          min: 6,
          minInterval: 1,
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: function(value, index) {
              return value + ":00";
            }
          }
        },
        grid: {
          top: "18%",
          bottom: "2%",
          left: "2%",
          right: "8%",
          containLabel: true
        },
        series: [
          {
            name: "scatter",
            type: "scatter",
            label: {
              show: false
            },
            data: data
          },
          {
            name: "line",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: myRegression.points,
            markPoint: {
              itemStyle: {
                normal: {
                  color: "transparent"
                }
              },
              data: [
                {
                  coord: myRegression.points[myRegression.points.length - 1]
                }
              ]
            }
          }
        ]
      };
    },
    ecScatterRender() {
      this.ecScatterOption = this.getScatterOption();
      this.$nextTick(() => {
        this.$refs.ecScatterChart.init();
      });
    },
    formatPunchDate(startStr, endStr) {
      const start = startStr.split("-");
      const firstDate = new Date(`${start[0]}-${start[1]}-01`).getTime();
      const end = endStr.split("-");
      const lastDate = new Date(end[0], end[1], 0).getTime();
      let dateObj = {};
      let startWeek = {};
      const len = (lastDate - firstDate) / (24 * 3600 * 1000) + 1;
      for (let i = 0; i < len; i++) {
        const year =
          new Date(firstDate + i * 24 * 3600 * 1000).getFullYear() + "";
        let month = new Date(firstDate + i * 24 * 3600 * 1000).getMonth() + 1;
        month = month < 10 ? "0" + month : month + "";
        let date = new Date(firstDate + i * 24 * 3600 * 1000).getDate();
        date = date < 10 ? "0" + date : date + "";
        const time = new Date(`${year}-${month}-${date}`).getTime();
        const isIn =
          time <= new Date(endStr).getTime() &&
          time >= new Date(startStr).getTime();
        if (!dateObj[year + "-" + month]) {
          const week = new Date(`${year}-${month}-01`).getDay();
          startWeek[year + "-" + month] = week;
          dateObj[year + "-" + month] = [];
          dateObj[year + "-" + month].push({
            fullDate: `${year}-${month}-${date}`,
            date,
            isIn
          });
        } else {
          dateObj[year + "-" + month].push({
            fullDate: `${year}-${month}-${date}`,
            date,
            isIn
          });
        }
      }
      for (const key in startWeek) {
        const value = startWeek[key];
        let monthDateLen = dateObj[key].length;
        for (let i = 0; i < value; i++) {
          dateObj[key].unshift({});
        }
        monthDateLen = dateObj[key].length;
        let renderMonthDay = 35;
        if ((value === 5 || value === 6) && monthDateLen > 35) {
          renderMonthDay = 42;
        }
        const pushItemLen = renderMonthDay - monthDateLen;
        for (let i = 0; i < pushItemLen; i++) {
          dateObj[key].push({});
        }
      }
      return dateObj;
    }
  }
};
</script>

<style scoped>
.container {
  padding: 0 5px 5px;
}
.add-btn {
  padding-bottom: 0;
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
}
.date-item-today {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
.date-item-today-check {
  border: 1rpx solid #1cc88a;
}
.not-in {
  opacity: 0.2;
  color: black;
}
.month-title {
  padding-left: 16px;
}
.point-chart {
  height: 200px;
}
</style>
