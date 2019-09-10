<template>
  <scroll-view scroll-y class="page">
    <cu-custom bgcolor="bg-gradual-purple" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">工具</block>
    </cu-custom>
    <view class="cu-card">
      <view
        class="cu-item bg-gradual-purple shadow-blur"
        @tap="toChild"
        :data-url="item.url"
        v-for="(item,index) in list"
        :key="index"
      >
        <image class="item-bg-img" :src="gender===2?item.female:item.male" />
        <view class="cardTitle">{{item.title}}</view>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
  </scroll-view>
</template>

<script>
import { config } from "@/config";
export default {
  data() {
    return {
      gender: 1,
      list: [
        {
          title: "打卡计划",
          male: "",
          female: "",
          url: ""
        },
        {
          title: "倒计时",
          male: "",
          female: "",
          url: ""
        }
      ]
    };
  },
  onShow() {
    const { gender } = this.$store.state.user.userInfo;
    this.gender = gender;
  },
  mounted() {
    const fileURL = config.fileURL;
    this.list.forEach(v => {
      let male, female;
      switch (v.title) {
        case "打卡计划":
          male = "/punch_m.svg";
          female = "/punch_f.svg";
          break;
        case "倒计时":
          male = "/countdown_m.svg";
          female = "/countdown_f.svg";
          break;
        default:
          break;
      }
      v.male = fileURL + male;
      v.female = fileURL + female;
    });
  },
  methods: {}
};
</script>

<style scoped>
.cardTitle {
  color: #fff;
  padding: 90rpx 60rpx;
  font-size: 40rpx;
  font-weight: 300;
  transform: skew(-10deg, 0deg);
  position: relative;
  text-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.3);
}

.cardTitle::before {
  content: "";
  position: absolute;
  width: 60rpx;
  height: 6rpx;
  border-radius: 20rpx;
  background-color: #fff;
  display: block;
  top: 60rpx;
  left: 50rpx;
  transform: skew(10deg, 0deg);
}

.cardTitle::after {
  content: "";
  position: absolute;
  width: 140rpx;
  border-radius: 6rpx;
  height: 24rpx;
  background-color: #fff;
  display: block;
  bottom: 76rpx;
  left: 90rpx;
  transform: skew(10deg, 0deg);
  opacity: 0.1;
}
.cu-item {
  position: relative;
}
.item-bg-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 25%;
}
</style>
