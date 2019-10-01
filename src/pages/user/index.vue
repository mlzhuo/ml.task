<template>
  <view>
    <view class="no-card top-view" :style="style">
      <image :src="logoUrl" class="logo" />
      <p class="description">
        “ ML 日常管理是一个日常记录的小程序，记事，打卡，倒计时等，更多功能在路上。 ”
        <br />
      </p>
    </view>
    <view class="cu-list menu sm-border card-menu margin-top">
      <view class="cu-item arrow" @click="copyUrl()">
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
      <navigator url="/pages/user_update_list/main" hover-class="none" class="cu-item arrow">
        <view class="content" hover-class="none">
          <text class="cuIcon-tagfill text-green"></text>
          <text class="text-grey">更新日志</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{version}}</text>
        </view>
      </navigator>
      <navigator url="/pages/user_resource_from/main" hover-class="none" class="cu-item arrow">
        <view class="content" hover-class="none">
          <text class="cuIcon-picfill text-orange"></text>
          <text class="text-grey">引用资源</text>
        </view>
      </navigator>
      <navigator url hover-class="none" class="cu-item arrow">
        <view class="content" hover-class="none">
          <text class="cuIcon-questionfill text-cyan"></text>
          <text class="text-grey">问题反馈</text>
        </view>
      </navigator>
      <navigator url hover-class="none" class="cu-item arrow">
        <view class="content" hover-class="none">
          <text class="cuIcon-discoverfill text-orange"></text>
          <text class="text-grey">关于</text>
        </view>
      </navigator>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import { GET_VERSIONS } from "@/store/mutation-types";
export default {
  data() {
    return {
      logoUrl: "/static/images/ml-task-logo.png",
      version: "",
      style: ""
    };
  },
  onShow() {
    this.style = `height:${this.windowHeight * 0.35}px`;
    // this.logoUrl =
    //   this.$store.state.miniapp.config.fileURL &&
    //   this.$store.state.miniapp.config.fileURL + "/ml-task-logo.png";
    const version = this.$store.state.miniapp.version;
    if (version) {
      this.version = "v" + version;
    } else {
      this.getVersions();
    }
  },
  onLoad() {
    this.style = `height:${this.windowHeight * 0.35}px`;
    // this.logoUrl =
    //   this.$store.state.miniapp.config.fileURL &&
    //   this.$store.state.miniapp.config.fileURL + "/ml-task-logo.png";
    const version = this.$store.state.miniapp.version;
    if (version) {
      this.version = "v" + version;
    } else {
      this.getVersions();
    }
  },
  methods: {
    getVersions() {
      this.$store.dispatch(`miniapp/${GET_VERSIONS}`, {
        onSuccess: this.getVersionSuccess
      });
    },
    getVersionSuccess() {
      this.version = "v" + this.$store.state.miniapp.version;
    },
    copyUrl() {
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
