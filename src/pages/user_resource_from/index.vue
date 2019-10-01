<template>
  <view>
    <cu-custom bgcolor="bg-gradual-orange" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">引用资源</block>
    </cu-custom>
    <view class="bg-white radius shadow-lg container">
      <view class="text-center margin-bottom text-lg">ML TASK 中引用的第三方资源</view>
      <view
        class="margin-bottom info-text"
      >在小程序中使用的第三方资源如下，非常感谢，侵删。非常感谢开源贡献者，前人种树后人乘凉，特此将该小程序（ML 日常管理）开源。</view>
      <view class="text-content">
        <view class="cu-list menu sm-border card-menu margin-top">
          <view class="cu-item" @click="copyUrl('colorui')">
            <view class="content" hover-class="none">
              <text class="cuIcon-tagfill text-orange"></text>
              <text class="text-grey">ColorUI</text>
            </view>
            <view class="action">
              <text class="text-grey text-sm">https://github.com/weilanwl/ColorUI</text>
            </view>
          </view>
          <view class="cu-item" @click="copyUrl('undraw')">
            <view class="content" hover-class="none">
              <text class="cuIcon-tagfill text-orange"></text>
              <text class="text-grey">插画</text>
            </view>
            <view class="action">
              <text class="text-grey text-sm">https://undraw.co/</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {},
  mounted() {},
  methods: {
    copyUrl(name) {
      let url = "";
      switch (name) {
        case "colorui":
          url = "https://github.com/weilanwl/ColorUI";
          break;
        case "undraw":
          url = "https://undraw.co/";
          break;
        default:
          break;
      }
      wx.setClipboardData({ data: url });
    }
  }
};
</script>
<style scoped>
.cu-list.card-menu {
  margin-left: 0;
  margin-right: 0;
}
.cu-list.menu > .cu-item {
  padding: 0;
}
.info-text {
  text-align: justify;
  text-indent: 2em;
}
</style>

