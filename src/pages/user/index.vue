<template>
  <view class="page">
    <cu-custom bgcolor="bg-gradual-orange" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">个人</block>
    </cu-custom>
    <view class="no-card top-view">
      <image :src="logoUrl" class="logo" />
      <p class="description">
        “ ML 日常管理是一个日常记录的小程序，记事，打卡，倒计时等，更多功能在路上。 ”
        <br />By：兰卓
      </p>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import { config } from "@/config";
export default {
  data() {
    return {
      logoUrl: ""
    };
  },
  onShow() {
    this.logoUrl = config.fileURL + "/ml-task-logo.png";
  },
  methods: {}
};
</script>

<style scoped>
.top-view {
  height: 40%;
  position: relative;
}
.top-view::after {
  content: "";
  height: 1px;
  width: 100%;
  background: #ddd;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scaleY(0.3);
  transform-origin: 50% 100%;
}
.logo {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.description {
  width: 80%;
  position: absolute;
  top: calc(40% + 60px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
</style>
