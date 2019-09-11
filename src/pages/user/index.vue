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
        <br />
      </p>
    </view>
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow" @click="copyGithubUrl">
        <view class="content">
          <text class="cuIcon-github text-grey"></text>
          <text class="text-grey">GitHub</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">
            欢迎Star
            <text class="cuIcon-favorfill text-yellow"></text>
          </text>
        </view>
      </view>
      <view class="cu-item arrow">
        <navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
          <text class="cuIcon-tagfill text-green"></text>
          <text class="text-grey">更新日志</text>
        </navigator>
        <view class="action">
          <text class="text-grey text-sm">v{{version}}</text>
        </view>
      </view>
      <view class="cu-item arrow">
        <navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
          <text class="cuIcon-picfill text-orange"></text>
          <text class="text-grey">引用资源</text>
        </navigator>
      </view>
      <view class="cu-item arrow">
        <navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
          <text class="cuIcon-questionfill text-cyan"></text>
          <text class="text-grey">问题反馈</text>
        </navigator>
      </view>
      <view class="cu-item arrow">
        <navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
          <text class="cuIcon-discoverfill text-orange"></text>
          <text class="text-grey">关于</text>
        </navigator>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import { config } from "@/config";
export default {
  data() {
    return {
      logoUrl: "",
      version: "1.0.0"
    };
  },
  onShow() {
    this.logoUrl = config.fileURL + "/ml-task-logo.png";
    this.version = config.version;
  },
  methods: {
    copyGithubUrl() {
      wx.setClipboardData({ data: "https://github.com/mlzhuo/ml.task" });
    }
  }
};
</script>

<style scoped>
.top-view {
  height: 35%;
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
  top: 35%;
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
