<template>
  <view>
    <view>
      <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">打卡详情</block>
      </cu-custom>
    </view>
    <view class="container">
      <view class="cu-card dynamic" v-for="(monthItem, yearMonth) in punchDate" :key="yearMonth">
        <view class="month-title margin-top-sm margin-bottom-xs">{{yearMonth}}</view>
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
          <view class="week-item" v-for="(num,rowIndex) in 5" :key="rowIndex">
            <view
              class="date-item"
              :class="{'not-in':!monthItem[rowIndex*7+culumIndex].isIn,'ml-success':punchHistory[yearMonth+'-'+monthItem[rowIndex*7+culumIndex].date],'ml-danger':punchHistory[yearMonth+'-'+monthItem[rowIndex*7+culumIndex].date]&&punchHistory[yearMonth+'-'+monthItem[rowIndex*7+culumIndex].date]==='no'}"
              v-for="(date, culumIndex) in 7"
              :key="culumIndex"
            >
              <view
                class="date-item-today bg-gradual-purple"
                v-if="yearMonth+'-'+monthItem[rowIndex*7+culumIndex].date === today"
              >{{monthItem[rowIndex*7+culumIndex].date}}</view>
              <view v-else>{{monthItem[rowIndex*7+culumIndex].date}}</view>
              <!-- <view v-else>{{monthItem[rowIndex*7+culumIndex].date}}</view> -->
              <!-- {{monthItem[rowIndex*7+culumIndex].date}} -->
            </view>
          </view>
        </view>
      </view>
      <view class="cu-tabbar-height"></view>
    </view>
  </view>
</template>

<script>
import { formatPunchDate, formatYMD } from "@/utils";
export default {
  data() {
    return {
      punch: {},
      punchDate: {},
      punchHistory: {},
      today: ""
    };
  },
  onShow() {
    this.today = formatYMD(new Date());
    this.punch = this.$store.state.tools.currentPunch;
    const { start_date, end_date, punchHistory } = this.punch;
    const dateObj = formatPunchDate(start_date, end_date);
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
  }
};
</script>

<style scoped>
.container {
  padding: 5px;
}
.boxshadow {
  box-shadow: 0 0 10px #ddd;
  position: relative;
  padding-bottom: 10px;
  line-height: 35px;
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
  color: #fff;
  display: block;
  margin: 0 auto;
}
.not-in {
  opacity: 0.2;
  color: black;
}
.month-title {
  padding-left: 16px;
}
</style>