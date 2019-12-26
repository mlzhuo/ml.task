<template>
  <view>
    <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{ pageTitle }}</block>
    </cu-custom>
    <view class="container"> </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import {
  GET_WERUN_DATA_YEAR,
  GET_WERUN_DATA_MONTH
} from "@/store/mutation-types";
export default {
  data() {
    return {
      pageTitle: "运动报告",
      yearData: []
    };
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
        onSuccess: this.getWeRunDataSuccess
      });
    },
    getWeRunDataSuccess(data) {
      this.yearData = data;
      this.isShowLoading = false;
    }
  }
};
</script>
<style scoped></style>
